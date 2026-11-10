-- ============================================================================
-- mastery_lam_moi cron — CHẠY Ở SUPABASE SQL EDITOR (claude_build không vào được schema cron).
-- Đổi lịch làm mới bảng mastery lưu sẵn (mig 202611101644 + 202611101731): chạy CẢ NGÀY, 5 phút/lần, ngân sách 20 giây/lượt.
-- Lý do (Thùy 10/11): lịch cũ nghỉ 17:00–22:59 ⇒ buổi tối em bẩn dồn lại, Dashboard K8 từ 2 s lên ~5 s.
-- Một lượt ~2 s cho 20 em bẩn — nhẹ, an toàn giờ cao điểm; hàm tự khoá 1 lượt (lượt trùng trả -1).
-- Lưới đêm giữ nguyên: 02:00 VN đánh bẩn tất cả.
-- Chạy xong: Claude `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname = 'mastery_lam_moi';
select cron.schedule('mastery_lam_moi', '*/5 * * * *', $c$select public.fn_mastery_lam_moi(20)$c$);

-- lưới đêm (giữ nguyên — chạy lại không sao, cùng tên thì thay)
select cron.unschedule(jobid) from cron.job where jobname = 'mastery_luoi_dem';
select cron.schedule('mastery_luoi_dem', '0 19 * * *', $c$select public.fn_mastery_danh_dau_tat_ca()$c$);   -- 02:00 giờ VN

-- Xem lại: lịch đang có
select jobid, jobname, schedule, active, command from cron.job where jobname like 'mastery%' order by jobid;
