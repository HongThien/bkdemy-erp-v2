-- ============================================================================
-- 202611121753 — sau_gio_cap2_khong_hien_form_tn
-- VÌ SAO (Thùy 12/11): "sao file lớp 8 chọn câu mới vẫn bị 4 đáp án abcd vậy". Luật chọn câu đã đúng (tự luận / trả lời ngắn), nhưng
--   _kho_snapshot_cau TỰ HIỆN form trắc nghiệm đã duyệt (dai_cau_form_tn…) thành 4 đáp án ⇒ câu TLN vào bài thành a/b/c/d.
--   Sửa: bổ trợ SAU GIỜ cấp 1–2 (_btnhe_uu_tu_luan) chụp câu KHÔNG dùng form — TLN giữ trả lời ngắn, tự luận giữ tự luận; trắc nghiệm
--   chỉ khi câu gốc là trắc nghiệm. Cách: cờ giao dịch 'bk.snap_khong_form' bật quanh vòng chụp trong fn_btnhe_luu_bai / fn_btnhe_in_test,
--   tắt ngay sau vòng. _kho_snapshot_cau GIỮ chữ ký (dùng chung bổ trợ yếu/ET/…; thêm tham số mặc định = đẻ hàm chồng, gọi mập mờ);
--   không bật cờ ⇒ y như cũ. Khối 10–12 và mọi luồng khác không đổi. Bài đã lưu trước đó KHÔNG bị sửa.
-- MẤT GÌ (Luật xoá): không — create or replace hàm.
-- ============================================================================

