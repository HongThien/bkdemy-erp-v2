-- Thùy 17/11 "Chụp lại cả 4": như mig 202611171651 (K9), áp cho 4 bản Toán tuần 09–15/11 còn mang số luật cũ:
-- K6 (đã duyệt) · K7+8 (đã duyệt) · K10–12 (đã nộp) · K3–5 (đã nộp).
-- Chỉ đổi cột `so`; GIỮ trạng thái, tu_viet, ca_nhan, người duyệt. Mỗi bản thêm 1 dòng log (trạng thái → chính nó).

do $$
declare r record; v_n int := 0;
begin
  for r in
    select id, o, tuan, trang_thai, so->'tong'->'dang_yeu' cu
      from bao_cao_tuan_khoi
     where id in ('9a41f075-ba3a-419b-b298-2ad61bafa09a', '4811c46b-d9b4-4dab-997e-9f94091eceb7',
                  '4efec647-a301-4cb2-b126-c4e92a66af7a', '601e7eb9-b695-403d-a64f-9bb59fb8e19b')
       and tuan = date '2026-11-09'
     for update
  loop
    update bao_cao_tuan_khoi
       set so = public.fn_bctk_so(r.o, r.tuan) || jsonb_build_object('trend', public.fn_bctk_trend(r.o, r.tuan)),
           updated_at = now()
     where id = r.id;
    insert into bao_cao_tuan_khoi_log (bao_cao_id, tu, den, nguoi, ghi_chu)
    values (r.id, r.trang_thai, r.trang_thai, null,
            'Chụp lại số theo luật dạng yếu hiện hành + hai chiều (Thùy 17/11 "Chụp lại cả 4"); bản cũ dạng yếu ' || r.cu::text);
    v_n := v_n + 1;
  end loop;
  if v_n <> 4 then raise exception 'Mong 4 bản, gặp %', v_n; end if;
end $$;
