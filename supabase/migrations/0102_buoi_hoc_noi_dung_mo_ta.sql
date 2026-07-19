-- 0102 — Đánh giá sau buổi: thêm "Nội dung buổi học" (hiện trên ảnh gửi PH ET) + "Mô tả" (nội bộ, GV/TA
-- xem khi chấm/đánh giá — vd "đây là nội dung nâng cao thuộc phần 10 điểm trong đề thi..."). Thùy 07-19.
-- Cả 2 ở CẤP BUỔI (buoi_hoc), KHÔNG phải cấp học sinh (buoi_danh_gia) — nội dung/mô tả là chung cho cả lớp
-- trong buổi đó, không riêng từng HS (khác nhan_xet/hoan_thanh_pct vốn per-HS). Anti-NULL: NULL = chưa
-- nhập (không phải rỗng) — "có bài có mô tả có bài ko" đúng nghĩa optional, không ép nhập.
alter table buoi_hoc add column if not exists noi_dung_buoi text;
alter table buoi_hoc add column if not exists mo_ta text;
