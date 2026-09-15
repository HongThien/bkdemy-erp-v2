-- 202609061533 — giaibai_pool_bo_overload_cu
-- BUG lộ ngay khi verify mig 202609061526: `create or replace function fn_giaibai_pool(text[], text, int,
-- text default 'giai')` KHÔNG thay hàm 3-tham-số cũ — Postgres so khớp chữ ký theo SỐ THAM SỐ, thêm 1
-- tham số (dù có default) tạo ra OVERLOAD THỨ HAI, không "replace". Gọi hàm với đúng 3 giá trị (cách gọi
-- CŨ, ví dụ mọi nơi client đang dùng) giờ khớp CẢ HAI overload → lỗi "is not unique". Tương tự
-- fn_giaibai_dem_pool. Vá: xoá đúng 2 overload CŨ (3-tham-số / 1-tham-số), chỉ giữ bản có p_che_do.
-- MẤT GÌ (Luật xoá): 2 overload THỪA, tạo lỗi trong CÙNG buổi hôm nay (chưa ai gọi qua client thật —
-- client vẫn đang gọi qua bản MỚI vì cùng tên hàm, PostgREST/Supabase luôn ưu tiên khớp đủ tham số nhất
-- khi không truyền p_che_do... nhưng để CẢ HAI tồn tại vẫn treo lỗi "not unique" bất cứ khi nào ai gọi
-- đúng 3/1 tham số dương tính (kể cả từ SQL Editor) — phải xoá, không có cách nào khác để hết ambiguity.
drop function if exists public.fn_giaibai_pool(text[], text, int);
drop function if exists public.fn_giaibai_dem_pool(text[]);
