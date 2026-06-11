-- 0019 — ảnh đại diện nhân sự (URL trong bucket 'avatars').
alter table nhan_su add column if not exists anh_url text;
