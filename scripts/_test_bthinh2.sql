do $$
declare v_tk uuid; v_hs uuid; v_ca record; v_case uuid; v_x jsonb; v_buoi uuid; r jsonb;
begin
  select t.id into v_tk from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.la_admin_he_thong limit 1;
  perform set_config('request.jwt.claims', json_build_object('sub', v_tk, 'role', 'authenticated')::text, true);
  select c.* into v_ca from ca_bo_tro c where c.trang_thai = 'mo' and c.ngay >= current_date order by c.ngay limit 1;
  select h.id into v_hs from hoc_sinh h join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id join lop l on l.id = hl.lop_id
   where l.mon = v_ca.mon and (v_ca.khoi is null or h.khoi = v_ca.khoi) and not exists (select 1 from bo_tro_hinh x where x.hoc_sinh_id = h.id) limit 1;
  v_case := public.fn_bthinh_mo(v_hs, 1, 2, 'Test p2', null);
  v_x := public.fn_ca_bo_tro_xep(v_ca.id, 'hinh', v_hs, v_case); v_buoi := (v_x->>'buoi_hoc_id')::uuid;
  raise notice 'tu_kiem = %', public.fn_bo_tro_tu_kiem(v_ca.ngay, v_ca.ngay)->'loi';
  r := public.fn_bo_tro_dashboard_tuan(v_ca.ngay, 1);
  raise notice 'dash.loai.bo_tro_hinh = %', r->0->'loai'->'bo_tro_hinh';
  raise notice 'lop_cua_buoi = %', public._ta_lop_cua_buoi(v_buoi);
  update buoi_hoc_hs set diem_danh = 'co_mat' where buoi_hoc_id = v_buoi;
  update buoi_hoc set ngay = current_date - 1 where id = v_buoi and false; -- (không đổi ngày thật)
  raise notice 'don_ca = %', public.fn_btyeu_don_ca_khong_dien_ra();
  raise notice 'thieu_cong hinh = %', (select count(*) from public._ta_buoi_thieu_cong(current_date - 30, current_date) where ten like 'Bổ trợ Hình%');
end $$;
