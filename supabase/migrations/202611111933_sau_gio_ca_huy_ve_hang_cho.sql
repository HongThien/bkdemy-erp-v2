-- ============================================================================
-- 202611111933 — sau_gio_ca_huy_ve_hang_cho
-- VÌ SAO (Thùy 11/11): "reset lại ca bổ trợ sau giờ 9A1 … t huỷ ca rồi". Huỷ ca sau giờ thì em phải QUAY LẠI hàng chờ khởi tạo;
--   trước đây case nhe của ca huỷ (nhe_xong / bo) vẫn bị tính "đã khởi tạo sau lúc duyệt" ⇒ em biến khỏi hàng chờ.
--   Sửa ĐIỀU KIỆN ở 3 hàm đọc (fn_btnhe_cho · fn_btnhe_lop_cho · fn_btnhe_hs_duyet): bỏ qua case thuộc ca_bo_tro_nhe trang_thai 'huy'.
--   Không xoá / sửa dữ liệu nào (ca huỷ + case + log giữ nguyên làm vết). Em vắng (buổi huỷ, ca vẫn mở) KHÔNG đổi — như cũ.
-- MẤT GÌ (Luật xoá): không mất gì — create or replace 3 hàm đọc.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_btnhe_cho()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
      'de_xuat_id', d.id, 'hoc_sinh_id', d.hoc_sinh_id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'mon', d.mon, 'khoi', d.khoi,
      'lop_id', d.lop_id, 'ten_lop', l.ten_lop, 'nhom', d.nhom, 'uu_tien', d.uu_tien, 'ghi_chu', d.ghi_chu, 'duyet_at', d.duyet_at,
      'so_dang', (select count(*) from public._sau_gio_dang(d.hoc_sinh_id, d.mon)))
    order by d.mon, d.khoi, l.ten_lop, h.ho_ten), '[]'::jsonb)
    from bo_tro_de_xuat d join hoc_sinh h on h.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
   where d.trang_thai = 'da_duyet' and d.muc = 1 and public.la_thanh_vien() and public._btnhe_duoc_tao(d.mon, d.khoi)
     and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = d.hoc_sinh_id and y.mon = d.mon and y.nguon = 'nhe' and y.created_at >= d.duyet_at and not exists (select 1 from buoi_hoc_hs hh2 join buoi_hoc b2 on b2.id = hh2.buoi_hoc_id join ca_bo_tro_nhe cn on cn.id = b2.ca_bo_tro_nhe_id
                                   where hh2.bo_tro_yeu_id = y.id and cn.trang_thai = 'huy')   /* 11/11: ca đã HUỶ không tính đã khởi tạo */)
$function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_lop_cho()
 RETURNS TABLE(lop_id uuid, ten_lop text, mon text, khoi text, so_em integer, so_cho integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with dx as (
    select distinct on (d.hoc_sinh_id, d.mon) d.*
      from bo_tro_de_xuat d order by d.hoc_sinh_id, d.mon, d.tao_at desc
  ),
  em as (
    select l.id as lop_id, l.ten_lop, l.mon, l.khoi, dx.hoc_sinh_id,
           not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = dx.hoc_sinh_id and y.mon = dx.mon and y.nguon = 'nhe' and y.created_at >= dx.duyet_at and not exists (select 1 from buoi_hoc_hs hh2 join buoi_hoc b2 on b2.id = hh2.buoi_hoc_id join ca_bo_tro_nhe cn on cn.id = b2.ca_bo_tro_nhe_id
                                   where hh2.bo_tro_yeu_id = y.id and cn.trang_thai = 'huy')   /* 11/11: ca đã HUỶ không tính đã khởi tạo */) as cho
      from dx join hoc_sinh_lop hl on hl.hoc_sinh_id = dx.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
      join lop l on l.id = hl.lop_id and l.mon = dx.mon and l.trang_thai = 'dang_hoc'
     where dx.trang_thai = 'da_duyet' and dx.muc = 1 and public.la_thanh_vien() and public._btnhe_duoc_tao(l.mon, l.khoi)
  )
  select lop_id, ten_lop, mon, khoi, count(*)::int, count(*) filter (where cho)::int
    from em group by lop_id, ten_lop, mon, khoi
   order by mon, khoi, ten_lop
$function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_hs_duyet(p_lop uuid)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, ma_hs text, cho boolean, duyet_at timestamp with time zone, so_ca_tuan integer, so_dang integer, nhom jsonb, ghi_chu text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare l record; v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh')::date)::date;
begin
  select * into l from lop where id = p_lop;
  if l.id is null then raise exception 'Không thấy lớp.'; end if;
  if not public.la_thanh_vien() or not public._btnhe_duoc_tao(l.mon, l.khoi) then raise exception 'Lớp ngoài phạm vi khối của bạn.'; end if;
  return query
  with dx as (
    select distinct on (d.hoc_sinh_id) d.*
      from bo_tro_de_xuat d
      join hoc_sinh_lop hl on hl.hoc_sinh_id = d.hoc_sinh_id and hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'
     where d.mon = l.mon
     order by d.hoc_sinh_id, d.tao_at desc
  )
  select h.id, h.ho_ten, h.ma_hs,
         not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = h.id and y.mon = l.mon and y.nguon = 'nhe' and y.created_at >= dx.duyet_at and not exists (select 1 from buoi_hoc_hs hh2 join buoi_hoc b2 on b2.id = hh2.buoi_hoc_id join ca_bo_tro_nhe cn on cn.id = b2.ca_bo_tro_nhe_id
                                   where hh2.bo_tro_yeu_id = y.id and cn.trang_thai = 'huy')   /* 11/11: ca đã HUỶ không tính đã khởi tạo */),
         dx.duyet_at,
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7),
         (select count(*)::int from public._sau_gio_dang(h.id, l.mon)),
         dx.nhom, dx.ghi_chu
    from dx join hoc_sinh h on h.id = dx.hoc_sinh_id
   where dx.trang_thai = 'da_duyet' and dx.muc = 1
   order by h.ho_ten;
end $function$;
