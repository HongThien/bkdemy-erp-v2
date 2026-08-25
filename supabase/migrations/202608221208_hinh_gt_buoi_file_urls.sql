-- ⭐ 22/08 (Thùy: "làm nốt cho giống Đại — In nhanh, Copy link, Sửa tại chỗ"): link PDF tĩnh cho Hình,
-- lưu NGAY TRÊN hinh_gt_buoi (không bảng riêng) — 1 buổi tối đa 2 link (phan='lop'/'nha'), key theo phan.
-- Khác Đại (mỗi tai_lieu 1 file_url) vì 1 hinh_gt_buoi chiếu ra 2 "tài liệu" — xem listAllBuoiHinh.
alter table hinh_gt_buoi add column if not exists file_urls jsonb not null default '{}'::jsonb;
