-- ============================================================================
-- 202608300743 — Phase 3c §2.0: XẾP HẠNG ĐIỂM MT → function DB
-- ----------------------------------------------------------------------------
-- VÌ SAO: audit 30/08 — report.ts rankByDiemMT kéo điểm CẢ ROSTER (lớp/hệ/khối) về
--   browser rồi đếm tay "1 + số người điểm cao hơn". Xếp hạng là việc của SQL.
--   Luật giữ nguyên văn (Thùy 08-19/08-21): điểm CỦA EM ĐI THEO EM (avg mọi diem_thi
--   mt_sat_hach đúng môn trong cửa sổ 25 tháng này → hết mùng 10 tháng sau, ngày lấy
--   theo buoi_hoc.ngay vì ky_thi.ngay luôn NULL cho MT); roster đủ TOÀN BỘ HS đang
--   học (chưa có điểm = 0đ — ngoại lệ có chủ đích so §5, CHỈ cho bảng xếp hạng).
-- MẤT GÌ (Luật xoá): không — thêm function.
-- ============================================================================
create or replace function public.fn_rank_diem_mt(p_hs uuid, p_lop_ids uuid[], p_mon text, p_ym text)
returns table (rank_now integer, rank_total integer)
language sql stable as $$
  with roster as (
    select distinct hoc_sinh_id from hoc_sinh_lop
    where trang_thai = 'dang_hoc' and lop_id = any(p_lop_ids)
  ),
  win as (
    select (p_ym || '-25')::date as tu,
           ((p_ym || '-01')::date + interval '1 month' + interval '10 days')::date as den -- < ngày 11 tháng sau
  ),
  diem as (
    select dt.hoc_sinh_id, avg(dt.diem) as tb
    from diem_thi dt
    join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'mt_sat_hach' and kt.mon = p_mon
    join buoi_hoc b on b.id = kt.buoi_hoc_id
    cross join win
    where dt.hoc_sinh_id in (select hoc_sinh_id from roster)
      and dt.diem is not null and b.ngay >= win.tu and b.ngay < win.den
    group by dt.hoc_sinh_id
  ),
  score as (
    select r.hoc_sinh_id, coalesce(d.tb, 0) as tb
    from roster r left join diem d on d.hoc_sinh_id = r.hoc_sinh_id
  )
  select (1 + count(*) filter (where s.tb > my.tb))::int, (select count(*) from score)::int
  from score s, (select tb from score where hoc_sinh_id = p_hs) my
  where exists (select 1 from roster where hoc_sinh_id = p_hs)
$$;
grant execute on function public.fn_rank_diem_mt(uuid, uuid[], text, text) to authenticated;
