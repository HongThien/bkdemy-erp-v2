-- 29/09 (Thùy chốt phương án (a)): BẬT BỔ TRỢ YẾU cho nhánh Hình — Hình học (Bài) + Hình giải tích.
-- Trước: mọi hàm fn_btyeu_* chọn bảng câu/bản đồ/cụm theo MÔN (_kho_*_tbl(b.mon)) ⇒ 1 bảng gốc cho cả case ⇒ dạng
-- Hình (HH…/hgt) không có tên, không đổ vào case (dạng yếu 2 cửa sổ, đề xuất dạng mới), không sinh được câu.
-- Nay: bảng theo NHÁNH CỦA TỪNG DẠNG — _kho_nhanh_cua_dang(mon, ma_dang) (đúng mẫu fn_duoi_* đang chạy; mig 202609291136
-- đã dạy hàm này nhận Bài Hình học). Đại/KHTN: nhánh null ⇒ bảng gốc như cũ (kiểm tương đương ca_ta trên ca thật khi chạy thử).
-- Luật MCQ tuyệt đối GIỮ NGUYÊN (_btyeu_chon_cau không đổi): Hình học cấp 2 hiện 0 câu MCQ ⇒ dạng đó app/phiếu báo
-- "chưa có câu TRẮC NGHIỆM — học với thầy cô trên giấy" (Thùy 29/09: chấp nhận, TA dạy giấy).
-- Hàm dựng TỪ BẢN ĐANG CHẠY (pg_get_functiondef 29/09) — chỉ vá dòng dispatch / vòng lặp theo dạng.

-- ① Hình học có cụm (hinh_hoc_cum_bai) nhưng CHƯA có bảng tiền đề cụm; màn ca HS dựng tên bằng
--    replace(cum_bai → cum_tien_de) ⇒ thiếu bảng là "relation does not exist". Tạo đúng SHAPE dai_/hgt_cum_tien_de (rỗng).
create table if not exists public.hinh_hoc_cum_tien_de (
  ma_cum text not null references public.hinh_hoc_cum_bai(ma_cum) on delete cascade,
  tien_de_ma_cum text not null references public.hinh_hoc_cum_bai(ma_cum) on delete cascade,
  primary key (ma_cum, tien_de_ma_cum),
  check (ma_cum <> tien_de_ma_cum)
);
alter table public.hinh_hoc_cum_tien_de enable row level security;
drop policy if exists hinh_hoc_cum_tien_de_member_all on public.hinh_hoc_cum_tien_de;
create policy hinh_hoc_cum_tien_de_member_all on public.hinh_hoc_cum_tien_de for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on public.hinh_hoc_cum_tien_de to authenticated;

-- ② _btyeu_bu_retest: bảng câu/lý thuyết theo nhánh từng dạng.
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
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d)); -- 29/09 nhánh theo dạng
    v_caus := public._btyeu_chon_cau(v_cautbl, d, null, v_tru, v_moi); -- MCQ tuyệt đối (§4 spec-bo-tro); dạng 0 MCQ ⇒ không có câu (như cũ)
    foreach c in array coalesce(v_caus, '{}') loop
      i := i + 1; perform public._kho_snapshot_cau(v_rt, v_cautbl, v_lttbl, c, i, null); v_tru := v_tru || c;
    end loop;
  end loop;
  update bai_test set so_cau = (select count(*) from bai_test_cau where bai_test_id = v_rt) where id = v_rt;
  if (select so_cau from bai_test where id = v_rt) = 0 then delete from bai_test where id = v_rt; return null; end if; -- bài vừa đẻ mà rỗng
  return v_rt;
end $function$
;

-- ② fn_btyeu_dong_ca: test cuối ca + retest — bảng theo nhánh từng dạng.
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
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, rc.ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, rc.ma_dang)); -- 29/09 nhánh theo dạng
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

  return jsonb_build_object('bo_tro_test_id', v_test, 'retest_id', v_retest, 'retest_ngay', v_retest_ngay, 'khong_hoc', false, 'da_dong_truoc', false);
