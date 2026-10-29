-- ============================================================================
-- troly_truong_khoi — Thùy 29/10, spec-truong-khoi.md §5 (P4): tab 🤖 Trợ lý cho trưởng khối = "Trang thu nhỏ".
--  · Phạm vi = fn_pham_vi_cua_toi() (môn × khối; quản lý môn = mọi khối của môn) — trước đây lọc theo KHỐI trần (sai §1.6: lớp Anh 8
--    lọt vào báo cáo Toán 8). troly_ca_nhan_khoi() đọc từ đó ⇒ quản lý môn cũng mở được tab.
--  · fn_troly_ca_nhan_lay: lớp = lớp (môn, khối) trong phạm vi (vá đúng 1 dòng của định nghĩa đang chạy).
--  · fn_troly_ca_nhan_tuan: học tập theo lớp 2 tuần gần nhất, lọc từ số Tổng kết tuần ĐÃ LƯU (troly_tuan_so_luu) — không tính lại.
-- ============================================================================

create or replace function public.troly_ca_nhan_khoi()
returns text[] language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(distinct p.khoi order by p.khoi), '{}') from public.fn_pham_vi_cua_toi() p
$$;

create or replace function public.fn_troly_ca_nhan_tuan()
returns jsonb language sql stable security definer set search_path = public as $$
  with lop_toi as (select l.id from lop l join public.fn_pham_vi_cua_toi() p on p.mon = l.mon and p.khoi = l.khoi),
  tuan as (select t.tuan, t.so, row_number() over (order by t.tuan desc) rn from troly_tuan_so_luu t order by t.tuan desc limit 2)
  select case when not public.la_thanh_vien() then null else jsonb_build_object(
    'tuan', (select tuan from tuan where rn = 1), 'tuan_truoc', (select tuan from tuan where rn = 2),
    'lop', coalesce((
      select jsonb_agg(jsonb_build_object(
        'lop_id', x->>'lop_id', 'ten_lop', x->>'ten_lop', 'mon', x->>'mon', 'khoi', l.khoi,
        'et_tb', x->'et_tb', 'et_so_luot', x->'et_so_luot', 'btvn_tb', x->'btvn_tb', 'btvn_so_luot', x->'btvn_so_luot',
        'et_tb_truoc', y->'et_tb', 'btvn_tb_truoc', y->'btvn_tb')
        order by x->>'mon', coalesce(substring(l.khoi from '^[0-9]+')::int, 0), l.khoi, x->>'ten_lop')
      from tuan t cross join jsonb_array_elements(t.so->'hoc_tap'->'lop') x
      join lop l on l.id = (x->>'lop_id')::uuid
      left join lateral (select y from tuan t2, jsonb_array_elements(t2.so->'hoc_tap'->'lop') y where t2.rn = 2 and y->>'lop_id' = x->>'lop_id') yy on true
      where t.rn = 1 and l.id in (select id from lop_toi)), '[]'::jsonb)
  ) end
$$;

-- fn_troly_ca_nhan_lay (dựng lại từ định nghĩa ĐANG CHẠY, chỉ đổi dòng lấy lớp):

-- fn_troly_ca_nhan_lay: from lop l where l.khoi = any (v_khoi);
CREATE OR REPLACE FUNCTION public.fn_troly_ca_nhan_lay(p_so_ngay integer DEFAULT 14)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_khoi text[] := public.troly_ca_nhan_khoi();
  v_lops text[];
  v jsonb;
  v_muc jsonb;
