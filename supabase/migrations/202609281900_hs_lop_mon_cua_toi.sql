-- ============================================================================
-- 202609281900 — hs_lop_mon_cua_toi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   App HS chỉ biết 1 môn: `hs_mon_cua_toi` trả `array_agg(distinct mon)` (distinct tự sắp theo CHỮ CÁI),
--   client lấy phần tử [0]. Giả định lúc viết (20/08) "100% dữ liệu là 1 môn (Toán)" hết đúng từ khi mở
--   lớp KHTN/Tiếng Anh: em học Toán + KHTN ra 'KHTN' ⇒ cả app chạy theo KHTN, Toán biến mất.
--   Đo 28/09: 57 HS đang học ≥2 môn, 51 em bị app chọn môn KHÔNG phải Toán (vụ Gia Khiêm HS0557).
--   ⇒ App cần BỘ CHỌN MÔN (§1.6: mỗi môn một trung tâm, đối xứng). Hàm này là nguồn cho bộ chọn:
--   mỗi môn em đang học 1 dòng, kèm tên lớp để hiện ở đầu trang (HS không đọc thẳng được
--   `hoc_sinh_lop`/`lop` — staff-only, SELECT ra 0 dòng không lỗi).
--   THỨ TỰ = môn em vào học TRƯỚC đứng trước (min ngay_vao) — suy từ dữ liệu thật, không ưu tiên cứng
--   môn nào (symmetry test §1.6), không cần bảng cấu hình. Dòng đầu = môn mặc định khi em chưa chọn.
--   `hs_mon_cua_toi` GIỮ NGUYÊN (bản app cũ chưa deploy lại vẫn gọi).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ thêm 1 hàm đọc.
-- ============================================================================

create or replace function public.hs_lop_mon_cua_toi()
returns table (mon text, ten_lop text)
language sql stable security definer set search_path = public as $$
  select l.mon, string_agg(l.ten_lop, ', ' order by hl.ngay_vao, l.ten_lop) as ten_lop
  from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
  where hl.hoc_sinh_id = public.my_hoc_sinh_id() and hl.trang_thai = 'dang_hoc'
  group by l.mon
  order by min(hl.ngay_vao), l.mon
$$;
revoke all on function public.hs_lop_mon_cua_toi() from public;
revoke execute on function public.hs_lop_mon_cua_toi() from anon;
grant execute on function public.hs_lop_mon_cua_toi() to authenticated;
