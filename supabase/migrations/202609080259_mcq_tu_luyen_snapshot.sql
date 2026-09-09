-- MCQ FORM M3 — cắm phiên bản TRẮC NGHIỆM đã duyệt vào TỰ LUYỆN (+ bổ trợ yếu/retest dùng chung snapshot). Spec §8.1.
--
-- VÌ SAO: 282/497 câu pool 1 là tu_luan có đáp số ⇒ tu_luyen_sinh / _btyeu_chon_cau KHÔNG BAO GIỜ chọn (điều kiện loai_cau
-- in TN/TLN/ĐS). Form TN đã duyệt = câu chấm online được ⇒ mở vào tập ứng viên. Khi câu có form đã duyệt thì snapshot
-- FORM TN (CEO 08/09: MCQ ưu tiên): loai_cau='trac_nghiem', lua_chon = text[], dap_an_key = chữ cái, form_tn_id +
-- lua_chon_rule (song song, cùng INSERT — xem mig 202609080230). Câu không có form ⇒ y hệt cũ.
-- tu_luyen_sinh chuyển sang gọi _kho_snapshot_cau (việc dọn đã ghi ở mig 202609030307) — 1 nguồn mapping dap_an_key.
-- Khác biệt nhỏ có chủ đích: bai_test_cau.ma_cum của tự luyện giờ = ma_cum câu (trước để null) — dữ liệu thật, không hại.

-- ── Bảng form TN tương ứng bảng câu (null nếu kho đó chưa có bảng) — dùng trong SQL động ──
create or replace function public._kho_form_tn_cua(p_cautbl text) returns text
language sql stable as $$
  select case when to_regclass(replace(p_cautbl, '_cau_hoi', '_cau_form_tn')) is null then null
              else replace(p_cautbl, '_cau_hoi', '_cau_form_tn') end
$$;

-- ── Snapshot 1 câu kho → bai_test_cau: ƯU TIÊN form TN đã duyệt ──
create or replace function public._kho_snapshot_cau(
  p_bt_id uuid, p_cautbl text, p_lttbl text, p_ma_cau text, p_thu_tu integer, p_ma_cum text default null)
returns void language plpgsql security definer set search_path = public as $$
declare v_row record; v_ly_thuyet text; v_ftbl text; v_form_id uuid; v_form_lc jsonb; v_form_da text;
begin
  execute format($q$select * from %1$I where ma_cau = $1$q$, p_cautbl) into v_row using p_ma_cau;
  if v_row.ma_cau is null then raise exception 'Câu % không có trong %', p_ma_cau, p_cautbl; end if;
  execute format($q$select noi_dung from %1$I where ma_dang = $1$q$, p_lttbl) into v_ly_thuyet using v_row.dang_chinh;

  v_ftbl := public._kho_form_tn_cua(p_cautbl);
  if v_ftbl is not null then
    execute format($q$select id, lua_chon, dap_an from %1$I where ma_cau = $1 and da_duyet and xoa_at is null$q$, v_ftbl)
      into v_form_id, v_form_lc, v_form_da using p_ma_cau;
  end if;

  if v_form_id is not null then
    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
      menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum, form_tn_id, lua_chon_rule)
    values (
      p_bt_id, p_thu_tu, 1, v_row.ma_cau, 'trac_nghiem', v_row.noi_dung,
      (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(v_form_lc) with ordinality t(e, o)),
      null, to_jsonb(v_form_da),
      v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
      coalesce(p_ma_cum, v_row.ma_cum), v_form_id,
      (select array_agg(case when (e->>'dung')::boolean then null else e->>'rule' end order by o)
         from jsonb_array_elements(v_form_lc) with ordinality t(e, o))
    );
    return;
  end if;

  insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
    menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum)
  values (
    p_bt_id, p_thu_tu, 1, v_row.ma_cau, v_row.loai_cau, v_row.noi_dung, v_row.lua_chon, v_row.menh_de,
    case v_row.loai_cau
      when 'trac_nghiem' then to_jsonb(upper(trim(v_row.dap_an)))
      when 'tra_loi_ngan' then to_jsonb(trim(v_row.dap_an))
      when 'dung_sai' then (select jsonb_agg(case when upper(left(trim(m->>'dap_an'), 1)) = 'S' then 'S' else 'D' end)
                             from jsonb_array_elements(coalesce(v_row.menh_de, '[]'::jsonb)) m)
      else to_jsonb(v_row.dap_an)
    end,
    v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
    coalesce(p_ma_cum, v_row.ma_cum)
  );
end $$;

