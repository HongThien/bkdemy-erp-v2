-- ============================================================================
-- toi_uu_hs_bxh_luu_san_cron — CHẠY Ở SUPABASE SQL EDITOR (claude_build không vào được schema cron).
-- Làm mới giá trị Bảng xếp hạng tính sẵn (mig 202611112211): mỗi 10 phút trong giờ có HS dùng app (06:00–23:59 giờ VN
-- = 23:00–16:59 UTC), bảng nào cũ quá 10 phút thì tính lại, cũ nhất trước, ngân sách 30 giây/lượt.
-- Đo 11/11 (ROLLBACK): làm mới TẤT CẢ ~21 bảng ≈ 14 s (A3 Toán 9 s · A2 mùa 1,8 s · A5 1 s · còn lại < 0,6 s).
-- fn_bxh chỉ đọc bản ≤ 30 phút, cùng kỳ; cũ hơn / qua nửa đêm ⇒ tự tính trực tiếp như trước (đêm không chạy cron vẫn đúng).
-- Chạy SAU khi đã áp 202611112211. Chạy xong: Claude kiểm cron.job rồi `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname = 'bxh-luu-san';
select cron.schedule('bxh-luu-san', '*/10 0-16,23 * * *', $$select public._bxh_lam_moi(30, 10)$$);

-- Xem lại: lịch đang có
select jobid, jobname, schedule, active, command from cron.job order by jobid;