begin
  if cardinality(v_khoi) = 0 then
    raise exception 'Bạn chưa được gán khối quản lý nào.' using errcode = '42501';
  end if;

  select coalesce(array_agg(l.ten_lop), '{}') into v_lops from lop l join public.fn_pham_vi_cua_toi() p on p.mon = l.mon and p.khoi = l.khoi; -- 29/10: theo (môn × khối), không theo khối trần

  -- cho phép đọc/tính bản trung tâm thay mặt người dùng (cùng cơ chế "hệ tự tính" của troly_duoc_dung)
  perform set_config('troly.noi_bo', '1', true);
  v := public.fn_troly_bao_cao_lay(p_so_ngay, false);

  -- lọc từng mục: việc có doi_tuong = tên lớp hoặc "học sinh · tên lớp"
  select coalesce(jsonb_agg(m.j order by m.ord), '[]'::jsonb) into v_muc
  from (
    select mu.ord,
      (mu.m - 'viec' - 'canh_bao' - 'ti_le_nop' - 'cham' - 'miss' - 'xong_muon' - 'hs_khong_den')
      || jsonb_build_object(
        'cham',         (select count(*) from jsonb_array_elements(f.viec) x where x->>'loai' = 'cham'),
        'miss',         (select count(*) from jsonb_array_elements(f.viec) x where x->>'loai' = 'miss'),
        'xong_muon',    (select count(*) from jsonb_array_elements(f.viec) x where x->>'loai' = 'xong_muon'),
        'hs_khong_den', (select count(*) from jsonb_array_elements(f.viec) x where x->>'loai' = 'hs_khong_den'),
        'viec', f.viec,
        'canh_bao', '[]'::jsonb)
      || case when mu.m ? 'ti_le_nop' then jsonb_build_object('ti_le_nop', public._troly_ca_nhan_loc_nop(mu.m->'ti_le_nop', v_lops)) else '{}'::jsonb end
      as j
    from jsonb_array_elements(v->'muc') with ordinality mu(m, ord)
    cross join lateral (
      select coalesce(jsonb_agg(x), '[]'::jsonb) as viec
      from jsonb_array_elements(mu.m->'viec') x
      where split_part(x->>'doi_tuong', ' · ', 2) = any (v_lops)
         or x->>'doi_tuong' = any (v_lops)
    ) f
  ) m;

  return jsonb_build_object(
    'bo', 'ca_nhan', 'ten', 'Báo cáo của khối tôi quản lý',
    'khoi', to_jsonb(v_khoi), 'so_lop', cardinality(v_lops),
    'ghi_chu_bo', 'Lọc từ báo cáo Sư phạm toàn trung tâm theo lớp thuộc khối bạn quản lý. Cảnh báo bất thường chung chưa lọc được theo khối nên không hiện ở đây.',
    'tu', v->'tu', 'den', v->'den', 'so_ngay', v->'so_ngay', 'tao_luc', v->'tao_luc',
    'tong', jsonb_build_object(
      'cham',         (select coalesce(sum((m->>'cham')::int), 0) from jsonb_array_elements(v_muc) m),
      'miss',         (select coalesce(sum((m->>'miss')::int), 0) from jsonb_array_elements(v_muc) m),
      'xong_muon',    (select coalesce(sum((m->>'xong_muon')::int), 0) from jsonb_array_elements(v_muc) m),
      'hs_khong_den', (select coalesce(sum((m->>'hs_khong_den')::int), 0) from jsonb_array_elements(v_muc) m),
      'canh_bao', 0),
    'muc', v_muc,
    'canh_bao_chung', '[]'::jsonb,
    'theo_nguoi', (
      select coalesce(jsonb_agg(to_jsonb(g) order by g.cham + g.miss desc, g.phu_trach), '[]'::jsonb) from (
        select regexp_replace(p.nguoi, '\s*\(.*\)$', '') as phu_trach,
               count(*) filter (where x->>'loai' = 'cham')::int as cham,
               count(*) filter (where x->>'loai' = 'miss')::int as miss,
               count(*) filter (where x->>'loai' = 'xong_muon')::int as xong_muon
        from jsonb_array_elements(v_muc) m, jsonb_array_elements(m->'viec') x
        cross join lateral regexp_split_to_table(coalesce(x->>'phu_trach', ''), ', ') p(nguoi)
        where p.nguoi <> ''
        group by 1) g
      where g.cham + g.miss > 0),
    'cach_hieu', v->'cach_hieu',
    'luu', v->'luu'
  );
end $function$;

revoke execute on function public.fn_troly_ca_nhan_tuan() from public, anon;
grant execute on function public.fn_troly_ca_nhan_tuan() to authenticated;
