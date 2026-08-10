-- ============================================================================
-- 202608101643 — hinh_cach_giai_dang_id_nullable
-- ----------------------------------------------------------------------------
-- VÌ SAO: BUG NGHIÊM TRỌNG (Thùy báo 08-10) — "nhập bài toán không lưu được đáp án".
-- Root cause: `hinh_cach_giai.dang_id` NOT NULL, nhưng form `FormBaiToan.tsx` cho phép
-- để trống "Dạng" ("— chưa gắn dạng —"). Code (`luu()`) gate TOÀN BỘ khối lưu cách giải
-- (lời giải + tiền đề + bổ đề) sau `if (dangId)` — chưa chọn Dạng ⇒ CẢ KHỐI bị bỏ qua
-- IM LẶNG, không lỗi, không cảnh báo. Vì `tienDe` MẶC ĐỊNH tự điền sẵn "bài toán phía
-- trước" cho node MỚI, bug này không chỉ mất lời giải mà còn làm node mới KHÔNG NỐI
-- được vào chuỗi tiền đề nếu người tạo quên chọn Dạng — hỏng cấu trúc DAG âm thầm.
-- Fix đúng gốc: tách "có cách giải" (lời giải/tiền đề/bổ đề — dữ liệu CẤU TRÚC, phải
-- lưu được bất kể) khỏi "đã phân loại Dạng" (taxonomy, điền sau cũng được) — nới
-- `dang_id` thành optional, code sửa kèm (FormBaiToan.tsx luôn ensure cách giải khi có
-- nội dung, không còn gate theo dangId).
--
-- MẤT GÌ: không — chỉ NỚI constraint (bỏ NOT NULL), không xoá/thu hẹp gì. Data cũ
-- (mọi dòng hiện có đều đã có dang_id thật) không bị ảnh hưởng.
-- ============================================================================

alter table hinh_cach_giai alter column dang_id drop not null;
