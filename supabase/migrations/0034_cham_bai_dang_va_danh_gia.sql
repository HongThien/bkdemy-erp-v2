-- ============================================================================
-- Migration 0034 — Chấm bài trên lớp map DẠNG + Đánh giá sau buổi (ADR 15/06)
-- ----------------------------------------------------------------------------
-- #1 Chấm bài trên lớp (ingame): mỗi bài map 1 DẠNG (ma_dang) — dữ liệu QUÁ TRÌNH.
--    ma_dang = TEXT, KHÔNG FK: dạng đa hình theo môn (Toán dai_ban_do, Hình hinh_ban_do,
--    môn khác sau) — 1 FK không trỏ xuyên môn được. Chỉ lưu chuỗi mã.
-- #2 Đánh giá sau buổi (GV): nhận xét per-HS + verdict per-(HS×dạng) {0/0.5/1} = phép
--    đo SUMMATIVE in-class (feed mastery). Anti-NULL §1.5: chỉ có dòng khi GV đã cho.
-- ============================================================================

-- #1: bài trên lớp gắn dạng
alter table gami_session_problems add column if not exists ma_dang text;

-- #2a: nhận xét định tính per HS (1 buổi × 1 HS = 1 nhận xét)
create table if not exists buoi_danh_gia (
  buoi_hoc_id uuid not null references buoi_hoc(id) on delete cascade,
  hoc_sinh_id uuid not null references hoc_sinh(id),
  nhan_xet    text,
  graded_by   uuid,
  updated_at  timestamptz not null default now(),
  primary key (buoi_hoc_id, hoc_sinh_id)
);

-- #2b: verdict per (HS × dạng) = phép đo. diem ∈ {0, 0.5, 1}. KHÔNG có dòng = chưa đánh giá.
create table if not exists buoi_danh_gia_dang (
  buoi_hoc_id uuid not null references buoi_hoc(id) on delete cascade,
  hoc_sinh_id uuid not null references hoc_sinh(id),
  ma_dang     text not null,
  diem        numeric not null check (diem in (0, 0.5, 1)),
  graded_by   uuid,
  updated_at  timestamptz not null default now(),
  primary key (buoi_hoc_id, hoc_sinh_id, ma_dang)
);

-- RLS member-gate (bảng mới — 0026 chỉ phủ bảng cũ, phải khai tay)
alter table buoi_danh_gia      enable row level security;
alter table buoi_danh_gia_dang enable row level security;
drop policy if exists buoi_danh_gia_member_all      on buoi_danh_gia;
drop policy if exists buoi_danh_gia_dang_member_all on buoi_danh_gia_dang;
create policy buoi_danh_gia_member_all      on buoi_danh_gia      for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy buoi_danh_gia_dang_member_all on buoi_danh_gia_dang for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
