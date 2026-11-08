-- ============================================================================
-- 202611031657 — phong_pham_vi_khoi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 03/11 — "trưởng khối chỉ nhìn thấy nhân sự và việc trong khối mình. TA A làm ở 2 khối 8 và 9
--   thì trưởng khối 8 chỉ thấy các việc khối 8 và TÍNH các việc khối 8 thôi."
--   Trước đây phòng chọn ĐÚNG người (TA có lớp trong khối) nhưng số của người đó là TOÀN BỘ: việc tuần, hiệu suất
--   tháng, gậy tháng đều gồm cả lớp khối khác.
--
-- CÁCH: thêm "phạm vi lớp" (uuid[] lớp; NULL = toàn bộ, đúng hành vi cũ) chạy dọc chuỗi tính của phòng:
--   _hsta_thang_core(ky, ns, lop[])  — thân fn_hsta_thang dời vào đây; fn_hsta_thang = core(…, NULL) ⇒ KHÔNG đổi số ở mọi màn khác.
--     Có phạm vi: BTVN/ET chỉ task của lớp trong phạm vi. TA còn task NGOÀI phạm vi trong tháng ⇒ số chốt tay (hsta_chot),
--     bổ trợ, ghi thêm là số CẢ NGƯỜI, không chia được theo khối ⇒ bỏ (chỉ còn BTVN/ET hệ thống của khối).
--     TA chỉ làm trong phạm vi ⇒ y hệt fn_hsta_thang.
--   _phong_viec_ta_pv(ns, lop[])     — việc tuần chỉ lớp trong phạm vi.
--   _phong_chi_so_pv(ds[], lop[])    — gậy tháng có phạm vi = gậy đã vào sổ gắn BUỔI của lớp trong phạm vi
--     (gậy không gắn buổi — vd task phát triển — không thuộc khối nào ⇒ không tính trong phòng khối).
--   Phạm vi lớp: _phong_lop_cua_toi() (trưởng khối) · _phong_lop_cua_tk(tk) · _phong_lop_cua_o(môn, khối) (trưởng bộ môn).
--   Hàm cũ giữ tên + chữ ký (create or replace, gọi bản _pv) ⇒ không drop gì.
--
-- MẤT GÌ: không xoá/drop gì. Viết lại: fn_hsta_thang (thân dời sang core, kết quả không đổi) · _phong_viec_ta · _phong_chi_so ·
--   fn_phong_cap_duoi · fn_phong_cap_duoi_cua · fn_phong_cap_duoi_o · fn_phong_ghe_tbm · fn_phong_cap_duoi_chi_tiet.
-- ============================================================================

-- ── Phạm vi lớp ──────────────────────────────────────────────────────────────
create or replace function public._phong_lop_cua_toi()
returns uuid[] language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(l.id), '{}') from lop l
   where l.trang_thai = 'dang_hoc' and l.khoi is not null and public._trong_pham_vi(l.mon, l.khoi)
$$;

create or replace function public._phong_lop_cua_tk(p_tk uuid)
returns uuid[] language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(distinct l.id), '{}')
    from phan_cong_quan_ly_khoi q
    join lop l on l.mon = q.mon and l.khoi = q.khoi and l.trang_thai = 'dang_hoc'
   where q.nhan_su_id = p_tk and q.vai = 'truong' and public._phong_trong_pham_vi(q.mon, q.khoi)
$$;

create or replace function public._phong_lop_cua_o(p_mon text, p_khoi text)
returns uuid[] language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(l.id), '{}') from lop l
   where l.mon = p_mon and l.khoi = p_khoi and l.trang_thai = 'dang_hoc' and public._phong_trong_pham_vi(p_mon, p_khoi)
$$;

-- ── Hiệu suất tháng có phạm vi ───────────────────────────────────────────────
create or replace function public._hsta_thang_core(p_ky date, p_ns uuid, p_lop uuid[])
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, btvn_so_task integer, btvn_so_tinh integer, btvn_de_xuat numeric, btvn_so_co integer, et_so_task integer, et_so_tinh integer, et_de_xuat numeric, et_so_co integer, bt_so_ca integer, bt_gio_he_thong numeric, bt_gio_ghi_them numeric, bt_chi_tieu_gio numeric, bt_so_co integer, tong_de_xuat numeric, tong_du_3_dau_viec boolean, chot jsonb, so_ghi_them integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
declare
  v_tu  date := date_trunc('month', p_ky)::date;
  v_den date := (date_trunc('month', p_ky) + interval '1 month - 1 day')::date;
