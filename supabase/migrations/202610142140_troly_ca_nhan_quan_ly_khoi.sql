-- TRỢ LÝ CÁ NHÂN theo KHỐI QUẢN LÝ (CEO 14/10): mỗi nhân sự fulltime Học thuật quản một số khối,
-- trợ lý hiện báo cáo Sư phạm CHỈ của các khối đó.
--
-- Thiết kế:
--  · Nguồn khối = cột vi_tri.khoi_quan_ly (sơ đồ tổ chức), KHÔNG đụng phan_cong_khoi.
--  · Luật đếm KHÔNG định nghĩa lại: đọc bản báo cáo trung tâm (`fn_troly_bao_cao_lay`, đã lưu DB) rồi lọc theo lớp thuộc khối.
--  · Khối lấy từ vi_tri.khoi_quan_ly của ghế người gọi (một nguồn với sơ đồ tổ chức).
--  · Người dùng KHÔNG truyền nhan_su_id: khối lấy từ current_nhan_su_id() (hàm definer, worker bypass RLS nên chặn ở hàm).
--  · Người dùng cá nhân không được "tính lại" (tránh đè bản trung tâm + quá 8 giây); chưa có bản hôm nay thì hàm tự tính 1 lần.

-- Khối quản lý nằm NGAY TRÊN GHẾ (vi_tri) — một nguồn với sơ đồ tổ chức: sơ đồ đúng thì trợ lý đúng.
--  · khoi_quan_ly: khối ghế này được xem báo cáo (trưởng khối: khối mình; phó khối: khối mình hỗ trợ).
--  · chi_xem: true = chỉ XEM + NHẮC + báo cáo lên trưởng khối, KHÔNG nằm trong cây giao việc/duyệt gậy
--    (phó khối là ghế ngang hàng TA, cùng cha là trưởng khối — xem scripts/so-do-tro-giang.mjs).
alter table vi_tri add column if not exists khoi_quan_ly text[] not null default '{}';
alter table vi_tri add column if not exists chi_xem boolean not null default false;

-- Khối của người đang đăng nhập = hợp khối ở mọi ghế của họ (rỗng = không dùng trợ lý cá nhân).
create or replace function troly_ca_nhan_khoi() returns text[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(distinct k order by k), '{}')
  from vi_tri v, unnest(v.khoi_quan_ly) k
  where v.nhan_su_id = public.current_nhan_su_id()
$$;

create or replace function troly_ca_nhan_duoc_dung() returns boolean
language sql stable security definer set search_path = public as $$
  select cardinality(public.troly_ca_nhan_khoi()) > 0
$$;

-- Báo cáo Sư phạm của các khối mình quản = báo cáo trung tâm đã lưu, lọc theo lớp thuộc khối.
create or replace function fn_troly_ca_nhan_lay(p_so_ngay int default 14)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_khoi text[] := public.troly_ca_nhan_khoi();
  v_lops text[];
  v jsonb;
  v_muc jsonb;
begin
  if cardinality(v_khoi) = 0 then
    raise exception 'Bạn chưa được gán khối quản lý nào.' using errcode = '42501';
  end if;

  select coalesce(array_agg(l.ten_lop), '{}') into v_lops from lop l where l.khoi = any (v_khoi);

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
end $$;

-- Lọc khối "tỉ lệ nộp BTVN" theo lớp thuộc khối; tính lại số gộp từ các lớp còn lại.
create or replace function _troly_ca_nhan_loc_nop(p jsonb, p_lops text[]) returns jsonb
language sql immutable as $$
  with l as (
    select x from jsonb_array_elements(coalesce(p->'lop', '[]'::jsonb)) x
    where x->>'ten_lop' = any (p_lops)
  ), s as (
    select count(*)::int so_lop,
           count(*) filter (where (x->>'duoi_nguong')::boolean)::int duoi,
           coalesce(sum((x->>'so_buoi')::int), 0)::int so_buoi,
           coalesce(sum((x->>'can_co')::int), 0)::int can_co,
           coalesce(sum((x->>'dat')::int), 0)::int dat,
           coalesce(sum((x->>'chua_nop')::int), 0)::int chua_nop,
           coalesce(sum((x->>'thieu_thong_tin')::int), 0)::int thieu
    from l
  )
  select (p - 'lop') || jsonb_build_object(
    'so_lop', s.so_lop, 'so_lop_duoi_nguong', s.duoi, 'so_buoi', s.so_buoi,
    'can_co', s.can_co, 'dat', s.dat, 'chua_nop', s.chua_nop, 'thieu_thong_tin', s.thieu,
    'ti_le_pct', case when s.can_co > 0 then round(100.0 * s.dat / s.can_co, 1) end,
    'lop', coalesce((select jsonb_agg(x) from l), '[]'::jsonb))
  from s
$$;

revoke execute on function troly_ca_nhan_khoi(), troly_ca_nhan_duoc_dung(), fn_troly_ca_nhan_lay(int),
  _troly_ca_nhan_loc_nop(jsonb, text[]) from public, anon;
grant execute on function troly_ca_nhan_khoi(), troly_ca_nhan_duoc_dung(), fn_troly_ca_nhan_lay(int) to authenticated;
