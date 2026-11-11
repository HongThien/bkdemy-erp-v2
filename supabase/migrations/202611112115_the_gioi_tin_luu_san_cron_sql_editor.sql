-- ============================================================================
-- the_gioi_tin_luu_san_cron — CHẠY Ở SUPABASE SQL EDITOR (claude_build không vào được schema cron).
-- Dựng lại bảng tin Thế giới BK lưu sẵn (mig 202611112114) mỗi 5 phút. Chưa chạy thì tin đứng ở lúc áp mig.
-- Chạy xong: Claude kiểm cron.job rồi `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname = 'the-gioi-tin-luu';
select cron.schedule('the-gioi-tin-luu', '*/5 * * * *', $$select public._the_gioi_tin_lam_moi()$$);

-- Xem lại: lịch đang có
select jobid, jobname, schedule, active, command from cron.job order by jobid;
