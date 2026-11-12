-- ============================================================================
-- 202611121501 — sau_gio_cap_tu_luan_cau_hinh_in
-- VÌ SAO (Thùy 12/11): "học sinh làm ra giấy nên kết quả phải là DCS không phải 4 đáp án · cấp 1, 2 tự luận còn cấp 3 trắc nghiệm ·
--   cần có chọn dòng và những cái khác như builder giáo trình hoàn thiện".
--   (1) bai_test.cau_hinh_in (jsonb, NULL = mặc định): dòng kẻ / cột / chế độ hình / cỡ ảnh theo câu — lưu khi soạn, bản in khuôn ET đọc lại.
--   (2) Chọn câu sau giờ theo CẤP của em: khối 3–9 tự luận (kho chuẩn, có lời giải) trước, thiếu thì luật cũ TN → TLN; khối 10–12 ngược lại.
--       Áp ở đề xuất soạn (fn_btnhe_soan), gợi ý lại (fn_btnhe_goi_y_dang), tự sinh test (fn_btnhe_in_test). Bài luyện/test bổ trợ YẾU không đổi.
--   (3) fn_btnhe_luu_bai: bỏ chặn câu tự luận (TA nhập Đ/C/S mọi loại câu) + nhận cấu hình in.
--   (4) fn_btyeu_in_lay trả thêm cau_hinh_in.
-- MẤT GÌ (Luật xoá): không mất dữ liệu. ALTER TABLE bai_test thêm 1 cột NULL. DROP + tạo lại fn_btnhe_luu_bai (thêm tham số) — chỉ là hàm,
--   người gọi duy nhất src/lib/botro_nhe.ts (sửa cùng đợt).
-- ============================================================================

-- (1) cấu hình in của bài (dòng kẻ / cột / chế độ hình / cỡ ảnh — như builder giáo trình). NULL = in mặc định.
alter table bai_test add column if not exists cau_hinh_in jsonb;
comment on column bai_test.cau_hinh_in is 'Cấu hình in theo câu (btvnLinesByCau · colByCau · hinhCheDoByCau · anhMmByCau, khoá = ma_cau). Bổ trợ sau giờ soạn như builder (Thùy 12/11). NULL = mặc định.';

-- (2) cấp của em: khối 3–9 (cấp 1–2) ƯU TIÊN TỰ LUẬN · khối 10–12 (cấp 3) ưu tiên trắc nghiệm (Thùy 12/11)
create or replace function public._btnhe_uu_tu_luan(p_hs uuid)
returns boolean language sql stable security definer set search_path to 'public' as $$
  select coalesce(nullif(regexp_replace(coalesce(h.khoi, ''), '\D', '', 'g'), '')::int < 10, true) from hoc_sinh h where h.id = p_hs
$$;
revoke execute on function public._btnhe_uu_tu_luan(uuid) from public, anon;

-- (3) chọn câu bổ trợ sau giờ: tự luận trước (có lời giải, kho chuẩn) rồi bù bằng luật cũ (_btyeu_chon_cau_khac: TN → TLN); hoặc ngược lại.
--     Né câu đã gặp (mã + đề trùng chữ/hình/lựa chọn) như _btyeu_chon_cau_khac.
create or replace function public._btnhe_chon_tu_luan(p_cautbl text, p_ma_dang text, p_tru text[], p_n integer)
returns text[] language plpgsql security definer set search_path to 'public' as $$
declare v_fp text := $x$md5(coalesce(c.noi_dung, '') || '|' || coalesce(c.anh_de, '') || '|' || coalesce(c.lua_chon::text, ''))$x$;
  v_tru text[] := coalesce(p_tru, '{}'); v_da text[]; v_out text[];
begin
  if coalesce(p_n, 0) <= 0 then return '{}'; end if;
  execute format($q$select coalesce(array_agg(distinct %2$s), '{}') from %1$I c where c.ma_cau = any($1)$q$, p_cautbl, v_fp) into v_da using v_tru;
  execute format($q$select coalesce(array_agg(s.ma_cau), '{}') from (
      select x.ma_cau from (
        select distinct on (%2$s) c.ma_cau, random() as r from %1$I c
         where c.dang_chinh = $1 and c.xoa_at is null and c.kho_chuan and %3$s and c.loai_cau = 'tu_luan' and coalesce(c.loi_giai, '') <> ''
           and c.ma_cau <> all($2) and %2$s <> all($3)
         order by %2$s, r) x order by x.r limit $4) s$q$, p_cautbl, v_fp, public._kho_dk_du_hinh_sql())
    into v_out using p_ma_dang, v_tru, v_da, p_n;
  return v_out;
