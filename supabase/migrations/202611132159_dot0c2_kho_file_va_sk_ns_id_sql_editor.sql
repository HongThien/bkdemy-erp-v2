-- ĐỢT 0c-2 (13/11/2026) — CHẠY TAY Ở SQL EDITOR (role ghi của repo không vào được schema storage và không sở hữu _sk_ns_id).
-- Thùy đã chạy 13/11 tối; file này chỉ để GHI SỔ (migrate.mjs --ghi-so) và để dựng lại DB từ repo biết phải chạy tay phần này.

-- (1) Kho file: sửa/xoá chỉ nhân sự; kho tài liệu thêm cũng chỉ nhân sự. HS vẫn THÊM được ảnh đại diện (avatars) và ảnh báo lỗi (kho-anh).
alter policy kho_anh_update on storage.objects using (bucket_id = 'kho-anh' and public.la_thanh_vien());
alter policy kho_anh_delete on storage.objects using (bucket_id = 'kho-anh' and public.la_thanh_vien());
alter policy kho_tl_insert on storage.objects with check (bucket_id = 'kho-tailieu' and public.la_thanh_vien());
alter policy kho_tl_update on storage.objects using (bucket_id = 'kho-tailieu' and public.la_thanh_vien());
alter policy kho_tl_delete on storage.objects using (bucket_id = 'kho-tailieu' and public.la_thanh_vien());
alter policy avatars_update on storage.objects using (bucket_id = 'avatars' and public.la_thanh_vien());
alter policy avatars_delete on storage.objects using (bucket_id = 'avatars' and public.la_thanh_vien());

-- (2) Module sự kiện: danh tính về cùng một nguồn (bỏ nhánh khớp email trong token) — xem mig 202611131831.
create or replace function public._sk_ns_id()
 returns uuid
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select public.current_nhan_su_id()
$function$;
