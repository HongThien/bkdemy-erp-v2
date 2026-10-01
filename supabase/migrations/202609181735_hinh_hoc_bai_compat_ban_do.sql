-- ============================================================================
-- 202609181735 — HÌNH HỌC · Bài: compat dai_ban_do (fix "chọn bài không load gì")
-- ----------------------------------------------------------------------------
-- LỖI (CEO 18/09): giáo trình mới nhánh 'hinh_hoc', khối 7S1, chọn Bài "Tổng ba góc của
--   một tam giác" (HH00001) — DangPicker thấy Bài + confirm được, nhưng buổi hiện RỖNG
--   không load dạng nào.
--
-- NGUYÊN NHÂN: getTaiLieuFull (tailieu.ts:531) resolve dạng bằng
--   `supabase.from(K.banDoTbl).select('ma_dang,ten_dang,muc_do,bac_toi_thieu,ma_chuyen_de,ten_chuyen_de')`
--   Với 'hinh_hoc' → banDoTbl='hinh_hoc_bai' — bảng CHỈ có cột `ma_bai/ten_bai/khoi/thu_tu/bac_toi_thieu`,
--   KHÔNG có `ma_dang/ten_dang/muc_do/ma_chuyen_de/ten_chuyen_de`. PostgREST fail select ⇒ dangs = []
--   ⇒ buổi hiển thị "dạng rỗng" dù ref_ma đã lưu.
--
-- FIX: thêm 5 cột compat vào `hinh_hoc_bai` để bảng "trông giống" `dai_ban_do`:
--   - `ma_dang` GENERATED ALWAYS AS (ma_bai) STORED — alias PK để select `.in('ma_dang', ...)` chạy.
--   - `ten_dang` GENERATED ALWAYS AS (ten_bai) STORED — alias tên.
--   - `muc_do` smallint, `ma_chuyen_de` text, `ten_chuyen_de` text — nullable, chưa dùng, cho select không fail.
--
--   Cách generated GIỮ NGUYÊN cột gốc (ma_bai/ten_bai + FK từ hinh_hoc_bai_ly_thuyet/hinh_hoc_cum_bai)
--   ⇒ KHÔNG cần đụng TS code (hinhhoc.ts CRUD Bài vẫn dùng ma_bai/ten_bai). Chỉ getTaiLieuFull đọc
--   thêm được ma_dang/ten_dang qua alias.
--
-- Sửa RPC count_cau_by_bai_hh: join dùng cột gốc `b.ma_bai` (không đổi so với mig 3).
--
-- MẤT GÌ: không. Chỉ THÊM 5 cột (3 gen + 2 nullable). Không xoá/rename gì.
-- ============================================================================

alter table hinh_hoc_bai
  add column if not exists ma_dang text generated always as (ma_bai) stored,
  add column if not exists ten_dang text generated always as (ten_bai) stored,
  add column if not exists muc_do smallint,
  add column if not exists ma_chuyen_de text,
  add column if not exists ten_chuyen_de text;

-- Index trên ma_dang (dùng nhiều ở `.in('ma_dang', dangMas)` của getTaiLieuFull).
create index if not exists hinh_hoc_bai_ma_dang_idx on hinh_hoc_bai (ma_dang);
