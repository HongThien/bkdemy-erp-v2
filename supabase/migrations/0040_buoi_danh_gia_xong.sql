-- Đánh giá sau buổi = task định tính (không có mốc tự nhiên như chấm bài/ET) → cần mốc HOÀN THÀNH tường minh.
-- danh_gia_xong_at != null = GV đã bấm "Hoàn thành đánh giá". null = chưa xong (task còn trong "Việc của tôi").
alter table buoi_hoc add column if not exists danh_gia_xong_at timestamptz;
