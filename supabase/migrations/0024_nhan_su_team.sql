-- ============================================================================
-- Migration 0024 — nhan_su.team_id (team BIÊN CHẾ, Thùy chốt 06-11)
-- ----------------------------------------------------------------------------
-- Form nhân sự chọn team TRƯỚC (biên chế); Sơ đồ tổ chức dùng làm FILTER khi
-- đặt người vào vị trí (40 NS đủ team mà dồn hết vào 1 picker thì rối).
-- Vị trí vẫn là xương sống tổ chức — team_id ở đây KHÔNG thay cây vi_tri.
-- ============================================================================

alter table nhan_su add column if not exists team_id uuid references team(id) on delete set null;
