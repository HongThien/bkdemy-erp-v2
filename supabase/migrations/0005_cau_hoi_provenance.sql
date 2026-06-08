-- ============================================================================
-- Migration 0005 — Provenance cho câu hỏi (phục vụ luồng CLONE)
-- ----------------------------------------------------------------------------
-- nguon         : 'le' (bài gốc tự nhập) | 'clone' (biến thể AI sinh)
-- parent_ma_cau : clone trỏ về bài gốc (self-FK). 'le' thì null.
-- clone_method  : 'manual_gemini' | 'auto_gemini' | null (câu nhập thường)
-- muc_do/khoi KHÔNG thêm per-câu — đã nằm ở Dạng (dai_ban_do). Câu thừa kế qua dang_chinh.
-- ============================================================================

alter table dai_cau_hoi add column if not exists nguon text not null default 'le';
alter table dai_cau_hoi add column if not exists parent_ma_cau text
  references dai_cau_hoi(ma_cau) on delete set null;
alter table dai_cau_hoi add column if not exists clone_method text;

create index if not exists idx_dai_cau_parent on dai_cau_hoi (parent_ma_cau);
