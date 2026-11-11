-- ============================================================================
-- toi_uu_hs_thanh_tuu_custom_plan
-- ----------------------------------------------------------------------------
-- VÌ SAO (audit timeout 11/11: fn_thanh_tuu_cho_nhan 6.993 lần × 479 ms TB, max 7,6 s; fn_thanh_tuu_cua_toi 433 ms TB):
-- _tt_dat_duoc / _tt_tien_do là plpgsql gọi _luot_tinh(array[p_hs], v_tu_ts, v_den_ts) (SQL inline) với biến của hàm.
-- Sau ~5 lượt gọi trong cùng một kết nối, Postgres chuyển sang KẾ HOẠCH CHUNG (generic plan) không biết em nào / cửa sổ nào
-- ⇒ quét rộng bai_lam / bai_lam_cau. PostgREST giữ kết nối lâu nên gần như mọi lượt gọi app đều rơi vào kế hoạch chung.
-- Đo 11/11 (ROLLBACK, 12 em, cùng kết nối): cho_nhan TB 108 → 30 ms (max 347 → 44), cua_toi TB 214 → 45 ms (max 615 → 69).
-- Chỉ đặt plan_cache_mode cho 2 hàm (thân giữ nguyên) — số không đổi: so cũ–mới 24 mục 0 lệch.
-- Áp SAU 202611112152 (dùng chung bản chụp chuỗi / nhiệm vụ).
--
-- MẤT GÌ: không có.
-- ============================================================================
alter function public._tt_dat_duoc(uuid) set plan_cache_mode = force_custom_plan;
alter function public._tt_tien_do(uuid) set plan_cache_mode = force_custom_plan;
