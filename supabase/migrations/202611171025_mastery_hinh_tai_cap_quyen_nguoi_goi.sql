-- 17/11/2026 · Vá mig 202611171010: fn_mastery_cells_hinh (security invoker, app gọi bằng authenticated) nay gọi _mastery_cells_hinh_tai,
-- mà hàm này trước chỉ claude_build có EXECUTE ⇒ lượt gọi từ app báo "permission denied". Cấp ĐÚNG bộ vai đang có quyền gọi fn_mastery_cells_hinh
-- (không thêm anon). Hàm chỉ đọc, invoker ⇒ RLS của người gọi vẫn áp như trước.
grant execute on function public._mastery_cells_hinh_tai(uuid[], boolean, timestamptz, timestamptz)
  to authenticated, service_role, claude_ro, fdw_bkdemy_web, ph_nop, web_lead_writer;
