-- ============================================================================
-- Migration 0007 — Storage bucket 'kho-anh' (ảnh đề/đáp án câu hỏi) + policies
-- ----------------------------------------------------------------------------
-- ⚠ KHÔNG áp được bằng role claude_build (DATABASE_URL) — nó KHÔNG có quyền trên
--    schema `storage` (giống `auth`). PHẢI chạy trong:
--    Supabase Dashboard → SQL Editor → dán cả file này → Run.
--
-- Sau khi chạy: bucket public 'kho-anh' tồn tại; user ĐĂNG NHẬP (authenticated)
-- được upload/sửa/xoá ảnh trong bucket; ai cũng đọc được (ảnh hiện qua public URL).
-- App lưu URL ngắn vào dai_cau_hoi.anh_de / anh_dap_an (KHÔNG còn base64 trong DB).
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('kho-anh', 'kho-anh', true)
on conflict (id) do update set public = true;

drop policy if exists "kho_anh_read"   on storage.objects;
drop policy if exists "kho_anh_insert" on storage.objects;
drop policy if exists "kho_anh_update" on storage.objects;
drop policy if exists "kho_anh_delete" on storage.objects;

create policy "kho_anh_read"   on storage.objects for select to public        using (bucket_id = 'kho-anh');
create policy "kho_anh_insert" on storage.objects for insert to authenticated with check (bucket_id = 'kho-anh');
create policy "kho_anh_update" on storage.objects for update to authenticated using  (bucket_id = 'kho-anh');
create policy "kho_anh_delete" on storage.objects for delete to authenticated using  (bucket_id = 'kho-anh');
