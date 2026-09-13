-- ============================================================================
-- 202609131145 — Tự luyện HS: BỎ câu tra_loi_ngan (Thùy 13/09: chỉ hiện TN + Đ/S, dành cho cấp 3)
-- ----------------------------------------------------------------------------
-- VÌ SAO: HS cấp 3 làm tự luyện trên app; câu tra_loi_ngan (điền đáp án) chưa ổn — nhập lệch dấu/khoảng
--   là báo sai dù đúng bản chất. CEO chốt TẠM chỉ để lại `trac_nghiem` (4 đáp án) và `dung_sai` (Đ/S).
--   Câu có form TN đã duyệt vẫn dùng bình thường (form snapshot sang loai_cau='trac_nghiem').
--
-- ẢNH HƯỞNG: CHỈ tu_luyen_sinh (client HS). KHÔNG đụng _btyeu_chon_cau (bổ trợ yếu/retest — staff chấm
--   không dính vấn đề nhập chuỗi). Tách chuỗi điều kiện thành hàm riêng `_kho_dk_online_hs_sql` để chỉ
--   tự luyện thấy filter mới; bổ trợ yếu vẫn dùng `_kho_dk_online_sql` gốc.
--
-- MẤT GÌ: không mất data. Chỉ thay 2 function (`_kho_dk_online_hs_sql` mới + `tu_luyen_sinh` replace).
-- ============================================================================

-- ── Điều kiện "chấm online được" DÀNH CHO TỰ LUYỆN HS — bỏ tra_loi_ngan ─────────────────────────
create or replace function public._kho_dk_online_hs_sql(p_cautbl text) returns text
language sql stable as $$
  select '((c.loai_cau = ''trac_nghiem'' and c.dap_an is not null)'
      || ' or (c.loai_cau = ''dung_sai'' and jsonb_array_length(coalesce(c.menh_de,''[]''::jsonb)) >= 2)'
      || case when public._kho_form_tn_cua(p_cautbl) is null then ''
              else format(' or exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)', public._kho_form_tn_cua(p_cautbl)) end
      || ')'
$$;

-- ── tu_luyen_sinh — chỉ đổi CHỖ dùng v_dk: sang _kho_dk_online_hs_sql. Còn lại y hệt mig 202609080259. ──
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
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);   -- ⭐ ĐỔI Ở ĐÂY: dùng hàm HS-only (bỏ TLN)
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
  v_uu_tien := case when v_ftbl is null then '' else format('(exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)) desc, ', v_ftbl) end;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for v_ma_dang in select jsonb_array_elements_text(p_dangs) loop
    v_thu_tu := v_thu_tu + 1;
    select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
      from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = v_ma_dang;
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

  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho các dạng của em — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $$;
grant execute on function public.tu_luyen_sinh(text, jsonb, text) to authenticated;
