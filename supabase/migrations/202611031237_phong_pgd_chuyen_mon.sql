-- PHÒNG LÀM VIỆC PHÓ GIÁM ĐỐC CHUYÊN MÔN (Trang) — Thùy 03/11. Cùng khuôn phòng trưởng khối, phạm vi toàn hệ.
-- Ai vào chế độ này: người TOÀN HỆ của QLCL (_qlcl_toan_he: admin + ghế trưởng/phó team qlcl) — theo ghế, không theo uuid.
--   1. Nhân vật trong phòng = các TRƯỞNG KHỐI (phan_cong_quan_ly_khoi vai='truong'). Chỉ số = GỘP chỉ số TA trong các ô họ quản:
--      hiệu suất = trung bình hiệu suất tháng của các TA đã có số · việc / trễ / gậy = cộng. Bấm 1 trưởng khối ⇒ phòng của người đó.
--   2. Báo cáo Sư phạm lọc theo 1 ô (môn × khối) — Quản trị chọn khối thì thấy y như trưởng khối khối đó.
--
-- Một nguồn công thức: _phong_chi_so(p_ds) đếm chỉ số cho một danh sách TA; fn_phong_cap_duoi (đã có) chuyển sang gọi nó,
-- fn_phong_truong_khoi gộp trên nó. Báo cáo: thân fn_troly_ca_nhan_lay tách ra _troly_bc_theo_lop (cùng logic, chỉ nhận danh sách lớp),
-- fn_troly_ca_nhan_lay và fn_troly_o_lay đều gọi lõi đó. Thân fn_troly_ca_nhan_lay lấy từ bản ĐANG CHẠY (pg_get_functiondef 03/11).

-- ── 1. Chế độ phòng ──
create or replace function public.fn_phong_che_do()
 returns text
 language sql stable security definer set search_path to 'public'
as $$ select case when public._qlcl_toan_he() then 'pgd' else 'tk' end $$;

