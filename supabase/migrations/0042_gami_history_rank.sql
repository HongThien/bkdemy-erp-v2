-- ============================================================================
-- Migration 0042 — Ghi HẠNG mỗi buổi vào gami_elo_history (cho Bảng thành tích).
-- ----------------------------------------------------------------------------
-- closePhase đã tính rankSession nhưng chưa lưu. Lưu rank + rank_total để:
--  · đếm "số lần Top 1" theo phase (ingame=Lớp / et=ET / mt=MT)
--  · suy "hạng cao nhất từng đạt" về sau.
-- Nullable: dòng cũ (đã đóng trước mig này) + buổi bù/bổ trợ (không Elo) = NULL.
-- ============================================================================

alter table gami_elo_history add column if not exists rank       int;
alter table gami_elo_history add column if not exists rank_total int;
