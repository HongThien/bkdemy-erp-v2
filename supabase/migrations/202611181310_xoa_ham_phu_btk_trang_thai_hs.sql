-- XOÁ hàm phụ public._btk_trang_thai_hs(uuid, text) — Thùy gật "Xoá đi" 18/11.
-- Sinh ở mig 202611181302; từ mig 202611181306 logic đã nằm thẳng trong CTE bt của fn_dbht_bang nên không còn ai gọi
-- (đã dò pg_proc.prosrc · pg_views · pg_policies · src / scripts / api: 0 chỗ). Không kèm dữ liệu nào.
drop function public._btk_trang_thai_hs(uuid, text);
