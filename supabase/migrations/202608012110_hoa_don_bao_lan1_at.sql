-- Học phí (task 3, 08-01): mốc "đã báo lần 1" cho hoá đơn — tính cảnh báo QUÁ 3 NGÀY chưa nộp → nhắc báo lần 2.
-- CEO chốt: đổi trạng thái thông báo 3-bước (trang_thai_tb) → 2 trạng thái Đã báo / Đã nộp (đã nộp = da_thu).
-- Chỉ THÊM cột nullable (non-destructive) — cột trang_thai_tb cũ để trơ, không drop.
alter table hoa_don add column if not exists bao_lan1_at timestamptz;
