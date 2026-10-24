-- ============================================================================
-- 202610242150 — mastery_moi_khong_inline
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   App HS "Rèn lại điểm yếu" timeout (Thùy báo 24/10, sau khi bật bản đồ mới): fn_tu_luyen_sinh_tu_dong 17–92 s/lượt. Gốc:
--   fn_mastery_cells_moi / _bdm là hàm SQL 1 câu ⇒ Postgres INLINE vào truy vấn gọi; điều kiện của người gọi (vd
--   _luyen_con_cho_dang(...) > 0 ở _tu_luyen_chon_dang) bị đẩy xuống chạy theo từng lượt đo — 66 s, tính xong rồi lọc chỉ 2 s.
--   Gắn SET search_path ⇒ hàm KHÔNG còn inline được (luôn tính xong rồi trả bảng). Kết quả y hệt.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ thêm cấu hình search_path cho 2 hàm.
-- ============================================================================

alter function fn_mastery_cells_moi(uuid[], boolean, timestamptz, integer, integer, integer, timestamptz) set search_path = public;
alter function fn_mastery_cells_bdm(uuid[], boolean, timestamptz, integer, integer, integer, timestamptz) set search_path = public;
