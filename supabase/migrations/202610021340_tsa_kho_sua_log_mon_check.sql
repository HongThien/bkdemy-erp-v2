-- ============================================================================
-- 202610021340 — tsa_kho_sua_log_mon_check
-- ----------------------------------------------------------------------------
-- ⚠ ÁP BẰNG SUPABASE SQL EDITOR — KHÔNG chạy được bằng `npm run migrate`:
--   bảng kho_sua_log thuộc owner `postgres` (tạo tay qua SQL Editor) ⇒ role claude_build báo
--   "must be owner of table kho_sua_log". Sau khi dán chạy xong trong SQL Editor, ghi sổ bằng:
--     node scripts/migrate.mjs --ghi-so 202610021340_tsa_kho_sua_log_mon_check.sql
--
-- VÌ SAO: kho TSA (mig 202610021339) gắn trigger trg_log_kho_sua('tsa') vào tsa_cau_hoi để ghi vết mọi lần sửa nội dung câu
--   (CLAUDE.md §4). Trigger ghi kho_sua_log.mon = 'tsa' — CHECK hiện chỉ nhận dai/hgt/khtn/anh ⇒ chưa nới thì mọi lần SỬA
--   nội dung câu TSA (noi_dung/lua_chon/dap_an/loi_giai…) bị CHECK chặn — nhập mới (INSERT) và duyệt không ảnh hưởng.
--
-- MẤT GÌ: không mất dữ liệu. DROP + ADD lại 1 CHECK, chỉ NỚI thêm 'tsa'.
-- ============================================================================
alter table public.kho_sua_log drop constraint kho_sua_log_mon_check;
alter table public.kho_sua_log add constraint kho_sua_log_mon_check check (mon = any (array['dai', 'hgt', 'khtn', 'anh', 'tsa']));
