-- Xoá bảng luong_bac (bảng khúc quy đổi EXP → xu lũy tiến cũ) — Thùy gật 28/10 ("Xóa ok").
-- Đã kiểm trước khi xoá (28/10): 0 hàm (pg_proc.prosrc) · 0 view · 0 khoá ngoại trỏ vào; fn_xu_tu_exp hiện
-- = ceil(EXP/100), không đọc bảng. Màn sửa khúc (ChotXuScreen) đã xoá ở commit 2655e729.
-- 9 dòng mất (ghi lại để truy): 1000→0 · 2000→20 · 3000→30 · 4000→40 · 8000→50 · 10000→60 · 12000→70 · 15000→85 · 20000→110.
-- KHÔNG cascade: còn gì phụ thuộc thì migration phải fail để xem lại.
drop table public.luong_bac;
