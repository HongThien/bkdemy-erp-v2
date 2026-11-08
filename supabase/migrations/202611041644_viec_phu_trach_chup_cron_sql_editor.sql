-- ============================================================================
-- viec_phu_trach_chup_cron — CHẠY Ở SUPABASE SQL EDITOR (claude_build không vào được schema cron).
-- Chụp người phụ trách mỗi 10 phút (mig 202611041642). Bắt buộc cho MT: sơ đồ tổ chức không có sổ lịch sử,
-- chỉ chụp được trong 6 giờ sau hạn — không có cron thì MT chỉ được chụp khi có người mở tab Đề xuất gậy.
-- Chạy xong: Claude kiểm cron.job rồi `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname = 'viec_chup_phu_trach';
select cron.schedule('viec_chup_phu_trach', '*/10 * * * *', $$select public.fn_viec_chup_phu_trach()$$);