end $function$
;

-- ② fn_btyeu_in_sinh (phiếu giấy): bảng theo nhánh từng dạng.
CREATE OR REPLACE FUNCTION public.fn_btyeu_in_sinh(p_buoi uuid, p_so_cau integer DEFAULT 5)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_lop uuid; v_cautbl text; v_lttbl text; v_tru text[]; v_caus text[]; v_bt uuid; i integer := 0; c text; d record;
  v_thieu text[] := '{}'; v_n integer := greatest(1, least(coalesce(p_so_cau, 5), 10));
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
  for d in select ma_dang from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and dong_at is null order by diem_luc_mo nulls last, created_at loop
    v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d.ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, d.ma_dang)); -- 29/09 nhánh theo dạng
    v_caus := public._btyeu_chon_cau(v_cautbl, d.ma_dang, null, v_tru, v_n);
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_thieu := v_thieu || d.ma_dang; continue; end if;
    foreach c in array v_caus loop
      i := i + 1;
      perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null);
    end loop;
    v_tru := v_tru || v_caus;
  end loop;
  if i = 0 then
    -- Không có câu nào ⇒ raise làm ROLLBACK cả transaction, dòng bai_test vừa tạo tự biến mất (không để lại bài rỗng).
    raise exception 'Các dạng của ca này chưa có câu TRẮC NGHIỆM trong kho — chưa in được (bổ trợ chỉ dùng trắc nghiệm).';
  end if;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i, 'dang_khong_co_cau', to_jsonb(v_thieu));
end $function$
;

-- ② fn_btyeu_luyen_sinh (bài luyện app HS, 1 dạng): bảng theo nhánh của dạng.
CREATE OR REPLACE FUNCTION public.fn_btyeu_luyen_sinh(p_buoi uuid, p_ma_dang text, p_ma_cum text DEFAULT NULL::text, p_so_cau integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  b record; v_lop uuid; v_cautbl text; v_lttbl text;
  v_tru text[]; v_caus text[]; v_bt uuid; i integer := 0; c text;
begin
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or b.hoc_sinh_id <> v_hs then raise exception 'Không phải ca bổ trợ của em.'; end if;
  if b.trang_thai <> 'mo' or b.ngay <> public._btyeu_today() then raise exception 'Ca này không mở hôm nay.'; end if;
  if b.diem_danh is distinct from 'co_mat' then raise exception 'Chưa điểm danh có mặt.'; end if;
  if exists (select 1 from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test') then raise exception 'Ca đã đóng — làm bài kiểm tra cuối buổi nhé.'; end if;
  if not exists (select 1 from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and ma_dang = p_ma_dang) then raise exception 'Dạng không thuộc ca bổ trợ này.'; end if;

  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', b.mon; end if;

  v_cautbl := public._kho_cau_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, p_ma_dang)); v_lttbl := public._kho_lt_tbl(b.mon, public._kho_nhanh_cua_dang(b.mon, p_ma_dang)); -- 29/09 nhánh theo dạng
  -- Câu đã gặp trong CA (mọi bài của buổi) — né trước, cạn thì lặp (trong _btyeu_chon_cau).
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;
  v_caus := public._btyeu_chon_cau(v_cautbl, p_ma_dang, p_ma_cum, v_tru, greatest(1, least(coalesce(p_so_cau, 3), 10)));
  if coalesce(array_length(v_caus, 1), 0) = 0 then raise exception 'Dạng này chưa có câu TRẮC NGHIỆM trong kho — em học dạng này với thầy cô trên giấy nhé (bổ trợ trên app chỉ dùng trắc nghiệm).'; end if;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id)
    values (null, v_lop, v_hs, public._btyeu_today(), 'bo_tro', b.mon, 0, 'mo', p_buoi) returning id into v_bt;
  foreach c in array v_caus loop
    i := i + 1;
    perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, p_ma_cum);
  end loop;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i);
end $function$
;