-- ── Điều kiện "chấm online được" dùng chung (chuỗi SQL để nhúng vào format): TN/TLN có đáp án · ĐS ≥2 mệnh đề ·
--    HOẶC có form TN đã duyệt. Alias bảng câu = c. ──
create or replace function public._kho_dk_online_sql(p_cautbl text) returns text
language sql stable as $$
  select '((c.loai_cau in (''trac_nghiem'',''tra_loi_ngan'') and c.dap_an is not null)'
      || ' or (c.loai_cau = ''dung_sai'' and jsonb_array_length(coalesce(c.menh_de,''[]''::jsonb)) >= 2)'
      || case when public._kho_form_tn_cua(p_cautbl) is null then ''
              else format(' or exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)', public._kho_form_tn_cua(p_cautbl)) end
      || ')'
$$;

-- ── Bổ trợ yếu / retest: chọn câu — thêm ứng viên có form TN ──
create or replace function public._btyeu_chon_cau(
  p_cautbl text, p_ma_dang text, p_ma_cum text, p_tru text[], p_n integer)
returns text[] language plpgsql security definer set search_path = public as $$
declare v_out text[] := '{}'; v_more text[]; v_dk text := public._kho_dk_online_sql(p_cautbl);
begin
  execute format($q$
    select coalesce(array_agg(ma_cau), '{}') from (
      select c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null
        and ($2::text is null or c.ma_cum = $2)
        and %2$s
        and c.ma_cau <> all($3)
      order by random() limit $4) s
  $q$, p_cautbl, v_dk) into v_out using p_ma_dang, p_ma_cum, p_tru, p_n;
  if coalesce(array_length(v_out, 1), 0) < p_n then
    execute format($q$
      select coalesce(array_agg(ma_cau), '{}') from (
        select c.ma_cau from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null
          and ($2::text is null or c.ma_cum = $2)
          and %2$s
          and c.ma_cau <> all($3)
        order by random() limit $4) s
    $q$, p_cautbl, v_dk) into v_more using p_ma_dang, p_ma_cum, v_out, p_n - coalesce(array_length(v_out, 1), 0);
    v_out := v_out || v_more;
  end if;
  return v_out;
end $$;

-- ── Tự luyện: ứng viên thêm câu có form TN đã duyệt, ƯU TIÊN câu có form (CEO: MCQ trước); snapshot qua _kho_snapshot_cau ──
create or replace function public.tu_luyen_sinh(p_mon text, p_dangs jsonb, p_nhanh text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_them integer := jsonb_array_length(p_dangs);
  v_cautbl text := public._kho_cau_tbl(p_mon, p_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_dk text := public._kho_dk_online_sql(v_cautbl);
  v_ftbl text := public._kho_form_tn_cua(v_cautbl);
  v_uu_tien text;
  v_thu_tu integer := 0;
  v_ma_dang text;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_ma_cau text;
  v_ok_count integer := 0;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  if v_them is null or v_them = 0 then raise exception 'Không có dạng nào để sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  -- Ưu tiên câu có form TN đã duyệt (sort key), rồi random. Kho chưa có bảng form → chỉ random.
  v_uu_tien := case when v_ftbl is null then '' else format('(exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)) desc, ', v_ftbl) end;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for v_ma_dang in select jsonb_array_elements_text(p_dangs) loop
    v_thu_tu := v_thu_tu + 1;
    select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
      from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = v_ma_dang;
    -- Ứng viên: chưa dùng trong 9 lần gần nhất của CHÍNH dạng này, VÀ chưa dùng trong lượt này (v_used_batch).
    v_ma_cau := null;
    execute format($q$
      select c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null
        and %2$s
        and c.ma_cau <> all($2)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10
        )
      order by %3$s random() limit 1
    $q$, v_cautbl, v_dk, v_uu_tien)
    into v_ma_cau using v_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    -- Hết ứng viên tránh-lặp → CHẤP NHẬN LẶP (CEO chốt), chỉ né trùng NGAY TRONG lượt này.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null
          and %2$s
          and c.ma_cau <> all($2)
        order by %3$s random() limit 1
      $q$, v_cautbl, v_dk, v_uu_tien)
      into v_ma_cau using v_ma_dang, v_used_batch;
    end if;
    -- Dạng không có câu nào trong kho (hiếm) → BỎ RIÊNG slot này, không suy đoán (§1.5).
    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      continue;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, v_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  -- Không ra nổi câu nào → rollback (raise huỷ cả insert bai_test ở trên), không để bài rỗng mồ côi.
  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho các dạng của em — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $$;
grant execute on function public.tu_luyen_sinh(text, jsonb, text) to authenticated;
