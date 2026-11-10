-- ============================================================================
-- phong_so_luu_san_cron — CHẠY Ở SUPABASE SQL EDITOR (claude_build không vào được schema cron).
-- Làm mới số Phòng làm việc lưu sẵn (mig 202611101537): mỗi 5 phút, ghế nào cũ quá 10 phút thì tính lại,
-- ngân sách 25 giây/lượt (cả hệ ~30 giây ⇒ mọi ghế mới trong ≤10 phút).
-- Chạy xong: Claude kiểm cron.job rồi `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname = 'phong-so-luu-san';
select cron.schedule('phong-so-luu-san', '*/5 * * * *', $$select public._phong_so_lam_moi(25, 10)$$);

-- Xem lại: lịch đang có
select jobid, jobname, schedule, active, command from cron.job order by jobid;
