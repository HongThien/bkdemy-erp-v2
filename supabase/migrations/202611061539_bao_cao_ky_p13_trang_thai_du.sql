-- ============================================================================
-- 202611061539 — bao_cao_ky_p13_trang_thai_du
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 06/11 "cái nào điền xong rồi thì hình tròn vàng chuyển sang xanh lá". Danh sách HS ở màn báo cáo kì cần 3 trạng thái:
--   'nhap' (đã nhập dở) · 'du' (đủ để công bố: điểm + sai số + mọi mục nhận xét — đúng luật _bc_ky_thieu) · 'cong_bo'.
--   Không dòng = chưa nhập gì (không trả). Luật "đủ" chỉ có MỘT nơi (_bc_ky_thieu) — client không tự đếm.
-- MẤT GÌ (Luật xoá): không — thêm 1 hàm đọc.
-- ============================================================================

create or replace function public.fn_bc_ky_trang_thai(p_hs uuid[], p_mon text, p_ky uuid)
returns table (hoc_sinh_id uuid, trang_thai text)
language sql stable set search_path to 'public' as $$
  select b.hoc_sinh_id,
         case when b.cong_bo_at is not null then 'cong_bo'
              when public._bc_ky_thieu(b) is null then 'du'
              else 'nhap' end
    from bao_cao_ph_ky b
   where b.hoc_sinh_id = any(p_hs) and b.mon = p_mon and b.ky_id = p_ky
$$;
revoke execute on function public.fn_bc_ky_trang_thai(uuid[], text, uuid) from public, anon;
grant execute on function public.fn_bc_ky_trang_thai(uuid[], text, uuid) to authenticated, service_role;
