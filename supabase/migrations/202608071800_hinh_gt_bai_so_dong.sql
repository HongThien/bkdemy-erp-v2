-- 202608071800 — hinh_gt_bai.so_dong: số DÒNG KẺ cho HS viết (BTVN), điều chỉnh per-bài (như linesByCau của Đại).
-- null = dùng mặc định của bản in. MẤT GÌ: không mất gì — thêm 1 cột nullable.
alter table hinh_gt_bai add column if not exists so_dong integer;