CREATE OR REPLACE FUNCTION public._kho_snapshot_cau(p_bt_id uuid, p_cautbl text, p_lttbl text, p_ma_cau text, p_thu_tu integer, p_ma_cum text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_row record; v_ly_thuyet text; v_ftbl text; v_form_id uuid; v_form_lc jsonb; v_form_da text; v_nltbl text; v_nl jsonb;
begin
  execute format($q$select * from %1$I where ma_cau = $1$q$, p_cautbl) into v_row using p_ma_cau;
  if v_row.ma_cau is null then raise exception 'Câu % không có trong %', p_ma_cau, p_cautbl; end if;
  execute format($q$select noi_dung from %1$I where ma_dang = $1$q$, p_lttbl) into v_ly_thuyet using v_row.dang_chinh;
  -- NGỮ LIỆU (đoạn văn / thông báo / biển báo) dùng chung cho nhiều câu: chụp kèm câu — HS không đọc được bảng ngữ liệu.
  v_nltbl := replace(p_cautbl, '_cau_hoi', '_ngu_lieu');
  if to_regclass('public.' || v_nltbl) is not null and to_jsonb(v_row) ->> 'ngu_lieu' is not null then
    execute format($q$select jsonb_build_object('ma', ma_ngu_lieu, 'loai', loai, 'tieu_de', tieu_de, 'noi_dung', noi_dung,
                                                'anh', anh, 'am_thanh', am_thanh, 'thu_tu', $2)
                      from %1$I where ma_ngu_lieu = $1$q$, v_nltbl)
      into v_nl using to_jsonb(v_row) ->> 'ngu_lieu', (to_jsonb(v_row) ->> 'thu_tu_trong_ngu_lieu')::int;
  end if;

  v_ftbl := public._kho_form_tn_cua(p_cautbl);
  -- 12/11: bổ trợ sau giờ cấp 1–2 bật cờ này ⇒ chụp đúng loại câu gốc, không hiện form trắc nghiệm
  if v_ftbl is not null and coalesce(current_setting('bk.snap_khong_form', true), '') <> '1' then
    execute format($q$select id, lua_chon, dap_an from %1$I where ma_cau = $1 and da_duyet and xoa_at is null$q$, v_ftbl)
      into v_form_id, v_form_lc, v_form_da using p_ma_cau;
  end if;

  if v_form_id is not null then
    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
      menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum, form_tn_id, form_tn_hgt_id, lua_chon_rule, ngu_lieu)
    values (
      p_bt_id, p_thu_tu, 1, v_row.ma_cau, 'trac_nghiem', v_row.noi_dung,
      (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(v_form_lc) with ordinality t(e, o)),
      null, to_jsonb(v_form_da),
      v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
      coalesce(p_ma_cum, v_row.ma_cum),
      case when v_ftbl = 'dai_cau_form_tn' then v_form_id end,
      case when v_ftbl = 'hgt_cau_form_tn' then v_form_id end,
      (select array_agg(case when (e->>'dung')::boolean then null else e->>'rule' end order by o)
         from jsonb_array_elements(v_form_lc) with ordinality t(e, o)),
      v_nl
    );
    return;
  end if;

  insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
    menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum, ngu_lieu)
  values (
    p_bt_id, p_thu_tu, 1, v_row.ma_cau, v_row.loai_cau, v_row.noi_dung, v_row.lua_chon, v_row.menh_de,
    case v_row.loai_cau
      when 'trac_nghiem' then to_jsonb(upper(trim(v_row.dap_an)))
      when 'tra_loi_ngan' then to_jsonb(trim(v_row.dap_an))
      when 'keo_tha' then public._tsa_keo_tha_key(v_row.dap_an, v_row.noi_dung, v_row.lua_chon)
      when 'dung_sai' then (select jsonb_agg(case when upper(left(trim(m->>'dap_an'), 1)) = 'S' then 'S' else 'D' end)
                             from jsonb_array_elements(coalesce(v_row.menh_de, '[]'::jsonb)) m)
      else to_jsonb(v_row.dap_an)
    end,
    v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
    coalesce(p_ma_cum, v_row.ma_cum), v_nl
  );
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_luu_bai(p_buoi uuid, p_loai text, p_ds jsonb, p_cau_hinh jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_lop uuid; v_bt uuid; d jsonb; c text; i integer := 0; v_cautbl text; v_lttbl text; v_nhanh text; v_tl text[] := '{}'; v_ten text;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_loai not in ('luyen', 'test') then raise exception 'Loại phải là luyen | test.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or not exists (select 1 from buoi_hoc where id = p_buoi and loai = 'bo_tro_nhe') then raise exception 'Không phải ca bổ trợ sau giờ.'; end if;
  if b.trang_thai <> 'mo' then raise exception 'Ca này không còn mở (%).', b.trang_thai; end if;
  if jsonb_typeof(p_ds) <> 'array' or not exists (select 1 from jsonb_array_elements(p_ds) x where jsonb_array_length(coalesce(x->'caus', '[]'::jsonb)) > 0) then
    raise exception 'Bài chưa có câu nào.';
  end if;
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;

  if p_loai = 'test' then
    select id into v_bt from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test' limit 1;
    if v_bt is not null then
      if exists (select 1 from bai_lam bl where bl.bai_test_id = v_bt) then raise exception 'Bài test đã nhập kết quả — không sửa câu được nữa.'; end if;
      delete from bai_test_cau where bai_test_id = v_bt;   -- câu nháp của bài chưa ai làm
      update bai_test set in_giay_at = now() where id = v_bt;
    end if;
  end if;
  if v_bt is null then
    insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
      values (null, v_lop, b.hoc_sinh_id, b.ngay, case when p_loai = 'test' then 'bo_tro_test' else 'bo_tro' end, b.mon, 0, 'mo', p_buoi, now(), public.jwt_uid())
      returning id into v_bt;
  end if;

  perform set_config('bk.snap_khong_form', case when public._btnhe_uu_tu_luan(b.hoc_sinh_id) then '1' else '' end, true);   -- cấp 1–2: không hiện form TN
  for d in select * from jsonb_array_elements(p_ds) loop
    v_nhanh := public._kho_nhanh_cua_dang(b.mon, d->>'ma_dang');
    v_cautbl := public._kho_cau_tbl(b.mon, v_nhanh); v_lttbl := public._kho_lt_tbl(b.mon, v_nhanh);
    for c in select jsonb_array_elements_text(coalesce(d->'caus', '[]'::jsonb)) loop
      i := i + 1;
      perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null);
      -- 12/11: TA nhập Đ/C/S cho MỌI loại câu (cả tự luận) ⇒ không còn chặn câu tự luận
    end loop;
    if p_loai = 'test' then
      update bo_tro_yeu_dang set day_at = coalesce(day_at, now()), day_buoi_id = coalesce(day_buoi_id, p_buoi)
       where bo_tro_yeu_id = b.bo_tro_yeu_id and ma_dang = d->>'ma_dang';
    end if;
  end loop;
  perform set_config('bk.snap_khong_form', '', true);
  if i = 0 then raise exception 'Bài chưa có câu nào.'; end if;
  if p_loai = 'test' and i > 10 then raise exception 'Bài test tối đa 10 câu (đang %). Bỏ bớt câu.', i; end if;   -- Thùy 11/11
  update bai_test set so_cau = i, cau_hinh_in = p_cau_hinh where id = v_bt;   -- cấu hình in như builder (dòng · cột · hình)
  update buoi_hoc_hs set btyeu_che_do = 'giay' where id = b.buoi_hoc_hs_id and btyeu_che_do is distinct from 'giay';
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_in_test(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_lop uuid; v_bt uuid; v_tru text[]; v_caus text[]; v_cautbl text; v_lttbl text; i integer := 0; c text; r record;
  v_thieu text[] := '{}'; v_chi_nhom_yeu boolean;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự in được bài.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or not exists (select 1 from buoi_hoc where id = p_buoi and loai = 'bo_tro_nhe') then raise exception 'Không phải ca bổ trợ sau giờ.'; end if;
  if b.trang_thai <> 'mo' then raise exception 'Ca này không còn mở (%).', b.trang_thai; end if;
  select id into v_bt from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test' limit 1;
  if v_bt is not null then
    if exists (select 1 from bai_lam where bai_test_id = v_bt and trang_thai = 'da_nop') then raise exception 'Bài test đã nhập & nộp rồi.'; end if;
    update bai_test set in_giay_at = coalesce(in_giay_at, now()) where id = v_bt;
    return jsonb_build_object('bai_test_id', v_bt, 'so_cau', (select so_cau from bai_test where id = v_bt), 'da_co', true, 'dang_khong_co_cau', '[]'::jsonb);
  end if;
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;
  v_chi_nhom_yeu := exists (select 1 from public._btnhe_dang_buoi(p_buoi) where nhom_yeu);
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
    values (null, v_lop, b.hoc_sinh_id, b.ngay, 'bo_tro_test', b.mon, 0, 'mo', p_buoi, now(), public.jwt_uid()) returning id into v_bt;
  perform set_config('bk.snap_khong_form', case when public._btnhe_uu_tu_luan(b.hoc_sinh_id) then '1' else '' end, true);   -- cấp 1–2: không hiện form TN
  for r in select * from public._btnhe_dang_buoi(p_buoi) where nhom_yeu or not v_chi_nhom_yeu order by thu_tu loop
    exit when i >= 10;   -- Thùy 11/11: bài test tối đa 10 câu (dạng nhóm yếu yếu nhất trước)
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, r.ma_dang));
    v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, r.ma_dang));
    v_caus := public._btnhe_chon_cau(v_cautbl, r.ma_dang, v_tru, 1, public._btnhe_uu_tu_luan(b.hoc_sinh_id), 0);
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_caus := public._btyeu_chon_cau(v_cautbl, r.ma_dang, null, v_tru, 1); end if;   -- hết TL/TLN ⇒ trắc nghiệm
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_thieu := v_thieu || r.ten_dang; continue; end if;
    foreach c in array v_caus loop
      i := i + 1; perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null); v_tru := v_tru || c;
    end loop;
    update bo_tro_yeu_dang set day_at = coalesce(day_at, now()), day_buoi_id = coalesce(day_buoi_id, p_buoi)
     where bo_tro_yeu_id = b.bo_tro_yeu_id and ma_dang = r.ma_dang;
  end loop;
  perform set_config('bk.snap_khong_form', '', true);
  if i = 0 then raise exception 'Các dạng của ca này chưa có câu trong kho — chưa in được bài test.'; end if;
  update bai_test set so_cau = i where id = v_bt;
  update buoi_hoc_hs set btyeu_che_do = 'giay' where id = b.buoi_hoc_hs_id and btyeu_che_do is distinct from 'giay';
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i, 'da_co', false, 'dang_khong_co_cau', to_jsonb(v_thieu));
end $function$;
