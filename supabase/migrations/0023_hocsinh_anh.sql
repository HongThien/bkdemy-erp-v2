-- 0023 — ảnh đại diện học sinh (cùng bucket 'avatars' với nhân sự).
alter table hoc_sinh add column if not exists anh_url text;
