-- ============================================================================
-- 202610282053 — buoi_tu_dong_cron_sql_editor   ⚠ CHẠY BẰNG SUPABASE SQL EDITOR (cần quyền postgres)
-- ----------------------------------------------------------------------------
-- VÌ SAO: đi kèm 202610282052 (tự đóng việc Chấm ET / Chấm BTVN của buổi không có ET / BTVN — Thùy 28/10).
--   Lịch 15 phút/lần gọi `_buoi_tu_dong_khong_et_btvn()`: buổi nào qua mốc (giờ kết thúc + 1 tiếng) mà không có ET/BTVN thì
--   khâu đó tự đóng, chậm nhất ~15 phút sau mốc (giờ đóng ghi = chính mốc nên không ai bị tính trễ).
--   claude_build KHÔNG có quyền vào schema cron ⇒ file này bắt buộc SQL Editor. Chạy SAU khi 202610282052 đã áp.
--   Chạy xong: Claude tự `node scripts/migrate.mjs --ghi-so 202610282053_buoi_tu_dong_cron_sql_editor.sql`.
--
-- MẤT GÌ (Luật xoá): Không. cron.unschedule chỉ gỡ lịch CÙNG TÊN nếu đã có ⇒ chạy lại file không nhân đôi lịch.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname = 'buoi-tu-dong-et-btvn-trong';
select cron.schedule('buoi-tu-dong-et-btvn-trong', '*/15 * * * *', $$select public._buoi_tu_dong_khong_et_btvn()$$);

-- Xem lại: lịch đang có
select jobid, jobname, schedule, active, command from cron.job order by jobid;
