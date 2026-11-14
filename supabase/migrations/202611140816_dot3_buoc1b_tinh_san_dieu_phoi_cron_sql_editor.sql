-- Đợt 3 bước 1b — CHẠY Ở SQL EDITOR (schema cron thuộc postgres), rồi ghi sổ bằng `migrate.mjs --ghi-so`.
-- Chạy PHẦN A trước, chờ Claude xác nhận lượt đầu trong tinh_san_chay, rồi mới chạy PHẦN B.

-- ───────── PHẦN A: bật 1 job điều phối (lệch 2 phút so với các job cũ để không chạy chồng) ─────────
select cron.schedule('tinh-san-dieu-phoi', '2-59/5 * * * *', 'call public._tinh_san_chay(100)');

-- ───────── PHẦN B: TẮT (không xoá) 8 job cũ — bộ điều phối đã chạy đúng các lệnh này ─────────
select j.jobname, cron.alter_job(j.jobid, active := false)
  from cron.job j
 where j.jobname in ('mastery_lam_moi', 'the-gioi-tin-luu', 'qlcl-dang-yeu-nen', 'dash-viec-thang',
                     'phong-so-luu-san', 'bxh-luu-san', 'lop-dang-da-hoc-luu', 'muc-tieu-tuan');

-- ───────── QUAY LẠI (chỉ khi cần): bật lại 8 job cũ, tắt job điều phối ─────────
-- select j.jobname, cron.alter_job(j.jobid, active := true) from cron.job j
--  where j.jobname in ('mastery_lam_moi', 'the-gioi-tin-luu', 'qlcl-dang-yeu-nen', 'dash-viec-thang',
--                      'phong-so-luu-san', 'bxh-luu-san', 'lop-dang-da-hoc-luu', 'muc-tieu-tuan');
-- select cron.alter_job(j.jobid, active := false) from cron.job j where j.jobname = 'tinh-san-dieu-phoi';
