-- 0059 — BLOCK: mỗi phan (block) có KIỂU HIỂN THỊ (Thùy chốt model block ≈ dạng).
-- kieu = registry mở rộng: thuong (1 cột, mặc định) · 2cot · 3cot · 4cot · (bang / ve_hinh… thêm sau).
-- Câu vẫn giữ ma_dang (đo lường HS×KP không đổi) — kieu chỉ là lớp HIỂN THỊ.
alter table tai_lieu_phan add column if not exists kieu text not null default 'thuong';
