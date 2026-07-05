-- ============================================================================
-- 0076 — Mức học đuổi gắn theo CA Bổ trợ đuổi, KHÔNG theo lớp (Thùy sửa lại 0075).
-- ----------------------------------------------------------------------------
-- Học đuổi độc lập với lớp gốc: mỗi ca đuổi (buoi_hoc loai='bo_tro_duoi') có thể
-- khác giá nhau (khác buổi, khác đợt), không suy từ lớp HS đang đuổi.
-- lop.muc_hoc_duoi_id (mig 0075) — 0 dòng dùng thật — xoá, chuyển sang buoi_hoc.
-- ============================================================================
alter table lop drop column if exists muc_hoc_duoi_id;
alter table buoi_hoc add column if not exists muc_hoc_duoi_id uuid references muc_hoc_duoi(id);
