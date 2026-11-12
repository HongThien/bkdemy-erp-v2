-- ============================================================================
-- 202611121705 — sau_gio_cap2_tl_tln_ngang_hang   (SỬA LẠI mig 202611121657 cùng ngày)
-- VÌ SAO (Thùy 12/11, nguyên văn qua phiên "Hoàn thiện phòng làm việc"): "trả lời ngắn với tự luận như nhau. ưu tiên 2 cái này trước.
--   ko có mới dùng trắc nghiệm". Khối 3–9 (cấp 1–2): tự luận (có lời giải) + trả lời ngắn (có đáp án) gộp MỘT nhóm, chọn ngẫu nhiên,
--   không loại nào hơn; nhóm hết câu ⇒ MỚI dùng trắc nghiệm cho phần còn thiếu (không bỏ dạng, không báo thiếu).
--   Khối 10–12 giữ nguyên. fn_btnhe_soan / fn_btnhe_in_test trả lại đường lùi _btyeu_chon_cau như trước mig 1657.
-- MẤT GÌ (Luật xoá): không — create or replace hàm.
-- ============================================================================

-- chọn N câu 1 NHÓM loại: 'tu_luan' (có lời giải) | 'tra_loi_ngan' (có đáp án) | 'tl_tln' = cả hai NGANG HÀNG, trộn ngẫu nhiên
create or replace function public._btnhe_chon_loai(p_cautbl text, p_ma_dang text, p_tru text[], p_n integer, p_loai text)
returns text[] language plpgsql security definer set search_path to 'public' as $$
declare v_fp text := $x$md5(coalesce(c.noi_dung, '') || '|' || coalesce(c.anh_de, '') || '|' || coalesce(c.lua_chon::text, ''))$x$;
  v_tru text[] := coalesce(p_tru, '{}'); v_da text[]; v_out text[];
  v_dk text := case p_loai when 'tu_luan' then $d$c.loai_cau = 'tu_luan' and coalesce(c.loi_giai, '') <> ''$d$
                           when 'tra_loi_ngan' then $d$c.loai_cau = 'tra_loi_ngan' and c.dap_an is not null$d$
                           when 'tl_tln' then $d$((c.loai_cau = 'tu_luan' and coalesce(c.loi_giai, '') <> '') or (c.loai_cau = 'tra_loi_ngan' and c.dap_an is not null))$d$ end;
begin
  if coalesce(p_n, 0) <= 0 or v_dk is null then return '{}'; end if;
  execute format($q$select coalesce(array_agg(distinct %2$s), '{}') from %1$I c where c.ma_cau = any($1)$q$, p_cautbl, v_fp) into v_da using v_tru;
  execute format($q$select coalesce(array_agg(s.ma_cau), '{}') from (
      select x.ma_cau from (
        select distinct on (%2$s) c.ma_cau, random() as r from %1$I c
         where c.dang_chinh = $1 and c.xoa_at is null and c.kho_chuan and %3$s and %4$s
           and c.ma_cau <> all($2) and %2$s <> all($3)
         order by %2$s, r) x order by x.r limit $4) s$q$, p_cautbl, v_fp, public._kho_dk_du_hinh_sql(), v_dk)
    into v_out using p_ma_dang, v_tru, v_da, p_n;
  return v_out;
end $$;
revoke execute on function public._btnhe_chon_loai(text, text, text[], integer, text) from public, anon;

-- Thùy 12/11 (chốt lại 17:05): CẤP 1–2 (khối 3–9) tự luận + trả lời ngắn NGANG HÀNG trước; nhóm hết ⇒ mới dùng trắc nghiệm (luật cũ).
--   Cấp 3 (khối 10–12): trắc nghiệm → trả lời ngắn (_btyeu_chon_cau_khac) rồi mới tự luận — như mig 202611121501.
create or replace function public._btnhe_chon_cau(p_cautbl text, p_ma_dang text, p_tru text[], p_n integer, p_tu_luan boolean, p_giu_lai integer default 0)
returns text[] language plpgsql security definer set search_path to 'public' as $$
declare v text[] := '{}'; v_con integer;
begin
  if p_tu_luan then
    v := public._btnhe_chon_loai(p_cautbl, p_ma_dang, p_tru, p_n, 'tl_tln');
    v_con := p_n - coalesce(array_length(v, 1), 0);
    if v_con > 0 then v := v || coalesce(public._btyeu_chon_cau_khac(p_cautbl, p_ma_dang, null, coalesce(p_tru, '{}') || v, v_con, p_giu_lai), '{}'); end if;
  else
    v := coalesce(public._btyeu_chon_cau_khac(p_cautbl, p_ma_dang, null, p_tru, p_n, p_giu_lai), '{}');
    v_con := p_n - coalesce(array_length(v, 1), 0);
    if v_con > 0 then v := v || public._btnhe_chon_loai(p_cautbl, p_ma_dang, coalesce(p_tru, '{}') || v, v_con, 'tu_luan'); end if;
  end if;
  return v;
end $$;

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
      if coalesce(array_length(v_caus, 1), 0) = 0 and p_loai = 'test' then v_caus := public._btyeu_chon_cau(v_cautbl, r.ma_dang, null, v_tru, 1); end if;   -- hết TL/TLN ⇒ trắc nghiệm
    end if;
    v_tru := v_tru || coalesce(v_caus, '{}');
    v_out := v_out || jsonb_build_object('ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'nhom_yeu', r.nhom_yeu, 'nhanh', r.nhanh,
                                         'nhom_id', r.nhom_id, 'caus', to_jsonb(coalesce(v_caus, '{}')));
  end loop;
  return jsonb_build_object('loai', p_loai, 'mon', b.mon, 'test_id', v_test, 'dang', v_out,
    'tu_luan', coalesce(v_tl, public._btnhe_uu_tu_luan(b.hoc_sinh_id)),   -- màn báo "dạng chưa có tự luận / trả lời ngắn"
    'cau_hinh_in', case when p_loai = 'test' then (select cau_hinh_in from bai_test where id = v_test) end,
    'da_in', (select coalesce(jsonb_agg(distinct btc.ma_cau), '[]'::jsonb) from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
               where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null and bt.id is distinct from v_test));
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
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_caus := public._btyeu_chon_cau(v_cautbl, r.ma_dang, null, v_tru, 1); end if;   -- hết TL/TLN ⇒ trắc nghiệm
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
