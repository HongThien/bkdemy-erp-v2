-- ============================================================================
-- tu_luyen_so_cau cron — CHẠY Ở SUPABASE SQL EDITOR (claude_build không vào được schema cron).
-- Làm mới số câu theo dạng của Tự luyện chọn chủ đề (mig 202611102121_tu_luyen_so_cau_tinh_san): mỗi sáng 05:30 giờ VN
-- (22:30 UTC hôm trước), ngoài giờ HS học. Kho nhập câu mới ⇒ dạng mới có câu hiện ra từ sáng hôm sau.
-- Chạy xong: Claude `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname = 'tu_luyen_so_cau';
select cron.schedule('tu_luyen_so_cau', '30 22 * * *', $c$select public.fn_tu_luyen_so_cau_lam_moi()$c$);

-- Xem lại
select jobid, jobname, schedule, active, command from cron.job where jobname = 'tu_luyen_so_cau';
