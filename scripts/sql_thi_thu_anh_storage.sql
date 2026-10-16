-- ============================================================================
-- DÁN 1 LẦN trong Supabase SQL Editor (project ERP) — bucket ẢNH TỰ LUẬN của Thi thử (Ôn thi giữa kì I).
-- Đi kèm migration 202610161341_hs_thi_thu_tu_luan_anh.sql (áp migration TRƯỚC — cần hàm my_hoc_sinh_id / la_thanh_vien).
-- Vì sao không nằm trong migration: storage.objects thuộc supabase_storage_admin, role claude_build không tạo được policy
-- (giống scripts/sql_btvn_tra_hs_storage.sql).
--
-- Bucket PRIVATE `thi-thu-anh`, đường dẫn `<hoc_sinh_id>/<bai_lam_id>/<uuid>.jpg`.
--  · HS: upload + xem ảnh của CHÍNH em (thư mục đầu = id của em). Không update/delete file (hàng DB thi_thu_anh mới là thứ xoá được).
--  · Nhân sự: xem tất cả (để TA/GV chấm từ ảnh — pha 4).
-- MẤT GÌ: không gì. Gỡ lại: drop policy "thi_thu_anh_hs_up|hs_xem|staff_xem" on storage.objects; delete from storage.buckets where id='thi-thu-anh' (khi bucket rỗng).
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('thi-thu-anh', 'thi-thu-anh', false, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "thi_thu_anh_hs_up" on storage.objects;
create policy "thi_thu_anh_hs_up" on storage.objects for insert to authenticated
  with check (bucket_id = 'thi-thu-anh' and (storage.foldername(name))[1] = public.my_hoc_sinh_id()::text);

drop policy if exists "thi_thu_anh_hs_xem" on storage.objects;
create policy "thi_thu_anh_hs_xem" on storage.objects for select to authenticated
  using (bucket_id = 'thi-thu-anh' and (storage.foldername(name))[1] = public.my_hoc_sinh_id()::text);

drop policy if exists "thi_thu_anh_staff_xem" on storage.objects;
create policy "thi_thu_anh_staff_xem" on storage.objects for select to authenticated
  using (bucket_id = 'thi-thu-anh' and public.la_thanh_vien());

-- Kiểm: phải ra 3 dòng + 1 bucket.
select policyname, cmd from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname like 'thi_thu_anh_%';
select id, public from storage.buckets where id = 'thi-thu-anh';
