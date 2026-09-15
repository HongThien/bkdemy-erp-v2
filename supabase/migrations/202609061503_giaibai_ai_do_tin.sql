-- 202609061503 — giaibai_ai_do_tin
-- Cột do_tin (cao/trung_binh/thap) trên giaibai_ai_job — model TỰ báo mức tin vào chính lời giải nó
-- vừa viết (đề mơ hồ/thiếu dữ kiện → thấp). Dùng để học thuật ưu tiên xem câu "thấp" trước khi duyệt
-- hàng loạt. Worker (worker/giaibai_ai.mjs) ghi cột này cùng lúc ghi loi_giai_ai.
-- MẤT GÌ (Luật xoá): không — thêm 1 cột.
alter table public.giaibai_ai_job add column if not exists do_tin text;
