-- ============================================================================
-- muc_tieu_tuan_cron — CHẠY Ở SUPABASE SQL EDITOR (claude_build không vào được schema cron).
-- Làm mới tờ MỤC TIÊU TUẦN (mig 202611131000) mỗi 5 phút, ngân sách 40 s/lượt:
--   chốt sổ tuần vừa qua (00:00 thứ Hai trở đi) · tính tờ còn thiếu / cũ của lớp đã chốt · xếp hạng + top 20.
-- Chưa chạy thì: tờ vẫn hiện (hàm đọc tự tính trực tiếp khi bảng đệm thiếu) nhưng KHÔNG có xếp hạng, KHÔNG chốt sổ tuần.
-- Chạy xong: Claude kiểm rồi `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname = 'muc-tieu-tuan';
select cron.schedule('muc-tieu-tuan', '*/5 * * * *', $$select public._mtt_lam_moi(40)$$);

select jobid, jobname, schedule, active, command from cron.job order by jobid;
