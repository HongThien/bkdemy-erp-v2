-- ============================================================================
-- Migration 0002 — Bỏ tầng Chương + thêm chiều "bậc lớp" (class-tier scope)
-- ----------------------------------------------------------------------------
-- Quyết định (Thùy duyệt):
--  1) BỎ tầng Chương ở Đại. Chương phạm vi quá rộng, không dùng để đánh giá →
--     cây Đại còn 3 tầng: Chủ đề → Chuyên đề → Dạng.
--  2) THÊM chiều "bậc lớp" S>A>B>C cho MỖI dạng (cả Đại lẫn Hình).
--     bac_toi_thieu = bậc lớp THẤP NHẤT còn học dạng đó; lớp bậc T học dạng D
--     iff thu_tu(T) >= thu_tu(D.bac_toi_thieu) (tập "lớp học" đóng-lên-trên).
--     ĐỘC LẬP với muc_do (độ khó 1–5) — đây là phạm vi kiến thức, không phải độ khó.
--     Tác dụng: must-exist trở thành TƯƠNG ĐỐI theo bậc lớp (mẫu số đánh giá đúng).
--  ⚠ KHÔNG nhầm với `khoi` (khối lớp 6..12 = grade). Đây là bậc/hạng lớp.
-- Bảng đang rỗng (0 dòng) → drop cột + thêm NOT NULL không cần default/backfill.
-- ============================================================================

-- ───────────────────── Danh mục bậc lớp (controlled) ─────────────────────
create table if not exists lop_bac (
  ma      text primary key,            -- 'S' | 'A' | 'B' | 'C' (mã = giá trị có nghĩa)
  ten     text not null,
  thu_tu  smallint not null unique     -- cao = bậc cao; so sánh ">=" để suy "lớp nào học"
);

insert into lop_bac (ma, ten, thu_tu) values
  ('S', 'Lớp S', 4),
  ('A', 'Lớp A', 3),
  ('B', 'Lớp B', 2),
  ('C', 'Lớp C', 1)
on conflict (ma) do nothing;

-- ───────────────────── ĐẠI: bỏ Chương, thêm bậc lớp ──────────────────────
alter table dai_ban_do drop column if exists ma_chuong;
alter table dai_ban_do drop column if exists ten_chuong;

alter table dai_ban_do
  add column if not exists bac_toi_thieu text not null
    references lop_bac(ma) on delete restrict;

-- ───────────────────── HÌNH: thêm bậc lớp ────────────────────────────────
-- (Hình không có Chương; bậc lớp gắn ở dạng-hình = KP, ý thừa kế qua dạng-hình.)
alter table hinh_ban_do
  add column if not exists bac_toi_thieu text not null
    references lop_bac(ma) on delete restrict;

-- Index lọc theo bậc (đánh giá quét "dạng có bac_toi_thieu <= bậc lớp HS")
create index if not exists idx_dai_ban_do_bac  on dai_ban_do  (bac_toi_thieu);
create index if not exists idx_hinh_ban_do_bac on hinh_ban_do (bac_toi_thieu);
