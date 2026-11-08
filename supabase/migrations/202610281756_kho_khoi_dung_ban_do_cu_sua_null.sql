-- ============================================================================
-- 202610281758 — kho_khoi_dung_ban_do_cu_sua_null
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202610281756 lọc bằng `'bdm' = any(mảng)` — mảng nhánh của Toán cấp 1 là {NULL,'hinh_gt','hinh_hoc'} (NULL = Đại)
--   ⇒ `= any` ra NULL chứ không ra false ⇒ hàm trả 0 dòng. Dùng array_position (không bị NULL làm nhiễu).
--
-- MẤT GÌ (Luật xoá): Không mất gì — chỉ đổi thân 1 hàm đọc.
-- ============================================================================
create or replace function fn_kho_dung_ban_do_cu(p_mon text[], p_khoi text[]) returns table (mon text, khoi text)
language sql stable as $$
  select m, k from unnest(coalesce(p_mon, '{}')) m cross join unnest(coalesce(p_khoi, '{}')) k
   where array_position(coalesce(_kho_ds_nhanh_khoi(m, k), '{}'), 'bdm') is null
$$;