end $$;
revoke execute on function public._btnhe_chon_tu_luan(text, text, text[], integer) from public, anon;

create or replace function public._btnhe_chon_cau(p_cautbl text, p_ma_dang text, p_tru text[], p_n integer, p_tu_luan boolean, p_giu_lai integer default 0)
returns text[] language plpgsql security definer set search_path to 'public' as $$
declare v text[] := '{}'; v_con integer;
begin
  if p_tu_luan then
    v := public._btnhe_chon_tu_luan(p_cautbl, p_ma_dang, p_tru, p_n);
    v_con := p_n - coalesce(array_length(v, 1), 0);
    if v_con > 0 then v := v || coalesce(public._btyeu_chon_cau_khac(p_cautbl, p_ma_dang, null, coalesce(p_tru, '{}') || v, v_con, p_giu_lai), '{}'); end if;
  else
    v := coalesce(public._btyeu_chon_cau_khac(p_cautbl, p_ma_dang, null, p_tru, p_n, p_giu_lai), '{}');
    v_con := p_n - coalesce(array_length(v, 1), 0);
    if v_con > 0 then v := v || public._btnhe_chon_tu_luan(p_cautbl, p_ma_dang, coalesce(p_tru, '{}') || v, v_con); end if;
  end if;
  return v;
end $$;
revoke execute on function public._btnhe_chon_cau(text, text, text[], integer, boolean, integer) from public, anon;

