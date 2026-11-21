-- ============================================================================
-- 202611211624 — in_giay_moi_loai_cau
-- VÌ SAO (Thùy 21/11, ca Đặng Thảo Vy 6S1 HS0270, bổ trợ yếu 5 dạng chỉ in / luyện được 1): "có MCQ thì hiện trên app, còn IN GIẤY thì phải in được MỌI LOẠI CÂU."
--   Đo: 3/5 dạng của ca chỉ có câu TỰ LUẬN (có lời giải, không đáp án), 1 dạng có 1 MCQ nên luật "MCQ trước" khoá cả dạng chỉ còn 1 câu ⇒ chừa 2 cho test ⇒ 0 câu luyện.
--   · _btyeu_chon_cau_giay: bộ câu của app (_btyeu_chon_cau_khac: MCQ rồi trả lời ngắn) ĐI TRƯỚC, thiếu thì bù MỌI loại câu còn lại (tự luận · đúng/sai · trả lời ngắn…, trừ kéo-thả),
--     chuẩn kho, đủ hình, có đáp án hoặc lời giải để TA chấm; khác mã + khác đề; vẫn chừa p_giu_lai câu cho test.
--   · fn_btyeu_in_sinh (phiếu luyện giấy, kể cả Hình mô hình qua fn_btyeu_in_sinh_hinh) dùng hàm này. fn_btyeu_dong_ca: ca chế độ 📄 giấy ⇒ test cuối ca cũng dùng hàm này; ca 📱 app giữ nguyên.
--   · fn_btyeu_giay_nhap: bỏ chặn "chỉ trắc nghiệm / trả lời ngắn" — câu không phải trắc nghiệm TA chấm Đúng (1) / Sai (0).
--   Luồng APP (iPad) KHÔNG đổi: vẫn MCQ trước, cả dạng 0 MCQ mới trả lời ngắn (spec-bo-tro.md §6).
-- MẤT GÌ (Luật xoá): không — thêm 1 hàm, dựng lại 3 hàm từ định nghĩa ĐANG CHẠY chỉ đổi đúng các dòng ghi chú "21/11".
-- ============================================================================
create or replace function public._btyeu_chon_cau_giay(p_cautbl text, p_ma_dang text, p_ma_cum text, p_tru text[], p_n integer, p_giu_lai integer default 0)
returns text[] language plpgsql security definer set search_path to 'public' as $f$
declare
  v_fp text := $x$md5(coalesce(c.noi_dung, '') || '|' || coalesce(c.anh_de, '') || '|' || coalesce(c.lua_chon::text, ''))$x$;
  v_dk text := public._btyeu_dk_dang_sql(p_cautbl, p_ma_dang);   -- bộ câu của app: đi trước
  v_tru text[] := coalesce(p_tru, '{}'); v_da text[]; v_out text[];
begin
  if coalesce(p_n, 0) <= 0 then return '{}'; end if;
  execute format($q$select coalesce(array_agg(distinct %2$s), '{}') from %1$I c where c.ma_cau = any($1)$q$, p_cautbl, v_fp) into v_da using v_tru;
  execute format($q$select coalesce(array_agg(y.ma_cau order by y.rn), '{}') from (
      select x.ma_cau, row_number() over (order by x.ok desc, x.r) as rn, count(*) over () as tot from (
        select distinct on (%2$s) c.ma_cau, (%3$s) as ok, random() as r from %1$I c
         where c.dang_chinh = $1 and c.xoa_at is null and ($4::text is null or c.ma_cum = $4) and c.kho_chuan and %4$s
           and c.loai_cau <> 'keo_tha' and (c.dap_an is not null or coalesce(to_jsonb(c) ->> 'loi_giai', '') <> '')
           and c.ma_cau <> all($2) and %2$s <> all($3)
         order by %2$s, (%3$s) desc, random()) x) y
     where y.rn <= greatest(0, least($5, y.tot - $6))$q$, p_cautbl, v_fp, v_dk, public._kho_dk_du_hinh_sql())
    into v_out using p_ma_dang, v_tru, v_da, p_ma_cum, p_n, greatest(coalesce(p_giu_lai, 0), 0);
  return v_out;
