-- Thùy 15/10: "task bổ trợ của HS (cả 3 loại) hiển thị trên app TA kèm MÃ HS để đăng nhập trên iPad — nhiều em không nhớ mã".
-- Ca bù + ca đuổi của TA (fn_bu_ca_cua_toi / fn_duoi_ca_cua_toi) trả danh sách em chỉ có tên + lớp; thêm ma_hs. Bổ trợ yếu đã có sẵn ma_hs.
-- Dựng từ bản ĐANG CHẠY; chỉ thêm 1 khoá vào jsonb (app cũ bỏ qua khoá lạ).
CREATE OR REPLACE FUNCTION public.fn_bu_ca_cua_toi()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_today date := public._btyeu_today(); v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  v_admin := coalesce(v_admin, false);
  select coalesce(jsonb_agg(x order by x.ngay, x.gio_bat_dau nulls last), '[]'::jsonb) into v_out from (
    select b.id as buoi_id, b.ngay, b.gio_bat_dau, b.gio_ket_thuc, b.phong,
           coalesce(ns.ho_ten, ns2.ho_ten) as nguoi_day_ten,
           coalesce(b.nguoi_day_tg, b.nguoi_day) = v_ns as cua_toi,
           b.et_dong_at, b.danh_gia_xong_at,
           (select jsonb_agg(jsonb_build_object('ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'lop', l.ten_lop, 'diem_danh', hh.diem_danh) order by h.ho_ten)
              from buoi_hoc_hs hh join hoc_sinh h on h.id = hh.hoc_sinh_id
              left join buoi_hoc bg on bg.id = hh.bu_cho_buoi_id left join lop l on l.id = bg.lop_id
              where hh.buoi_hoc_id = b.id) as hs
    from buoi_hoc b
    left join nhan_su ns on ns.id = b.nguoi_day_tg
    left join nhan_su ns2 on ns2.id = b.nguoi_day
    where b.loai = 'bu' and b.trang_thai = 'mo'
      and (v_admin or coalesce(b.nguoi_day_tg, b.nguoi_day) = v_ns)
      and b.ngay between v_today - 7 and v_today + 7
      and (b.danh_gia_xong_at is null or b.ngay = v_today)
      and (b.ngay >= v_today or exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = b.id and (x.diem_danh is null or x.diem_danh = 'co_mat'))) -- nợ cũ toàn vắng = không có gì để làm
  ) x;
  return v_out;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_duoi_ca_cua_toi()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_today date := public._btyeu_today(); v_out jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  v_admin := coalesce(v_admin, false);
  select coalesce(jsonb_agg(x order by x.ngay, x.gio_bat_dau nulls last), '[]'::jsonb) into v_out from (
    select b.id as buoi_id, b.ngay, b.gio_bat_dau, b.gio_ket_thuc, b.phong,
           coalesce(ns.ho_ten, ns2.ho_ten) as nguoi_day_ten,
           coalesce(b.nguoi_day_tg, b.nguoi_day) = v_ns as cua_toi,
           b.danh_gia_xong_at,
           (select jsonb_agg(jsonb_build_object('ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'lop', l.ten_lop, 'diem_danh', hh.diem_danh) order by h.ho_ten)
              from buoi_hoc_hs hh join hoc_sinh h on h.id = hh.hoc_sinh_id
              left join bo_tro_duoi d on d.id = hh.bo_tro_duoi_id left join lop l on l.id = d.lop_id
              where hh.buoi_hoc_id = b.id) as hs
    from buoi_hoc b
    left join nhan_su ns on ns.id = b.nguoi_day_tg
    left join nhan_su ns2 on ns2.id = b.nguoi_day
    where b.loai = 'bo_tro_duoi' and b.trang_thai = 'mo'
      and (v_admin or coalesce(b.nguoi_day_tg, b.nguoi_day) = v_ns)
      and b.ngay between v_today - 7 and v_today + 7
      and (b.danh_gia_xong_at is null or b.ngay = v_today)
      and (b.ngay >= v_today or exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = b.id and (x.diem_danh is null or x.diem_danh = 'co_mat')))
  ) x;
  return v_out;
end $function$;
