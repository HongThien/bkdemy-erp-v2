-- ============================================================================
-- 202610061810 — xu_dong_bo_cron_sql_editor   ⚠ CHẠY BẰNG SUPABASE SQL EDITOR (cần quyền postgres)
-- ----------------------------------------------------------------------------
-- VÌ SAO: đi kèm 202610061809 (xu tự quy đổi realtime — Thùy 06/10).
--   ① `_xu_dong_bo` (owner claude_build) gọi fn_gami_exp_xu_thang — hàm owner postgres, đã revoke PUBLIC
--      28/09 ⇒ claude_build không gọi được ⇒ phải grant. Không grant thì HS mở ví / tủ quà đồng bộ báo lỗi quyền.
--   ② pg_cron chưa bật trên DB ⇒ bật + lịch MỖI GIỜ (phút 05) đồng bộ cho MỌI HS — để số dư đúng cả với
--      HS không mở app (tủ quà, app Hải, trợ lý đọc qlht_v_so_du_xu). Lượt chạy đầu tiên chốt nốt tháng 9.
--   Chạy xong: Claude tự `node scripts/migrate.mjs --ghi-so 202610061810_xu_dong_bo_cron_sql_editor.sql`.
--   06/10: Claude (claude_build) đã thử chạy file: `create extension pg_cron` THÀNH CÔNG (1.6.4); grant → "permission denied"
--   (hàm của postgres); cron.schedule → "permission denied for schema cron". ⇒ 2 lệnh đó bắt buộc SQL Editor.
--   Job chạy dưới postgres ⇒ mig 1809 đã grant execute _xu_dong_bo cho postgres.
--
-- MẤT GÌ (Luật xoá): Không. cron.unschedule chỉ gỡ lịch CÙNG TÊN nếu đã có (chạy lại file không nhân đôi lịch).
-- ============================================================================
grant execute on function public.fn_gami_exp_xu_thang(text, uuid, text) to claude_build;

create extension if not exists pg_cron;

select cron.unschedule(jobid) from cron.job where jobname = 'xu-dong-bo';
select cron.schedule('xu-dong-bo', '5 * * * *', $$select * from public._xu_dong_bo()$$);
