do $$
declare v_tk uuid; v_hs uuid; v_id uuid; r jsonb; v_td uuid;
begin
  select t.id into v_tk from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.la_admin_he_thong limit 1;
  perform set_config('request.jwt.claims', json_build_object('sub', v_tk, 'role', 'authenticated')::text, true);
  select g.hoc_sinh_id into v_hs from gami_grades g join gami_session_problems sp on sp.id = g.problem_id where sp.phase = 'et'
    and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = g.hoc_sinh_id and y.trang_thai = 'dang_xu') limit 1;
  r := public.fn_botro_et_btvn(v_hs);
  raise notice 'et_btvn = %', left(r::text, 1200);
  v_id := public.fn_botro_chot_tuan('Toán', jsonb_build_array(jsonb_build_object('hoc_sinh_id', v_hs, 'lop', 'X', 'khoi', '7', 'ly_do', jsonb_build_array('test'), 'kenh', jsonb_build_array('so_lop_et'), 'uu_tien', 5, 'chuyen_de', '[]'::jsonb)));
  raise notice 'diem_thap = %', left((public.fn_botro_danh_sach_tuan('Toán', 'diem_thap')->'ds')::text, 200);
  v_td := public.fn_botro_theo_doi_vao(v_hs, 'Toán', 'diem_thap', 'thử', false);
  raise notice 'sau theo doi: diem_thap=% theo_doi=%', jsonb_array_length(public.fn_botro_danh_sach_tuan('Toán', 'diem_thap')->'ds'), jsonb_array_length(public.fn_botro_danh_sach_tuan('Toán', 'theo_doi')->'ds');
  raise notice 'bao_dong n = %', jsonb_array_length(public.fn_botro_bao_dong('Toán'));
  perform public.fn_botro_theo_doi_ket_thuc(v_td, 'go', 'thử');
  raise notice 'suc_chua = %', public.fn_btyeu_suc_chua();
end $$;