begin
  if not (public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with tk_all as materialized (
    select x.*, coalesce(b.lop_id = any(p_lop), false) as trong
    from public.fn_hsta_task(v_tu, v_den, p_ns) x left join buoi_hoc b on b.id = x.buoi_id
  ),
  -- TA còn việc ngoài phạm vi ⇒ số cả-người (chốt, bổ trợ, ghi thêm) không chia được theo khối ⇒ không dùng
  ngoai as (select distinct a.nhan_su_id from tk_all a where p_lop is not null and not a.trong),
  tk as (select * from tk_all a where p_lop is null or a.trong),
  bt as (select * from public.fn_hsta_bo_tro(v_tu, v_den, p_ns) b where b.nhan_su_id not in (select n.nhan_su_id from ngoai n)),
  -- giờ bổ trợ tạm tính: HỢP các khoảng giờ hợp lệ có HS (gộp ca trùng khung — nhiều em chung 1 ca)
  bt_gio as (
    select r.nhan_su_id, sum(extract(epoch from (upper(m) - lower(m))) / 3600) as gio
    from (select bt.nhan_su_id, range_agg(tsrange(bt.ngay + bt.gio_bat_dau, bt.ngay + bt.gio_ket_thuc)) as mr
          from bt where bt.so_co_mat > 0 and bt.gio_ket_thuc > bt.gio_bat_dau
          group by bt.nhan_su_id) r
    cross join lateral unnest(r.mr) m
    group by r.nhan_su_id
  ),
  gt as (
    select g.nhan_su_id, count(*)::int as n, sum(g.so_gio) filter (where g.dau_viec = 'bo_tro') as gio
    from hsta_ghi_them g where g.ky = v_tu and g.xoa_at is null and (p_ns is null or g.nhan_su_id = p_ns)
      and g.nhan_su_id not in (select n.nhan_su_id from ngoai n)
    group by g.nhan_su_id
  ),
  ch as (
    select c.nhan_su_id, jsonb_object_agg(c.dau_viec, jsonb_build_object(
      'diem_chot', c.diem_chot, 'diem_he_thong', c.diem_he_thong, 'ghi_chu', c.ghi_chu,
      'nguoi_chot', n.ho_ten, 'chot_at', c.chot_at)) as j
    from hsta_chot c left join nhan_su n on n.id = c.nguoi_chot
    where c.ky = v_tu and (p_ns is null or c.nhan_su_id = p_ns)
      and c.nhan_su_id not in (select n2.nhan_su_id from ngoai n2)
    group by c.nhan_su_id
  ),
  ds as (
    select tk.nhan_su_id, tk.ho_ten from tk
    union select bt.nhan_su_id, bt.ho_ten from bt
    union select g.nhan_su_id, n.ho_ten from hsta_ghi_them g join nhan_su n on n.id = g.nhan_su_id
      where g.ky = v_tu and g.xoa_at is null and not n.an_xep_hang and (p_ns is null or g.nhan_su_id = p_ns)
        and g.nhan_su_id not in (select n3.nhan_su_id from ngoai n3)
  ),
  agg as (
    select ds.nhan_su_id, ds.ho_ten,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn')::int as b_n,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn' and tk.tinh)::int as b_t,
      (select round(avg(tk.diem), 1) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn' and tk.tinh) as b_d,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'btvn' and (cardinality(tk.co) > 0 or not tk.tinh))::int as b_c,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et')::int as e_n,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et' and tk.tinh)::int as e_t,
      (select round(avg(tk.diem), 1) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et' and tk.tinh) as e_d,
      (select count(*) from tk where tk.nhan_su_id = ds.nhan_su_id and tk.dau_viec = 'et' and (cardinality(tk.co) > 0 or not tk.tinh))::int as e_c,
      (select count(*) from bt where bt.nhan_su_id = ds.nhan_su_id and bt.so_co_mat > 0)::int as t_n,
      (select round(g.gio::numeric, 1) from bt_gio g where g.nhan_su_id = ds.nhan_su_id) as t_gio,
      (select count(*) from bt where bt.nhan_su_id = ds.nhan_su_id and cardinality(bt.co) > 0)::int as t_c
    from (select distinct * from ds) ds
  ),
  mix as (
    -- tổng đề xuất: mỗi đầu việc lấy số ĐÃ CHỐT nếu có, không thì số hệ thống; bổ trợ chỉ có khi đã chốt
    select a.*, ch.j, gt.n as gt_n, gt.gio as gt_gio,
      coalesce((ch.j -> 'btvn' ->> 'diem_chot')::numeric, a.b_d) as b_x,
      coalesce((ch.j -> 'et' ->> 'diem_chot')::numeric, a.e_d) as e_x,
      (ch.j -> 'bo_tro' ->> 'diem_chot')::numeric as t_x
    from agg a left join ch on ch.nhan_su_id = a.nhan_su_id left join gt on gt.nhan_su_id = a.nhan_su_id
  )
  select m.nhan_su_id, m.ho_ten,
    m.b_n, m.b_t, m.b_d, m.b_c,
    m.e_n, m.e_t, m.e_d, m.e_c,
    m.t_n, coalesce(m.t_gio, 0), coalesce(m.gt_gio, 0), public._hsta_chi_tieu_gio_bo_tro(), m.t_c,
    round((coalesce(m.b_x * public._hsta_ti_trong('btvn'), 0) + coalesce(m.e_x * public._hsta_ti_trong('et'), 0) + coalesce(m.t_x * public._hsta_ti_trong('bo_tro'), 0))
      / nullif((case when m.b_x is not null then public._hsta_ti_trong('btvn') else 0 end)
             + (case when m.e_x is not null then public._hsta_ti_trong('et') else 0 end)
             + (case when m.t_x is not null then public._hsta_ti_trong('bo_tro') else 0 end), 0), 1),
    (m.b_x is not null and m.e_x is not null and m.t_x is not null),
    coalesce(m.j, '{}'::jsonb), coalesce(m.gt_n, 0)
  from mix m
  order by m.ho_ten;
end $function$;

create or replace function public.fn_hsta_thang(p_ky date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, btvn_so_task integer, btvn_so_tinh integer, btvn_de_xuat numeric, btvn_so_co integer, et_so_task integer, et_so_tinh integer, et_de_xuat numeric, et_so_co integer, bt_so_ca integer, bt_gio_he_thong numeric, bt_gio_ghi_them numeric, bt_chi_tieu_gio numeric, bt_so_co integer, tong_de_xuat numeric, tong_du_3_dau_viec boolean, chot jsonb, so_ghi_them integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
begin
  if not (public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query select * from public._hsta_thang_core(p_ky, p_ns, null);
end $function$;

-- ── Việc tuần có phạm vi ─────────────────────────────────────────────────────
create or replace function public._phong_viec_ta_pv(p_ns uuid, p_lop uuid[])
 RETURNS TABLE(buoi_id uuid, ten_lop text, ngay date, tab text, han timestamp with time zone, dong_dau timestamp with time zone, trang_thai text, la_ton boolean)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  with moc as (
    select date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date as tu
  ),
  v as (
    select x.*, public._viec_dong_dau(x.buoi_id, x.tab, x.dong_at) as dd, x.ngay < m.tu as ton
      from moc m, public.fn_viec_buoi_thuong(m.tu - 30, m.tu + 6, true) x
     where x.nhan_su_id = p_ns and x.vai = 'tg' and x.tab in ('btvn', 'et') and not (x.tab = 'et' and x.et_online)
       and (p_lop is null or x.lop_id = any(p_lop))
  )
  select v.buoi_id, v.ten_lop, v.ngay, v.tab, v.han, v.dd,
         case when v.dd is null and (v.han is null or v.han >= now()) then 'dang_lam'
              when v.dd is null then 'qua_han'
              when v.han is not null and v.dd > v.han then 'xong_tre'
              else 'xong' end,
         v.ton
    from v
   where not v.ton or (v.dd is null and v.han < now())   -- buổi cũ chỉ lấy việc TỒN
$function$;

create or replace function public._phong_viec_ta(p_ns uuid)
 RETURNS TABLE(buoi_id uuid, ten_lop text, ngay date, tab text, han timestamp with time zone, dong_dau timestamp with time zone, trang_thai text, la_ton boolean)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$ select * from public._phong_viec_ta_pv(p_ns, null) $function$;

-- ── Gậy tháng có phạm vi (gậy gắn buổi của lớp trong phạm vi) ────────────────
create or replace function public._phong_gay_pv(p_ns uuid, p_lop uuid[])
 RETURNS TABLE(ten_loi text, so_gay integer, trang_thai text, ten_lop text, ngay date, ly_do text, tao_at timestamptz)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  with m as (select date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh'))::date as tu)
  select g.ten_loi, g.so_gay, g.trang_thai, g.ten_lop, coalesce(g.ngay_task, (g.tao_at at time zone 'Asia/Ho_Chi_Minh')::date), g.ly_do, g.tao_at
    from m cross join lateral public.fn_hsta_gay(m.tu, (m.tu + interval '1 month - 1 day')::date, p_ns) g
    left join buoi_hoc b on b.id = g.buoi_id
   where g.trang_thai <> 'da_thu_hoi'
     and (p_lop is null or b.lop_id = any(p_lop))
$function$;

-- ── Chỉ số 1 dòng / TA có phạm vi ────────────────────────────────────────────
create or replace function public._phong_chi_so_pv(p_ds uuid[], p_lop uuid[])
 RETURNS TABLE(nhan_su_id uuid, hieu_suat numeric, hieu_suat_du boolean, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare
  v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_thang date := date_trunc('month', (now() at time zone 'Asia/Ho_Chi_Minh'))::date;
begin
  return query
  with ds as (select distinct unnest(p_ds) as nhan_su_id),
  hs as (select ds.nhan_su_id, h.tong_de_xuat, h.tong_du_3_dau_viec
           from ds cross join lateral public._hsta_thang_core(v_hom_nay, ds.nhan_su_id, p_lop) h),
  vi as (select ds.nhan_su_id,
                count(*) filter (where not w.la_ton)::int as tuan,
                count(*) filter (where w.trang_thai = 'dang_lam')::int as dl,
                count(*) filter (where w.trang_thai in ('xong', 'xong_tre'))::int as xg,
                count(*) filter (where w.trang_thai in ('xong_tre', 'qua_han'))::int as tr,
                count(*) filter (where w.trang_thai = 'qua_han')::int as qh
           from ds cross join lateral public._phong_viec_ta_pv(ds.nhan_su_id, p_lop) w
          group by ds.nhan_su_id),
  -- không phạm vi: sổ gậy (còn lại sau gỡ) như cũ · có phạm vi: gậy đã vào sổ gắn buổi của lớp trong phạm vi
  gy as (select g.nhan_su_id, g.con_lai::int as n
           from public.fn_gay_bang_khoang(v_thang, (v_thang + interval '1 month - 1 day')::date) g
          where p_lop is null
         union all
         select ds.nhan_su_id, coalesce(sum(g.so_gay), 0)::int
           from ds cross join lateral public._phong_gay_pv(ds.nhan_su_id, p_lop) g
          where p_lop is not null and g.trang_thai = 'da_vao_so'
          group by ds.nhan_su_id)
  select ds.nhan_su_id, hs.tong_de_xuat, coalesce(hs.tong_du_3_dau_viec, false),
         coalesce(vi.tuan, 0), coalesce(vi.dl, 0), coalesce(vi.xg, 0), coalesce(vi.tr, 0), coalesce(vi.qh, 0), coalesce(gy.n, 0)
    from ds
    left join hs on hs.nhan_su_id = ds.nhan_su_id
    left join vi on vi.nhan_su_id = ds.nhan_su_id
    left join gy on gy.nhan_su_id = ds.nhan_su_id;
end $function$;

create or replace function public._phong_chi_so(p_ds uuid[])
 RETURNS TABLE(nhan_su_id uuid, hieu_suat numeric, hieu_suat_du boolean, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$ select * from public._phong_chi_so_pv(p_ds, null) $function$;

-- ── Màn: phòng trưởng khối ───────────────────────────────────────────────────
create or replace function public.fn_phong_cap_duoi()
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[], hieu_suat numeric, hieu_suat_du boolean, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  select n.id, n.ho_ten, n.anh_url, ds.khoi,
         c.hieu_suat, c.hieu_suat_du, c.viec_tuan, c.dang_lam, c.da_xong, c.tre_han, c.qua_han, c.gay_thang
    from public._phong_cap_duoi_ds() ds
    join nhan_su n on n.id = ds.nhan_su_id
    join public._phong_chi_so_pv(array(select d.nhan_su_id from public._phong_cap_duoi_ds() d), public._phong_lop_cua_toi()) c on c.nhan_su_id = ds.nhan_su_id
   order by n.ho_ten
$function$;

-- ── Màn: phòng trưởng bộ môn → phòng 1 trưởng khối / 1 ô trống ───────────────
create or replace function public.fn_phong_cap_duoi_cua(p_tk uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[], hieu_suat numeric, hieu_suat_du boolean, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn xem được phòng của trưởng khối khác'; end if;
  return query
  select n.id, n.ho_ten, n.anh_url, ds.khoi,
         c.hieu_suat, c.hieu_suat_du, c.viec_tuan, c.dang_lam, c.da_xong, c.tre_han, c.qua_han, c.gay_thang
    from public._phong_ta_cua_tk(p_tk) ds
    join nhan_su n on n.id = ds.nhan_su_id
    join public._phong_chi_so_pv(array(select d.nhan_su_id from public._phong_ta_cua_tk(p_tk) d), public._phong_lop_cua_tk(p_tk)) c on c.nhan_su_id = ds.nhan_su_id
   order by n.ho_ten;
end $function$;

create or replace function public.fn_phong_cap_duoi_o(p_mon text, p_khoi text)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[], hieu_suat numeric, hieu_suat_du boolean, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn xem được'; end if;
  return query
  select n.id, n.ho_ten, n.anh_url, ds.khoi,
         c.hieu_suat, c.hieu_suat_du, c.viec_tuan, c.dang_lam, c.da_xong, c.tre_han, c.qua_han, c.gay_thang
    from public._phong_ta_cua_o(p_mon, p_khoi) ds
    join nhan_su n on n.id = ds.nhan_su_id
    join public._phong_chi_so_pv(array(select d.nhan_su_id from public._phong_ta_cua_o(p_mon, p_khoi) d), public._phong_lop_cua_o(p_mon, p_khoi)) c on c.nhan_su_id = ds.nhan_su_id
   order by n.ho_ten;
end $function$;

-- Ghế trưởng bộ môn: mỗi ghế gộp TA của ghế, số mỗi TA chỉ tính lớp của ghế đó.
create or replace function public.fn_phong_ghe_tbm()
 RETURNS TABLE(khoa text, nhan_su_id uuid, ho_ten text, anh_url text, o text[], mon text, khoi text, so_ta integer, so_ta_co_hs integer, hieu_suat numeric, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
#variable_conflict use_column
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn xem được'; end if;
  return query
  with o_ds as (   -- ô của phòng = lớp đang học, đúng môn của phòng
    select distinct l.mon, l.khoi from lop l
     where l.trang_thai = 'dang_hoc' and l.khoi is not null and public._phong_trong_pham_vi(l.mon, l.khoi)
  ),
  ghe as (
    select 'tk:' || q.nhan_su_id as khoa, q.nhan_su_id, null::text as mon, null::text as khoi,
           array_agg((case when q.mon = 'Toán' then '' else q.mon || ' ' end) || q.khoi
                     order by q.mon, coalesce(substring(q.khoi from '^[0-9]+')::int, 0), q.khoi) as o,
           min(q.mon) as m_sx, min(coalesce(substring(q.khoi from '^[0-9]+')::int, 0)) as k_sx
      from phan_cong_quan_ly_khoi q
      join o_ds on o_ds.mon = q.mon and o_ds.khoi = q.khoi
      join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
     where q.vai = 'truong'
     group by q.nhan_su_id
    union all
    select 'o:' || o_ds.mon || '|' || o_ds.khoi, null, o_ds.mon, o_ds.khoi,
           array[(case when o_ds.mon = 'Toán' then '' else o_ds.mon || ' ' end) || o_ds.khoi],
           o_ds.mon, coalesce(substring(o_ds.khoi from '^[0-9]+')::int, 0)
      from o_ds
     where not exists (select 1 from phan_cong_quan_ly_khoi q
                        join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
                       where q.mon = o_ds.mon and q.khoi = o_ds.khoi and q.vai = 'truong')
  ),
  ta_ghe as (
    select g.khoa, t.nhan_su_id as ta from ghe g cross join lateral public._phong_ta_cua_tk(g.nhan_su_id) t where g.nhan_su_id is not null
    union all
    select g.khoa, t.nhan_su_id from ghe g cross join lateral public._phong_ta_cua_o(g.mon, g.khoi) t where g.nhan_su_id is null
  ),
  cs as (
    select g.khoa, c.* from ghe g
    cross join lateral public._phong_chi_so_pv(
      array(select x.ta from ta_ghe x where x.khoa = g.khoa),
      case when g.nhan_su_id is not null then public._phong_lop_cua_tk(g.nhan_su_id) else public._phong_lop_cua_o(g.mon, g.khoi) end) c
  )
  select g.khoa, g.nhan_su_id, n.ho_ten, n.anh_url, g.o, g.mon, g.khoi,
         count(x.ta)::int, count(cs.hieu_suat)::int, round(avg(cs.hieu_suat), 1),
         coalesce(sum(cs.viec_tuan), 0)::int, coalesce(sum(cs.dang_lam), 0)::int, coalesce(sum(cs.da_xong), 0)::int,
         coalesce(sum(cs.tre_han), 0)::int, coalesce(sum(cs.qua_han), 0)::int, coalesce(sum(cs.gay_thang), 0)::int
    from ghe g
    left join nhan_su n on n.id = g.nhan_su_id
    left join ta_ghe x on x.khoa = g.khoa
    left join cs on cs.khoa = x.khoa and cs.nhan_su_id = x.ta
   group by g.khoa, g.nhan_su_id, n.ho_ten, n.anh_url, g.o, g.mon, g.khoi, g.m_sx, g.k_sx
   order by g.m_sx, g.k_sx, g.khoa;
end $function$;

-- ── Chi tiết 1 TA có phạm vi ─────────────────────────────────────────────────
-- p_tk / (p_mon, p_khoi): trưởng bộ môn đang xem phòng của trưởng khối / ô trống ⇒ phạm vi = ghế đó.
-- Cả hai NULL ⇒ phạm vi = khối của chính người xem (phòng trưởng khối).
create or replace function public.fn_phong_cap_duoi_chi_tiet_pv(p_ns uuid, p_tk uuid default null, p_mon text default null, p_khoi text default null)
 RETURNS jsonb
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare
  v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_lop uuid[];
begin
  if not (public.co_chuc_nang('db_chatluong') or public._phong_la_cap_duoi(p_ns)) then
    raise exception 'Người này không phải cấp dưới của bạn';
  end if;
  if p_tk is not null or p_mon is not null then
    if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn xem được phòng của trưởng khối khác'; end if;
    v_lop := case when p_tk is not null then public._phong_lop_cua_tk(p_tk) else public._phong_lop_cua_o(p_mon, p_khoi) end;
  else
    v_lop := public._phong_lop_cua_toi();
  end if;
  return jsonb_build_object(
    'hieu_suat', (select to_jsonb(h) from public._hsta_thang_core(v_hom_nay, p_ns, v_lop) h limit 1),
    'viec', coalesce((select jsonb_agg(to_jsonb(w) order by w.ngay desc, w.tab) from public._phong_viec_ta_pv(p_ns, v_lop) w), '[]'::jsonb),
    'gay', coalesce((select jsonb_agg(jsonb_build_object('ten_loi', g.ten_loi, 'so_gay', g.so_gay, 'trang_thai', g.trang_thai,
                                                         'ten_lop', g.ten_lop, 'ngay', g.ngay, 'ly_do', g.ly_do) order by g.tao_at desc)
                       from public._phong_gay_pv(p_ns, v_lop) g), '[]'::jsonb)
  );
end $function$;

create or replace function public.fn_phong_cap_duoi_chi_tiet(p_ns uuid)
 RETURNS jsonb
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$ select public.fn_phong_cap_duoi_chi_tiet_pv(p_ns, null, null, null) $function$;

-- ── Quyền: hàm lõi không cho anon gọi ────────────────────────────────────────
revoke execute on function public._phong_lop_cua_toi() from public, anon;
revoke execute on function public._phong_lop_cua_tk(uuid) from public, anon;
revoke execute on function public._phong_lop_cua_o(text, text) from public, anon;
revoke execute on function public._hsta_thang_core(date, uuid, uuid[]) from public, anon;
revoke execute on function public._phong_viec_ta_pv(uuid, uuid[]) from public, anon;
revoke execute on function public._phong_gay_pv(uuid, uuid[]) from public, anon;
revoke execute on function public._phong_chi_so_pv(uuid[], uuid[]) from public, anon;
revoke execute on function public.fn_phong_cap_duoi_chi_tiet_pv(uuid, uuid, text, text) from public, anon;
grant execute on function public._phong_lop_cua_toi(), public._phong_lop_cua_tk(uuid), public._phong_lop_cua_o(text, text),
  public._hsta_thang_core(date, uuid, uuid[]), public._phong_viec_ta_pv(uuid, uuid[]), public._phong_gay_pv(uuid, uuid[]),
  public._phong_chi_so_pv(uuid[], uuid[]), public.fn_phong_cap_duoi_chi_tiet_pv(uuid, uuid, text, text) to authenticated;
