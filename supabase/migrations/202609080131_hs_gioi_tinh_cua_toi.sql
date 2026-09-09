-- ============================================================================
-- 202609080131 — hs_gioi_tinh_cua_toi
-- ----------------------------------------------------------------------------
-- VÌ SAO: màn chính app HS cấp 2/3 (kit thiết kế hs-home-v4, CEO 08/09) có 2 biến thể nam/nữ
--   (tranh nền + nhân vật + bảng màu). `hoc_sinh` là bảng staff-only (RLS) nên app HS không SELECT
--   thẳng được — cùng lý do và cùng khuôn với hs_khoi_cua_toi()/hs_cap1_cua_toi() (202608211041).
-- MẤT GÌ (Luật xoá): không mất gì — chỉ thêm 1 function đọc.
-- ============================================================================

create or replace function public.hs_gioi_tinh_cua_toi()
returns text
language sql stable security definer set search_path = public as $$
  select gioi_tinh from hoc_sinh where id = public.my_hoc_sinh_id()
$$;
grant execute on function public.hs_gioi_tinh_cua_toi() to authenticated;
