-- 202609061524 — giaibai_bo_job_api
-- Thùy sửa hướng 06/09: "luồng này KHÔNG gọi API Claude — dùng thẳng Claude Code để giải (có luồng đấy
-- rồi, scripts/hangdoi-giai.mjs), KHÔNG cần worker tự động gọi API trả phí."
-- XOÁ (Luật xoá — Thùy đã gật rõ "OK xóa bảng đi"):
--   · Bảng `giaibai_ai_job` — CHƯA CÓ dữ liệu thật (158 dòng test tạo lúc 15:00 đã tự tay xoá sạch trước
--     khi viết migration này, xác nhận `select count(*) from giaibai_ai_job` = 0 lúc viết). Mất: 0 dữ liệu.
--   · Hàm `fn_giaibai_ai_tao_job` — chỉ dùng để tạo job cho worker, không còn ai gọi.
--   · Hàm `fn_giaibai_ai_job_status` — chỉ dùng để xem tiến độ job, không còn ai gọi.
-- GIỮ NGUYÊN (không đụng — vẫn cần, xem mig sau nếu có thiết kế lại "Giải/Hoàn thiện"):
--   `fn_giaibai_dem_cho_ai`, cột `loi_giai_ai`/`dap_an_ai`/`ai_model`/`ai_de_xuat_at` trên 5 bảng câu gốc,
--   snapshot 2 cột đó trên 5 bảng *_yeu_cau_giai — đang xem lại có còn cần dưới thiết kế mới hay không.
drop function if exists public.fn_giaibai_ai_tao_job(text[], uuid, text);
drop function if exists public.fn_giaibai_ai_job_status(text[], uuid);
drop table if exists public.giaibai_ai_job;