-- ③ fn_btyeu_in_lay: tên dạng câu Hình (bảng gốc không có) qua _kho_ten_dang.
CREATE OR REPLACE FUNCTION public.fn_btyeu_in_lay(p_bai_test uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare t record; v_bd text; v_caus jsonb;
begin
  if not public.la_thanh_vien() then return null; end if;
  select bt.id, bt.loai, bt.mon, bt.ngay, bt.in_giay_at, bt.buoi_hoc_id, bt.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi,
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
      'loai_cau', k.loai_cau, 'noi_dung', k.noi_dung, 'lua_chon', k.lua_chon, 'anh_de', k.anh_de, 'dap_an_key', k.dap_an_key, 'loi_giai', k.loi_giai,
      'chon', (select blc.dap_an_hs from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = k.bai_test_id and blc.bai_test_cau_id = k.id limit 1),
      'verdict', (select blc.verdict from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = k.bai_test_id and blc.bai_test_cau_id = k.id limit 1)
    ) order by k.thu_tu), '[]'::jsonb)
    from bai_test_cau k left join %1$I bd on bd.ma_dang = k.ma_dang where k.bai_test_id = $1
  $q$, v_bd, t.mon) into v_caus using p_bai_test;
  return jsonb_build_object('bai_test_id', t.id, 'loai', t.loai, 'da_nop', t.da_nop, 'mon', t.mon, 'ngay', t.ngay, 'in_giay_at', t.in_giay_at, 'buoi_id', t.buoi_hoc_id,
    'hs', jsonb_build_object('id', t.hoc_sinh_id, 'ho_ten', t.ho_ten, 'ma_hs', t.ma_hs, 'khoi', t.khoi),
    'gio_bat_dau', t.gio_bat_dau, 'gio_ket_thuc', t.gio_ket_thuc, 'phong', t.phong, 'nguoi_ten', t.nguoi_ten, 'caus', v_caus);
end $function$
;