-- (4) vá hàm (thay đúng đoạn trên định nghĩa đang chạy)
drop function if exists public.fn_btnhe_luu_bai(uuid, text, jsonb);   -- thêm tham số cấu hình in (4 tham số), tránh 2 bản trùng tên
CREATE OR REPLACE FUNCTION public.fn_btnhe_soan(p_buoi uuid, p_loai text, p_so integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_tl boolean; b record; v_tru text[]; v_test uuid; v_chi_nhom_yeu boolean; r record; v_cautbl text; v_caus text[]; v_out jsonb := '[]'::jsonb;
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
      v_tl := coalesce(v_tl, public._btnhe_uu_tu_luan(b.hoc_sinh_id));   -- 12/11: cấp 1–2 tự luận trước, cấp 3 trắc nghiệm trước
      v_caus := public._btnhe_chon_cau(v_cautbl, r.ma_dang, v_tru, case when p_loai = 'test' then 1 else v_n end, v_tl, case when p_loai = 'luyen' then 1 else 0 end);
      if coalesce(array_length(v_caus, 1), 0) = 0 and p_loai = 'test' then v_caus := public._btyeu_chon_cau(v_cautbl, r.ma_dang, null, v_tru, 1); end if;
    end if;
    v_tru := v_tru || coalesce(v_caus, '{}');
    v_out := v_out || jsonb_build_object('ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'nhom_yeu', r.nhom_yeu, 'nhanh', r.nhanh,
                                         'nhom_id', r.nhom_id, 'caus', to_jsonb(coalesce(v_caus, '{}')));
  end loop;
  return jsonb_build_object('loai', p_loai, 'mon', b.mon, 'test_id', v_test, 'dang', v_out,
    'cau_hinh_in', case when p_loai = 'test' then (select cau_hinh_in from bai_test where id = v_test) end,
    'da_in', (select coalesce(jsonb_agg(distinct btc.ma_cau), '[]'::jsonb) from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
               where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null and bt.id is distinct from v_test));
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btnhe_goi_y_dang(p_buoi uuid, p_ma_dang text, p_n integer, p_tru text[])
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_cautbl text; v_tru text[];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không thấy ca.'; end if;
  select coalesce(array_agg(distinct btc.ma_cau), '{}') || coalesce(p_tru, '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
   where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro' and btc.ma_cau is not null;
  v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, p_ma_dang));
  return coalesce(public._btnhe_chon_cau(v_cautbl, p_ma_dang, v_tru, greatest(1, least(coalesce(p_n, 1), 10)), public._btnhe_uu_tu_luan(b.hoc_sinh_id), 0), '{}');
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
  for r in select * from public._btnhe_dang_buoi(p_buoi) where nhom_yeu or not v_chi_nhom_yeu order by thu_tu loop
    exit when i >= 10;   -- Thùy 11/11: bài test tối đa 10 câu (dạng nhóm yếu yếu nhất trước)
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, r.ma_dang));
    v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, r.ma_dang));
    v_caus := public._btnhe_chon_cau(v_cautbl, r.ma_dang, v_tru, 1, public._btnhe_uu_tu_luan(b.hoc_sinh_id), 0);
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
  if i = 0 then raise exception 'Bài chưa có câu nào.'; end if;
  if p_loai = 'test' and i > 10 then raise exception 'Bài test tối đa 10 câu (đang %). Bỏ bớt câu.', i; end if;   -- Thùy 11/11
  update bai_test set so_cau = i, cau_hinh_in = p_cau_hinh where id = v_bt;   -- cấu hình in như builder (dòng · cột · hình)
  update buoi_hoc_hs set btyeu_che_do = 'giay' where id = b.buoi_hoc_hs_id and btyeu_che_do is distinct from 'giay';
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_in_lay(p_bai_test uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare t record; v_bd text; v_caus jsonb;
begin
  if not public.la_thanh_vien() then return null; end if;
  select bt.cau_hinh_in, bt.id, bt.loai, bt.mon, bt.ngay, bt.in_giay_at, bt.buoi_hoc_id, bt.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi,
         b.gio_bat_dau, b.gio_ket_thuc, b.phong, ns.ho_ten as nguoi_ten,
         exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop') as da_nop
    into t
  from bai_test bt join hoc_sinh hs on hs.id = bt.hoc_sinh_id
  left join buoi_hoc b on b.id = bt.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
  where bt.id = p_bai_test and bt.loai in ('bo_tro', 'bo_tro_test');
  if t.id is null then return null; end if;
  v_bd := public._kho_ban_do_tbl(t.mon);
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', k.id, 'thu_tu', k.thu_tu, 'ma_cau', k.ma_cau, 'ma_dang', k.ma_dang, 'ten_dang', coalesce(bd.ten_dang, public._kho_ten_dang(%2$L, k.ma_dang), k.ma_dang),
      'la_hinh_mh', public._btyeu_la_hinh_mh(k.ma_dang), 'loai_cau', k.loai_cau, 'noi_dung', k.noi_dung, 'lua_chon', k.lua_chon, 'anh_de', k.anh_de, 'dap_an_key', k.dap_an_key, 'loi_giai', k.loi_giai,
      'chon', (select blc.dap_an_hs from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = k.bai_test_id and blc.bai_test_cau_id = k.id limit 1),
      'verdict', (select blc.verdict from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = k.bai_test_id and blc.bai_test_cau_id = k.id limit 1)
    ) order by k.thu_tu), '[]'::jsonb)
    from bai_test_cau k left join %1$I bd on bd.ma_dang = k.ma_dang where k.bai_test_id = $1
  $q$, v_bd, t.mon) into v_caus using p_bai_test;
  return jsonb_build_object('cau_hinh_in', t.cau_hinh_in, 'bai_test_id', t.id, 'loai', t.loai, 'da_nop', t.da_nop, 'mon', t.mon, 'ngay', t.ngay, 'in_giay_at', t.in_giay_at, 'buoi_id', t.buoi_hoc_id,
    'hs', jsonb_build_object('id', t.hoc_sinh_id, 'ho_ten', t.ho_ten, 'ma_hs', t.ma_hs, 'khoi', t.khoi),
    'gio_bat_dau', t.gio_bat_dau, 'gio_ket_thuc', t.gio_ket_thuc, 'phong', t.phong, 'nguoi_ten', t.nguoi_ten, 'caus', v_caus);
end $function$;
revoke execute on function public.fn_btnhe_luu_bai(uuid, text, jsonb, jsonb) from public, anon;
grant execute on function public.fn_btnhe_luu_bai(uuid, text, jsonb, jsonb) to authenticated;
