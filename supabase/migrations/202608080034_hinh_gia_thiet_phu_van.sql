-- ============================================================================
-- 202608080034 — hinh_gia_thiet_phu_van
-- ----------------------------------------------------------------------------
-- VÌ SAO: soạn tài liệu Hình theo chuỗi/cây node cần 2 khái niệm mới:
--   (1) GIẢ THIẾT PHỤ của một node (dữ kiện lẻ, đa số là vẽ thêm "gọi I = AC∩BD")
--       → bám node, hiện ở đề nếu node được hỏi, ở đầu bước nếu node ẩn trong đáp án.
--   (2) VAN trồi-giả-thiết-lên-đề đặt trên CẠNH tiền đề: bật thì giả thiết phụ của
--       tiền đề trồi lên ĐỀ của ý phụ thuộc (cho sẵn đường phụ = giảm độ khó).
--   Cả 2 đều ADDITIVE, không đụng data cũ. Đích = SUY (không thêm cột).
--   (spec: docs/spec-kho-hinh-soan-chuoi.md)
--
-- MẤT GÌ: không có (chỉ ADD COLUMN nullable / default false).
-- ============================================================================

ALTER TABLE hinh_baitoan
  ADD COLUMN IF NOT EXISTS gia_thiet_phu text;

ALTER TABLE hinh_cach_tien_de
  ADD COLUMN IF NOT EXISTS keo_gt_phu boolean NOT NULL DEFAULT false;
