-- ĐIỂM THẬT của MT / khảo sát (Thùy 11/11: "có trường hợp điểm vượt quá 10 và tính 9.75, t vẫn muốn có thêm 1 ô ghi điểm thật
-- kiểu 10.25 để so sánh xem ai nhất khối"). Điểm chính GIỮ NGUYÊN luật cũ (fn_diem_thi_tinh: Cơ bản + Nâng cao ≥ 10 ⇒ 9.75, tích
-- Full ⇒ 10) — Level / xu / hạng vẫn theo điểm đó. Thêm:
--   · diem_thi.diem_that = Cơ bản + Nâng cao KHÔNG chặn trần (cột sinh từ chính dòng — §2.0; không có CB/NC ⇒ để trống, vd điểm
--     nhập tay chỉ có tổng);
--   · fn_mt_cham_hs_v2 trả thêm diem_that (màn Chấm MT - Khảo sát);
--   · fn_bxh_diem_mt_khoi / fn_bxh_diem_ks_khoi trả thêm tb_that (TB điểm thật, dòng thiếu điểm thật dùng điểm chính). HẠNG GIỮ
--     NGUYÊN theo điểm chính (thành tựu/xu đọc hạng này); trong cùng hạng, em điểm thật cao hơn xếp trên.
-- Cột mới thêm ở CUỐI kết quả; người gọi (fn_mt_cham_hs, fn_ks_ds_ky, fn_ks_diem_thang, _bxh_gia_tri) chọn theo tên ⇒ không ảnh hưởng.
alter table public.diem_thi add column if not exists diem_that numeric generated always as (
  case when diem_co_ban is null and diem_nang_cao is null then null
       else round(coalesce(diem_co_ban, 0) + coalesce(diem_nang_cao, 0), 2) end) stored;

drop function if exists public.fn_mt_cham_hs_v2(uuid);
CREATE OR REPLACE FUNCTION public.fn_mt_cham_hs_v2(p_buoi uuid)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, diem_danh text, so_cau integer, so_cham integer, so_thieu_diem integer, tinh_co_ban numeric, tinh_nang_cao numeric, khung_co_ban numeric, khung_nang_cao numeric, nguon text, diem_co_ban numeric, diem_nang_cao numeric, diem numeric, full_diem boolean, tl_co_ban numeric, tl_nang_cao numeric, full_thi_lai boolean, diem_thi_lai numeric, lop_id uuid, ten_lop text, diem_that numeric)
 LANGUAGE sql
 STABLE
AS $function$
  with bu as (
    select b.id, b.loai, coalesce(l.mon, d.mon) as mon, d.khoi as de_khoi
      from buoi_hoc b left join lop l on l.id = b.lop_id left join tai_lieu d on d.id = b.de_id where b.id = p_buoi
  ),
  ky as (select id, khung_co_ban, khung_nang_cao from ky_thi
          where buoi_hoc_id = p_buoi and loai in ('mt_sat_hach', 'khao_sat_thang') order by created_at limit 1),
  hs as (
    select h.hoc_sinh_id, h.diem_danh from buoi_hoc_hs h where h.buoi_hoc_id = p_buoi and h.diem_danh = 'co_mat'
    union
    -- Kỳ khảo sát chung: mọi HS đang học môn đó ở khối của đề (CEO 23/10).
    select hl.hoc_sinh_id, null::text from bu
      join lop l on l.mon = bu.mon and l.khoi = bu.de_khoi
      join hoc_sinh_lop hl on hl.lop_id = l.id and hl.trang_thai = 'dang_hoc'
     where bu.loai = 'khao_sat'
    union
    select g.hoc_sinh_id, h2.diem_danh from gami_grades g
      join gami_session_problems s on s.id = g.problem_id and s.phase = 'mt'
      left join buoi_hoc_hs h2 on h2.buoi_hoc_id = p_buoi and h2.hoc_sinh_id = g.hoc_sinh_id
     where g.buoi_hoc_id = p_buoi
  ),
  hs1 as (select distinct on (hoc_sinh_id) hoc_sinh_id, diem_danh from hs order by hoc_sinh_id, diem_danh nulls last),
  lop_hs as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id join bu on l.mon = bu.mon
     where hl.trang_thai = 'dang_hoc' and hl.hoc_sinh_id in (select hoc_sinh_id from hs1)
     order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  dem as (
    select hs1.hoc_sinh_id,
           count(s.id)::int as so_cau, count(g.id)::int as so_cham, count(g.id) filter (where g.diem_dat is null)::int as so_thieu_diem,
           sum(g.diem_dat) filter (where not s.nang_cao) as cb, sum(g.diem_dat) filter (where s.nang_cao) as nc
      from hs1
      left join gami_session_problems s on s.buoi_hoc_id = p_buoi and s.phase = 'mt' and not s.ngoai_de
      left join gami_grades g on g.problem_id = s.id and g.hoc_sinh_id = hs1.hoc_sinh_id
     group by hs1.hoc_sinh_id
  )
  select hs1.hoc_sinh_id, x.ho_ten, hs1.diem_danh, d.so_cau, d.so_cham, d.so_thieu_diem,
         coalesce(d.cb, 0), coalesce(d.nc, 0), ky.khung_co_ban, ky.khung_nang_cao,
         dt.nguon, dt.diem_co_ban, dt.diem_nang_cao, dt.diem, coalesce(dt.full_diem, false),
         dt.diem_thi_lai_co_ban, dt.diem_thi_lai_nang_cao, coalesce(dt.full_thi_lai, false), dt.diem_thi_lai,
         lh.lop_id, lh.ten_lop, dt.diem_that
    from hs1
    join hoc_sinh x on x.id = hs1.hoc_sinh_id
    join dem d on d.hoc_sinh_id = hs1.hoc_sinh_id
    left join lop_hs lh on lh.hoc_sinh_id = hs1.hoc_sinh_id
    left join ky on true
    left join diem_thi dt on dt.ky_thi_id = ky.id and dt.hoc_sinh_id = hs1.hoc_sinh_id
   order by x.ho_ten
