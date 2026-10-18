do $$
declare v_tk uuid; v_hs uuid; r jsonb; e jsonb;
begin
  select t.id into v_tk from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.la_admin_he_thong limit 1;
  perform set_config('request.jwt.claims', json_build_object('sub', v_tk, 'role', 'authenticated')::text, true);
  select id into v_hs from hoc_sinh where ma_hs = 'HS0513';
  r := public.fn_botro_et_btvn(v_hs);
  for e in select * from jsonb_array_elements(r->'et') loop
    raise notice '% diem=% tb=% n=% hang=% bang=% mau=% (%)', e->>'ngay', e->>'diem', e->>'tb_lop', e->>'n', e->>'hang', e->>'so_bang', e->>'mau', e->>'ly_do';
  end loop;
end $$;
