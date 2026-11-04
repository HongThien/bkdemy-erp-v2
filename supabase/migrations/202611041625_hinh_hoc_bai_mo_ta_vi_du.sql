-- Hình–Học: mỗi BÀI HỌC cũng có MÔ TẢ nhận biết + VÍ DỤ như dạng bài của Đại (Thùy 04/11: "hình cũng cần lý thuyết, mô tả, ví dụ như Đại").
-- Lý thuyết đã có ở hinh_hoc_bai_ly_thuyet. Phân dạng (B3) phải đọc đủ cả ba (luật cứng 02/11).
-- Cột mô tả/ví dụ nằm ngay trên hinh_hoc_bai (như dai_bdm_dang_bai.mo_ta / vi_du) — không đẻ bảng phụ. Thêm cột = không đổi dữ liệu cũ.
alter table hinh_hoc_bai add column if not exists mo_ta text not null default '';
alter table hinh_hoc_bai add column if not exists vi_du text not null default '';
alter table hinh_hoc_bai add column if not exists vi_du_file_url text;
alter table hinh_hoc_bai add column if not exists vi_du_ten_file text;
