-- ============================================================================
-- 202611111756 — sau_gio_test_toi_da_10
-- VÌ SAO (Thùy 11/11): "bài test tối đa 10 câu thôi" — bổ trợ sau giờ. 1 câu / dạng yếu trong nhóm yếu, quá 10 dạng ⇒ lấy 10 dạng
--   đầu theo thứ tự in (nhóm yếu, yếu nhất trước). Áp ở 3 chỗ: tự sinh (fn_btnhe_in_test, nút In cả lớp), đề xuất soạn (fn_btnhe_soan),
--   lưu bài người sửa (fn_btnhe_luu_bai chặn > 10 câu). Bài luyện không đổi.
-- MẤT GÌ (Luật xoá): không mất gì — chỉ create or replace 3 hàm (thay đúng đoạn trên định nghĩa đang chạy).
-- ============================================================================

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
  for r in select * from public._btnhe_dang_buoi(p_buoi) where nhom_yeu or not v_chi_nhom_yeu order by thu_tu loop
    exit when i >= 10;   -- Thùy 11/11: bài test tối đa 10 câu (dạng nhóm yếu yếu nhất trước)
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, r.ma_dang));
    v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, r.ma_dang));
    v_caus := public._btyeu_chon_cau_khac(v_cautbl, r.ma_dang, null, v_tru, 1, 0);
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_caus := public._btyeu_chon_cau(v_cautbl, r.ma_dang, null, v_tru, 1); end if;
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_thieu := v_thieu || r.ten_dang; continue; end if;
    foreach c in array v_caus loop
      i := i + 1; perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null); v_tru := v_tru || c;
    end loop;
    update bo_tro_yeu_dang set day_at = coalesce(day_at, now()), day_buoi_id = coalesce(day_buoi_id, p_buoi)
     where bo_tro_yeu_id = b.bo_tro_yeu_id and ma_dang = r.ma_dang;
  end loop;
  if i = 0 then raise exception 'Các dạng của ca này chưa có câu trong kho — chưa in được bài test.'; end if;
  update bai_test set so_cau = i where id = v_bt;
  update buoi_hoc_hs set btyeu_che_do = 'giay' where id = b.buoi_hoc_hs_id and btyeu_che_do is distinct from 'giay';
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i, 'da_co', false, 'dang_khong_co_cau', to_jsonb(v_thieu));
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_soan(p_buoi uuid, p_loai text, p_so integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_tru text[]; v_test uuid; v_chi_nhom_yeu boolean; r record; v_cautbl text; v_caus text[]; v_out jsonb := '[]'::jsonb;
  v_n integer := greatest(1, least(coalesce(p_so, 3), 10));
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_loai not in ('luyen', 'test') then raise exception 'Loại phải là luyen | test.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or not exists (select 1 from buoi_hoc where id = p_buoi and loai = 'bo_tro_nhe') then raise exception 'Không phải ca bổ trợ sau giờ.'; end if;
  select id into v_test from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test' limit 1;
  if p_loai = 'test' and v_test is not null and exists (select 1 from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id where bl.bai_test_id = v_test) then
    raise exception 'Bài test đã nhập kết quả — không sửa câu được nữa.';
  end if;
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
   where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null and (p_loai = 'luyen' or bt.id is distinct from v_test);
  v_chi_nhom_yeu := exists (select 1 from public._btnhe_dang_buoi(p_buoi) where nhom_yeu);
  for r in select d.*, public._kho_nhanh_cua_dang(b.mon, d.ma_dang) as nhanh, db.nhom_id
             from public._btnhe_dang_buoi(p_buoi) d left join dai_bdm_dang_bai db on db.id = d.ma_dang
            where p_loai = 'luyen' or d.nhom_yeu or not v_chi_nhom_yeu
            order by d.thu_tu loop
    exit when p_loai = 'test' and (select coalesce(sum(jsonb_array_length(x->'caus')), 0) from jsonb_array_elements(v_out) x) >= 10;   -- test tối đa 10 câu
    if p_loai = 'test' and v_test is not null then
      select coalesce(array_agg(k.ma_cau order by k.thu_tu), '{}') into v_caus from bai_test_cau k where k.bai_test_id = v_test and k.ma_dang = r.ma_dang;
      -- câu snapshot theo dạng gốc của câu: dạng không khớp thì để trống, người chọn lại
    else
      v_cautbl := public._kho_cau_tbl(b.mon, r.nhanh);
      v_caus := public._btyeu_chon_cau_khac(v_cautbl, r.ma_dang, null, v_tru, case when p_loai = 'test' then 1 else v_n end, case when p_loai = 'luyen' then 1 else 0 end);
      if coalesce(array_length(v_caus, 1), 0) = 0 and p_loai = 'test' then v_caus := public._btyeu_chon_cau(v_cautbl, r.ma_dang, null, v_tru, 1); end if;
    end if;
    v_tru := v_tru || coalesce(v_caus, '{}');
    v_out := v_out || jsonb_build_object('ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'nhom_yeu', r.nhom_yeu, 'nhanh', r.nhanh,
                                         'nhom_id', r.nhom_id, 'caus', to_jsonb(coalesce(v_caus, '{}')));
  end loop;
  return jsonb_build_object('loai', p_loai, 'mon', b.mon, 'test_id', v_test, 'dang', v_out,
    'da_in', (select coalesce(jsonb_agg(distinct btc.ma_cau), '[]'::jsonb) from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
               where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null and bt.id is distinct from v_test));
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_luu_bai(p_buoi uuid, p_loai text, p_ds jsonb)
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

  for d in select * from jsonb_array_elements(p_ds) loop
    v_nhanh := public._kho_nhanh_cua_dang(b.mon, d->>'ma_dang');
    v_cautbl := public._kho_cau_tbl(b.mon, v_nhanh); v_lttbl := public._kho_lt_tbl(b.mon, v_nhanh);
    for c in select jsonb_array_elements_text(coalesce(d->'caus', '[]'::jsonb)) loop
      i := i + 1;
      perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null);
      -- ghi giấy chỉ nhập được trắc nghiệm / trả lời ngắn (TA khoanh hoặc chấm Đ/S)
      if exists (select 1 from bai_test_cau k where k.bai_test_id = v_bt and k.thu_tu = i and k.loai_cau not in ('trac_nghiem', 'tra_loi_ngan')) then
        v_tl := v_tl || c;
      end if;
    end loop;
    if p_loai = 'test' then
      update bo_tro_yeu_dang set day_at = coalesce(day_at, now()), day_buoi_id = coalesce(day_buoi_id, p_buoi)
       where bo_tro_yeu_id = b.bo_tro_yeu_id and ma_dang = d->>'ma_dang';
    end if;
  end loop;
  if cardinality(v_tl) > 0 then
    raise exception 'Câu % là tự luận (không có bản trắc nghiệm) — bài giấy chỉ nhập được trắc nghiệm / trả lời ngắn. Bỏ câu này hoặc chọn câu khác.', array_to_string(v_tl, ', ');
  end if;
  if i = 0 then raise exception 'Bài chưa có câu nào.'; end if;
  if p_loai = 'test' and i > 10 then raise exception 'Bài test tối đa 10 câu (đang %). Bỏ bớt câu.', i; end if;   -- Thùy 11/11
  update bai_test set so_cau = i where id = v_bt;
  update buoi_hoc_hs set btyeu_che_do = 'giay' where id = b.buoi_hoc_hs_id and btyeu_che_do is distinct from 'giay';
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i);
end $function$;
