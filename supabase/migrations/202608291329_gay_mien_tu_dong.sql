-- ============================================================================
-- 202608291329 — GẬY: miễn gậy tự động cho nhân sự khối lượng đặc thù
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 29/08): "Bỏ Thùy và Phạm Thị Thùy Trang ra khỏi danh sách —
--   2 người này lắm việc không theo được". Cờ nằm ở nhan_su (data-driven,
--   CEO bật/tắt qua UI Danh mục của màn Gậy) — KHÔNG hard-code tên trong code.
-- Miễn = quét gậy TỰ ĐỘNG bỏ qua người này; gậy THỦ CÔNG vẫn đánh được bình thường.
-- ============================================================================
alter table nhan_su add column if not exists mien_gay boolean not null default false;

update nhan_su set mien_gay = true
where ho_ten in ('Đào Xuân Thùy', 'Phạm Thị Thùy Trang') and trang_thai = 'dang_lam';
