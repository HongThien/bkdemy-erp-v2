-- HOLD luồng RETEST tầng 2 của bổ trợ yếu (Thùy 29/09): "quy trình mới không chạy được retest — hold lại, ẩn đi, sau này làm".
-- KHÔNG xoá / sửa dữ liệu: bài retest đã sinh (bai_test.loai='retest') + retest_diem/dat của dạng giữ nguyên, chỉ ẨN.
-- 1 công tắc DUY NHẤT phía DB: public._btyeu_retest_bat() (false = hold). Bật lại = migration MỚI đổi thành true
-- + client src/lib/botro_yeu.ts RETEST_BAT = true (2 chỗ phải lật cùng nhau). Xem spec-bo-tro.md "HOLD retest".
-- Khi hold:
--   • đóng ca / hoàn tất ca / mở màn Xếp KHÔNG sinh/bổ sung bài retest (test cuối ca giữ nguyên);
--   • dạng đã dạy KHÔNG còn "chờ retest": case dạy hết dạng ⇒ "Chờ đánh giá" (màn Đánh giá ca chấm trước/sau bằng MỌI lần đo);
--   • app TA (retest đến hạn + badge) · app HS (bài kiểm tra lại) · Bổ trợ trong ngày · báo cáo trợ lý: không còn retest;
--   • lịch sử / popup ca vẫn hiện bài retest ĐÃ NỘP (dữ liệu thật đã có), ẩn bài chưa làm.
-- Dựng từ pg_get_functiondef bản ĐANG CHẠY (29/09), mỗi hàm chỉ thêm điều kiện công tắc.

create or replace function public._btyeu_retest_bat()
 returns boolean
 language sql
 stable
as $$ select false $$; -- HOLD 29/09 (Thùy). true = chạy lại luồng retest.
comment on function public._btyeu_retest_bat() is 'Công tắc luồng retest tầng 2 bổ trợ yếu. false = HOLD (Thùy 29/09). Lật cùng RETEST_BAT ở src/lib/botro_yeu.ts.';

-- _btyeu_bu_retest(uuid,text[]) — Không bổ sung câu retest khi đang hold.
CREATE OR REPLACE FUNCTION public._btyeu_bu_retest(p_buoi uuid, p_dangs text[])
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_lop uuid; v_ngay date; v_rt uuid; v_cautbl text; v_lttbl text; v_tru text[]; v_can text[]; v_moi integer; v_caus text[]; c text; d text; i integer;
begin
  if not public._btyeu_retest_bat() then return null; end if; -- HOLD retest 29/09
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or coalesce(array_length(p_dangs, 1), 0) = 0 then return null; end if;
  -- dạng đang CHỜ RETEST (đã dạy, dat null, chưa đóng) mà chưa có câu trong bài retest chưa nộp nào của case
  select coalesce(array_agg(x.ma_dang order by x.ma_dang), '{}') into v_can from bo_tro_yeu_dang x
   where x.bo_tro_yeu_id = b.bo_tro_yeu_id and x.ma_dang = any(p_dangs) and x.dong_at is null and x.day_at is not null and x.dat is null
     and not exists (select 1 from bai_test t join bai_test_cau k on k.bai_test_id = t.id
                     join buoi_hoc_hs hh on hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = b.bo_tro_yeu_id
                     where t.loai = 'retest' and t.hoc_sinh_id = b.hoc_sinh_id and k.ma_dang = x.ma_dang
                       and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop'));
  if array_length(v_can, 1) is null then return null; end if;
  v_cautbl := public._kho_cau_tbl(b.mon); v_lttbl := public._kho_lt_tbl(b.mon);
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  -- có bài retest CHƯA NỘP của buổi này ⇒ bổ sung vào; không thì sinh bài mới, ngày = buổi thường kế tiếp của lớp (≤28 ngày, như fn_btyeu_dong_ca)
  select t.id into v_rt from bai_test t where t.buoi_hoc_id = p_buoi and t.loai = 'retest'
    and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop') order by t.created_at desc limit 1;
  if v_rt is null then
    if v_lop is null then return null; end if;
    select g.d::date into v_ngay from generate_series(public._btyeu_today() + 1, public._btyeu_today() + 28, interval '1 day') g(d)
      where exists (select 1 from thoi_khoa_bieu t where t.lop_id = v_lop and t.thu = extract(isodow from g.d)::int + 1
                      and t.hieu_luc_tu <= g.d::date and (t.hieu_luc_den is null or t.hieu_luc_den >= g.d::date))
      order by g.d limit 1;
    if v_ngay is null then return null; end if;
    insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id)
      values (null, v_lop, b.hoc_sinh_id, v_ngay, 'retest', b.mon, 0, 'mo', p_buoi) returning id into v_rt;
  end if;
  select coalesce(array_agg(distinct k.ma_cau), '{}') into v_tru from bai_test t join bai_test_cau k on k.bai_test_id = t.id where t.buoi_hoc_id = p_buoi and k.ma_cau is not null;
  select coalesce(max(thu_tu), 0) into i from bai_test_cau where bai_test_id = v_rt;
  v_moi := greatest(1, least(3, 9 / array_length(v_can, 1))); -- 3 câu/dạng, tổng ~9; nhiều dạng thì ít câu/dạng nhưng dạng nào cũng có
  foreach d in array v_can loop
    v_caus := public._btyeu_chon_cau(v_cautbl, d, null, v_tru, v_moi); -- MCQ tuyệt đối (§4 spec-bo-tro); dạng 0 MCQ ⇒ không có câu (như cũ)
    foreach c in array coalesce(v_caus, '{}') loop
      i := i + 1; perform public._kho_snapshot_cau(v_rt, v_cautbl, v_lttbl, c, i, null); v_tru := v_tru || c;
    end loop;
  end loop;
  update bai_test set so_cau = (select count(*) from bai_test_cau where bai_test_id = v_rt) where id = v_rt;
  if (select so_cau from bai_test where id = v_rt) = 0 then delete from bai_test where id = v_rt; return null; end if; -- bài vừa đẻ mà rỗng
  return v_rt;