$function$
;

drop function if exists public.fn_bxh_diem_mt_khoi(text, text, text);
CREATE OR REPLACE FUNCTION public.fn_bxh_diem_mt_khoi(p_mon text, p_khoi text, p_ym text)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, ma_hs text, lop_id uuid, ten_lop text, tb numeric, rank_now integer, rank_total integer, tb_that numeric)
 LANGUAGE sql
 STABLE
AS $function$
  with roster as (
    -- distinct on: 1 HS có thể có nhiều dòng dang_hoc (hiếm) → lấy dòng vào lớp mới nhất
    select distinct on (hl.hoc_sinh_id)
      hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
    from hoc_sinh_lop hl
    join lop l on l.id = hl.lop_id
    where hl.trang_thai = 'dang_hoc'
      and l.mon = p_mon and l.khoi = p_khoi
    order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  win as (
    select (p_ym || '-25')::date as tu,
           ((p_ym || '-01')::date + interval '1 month' + interval '10 days')::date as den
  ),
  diem as (
    select dt.hoc_sinh_id, avg(dt.diem) as tb, avg(coalesce(dt.diem_that, dt.diem)) as tb_dt
    from diem_thi dt
    join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'mt_sat_hach' and kt.mon = p_mon
    join buoi_hoc b on b.id = kt.buoi_hoc_id
    cross join win
    where dt.hoc_sinh_id in (select hoc_sinh_id from roster)
      and dt.diem is not null and b.ngay >= win.tu and b.ngay < win.den
    group by dt.hoc_sinh_id
  ),
  ranked as (
    select r.hoc_sinh_id, r.lop_id, r.ten_lop, d.tb as tb_that, d.tb_dt,
           rank() over (order by coalesce(d.tb, 0) desc) as rk,
           count(*) over () as tot
    from roster r left join diem d on d.hoc_sinh_id = r.hoc_sinh_id
  )
  select ra.hoc_sinh_id, hs.ho_ten, hs.ma_hs, ra.lop_id, ra.ten_lop,
         round(ra.tb_that, 2), ra.rk::int, ra.tot::int, round(ra.tb_dt, 2)
  from ranked ra
  join hoc_sinh hs on hs.id = ra.hoc_sinh_id
  order by ra.rk, ra.tb_dt desc nulls last, hs.ho_ten
$function$
;

drop function if exists public.fn_bxh_diem_ks_khoi(text, text, text);
CREATE OR REPLACE FUNCTION public.fn_bxh_diem_ks_khoi(p_mon text, p_khoi text, p_ym text)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, ma_hs text, lop_id uuid, ten_lop text, tb numeric, rank_now integer, rank_total integer, tb_that numeric)
 LANGUAGE sql
 STABLE
AS $function$
  with roster as (
    select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.id as lop_id, l.ten_lop
      from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
     where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
     order by hl.hoc_sinh_id, hl.ngay_vao desc nulls last
  ),
  win as (select (p_ym || '-01')::date as tu, ((p_ym || '-01')::date + interval '1 month')::date as den),
  diem as (
    select dt.hoc_sinh_id, avg(dt.diem) as tb, avg(coalesce(dt.diem_that, dt.diem)) as tb_dt
      from diem_thi dt
      join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'khao_sat_thang' and kt.mon = p_mon
      join buoi_hoc b on b.id = kt.buoi_hoc_id
      cross join win
     where dt.hoc_sinh_id in (select hoc_sinh_id from roster)
       and dt.diem is not null and b.ngay >= win.tu and b.ngay < win.den
     group by dt.hoc_sinh_id
  ),
  ranked as (
    select r.hoc_sinh_id, r.lop_id, r.ten_lop, d.tb as tb_that, d.tb_dt,
           rank() over (order by coalesce(d.tb, 0) desc) as rk, count(*) over () as tot
      from roster r left join diem d on d.hoc_sinh_id = r.hoc_sinh_id
  )
  select ra.hoc_sinh_id, hs.ho_ten, hs.ma_hs, ra.lop_id, ra.ten_lop, round(ra.tb_that, 2), ra.rk::int, ra.tot::int, round(ra.tb_dt, 2)
    from ranked ra join hoc_sinh hs on hs.id = ra.hoc_sinh_id
   order by ra.rk, ra.tb_dt desc nulls last, hs.ho_ten
$function$
;

revoke execute on function public.fn_mt_cham_hs_v2(uuid) from public, anon;
grant execute on function public.fn_mt_cham_hs_v2(uuid) to authenticated;
-- fn_bxh_diem_mt_khoi vốn mở cho PUBLIC (proacl có =X) ⇒ giữ nguyên, không thu hồi.
grant execute on function public.fn_bxh_diem_mt_khoi(text, text, text) to authenticated;
revoke execute on function public.fn_bxh_diem_ks_khoi(text, text, text) from public, anon;
grant execute on function public.fn_bxh_diem_ks_khoi(text, text, text) to authenticated;
