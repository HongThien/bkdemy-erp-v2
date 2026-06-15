-- ============================================================================
-- Migration 0035 — Tài liệu ET gắn BUỔI qua (lớp + ngày) (Thùy chốt 06-16)
-- ----------------------------------------------------------------------------
-- ET = tai_lieu(loai='et'), nội dung tái dùng tai_lieu_phan(loai='dang')+tai_lieu_cau.
-- Gắn buổi theo DANH TÍNH SUY DIỄN (lop_id, ngay) = thứ sinh ra ma_buoi — KHÔNG FK
-- buoi_hoc.id vì lúc tạo ET buổi còn ẢO. Chấm ET match theo (lop_id, ngay) khi buổi mở.
-- Cột nullable: chỉ ET dùng; giáo trình để trống.
-- ============================================================================

alter table tai_lieu add column if not exists lop_id uuid references lop(id) on delete set null;
alter table tai_lieu add column if not exists ngay   date;

-- tra cứu ET theo buổi (lớp+ngày) cho tab Chấm ET
create index if not exists tai_lieu_et_buoi_idx on tai_lieu (lop_id, ngay) where loai = 'et';
