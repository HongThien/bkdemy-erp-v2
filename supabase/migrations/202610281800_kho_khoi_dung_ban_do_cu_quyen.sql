-- ============================================================================
-- kho_khoi_dung_ban_do_cu_quyen
-- ----------------------------------------------------------------------------
-- VÌ SAO: fn_kho_dung_ban_do_cu (mig 202610281756) gọi _kho_ds_nhanh_khoi → _kho_ds_nhanh, mà authenticated không có quyền execute
--   _kho_ds_nhanh ⇒ app báo "permission denied for function _kho_ds_nhanh", lá Giáo trình (bản đồ cũ) không hiện khối nào.
--   Chạy security definer (chỉ trả cặp môn–khối theo luật nhánh, không đọc dữ liệu học sinh) + chặn người ngoài bằng la_thanh_vien().
--
-- MẤT GÌ (Luật xoá): Không mất gì — chỉ đổi thân 1 hàm đọc.
-- ============================================================================
create or replace function fn_kho_dung_ban_do_cu(p_mon text[], p_khoi text[]) returns table (mon text, khoi text)
language sql stable security definer set search_path to 'public' as $$
  select m, k from unnest(coalesce(p_mon, '{}')) m cross join unnest(coalesce(p_khoi, '{}')) k
   where la_thanh_vien() and array_position(coalesce(_kho_ds_nhanh_khoi(m, k), '{}'), 'bdm') is null
$$;
revoke execute on function fn_kho_dung_ban_do_cu(text[], text[]) from public, anon;
grant execute on function fn_kho_dung_ban_do_cu(text[], text[]) to authenticated;
