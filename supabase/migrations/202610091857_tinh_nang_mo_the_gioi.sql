-- ============================================================================
-- 202610091857 — tinh_nang_mo_the_gioi: MỞ LẠI Thế giới BK (kênh khoe thành tích) cho mọi lớp
-- VÌ SAO: mig 202610072118 (đợt 1) đóng `the_gioi` theo danh sách Thùy đưa ngày 07/10. Thùy 09/10: "Mở lại kênh thế giới đi. main chưa có rồi."
-- MẤT GÌ: không mất gì — chỉ đặt lại `mo_tu` (trigger tự ghi tinh_nang_log).
-- ============================================================================
update public.tinh_nang set mo_tu = date '2020-01-01' where ma = 'the_gioi' and mo_tu is null;
