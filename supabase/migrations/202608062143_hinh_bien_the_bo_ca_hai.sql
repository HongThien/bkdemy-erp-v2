-- Thùy: ĐỔI SỐ và THAY ĐIỂM là 2 KIỂU KHÁC NHAU — bỏ 'ca_hai' (gộp là sai).
-- Bảng hinh_baitoan_bien_the vừa tạo hôm nay, 0 row 'ca_hai' (đã verify) → siết CHECK an toàn.
-- Default đổi sang 'doi_dinh' (thay điểm = ca relabel cơ học, hay dùng nhất).
alter table hinh_baitoan_bien_the drop constraint if exists hinh_baitoan_bien_the_kieu_check;
alter table hinh_baitoan_bien_the alter column kieu set default 'doi_dinh';
alter table hinh_baitoan_bien_the add constraint hinh_baitoan_bien_the_kieu_check check (kieu in ('doi_so', 'doi_dinh'));
