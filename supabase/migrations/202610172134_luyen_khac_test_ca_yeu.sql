-- Thùy 17/10: "Bài luyện trong ca bổ trợ yếu bị trùng với bài test của ca đó. Luyện và test đề phải khác nhau."
-- Đo trước khi sửa (30 ngày, 232 cặp buổi×dạng có test): 32 cặp có câu trùng, 41/338 câu test trùng một câu luyện cùng ca.
-- Gốc: test cuối ca gọi _btyeu_chon_cau THEO CỤM; cụm đã bị luyện hết câu mới thì hàm tự "lặp lại" ngay trong cụm ⇒ bốc lại câu vừa luyện,
-- dù cả dạng còn hàng chục câu chưa gặp (20/32 cặp trùng có kho >15 câu). Thêm: kho có câu trùng NỘI DUNG khác mã (đề giống hệt).
-- Sửa: (1) _btyeu_chon_cau_khac = chỉ câu CHƯA gặp trong ca (khác mã + khác đề), có thể chừa N câu; (2) test cuối ca dùng nó, không lặp;
-- (3) luyện (app HS + phiếu giấy) cũng dùng nó và CHỪA 2 câu mỗi dạng cho test, hết câu mới thì ôn lại câu đã luyện trong ca;
-- (4) test rỗng (hết câu mới ở mọi dạng) ⇒ lấy lại 1 dạng kém nhất, báo cờ test_lap_cau. Retest (đang HOLD) giữ nguyên.
-- Dựng từ định nghĩa đang chạy; fn_btyeu_dong_ca / fn_btyeu_luyen_sinh / fn_btyeu_in_sinh chỉ đổi đúng các đoạn trên.
create or replace function public._btyeu_chon_cau_khac(p_cautbl text, p_ma_dang text, p_ma_cum text, p_tru text[], p_n integer, p_giu_lai integer default 0)
returns text[]
language plpgsql
security definer
set search_path to 'public'
as $f$
declare
  v_dk text := public._btyeu_dk_dang_sql(p_cautbl, p_ma_dang);
  v_tru text[] := coalesce(p_tru, '{}');
  -- "cùng đề" = cùng chữ đề + cùng hình + cùng lựa chọn (kho có câu trùng nội dung khác mã; câu chỉ khác hình thì KHÔNG trùng)
  v_fp text := $x$md5(coalesce(c.noi_dung, '') || '|' || coalesce(c.anh_de, '') || '|' || coalesce(c.lua_chon::text, ''))$x$;
  v_da text[]; v_con integer; v_lay integer; v_out text[];
begin
  -- Chữ ký đề của các câu đã gặp trong ca.
  execute format($q$select coalesce(array_agg(distinct %2$s), '{}') from %1$I c where c.ma_cau = any($1)$q$, p_cautbl, v_fp) into v_da using v_tru;
  -- Số câu CHƯA GẶP của cả dạng (mọi cụm), mỗi đề tính một lần.
  execute format($q$select count(*) from (select distinct on (%2$s) c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %3$s and c.ma_cau <> all($2) and %2$s <> all($3)) s$q$,
    p_cautbl, v_fp, v_dk) into v_con using p_ma_dang, v_tru, v_da;
  v_lay := least(greatest(coalesce(p_n, 0), 0), greatest(v_con - greatest(coalesce(p_giu_lai, 0), 0), 0));
  if v_lay = 0 then return '{}'; end if;
  execute format($q$select coalesce(array_agg(s.ma_cau), '{}') from (
      select x.ma_cau from (
        select distinct on (%2$s) c.ma_cau, random() as r from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and ($4::text is null or c.ma_cum = $4) and %3$s and c.ma_cau <> all($2) and %2$s <> all($3)
        order by %2$s, r) x
      order by x.r limit $5) s$q$,
    p_cautbl, v_fp, v_dk) into v_out using p_ma_dang, v_tru, v_da, p_ma_cum, v_lay;
  return v_out;
end $f$;
revoke all on function public._btyeu_chon_cau_khac(text, text, text, text[], integer, integer) from public, anon;
grant execute on function public._btyeu_chon_cau_khac(text, text, text, text[], integer, integer) to authenticated, service_role;

