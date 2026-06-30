-- 0058 — TÀI LIỆU THEO MÔN: chuẩn hoá tai_lieu.mon về NHÃN MON_LIST ('Toán'/'KHTN'…) khớp lop/Elo/nhan_su_mon.
-- Trước: mig 0050 đặt default 'toan' (chữ thường) → lệch toàn hệ → không lọc/dispatch được. Sửa 1 lần.
update tai_lieu set mon = 'Toán' where mon is null or mon = 'toan';
alter table tai_lieu alter column mon set default 'Toán';
