-- 0095 — tai_lieu.file_url: link PDF công khai (bucket 'kho-tailieu') của bản export GẦN NHẤT.
-- Thùy 07-11: "file tài liệu tạo ra phải up supabase, gắn link để copy gửi người khác". Ghi đè mỗi lần
-- bấm "⬇ Tải PDF" (không phân biệt bản HS/GV) — luôn là bản mới nhất vừa xuất.
alter table tai_lieu add column if not exists file_url text;
