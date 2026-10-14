-- ============================================================================
-- 202610141558 — task_nhac_han_cron_sql_editor   ⚠ CHẠY BẰNG SUPABASE SQL EDITOR (cần quyền postgres)
-- ----------------------------------------------------------------------------
-- VÌ SAO: đi kèm 202610141557 (nhắc hạn task vào hòm thư — Thùy chốt 14/10).
--   ① Đặt lịch MỖI SÁNG 8h giờ VN = 01:00 UTC (pg_cron tính giờ theo UTC) gọi `_task_nhac_han()`.
--   ② Gỡ lịch cũ của hệ giao việc đã bỏ: `giaoviec_housekeeping` (Thùy gật 14/10) — hàm của nó đã bị xoá ở mig …0119
--      nên nếu lịch còn thì mỗi lần chạy là một lần báo lỗi trong cron.job_run_details.
--   claude_build KHÔNG có quyền vào schema cron ("permission denied for schema cron", đo 06/10 + 14/10) ⇒ file này
--   bắt buộc SQL Editor. Chạy xong: Claude tự `node scripts/migrate.mjs --ghi-so 202610141558_task_nhac_han_cron_sql_editor.sql`.
--
-- MẤT GÌ (Luật xoá): lịch pg_cron tên 'giaoviec_housekeeping' (hoặc lịch nào gọi hàm giaoviec_housekeeping) nếu còn.
--   Không đụng dữ liệu. cron.unschedule 'task-nhac-han' chỉ gỡ lịch CÙNG TÊN nếu đã có ⇒ chạy lại file không nhân đôi lịch.
-- ============================================================================
select cron.unschedule(jobid) from cron.job
where jobname = 'giaoviec_housekeeping' or command ilike '%giaoviec_housekeeping%';

select cron.unschedule(jobid) from cron.job where jobname = 'task-nhac-han';
select cron.schedule('task-nhac-han', '0 1 * * *', $$select public._task_nhac_han()$$);

-- Xem lại: lịch đang có
select jobid, jobname, schedule, active, command from cron.job order by jobid;
