-- ============================================================================
-- 202611281504 — hh_bai_y_them_y_doi_thu_tu
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 28/11 — kho Hình–Học: bài nhiều ý (HHB…) đã có 3 ý thì phải THÊM được ý mới và ĐỔI được thứ tự các ý.
--   Mỗi ý = 1 câu HHC riêng (mã gốc bất biến); NHÃN (a,b,c / 1,2,3) chỉ để hiển thị nhưng mọi chỗ đọc (kho, builder, in, ET)
--   đang xếp theo nhan_y ⇒ thêm / đổi thứ tự = cấp lại nhãn theo vị trí mới; mã câu, lịch sử đo, tài liệu trỏ ma_cau KHÔNG đổi.
--   Cột da_biet có chữ "(ý a)" nhắc nhãn ý trước ⇒ khi đổi nhãn phải sửa các chữ đó theo, nếu không ý trỏ nhầm ý.
--   Hai RPC transactional, tính + ghi cùng transaction (CLAUDE.md §2.0).
-- MẤT GÌ (Luật xoá): không xoá gì. Chỉ UPDATE nhan_y / thu_tu / da_biet của ý cùng bài, INSERT ý mới.
-- ============================================================================

-- Cấp lại nhãn + thứ tự cho các ý của 1 bài theo danh sách mã câu (ý không có trong danh sách đứng sau, giữ thứ tự cũ).
create or replace function public._hh_bai_y_danh_lai(p_bai_y text, p_ds text[]) returns void
language plpgsql as $f$
declare
  v_all text[];     -- toàn bộ ý còn sống của bài, theo thứ tự mới
  v_n int; v_max int;
  v_kieu text;      -- 'chu' | 'so'
  v_cu text[]; v_moi text[];
  i int; r record;
begin
  select array(select ma_cau from hinh_hoc_cau_hoi where bai_y = p_bai_y and xoa_at is null
                order by nhan_y, ma_cau) into v_all;
  v_n := coalesce(array_length(v_all, 1), 0);
  if v_n = 0 then return; end if;

  -- thứ tự mới: danh sách người chọn trước, phần còn lại sau
  v_all := array(select m from unnest(p_ds) m where m = any(v_all))
        || array(select m from unnest(v_all) m where m <> all(p_ds));

  -- kiểu nhãn đang dùng của bài
  if not exists (select 1 from hinh_hoc_cau_hoi where bai_y = p_bai_y and xoa_at is null and nhan_y not like '~%' and nhan_y !~ '^[a-z]$') then v_kieu := 'chu';
  elsif not exists (select 1 from hinh_hoc_cau_hoi where bai_y = p_bai_y and xoa_at is null and nhan_y not like '~%' and nhan_y !~ '^[0-9]$') then v_kieu := 'so';
  else raise exception 'Bài % dùng nhãn ý đặc biệt (vd 1a, b*) — chưa tự đổi thứ tự được, nhờ Claude xử lý tay.', p_bai_y; end if;
  v_max := (case when v_kieu = 'chu' then 26 else 9 end);
  if v_n > v_max then
    raise exception 'Bài % quá nhiều ý để đánh nhãn tự động (%).', p_bai_y, v_n;
  end if;

  v_cu := '{}'; v_moi := '{}';
  for i in 1..v_n loop
    select nhan_y into r from hinh_hoc_cau_hoi where ma_cau = v_all[i];
    v_cu := v_cu || r.nhan_y;
    v_moi := v_moi || case when v_kieu = 'chu' then chr(96 + i) else i::text end;
  end loop;

  -- bước 1: nhãn tạm (tránh đụng unique (bai_y, nhan_y)); bước 2: nhãn thật + thu_tu
  update hinh_hoc_cau_hoi set nhan_y = '~' || ma_cau where ma_cau = any(v_all);
  for i in 1..v_n loop
    update hinh_hoc_cau_hoi set nhan_y = v_moi[i], thu_tu = i where ma_cau = v_all[i];
  end loop;

  -- chữ "(ý a)" trong da_biet nhắc nhãn CŨ ⇒ đổi sang nhãn MỚI (qua ký tự tạm để không đè chuỗi)
  for i in 1..v_n loop
    if v_cu[i] <> v_moi[i] and v_cu[i] not like '~%' then
      update hinh_hoc_cau_hoi set da_biet = regexp_replace(da_biet, 'ý ' || v_cu[i] || '(?![0-9a-zA-Z])', 'ý ' || chr(1) || i::text || chr(2), 'g')
       where bai_y = p_bai_y and xoa_at is null and da_biet ~ ('ý ' || v_cu[i] || '(?![0-9a-zA-Z])');
    end if;
  end loop;
  for i in 1..v_n loop
    update hinh_hoc_cau_hoi set da_biet = replace(da_biet, 'ý ' || chr(1) || i::text || chr(2), 'ý ' || v_moi[i])
     where bai_y = p_bai_y and xoa_at is null and da_biet like ('%' || chr(1) || '%');
  end loop;

  update hinh_hoc_bai_y set updated_at = now() where ma_bai_y = p_bai_y;
