-- ============================================================================
-- 202610291729 — hinh_gt_bai.loai thêm 'bai' (NGUYÊN 1 bài kho Hình luyện) — CEO 29/10, MT chế độ 2
-- ----------------------------------------------------------------------------
-- ⚠ CHẠY Ở SUPABASE SQL EDITOR: bảng hinh_gt_bai thuộc owner `postgres` (tạo tay), role migrate (claude_build)
--   không ALTER được. Chạy xong ⇒ Claude ghi sổ: node scripts/migrate.mjs --ghi-so 202610291729_hinh_gt_bai_loai_bai_sql_editor.sql
--
-- VÌ SAO: MT chọn được nguyên 1 bài trong kho Hình luyện (hinh_bai). Gán MT vào buổi ghi bài Hình sang hinh_gt_bai
--   (phan='mt') để tab chấm đọc — dòng bài kho = loai 'bai', ref_id = hinh_bai.id (mỗi ý thành 1 ô chấm lúc dựng lưới,
--   flattenGtBaiToDapAn). CHECK hiện chỉ có chuan/bienthe/y/ghep ⇒ chưa nới thì bấm "Gán buổi" cho đề có bài kho sẽ lỗi
--   "violates check constraint hinh_gt_bai_loai_check" (CLAUDE.md §2.1 — thêm giá trị vào union TS phải nới CHECK đi kèm).
-- MẤT GÌ: không. Chỉ NỚI tập giá trị hợp lệ; mọi dòng hiện có vẫn hợp lệ.
-- ============================================================================

alter table public.hinh_gt_bai drop constraint hinh_gt_bai_loai_check;
alter table public.hinh_gt_bai add constraint hinh_gt_bai_loai_check
  check (loai = any (array['chuan'::text, 'bienthe'::text, 'y'::text, 'ghep'::text, 'bai'::text]));
