-- ============================================================================
-- 202610081103 — tinh_nang_mo_bxh_chuoi: MỞ LẠI Bảng xếp hạng + Chuỗi làm bài trong đợt 1
-- VÌ SAO: mig 202610072118 đóng 2 mã này vì tôi đọc "đợt 1 chỉ có…" theo nghĩa đen. Thùy 08/10: "2 cái này phải mở chứ sao lại ẩn"
--   (Thông tin học tập nằm hết ở BXH ⇒ BXH phải mở; Chuỗi làm bài phải được HIGHLIGHT trên màn chính).
-- MẤT GÌ: không mất gì — chỉ đặt lại `mo_tu` (trigger tự ghi tinh_nang_log).
-- ============================================================================
update public.tinh_nang set mo_tu = date '2020-01-01' where ma in ('xep_hang', 'chuoi') and mo_tu is null;