-- ③ fn_btyeu_dang_yeu_2_cua_so (đổ dạng yếu khi mở case / fill): dạng thuộc MỌI nhánh của môn.
CREATE OR REPLACE FUNCTION public.fn_btyeu_dang_yeu_2_cua_so(p_hs uuid, p_mon text)
 RETURNS TABLE(ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not public.la_thanh_vien() or v_bd is null then return; end if;
  return query execute format($q$
    select m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells(array[$1]::uuid[], true) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null -- 29/09: dạng MỌI nhánh của môn
    where m.muc = 'yeu' and m.n >= 3
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                  left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = $1 and p.ma_dang = m.ma_dang and coalesce(b.ngay, g.graded_at::date) >= $2)
    order by m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon;
end $function$
;

-- ③ fn_btyeu_de_xuat_dang_moi ("🤖 +N dạng yếu mới"): dạng thuộc MỌI nhánh của môn.
CREATE OR REPLACE FUNCTION public.fn_btyeu_de_xuat_dang_moi(p_mon text DEFAULT NULL::text, p_case uuid DEFAULT NULL::uuid, p_thuc_hien boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text; v_mon text; v_n integer := 0; v_out jsonb := '[]'::jsonb; r record;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('them', 0, 'chi_tiet', '[]'::jsonb); end if;
  if p_thuc_hien and p_case is null then raise exception 'Thêm dạng phải chỉ rõ case.'; end if;
  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = 'dang_xu' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case) loop
    v_bd := public._kho_ban_do_tbl(v_mon);
    for r in execute format($q$
      with cs as (select y.id as case_id, y.hoc_sinh_id, y.created_at from bo_tro_yeu y where y.mon = $1 and y.trang_thai = 'dang_xu' and ($2::uuid is null or y.id = $2)),
      m as (select c.hoc_sinh_id, c.ma_dang, c.score, c.n from public.fn_mastery_cells((select array_agg(hoc_sinh_id) from cs), true) c
            where c.muc = 'yeu' and c.n >= 3)
      select cs.case_id, cs.hoc_sinh_id, m.ma_dang, bd.ten_dang, m.score, m.n
      from cs join m on m.hoc_sinh_id = cs.hoc_sinh_id
      join lateral (select public._kho_ten_dang($1, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null -- 29/09: dạng MỌI nhánh của môn
      where not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = cs.case_id and d.ma_dang = m.ma_dang)
        and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                    where g.hoc_sinh_id = cs.hoc_sinh_id and p.ma_dang = m.ma_dang and g.graded_at > cs.created_at)
      order by cs.case_id, m.score
    $q$, v_bd) using v_mon, p_case loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
  end loop;
  return jsonb_build_object('them', v_n, 'chi_tiet', v_out);
end $function$
;

-- ④ fn_btyeu_ca_ta (app TA): JSON dạng dựng theo vòng, bảng theo nhánh từng dạng.
CREATE OR REPLACE FUNCTION public.fn_btyeu_ca_ta(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_bd text; v_cautbl text; v_cumtbl text; v_dangs jsonb; v_test jsonb; v_retest jsonb; v_dg jsonb; v_hs jsonb;
  rd record; v_nh text; v_mot jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then return null; end if;
  v_bd := public._kho_ban_do_tbl(b.mon); v_cautbl := public._kho_cau_tbl(b.mon); v_cumtbl := public._kho_cum_tbl(v_cautbl);

  select jsonb_build_object('id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'khoi', h.khoi,
           'level', (select level from hs_level where hoc_sinh_id = h.id and mon = b.mon and loai = 'kien_thuc'))
    into v_hs from hoc_sinh h where h.id = b.hoc_sinh_id;

  v_dangs := '[]'::jsonb;
  -- 29/09: mỗi dạng tra bản đồ/cụm theo NHÁNH của chính nó (Đại · Hình GT · Hình học) — trước 1 bảng cho cả case.
  for rd in select d.id, d.ma_dang from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id
            order by d.diem_luc_mo nulls last, d.created_at loop
    v_nh := public._kho_nhanh_cua_dang(b.mon, rd.ma_dang);
    v_bd := public._kho_ban_do_tbl(b.mon, v_nh); v_cautbl := public._kho_cau_tbl(b.mon, v_nh); v_cumtbl := public._kho_cum_tbl(v_cautbl);
  execute format($q$
    with td as (select * from public._btyeu_tien_do($1))
    select jsonb_build_object(
      'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''),
      'day_at', d.day_at, 'day_buoi_id', d.day_buoi_id, 'dong_at', d.dong_at, 'diem_luc_mo', d.diem_luc_mo,
      'retest_diem', d.retest_diem, 'retest_at', d.retest_at, 'dat', d.dat,
      'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
      'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
      'so_goi_y', coalesce((select sum(so_goi_y) from td where td.ma_dang = d.ma_dang), 0),
      'cau_cuoi_at', (select max(cau_cuoi_at) from td where td.ma_dang = d.ma_dang),
      'cums', coalesce((select jsonb_agg(jsonb_build_object(
          'ma_cum', td.ma_cum, 'ten', coalesce(c.ten, case when td.ma_cum is null then 'Cả dạng' else td.ma_cum end),
          'so_cau', td.so_cau, 'so_dung', td.so_dung, 'so_goi_y', td.so_goi_y, 'cau_cuoi_at', td.cau_cuoi_at) order by c.thu_tu nulls last)
        from td left join %2$I c on c.ma_cum = td.ma_cum where td.ma_dang = d.ma_dang), '[]'::jsonb)
    )
    from bo_tro_yeu_dang d left join %1$I bd on bd.ma_dang = d.ma_dang
    where d.id = $2
  $q$, v_bd, v_cumtbl) into v_mot using p_buoi, rd.id;
    v_dangs := v_dangs || jsonb_build_array(v_mot);
  end loop;

  -- Test cuối ca: điểm theo dạng (đã nộp) — chấm ở DB, app chỉ hiện.
  select jsonb_build_object('bai_test_id', bt.id, 'so_cau', bt.so_cau,
           'da_nop', bl.trang_thai = 'da_nop', 'nop_at', bl.nop_at,
           'theo_dang', coalesce((
             select jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'so_cau', x.n, 'so_dung', x.d))
             from (select btc.ma_dang, count(*) n, count(*) filter (where blc.verdict = 'correct') d
                   from bai_test_cau btc left join bai_lam_cau blc on blc.bai_test_cau_id = btc.id and blc.bai_lam_id = bl.id
                   where btc.bai_test_id = bt.id group by btc.ma_dang) x), '[]'::jsonb))
    into v_test
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' limit 1;

  select jsonb_build_object('bai_test_id', bt.id, 'ngay', bt.ngay, 'so_cau', bt.so_cau,
           'da_nop', coalesce(bl.trang_thai = 'da_nop', false), 'nop_at', bl.nop_at)
    into v_retest
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'retest' limit 1;

  select jsonb_build_object('nhan_xet', g.nhan_xet, 'muc_ma', g.muc_ma) into v_dg
    from buoi_danh_gia g where g.buoi_hoc_id = p_buoi and g.hoc_sinh_id = b.hoc_sinh_id;

  return jsonb_build_object(
    'buoi_id', b.buoi_id, 'mon', b.mon, 'ngay', b.ngay, 'trang_thai', b.trang_thai, 'diem_danh', b.diem_danh,
    'buoi_hoc_hs_id', b.buoi_hoc_hs_id, 'nguoi_day_tg', b.nguoi_day_tg, 'danh_gia_xong_at', b.danh_gia_xong_at,
    'bo_tro_yeu_id', b.bo_tro_yeu_id, 'hs', v_hs, 'dangs', v_dangs, 'test', v_test, 'retest', v_retest, 'danh_gia', v_dg,
    'case_trang_thai', (select y.trang_thai from bo_tro_yeu y where y.id = b.bo_tro_yeu_id),
    'case_ket_qua', (select y.ket_qua from bo_tro_yeu y where y.id = b.bo_tro_yeu_id),
    'so_dang_con_day', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)),
    'so_lan_huy', (select count(*) from buoi_hoc_hs hh2 join buoi_hoc b2 on b2.id = hh2.buoi_hoc_id
                   where hh2.bo_tro_yeu_id = b.bo_tro_yeu_id and b2.trang_thai = 'huy'));
