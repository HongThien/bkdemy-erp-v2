-- 202609061504 — giaibai_ai_ghi_chu
-- Cột ghi_chu trên giaibai_ai_job: model tự nêu điều còn nghi ngờ / giả định đã thêm khi viết lời giải
-- (cùng lúc với do_tin, mig 202609061503) — người duyệt đọc trước khi sửa, khỏi phải tự suy luận model
-- đã đoán ở đâu. MẤT GÌ (Luật xoá): không — thêm 1 cột.
alter table public.giaibai_ai_job add column if not exists ghi_chu text;
