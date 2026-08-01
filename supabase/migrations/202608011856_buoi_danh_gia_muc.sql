-- ============================================================================
-- 202608011856 — buoi_danh_gia_muc
-- ----------------------------------------------------------------------------
-- VÌ SAO: Đổi cách GV chấm buổi từ % (hoan_thanh_pct) sang MỨC 1..5 (định tính:
--   làm nhanh / sai sót / cần hướng dẫn…). Mức KHÔNG suy từ % được → GV nhập tay.
--   Giữ hoan_thanh_pct làm legacy (buổi đã chấm % không map, không bắt chấm lại).
--
-- MẤT GÌ: không xoá/thu hẹp gì — chỉ ADD COLUMN nullable + CHECK.
-- ============================================================================

alter table public.buoi_danh_gia add column if not exists muc smallint;

alter table public.buoi_danh_gia drop constraint if exists buoi_danh_gia_muc_chk;
alter table public.buoi_danh_gia add constraint buoi_danh_gia_muc_chk
  check (muc is null or (muc between 1 and 5));
