-- ============================================================================
-- toi_uu_erp_viec_dash_qlcl_cron — CHẠY Ở SUPABASE SQL EDITOR (claude_build không vào được schema cron).
-- Chạy SAU mig 202611112200_toi_uu_erp_viec_dash_qlcl.sql.
--  · qlcl-dang-yeu-nen: mỗi 5 phút làm mới số dạng yếu lưu sẵn (dang_yeu_hien_tai) — em cũ nhất trước, ngân sách 25 giây/lượt.
--    Thay việc widget dạng yếu tự gọi fn_qlcl_lam_moi qua mọi ô mỗi lần nhân sự mở màn.
--  · dash-viec-thang: mỗi 10 phút giữ nóng số dashboard TA/GV của THÁNG HIỆN TẠI (giờ VN); tháng cũ tính khi có người mở, lưu lại.
-- Chạy xong: Claude kiểm cron.job rồi `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname in ('qlcl-dang-yeu-nen', 'dash-viec-thang');
select cron.schedule('qlcl-dang-yeu-nen', '*/5 * * * *', $$select public._qlcl_lam_moi_nen(25)$$);
select cron.schedule('dash-viec-thang', '*/10 * * * *', $$
  select count(*) from public._dash_viec_thang('ta', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'), 8);
  select count(*) from public._dash_viec_thang('gv', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'), 8);
$$);

-- Xem lại: lịch đang có
select jobid, jobname, schedule, active, command from cron.job order by jobid;
