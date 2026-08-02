-- Học phí (08-01): NỢ KHỞI TẠO của phụ huynh — nợ cũ từ TRƯỚC khi có hệ thống (người NHẬP TAY).
-- Cộng chung với nợ hệ thống (Σ hoá đơn chốt − đã thu) khi tính "nợ kỳ trước" trên phiếu tháng.
-- Chỉ THÊM cột nullable default 0 (non-destructive).
alter table phu_huynh add column if not exists no_khoi_tao numeric not null default 0;
