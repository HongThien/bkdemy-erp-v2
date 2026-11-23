-- 202611231716 — policy phien_phieu_xem: bọc current_nhan_su_id() trong (select …) (K27 — không gọi hàm kiểm quyền theo từng dòng). Cùng nghĩa với mig 202611231711.
drop policy if exists phien_phieu_xem on public.phien_phieu;
create policy phien_phieu_xem on public.phien_phieu for select to authenticated
  using (coalesce((select n.la_admin_he_thong from public.nhan_su n where n.id = (select public.current_nhan_su_id())), false)
         or nguoi_gui = (select public.jwt_uid()));