CREATE OR REPLACE FUNCTION public.fn_btyeu_dong_ca(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  b record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean;
  v_cautbl text; v_lttbl text; v_lop uuid;
  v_test uuid; v_retest uuid; v_retest_ngay date;
  v_tru text[]; v_caus text[]; c text; i integer; v_moi_cum integer; v_so_cum integer;
  rc record; rd record; v_lap boolean := false;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if b.trang_thai <> 'mo' then raise exception 'Buổi đã %.', b.trang_thai; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin) mới đóng ca.'; end if;
  if b.diem_danh is distinct from 'co_mat' then raise exception 'Em chưa điểm danh có mặt.'; end if;

  -- Idempotent: đã đóng (đã có test hoặc đã chốt không-học) → trả lại kết quả cũ.
  select id into v_test from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test';
  select id, ngay into v_retest, v_retest_ngay from bai_test where buoi_hoc_id = p_buoi and loai = 'retest';
  if v_test is not null then
    return jsonb_build_object('bo_tro_test_id', v_test, 'retest_id', v_retest, 'retest_ngay', v_retest_ngay, 'khong_hoc', false, 'da_dong_truoc', true);
  end if;

  -- Dạng ĐÃ LUYỆN = có ≥1 câu đã trả lời trong ca.
  drop table if exists _luyen;
  create temp table _luyen on commit drop as
    select ma_dang, ma_cum, so_cau, so_dung from public._btyeu_tien_do(p_buoi) where so_cau > 0;
  if not exists (select 1 from _luyen) then
    return jsonb_build_object('bo_tro_test_id', null, 'retest_id', null, 'retest_ngay', null, 'khong_hoc', true);
  end if;

  -- Chốt dạng đã dạy (neo lần đầu — day_at là mốc TRƯỚC/SAU của outcome, không đè).
  update bo_tro_yeu_dang set day_at = now(), day_buoi_id = p_buoi
    where bo_tro_yeu_id = b.bo_tro_yeu_id and day_at is null and ma_dang in (select distinct ma_dang from _luyen);
  -- 22/09 dạy lại: dạng retest trượt được luyện lại trong ca này ⇒ chờ retest mới
  update bo_tro_yeu_dang set dat = null where bo_tro_yeu_id = b.bo_tro_yeu_id and dat = false and dong_at is null and ma_dang in (select distinct ma_dang from _luyen);

  v_cautbl := public._kho_cau_tbl(b.mon); v_lttbl := public._kho_lt_tbl(b.mon);
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;

  -- TEST CUỐI CA (Thùy 03/09): ≥3 cụm → 1 câu/cụm · 1–2 cụm → 2 câu/cụm · >6 cụm → 6 cụm kém nhất. Sàn 2 · trần 6.
  select count(*) into v_so_cum from _luyen;
  v_moi_cum := case when v_so_cum >= 3 then 1 else 2 end;
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id)
    values (null, v_lop, b.hoc_sinh_id, public._btyeu_today(), 'bo_tro_test', b.mon, 0, 'mo', p_buoi) returning id into v_test;
  i := 0;
  for rc in select * from _luyen order by (so_dung::numeric / nullif(so_cau, 0)) nulls first, so_cau desc limit 6 loop
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, rc.ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, rc.ma_dang)); -- 29/09 nhánh theo dạng
    -- 17/10 Thùy: luyện và test PHẢI khác nhau. Chỉ câu CHƯA gặp trong ca (mã khác + đề khác), không lặp lại như _btyeu_chon_cau.
    v_caus := public._btyeu_chon_cau_khac(v_cautbl, rc.ma_dang, rc.ma_cum, v_tru, v_moi_cum, 0);
    if coalesce(array_length(v_caus, 1), 0) < v_moi_cum then -- cụm cạn → câu MỚI cùng dạng khác cụm
      v_caus := v_caus || public._btyeu_chon_cau_khac(v_cautbl, rc.ma_dang, null, v_tru || coalesce(v_caus, '{}'), v_moi_cum - coalesce(array_length(v_caus, 1), 0), 0);
    end if;
    foreach c in array v_caus loop
      i := i + 1; perform public._kho_snapshot_cau(v_test, v_cautbl, v_lttbl, c, i, rc.ma_cum);
      v_tru := v_tru || c;
    end loop;
  end loop;
  -- Hết câu mới ở MỌI dạng đã luyện (ca cũ luyện sạch kho, hoặc kho 1–2 câu) ⇒ để khỏi đóng ca với test rỗng, lấy lại 1 dạng kém nhất (cờ test_lap_cau).
  if i = 0 then
    for rc in select * from _luyen order by (so_dung::numeric / nullif(so_cau, 0)) nulls first, so_cau desc limit 1 loop
      v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, rc.ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, rc.ma_dang));
      v_caus := public._btyeu_chon_cau(v_cautbl, rc.ma_dang, rc.ma_cum, '{}', v_moi_cum);
      foreach c in array v_caus loop
        i := i + 1; perform public._kho_snapshot_cau(v_test, v_cautbl, v_lttbl, c, i, rc.ma_cum); v_lap := true;
      end loop;
    end loop;
  end if;
  update bai_test set so_cau = i where id = v_test;

  -- RETEST tầng 2: ngày = buổi THƯỜNG kế tiếp của lớp em theo TKB (≤28 ngày). Không có → không sinh (cờ cho OPS).
  if v_lop is not null and public._btyeu_retest_bat() then -- HOLD retest 29/09: không sinh
    select d into v_retest_ngay
    from generate_series(public._btyeu_today() + 1, public._btyeu_today() + 28, interval '1 day') g(d)
    where exists (select 1 from thoi_khoa_bieu t
                  where t.lop_id = v_lop and t.thu = extract(isodow from g.d)::int + 1
                    and t.hieu_luc_tu <= g.d::date and (t.hieu_luc_den is null or t.hieu_luc_den >= g.d::date))
    order by d limit 1;
  end if;
  if v_retest_ngay is not null then
    insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id)
      values (null, v_lop, b.hoc_sinh_id, v_retest_ngay, 'retest', b.mon, 0, 'mo', p_buoi) returning id into v_retest;
    i := 0;
    -- 3 câu/dạng đã dạy trong ca, trần 9 → ưu tiên dạng em làm kém nhất trong ca.
    for rd in select ma_dang, sum(so_dung)::numeric / nullif(sum(so_cau), 0) as ti_le from _luyen group by ma_dang order by ti_le nulls first limit 3 loop
      v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, rd.ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, rd.ma_dang)); -- 29/09 nhánh theo dạng
      v_caus := public._btyeu_chon_cau(v_cautbl, rd.ma_dang, null, v_tru, 3);
      foreach c in array v_caus loop
        i := i + 1; perform public._kho_snapshot_cau(v_retest, v_cautbl, v_lttbl, c, i, null);
        v_tru := v_tru || c;
      end loop;
    end loop;
    if i = 0 then delete from bai_test where id = v_retest; v_retest := null; v_retest_ngay := null;
    else update bai_test set so_cau = i where id = v_retest; end if;
  end if;

  return jsonb_build_object('bo_tro_test_id', v_test, 'retest_id', v_retest, 'retest_ngay', v_retest_ngay, 'khong_hoc', false, 'da_dong_truoc', false, 'test_lap_cau', v_lap);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_luyen_sinh(p_buoi uuid, p_ma_dang text, p_ma_cum text DEFAULT NULL::text, p_so_cau integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  b record; v_lop uuid; v_cautbl text; v_lttbl text;
  v_tru text[]; v_caus text[]; v_bt uuid; i integer := 0; c text; v_n integer := greatest(1, least(coalesce(p_so_cau, 3), 10));
begin
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or b.hoc_sinh_id <> v_hs then raise exception 'Không phải ca bổ trợ của em.'; end if;
  if b.trang_thai <> 'mo' or b.ngay <> public._btyeu_today() then raise exception 'Ca này không mở hôm nay.'; end if;
  if b.diem_danh is distinct from 'co_mat' then raise exception 'Chưa điểm danh có mặt.'; end if;
  if exists (select 1 from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test') then raise exception 'Ca đã đóng — làm bài kiểm tra cuối buổi nhé.'; end if;
  if not exists (select 1 from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and ma_dang = p_ma_dang) then raise exception 'Dạng không thuộc ca bổ trợ này.'; end if;
  if public._kho_nhanh_cua_dang(b.mon, p_ma_dang) = 'hinh_mo_hinh' then raise exception 'Bài Hình theo mô hình học trên GIẤY với thầy cô — em đưa iPad cho trợ giảng, trợ giảng sẽ in đề và chấm cho em nhé.'; end if; -- 14/10

  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', b.mon; end if;

  v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, p_ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, p_ma_dang)); -- 29/09 nhánh theo dạng
  -- Câu đã gặp trong CA (mọi bài của buổi) — né trước, cạn thì lặp (trong _btyeu_chon_cau).
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;
  -- 17/10 Thùy: luyện ≠ test cuối ca. Chỉ câu CHƯA gặp trong ca và CHỪA 2 câu của dạng cho test; hết thì ôn lại câu em đã luyện trong ca (KHÔNG lấy câu chừa).
  v_caus := public._btyeu_chon_cau_khac(v_cautbl, p_ma_dang, p_ma_cum, v_tru, v_n, 2);
  if coalesce(array_length(v_caus, 1), 0) = 0 then
    select coalesce(array_agg(s.ma_cau), '{}') into v_caus from (
      select btc.ma_cau from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id
      where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro' and btc.ma_dang = p_ma_dang and btc.ma_cau is not null and (p_ma_cum is null or btc.ma_cum = p_ma_cum)
      group by btc.ma_cau order by random() limit v_n) s;
  end if;
  if coalesce(array_length(v_caus, 1), 0) = 0 and coalesce(array_length(public._btyeu_chon_cau_khac(v_cautbl, p_ma_dang, p_ma_cum, v_tru, 1, 0), 1), 0) > 0 then
    raise exception 'Dạng này còn quá ít câu trắc nghiệm để tách bài luyện và bài kiểm tra cuối ca — em học dạng này với thầy cô trên giấy nhé.';
  end if;
  if coalesce(array_length(v_caus, 1), 0) = 0 then raise exception 'Dạng này chưa có câu TRẮC NGHIỆM trong kho — em học dạng này với thầy cô trên giấy nhé (bổ trợ trên app chỉ dùng trắc nghiệm).'; end if;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id)
    values (null, v_lop, v_hs, public._btyeu_today(), 'bo_tro', b.mon, 0, 'mo', p_buoi) returning id into v_bt;
  foreach c in array v_caus loop
    i := i + 1;
    perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, p_ma_cum);
  end loop;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_in_sinh(p_buoi uuid, p_so_cau integer DEFAULT 5)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_lop uuid; v_cautbl text; v_lttbl text; v_tru text[]; v_caus text[]; v_bt uuid; i integer := 0; c text; d record;
  v_thieu text[] := '{}'; v_n integer := greatest(1, least(coalesce(p_so_cau, 5), 10));
  v_chi_hinh boolean := coalesce(current_setting('bk.chi_hinh', true), '') = '1'; -- 14/10: ca 📱 app chỉ in các dạng Hình mô hình (xem fn_btyeu_in_sinh_hinh)
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự in được tài liệu.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không thấy ca bổ trợ yếu.'; end if;
  if b.trang_thai <> 'mo' then raise exception 'Ca này không còn mở (%).', b.trang_thai; end if;
  if exists (select 1 from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test') then raise exception 'Ca đã đóng — không in thêm bài luyện.'; end if;
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', b.mon; end if;
  v_cautbl := public._kho_cau_tbl(b.mon); v_lttbl := public._kho_lt_tbl(b.mon);
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
    values (null, v_lop, b.hoc_sinh_id, b.ngay, 'bo_tro', b.mon, 0, 'mo', p_buoi, now(), public.jwt_uid()) returning id into v_bt;
  for d in select ma_dang from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and dong_at is null
         and (not v_chi_hinh or public._kho_nhanh_cua_dang(b.mon, ma_dang) = 'hinh_mo_hinh') order by diem_luc_mo nulls last, created_at loop
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d.ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d.ma_dang)); -- 29/09 nhánh theo dạng
    v_caus := public._btyeu_chon_cau_khac(v_cautbl, d.ma_dang, null, v_tru, v_n, 2); -- 17/10: luyện ≠ test, chừa 2 câu cho test cuối ca
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_thieu := v_thieu || d.ma_dang; continue; end if;
    foreach c in array v_caus loop
      i := i + 1;
      perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null);
    end loop;
    v_tru := v_tru || v_caus;
  end loop;
  if i = 0 then
    -- Không có câu nào ⇒ raise làm ROLLBACK cả transaction, dòng bai_test vừa tạo tự biến mất (không để lại bài rỗng).
    raise exception 'Các dạng của ca này chưa có câu trong kho — chưa in được.';
  end if;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i, 'dang_khong_co_cau', to_jsonb(v_thieu));
end $function$;
