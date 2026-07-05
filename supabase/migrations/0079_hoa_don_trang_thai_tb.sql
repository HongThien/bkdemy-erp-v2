-- ============================================================================
-- 0079 — Trạng thái THÔNG BÁO thu học phí (Thùy 07-05): 3 bước, giống toggle
-- bar tuyển sinh. "Xong bước" tự nhảy bước kế: thong_bao_1 → cho_xu_ly → hoan_thanh.
-- Mỗi bước hệ thống soạn sẵn nội dung copy-paste gửi PH — Nhân sự không phải nghĩ chữ.
-- ============================================================================
alter table hoa_don add column if not exists trang_thai_tb text not null default 'thong_bao_1'
  check (trang_thai_tb in ('thong_bao_1', 'cho_xu_ly', 'hoan_thanh'));
