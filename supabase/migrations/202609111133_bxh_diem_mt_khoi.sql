-- ============================================================================
-- 202609111133 — BXH điểm MT tại trung tâm theo (môn, khối, tháng)
-- ----------------------------------------------------------------------------
-- VÌ SAO: tab "Kết quả học tập › Điểm thi" đang chỉ có điểm thi trên trường + nhập
--   điểm; Thùy yêu cầu thêm 1 BXH điểm MT tại TRUNG TÂM để so ngang hàng trong
--   khối, filter theo lớp/khối/tháng. Luật giữ nguyên văn của MT (Thùy 08-19 +
--   08-21, xem report.ts §Hạng): điểm CỦA EM ĐI THEO EM (avg mọi diem_thi
--   mt_sat_hach đúng môn trong cửa sổ 25/tháng → hết mùng 10 tháng sau, ngày lấy
--   theo buoi_hoc.ngay vì ky_thi.ngay luôn NULL cho MT); roster = TOÀN BỘ HS đang
--   học các lớp cùng (mon, khối). Chưa có điểm trong cửa sổ = 0đ CHỈ trong xếp
--   hạng (ngoại lệ có chủ đích so §5), `tb` trả NULL để ô hiển thị vẫn "—".
--   Rank tính riêng trong từng khối (kh 6..12 không so trực tiếp) — CEO chốt.
-- §2.0: mọi tổng hợp + rank ở Postgres. Client CHỈ gọi RPC + render.
-- MẤT GÌ (Luật xoá): không — chỉ thêm 1 function.
-- ============================================================================
create or replace function public.fn_bxh_diem_mt_khoi(p_mon text, p_khoi text, p_ym text)
returns table (
  hoc_sinh_id uuid, ho_ten text, ma_hs text,
  lop_id uuid, ten_lop text,
  tb numeric, rank_now integer, rank_total integer
) language sql stable as $$
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
    select dt.hoc_sinh_id, avg(dt.diem) as tb
    from diem_thi dt
    join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'mt_sat_hach' and kt.mon = p_mon
    join buoi_hoc b on b.id = kt.buoi_hoc_id
    cross join win
    where dt.hoc_sinh_id in (select hoc_sinh_id from roster)
      and dt.diem is not null and b.ngay >= win.tu and b.ngay < win.den
    group by dt.hoc_sinh_id
  ),
  ranked as (
    select r.hoc_sinh_id, r.lop_id, r.ten_lop, d.tb as tb_that,
           rank() over (order by coalesce(d.tb, 0) desc) as rk,
           count(*) over () as tot
    from roster r left join diem d on d.hoc_sinh_id = r.hoc_sinh_id
  )
  select ra.hoc_sinh_id, hs.ho_ten, hs.ma_hs, ra.lop_id, ra.ten_lop,
         round(ra.tb_that, 2), ra.rk::int, ra.tot::int
  from ranked ra
  join hoc_sinh hs on hs.id = ra.hoc_sinh_id
  order by ra.rk, hs.ho_ten
$$;
grant execute on function public.fn_bxh_diem_mt_khoi(text, text, text) to authenticated;