end $function$;

-- fn_btyeu_bu_retest_ton() — Không quét bù retest khi đang hold.
CREATE OR REPLACE FUNCTION public.fn_btyeu_bu_retest_ton()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; n integer := 0;
begin
  if not public._btyeu_retest_bat() then return 0; end if; -- HOLD retest 29/09
  if not public.la_thanh_vien() and current_user not in ('claude_build', 'postgres') then return 0; end if;
  for r in
    select d.day_buoi_id as buoi, array_agg(d.ma_dang) as dangs
    from bo_tro_yeu_dang d join bo_tro_yeu y on y.id = d.bo_tro_yeu_id
    where y.trang_thai = 'dang_xu' and d.dong_at is null and d.day_at is not null and d.dat is null and d.day_buoi_id is not null
      and not exists (select 1 from bai_test t join bai_test_cau k on k.bai_test_id = t.id
                      where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and k.ma_dang = d.ma_dang
                        and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop'))
    group by d.day_buoi_id
  loop
    if public._btyeu_bu_retest(r.buoi, r.dangs) is not null then n := n + 1; end if;
  end loop;
  return n;
end $function$;

-- fn_btyeu_dong_ca(uuid) — Đóng ca KHÔNG sinh bài retest khi đang hold (test cuối ca giữ nguyên).
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
  rc record; rd record;
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
    v_caus := public._btyeu_chon_cau(v_cautbl, rc.ma_dang, rc.ma_cum, v_tru, v_moi_cum);
    if coalesce(array_length(v_caus, 1), 0) < v_moi_cum then -- cụm cạn → câu cùng dạng khác cụm
      v_caus := v_caus || public._btyeu_chon_cau(v_cautbl, rc.ma_dang, null, v_tru || coalesce(v_caus, '{}'), v_moi_cum - coalesce(array_length(v_caus, 1), 0));
    end if;
    foreach c in array v_caus loop
      i := i + 1; perform public._kho_snapshot_cau(v_test, v_cautbl, v_lttbl, c, i, rc.ma_cum);
      v_tru := v_tru || c;
    end loop;
  end loop;
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
      v_caus := public._btyeu_chon_cau(v_cautbl, rd.ma_dang, null, v_tru, 3);
      foreach c in array v_caus loop
        i := i + 1; perform public._kho_snapshot_cau(v_retest, v_cautbl, v_lttbl, c, i, null);
        v_tru := v_tru || c;
      end loop;
    end loop;
    if i = 0 then delete from bai_test where id = v_retest; v_retest := null; v_retest_ngay := null;
    else update bai_test set so_cau = i where id = v_retest; end if;
  end if;

  return jsonb_build_object('bo_tro_test_id', v_test, 'retest_id', v_retest, 'retest_ngay', v_retest_ngay, 'khong_hoc', false, 'da_dong_truoc', false);
end $function$;

-- fn_btyeu_case_xep_lich(text) — Màn Xếp: hold ⇒ dạy hết dạng = chờ đánh giá (không qua Chờ retest); không trả ngày retest.
CREATE OR REPLACE FUNCTION public.fn_btyeu_case_xep_lich(p_mon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(x order by x_ht desc nulls first, x_uu desc, x_tao), '[]'::jsonb) end
  from (
    select y.uu_tien as x_uu, y.created_at as x_tao, y.hoan_thanh_at as x_ht, jsonb_build_object(
      'id', y.id, 'hoc_sinh_id', y.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon,
      'nguon', y.nguon, 'ly_do', y.ly_do, 'created_at', y.created_at, 'uu_tien', y.uu_tien, 'trang_thai', y.trang_thai,
      'hoan_thanh_at', y.hoan_thanh_at, 'ket_qua', y.ket_qua,
      'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
      'vong', 1 + (with recursive ch as (select y.case_truoc_id as id union all select p.case_truoc_id from bo_tro_yeu p join ch on p.id = ch.id where p.case_truoc_id is not null)
                   select count(*) from ch where id is not null),
      'so_dang', dc.tong, 'so_dang_can_day', dc.can_day, 'so_dang_cho_retest', dc.cho_retest, 'so_dang_xong', dc.xong, 'so_dang_may', dc.may, 'so_dang_bao_dong', dc.bao_dong,
      'so_dang_chua_day', dc.can_day,
      'giai_doan', case when y.trang_thai = 'hoan_thanh' then 'hoan_thanh' when dc.can_day > 0 then 'dang_bo_tro' when dc.cho_retest > 0 and public._btyeu_retest_bat() then 'cho_retest' else 'hoan_thanh' end,
      'so_buoi_da_hoc', bh.da_hoc, 'so_buoi_khong_dien_ra', bh.khong_dien_ra, 'khong_dien_ra_gan_nhat', bh.khong_dien_ra_gan_nhat,
      'buoi_cho_hoc', ch.j,
      'so_dang_moi_sau_xep', case when ch.xep_at is null then 0 else (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.created_at > ch.xep_at) end,
      'retest_ngay', (select min(t.ngay) filter (where public._btyeu_retest_bat()) from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon and t.trang_thai = 'mo'
                        and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop')
                        and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id))
    ) as x
    from bo_tro_yeu y
    join hoc_sinh hs on hs.id = y.hoc_sinh_id
    join lateral (
      select count(*) as tong,
             count(*) filter (where d.dong_at is null and (d.day_at is null or d.dat = false)) as can_day,
             count(*) filter (where d.dong_at is null and d.day_at is not null and d.dat is distinct from false) as cho_retest,
             count(*) filter (where d.dong_at is not null) as xong,
             count(*) filter (where d.nguon = 'may' and d.day_at is null) as may,
             count(*) filter (where d.nguon = 'bao_dong' and d.day_at is null) as bao_dong
      from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id
    ) dc on true
    join lateral (
      select count(*) filter (where b.trang_thai = 'hoan_tat' or b.danh_gia_xong_at is not null) as da_hoc,
             count(*) filter (where b.trang_thai = 'huy') as khong_dien_ra,
             max(b.ngay) filter (where b.trang_thai = 'huy') as khong_dien_ra_gan_nhat
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu'
    ) bh on true
    left join lateral (
      select b.created_at as xep_at, jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc,
               'phong', b.phong, 'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'diem_danh', hh.diem_danh,
               'qua_ngay', b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date) as j
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      order by b.ngay limit 1
    ) ch on true
    where (p_mon is null or y.mon = p_mon) and (y.trang_thai = 'hoan_thanh' or (dc.tong > 0 and exists (select 1 from hs_level lv where lv.hoc_sinh_id = y.hoc_sinh_id and lv.mon = y.mon and lv.loai = 'kien_thuc' and lv.level >= 1))) -- Thùy 28/09: màn Xếp hiện L1/L2/L3, ẩn L0
  ) s
