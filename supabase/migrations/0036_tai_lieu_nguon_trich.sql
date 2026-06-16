-- ============================================================================
-- Migration 0036 — Trích xuất buổi: lưu NGUỒN (master + buổi) trên doc con (06-16)
-- ----------------------------------------------------------------------------
-- Doc trích (giao_trinh_buoi / btvn) ghi: nguon_id = giáo trình master · nguon_buoi =
-- phan-id của buổi trong master. → màn Trích xuất hiện TRẠNG THÁI: buổi nào của master
-- đã gán cho lớp+ngày nào (query theo nguon_id + lop_id, gom theo nguon_buoi).
-- ============================================================================

alter table tai_lieu add column if not exists nguon_id   uuid references tai_lieu(id) on delete set null;
alter table tai_lieu add column if not exists nguon_buoi text;
create index if not exists tai_lieu_nguon_idx on tai_lieu (nguon_id, lop_id) where nguon_id is not null;
