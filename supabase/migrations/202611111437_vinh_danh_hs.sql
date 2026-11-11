-- ẢNH VINH DANH THÁNG (Thùy 11/11) — 1 hàm đọc trả đủ số liệu cho 1 ảnh: đơn design/DON-HANG-VINH-DANH-THANG.md §5.
-- Ghép từ hàm đang chạy, không công thức mới:
--   · điểm test tháng = TB điểm MT (mt_sat_hach) trong cửa sổ 25/M → hết 10/(M+1)   (fn_rank_diem_mt_lop — cột tb)
--   · hạng KHỐI = fn_rank_diem_mt_lop (roster mọi lớp cùng môn + khối) · hạng LỚP = fn_rank_diem_mt(lớp em)
--   · tên kì thi = ky_thi.ten của kỳ MT gần nhất em có điểm trong cửa sổ
--   · % mastery 30 ngày = số DẠNG mức 'dat' / số dạng ĐÃ ĐO (cap 'dang', không BTVN) của môn, đo trong 30 ngày tới MỐC.
--     MỐC = hết ngày 10/(M+1) giờ VN (đóng cửa sổ test tháng), chưa tới thì = now() ⇒ xuất lại sau vẫn ra đúng số.
-- Chỉ đọc. Invoker + RLS như các hàm Report.
create or replace function public.fn_vinh_danh_hs(p_hs uuid, p_mon text, p_ym text)
returns jsonb
language plpgsql
stable
as $$
declare
  v_lop uuid; v_lop_ten text; v_khoi text;
  v_den timestamptz; v_tu date; v_den_mt date;
  v_tb numeric; v_rk_khoi int; v_tot_khoi int; v_rk_lop int; v_tot_lop int;
  v_ky text; v_dat int; v_do int;
  v_ho_ten text; v_anh text; v_ma_hs text; v_giai text;
begin
  if p_ym is null or p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM: %', p_ym; end if;

  select h.ho_ten, h.anh_url, h.ma_hs into v_ho_ten, v_anh, v_ma_hs from hoc_sinh h where h.id = p_hs;
  if v_ho_ten is null then raise exception 'Không thấy học sinh.'; end if;

  select l.id, l.ten_lop, l.khoi into v_lop, v_lop_ten, v_khoi
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1;

  v_tu := (p_ym || '-25')::date;
  v_den_mt := ((p_ym || '-01')::date + interval '1 month' + interval '10 days')::date;   -- < ngày 11/(M+1)
  v_den := least(now(), make_timestamptz(extract(year from v_den_mt)::int, extract(month from v_den_mt)::int,
                                         extract(day from v_den_mt)::int, 0, 0, 0, 'Asia/Ho_Chi_Minh'));

  if v_lop is not null then
    select r.tb, r.rank_now, r.rank_total into v_tb, v_rk_khoi, v_tot_khoi
      from public.fn_rank_diem_mt_lop(v_lop, p_mon, p_ym) r where r.hoc_sinh_id = p_hs;
    select r.rank_now, r.rank_total into v_rk_lop, v_tot_lop
      from public.fn_rank_diem_mt(p_hs, array[v_lop], p_mon, p_ym) r;
  end if;

  select kt.ten into v_ky
    from diem_thi dt
    join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'mt_sat_hach' and kt.mon = p_mon
    join buoi_hoc b on b.id = kt.buoi_hoc_id
   where dt.hoc_sinh_id = p_hs and dt.diem is not null and b.ngay >= v_tu and b.ngay < v_den_mt
   order by b.ngay desc limit 1;

  with m as (
    select x.nut, x.muc
      from public._mastery_lan_cap(public._mastery_bdm_bat(), array[p_hs], false, v_den - interval '30 days', v_den,
                                   array['dang'], 5, 5, 3) x
     where x.cap = 'dang'
  ), d as (
    select m.* from m join public._tq_dang_info(p_mon, (select array_agg(distinct nut) from m)) di on di.ma_dang = m.nut
  )
  select count(*) filter (where muc = 'dat'), count(*) into v_dat, v_do from d;

  select g.loai_giai into v_giai from giai_thuong g
   where g.hoc_sinh_id = p_hs and g.mon = p_mon and g.thang = (p_ym || '-01')::date
   order by g.duyet_at limit 1;

  return jsonb_build_object(
    'hoTen', v_ho_ten, 'maHs', v_ma_hs, 'anhUrl', v_anh, 'mon', p_mon, 'ym', p_ym,
    'lopId', v_lop, 'lop', v_lop_ten, 'khoi', v_khoi, 'loaiGiai', v_giai,
    'kyThi', v_ky, 'diemTest', round(v_tb, 1),
    'hangLop', v_rk_lop, 'tongLop', v_tot_lop, 'hangKhoi', v_rk_khoi, 'tongKhoi', v_tot_khoi,
    'dangDat', v_dat, 'dangDo', v_do,
    'masteryPct', case when v_do > 0 then round(100.0 * v_dat / v_do) end,
    'mocMastery', v_den
  );
end
$$;

revoke execute on function public.fn_vinh_danh_hs(uuid, text, text) from public, anon;
grant execute on function public.fn_vinh_danh_hs(uuid, text, text) to authenticated;
