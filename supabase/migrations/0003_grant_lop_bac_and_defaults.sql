-- ============================================================================
-- Migration 0003 — Sửa grant thiếu cho bảng tạo sau 0001
-- ----------------------------------------------------------------------------
-- 0001 grant "on all tables" 1 lần → bảng lop_bac (tạo ở 0002) bị sót →
-- "permission denied for table lop_bac" khi anon SELECT.
-- Fix: (1) grant lại on all tables (idempotent, phủ lop_bac);
--      (2) ALTER DEFAULT PRIVILEGES để MỌI bảng/sequence claude_build tạo sau
--          tự grant cho anon/authenticated — khỏi tái diễn ở migration sau.
-- ============================================================================

grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage on all sequences in schema public to anon, authenticated;

alter default privileges for role claude_build in schema public
  grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges for role claude_build in schema public
  grant usage, select on sequences to anon, authenticated;
