-- ============================================================================
-- 0082 — DUYỆT CHẤT LƯỢNG v2 (Thùy chốt 07-05 lần 2): thêm TIẾN ĐỘ vào lượt duyệt
-- (trước chỉ có chất lượng). Tiến độ = hệ tự ĐỀ XUẤT theo thang trễ-hạn (4 mức:
-- đúng hạn/chậm cấp 1/2/3), người CHỐT CUỐI — đổi khác đề xuất PHẢI ghi lý do
-- (chống nhân sự tự ý sửa hiệu suất cho nhau). HIỆU SUẤT = auto sinh từ tiến độ+
-- chất lượng lúc duyệt (snapshot đóng băng, giống pattern hoa_don_dong.snapshot).
-- ============================================================================
alter table viec_van_hanh_duyet add column if not exists tien_do          numeric not null default 100;
alter table viec_van_hanh_duyet add column if not exists tien_do_de_xuat  numeric not null default 100;
alter table viec_van_hanh_duyet add column if not exists tien_do_ly_do    text;  -- bắt buộc nếu tien_do ≠ tien_do_de_xuat (validate ở seam)
alter table viec_van_hanh_duyet add column if not exists hieu_suat        numeric;