end $f$;

-- Đổi thứ tự các ý: p_ds = mã câu các ý theo thứ tự mới (đủ hoặc thiếu đều được; thiếu thì xếp cuối).
create or replace function public.fn_hh_bai_y_doi_thu_tu(p_bai_y text, p_ds text[]) returns void
language plpgsql set search_path to 'public' as $f$
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  perform 1 from hinh_hoc_bai_y where ma_bai_y = p_bai_y and xoa_at is null for update;
  if not found then raise exception 'Không thấy bài nhiều ý %', p_bai_y; end if;
  perform public._hh_bai_y_danh_lai(p_bai_y, p_ds);
end $f$;

-- Thêm 1 ý vào bài: đứng sau ý p_sau (mã câu); null = cuối bài. Trả mã câu của ý mới.
create or replace function public.fn_hh_bai_y_them_y(p_bai_y text, p_cau_hoi_y text, p_da_biet text default null, p_sau text default null) returns text
language plpgsql set search_path to 'public' as $f$
declare b record; mau record; v_ma text; v_ds text[];
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if nullif(btrim(p_cau_hoi_y), '') is null then raise exception 'Câu hỏi của ý không được để trống'; end if;
  select * into b from hinh_hoc_bai_y where ma_bai_y = p_bai_y and xoa_at is null for update;
  if not found then raise exception 'Không thấy bài nhiều ý %', p_bai_y; end if;
  select * into mau from hinh_hoc_cau_hoi where bai_y = p_bai_y and xoa_at is null order by nhan_y limit 1;

  insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, loai_cau, bai_y, nhan_y, cau_hoi_y, da_biet, ma_cum, mo_hinh_id, thu_tu, nguon_giai, da_duyet)
  values (b.dang_chinh, '', 'tu_luan', p_bai_y, '~moi' || clock_timestamp()::text, btrim(p_cau_hoi_y), nullif(btrim(p_da_biet), ''), mau.ma_cum, mau.mo_hinh_id, 99, 'nguoi', false)
  returning ma_cau into v_ma;

  select array(select ma_cau from hinh_hoc_cau_hoi where bai_y = p_bai_y and xoa_at is null and ma_cau <> v_ma order by nhan_y, ma_cau) into v_ds;
  if p_sau is not null and p_sau = any(v_ds) then
    v_ds := v_ds[1:array_position(v_ds, p_sau)] || v_ma || v_ds[array_position(v_ds, p_sau) + 1:array_length(v_ds, 1)];
  else
    v_ds := v_ds || v_ma;
  end if;
  perform public._hh_bai_y_danh_lai(p_bai_y, v_ds);
  return v_ma;
end $f$;

revoke execute on function public._hh_bai_y_danh_lai(text, text[]) from public, anon, authenticated;
revoke execute on function public.fn_hh_bai_y_doi_thu_tu(text, text[]) from public, anon;
revoke execute on function public.fn_hh_bai_y_them_y(text, text, text, text) from public, anon;
grant execute on function public.fn_hh_bai_y_doi_thu_tu(text, text[]) to authenticated;
grant execute on function public.fn_hh_bai_y_them_y(text, text, text, text) to authenticated;
