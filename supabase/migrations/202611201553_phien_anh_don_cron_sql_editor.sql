-- Chạy MỘT LẦN ở Supabase SQL Editor (pg_cron): dọn ảnh phiên Claude đã đóng quá 30 ngày, mỗi ngày 03:30 giờ VN (= 20:30 UTC).
select cron.schedule('phien-anh-don', '30 20 * * *', $$select public.fn_phien_anh_don()$$);
