-- ============================================================================
-- Migration 0046 — Cho phép phase='btvn' trong gami_session_problems
-- ----------------------------------------------------------------------------
-- 0045 thêm BTVN trong buổi nhưng QUÊN nới CHECK phase (vẫn chỉ ingame|et|mt).
-- → ensureBTVNProblems insert phase='btvn' bị constraint chặn (400); BtvnTab nuốt
--   lỗi trong catch → hiển thị "Chưa có BTVN" dù doc BTVN khớp lớp+ngày.
-- Fix: nới CHECK thêm 'btvn'.
-- ============================================================================
alter table gami_session_problems drop constraint if exists gami_session_problems_phase_check;
alter table gami_session_problems add constraint gami_session_problems_phase_check
  check (phase in ('ingame', 'et', 'mt', 'btvn'));
