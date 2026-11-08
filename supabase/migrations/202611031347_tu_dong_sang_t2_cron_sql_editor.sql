-- ============================================================================
-- 202611031347 — tu_dong_sang_t2_cron_sql_editor   ⚠ CHẠY BẰNG SUPABASE SQL EDITOR (cần quyền postgres)
-- ----------------------------------------------------------------------------
-- VÌ SAO: đi kèm 202611031346 (spec-bao-cao-tuan.md §2.6 — Thùy 03/11). Lịch 00:05 sáng THỨ HAI giờ VN (= 17:05 UTC Chủ nhật) gọi
--   `_tu_dong_sang_t2()`: chụp dạng yếu đầu tuần mới (= cuối tuần cũ) cho mọi môn + cập nhật Tổng kết tuần của tuần vừa rồi
--   (bảng Học tập tuần đọc bộ đệm đó — trước đây chỉ tính khi có người mở màn).
--   claude_build KHÔNG có quyền vào schema cron ⇒ file này bắt buộc SQL Editor. Chạy SAU khi 202611031346 đã áp.
--   Chạy xong: Claude tự `node scripts/migrate.mjs --ghi-so 202611031347_tu_dong_sang_t2_cron_sql_editor.sql`.
--
-- MẤT GÌ (Luật xoá): Không. cron.unschedule chỉ gỡ lịch CÙNG TÊN nếu đã có ⇒ chạy lại file không nhân đôi lịch.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname = 'tu-dong-sang-t2';
select cron.schedule('tu-dong-sang-t2', '5 17 * * 0', $$select public._tu_dong_sang_t2()$$);

-- Xem lại: lịch đang có
select jobid, jobname, schedule, active, command from cron.job order by jobid;
