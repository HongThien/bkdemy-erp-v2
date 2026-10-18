do $$
declare v_tk uuid; v_hs uuid; v_ca record; v_case uuid; r jsonb; v_x jsonb; v_buoi uuid;
begin
  select t.id into v_tk from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.la_admin_he_thong limit 1;
  perform set_config('request.jwt.claims', json_build_object('sub', v_tk, 'role', 'authenticated')::text, true);
  select c.* into v_ca from ca_bo_tro c where c.trang_thai = 'mo' and c.ngay >= current_date order by c.ngay limit 1;
  select h.id into v_hs from hoc_sinh h join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id join lop l on l.id = hl.lop_id
   where l.mon = v_ca.mon and (v_ca.khoi is null or h.khoi = v_ca.khoi) and not exists (select 1 from bo_tro_hinh x where x.hoc_sinh_id = h.id) limit 1;
  raise notice 'ca % hs % la_thanh_vien %', v_ca.id, v_hs, public.la_thanh_vien();
  v_case := public.fn_bthinh_mo(v_hs, 2, 2, 'Test: hình yếu phần đường tròn', null);
  r := public.fn_ca_bo_tro_ung_vien(v_ca.id);
  raise notice 'ung_vien.hinh = %', r->'hinh';
  v_x := public.fn_ca_bo_tro_xep(v_ca.id, 'hinh', v_hs, v_case);
  raise notice 'xep = %', v_x;
  v_buoi := (v_x->>'buoi_hoc_id')::uuid;
  raise notice 'ngay.hs = %', (select jsonb_path_query_array(public.fn_ca_bo_tro_ngay(v_ca.ngay), '$[*].hs[*] ? (@.loai == "hinh")'));
  raise notice 'ds = %', public.fn_bthinh_danh_sach('dang_xu', 5)->'tran';
  update buoi_hoc_hs set diem_danh = 'co_mat' where buoi_hoc_id = v_buoi;
  begin perform public.fn_bthinh_hoan_tat(v_buoi, '', false); exception when others then raise notice 'chặn nhận xét trống: %', sqlerrm; end;
  raise notice 'hoan_tat = %', public.fn_bthinh_hoan_tat(v_buoi, 'Em hiểu đường phụ', false);
  raise notice 'case sau = %', (select row(trang_thai, ket_qua) from bo_tro_hinh where id = v_case);
  raise notice 'log = %', public.fn_bthinh_lich_su(v_case);
end $$;