end $f$;
revoke execute on function public._btyeu_chon_cau_giay(text, text, text, text[], integer, integer) from public, anon, authenticated;

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
  if exists (select 1 from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test')
     and not exists (select 1 from buoi_hoc where id = p_buoi and loai = 'bo_tro_nhe') -- 11/11 sau giờ: luyện / test in riêng, thứ tự tuỳ người in
  then raise exception 'Ca đã đóng — không in thêm bài luyện.'; end if;
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', b.mon; end if;
  v_cautbl := public._kho_cau_tbl(b.mon); v_lttbl := public._kho_lt_tbl(b.mon);
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
    values (null, v_lop, b.hoc_sinh_id, b.ngay, 'bo_tro', b.mon, 0, 'mo', p_buoi, now(), public.jwt_uid()) returning id into v_bt;
  for d in select x.ma_dang from bo_tro_yeu_dang x
           left join public._btnhe_dang_buoi(p_buoi) sg on sg.ma_dang = x.ma_dang  -- 11/11 sau giờ: dạng nhóm yếu trước (ca Yếu: sg rỗng ⇒ thứ tự cũ)
         where x.bo_tro_yeu_id = b.bo_tro_yeu_id and x.dong_at is null
         and (not v_chi_hinh or public._kho_nhanh_cua_dang(b.mon, x.ma_dang) = 'hinh_mo_hinh') order by sg.thu_tu nulls last, x.diem_luc_mo nulls last, x.created_at loop
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d.ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d.ma_dang)); -- 29/09 nhánh theo dạng
    v_caus := public._btyeu_chon_cau_giay(v_cautbl, d.ma_dang, null, v_tru, v_n, 2); -- 17/10: luyện ≠ test, chừa 2 câu cho test cuối ca · 21/11: IN GIẤY = mọi loại câu
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
end $function$
;

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
  rc record; rd record; v_lap boolean := false; v_giay boolean;
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

  select (btyeu_che_do = 'giay') into v_giay from buoi_hoc_hs where id = b.buoi_hoc_hs_id;   -- 21/11: ca 📄 giấy ⇒ test cuối ca cũng chọn MỌI loại câu
  v_giay := coalesce(v_giay, false);
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
    v_caus := case when v_giay then public._btyeu_chon_cau_giay(v_cautbl, rc.ma_dang, rc.ma_cum, v_tru, v_moi_cum, 0) else public._btyeu_chon_cau_khac(v_cautbl, rc.ma_dang, rc.ma_cum, v_tru, v_moi_cum, 0) end;
    if coalesce(array_length(v_caus, 1), 0) < v_moi_cum then -- cụm cạn → câu MỚI cùng dạng khác cụm
      v_caus := v_caus || case when v_giay then public._btyeu_chon_cau_giay(v_cautbl, rc.ma_dang, null, v_tru || coalesce(v_caus, '{}'), v_moi_cum - coalesce(array_length(v_caus, 1), 0), 0) else public._btyeu_chon_cau_khac(v_cautbl, rc.ma_dang, null, v_tru || coalesce(v_caus, '{}'), v_moi_cum - coalesce(array_length(v_caus, 1), 0), 0) end;
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
end $function$
;

CREATE OR REPLACE FUNCTION public.fn_btyeu_giay_nhap(p_bai_test_cau uuid, p_chon integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare k record; v_bl uuid; v_tt text; v_verdict text; v_letters text[] := array['A','B','C','D','E','F'];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự nhập được kết quả bài giấy.'; end if;
  select btc.id, btc.loai_cau, btc.dap_an_key, btc.diem, bt.id as bt_id, bt.hoc_sinh_id, bt.in_giay_at, bt.loai
    into k from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id where btc.id = p_bai_test_cau;
  if k.id is null then raise exception 'Không thấy câu.'; end if;
  if k.loai not in ('bo_tro', 'bo_tro_test') or k.in_giay_at is null then raise exception 'Chỉ nhập tay cho bài bổ trợ IN GIẤY (bài trên app do em tự làm).'; end if;
  insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at) values (k.bt_id, k.hoc_sinh_id, 'dang_lam', now())
    on conflict (bai_test_id, hoc_sinh_id) do update set bai_test_id = excluded.bai_test_id returning id, trang_thai into v_bl, v_tt;
  if v_tt = 'da_nop' then raise exception 'Bài đã nộp — không sửa kết quả được nữa.'; end if;
  if p_chon is null then
    delete from bai_lam_cau where bai_lam_id = v_bl and bai_test_cau_id = k.id; -- xoá lựa chọn nhập nhầm (dòng do chính luồng nhập tay này tạo)
    return jsonb_build_object('chon', null, 'verdict', null);
  end if;
  -- Thùy 10/10: câu TRẢ LỜI NGẮN trên giấy — TA đối chiếu đáp án rồi chấm: 1 = Đúng · 0 = Sai.
  if k.loai_cau <> 'trac_nghiem' then   -- 21/11: trả lời ngắn · tự luận · đúng/sai… — TA đối chiếu đáp án / lời giải rồi chấm
    if p_chon not in (0, 1) then raise exception 'Câu không phải trắc nghiệm: chấm 1 (đúng) hoặc 0 (sai).'; end if;
    v_verdict := case when p_chon = 1 then 'correct' else 'wrong' end;
    insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
      values (v_bl, k.id, to_jsonb(case when p_chon = 1 then 'đúng (TA chấm giấy)' else 'sai (TA chấm giấy)' end), v_verdict, case when v_verdict = 'correct' then coalesce(k.diem, 1) else 0 end, 'manual', now())
      on conflict (bai_lam_id, bai_test_cau_id) do update set dap_an_hs = excluded.dap_an_hs, verdict = excluded.verdict, diem = excluded.diem, cham_boi = 'manual';
    return jsonb_build_object('chon', p_chon, 'verdict', v_verdict);
  end if;
  if p_chon < 0 or p_chon > 5 then raise exception 'Lựa chọn không hợp lệ.'; end if;
  v_verdict := case when v_letters[p_chon + 1] = upper(trim(k.dap_an_key #>> '{}')) then 'correct' else 'wrong' end;
  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
    values (v_bl, k.id, to_jsonb(p_chon), v_verdict, case when v_verdict = 'correct' then coalesce(k.diem, 1) else 0 end, 'manual', now())
    on conflict (bai_lam_id, bai_test_cau_id) do update set dap_an_hs = excluded.dap_an_hs, verdict = excluded.verdict, diem = excluded.diem, cham_boi = 'manual';
  return jsonb_build_object('chon', p_chon, 'verdict', v_verdict);
end $function$
;
