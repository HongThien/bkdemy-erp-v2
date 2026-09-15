-- ============================================================================
-- 202608211143 — ky_thi_khung_diem_mt
-- ----------------------------------------------------------------------------
-- VÌ SAO: Màn "Điểm MT" chỉ ghi điểm HS ĐẠT được (diem_co_ban/diem_nang_cao ở
--   diem_thi) — không biết đề đó tối đa bao nhiêu điểm mỗi phần, nên không hiện
--   được dạng "1.5/2". Khung điểm là thuộc tính của CẢ ĐỀ (1 khung dùng chung
--   cho mọi HS trong buổi, CEO 21/08 xác nhận), không phải riêng từng HS →
--   thuộc `ky_thi` (đại diện 1 lần thi), KHÔNG phải `diem_thi` (đại diện 1 HS).
--   Nullable: GV có thể chưa biết/không cần khung, không bắt buộc nhập.
--   Chỉ thêm cột lưu + hiển thị — CHƯA đổi công thức tinhDiemMT (thang 10),
--   việc đó để dành cho nhu cầu sau (CEO: "sau này sẽ cần tính").
--
-- MẤT GÌ: không mất gì. Chỉ ADD COLUMN nullable, không đụng dòng nào đang có.
-- ============================================================================

alter table public.ky_thi add column if not exists khung_co_ban numeric;
alter table public.ky_thi add column if not exists khung_nang_cao numeric;