$function$;

-- fn_btyeu_trang_thai_ca(integer) — Trạng thái ca: hold ⇒ bỏ mức Chờ retest (dạy hết ⇒ Chờ đánh giá); thêm case_truoc_id cho màn Đánh giá ca.
CREATE OR REPLACE FUNCTION public.fn_btyeu_trang_thai_ca(p_so_ngay_ht integer DEFAULT 60)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(s.x order by s.thu, s.uu desc, s.tao), '[]'::jsonb) end
  from (
    select array_position(array['cho_noi_dung','can_xep','da_xep','cho_retest','cho_danh_gia','hoan_thanh'], m.buoc) as thu, y.uu_tien as uu, y.created_at as tao,
      jsonb_build_object(
        'id', y.id, 'hoc_sinh_id', y.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon,
        'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1),
        'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
        'uu_tien', y.uu_tien, 'created_at', y.created_at, 'case_truoc_id', y.case_truoc_id, 'hoan_thanh_at', y.hoan_thanh_at, 'ket_qua', y.ket_qua,
        'so_dang', dc.tong, 'so_dang_can_day', dc.can_day, 'so_dang_cho_retest', dc.cho_retest, 'so_dang_xong', dc.xong,
        'buoi_cho_ngay', ch.ngay, 'buoi_cho_gio', ch.gio_bat_dau, 'buoi_cho_nguoi', ch.nguoi,
        'retest_ngay', (select min(t.ngay) filter (where public._btyeu_retest_bat()) from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon and t.trang_thai = 'mo'
                          and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop')
                          and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id)),
        'buoc', m.buoc) as x
    from bo_tro_yeu y
    join hoc_sinh hs on hs.id = y.hoc_sinh_id
    cross join lateral (
      select count(*) as tong,
             count(*) filter (where d.dong_at is null and (d.day_at is null or d.dat = false)) as can_day,
             count(*) filter (where d.dong_at is null and d.day_at is not null and d.dat is distinct from false) as cho_retest,
             count(*) filter (where d.dong_at is not null) as xong
      from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id
    ) dc
    left join lateral (
      select b.ngay, b.gio_bat_dau, ns.ho_ten as nguoi from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      order by b.ngay limit 1
    ) ch on true
    cross join lateral (select case
        when y.trang_thai = 'hoan_thanh' then 'hoan_thanh'
        when dc.tong = 0 then 'cho_noi_dung'
        when dc.can_day > 0 and ch.ngay is null then 'can_xep'
        when dc.can_day > 0 then 'da_xep'
        when dc.cho_retest > 0 and public._btyeu_retest_bat() then 'cho_retest'
        else 'cho_danh_gia' end as buoc) m
    where y.trang_thai = 'dang_xu' or y.hoan_thanh_at >= now() - make_interval(days => greatest(1, coalesce(p_so_ngay_ht, 60)))
  ) s
$function$;

