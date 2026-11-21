-- ============================================================================
-- 202611210818 — kho_bao_sai_quyen_xu_ly
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Hộp báo sai trên màn (mig 202611210816) cần biết NGƯỜI ĐANG XEM có được sửa / xoá câu này không, để chỉ hiện nút "Báo & đã sửa" /
--   "Báo & xoá" cho trưởng khối đúng khối. Các hàm phụ _kho_* đã thu quyền khỏi public nên màn không gọi thẳng được ⇒ một hàm mỏng.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì; chỉ thêm 1 hàm đọc. Thu lại grant tạm của _kho_la_truong_khoi_cua_cau cho authenticated (màn dùng hàm mới).
-- ============================================================================

create or replace function public.fn_kho_bao_sai_quyen(p_ma_cau text) returns boolean
 language sql stable security definer set search_path to 'public' as $$
  select coalesce(public._kho_la_truong_khoi_cua_cau(public._kho_cua_cau(p_ma_cau), p_ma_cau), false)
     and public.jwt_uid() is not null     -- kết nối script không phải người dùng màn
$$;

revoke execute on function public.fn_kho_bao_sai_quyen(text) from public, anon;
grant execute on function public.fn_kho_bao_sai_quyen(text) to authenticated;
revoke execute on function public._kho_la_truong_khoi_cua_cau(text, text) from authenticated;
