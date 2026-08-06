-- FIX deploy-ordering (CLAUDE.md §2.1): migration trước siết CHECK bỏ 'ca_hai', nhưng bundle app đang chạy
-- (dev HMR giữ state cũ, hoặc Vercel chưa build bản mới) CÒN gửi kieu='ca_hai' → INSERT bị chặn đúng lúc
-- user bấm Lưu ("violates check constraint"). Bài học: KHÔNG siết enum khi client cũ còn có thể gửi giá trị cũ.
-- Nới lại CHECK cho nhận 'ca_hai' → mọi bundle chạy được. UI/type v2 chỉ TẠO doi_so/doi_dinh; 'ca_hai' chỉ
-- để bundle cũ không vỡ, không ai tạo mới. (Siết lại về 2 giá trị CHỈ sau khi chắc mọi client đã lên bản mới.)
alter table hinh_baitoan_bien_the drop constraint if exists hinh_baitoan_bien_the_kieu_check;
alter table hinh_baitoan_bien_the add constraint hinh_baitoan_bien_the_kieu_check check (kieu in ('doi_so', 'doi_dinh', 'ca_hai'));