-- fn_btyeu_chi_tiet_case(uuid) — Popup ca: hold ⇒ dạng đã dạy = "da_day" (không "chờ retest"); chỉ hiện bài retest ĐÃ NỘP.
CREATE OR REPLACE FUNCTION public.fn_btyeu_chi_tiet_case(p_case uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select case when not public.la_thanh_vien() then null else jsonb_build_object(
    'case', jsonb_build_object('id', y.id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon, 'nguon', y.nguon, 'ly_do', y.ly_do,
              'trang_thai', y.trang_thai, 'uu_tien', y.uu_tien, 'created_at', y.created_at, 'hoan_thanh_at', y.hoan_thanh_at, 'ket_qua', y.ket_qua, 'ghi_chu_dong', y.ghi_chu_dong,
              'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1),
              'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
              'vong', 1 + (with recursive ch as (select y.case_truoc_id as id union all select p.case_truoc_id from bo_tro_yeu p join ch on p.id = ch.id where p.case_truoc_id is not null)
                           select count(*) from ch where id is not null),
              'mo_boi', (select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = y.actor)),
    'dang', (select coalesce(jsonb_agg(jsonb_build_object(
               'ma_dang', d.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(y.mon, d.ma_dang), d.ma_dang), 'nguon', d.nguon, 'them_at', d.created_at,
               'diem_luc_mo', d.diem_luc_mo, 'so_lan_do_luc_mo', d.so_lan_do_luc_mo, 'day_at', d.day_at, 'retest_diem', d.retest_diem, 'retest_at', d.retest_at,
               'dat', d.dat, 'dong_at', d.dong_at,
               'tt', case when d.dong_at is not null then 'xong' when d.day_at is null then 'chua_day' when d.dat = false then 'day_lai' when public._btyeu_retest_bat() then 'cho_retest' else 'da_day' end
             ) order by d.dong_at nulls first, d.day_at nulls first, d.created_at), '[]'::jsonb) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id),
    'buoi', (select coalesce(jsonb_agg(jsonb_build_object(
               'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong, 'nguoi', ns.ho_ten,
               'trang_thai', b.trang_thai, 'ly_do_huy', b.ly_do_huy, 'diem_danh', hh.diem_danh, 'danh_gia_xong_at', b.danh_gia_xong_at, 'che_do', hh.btyeu_che_do,
               'ca_truc', b.ca_bo_tro_id is not null
             ) order by b.ngay desc, b.gio_bat_dau desc nulls last), '[]'::jsonb)
             from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
             where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu'),
    'retest', (select coalesce(jsonb_agg(jsonb_build_object(
               'ngay', t.ngay, 'so_cau', t.so_cau,
               'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop'),
               'so_dung', (select count(*) from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = t.id and blc.verdict = 'correct')
             ) order by t.ngay desc), '[]'::jsonb)
             from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon
               and (public._btyeu_retest_bat() or exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop'))
               and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id)),
    'duyet', (select coalesce(jsonb_agg(jsonb_build_object(
               'at', g.created_at, 'level_cu', g.level_cu, 'level_may', g.level_may_de_xuat, 'level_chot', g.level_chot,
               'ly_do_may', g.ly_do_may -> 'lyDo', 'kenh', g.ly_do_may -> 'kenh', 'ly_do_nguoi', g.ly_do_nguoi,
               'nguoi', (select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = g.actor)
             ) order by g.created_at desc), '[]'::jsonb)
             from hs_level_log g where g.hoc_sinh_id = y.hoc_sinh_id and g.mon = y.mon and g.loai = 'kien_thuc'
               and g.created_at >= y.created_at - interval '1 day' and (y.hoan_thanh_at is null or g.created_at <= y.hoan_thanh_at + interval '1 day'))
  ) end
  from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id
  where y.id = p_case
$function$;

