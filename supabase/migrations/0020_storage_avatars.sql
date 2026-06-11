-- ============================================================================
-- Migration 0020 — Storage bucket 'avatars' (ảnh đại diện nhân sự, sau này HS/PH đổi ava)
-- ----------------------------------------------------------------------------
-- ⚠ Chạy trong Supabase Dashboard → SQL Editor (claude_build không có quyền schema storage).
-- Public read · authenticated upload/sửa/xoá (sau này siết: mỗi người chỉ sửa ảnh mình).
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "avatars_read"   on storage.objects;
drop policy if exists "avatars_insert" on storage.objects;
drop policy if exists "avatars_update" on storage.objects;
drop policy if exists "avatars_delete" on storage.objects;

create policy "avatars_read"   on storage.objects for select to public        using (bucket_id = 'avatars');
create policy "avatars_insert" on storage.objects for insert to authenticated with check (bucket_id = 'avatars');
create policy "avatars_update" on storage.objects for update to authenticated using  (bucket_id = 'avatars');
create policy "avatars_delete" on storage.objects for delete to authenticated using  (bucket_id = 'avatars');
