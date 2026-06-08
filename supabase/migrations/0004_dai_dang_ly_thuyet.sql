-- ============================================================================
-- Migration 0004 — Lý thuyết đi kèm Dạng (Đại). Bảng 1-1 (anti-NULL).
-- ----------------------------------------------------------------------------
-- Mỗi Dạng kèm ĐÚNG 1 file lý thuyết (lý thuyết + phương pháp + bài mẫu gói 1 file).
-- "Có dòng = có lý thuyết; không dòng = chưa" → KHÔNG cột NULL "chưa làm" (CLAUDE.md §1.5).
-- PK = ma_dang ép 1-1. on delete cascade: xoá dạng → dọn lý thuyết theo.
-- (Hình làm sau khi bàn — chưa tạo hinh_dang_ly_thuyet ở đây.)
-- Completeness = derive: (#câu so với chuẩn 50) + (có lý thuyết?) — KHÔNG lưu sẵn.
-- ============================================================================

create table if not exists dai_dang_ly_thuyet (
  ma_dang      text primary key references dai_ban_do(ma_dang) on delete cascade,
  file_url     text not null,
  ten_file     text,
  cap_nhat_at  timestamptz not null default now()
);