-- fn_btyeu_lich_su_hs(uuid,text,integer) — Lịch sử HS: hold ⇒ chỉ hiện bài retest ĐÃ NỘP.
CREATE OR REPLACE FUNCTION public.fn_btyeu_lich_su_hs(p_hoc_sinh uuid, p_mon text, p_so_ngay integer DEFAULT 14)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with tu as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date - greatest(1, coalesce(p_so_ngay, 14)) as d),
  bd as (select public._kho_ban_do_tbl(p_mon) as t),
  ev as (
    -- buổi bổ trợ (yếu / bù / đuổi)
    select b.ngay::timestamptz + coalesce(b.gio_bat_dau, '00:00'::time) as t, 'buoi' as loai, jsonb_build_object(
      'loai_buoi', b.loai, 'buoi_id', b.id, 'ngay', b.ngay, 'gio', b.gio_bat_dau, 'phong', b.phong, 'trang_thai', b.trang_thai, 'ly_do_huy', b.ly_do_huy,
      'diem_danh', hh.diem_danh, 'nguoi', coalesce(ns.ho_ten, ns2.ho_ten),
      'dang_day', (select coalesce(jsonb_agg(d.ma_dang), '[]'::jsonb) from bo_tro_yeu_dang d where d.day_buoi_id = b.id),
      'luyen', (select jsonb_build_object('so_cau', sum(so_cau), 'so_dung', sum(so_dung)) from public._btyeu_tien_do(b.id)),
      'test', (select jsonb_build_object('so_cau', count(*), 'so_dung', count(*) filter (where blc.verdict = 'correct'), 'da_nop', bool_or(bl.trang_thai = 'da_nop'))
               from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id join bai_lam_cau blc on blc.bai_lam_id = bl.id
               where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test'),
      'nhan_xet', (select dg.nhan_xet from buoi_danh_gia dg where dg.buoi_hoc_id = b.id and dg.hoc_sinh_id = p_hoc_sinh limit 1),
      'che_do', hh.btyeu_che_do
    ) as d
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
    left join nhan_su ns on ns.id = b.nguoi_day_tg left join nhan_su ns2 on ns2.id = b.nguoi_day, tu
    where hh.hoc_sinh_id = p_hoc_sinh and b.loai in ('bo_tro_yeu', 'bu', 'bo_tro_duoi') and b.ngay >= tu.d
      and (b.loai <> 'bo_tro_yeu' or exists (select 1 from bo_tro_yeu y where y.id = hh.bo_tro_yeu_id and y.mon = p_mon))
    union all
    -- retest tầng 2 (bài) + kết quả từng dạng
    select bt.ngay::timestamptz + interval '23 hours', 'retest', jsonb_build_object(
      'bai_test_id', bt.id, 'ngay', bt.ngay, 'so_cau', bt.so_cau, 'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'),
      'so_dung', (select count(*) from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = bt.id and blc.verdict = 'correct'),
      'dang', (select coalesce(jsonb_agg(distinct jsonb_build_object('ma_dang', k.ma_dang, 'dat', d.dat, 'diem', d.retest_diem)), '[]'::jsonb)
               from bai_test_cau k left join buoi_hoc_hs hh on hh.buoi_hoc_id = bt.buoi_hoc_id and hh.bo_tro_yeu_id is not null
               left join bo_tro_yeu_dang d on d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.ma_dang = k.ma_dang where k.bai_test_id = bt.id)
    ) from bai_test bt, tu where bt.hoc_sinh_id = p_hoc_sinh and bt.mon = p_mon and bt.loai = 'retest' and bt.ngay >= tu.d
      and (public._btyeu_retest_bat() or exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'))
    union all
    -- lượt duyệt level
    select l.created_at, 'duyet', jsonb_build_object('loai', l.loai, 'level_cu', l.level_cu, 'level_chot', l.level_chot, 'level_may', l.level_may_de_xuat, 'ly_do', l.ly_do_nguoi, 'actor', l.actor)
    from hs_level_log l, tu where l.hoc_sinh_id = p_hoc_sinh and l.mon = p_mon and l.created_at >= tu.d
    union all
    -- báo động
    select k.created_at, 'bao_dong', jsonb_build_object('ma_dang', k.ma_dang, 'nguon', k.nguon, 'ghi_chu', k.ghi_chu)
    from canh_bao_yeu k, tu where k.hoc_sinh_id = p_hoc_sinh and k.created_at >= tu.d
      and public._btyeu_mon_cua_bao_dong(k.hoc_sinh_id, k.buoi_hoc_id) is not distinct from p_mon
    union all
    -- case mở / đóng
    select y.created_at, 'case_mo', jsonb_build_object('case_id', y.id, 'nguon', y.nguon, 'uu_tien', y.uu_tien, 'so_dang', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id))
    from bo_tro_yeu y, tu where y.hoc_sinh_id = p_hoc_sinh and y.mon = p_mon and y.created_at >= tu.d
    union all
    select y.hoan_thanh_at, 'case_dong', jsonb_build_object('case_id', y.id, 'ket_qua', y.ket_qua, 'ghi_chu', y.ghi_chu_dong)
    from bo_tro_yeu y, tu where y.hoc_sinh_id = p_hoc_sinh and y.mon = p_mon and y.hoan_thanh_at >= tu.d
  )
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce((
    select jsonb_agg(jsonb_build_object('t', ev.t, 'loai', ev.loai, 'd', ev.d) order by ev.t desc) from ev), '[]'::jsonb) end
$function$;

