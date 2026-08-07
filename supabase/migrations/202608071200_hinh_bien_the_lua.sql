-- ============================================================================
-- 202608071200 — hinh_baitoan_bien_the.lua_id (biến thể theo LỨA)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy): clone ĐỔI ĐỈNH cả một CHUỖI tiền đề bằng MỘT map điểm nhất quán → các biến thể sinh ra
--   phải nhóm thành "LỨA" (cùng bộ điểm/số, cùng một hình). Cùng `lua_id` = cùng một lứa clone.
--   Tiền đề giữa các biến thể trong lứa = DERIVE (node tiền đề × cùng lua_id), KHÔNG lưu cạnh riêng
--   (tránh loạn tổ hợp M×N×K). `lua_id` null = biến thể LẺ đứng một mình (như đang có).
-- MẤT GÌ: không mất gì — chỉ THÊM 1 cột nullable + 1 index.
-- ============================================================================
alter table hinh_baitoan_bien_the add column if not exists lua_id uuid;
create index if not exists hinh_baitoan_bien_the_lua_idx on hinh_baitoan_bien_the(lua_id);
