-- ============================================================================
-- Migration 0008 — Storage bucket 'kho-tailieu' (file lý thuyết / tài liệu) + policies
-- ----------------------------------------------------------------------------
-- ⚠ Chạy trong Supabase Dashboard → SQL Editor (claude_build không có quyền schema storage).
-- Public read (HS đọc qua URL) · authenticated mới upload/sửa/xoá.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('kho-tailieu', 'kho-tailieu', true)
on conflict (id) do update set public = true;

drop policy if exists "kho_tl_read"   on storage.objects;
drop policy if exists "kho_tl_insert" on storage.objects;
drop policy if exists "kho_tl_update" on storage.objects;
drop policy if exists "kho_tl_delete" on storage.objects;

create policy "kho_tl_read"   on storage.objects for select to public        using (bucket_id = 'kho-tailieu');
create policy "kho_tl_insert" on storage.objects for insert to authenticated with check (bucket_id = 'kho-tailieu');
create policy "kho_tl_update" on storage.objects for update to authenticated using  (bucket_id = 'kho-tailieu');
create policy "kho_tl_delete" on storage.objects for delete to authenticated using  (bucket_id = 'kho-tailieu');
