-- ============================================================================
-- 202608142304 — bo_roster_test_dau_vao
-- ----------------------------------------------------------------------------
-- VÌ SAO: Đảo hướng ngay trong phiên (Thùy phản biện 08-14) — roster tĩnh
-- `test_dau_vao_nhan_su` (migration 202608142255) vi phạm tinh thần PURE-DERIVE
-- (CLAUDE.md §4) và cần bảo trì tay. Thay bằng derive "gợi ý gần nhất" từ chính
-- lịch sử ca_test.nguoi_cham_id/nguoi_tra_bai_id — không cần bảng riêng.
-- Giữ nguyên cột nguoi_cham_id/nguoi_tra_bai_id trên ca_test (vẫn cần — đó là
-- assign thật của TỪNG ca, không phải danh mục).
--
-- MẤT GÌ: bảng test_dau_vao_nhan_su — ĐANG RỖNG (0 dòng, mới tạo cùng phiên này,
-- chưa ai dùng/insert qua UI). Không mất dữ liệu thật nào.
-- ============================================================================

drop table if exists test_dau_vao_nhan_su;
