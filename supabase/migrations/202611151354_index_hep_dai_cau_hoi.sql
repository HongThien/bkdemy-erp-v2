-- ============================================================================
-- 202611151354 — index_hep_dai_cau_hoi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--
-- [15/11 · tối ưu] Hai INDEX HẸP (covering) cho dai_cau_hoi + cho bảng này được dọn dẹp tự động sớm hơn.
--
-- Vì sao: dai_cau_hoi (90 MB / 78 nghìn câu, ~1,2 KB/dòng: đề, lời giải, phương án…) là bảng ĐỌC ĐĨA NHIỀU NHẤT của DB (81,5 % cộng dồn; 34 % trong cửa sổ
-- đo 10:03–10:11 ngày 15/11). Các màn builder giáo trình / bản đồ / mastery tra bảng này theo ma_cau hoặc theo dang_chinh chỉ để lấy vài cột nhỏ
-- (dang_chinh, parent_ma_cau, ma_cum, loai_cau, kho_chuan, xoa_at) nhưng phải mở dòng rộng ⇒ mỗi câu = 1–2 trang heap.
-- Đo (pg_statio quanh từng lượt gọi, vai nhân sự thật), số trang HEAP dai_cau_hoi trước → sau:
--   _tl_bdm_cau_vi_tri khối 9: 11.332 → 3 · khối 12: 17.410 (2.404 trang đọc đĩa, 1.070 ms) → 3 (389–592 ms) · fn_tl_bdm_cay_chon: 4.314 → 3 ·
--   fn_bdm_cay: 1.229 → 2 · fn_tl_bdm_goi_y: 2.744 (472 đĩa) → 3. Người dùng thật trước đó: fn_tl_bdm_lui_goi_y 6 lượt × 1,3 s (ấm chỉ ~0,1 s — chậm là do đọc đĩa).
--   Không sửa hàm nào. Còn mở heap (đúng thiết kế, cần cột nội dung): fn_de_thi_thieu (to_jsonb cả dòng) · mastery ~2.400 trang / 20 em (đã nằm trong bộ nhớ).
--
-- ⚠ Trên DB đang sống hai index ĐÃ được tạo bằng CREATE INDEX CONCURRENTLY (không khoá ghi; 1,8 s + 1,6 s) lúc ~13:55 ngày 15/11, NGOÀI migrate.mjs, kèm một lượt
--   VACUUM (ANALYZE) dai_cau_hoi (5 s; visibility map 49 % → 100 % — Index Only Scan chỉ khỏi mở heap với trang đã được đánh dấu). File này để repo dựng lại được DB
--   và ghi sổ: trên DB sống phần index không làm gì (if not exists).
-- Dọn dẹp tự động: bảng này bị SỬA nhiều (duyệt câu, kiểm máy, phân dạng) ⇒ trang vừa sửa mất dấu "đã nhìn thấy hết", Index Only Scan lại phải mở heap cho tới lượt
--   autovacuum kế. Mặc định Postgres chỉ dọn khi 20 % số dòng đổi (~15 nghìn dòng; 13/11 → 15/11 dấu rớt còn 49 %). Hạ ngưỡng còn 2 % + 500 dòng (một lượt dọn ~5 s).
--   Đây là tham số lưu trữ của bảng (không đổi cột/dữ liệu, không khoá đọc/ghi).

create index if not exists dai_cau_hoi_ma_cau_hep_idx
  on public.dai_cau_hoi (ma_cau) include (dang_chinh, parent_ma_cau, ma_cum, loai_cau, kho_chuan, xoa_at);

create index if not exists dai_cau_hoi_dang_hep_idx
  on public.dai_cau_hoi (dang_chinh) include (ma_cau, parent_ma_cau, ma_cum, loai_cau, kho_chuan) where xoa_at is null;

alter table public.dai_cau_hoi set (autovacuum_vacuum_scale_factor = 0.02, autovacuum_vacuum_threshold = 500);
