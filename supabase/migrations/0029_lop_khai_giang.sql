-- 0029 — ngày KHAI GIẢNG là thuộc tính của LỚP (cổng nghiệp vụ sinh buổi học).
-- Khác với thoi_khoa_bieu.hieu_luc_tu/den (cơ chế kỹ thuật đổi-lịch-giữa-năm).
-- Luật suy buổi: ngày ≥ lop.ngay_khai_giang AND slot TKB hiệu lực tại ngày đó.
alter table lop add column if not exists ngay_khai_giang date;

-- Backfill năm học 2026-27 (Thùy chốt 06-12): K9 + K12 học từ 16/6, khối khác 1/7.
update lop set ngay_khai_giang = '2026-06-16' where khoi in (9, 12) and trang_thai = 'dang_hoc' and ngay_khai_giang is null;
update lop set ngay_khai_giang = '2026-07-01' where (khoi not in (9, 12) or khoi is null) and trang_thai = 'dang_hoc' and ngay_khai_giang is null;
