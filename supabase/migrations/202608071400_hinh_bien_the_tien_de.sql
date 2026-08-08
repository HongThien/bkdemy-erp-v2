-- ============================================================================
-- 202608071400 — hinh_baitoan_bien_the.tien_de_ids (tiền đề BÀI-tầng, ĐÓNG BĂNG)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy): lứa là artifact ĐÃ CHỐT. Quan hệ tiền đề GIỮA các bài trong lứa phải ĐÓNG BĂNG lúc clone,
--   KHÔNG derive từ node graph sống — vì về sau node có thể đẻ thêm node ở giữa (A→C thành A→B→C), nhưng
--   mối quan hệ của những bài ĐÃ XÂY (A'→C') phải còn nguyên. `tien_de_ids` = id các biến thể tiền đề TRỰC
--   TIẾP của biến thể này (trong cùng lứa), snapshot lúc clone-chuỗi. Bounded = số cạnh node của lứa.
--   `lua_id` vẫn giữ để gom/hiển thị lứa; tiền đề đọc từ cột này, không derive.
-- MẤT GÌ: không mất gì — thêm 1 cột mảng (mặc định rỗng) + index.
-- ============================================================================
alter table hinh_baitoan_bien_the add column if not exists tien_de_ids uuid[] not null default '{}';
create index if not exists hinh_baitoan_bien_the_tiende_gin on hinh_baitoan_bien_the using gin (tien_de_ids);
