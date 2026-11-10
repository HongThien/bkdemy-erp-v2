-- ============================================================================
-- 202611102304 — ta_luong_tong_thang
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 10/11: tab Bảng lương "cần có chỗ hiện tổng lương". Tổng tiền là phép tính nghiệp vụ ⇒ ở DB (CLAUDE.md §2.0),
--   client không cộng. Cùng nguồn với bảng (_ta_luong_ky_core): kỳ đã chốt ⇒ cộng bản chốt; chưa chốt ⇒ cộng tạm tính.
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 hàm đọc.
-- ============================================================================

create or replace function public.fn_ta_luong_ky_tong(p_ky date)
returns table (so_ta integer, package_lop numeric, bo_tro_tien numeric, ngoai_package numeric, gross numeric, tien_phat numeric, net numeric,
               da_chot boolean, tinh_luc timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.co_chuc_nang('ta_luong') then raise exception 'Không có quyền xem lương trợ giảng'; end if;
  return query
  select count(*)::int, coalesce(sum(x.package_lop), 0), coalesce(sum(x.bo_tro_tien), 0), coalesce(sum(x.ngoai_package), 0),
         coalesce(sum(x.gross), 0), coalesce(sum(x.tien_phat), 0), coalesce(sum(x.net), 0),
         coalesce(bool_or(x.da_chot), false), coalesce(max(x.chot_at) filter (where x.da_chot), now())
    from public._ta_luong_ky_core(p_ky, null) x;
end $$;
revoke all on function public.fn_ta_luong_ky_tong(date) from public, anon;
grant execute on function public.fn_ta_luong_ky_tong(date) to authenticated;