-- fn_btyeu_viec_cua_toi() — App TA: hold ⇒ không có "retest đến hạn".
CREATE OR REPLACE FUNCTION public.fn_btyeu_viec_cua_toi()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_today date := public._btyeu_today(); v_ca jsonb; v_rt jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  v_admin := coalesce(v_admin, false);

  select coalesce(jsonb_agg(x order by x.ngay, x.gio_bat_dau nulls last), '[]'::jsonb) into v_ca from (
    select b.id as buoi_id, b.ngay, b.gio_bat_dau, b.gio_ket_thuc, b.phong,
           h.id as hoc_sinh_id, h.ho_ten, h.ma_hs, h.khoi, y.mon,
           (select level from hs_level where hoc_sinh_id = h.id and mon = y.mon and loai = 'kien_thuc') as level,
           hh.diem_danh,
           (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id) as so_dang,
           exists (select 1 from bai_test bt where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test') as co_test,
           exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id
                   where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop') as test_da_nop,
           b.danh_gia_xong_at
    from buoi_hoc b
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
    join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
    join hoc_sinh h on h.id = hh.hoc_sinh_id
    where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo'
      and (v_admin or b.nguoi_day_tg = v_ns)
      and b.ngay <= v_today + 7
      and (b.danh_gia_xong_at is null or b.ngay = v_today)   -- nợ cũ + hôm nay (kể cả đã xong để xem lại) + sắp tới
  ) x;

  select coalesce(jsonb_agg(x order by x.ngay, x.ho_ten), '[]'::jsonb) into v_rt from (
    select bt.id as bai_test_id, bt.ngay, bt.mon, bt.so_cau, bt.lop_id, l.ten_lop,
           h.id as hoc_sinh_id, h.ho_ten, h.ma_hs,
           coalesce(bl.trang_thai = 'da_nop', false) as da_nop,
           (select ngay from buoi_hoc where id = bt.buoi_hoc_id) as buoi_bo_tro_ngay
    from bai_test bt
    join lop l on l.id = bt.lop_id
    join hoc_sinh h on h.id = bt.hoc_sinh_id
    left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = bt.hoc_sinh_id
    where bt.loai = 'retest' and bt.trang_thai = 'mo' and bt.ngay <= v_today and public._btyeu_retest_bat()
      and (bl.trang_thai is distinct from 'da_nop')
      and (v_admin or exists (select 1 from phan_cong_lop pc where pc.lop_id = bt.lop_id and pc.nhan_su_id = v_ns and pc.vai_tro = 'tg'))
  ) x;

  return jsonb_build_object('ca', v_ca, 'retest', v_rt);
end $function$;

-- fn_btyeu_dem(uuid) — Badge TA: hold ⇒ không đếm retest.
CREATE OR REPLACE FUNCTION public.fn_btyeu_dem(p_ns uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with adm as (select coalesce((select la_admin_he_thong from nhan_su where id = p_ns), false) as v),
  today as (select public._btyeu_today() as d),
  ca as (
    select count(*) as n
    from buoi_hoc b
    join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
    join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
    join hoc_sinh h on h.id = hh.hoc_sinh_id
    cross join adm cross join today
    where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo'
      and (adm.v or b.nguoi_day_tg = p_ns)
      and b.ngay <= today.d + 7
      and (b.danh_gia_xong_at is null or b.ngay = today.d)
  ),
  rt as (
    select count(*) as n
    from bai_test bt
    join lop l on l.id = bt.lop_id
    join hoc_sinh h on h.id = bt.hoc_sinh_id
    left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = bt.hoc_sinh_id
    cross join adm cross join today
    where bt.loai = 'retest' and bt.trang_thai = 'mo' and bt.ngay <= today.d and public._btyeu_retest_bat()
      and (bl.trang_thai is distinct from 'da_nop')
      and (adm.v or exists (select 1 from phan_cong_lop pc where pc.lop_id = bt.lop_id and pc.nhan_su_id = p_ns and pc.vai_tro = 'tg'))
  )
  select (select n from ca) + (select n from rt)
$function$;

-- fn_btyeu_retest_cua_toi() — App HS: hold ⇒ không có bài kiểm tra lại.
CREATE OR REPLACE FUNCTION public.fn_btyeu_retest_cua_toi()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'bai_test_id', bt.id, 'ngay', bt.ngay, 'mon', bt.mon, 'so_cau', bt.so_cau, 'lop_id', bt.lop_id,
    'da_nop', coalesce(bl.trang_thai = 'da_nop', false), 'nop_at', bl.nop_at,
    'buoi_bo_tro_ngay', (select ngay from buoi_hoc where id = bt.buoi_hoc_id)
  ) order by bt.ngay), '[]'::jsonb)
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = bt.hoc_sinh_id
  where bt.hoc_sinh_id = public.my_hoc_sinh_id() and bt.loai = 'retest' and bt.trang_thai = 'mo' and public._btyeu_retest_bat()
    and bt.ngay <= public._btyeu_today()
    and (bl.trang_thai is distinct from 'da_nop' or bl.nop_at >= (public._btyeu_today())::timestamp at time zone 'Asia/Ho_Chi_Minh')
$function$;

-- fn_bo_tro_trong_ngay(date) — Bổ trợ trong ngày: hold ⇒ không có retest.
CREATE OR REPLACE FUNCTION public.fn_bo_tro_trong_ngay(p_ngay date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with d as (select coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date) as ngay)
  select case when not public.la_thanh_vien() then '{}'::jsonb else jsonb_build_object(
    'bu', coalesce((select jsonb_agg(jsonb_build_object('buoi_id', b.id, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong, 'trang_thai', b.trang_thai,
              'nguoi', coalesce(ns.ho_ten, ns2.ho_ten), 'so_hs', (select count(*) from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id),
              'hs', (select coalesce(jsonb_agg(jsonb_build_object('ho_ten', hs.ho_ten, 'khoi', hs.khoi, 'diem_danh', hh.diem_danh, 'lop_goc', l.ten_lop) order by hs.ho_ten), '[]'::jsonb)
                     from buoi_hoc_hs hh join hoc_sinh hs on hs.id = hh.hoc_sinh_id left join buoi_hoc g on g.id = hh.bu_cho_buoi_id left join lop l on l.id = g.lop_id where hh.buoi_hoc_id = b.id)
            ) order by b.gio_bat_dau nulls last)
            from buoi_hoc b left join nhan_su ns on ns.id = b.nguoi_day_tg left join nhan_su ns2 on ns2.id = b.nguoi_day, d
            where b.loai = 'bu' and b.ngay = d.ngay and b.trang_thai <> 'huy'), '[]'::jsonb),
    'duoi', coalesce((select jsonb_agg(jsonb_build_object('buoi_id', b.id, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong, 'trang_thai', b.trang_thai,
              'nguoi', coalesce(ns.ho_ten, ns2.ho_ten), 'so_hs', (select count(*) from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id),
              'hs', (select coalesce(jsonb_agg(jsonb_build_object('ho_ten', hs.ho_ten, 'khoi', hs.khoi, 'diem_danh', hh.diem_danh, 'lop', l.ten_lop) order by hs.ho_ten), '[]'::jsonb)
                     from buoi_hoc_hs hh join hoc_sinh hs on hs.id = hh.hoc_sinh_id left join bo_tro_duoi bd on bd.id = hh.bo_tro_duoi_id left join lop l on l.id = bd.lop_id where hh.buoi_hoc_id = b.id)
            ) order by b.gio_bat_dau nulls last)
            from buoi_hoc b left join nhan_su ns on ns.id = b.nguoi_day_tg left join nhan_su ns2 on ns2.id = b.nguoi_day, d
            where b.loai = 'bo_tro_duoi' and b.ngay = d.ngay and b.trang_thai <> 'huy'), '[]'::jsonb),
    'retest', coalesce((select jsonb_agg(jsonb_build_object('bai_test_id', bt.id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', bt.mon, 'lop', l.ten_lop, 'so_cau', bt.so_cau,
              'ta_lop', (select ns.ho_ten from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id where pc.lop_id = bt.lop_id and pc.vai_tro = 'tg' order by pc.la_chinh desc nulls last limit 1),
              'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'),
              'so_dung', (select count(*) from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = bt.id and blc.verdict = 'correct'),
              'qua_han', bt.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date
            ) order by l.ten_lop, hs.ho_ten)
            from bai_test bt join hoc_sinh hs on hs.id = bt.hoc_sinh_id left join lop l on l.id = bt.lop_id, d
            where bt.loai = 'retest' and bt.ngay = d.ngay and bt.trang_thai = 'mo' and public._btyeu_retest_bat()), '[]'::jsonb)
  ) end
