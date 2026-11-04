-- ============================================================================
-- 202611041716 — btvn_app_cap3_cron_sql_editor   ⚠ CHẠY BẰNG SUPABASE SQL EDITOR (cần quyền postgres)
-- ----------------------------------------------------------------------------
-- VÌ SAO: đi kèm 202611041715 (BTVN app cấp 3 tự đóng khi hết hạn — Thùy 04/11). claude_build KHÔNG vào được schema cron.
--   Lịch 15 phút/lần gọi `_btvn_app_tu_dong()`: hết hạn ⇒ chậm nhất ~15 phút sau là đóng (giờ đóng ghi = đúng giờ hạn).
--   KÈM lịch 28/10 `buoi-tu-dong-et-btvn-trong` (file 202610282053 CHƯA TỪNG chạy ⇒ việc tự đóng khâu ET/BTVN trống chưa hoạt động).
--   Chạy SAU khi 202611041715 đã áp. Chạy xong: Claude tự `node scripts/migrate.mjs --ghi-so` cho file này + 202610282053.
--
-- MẤT GÌ (Luật xoá): Không. cron.unschedule chỉ gỡ lịch CÙNG TÊN nếu đã có ⇒ chạy lại file không nhân đôi lịch.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname in ('btvn-app-cap3-tu-dong', 'buoi-tu-dong-et-btvn-trong');
select cron.schedule('btvn-app-cap3-tu-dong', '*/15 * * * *', $$select public._btvn_app_tu_dong()$$);
select cron.schedule('buoi-tu-dong-et-btvn-trong', '*/15 * * * *', $$select public._buoi_tu_dong_khong_et_btvn()$$);

-- Xem lại: lịch đang có
select jobid, jobname, schedule, active, command from cron.job order by jobid;
