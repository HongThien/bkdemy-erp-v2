-- ĐIỀN Ô D2 (bổ sung): bản HS thấy phải CẮT key khỏi bước (lỗ hổng: dien.buoc lúc đầu chép nguyên lời giải ⇒ HS đọc thấy đáp án
-- ngay trong câu). Thay key bằng ⟦oN⟧ ở đúng bước; client render ⟦oN⟧ thành ô chọn, chọn xong mới điền đáp án đúng vào.
create or replace function public._dien_buoc_hs(p_buoc jsonb, p_o jsonb) returns jsonb language plpgsql immutable as $$
declare v jsonb := p_buoc; o jsonb; i int; t text;
begin
  for o in select * from jsonb_array_elements(p_o) loop
    i := (o->>'buoc')::int - 1;
    t := v -> i ->> 'text';
    if t is null then raise exception 'ô % trỏ bước % không có', o->>'id', o->>'buoc'; end if;
    if position(o->>'key' in t) = 0 then raise exception 'key của ô % không có trong bước %', o->>'id', o->>'buoc'; end if;
    -- chỉ thay lần xuất hiện ĐẦU (overlay() theo vị trí), không replace() toàn bộ
    t := overlay(t placing '⟦' || (o->>'id') || '⟧' from position(o->>'key' in t) for length(o->>'key'));
    v := jsonb_set(v, array[i::text, 'text'], to_jsonb(t));
  end loop;
  return v;
end $$;

create or replace function public.tu_luyen_dien_sinh(p_mon text default 'Toán', p_n integer default 3)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_lop uuid; v_khoi text; v_bt uuid; v_thu_tu int := 0; r record;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  select l.khoi into v_khoi from lop l where l.id = v_lop;
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo') returning id into v_bt;
  for r in
    select f.*, d.ma, d.de, d.gia_thiet, d.anh, d.khoi
    from hinh_form_dien f join lateral (select * from fn_dien_form_cho_duyet(null, true) x where x.id = f.id) d on true
    where f.da_duyet and f.xoa_at is null and (v_khoi is null or d.khoi = v_khoi)
      and f.id not in (select btc.form_dien_id from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id
                       where bt.hoc_sinh_id = v_hs and btc.form_dien_id is not null order by bt.created_at desc limit 30)
    order by random() limit greatest(1, least(p_n, 6))
  loop
    v_thu_tu := v_thu_tu + 1;
    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, anh_de, dap_an_key, diem, form_dien_id, dien, o_rule)
    values (v_bt, v_thu_tu, 1, r.ma, 'dien_o',
      r.de || case when r.gia_thiet is not null then E'\n' || r.gia_thiet else '' end, r.anh,
      (select jsonb_agg(o->>'dap_an' order by i) from jsonb_array_elements(r.o) with ordinality t(o, i)), 1, r.id,
      jsonb_build_object('buoc', public._dien_buoc_hs(r.buoc, r.o), 'o', public._dien_hs_view(r.o)),
      (select jsonb_agg((select jsonb_agg(case when (p->>'dung')::boolean then null else to_jsonb(p->>'loi') end order by j)
                         from jsonb_array_elements(o->'phuong_an') with ordinality q(p, j)) order by i)
         from jsonb_array_elements(r.o) with ordinality t(o, i)));
  end loop;
  if v_thu_tu = 0 then
    -- rollback bài rỗng: raise huỷ cả insert bai_test
    raise exception 'Chưa có bài chứng minh nào để luyện — thầy cô đang duyệt, quay lại sau nhé.';
  end if;
  update bai_test set so_cau = v_thu_tu where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', v_thu_tu);
end $$;
