-- Chấm bài trên lớp: 1 mức 1-5 (gộp kết quả/trình bày/tốc độ) thay vì 3 chiều. ET vẫn dùng result+loi.
-- muc null = chưa chấm theo thang 5 (ET/ingame cũ). points vẫn lưu để engine Elo chạy.
alter table gami_grades add column if not exists muc smallint;
