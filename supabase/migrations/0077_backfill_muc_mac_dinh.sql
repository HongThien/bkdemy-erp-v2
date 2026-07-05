-- ============================================================================
-- 0077 — Backfill mức mặc định cho lớp CŨ chưa gán (Thùy 07-05: "sao chưa gán
-- mặc định cho lớp khác" — CreateLopModal chỉ áp default cho lớp MỚI TẠO từ giờ,
-- lớp có sẵn trước đó vẫn NULL). Chỉ điền chỗ NULL — lớp đã gán mức khác GIỮ NGUYÊN.
-- ============================================================================
update lop set muc_hoc_phi_id = (select id from muc_hoc_phi where don_gia_buoi = 150000 limit 1)
  where muc_hoc_phi_id is null;

update lop set muc_hoc_lieu_id = (select id from muc_hoc_lieu where gia = 30000 limit 1)
  where muc_hoc_lieu_id is null;
