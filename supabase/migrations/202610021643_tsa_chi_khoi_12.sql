-- ============================================================================
-- tsa_chi_khoi_12
-- VÌ SAO: Thùy 02/10 — "TSA là môn riêng của lớp 12, chỉ hiện ở app HS khối 12". Luật môn↔khối đặt ở MỘT hàm registry
--   `_mon_khoi_hop_le(mon, khoi)` (thêm môn có giới hạn khối = sửa đúng hàm này, không rải `if mon = 'TSA'`), dùng ở 2 chỗ:
--   1. CHECK trên `lop`: không tạo được lớp TSA khác khối 12 (đang có 0 lớp TSA ⇒ không vướng dữ liệu cũ).
--   2. `hs_mon_hoc_cua_toi` (nguồn thanh chọn môn của app HS): môn TSA chỉ trả về khi hoc_sinh.khoi = '12'
--      (HS khối khác lỡ được ghi danh vào lớp TSA cũng không thấy).
-- MẤT GÌ: không mất dữ liệu. Thêm 1 hàm + 1 CHECK; thay hs_mon_hoc_cua_toi (dựng từ bản đang chạy, chỉ thêm 1 điều kiện).
-- ============================================================================
create or replace function public._mon_khoi_hop_le(p_mon text, p_khoi text)
 returns boolean language sql immutable
as $function$
  select case when p_mon = 'TSA' then p_khoi = '12' else true end
$function$;

alter table public.lop add constraint lop_mon_khoi_hop_le check (public._mon_khoi_hop_le(mon, khoi));

create or replace function public.hs_mon_hoc_cua_toi()
 returns table(mon text, ten_lop text, co_kho boolean)
 language sql stable security definer
 set search_path to 'public'
as $function$
  select l.mon, string_agg(l.ten_lop, ', ' order by hl.ngay_vao, l.ten_lop) as ten_lop, public._kho_co_mon(l.mon) as co_kho
  from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
  where hl.hoc_sinh_id = public.my_hoc_sinh_id() and hl.trang_thai = 'dang_hoc'
    and public._mon_khoi_hop_le(l.mon, (select hs.khoi from hoc_sinh hs where hs.id = public.my_hoc_sinh_id()))
  group by l.mon
  order by min(hl.ngay_vao), l.mon
$function$;
