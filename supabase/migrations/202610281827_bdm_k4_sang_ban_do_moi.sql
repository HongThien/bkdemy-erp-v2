-- ============================================================================
-- 202610281827 — bdm_k4_sang_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 28/10 "bật đi" — sau khi bản đồ mới khối 4 lùi xuống 1 tầng (1 chủ đề «Số tự nhiên» › 9 chuyên đề › 26 nhóm ›
--   80 dạng bài) và 638 câu gốc đã gán (scripts/bdm-k4-lui-tang.mjs). Bật theo khối như 4T (mig 202610262053): bỏ '4' khỏi
--   danh sách giữ bản đồ cũ ⇒ registry nhánh (bdm), quy dạng mastery, Giáo trình/ET (fn_kho_dung_ban_do_cu) của khối 4 theo bản đồ mới.
--   Danh sách CẤP 1 của luật đo (client CAP1_KHOI, _mastery_lan_do…) là chính sách khác, KHÔNG đổi. Quay lại = thêm '4' vào lại.
--
-- MẤT GÌ (Luật xoá): Không mất gì — chỉ thay thân 1 hàm (bớt 1 khối trong danh sách).
-- ============================================================================
create or replace function _bdm_khoi_giu_cu(p_khoi text) returns boolean
language sql immutable as $$ select coalesce(p_khoi, '') in ('3', '5', '5T') $$;
