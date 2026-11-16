-- ============================================================================
-- 202611161614 — sau_gio_chot_theo_tuan
-- VÌ SAO (Thùy 16/11, thứ Hai): "Bổ trợ sau giờ hết chủ nhật reset. thứ 2 phải chờ chốt mới chứ sao lại tự reset về cái tuần trước. luồng ko đúng rồi".
--   Hàng chờ (fn_btnhe_cho), lớp chờ (fn_btnhe_lop_cho), form khởi tạo (fn_btnhe_hs_duyet) lấy "đề xuất L1 đã duyệt MỚI NHẤT" bất kể tuần ⇒ sáng
--   16/11 hàng chờ có 52 em / 19 lớp toàn là lượt chốt tuần 09–15/11. Luật: lượt chốt chỉ có hiệu lực trong TUẦN được duyệt (duyet_at ≥ thứ Hai
--   tuần này, giờ VN, _btnhe_dau_tuan); sang tuần mới hàng chờ RỖNG tới khi trưởng khối chốt + TBM duyệt lượt mới. Lượt cũ giữ nguyên (lịch sử).
--   Không đụng: _btnhe_dang_chot (in tài liệu cho ca ĐÃ tạo, đọc lượt chốt của em) · mục tiêu tuần (_mtt_tinh đã lọc theo tuần) · chấm công
--   (đọc ca, không đọc lượt chốt). Ca tuần này tạo từ chốt cũ (3A1 16/11, 3 em, tạo 13/11) KHÔNG tự huỷ — chờ Thùy.
-- MẤT GÌ (Luật xoá): không — create or replace 3 hàm.
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
      'so_dang', (select count(*) from public._btnhe_dang_chot(d.hoc_sinh_id, d.mon)))
    order by d.mon, d.khoi, l.ten_lop, h.ho_ten), '[]'::jsonb)
    from bo_tro_de_xuat d join hoc_sinh h on h.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
   where d.trang_thai = 'da_duyet' and d.muc = 1 and d.duyet_at >= public._btnhe_dau_tuan()   /* 16/11 Thùy: lượt chốt chỉ có hiệu lực trong TUẦN được duyệt (T2–CN) */ and public.la_thanh_vien() and not exists (select 1 from ca_bo_tro_nhe cx where cx.lop_id = d.lop_id and cx.trang_thai <> 'huy' and cx.ngay >= public._btnhe_dau_tuan())   /* 12/11: lớp đã khởi tạo tuần này ⇒ rời danh sách */
     and d.id = (select d2.id from bo_tro_de_xuat d2 where d2.hoc_sinh_id = d.hoc_sinh_id and d2.mon = d.mon order by d2.tao_at desc limit 1)   /* đề xuất MỚI NHẤT còn là L1 */ and public._btnhe_duoc_tao(d.mon, d.khoi)
     and not public._btnhe_da_co_tuan(d.hoc_sinh_id, d.mon)   /* 12/11: 1 tuần 1 lần */
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
           not public._btnhe_da_co_tuan(dx.hoc_sinh_id, dx.mon)   /* 12/11: 1 tuần 1 lần */ as cho
      from dx join hoc_sinh_lop hl on hl.hoc_sinh_id = dx.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
      join lop l on l.id = hl.lop_id and l.mon = dx.mon and l.trang_thai = 'dang_hoc'
     where dx.trang_thai = 'da_duyet' and dx.muc = 1 and dx.duyet_at >= public._btnhe_dau_tuan()   /* 16/11 Thùy: lượt chốt chỉ có hiệu lực trong TUẦN được duyệt (T2–CN) */ and public.la_thanh_vien() and public._btnhe_duoc_tao(l.mon, l.khoi)
       and not exists (select 1 from ca_bo_tro_nhe cx where cx.lop_id = l.id and cx.trang_thai <> 'huy' and cx.ngay >= public._btnhe_dau_tuan())   /* 12/11: lớp đã khởi tạo tuần này ⇒ rời danh sách */
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
         not public._btnhe_da_co_tuan(h.id, l.mon)   /* 12/11: 1 tuần 1 lần */,
         dx.duyet_at,
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7),
         (select count(*)::int from public._btnhe_dang_chot(h.id, l.mon)),
         dx.nhom, dx.ghi_chu
    from dx join hoc_sinh h on h.id = dx.hoc_sinh_id
   where dx.trang_thai = 'da_duyet' and dx.muc = 1 and dx.duyet_at >= public._btnhe_dau_tuan()   /* 16/11 Thùy: lượt chốt chỉ có hiệu lực trong TUẦN được duyệt (T2–CN) */
   order by h.ho_ten;
end $function$;
