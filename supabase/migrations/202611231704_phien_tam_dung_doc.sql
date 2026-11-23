-- ============================================================================
-- VÌ SAO (Thùy 23/11): "báo khi trưởng khối bấm Claude : Chức năng này tạm dừng". Màn 🤖 Phiên Claude hỏi một lần lúc mở:
--   true = đang khoá với người xem (công tắc phien_claude_truong_khoi TẮT và người xem không phải admin hệ thống) ⇒ màn chỉ hiện câu báo.
--   Cùng điều kiện với _phien_kiem_khoa (mig 202611231659) — rào thật vẫn ở DB, hàm này chỉ để màn biết mà báo.
-- ============================================================================
create or replace function public.fn_phien_tam_dung()
returns boolean
language sql stable security definer set search_path = public as $$
  select not coalesce((select bat from he_thong_cong_tac where ma = 'phien_claude_truong_khoi'), false)
     and not coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false)
$$;
revoke execute on function public.fn_phien_tam_dung() from public, anon;
grant execute on function public.fn_phien_tam_dung() to authenticated;
