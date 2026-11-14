-- Đợt 3 bước 7 — hai job đêm vào danh mục bộ điều phối (K4: không cron riêng). Thùy 14/11 "đi tiếp luôn".
-- Lệnh GIỮ NGUYÊN như job cron cũ. chu_ky 1200 phút + gio_chay một giờ ⇒ mỗi ngày đúng một lần, ở lượt điều phối đầu tiên của giờ đó.
--   mastery_luoi_dem  (cũ: 0 19 * * * UTC = 02:00 VN)  → 02:02 VN, ưu tiên 5: đánh dấu xong thì sổ mastery (10) tính ngay trong cùng lượt.
--   tu_luyen_so_cau   (cũ: 30 22 * * * UTC = 05:30 VN) → 05:02 VN, ưu tiên 90, ~16 s / lượt.
-- Hai job cron cũ Thùy tắt ở SQL Editor (xem cuối file). Nếu chưa kịp tắt trước đêm: mỗi việc chạy 2 lần — thừa việc, không sai số (cả hai đều tính lại từ gốc).
insert into public.tinh_san_dang_ky (ma, ten, lenh, chu_ky_phut, gio_chay, uu_tien, ngan_sach_giay, ghi_chu) values
  ('mastery_luoi_dem', 'Mastery: đánh dấu mọi em tính lại (lưới an toàn đêm)', 'public.fn_mastery_danh_dau_tat_ca()', 1200, array[2], 5, 5,
   'job cũ: mastery_luoi_dem'),
  ('tu_luyen_so_cau', 'Tự luyện: số câu theo dạng', 'public.fn_tu_luyen_so_cau_lam_moi()', 1200, array[5], 90, 30,
   'job cũ: tu_luyen_so_cau');

-- CHẠY Ở SQL EDITOR (tắt, không xoá):
-- select j.jobname, cron.alter_job(j.jobid, active := false) from cron.job j where j.jobname in ('mastery_luoi_dem', 'tu_luyen_so_cau');
-- Quay lại: đổi false thành true, và: update public.tinh_san_dang_ky set bat = false where ma in ('mastery_luoi_dem', 'tu_luyen_so_cau');
