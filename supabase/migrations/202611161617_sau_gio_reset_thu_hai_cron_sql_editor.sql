-- ============================================================================
-- sau_gio_reset_thu_hai_cron — CHẠY Ở SUPABASE SQL EDITOR (claude_build không vào được schema cron).
-- 00:05 thứ Hai giờ VN (= 17:05 Chủ nhật UTC) huỷ mọi bổ trợ sau giờ chưa thực hiện của tuần cũ (mig 202611161617_sau_gio_reset_thu_hai).
-- Hàm chạy lại được nhiều lần; thêm lượt 00:35 phòng lượt đầu hết ngân sách.
-- Chạy xong: Claude kiểm rồi `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname in ('sau-gio-reset-thu-hai', 'sau-gio-reset-thu-hai-2');
select cron.schedule('sau-gio-reset-thu-hai', '5 17 * * 0', $$select public._btnhe_reset_tuan(60)$$);
select cron.schedule('sau-gio-reset-thu-hai-2', '35 17 * * 0', $$select public._btnhe_reset_tuan(60)$$);

select jobid, jobname, schedule, active, command from cron.job order by jobid;