-- ── 2. Chỉ số cho một danh sách TA (MỘT nguồn đếm) ──
create or replace function public._phong_chi_so(p_ds uuid[])
 returns table(nhan_su_id uuid, hieu_suat numeric, hieu_suat_du boolean,
               viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 language plpgsql stable security definer set search_path to 'public'
as $$
#variable_conflict use_column
declare
  v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_thang date := date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh'))::date;
begin
  return query
  with ds as (select distinct unnest(p_ds) as nhan_su_id),
  hs as (select ds.nhan_su_id, h.tong_de_xuat, h.tong_du_3_dau_viec
           from ds cross join lateral public.fn_hsta_thang(v_hom_nay, ds.nhan_su_id) h),
  vi as (select ds.nhan_su_id,
                count(*) filter (where not w.la_ton)::int as tuan,
                count(*) filter (where w.trang_thai = 'dang_lam')::int as dl,
                count(*) filter (where w.trang_thai in ('xong', 'xong_tre'))::int as xg,
                count(*) filter (where w.trang_thai in ('xong_tre', 'qua_han'))::int as tr,
                count(*) filter (where w.trang_thai = 'qua_han')::int as qh
           from ds cross join lateral public._phong_viec_ta(ds.nhan_su_id) w
          group by ds.nhan_su_id),
  gy as (select g.nhan_su_id, g.con_lai::int as n
           from public.fn_gay_bang_khoang(v_thang, (v_thang + interval '1 month - 1 day')::date) g)
  select ds.nhan_su_id, hs.tong_de_xuat, coalesce(hs.tong_du_3_dau_viec, false),
         coalesce(vi.tuan, 0), coalesce(vi.dl, 0), coalesce(vi.xg, 0), coalesce(vi.tr, 0), coalesce(vi.qh, 0), coalesce(gy.n, 0)
    from ds
    left join hs on hs.nhan_su_id = ds.nhan_su_id
    left join vi on vi.nhan_su_id = ds.nhan_su_id
    left join gy on gy.nhan_su_id = ds.nhan_su_id;
end $$;

-- fn_phong_cap_duoi: giữ nguyên chữ ký + kết quả, chuyển sang đếm qua _phong_chi_so (bỏ bản đếm thứ hai).
create or replace function public.fn_phong_cap_duoi()
 returns table(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[],
               hieu_suat numeric, hieu_suat_du boolean,
               viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 language sql stable security definer set search_path to 'public'
as $$
  select n.id, n.ho_ten, n.anh_url, ds.khoi,
         c.hieu_suat, c.hieu_suat_du, c.viec_tuan, c.dang_lam, c.da_xong, c.tre_han, c.qua_han, c.gay_thang
    from public._phong_cap_duoi_ds() ds
    join nhan_su n on n.id = ds.nhan_su_id
    join public._phong_chi_so(array(select d.nhan_su_id from public._phong_cap_duoi_ds() d)) c on c.nhan_su_id = ds.nhan_su_id
   order by n.ho_ten
$$;

-- ── 3. TA của một trưởng khối (ô mà người đó là TRƯỞNG) ──
create or replace function public._phong_ta_cua_tk(p_tk uuid)
 returns table(nhan_su_id uuid, khoi text[])
 language sql stable security definer set search_path to 'public'
as $$
  select pc.nhan_su_id, array_agg(distinct l.khoi order by l.khoi)
    from phan_cong_quan_ly_khoi q
    join lop l on l.mon = q.mon and l.khoi = q.khoi and l.trang_thai = 'dang_hoc'
    join phan_cong_lop pc on pc.lop_id = l.id and pc.vai_tro = 'tg'
    join nhan_su n on n.id = pc.nhan_su_id and n.trang_thai = 'dang_lam' and not n.an_xep_hang
   where q.nhan_su_id = p_tk and q.vai = 'truong'
   group by pc.nhan_su_id
$$;

-- Phòng của một trưởng khối, xem từ phòng PGĐ (cùng hình dạng fn_phong_cap_duoi).
create or replace function public.fn_phong_cap_duoi_cua(p_tk uuid)
 returns table(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[],
               hieu_suat numeric, hieu_suat_du boolean,
               viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 language plpgsql stable security definer set search_path to 'public'
as $$
begin
  if not public._qlcl_toan_he() then raise exception 'Chỉ phòng Phó giám đốc chuyên môn xem được phòng của trưởng khối khác'; end if;
  return query
  select n.id, n.ho_ten, n.anh_url, ds.khoi,
         c.hieu_suat, c.hieu_suat_du, c.viec_tuan, c.dang_lam, c.da_xong, c.tre_han, c.qua_han, c.gay_thang
    from public._phong_ta_cua_tk(p_tk) ds
    join nhan_su n on n.id = ds.nhan_su_id
    join public._phong_chi_so(array(select d.nhan_su_id from public._phong_ta_cua_tk(p_tk) d)) c on c.nhan_su_id = ds.nhan_su_id
   order by n.ho_ten;
end $$;

-- ── 4. Các trưởng khối + chỉ số GỘP của TA trong ô họ quản ──
create or replace function public.fn_phong_truong_khoi()
 returns table(nhan_su_id uuid, ho_ten text, anh_url text, o text[], so_ta integer, so_ta_co_hs integer,
               hieu_suat numeric, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 language plpgsql stable security definer set search_path to 'public'
as $$
#variable_conflict use_column
begin
  if not public._qlcl_toan_he() then raise exception 'Chỉ phòng Phó giám đốc chuyên môn xem được'; end if;
  return query
  with tk as (
    select q.nhan_su_id,
           array_agg((case when q.mon = 'Toán' then '' else q.mon || ' ' end) || q.khoi
                     order by q.mon, coalesce(substring(q.khoi from '^[0-9]+')::int, 0), q.khoi) as o
      from phan_cong_quan_ly_khoi q
      join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
     where q.vai = 'truong'
     group by q.nhan_su_id
  ),
  ta_tk as (select tk.nhan_su_id as tk, t.nhan_su_id as ta from tk cross join lateral public._phong_ta_cua_tk(tk.nhan_su_id) t),
  cs as (select * from public._phong_chi_so(array(select distinct x.ta from ta_tk x)))
  select n.id, n.ho_ten, n.anh_url, tk.o,
         count(x.ta)::int,
         count(cs.hieu_suat)::int,
         round(avg(cs.hieu_suat), 1),
         coalesce(sum(cs.viec_tuan), 0)::int, coalesce(sum(cs.dang_lam), 0)::int, coalesce(sum(cs.da_xong), 0)::int,
         coalesce(sum(cs.tre_han), 0)::int, coalesce(sum(cs.qua_han), 0)::int, coalesce(sum(cs.gay_thang), 0)::int
    from tk
    join nhan_su n on n.id = tk.nhan_su_id
    left join ta_tk x on x.tk = tk.nhan_su_id
    left join cs on cs.nhan_su_id = x.ta
   group by n.id, n.ho_ten, n.anh_url, tk.o
   order by min(tk.o[1]), n.ho_ten;
end $$;

-- ── 5. Báo cáo Sư phạm theo danh sách lớp (lõi tách từ fn_troly_ca_nhan_lay) ──
create or replace function public._troly_bc_theo_lop(p_so_ngay integer, p_khoi text[], p_lops text[], p_ten text, p_ghi_chu text)
 returns jsonb
 language plpgsql security definer set search_path to 'public'
as $function$
declare
  v_lops text[] := coalesce(p_lops, '{}');
  v jsonb;
  v_muc jsonb;
begin
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
    'bo', 'ca_nhan', 'ten', p_ten,
    'khoi', to_jsonb(p_khoi), 'so_lop', cardinality(v_lops),
    'ghi_chu_bo', p_ghi_chu,
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

-- fn_troly_ca_nhan_lay: giữ chữ ký + kết quả, chỉ chuyển phần lọc sang lõi _troly_bc_theo_lop.
CREATE OR REPLACE FUNCTION public.fn_troly_ca_nhan_lay(p_so_ngay integer DEFAULT 14)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_khoi text[] := public.troly_ca_nhan_khoi();
  v_lops text[];
begin
  if cardinality(v_khoi) = 0 then
    raise exception 'Bạn chưa được gán khối quản lý nào.' using errcode = '42501';
  end if;

  select coalesce(array_agg(l.ten_lop), '{}') into v_lops from lop l join public.fn_pham_vi_cua_toi() p on p.mon = l.mon and p.khoi = l.khoi; -- 29/10: theo (môn × khối), không theo khối trần

  return public._troly_bc_theo_lop(p_so_ngay, v_khoi, v_lops, 'Báo cáo của khối tôi quản lý',
    'Lọc từ báo cáo Sư phạm toàn trung tâm theo lớp thuộc khối bạn quản lý. Cảnh báo bất thường chung chưa lọc được theo khối nên không hiện ở đây.');
end $function$;

-- Báo cáo Sư phạm của MỘT ô (môn × khối) — Quản trị ở phòng PGĐ chọn khối ⇒ thấy y như trưởng khối khối đó.
create or replace function public.fn_troly_o_lay(p_so_ngay integer, p_mon text, p_khoi text)
 returns jsonb
 language plpgsql security definer set search_path to 'public'
as $$
declare
  v_lops text[];
begin
  if not public._trong_pham_vi(p_mon, p_khoi) then raise exception 'Khối này ngoài phạm vi của bạn' using errcode = '42501'; end if;
  select coalesce(array_agg(l.ten_lop), '{}') into v_lops from lop l where l.mon = p_mon and l.khoi = p_khoi;
  return public._troly_bc_theo_lop(p_so_ngay, array[p_khoi], v_lops,
    'Báo cáo ' || (case when p_mon = 'Toán' then '' else p_mon || ' ' end) || 'khối ' || p_khoi,
    'Lọc từ báo cáo Sư phạm toàn trung tâm theo lớp của ô ' || p_mon || ' · khối ' || p_khoi || '. Cảnh báo bất thường chung chưa lọc được theo khối nên không hiện ở đây.');
end $$;

revoke execute on function public._phong_chi_so(uuid[]) from public, anon;
revoke execute on function public._phong_ta_cua_tk(uuid) from public, anon;
revoke execute on function public._troly_bc_theo_lop(integer, text[], text[], text, text) from public, anon, authenticated;
revoke execute on function public.fn_phong_che_do() from public, anon;
revoke execute on function public.fn_phong_cap_duoi_cua(uuid) from public, anon;
revoke execute on function public.fn_phong_truong_khoi() from public, anon;
revoke execute on function public.fn_troly_o_lay(integer, text, text) from public, anon;
grant execute on function public.fn_phong_che_do() to authenticated;
grant execute on function public.fn_phong_cap_duoi_cua(uuid) to authenticated;
grant execute on function public.fn_phong_truong_khoi() to authenticated;
grant execute on function public.fn_troly_o_lay(integer, text, text) to authenticated;
