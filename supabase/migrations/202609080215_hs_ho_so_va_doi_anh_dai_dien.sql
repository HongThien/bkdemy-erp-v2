-- ============================================================================
-- 202609080215 — hs_ho_so_va_doi_anh_dai_dien
-- ----------------------------------------------------------------------------
-- VÌ SAO: CEO 08/09 "lấy module thay avatar của app TA ốp sang app HS". TA dùng thẳng uploadAvatar (bucket
--   'avatars', 0020 đã cho authenticated ghi) + update nhan_su.anh_url. HS thì `hoc_sinh` là bảng staff-only
--   (RLS) nên HS không SELECT/UPDATE thẳng được → 2 RPC security definer, khuôn hs_khoi_cua_toi():
--   (1) hs_ho_so_cua_toi() — đọc gộp gioi_tinh + anh_url (+ho_ten, ma_hs) 1 phát cho màn chính (thay vì mỗi
--       cột 1 RPC; hs_gioi_tinh_cua_toi() giữ nguyên cho tương thích).
--   (2) hs_doi_anh_dai_dien(p_url) — chỉ cập nhật anh_url của CHÍNH mình; p_url phải là public URL bucket
--       'avatars' (chặn gán URL lạ). Không trả gì.
-- MẤT GÌ (Luật xoá): không mất gì — chỉ thêm 2 function.
-- ============================================================================

create or replace function public.hs_ho_so_cua_toi()
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('ho_ten', ho_ten, 'ma_hs', ma_hs, 'gioi_tinh', gioi_tinh, 'anh_url', anh_url)
  from hoc_sinh where id = public.my_hoc_sinh_id()
$$;
grant execute on function public.hs_ho_so_cua_toi() to authenticated;

create or replace function public.hs_doi_anh_dai_dien(p_url text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.my_hoc_sinh_id() is null then raise exception 'Không phải tài khoản học sinh'; end if;
  if p_url is null or p_url !~ '/storage/v1/object/public/avatars/' then raise exception 'URL ảnh không hợp lệ'; end if;
  update hoc_sinh set anh_url = p_url where id = public.my_hoc_sinh_id();
end $$;
grant execute on function public.hs_doi_anh_dai_dien(text) to authenticated;
