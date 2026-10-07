-- ============================================================================
-- 202610072118 — tinh_nang_dot_1: ĐỢT 1 mở app HS (Thùy chốt 07/10 tối)
-- ----------------------------------------------------------------------------
-- ĐỢT 1 MỞ: Học tập · Trò chơi · Nhiệm vụ · Thành tựu · Ví xu.
--   Trong khu Học tập: "Chinh phục BK" và "Giải Vô địch BK" hiện ở trạng thái SẮP RA MẮT (đảo mờ, không bấm được) —
--   nên có 2 mã mới `chinh_phuc`, `giai_vo_dich`: đóng = "Sắp ra mắt" (KHÁC các mã khác: đóng = ẩn hẳn). Mở ra = chơi được.
-- ĐỢT 1 ĐÓNG (ẩn hẳn): Thông tin học tập (Thùy: "bỏ luôn, nằm hết ở bảng xếp hạng") · Sổ tay · Chuỗi · Bảng xếp hạng · Rank ·
--   Thư viện BK (tạm ẩn) · Thế giới BK · Đề thi thử.
-- Muốn mở đợt sau: màn Admin → Mở tính năng app HS (hoặc fn_tinh_nang_dat) — KHÔNG cần deploy.
-- MẤT GÌ: không xoá gì — chỉ đổi cột `mo_tu` (trigger tự ghi tinh_nang_log) + thêm 2 dòng danh mục.
-- ============================================================================

insert into public.tinh_nang (ma, ten, nhom, thu_tu, mo_tu, mo_ta) values
  ('chinh_phuc',   'Chinh phục BK (leo tháp)', 'hoc', 15, null, 'Trong khu Học tập. Đóng = hiện "Sắp ra mắt" (đảo mờ), không ẩn'),
  ('giai_vo_dich', 'Giải Vô địch BK',          'hoc', 16, null, 'Trong khu Học tập. Đóng = hiện "Sắp ra mắt" (đảo mờ), không ẩn')
on conflict (ma) do nothing;

update public.tinh_nang set mo_tu = null
 where ma in ('thong_tin', 'so_tay', 'chuoi', 'xep_hang', 'rank', 'thu_vien', 'the_gioi', 'de_thi_thu') and mo_tu is not null;
