-- 0013 — cấu hình chrome/setting của tài liệu (header/footer/watermark/màu…) dạng jsonb.
alter table tai_lieu add column if not exists cau_hinh jsonb not null default '{}'::jsonb;
