-- ============================================================================
-- bao_cao_ky_p15_cong_bo_khoa_dong
-- ----------------------------------------------------------------------------
-- VÌ SAO: 06/11 em Chu Bảo Ngọc (9K2 KHTN) ĐÃ CÔNG BỐ mà sai_so NULL. Log: 19:02:44 lưu 8,5 ± 0,5 → 19:02:46 công bố → cùng giây một lần
--   lưu khác ghi sai_so về NULL. fn_bc_ky_cong_bo đọc dòng (đủ ⇒ qua _bc_ky_thieu) rồi mới chụp snapshot bằng câu lệnh SAU; ở READ COMMITTED
--   lần lưu chen vào giữa hai câu ⇒ snapshot mang sai_so NULL (và lần lưu đó lọt trigger khoá vì lúc nó bắt đầu dòng chưa công bố).
-- SỬA: khoá dòng (FOR UPDATE) ngay đầu công bố ⇒ lần lưu đồng thời phải đợi; công bố xong nó chạy tiếp và bị trigger chặn (đã công bố).
--   Thân hàm còn lại y mig 202611051704.
-- MẤT GÌ (Luật xoá): không — thay thân 1 hàm.
-- ============================================================================
create or replace function public.fn_bc_ky_cong_bo(p_hs uuid, p_mon text, p_ky uuid)
returns timestamptz language plpgsql volatile set search_path to 'public' as $$
declare v_snap jsonb; v_at timestamptz := now(); v_bc bao_cao_ph_ky; v_thieu text;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky for update;
  if v_bc.cong_bo_at is not null then raise exception 'Báo cáo kì này đã công bố.'; end if;
  v_thieu := public._bc_ky_thieu(v_bc);
  if v_thieu is not null then raise exception '%', v_thieu; end if;
  v_snap := public.fn_bc_ky_du_lieu(p_hs, p_mon, p_ky) || jsonb_build_object('cong_bo_at', v_at);
  update bao_cao_ph_ky set snapshot = v_snap, cong_bo_at = v_at, cong_bo_boi = public.jwt_uid()
   where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;
  return v_at;
end $$;
revoke execute on function public.fn_bc_ky_cong_bo(uuid, text, uuid) from public, anon;
grant execute on function public.fn_bc_ky_cong_bo(uuid, text, uuid) to authenticated, service_role;
