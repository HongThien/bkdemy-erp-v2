-- ============================================================================
-- 202610281756 — kho_khoi_dung_ban_do_cu
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 28/10 "nãy xóa chức năng làm ET cũ nhưng quên mất là tiểu học chưa chuyển sang bản đồ mới — phục hồi lại cái làm
--   ET và giáo trình cũ cho riêng khối tiểu học". Lá Giáo trình / ET cũ mở lại nhưng CHỈ cho (môn, khối) còn chạy bản đồ cũ.
--   "Còn bản đồ cũ" = cùng luật mọi nơi khác: _kho_ds_nhanh_khoi(môn, khối) KHÔNG có nhánh 'bdm' (Toán: 3·4·5·5T theo
--   _bdm_khoi_giu_cu; môn khác chưa có bản đồ mới ⇒ mọi khối). Một chỗ quyết, client không tự giữ danh sách khối.
--
-- MẤT GÌ (Luật xoá): Không mất gì — thêm 1 hàm đọc.
-- ============================================================================
create or replace function fn_kho_dung_ban_do_cu(p_mon text[], p_khoi text[]) returns table (mon text, khoi text)
language sql stable as $$
  select m, k from unnest(coalesce(p_mon, '{}')) m cross join unnest(coalesce(p_khoi, '{}')) k
   where not ('bdm' = any (coalesce(_kho_ds_nhanh_khoi(m, k), '{}')))
$$;
revoke execute on function fn_kho_dung_ban_do_cu(text[], text[]) from public, anon;
grant execute on function fn_kho_dung_ban_do_cu(text[], text[]) to authenticated;
