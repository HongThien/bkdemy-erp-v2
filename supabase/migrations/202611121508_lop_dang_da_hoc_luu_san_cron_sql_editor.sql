-- ============================================================================
-- lop_dang_da_hoc_luu_san_cron — CHẠY Ở SUPABASE SQL EDITOR (claude_build không vào được schema cron).
-- Làm mới "dạng lớp đã học" lưu sẵn (mig 202611121507) mỗi 5 phút, ngân sách 20 s/lượt.
-- Chưa chạy thì cache cũ hơn 20 phút sẽ bị bỏ qua ⇒ tính trực tiếp như trước (đúng, chỉ chậm).
-- Chạy xong: Claude kiểm rồi `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
select cron.unschedule(jobid) from cron.job where jobname = 'lop-dang-da-hoc-luu';
select cron.schedule('lop-dang-da-hoc-luu', '*/5 * * * *', $$select public._lop_dang_da_hoc_lam_moi(20)$$);

select jobid, jobname, schedule, active, command from cron.job order by jobid;
