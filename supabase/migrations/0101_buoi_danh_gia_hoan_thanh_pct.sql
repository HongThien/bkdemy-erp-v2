-- 0101 — Đánh giá sau buổi: thêm "Mức độ hoàn thành buổi học" (GV ước lượng %, mốc cách 5%) cạnh nhận
-- xét — Thùy 07-16: "PH/GV nhanh chóng định lượng tương đối". Cùng logic anti-NULL với nhan_xet: NULL =
-- chưa ước lượng (không phải 0%). check constraint chặn giá trị lẻ (không đúng mốc 5%) ở tầng DB.
alter table buoi_danh_gia add column if not exists hoan_thanh_pct smallint;
alter table buoi_danh_gia drop constraint if exists buoi_danh_gia_hoan_thanh_pct_check;
alter table buoi_danh_gia add constraint buoi_danh_gia_hoan_thanh_pct_check
  check (hoan_thanh_pct is null or (hoan_thanh_pct between 0 and 100 and hoan_thanh_pct % 5 = 0));
