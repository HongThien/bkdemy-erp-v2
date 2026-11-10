-- DASHBOARD BỔ TRỢ › "Chi tiết bổ trợ" (Thùy 10/11): bảng tra cứu cho vận hành — mỗi BUỔI bổ trợ (bù · yếu · đuổi · hình · nhẹ · ôn thi) là 1 dòng, cột bám sát DB
-- (ngày · giờ · loại · trạng thái · phòng · môn · lớp · TA · ca trực · HS + điểm danh + đơn vị · các mốc đóng). Lọc + tìm kiếm Ở DB (tìm không dấu, không phân biệt hoa thường), phân trang.
-- CHỈ ĐỌC. Tìm kiếm khớp: tên/mã HS · tên TA · lớp · phòng · mã buổi.
create or replace function public.fn_botro_chi_tiet(
  p_tu date, p_den date,
  p_loai text[] default null, p_tt text[] default null, p_khoi text default null,
  p_gan_ca text default null,            -- 'co' = đã gắn ca trực · 'khong' = chưa gắn
  p_q text default null, p_limit integer default 200, p_offset integer default 0)
returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $$
declare v_q text := nullif(trim(coalesce(p_q, '')), ''); v_lim integer := greatest(1, least(coalesce(p_limit, 200), 500)); v_off integer := greatest(coalesce(p_offset, 0), 0); v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_tu is null or p_den is null or p_den < p_tu or p_den - p_tu > 400 then raise exception 'Khoảng ngày không hợp lệ.'; end if;
  if v_q is not null then v_q := '%' || public.fn_bo_dau(v_q) || '%'; end if;

  with base as materialized (
    select b.id, b.ma_buoi, b.ngay, b.thu, b.gio_bat_dau, b.gio_ket_thuc, b.loai, b.trang_thai, b.phong, b.ly_do_huy, b.ca_bo_tro_id,
           b.et_dong_at, b.danh_gia_xong_at, b.created_at,
           l.ten_lop, c.khoi as ca_khoi,
           coalesce(l.mon, (select y.mon from buoi_hoc_hs h2 join bo_tro_yeu y on y.id = h2.bo_tro_yeu_id where h2.buoi_hoc_id = b.id limit 1), c.mon) as mon,
           coalesce(n1.ho_ten, n2.ho_ten) as ta,
           coalesce((select jsonb_agg(jsonb_build_object('ten', hs.ho_ten, 'ma', hs.ma_hs, 'khoi', hs.khoi, 'dd', hh.diem_danh,
                        'dv', coalesce(hh.don_vi, public._ca_bo_tro_don_vi(case b.loai when 'bo_tro_yeu' then 'yeu' when 'bo_tro_duoi' then 'duoi' when 'bu' then 'bu' else 'hinh' end, hh.hoc_sinh_id, 'Toán')))
                        order by hs.ho_ten)
                      from buoi_hoc_hs hh join hoc_sinh hs on hs.id = hh.hoc_sinh_id where hh.buoi_hoc_id = b.id), '[]'::jsonb) as hs
      from buoi_hoc b
      left join lop l on l.id = b.lop_id
      left join ca_bo_tro c on c.id = b.ca_bo_tro_id
      left join nhan_su n1 on n1.id = b.nguoi_day_tg left join nhan_su n2 on n2.id = b.nguoi_day
     where b.ngay between p_tu and p_den
       and b.loai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi', 'bo_tro_hinh', 'bo_tro_nhe', 'bo_tro_on_thi')
       and (p_loai is null or b.loai = any(p_loai))
       and (p_tt is null or b.trang_thai = any(p_tt))
       and (p_gan_ca is null or (p_gan_ca = 'co' and b.ca_bo_tro_id is not null) or (p_gan_ca = 'khong' and b.ca_bo_tro_id is null))),
  loc as materialized (
    select x.* from base x
     where (p_khoi is null or coalesce(x.ca_khoi, '') = p_khoi or exists (select 1 from jsonb_array_elements(x.hs) e where e->>'khoi' = p_khoi))
       and (v_q is null
            or public.fn_bo_dau(coalesce(x.ta, '') || ' ' || coalesce(x.ten_lop, '') || ' ' || coalesce(x.phong, '') || ' ' || coalesce(x.ma_buoi, '')) like v_q
            or exists (select 1 from jsonb_array_elements(x.hs) e where public.fn_bo_dau((e->>'ten') || ' ' || coalesce(e->>'ma', '')) like v_q))),
  trang as (
    select * from loc order by ngay desc, gio_bat_dau desc, id limit v_lim offset v_off)
  select jsonb_build_object(
    'tong', (select count(*) from loc), 'limit', v_lim, 'offset', v_off,
    'rows', coalesce((select jsonb_agg(jsonb_build_object(
        'id', t.id, 'ma_buoi', t.ma_buoi, 'ngay', t.ngay, 'thu', t.thu, 'bd', to_char(t.gio_bat_dau, 'HH24:MI'), 'kt', to_char(t.gio_ket_thuc, 'HH24:MI'),
        'loai', t.loai, 'trang_thai', t.trang_thai, 'phong', t.phong, 'mon', t.mon, 'lop', t.ten_lop, 'ta', t.ta,
        'ca_bo_tro_id', t.ca_bo_tro_id, 'ca_khoi', t.ca_khoi, 'ly_do_huy', t.ly_do_huy, 'et_dong_at', t.et_dong_at, 'danh_gia_xong_at', t.danh_gia_xong_at, 'created_at', t.created_at,
        'so_hs', jsonb_array_length(t.hs), 'hs', t.hs,
        'dv', coalesce((select sum((e->>'dv')::int) from jsonb_array_elements(t.hs) e), 0)) order by t.ngay desc, t.gio_bat_dau desc, t.id) from trang t), '[]'::jsonb)
  ) into v_out;
  return v_out;
end $$;
grant execute on function public.fn_botro_chi_tiet(date, date, text[], text[], text, text, text, integer, integer) to authenticated;
