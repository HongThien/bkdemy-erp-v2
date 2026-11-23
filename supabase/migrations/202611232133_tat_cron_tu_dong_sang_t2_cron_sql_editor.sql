-- ============================================================================
-- 202611232133 — tat_cron_tu_dong_sang_t2   ⚠ CHẠY BẰNG SUPABASE SQL EDITOR (schema cron thuộc postgres)
-- ----------------------------------------------------------------------------
-- VÌ SAO: lịch riêng 'tu-dong-sang-t2' (mig 202611031347) chụp cả hệ trong một lượt — đêm 22/11 hết giờ 2 phút, không ra ảnh đầu tuần 23/11.
--   Việc này đã chuyển vào bộ điều phối (dòng 'chup_dau_tuan', mig 202611232132, chụp từng ô môn × khối có ngân sách).
--   Chạy xong: Claude tự `node scripts/migrate.mjs --ghi-so 202611232133_tat_cron_tu_dong_sang_t2_cron_sql_editor.sql`.
-- MẤT GÌ (Luật xoá): Không. Chỉ TẮT lịch (active = false), không xoá — bật lại được bằng dòng QUAY LẠI.
-- ============================================================================
select j.jobname, cron.alter_job(j.jobid, active := false) from cron.job j where j.jobname = 'tu-dong-sang-t2';

-- QUAY LẠI (chỉ khi cần):
-- select cron.alter_job(j.jobid, active := true) from cron.job j where j.jobname = 'tu-dong-sang-t2';

-- Xem lại
select jobid, jobname, schedule, active from cron.job order by jobid;