end $function$
;

-- ④ fn_btyeu_ca_cua_toi (app HS, ca hôm nay): như ca_ta.
CREATE OR REPLACE FUNCTION public.fn_btyeu_ca_cua_toi()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  r record;
  v_bd text; v_cautbl text; v_cumtbl text;
  v_dangs jsonb; v_test jsonb;
  rd record; v_nh text; v_mot jsonb;
begin
  if v_hs is null then return null; end if;
  select b.id, b.gio_bat_dau, b.gio_ket_thuc, b.phong, y.id as case_id, y.mon,
         (select ho_ten from nhan_su where id = b.nguoi_day_tg) as ta_ten
    into r
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = v_hs and hh.bo_tro_yeu_id is not null
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  where b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.ngay = public._btyeu_today()
    and hh.diem_danh = 'co_mat' and b.danh_gia_xong_at is null
  order by b.gio_bat_dau nulls last, b.created_at
  limit 1;
  if r.id is null then return null; end if;

  v_bd := public._kho_ban_do_tbl(r.mon); v_cautbl := public._kho_cau_tbl(r.mon); v_cumtbl := public._kho_cum_tbl(v_cautbl);

  v_dangs := '[]'::jsonb;
  -- 29/09: mỗi dạng tra bản đồ/cụm theo NHÁNH của chính nó (Đại · Hình GT · Hình học) — trước 1 bảng cho cả case.
  for rd in select d.id, d.ma_dang from bo_tro_yeu_dang d where d.bo_tro_yeu_id = r.case_id and d.dong_at is null
            order by d.diem_luc_mo nulls last, d.created_at loop
    v_nh := public._kho_nhanh_cua_dang(r.mon, rd.ma_dang);
    v_bd := public._kho_ban_do_tbl(r.mon, v_nh); v_cautbl := public._kho_cau_tbl(r.mon, v_nh); v_cumtbl := public._kho_cum_tbl(v_cautbl);
  execute format($q$
    with td as (select * from public._btyeu_tien_do($1))
    select jsonb_build_object(
      'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''),
      'da_day_truoc', (d.day_at is not null and d.day_buoi_id is distinct from $1),
      'diem_luc_mo', d.diem_luc_mo,
      'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
      'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
      'cums', coalesce((
        select jsonb_agg(jsonb_build_object(
          'ma_cum', c.ma_cum, 'ten', coalesce(c.ten, 'Cụm ' || c.thu_tu), 'thu_tu', c.thu_tu,
          'tien_de', coalesce((select jsonb_agg(t.tien_de_ma_cum) from %3$I t where t.ma_cum = c.ma_cum), '[]'::jsonb),
          'so_cau_kho', (select count(*) from %4$I q where q.ma_cum = c.ma_cum and q.xoa_at is null),
          'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang and td.ma_cum = c.ma_cum), 0),
          'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang and td.ma_cum = c.ma_cum), 0)
        ) order by c.thu_tu, c.ma_cum)
        from %2$I c where c.ma_dang = d.ma_dang), '[]'::jsonb)
    )
    from bo_tro_yeu_dang d
    left join %1$I bd on bd.ma_dang = d.ma_dang
    where d.id = $2
  $q$, v_bd, v_cumtbl, replace(v_cumtbl, '_cum_bai', '_cum_tien_de'), v_cautbl)
  into v_mot using r.id, rd.id;
    v_dangs := v_dangs || jsonb_build_array(v_mot);
  end loop;

  select jsonb_build_object('bai_test_id', bt.id, 'so_cau', bt.so_cau,
           'da_nop', exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop'))
    into v_test
  from bai_test bt where bt.buoi_hoc_id = r.id and bt.loai = 'bo_tro_test' limit 1;

  return jsonb_build_object(
    'buoi_id', r.id, 'mon', r.mon, 'gio_bat_dau', r.gio_bat_dau, 'gio_ket_thuc', r.gio_ket_thuc, 'phong', r.phong,
    'ta_ten', r.ta_ten, 'dangs', v_dangs, 'test', v_test);
end $function$
;

-- ⑤ Tự kiểm — nhắm thẳng các chỗ vừa vá.
do $v$
begin
  if to_regclass('public.hinh_hoc_cum_tien_de') is null then raise exception 'thiếu hinh_hoc_cum_tien_de'; end if;
  if exists (select 1 from pg_proc where pronamespace = 'public'::regnamespace
             and proname in ('_btyeu_bu_retest', 'fn_btyeu_dong_ca', 'fn_btyeu_in_sinh', 'fn_btyeu_luyen_sinh', 'fn_btyeu_ca_ta', 'fn_btyeu_ca_cua_toi')
             and prosrc not like '%_kho_nhanh_cua_dang(%') then raise exception 'còn hàm bổ trợ chọn bảng theo môn'; end if;
  if exists (select 1 from pg_proc where pronamespace = 'public'::regnamespace
             and proname in ('fn_btyeu_in_lay', 'fn_btyeu_dang_yeu_2_cua_so', 'fn_btyeu_de_xuat_dang_moi')
             and prosrc not like '%_kho_ten_dang(%') then raise exception 'còn hàm bổ trợ tra tên dạng 1 bảng'; end if;
  if (select prosrc from pg_proc where proname = 'fn_btyeu_ca_ta' and pronamespace = 'public'::regnamespace) like '%into v_dangs using%'
    then raise exception 'fn_btyeu_ca_ta chưa chuyển sang vòng theo dạng'; end if;
end $v$;