$function$;

-- _troly_bc_viec_yeu(date,date) — Báo cáo trợ lý: hold ⇒ không báo "retest chưa làm — trễ".
CREATE OR REPLACE FUNCTION public._troly_bc_viec_yeu(p_tu date, p_den date)
 RETURNS TABLE(muc text, loai text, ngay date, doi_tuong text, viec text, phu_trach text, han timestamp with time zone, xong_luc timestamp with time zone, tinh_trang text)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
declare v_nay date := public._troly_hom_nay();
begin
  perform public._troly_gac();
  return query
  select 'bo_tro_yeu'::text,
         -- học sinh không đến KHÔNG phải miss của nhân sự — loại riêng, đếm riêng (CEO 29/09)
         case c.ket_qua when 'khong_hop_le_khong_test' then 'miss' when 'huy_hs_khong_den' then 'hs_khong_den' else 'cham' end,
         c.ngay, c.ho_ten || coalesce(' · ' || c.ten_lop, ''),
         'Ca bổ trợ yếu ' || coalesce(to_char(c.gio, 'HH24:MI'), ''),
         coalesce(c.nguoi_day || ' (TA đứng ca)', 'chưa gán người đứng ca'),
         (c.ngay::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh', null::timestamptz,
         case c.ket_qua
           when 'khong_hop_le_khong_test' then 'Ca đã hoàn tất nhưng em KHÔNG làm test cuối ca — ca không hợp lệ'
           when 'huy_hs_khong_den' then 'Ca bị huỷ — học sinh không đến' || coalesce(' (' || left(c.ly_do_huy, 80) || ')', '')
           when 'co_mat_chua_dong_ca' then format('Em có mặt nhưng TA chưa đóng ca — đã %s ngày', v_nay - c.ngay)
           else format('Ca quá ngày không diễn ra mà chưa huỷ/xếp lại — đã %s ngày', v_nay - c.ngay) end
  from public._troly_bc_ca_yeu(p_tu, p_den) c
  where c.ket_qua in ('khong_hop_le_khong_test', 'huy_hs_khong_den')
     or (c.ket_qua in ('co_mat_chua_dong_ca', 'vang_chua_huy', 'qua_ngay_khong_dien_ra') and c.ngay < v_nay)
  union all
  select 'bo_tro_yeu', 'cham', x.ngay, hs.ho_ten || coalesce(' · ' || l.ten_lop, ''), 'Retest sau bổ trợ',
         coalesce((select ns.ho_ten || ' (TA lớp)' from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
                    where pc.lop_id = x.lop_id and pc.vai_tro = 'tg' order by pc.la_chinh desc nulls last limit 1),
                  'lớp chưa có TA'),
         (x.ngay::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh', null::timestamptz,
         format('Retest hẹn %s chưa làm — trễ %s ngày', to_char(x.ngay, 'DD/MM'), v_nay - x.ngay)
  from bai_test x join hoc_sinh hs on hs.id = x.hoc_sinh_id left join lop l on l.id = x.lop_id
  where x.loai = 'retest' and x.trang_thai = 'mo' and x.ngay between p_tu and p_den and x.ngay < v_nay and public._btyeu_retest_bat()
    and not exists (select 1 from bai_lam bl where bl.bai_test_id = x.id and bl.trang_thai = 'da_nop');
end $function$;

-- _troly_bc_thong_so(date,date) — Thông số trợ lý: hold ⇒ dòng Retest ghi "tạm dừng".
CREATE OR REPLACE FUNCTION public._troly_bc_thong_so(p_tu date, p_den date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare v jsonb; v_nay date := public._troly_hom_nay();
begin
  perform public._troly_gac();
  with ca as (select * from public._troly_bc_ca_yeu(p_tu, p_den)),
  rt as (
    select x.id, exists (select 1 from bai_lam bl where bl.bai_test_id = x.id and bl.trang_thai = 'da_nop') as da_nop
    from bai_test x where x.loai = 'retest' and x.ngay between p_tu and p_den
  ),
  lg as (
    select l.level_may_de_xuat, l.level_chot from hs_level_log l
    where l.loai = 'kien_thuc' and (l.created_at at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den
  ),
  cs as (
    select y.id, y.created_at, f.xep_at
    from bo_tro_yeu y left join lateral (
      select min(hh.created_at) as xep_at from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu') f on true
    where (y.created_at at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den
  ),
  vang as (
    select
      case when kb.id is not null then 'khong_bu'
           when exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                         where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id
                           and bb.trang_thai = 'hoan_tat' and x.diem_danh = 'co_mat') then 'da_hoc_bu'
           when exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                         where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id and bb.trang_thai = 'mo') then 'da_xep_chua_hoc'
           when exists (select 1 from buoi_hoc_hs x where x.bu_cho_buoi_id = b.id and x.hoc_sinh_id = h.hoc_sinh_id) then 'truot'
           else 'chua_xep' end as tt
    from buoi_hoc_hs h
    join buoi_hoc b on b.id = h.buoi_hoc_id and b.loai = 'thuong' and b.trang_thai <> 'huy'
    join hoc_sinh hs on hs.id = h.hoc_sinh_id and hs.trang_thai = 'dang_hoc'
    left join bang_khong_bu kb on kb.buoi_hoc_hs_id = h.id
    where h.diem_danh in ('vang', 'vang_phep') and b.ngay between p_tu and p_den
  ),
  bu as (
    select h.diem_danh from buoi_hoc b join buoi_hoc_hs h on h.buoi_hoc_id = b.id
    where b.loai = 'bu' and b.trang_thai <> 'huy' and b.ngay between p_tu and p_den and b.ngay <= v_nay
  )
  select jsonb_build_object(
    'bo_tro_yeu', jsonb_build_array(
      jsonb_build_object('nhan', 'Lượt đã xếp', 'gia_tri', (select count(*) from ca)),
      jsonb_build_object('nhan', 'Đã chạy', 'gia_tri', (select count(*) from ca where ket_qua in ('hop_le', 'khong_hop_le_khong_test', 'co_mat_chua_dong_ca'))),
      jsonb_build_object('nhan', 'Hợp lệ (có test cuối ca)', 'gia_tri', (select count(*) from ca where ket_qua = 'hop_le')),
      jsonb_build_object('nhan', 'Học sinh không đến', 'gia_tri', (select count(*) from ca where ket_qua = 'huy_hs_khong_den')),
      jsonb_build_object('nhan', 'Huỷ lý do khác', 'gia_tri', (select count(*) from ca where ket_qua = 'huy_khac')),
      jsonb_build_object('nhan', 'Sắp tới, chờ học', 'gia_tri', (select count(*) from ca where ket_qua = 'cho_hoc')),
      jsonb_build_object('nhan', 'Retest đã nộp', 'gia_tri', case when public._btyeu_retest_bat()
        then (select count(*) filter (where da_nop) || '/' || count(*) from rt) else 'tạm dừng (hold 29/09)' end),
      jsonb_build_object('nhan', 'Duyệt: chốt bổ trợ', 'gia_tri',
        (select count(*) filter (where level_chot >= 1) || '/' || count(*) || ' lượt duyệt (máy đề xuất '
                || count(*) filter (where level_may_de_xuat >= 1) || ')' from lg)),
      jsonb_build_object('nhan', 'Case mới mở · đã xếp buổi', 'gia_tri',
        (select count(xep_at) || '/' || count(*) from cs)),
      jsonb_build_object('nhan', 'Độ trễ xếp lịch trung bình', 'gia_tri',
        (select coalesce(round(avg(extract(epoch from (xep_at - created_at)) / 86400.0)::numeric, 1) || ' ngày', 'chưa có case nào được xếp') from cs))),
    'bo_tro_bu', jsonb_build_array(
      jsonb_build_object('nhan', 'Lượt vắng', 'gia_tri', (select count(*) from vang)),
      jsonb_build_object('nhan', 'Đã học bù', 'gia_tri', (select count(*) from vang where tt = 'da_hoc_bu')),
      jsonb_build_object('nhan', 'Đã xếp, chờ học', 'gia_tri', (select count(*) from vang where tt = 'da_xep_chua_hoc')),
      jsonb_build_object('nhan', 'Ghi không bù', 'gia_tri', (select count(*) from vang where tt = 'khong_bu')),
      jsonb_build_object('nhan', 'Chưa xếp', 'gia_tri', (select count(*) from vang where tt = 'chua_xep')),
      jsonb_build_object('nhan', 'Buổi bù: có mặt', 'gia_tri',
        (select count(*) filter (where diem_danh = 'co_mat') || '/' || count(*) || ' lượt' from bu)),
      jsonb_build_object('nhan', 'Buổi bù: học sinh không đến', 'gia_tri',
        (select count(*) filter (where diem_danh in ('vang', 'vang_phep')) from bu)))
  ) into v;
  return v;
end $function$;
