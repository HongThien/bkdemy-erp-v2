-- ============================================================================
-- 202607221643 — tai_lieu_phan_hien_lt
-- ----------------------------------------------------------------------------
-- VÌ SAO: cần bật/tắt lý thuyết theo TỪNG dạng trong 1 buổi, không phải theo cả
-- doc như cau_hinh.inLyThuyet hiện có (vd 1 buổi vừa học dạng mới — hiện LT —
-- vừa ôn dạng cũ — ẩn LT). Cột mới, chỉ áp cho phan loai_phan='dang'.
--
-- MẤT GÌ: không mất gì — thêm cột mới với default true, mọi phan cũ giữ nguyên
-- hành vi hiện tại (hiện LT nếu kho có nội dung), không đổi bản in nào đang có.
-- ============================================================================

alter table tai_lieu_phan add column hien_lt boolean not null default true;
