-- Đợt 5 (bước chuẩn bị) — mastery_luu_san thêm cột lan_cuoi. Thùy gật 14/11 "Sửa màn tự luyện".
-- TÁCH RIÊNG khỏi migration đổi hàm: thêm cột cần khoá độc quyền trên bảng, phải xong trong tích tắc —
-- không được nằm chung giao dịch với bước chạy lâu (bài học 14/11: lượt chạy thử gộp cả hai đã giữ khoá bảng ~7 phút).
-- Cột chưa ai đọc / ghi cho tới migration kế. NULL = dòng chưa được tính lại từ khi có cột (hàm đọc gặp NULL thì tính trực tiếp).
alter table public.mastery_luu_san add column lan_cuoi timestamptz;
comment on column public.mastery_luu_san.lan_cuoi is 'Lần đo gần nhất của nút trong cửa sổ 30 ngày lúc tính (max t). Dùng cho "có đo gần đây không" mà không quét lại lịch sử.';
