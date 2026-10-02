-- ============================================================================
-- 202610021200 — anh_kho_sua_log_mon_check
-- ----------------------------------------------------------------------------
-- ⚠ ÁP BẰNG SUPABASE SQL EDITOR — KHÔNG chạy được bằng `npm run migrate`:
--   bảng kho_sua_log thuộc owner `postgres` (tạo tay qua SQL Editor) ⇒ role claude_build báo
--   "must be owner of table kho_sua_log". Sau khi dán chạy xong trong SQL Editor, ghi sổ bằng:
--     node scripts/migrate.mjs --ghi-so 202610021200_anh_kho_sua_log_mon_check.sql
--
-- VÌ SAO: kho Anh (mig 202610021156) gắn trigger trg_log_kho_sua('anh') vào anh_cau_hoi để ghi vết
--   mọi lần sửa nội dung câu (CLAUDE.md §4). Trigger ghi kho_sua_log.mon = 'anh' — CHECK hiện chỉ nhận
--   dai/hgt/khtn ⇒ chưa nới thì mọi lần SỬA nội dung câu Anh bị chặn.
--
-- MẤT GÌ: không mất dữ liệu. DROP + ADD lại 1 CHECK, chỉ NỚI thêm 'anh'.
-- ============================================================================
alter table public.kho_sua_log drop constraint kho_sua_log_mon_check;
alter table public.kho_sua_log add constraint kho_sua_log_mon_check check (mon = any (array['dai', 'hgt', 'khtn', 'anh']));
