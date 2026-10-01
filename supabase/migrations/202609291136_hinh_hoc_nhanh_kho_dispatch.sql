-- 29/09 (Thùy: "fix đi") — BẬT NHÁNH HÌNH HỌC (phase Học, Bài = dạng) ở tầng DB dùng chung.
-- Bối cảnh: sáng 29/09 sửa lớp báo cáo client (mastery.ts, commit 714b161). Cùng họ lỗi ở DB: mọi hàm dispatch
-- môn→bảng (_kho_*_tbl) và hàm dò nhánh _kho_nhanh_cua_dang CHỈ biết 'hinh_gt' ⇒ dạng Bài Hình học (HH…) rơi về
-- bảng Đại: tên dạng trống (bổ trợ, trợ lý, app HS), nhiệm vụ/thành tựu không đếm dạng Hình, tự luyện/thử thách
-- rút trúng dạng Hình nhưng tìm câu trong dai_cau_hoi ⇒ bỏ qua; bổ trợ đuổi (_kho_nhanh_cua_dang) sai bảng.
-- Hàm dựng TỪ BẢN ĐANG CHẠY (pg_get_functiondef 29/09), chỉ vá đúng dòng dispatch — không chép file migration cũ.
-- Đại/KHTN KHÔNG đổi hành vi: _kho_nhanh_cua_dang trả null như cũ cho mọi mã không thuộc hgt/hinh_hoc.
-- KHÔNG đụng bổ trợ YẾU ở migration này (chọn câu theo 1 bảng/ca — đợt riêng, chờ CEO vì Hình cấp 2 có 0 câu MCQ).

-- ① Compat: bảng lý thuyết Bài dùng ma_bai; mọi hàm/đoạn code dùng chung tra lý thuyết theo ma_dang
--    (_kho_snapshot_cau, hs_sotay_*, src/lib/kho/api.ts getDangLyThuyet) ⇒ alias GENERATED như hinh_hoc_bai (mig 202609181735).
--    App chỉ GHI qua ma_bai (src/lib/kho/hinhhoc.ts upsert/delete) ⇒ cột generated không chặn đường ghi nào.
alter table public.hinh_hoc_bai_ly_thuyet add column if not exists ma_dang text generated always as (ma_bai) stored;

-- ② Dò nhánh của 1 dạng: thêm Bài Hình học (mã không trùng dai/hgt — kiểm 29/09: giao 3 bảng = 0).
CREATE OR REPLACE FUNCTION public._kho_nhanh_cua_dang(p_mon text, p_ma_dang text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select case when p_mon <> 'KHTN' and exists (select 1 from hgt_ban_do where ma_dang = p_ma_dang) then 'hinh_gt'
              when p_mon <> 'KHTN' and exists (select 1 from hinh_hoc_bai where ma_bai = p_ma_dang) then 'hinh_hoc'
              else null end
$function$
;

-- ③ _kho_ban_do_tbl: + hinh_hoc
CREATE OR REPLACE FUNCTION public._kho_ban_do_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_ban_do'
              when p_nhanh = 'hinh_gt' then 'hgt_ban_do'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai'
              else 'dai_ban_do' end
$function$
;

-- ③ _kho_cau_tbl: + hinh_hoc
CREATE OR REPLACE FUNCTION public._kho_cau_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_hoi'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_hoi'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_hoi'
              else 'dai_cau_hoi' end
$function$
;

-- ③ _kho_lt_tbl: + hinh_hoc
CREATE OR REPLACE FUNCTION public._kho_lt_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_dang_ly_thuyet'
              when p_nhanh = 'hinh_gt' then 'hgt_dang_ly_thuyet'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_bai_ly_thuyet'
              else 'dai_dang_ly_thuyet' end
$function$
;

-- ③ _kho_form_tn_tbl: + hinh_hoc
CREATE OR REPLACE FUNCTION public._kho_form_tn_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_form_tn'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_form_tn'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_form_tn'
              else 'dai_cau_form_tn' end
$function$
;

-- ③ _kho_form_dien_tbl: + hinh_hoc
CREATE OR REPLACE FUNCTION public._kho_form_dien_tbl(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when p_mon = 'KHTN' then 'khtn_cau_form_dien'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_form_dien'
              when p_nhanh = 'hinh_hoc' then 'hinh_hoc_cau_form_dien'
              else 'dai_cau_form_dien' end
$function$
;

-- ④ Độ khó dạng: + Bài Hình học (null nếu chưa gán — giữ nguyên, không bịa).
CREATE OR REPLACE FUNCTION public._kho_muc_do_dang(p_mon text, p_ma_dang text)
 RETURNS smallint
 LANGUAGE plpgsql
 STABLE
AS $function$
declare v_nhanh text := public._kho_nhanh_cua_dang(p_mon, p_ma_dang); v_md smallint;
begin
  if p_mon = 'KHTN' then
    select muc_do into v_md from khtn_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_gt' then
    select muc_do into v_md from hgt_ban_do where ma_dang = p_ma_dang;
  elsif v_nhanh = 'hinh_hoc' then
    select muc_do into v_md from hinh_hoc_bai where ma_bai = p_ma_dang;
  else
    select muc_do into v_md from dai_ban_do where ma_dang = p_ma_dang;
  end if;
  return v_md;
end $function$
;

-- ⑤ Tên dạng (bổ trợ: chi tiết case, retest theo dõi…): tra đúng bảng theo nhánh của CHÍNH dạng đó (sửa luôn HGT).
CREATE OR REPLACE FUNCTION public._kho_ten_dang(p_mon text, p_ma_dang text)
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v text; v_tbl text := public._kho_ban_do_tbl(p_mon, public._kho_nhanh_cua_dang(p_mon, p_ma_dang));
begin
  if v_tbl is null or p_ma_dang is null then return null; end if;
  execute format('select ten_dang from %I where ma_dang = $1 limit 1', v_tbl) into v using p_ma_dang;
  return v;
end $function$
;

-- ⑤b Tên dạng cho Trợ lý: + nhánh Hình học.
CREATE OR REPLACE FUNCTION public._troly_ten_dang(p_ma text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare r record; v text;
begin
  if p_ma is null then return null; end if;
  for r in select * from (values ('Toán', null::text), ('Toán', 'hinh_gt'), ('Toán', 'hinh_hoc'), ('KHTN', null)) t(mon, nhanh) loop
    execute format('select ten_dang from %I where ma_dang = $1 limit 1', public._kho_ban_do_tbl(r.mon, r.nhanh))
      into v using p_ma;
    if v is not null then return jsonb_build_object('mon', r.mon, 'ten', v); end if;
  end loop;
  return null;
end $function$
;

-- ⑥ fn_nhiem_vu_hoan_thanh: tập dạng của môn + Bài Hình học.
CREATE OR REPLACE FUNCTION public.fn_nhiem_vu_hoan_thanh(p_mon text, p_ym text, p_hs uuid[] DEFAULT NULL::uuid[])
 RETURNS TABLE(hoc_sinh_id uuid, ma text, tang text, xong_ngay date, so integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  c record;
  v_ms date := (p_ym || '-01')::date;
  v_me date := ((p_ym || '-01')::date + interval '1 month')::date - 1;
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_den date; v_hs uuid[]; v_dangs text[];
begin
  select * into c from nhiem_vu_cau_hinh where mon = p_mon and bat;
  if c.mon is null then return; end if;
  v_den := least(v_me, v_nay);
  if v_den < c.bat_dau or v_den < v_ms then return; end if;
  v_hs := coalesce(p_hs, (select array_agg(distinct hl.hoc_sinh_id) from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                          where hl.trang_thai = 'dang_hoc' and l.mon = p_mon));
  if v_hs is null then return; end if;
  -- dạng của môn (registry §1.6): bản đồ gốc + nhánh hình
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I union select ma_dang from %I) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt'), public._kho_ban_do_tbl(p_mon, 'hinh_hoc')) into v_dangs;

  return query
  with
  ngay as (select g::date as d, (row_number() over (order by g))::int as i from generate_series(c.bat_dau, v_den, interval '1 day') g),
  cau_app as (   -- câu làm trên app (tự luyện, gồm Thử thách) của môn, từ ngày mở
    select bl.hoc_sinh_id as hs, blc.verdict, btc.ma_dang, blc.cham_at as t, (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date as d
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    where bt.loai = 'tu_luyen' and bt.mon = p_mon and bl.hoc_sinh_id = any(v_hs)
      and blc.cham_at >= (c.bat_dau::timestamp at time zone 'Asia/Ho_Chi_Minh')
      and blc.cham_at < ((v_den + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh')
  ),
  sai as (       -- lần làm SAI theo dạng, mọi nguồn (ET/BTVN/MT chấm tay + mọi bài online)
    select g.hoc_sinh_id as hs, sp.ma_dang, coalesce((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id left join buoi_hoc b on b.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(v_hs) and g.result = 'wrong' and sp.ma_dang is not null
      and coalesce(b.ngay, (g.graded_at at time zone 'Asia/Ho_Chi_Minh')::date) >= c.bat_dau - c.n3_cua_so
    union all
    select bl.hoc_sinh_id, btc.ma_dang, blc.cham_at
    from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    where bl.hoc_sinh_id = any(v_hs) and blc.verdict = 'wrong' and btc.ma_dang is not null
      and blc.cham_at >= ((c.bat_dau - c.n3_cua_so)::timestamp at time zone 'Asia/Ho_Chi_Minh')
  ),
  sua_sai as (
    select a.hs, a.d from cau_app a
    where a.verdict = 'correct' and a.ma_dang is not null
      and exists (select 1 from sai s where s.hs = a.hs and s.ma_dang = a.ma_dang and s.t < a.t and s.t >= a.t - make_interval(days => c.n3_cua_so))
  ),
  pass as (select distinct tl.hoc_sinh_id as hs, tl.ngay as d from thu_thach_luot tl
           where tl.mon = p_mon and tl.pass and tl.hoc_sinh_id = any(v_hs) and tl.ngay between c.bat_dau and v_den),
  -- ===== NGÀY: đơn vị theo ngày → xếp lấp nhiệm vụ treo =====
  u_ngay as (
    select 'N1'::text as ma, tl.hoc_sinh_id as hs, tl.ngay as d, count(*)::int as n from thu_thach_luot tl
      where tl.mon = p_mon and tl.pass and tl.hoc_sinh_id = any(v_hs) and tl.ngay between c.bat_dau and v_den group by 2, 3
    union all
    select 'N2', a.hs, a.d, (count(*) / c.n2_cau)::int from cau_app a where a.verdict = 'correct' group by 2, 3
    union all
    select 'N3', s.hs, s.d, (count(*) / c.n3_cau)::int from sua_sai s group by 2, 3
  ),
  mang_ngay as (
    select h.hs, m.ma, array_agg(1 order by ng.i) as mo, array_agg(coalesce(u.n, 0) order by ng.i) as un, array_agg(ng.d order by ng.i) as ds
    from unnest(v_hs) h(hs) cross join (values ('N1'), ('N2'), ('N3')) m(ma) cross join ngay ng
    left join u_ngay u on u.hs = h.hs and u.ma = m.ma and u.d = ng.d
    group by h.hs, m.ma
  ),
  xong_ngay as (
    select mn.hs, mn.ma, 'ngay'::text as tang, x.d, x.f::int as f
    from mang_ngay mn cross join lateral unnest(mn.ds, public._nv_xep(mn.mo, mn.un, c.song_ngay)) x(d, f)
    where x.f > 0 and x.d >= v_ms
  ),
  -- ===== TUẦN (4 khối trong tháng, T2–T4 dồn tới hết tháng) =====
  ngay_thang as (
    select g::date as d, (row_number() over (order by g))::int as i,
           case when g::date >= c.bat_dau and (extract(day from g)::int in (1, 8, 15, 22) or g::date = c.bat_dau) then 1 else 0 end as mo
    from generate_series(v_ms, v_den, interval '1 day') g
  ),
  s0 as (   -- dạng YẾU lúc đầu tháng
    select m.hoc_sinh_id as hs, m.ma_dang
    from public.fn_mastery_cells(v_hs, false, null, 5, 5, 3, v_ms::timestamp at time zone 'Asia/Ho_Chi_Minh') m
    where m.muc = 'yeu' and m.ma_dang = any(v_dangs)
  ),
  moc as (
    select distinct least(v_den, x)::date as den
    from unnest(array[v_ms + 6, v_ms + 13, v_ms + 20, v_me]) x where least(v_den, x) >= greatest(v_ms, c.bat_dau)
  ),
  snap as (
    select mc.den, s0.hs, count(*) filter (where m.muc = 'dat' and m.tin in ('tb', 'cao'))::int as so
    from moc mc
    cross join lateral public.fn_mastery_cells(v_hs, false, null, 5, 5, 3, (mc.den + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh') m
    join s0 on s0.hs = m.hoc_sinh_id and s0.ma_dang = m.ma_dang
    group by mc.den, s0.hs
  ),
  u_tuan as (
    select 'T2'::text as ma, x.hs, x.d, count(*)::int as n from (
      select g.hoc_sinh_id as hs, b.ngay as d, g.buoi_hoc_id
      from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id and sp.phase = 'et'
      join buoi_hoc b on b.id = g.buoi_hoc_id join lop l on l.id = b.lop_id
      where l.mon = p_mon and g.hoc_sinh_id = any(v_hs) and b.ngay between greatest(v_ms, c.bat_dau) and v_den and b.trang_thai <> 'huy'
      group by 1, 2, 3
      having avg(case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end) >= 0.8
    ) x group by 2, 3
    union all
    select 'T3', y.hs, y.d, 1 from (
      select p.hs, p.d, row_number() over (partition by p.hs order by p.d) as rn from pass p where p.d >= v_ms
    ) y where y.rn % c.t3_ngay = 0
    union all
    select 'T4', z.hs, z.den, z.n from (
      select sn.hs, sn.den,
             greatest(0, sn.so - coalesce(max(sn.so) over (partition by sn.hs order by sn.den rows between unbounded preceding and 1 preceding), 0))::int as n
      from snap sn
    ) z where z.n > 0
  ),
  mang_tuan as (
    select h.hs, m.ma, array_agg(nt.mo order by nt.i) as mo, array_agg(coalesce(u.n, 0) order by nt.i) as un, array_agg(nt.d order by nt.i) as ds
    from unnest(v_hs) h(hs) cross join (values ('T2'), ('T3'), ('T4')) m(ma) cross join ngay_thang nt
    left join u_tuan u on u.hs = h.hs and u.ma = m.ma and u.d = nt.d
    group by h.hs, m.ma
  ),
  t1 as (   -- BTVN đúng hẹn CẢ TUẦN — chỉ xét tuần đã kết thúc
    select k.hoc_sinh_id as hs, least(4, (extract(day from b.ngay)::int - 1) / 7 + 1) as w, max(b.ngay) as d,
           bool_and(k.trang_thai_nop = 'nop_dung_han') as ok
    from btvn_ket_qua k join buoi_hoc b on b.id = k.buoi_hoc_id join lop l on l.id = b.lop_id
    where l.mon = p_mon and k.hoc_sinh_id = any(v_hs) and k.trang_thai_nop is not null and b.trang_thai <> 'huy'
      and b.ngay between greatest(v_ms, c.bat_dau) and v_den
    group by 1, 2
  ),
  xong_tuan as (
    select mt.hs, mt.ma, 'tuan'::text as tang, x.d, x.f::int as f
    from mang_tuan mt cross join lateral unnest(mt.ds, public._nv_xep(mt.mo, mt.un, 4)) x(d, f)
    where x.f > 0
    union all
    select t1.hs, 'T1', 'tuan', t1.d, 1 from t1
    where t1.ok and (case t1.w when 4 then v_me else v_ms + (t1.w * 7 - 1) end) <= v_den
  ),
  -- ===== THÁNG =====
  mt_nay as (select * from public.fn_mt_hang_thang(p_mon, to_char(v_ms - interval '1 month', 'YYYY-MM')) m
             where m.hoc_sinh_id = any(v_hs) and m.ngay between greatest(v_ms, c.bat_dau) and v_den),
  mt_truoc as (select * from public.fn_mt_hang_thang(p_mon, to_char(v_ms - interval '2 month', 'YYYY-MM'))),
  xong_thang as (
    select n.hoc_sinh_id as hs, 'M1'::text as ma, 'thang'::text as tang, n.ngay as d, 1 as f
    from mt_nay n left join mt_truoc t on t.hoc_sinh_id = n.hoc_sinh_id
    where n.hang <= ceil(c.m1_top_pct * n.so_em) or (t.hang_quy is not null and n.hang_quy < t.hang_quy)
    union all
    select y.hs, 'M2', 'thang', y.d, 1 from (
      select p.hs, p.d, row_number() over (partition by p.hs order by p.d) as rn from pass p where p.d >= v_ms
    ) y where y.rn = c.m2_ngay
  ),
  tat_ca as (select * from xong_ngay union all select * from xong_tuan union all select * from xong_thang),
  -- ===== RƯƠNG: đủ ruong_can nhiệm vụ trong 1 tuần =====
  ruong as (
    select r.hs, 'RUONG'::text as ma, 'ruong'::text as tang, min(r.d) filter (where r.cum >= c.ruong_can) as d, 1 as f
    from (
      select q.hs, q.d, least(4, (extract(day from q.d)::int - 1) / 7 + 1) as w,
             sum(q.f) over (partition by q.hs, least(4, (extract(day from q.d)::int - 1) / 7 + 1) order by q.d) as cum
      from (select tc.hs, tc.d, sum(tc.f)::int as f from tat_ca tc group by 1, 2) q
    ) r
    group by r.hs, r.w having max(r.cum) >= c.ruong_can
  ),
  con_mo as (
    select mn.hs, mn.ma, 'con_mo'::text as tang, v_den as d, public._nv_con_mo(mn.mo, mn.un, c.song_ngay) as f from mang_ngay mn
    union all
    select mt.hs, mt.ma, 'con_mo', v_den, public._nv_con_mo(mt.mo, mt.un, 4) from mang_tuan mt
  ),
  tien_do as (
    select u.hs, u.ma, 'tien_do'::text as tang, v_den as d, u.n as f from (
      select 'N1'::text as ma, p.hoc_sinh_id, count(*)::int as n from thu_thach_luot p
        where p.mon = p_mon and p.pass and p.hoc_sinh_id = any(v_hs) and p.ngay = v_den group by 2
      union all select 'N2', a.hs, count(*)::int from cau_app a where a.verdict = 'correct' and a.d = v_den group by 2
      union all select 'N3', s.hs, count(*)::int from sua_sai s where s.d = v_den group by 2
      union all select 'M2', p.hs, count(*)::int from pass p where p.d >= v_ms group by 2
    ) u(ma, hs, n)
  )
  select * from tat_ca
  union all select * from ruong
  union all select * from con_mo
  union all select * from tien_do;
end $function$
;

-- ⑥ fn_thanh_tuu_thang: tập dạng của môn + Bài Hình học.
CREATE OR REPLACE FUNCTION public.fn_thanh_tuu_thang(p_mon text, p_ym text, p_hs uuid[] DEFAULT NULL::uuid[])
 RETURNS TABLE(hoc_sinh_id uuid, thanh_tuu_key text, ket_qua text)
 LANGUAGE plpgsql
AS $function$   -- volatile: dùng bảng tạm
declare
  v_ms date := (p_ym || '-01')::date;
  v_me date := ((p_ym || '-01')::date + interval '1 month')::date - 1;
  v_tu timestamptz := (p_ym || '-01')::date::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_den timestamptz := (((p_ym || '-01')::date + interval '1 month')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_mua record; v_hs uuid[]; v_dangs text[]; v_khoi text; v_ym text;
begin
  select * into v_mua from gami_mua where p_ym between thang_dau and thang_cuoi limit 1;
  -- em "học tháng đó" = có dòng điểm danh ở buổi lớp môn trong tháng
  select array_agg(distinct h.hoc_sinh_id) into v_hs
  from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id join lop l on l.id = b.lop_id
  where l.mon = p_mon and b.ngay between v_ms and v_me and b.trang_thai <> 'huy'
    and (p_hs is null or h.hoc_sinh_id = any(p_hs));
  if v_hs is null then return; end if;
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I union select ma_dang from %I) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt'), public._kho_ban_do_tbl(p_mon, 'hinh_hoc')) into v_dangs;

  -- Bảng đua tháng: chỉ các khối có em trong danh sách (1 HS ⇒ 1 khối)
  create temp table _dua (hoc_sinh_id uuid, hang integer, so_em integer) on commit drop;
  for v_khoi in select distinct l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and hl.hoc_sinh_id = any(v_hs) and l.khoi is not null loop
    insert into _dua select d.hoc_sinh_id, d.hang, d.so_em_co_diem from public.fn_rank_dua_thang(p_mon, v_khoi, p_ym) d;
  end loop;
  -- MT: tháng này + mốc (tháng MT đầu tiên của em trong mùa)
  create temp table _mt (ym text, hoc_sinh_id uuid, hang integer, so_em integer) on commit drop;
  for v_ym in select to_char(g, 'YYYY-MM') from generate_series((coalesce(v_mua.thang_dau, p_ym) || '-01')::date, v_ms, interval '1 month') g loop
    insert into _mt select v_ym, m.hoc_sinh_id, m.hang, m.so_em from public.fn_mt_hang_thang(p_mon, v_ym) m where m.hoc_sinh_id = any(v_hs);
  end loop;

  return query
  with
  hs as materialized (select unnest(v_hs) as hs),
  dd as materialized (select h.hoc_sinh_id as hs, count(*) filter (where h.diem_danh = 'co_mat') as co, count(*) filter (where h.diem_danh in ('vang', 'vang_phep')) as vang
         from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id join lop l on l.id = b.lop_id
         where l.mon = p_mon and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and h.hoc_sinh_id = any(v_hs)
         group by 1),
  bt as materialized (select k.hoc_sinh_id as hs, count(*) as n, count(*) filter (where k.trang_thai_nop = 'nop_dung_han') as dh
         from btvn_ket_qua k join buoi_hoc b on b.id = k.buoi_hoc_id join lop l on l.id = b.lop_id
         where l.mon = p_mon and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and k.trang_thai_nop is not null and k.hoc_sinh_id = any(v_hs)
         group by 1),
  bai as materialized (   -- tỉ lệ đúng từng bài (em × buổi × phase) — cùng quy đổi mastery
    select g.hoc_sinh_id as hs, sp.phase, g.buoi_hoc_id, avg(case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end) as tl
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id and sp.phase in ('et', 'btvn')
    join buoi_hoc b on b.id = g.buoi_hoc_id join lop l on l.id = b.lop_id
    where l.mon = p_mon and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and g.hoc_sinh_id = any(v_hs)
    group by 1, 2, 3),
  tl as materialized (select bl.hoc_sinh_id as hs, count(*) as n
         from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt2 on bt2.id = bl.bai_test_id
         where bt2.loai = 'tu_luyen' and bt2.mon = p_mon and blc.verdict = 'correct' and bl.hoc_sinh_id = any(v_hs)
           and blc.cham_at >= v_tu and blc.cham_at < v_den
         group by 1),
  tt as materialized (select t.hoc_sinh_id as hs, count(distinct t.ngay) filter (where t.pass) as ngay_pass, count(*) filter (where t.so_dung = t.so_cau) as so_full
         from thu_thach_luot t where t.mon = p_mon and t.ngay between v_ms and v_me and t.hoc_sinh_id = any(v_hs) group by 1),
  mt_nay as materialized (select * from _mt where ym = p_ym),
  mt_moc as materialized (select distinct on (m.hoc_sinh_id) m.hoc_sinh_id, m.ym, m.hang, m.so_em from _mt m order by m.hoc_sinh_id, m.ym),
  ms0 as materialized (select m.hoc_sinh_id as hs, m.ma_dang from public.fn_mastery_cells(v_hs, false, null, 5, 5, 3, v_tu) m
          where m.muc = 'yeu' and m.ma_dang = any(v_dangs)),
  ms1 as materialized (select m.hoc_sinh_id as hs, m.ma_dang, m.muc, m.tin from public.fn_mastery_cells(v_hs, false, null, 5, 5, 3, v_den) m
          where m.ma_dang = any(v_dangs)),
  msdo as materialized (select distinct m.hoc_sinh_id as hs from public.fn_mastery_cells(v_hs, false, v_tu, 5, 5, 3, v_den) m where m.ma_dang = any(v_dangs)),
  ll as materialized (select h.hs,
                exists (select 1 from ms0 join ms1 on ms1.hs = ms0.hs and ms1.ma_dang = ms0.ma_dang
                        where ms0.hs = h.hs and ms1.muc = 'dat' and ms1.tin in ('tb', 'cao')) as lap,
                not exists (select 1 from ms1 where ms1.hs = h.hs and ms1.muc = 'yeu') and exists (select 1 from msdo where msdo.hs = h.hs) as sach
         from hs h),
  tk as materialized (select * from thanh_tuu where mon = p_mon and active)
  select h.hs, tk.key,
    case
      when tk.mo_tu is not null and v_me < tk.mo_tu then 'khong_ap_dung'
      when tk.loai_chi_so = 'mt_hon_moc' and (select mm.ym from mt_moc mm where mm.hoc_sinh_id = h.hs) = p_ym then 'khong_ap_dung'
      when case tk.loai_chi_so
        when 'diem_danh_du'        then coalesce((select dd.co >= 1 and dd.vang = 0 from dd where dd.hs = h.hs), false)
        when 'btvn_dung_han_du'    then coalesce((select bt.n >= 1 and bt.dh = bt.n from bt where bt.hs = h.hs), false)
        when 'tu_luyen_cau_dung'   then coalesce((select tl.n >= (tk.tham_so->>'n')::int from tl where tl.hs = h.hs), false)
        when 'thu_thach_ngay_pass' then coalesce((select tt.ngay_pass >= (tk.tham_so->>'n')::int from tt where tt.hs = h.hs), false)
        when 'thu_thach_luot_full' then coalesce((select tt.so_full >= (tk.tham_so->>'n')::int from tt where tt.hs = h.hs), false)
        when 'et_ti_le_bai'        then coalesce((select count(*) >= 1 and count(*) filter (where bai.tl >= (tk.tham_so->>'ti_le')::numeric)
                                                         >= (tk.tham_so->>'phan')::numeric * count(*)
                                                  from bai where bai.hs = h.hs and bai.phase = 'et'), false)
        when 'btvn_ti_le_tb'       then coalesce((select avg(bai.tl) >= (tk.tham_so->>'ti_le')::numeric from bai where bai.hs = h.hs and bai.phase = 'btvn'), false)
        when 'mt_top_pct'          then coalesce((select m.hang <= ceil((tk.tham_so->>'pct')::numeric * m.so_em) from mt_nay m where m.hoc_sinh_id = h.hs), false)
        when 'mt_hon_moc'          then coalesce((select m.hang::numeric / m.so_em < mc.hang::numeric / mc.so_em
                                                         or m.hang <= ceil((tk.tham_so->>'top_pct')::numeric * m.so_em)
                                                  from mt_nay m join mt_moc mc on mc.hoc_sinh_id = m.hoc_sinh_id where m.hoc_sinh_id = h.hs), false)
        when 'lap_lo'              then coalesce((select ll.lap or ll.sach from ll where ll.hs = h.hs), false)
        when 'dua_thang_top_pct'   then coalesce((select d.hang <= ceil((tk.tham_so->>'pct')::numeric * d.so_em) from _dua d where d.hoc_sinh_id = h.hs), false)
      end then 'dat'
      else 'khong_dat'
    end
  from hs h cross join tk;
  drop table _dua; drop table _mt;
end $function$
;

-- ⑦ tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text): nhánh = _kho_nhanh_cua_dang (giữ tiền tố GT% làm dự phòng).
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end); -- suy nhánh từ tiền tố mã dạng (DG/GT/KG)
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  i integer;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..10 loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    -- Tier 1: ưu tiên cụm CHƯA dùng trong lượt này + tránh 9 lần gần nhất của dạng.
    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1 and lan_thu > $6 - 10)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn tránh lặp gần đây.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select ma_cau from tu_luyen_dang_lan
            where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    end if;

    -- Tier 3: kho ít câu — chấp nhận lặp (CEO chốt cùng luật tự luyện tổng hợp), chỉ né trùng NGAY trong lượt này.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch;
    end if;

    -- Dạng hết sạch câu (kho cạn hẳn) → dừng lượt sớm, giữ số câu đã có (không lặp vô ích 10 lần).
    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$
;

-- ⑦ tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_chi_cau_moi boolean): nhánh = _kho_nhanh_cua_dang (giữ tiền tố GT% làm dự phòng).
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_chi_cau_moi boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end);
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_cutoff timestamptz := public._tu_luyen_dau_cua_so_truoc();
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  i integer;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..10 loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    -- Tier 1: ưu tiên cụm CHƯA dùng trong lượt này + tránh lặp — cửa sổ loại trừ tuỳ chế độ:
    --   p_chi_cau_moi=true  → câu KHÔNG nằm trong 2 cửa sổ gần nhất (tao_at >= v_cutoff).
    --   p_chi_cau_moi=false → như cũ, tránh 9 lần (batch) gần nhất (lan_thu > v_lan_thu-10).
    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1
            and (case when $8 then tao_at >= $7 else lan_thu > $6 - 10 end))
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn giữ cửa sổ loại trừ như Tier 1.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select ma_cau from tu_luyen_dang_lan
            where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1
              and (case when $7 then tao_at >= $6 else lan_thu > $5 - 10 end))
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;
    end if;

    -- Tier 3: kho ít câu, chấp nhận lặp — CHỈ khi KHÔNG bật "chỉ câu mới" (bật thì lặp lại
    -- đúng thứ toggle đang cố tránh — dừng lượt sớm thay vì âm thầm phá nghĩa của toggle).
    if v_ma_cau is null and not p_chi_cau_moi then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch;
    end if;

    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  if v_ok_count = 0 and p_chi_cau_moi then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác (không tạo tu_luyen_dang_lan nên xoá an toàn)
    raise exception 'Em đã luyện hết câu MỚI của dạng này trong 2 kỳ gần nhất — tắt "Chỉ câu mới" để luyện lại các câu cũ nhé.';
  end if;
  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$
;

-- ⑦ tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_loai text): nhánh = _kho_nhanh_cua_dang (giữ tiền tố GT% làm dự phòng).
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_loai text DEFAULT 'tu_luyen'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end);
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  v_n integer := 10; -- so cau can sinh: 10 mac dinh (tu_luyen, htd_luyen); htd_test doi theo do kho ben duoi
  v_muc_do smallint;
  v_fallback text[];
  v_c text;
  i integer;
begin
  if p_loai not in ('tu_luyen', 'htd_luyen', 'htd_test') then
    raise exception 'tu_luyen_chu_de_sinh: loai % không hợp lệ', p_loai;
  end if;
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  -- Thùy 21-22/09: số câu bài TEST "Học từ đầu" theo ĐỘ KHÓ CỦA DẠNG (không đụng tu_luyen/htd_luyen).
  if p_loai = 'htd_test' then
    v_muc_do := public._kho_muc_do_dang(p_mon, p_ma_dang);
    v_n := case when coalesce(v_muc_do, 3) >= 4 then 3 else 5 end;
  end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_loai, p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..v_n loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1 and lan_thu > $6 - 10)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select ma_cau from tu_luyen_dang_lan
            where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    end if;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch;
    end if;

    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  -- Thùy 21-22/09: dạng KHÔNG có MCQ (v_ok_count=0) + đang ở Học từ đầu → hiện đề THẬT (bất kỳ loại
  -- câu), KHÔNG chặn cứng nữa. App HS render read-only khi câu không phải trắc nghiệm; TA chấm ĐCS.
  -- Tự luyện thường (p_loai='tu_luyen') KHÔNG rơi vào đây — vẫn báo lỗi như cũ (ngoài phạm vi).
  if v_ok_count = 0 and p_loai in ('htd_luyen', 'htd_test') then
    v_fallback := public._htd_chon_cau_bat_ky(v_cautbl, p_ma_dang, '{}', v_n);
    v_thu_tu := 0;
    foreach v_c in array v_fallback loop
      v_thu_tu := v_thu_tu + 1;
      perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_c, v_thu_tu, null);
      v_ok_count := v_ok_count + 1;
    end loop;
  end if;

  if v_ok_count = 0 then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$
;

-- ⑦ htd_ly_thuyet(p_mon text, p_ma_dang text): nhánh = _kho_nhanh_cua_dang (giữ tiền tố GT% làm dự phòng).
CREATE OR REPLACE FUNCTION public.htd_ly_thuyet(p_mon text, p_ma_dang text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_row record;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  execute format($q$select noi_dung, file_url from %1$I where ma_dang = $1$q$, v_lttbl) into v_row using p_ma_dang;

  insert into hoc_tu_dau_dang (hoc_sinh_id, mon, ma_dang, doc_ly_thuyet_at)
    values (v_hs, p_mon, p_ma_dang, now())
    on conflict (hoc_sinh_id, mon, ma_dang) do update set doc_ly_thuyet_at = now();

  return jsonb_build_object('noi_dung', coalesce(v_row.noi_dung, ''), 'file_url', v_row.file_url);
end $function$
;

-- ⑧ tu_luyen_sinh (cũng là lõi của thu_thach_sinh): bảng câu theo nhánh TỪNG dạng.
CREATE OR REPLACE FUNCTION public.tu_luyen_sinh(p_mon text, p_dangs jsonb, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  v_nh text;
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
    -- 29/09: client (tuluyen.ts / thu_thach_sinh) KHÔNG truyền p_nhanh mà rút dạng từ MỌI nhánh ⇒ bảng câu theo
    -- nhánh của CHÍNH dạng này (Đại/KHTN: null ⇒ bảng gốc như cũ). Trước đây dạng Hình/HGT tra dai_cau_hoi ⇒ bị bỏ qua.
    if p_nhanh is null then
      v_nh := public._kho_nhanh_cua_dang(p_mon, v_ma_dang);
      v_cautbl := public._kho_cau_tbl(p_mon, v_nh);
      v_lttbl := public._kho_lt_tbl(p_mon, v_nh);
      v_dk := public._kho_dk_online_hs_sql(v_cautbl);
      v_ftbl := public._kho_form_tn_cua(v_cautbl);
      v_uu_tien := case when v_ftbl is null then '' else format('(exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)) desc, ', v_ftbl) end;
    end if;
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
end $function$
;

-- ⑨ hs_dang_evals (app HS: tự luyện, thử thách, rank): Bài Hình học có tên + nhãn "Hình học" (Bài không có chuyên đề).
CREATE OR REPLACE FUNCTION public.hs_dang_evals(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_out jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  if p_mon = 'KHTN' then
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src, bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join khtn_ban_do bd on bd.ma_dang = p.ma_dang
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'KHTN' or l.mon is null)

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join khtn_ban_do bd on bd.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'KHTN'
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt', bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join khtn_ban_do bd on bd.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = v_hs and tl.mon = 'KHTN'
    ) x;
  else
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src,
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang) as ten_dang,
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end) as ten_chuyen_de,
             coalesce(bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do) as muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = p.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = p.ma_dang
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = p.ma_dang
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'Toán' or l.mon is null)

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do)
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = bc.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = bc.ma_dang
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = bc.ma_dang
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'Toán'
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt',
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do)
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = bg.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = bg.ma_dang
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = bg.ma_dang
      where tl.hoc_sinh_id = v_hs and tl.mon = 'Toán'
    ) x;
  end if;
  return v_out;
end $function$
;

-- ⑩ Tự kiểm — nhắm THẲNG vào lỗi đang sửa; sai là raise ⇒ cả migration rollback.
do $v$
declare v_hh text; v_hgt text; v_dai text;
begin
  select ma_bai into v_hh from hinh_hoc_bai order by ma_bai limit 1;
  select ma_dang into v_hgt from hgt_ban_do order by ma_dang limit 1;
  select ma_dang into v_dai from dai_ban_do order by ma_dang limit 1;
  if public._kho_cau_tbl('Toán', 'hinh_hoc') <> 'hinh_hoc_cau_hoi'
     or public._kho_ban_do_tbl('Toán', 'hinh_hoc') <> 'hinh_hoc_bai'
     or public._kho_lt_tbl('Toán', 'hinh_hoc') <> 'hinh_hoc_bai_ly_thuyet' then raise exception 'dispatch hinh_hoc sai'; end if;
  if public._kho_cau_tbl('Toán', null) <> 'dai_cau_hoi' or public._kho_cau_tbl('Toán', 'hinh_gt') <> 'hgt_cau_hoi'
     or public._kho_cau_tbl('KHTN', 'hinh_hoc') <> 'khtn_cau_hoi' then raise exception 'dispatch Đại/HGT/KHTN bị đổi'; end if;
  if public._kho_nhanh_cua_dang('Toán', v_hh) is distinct from 'hinh_hoc' then raise exception 'không dò được nhánh Bài %', v_hh; end if;
  if public._kho_nhanh_cua_dang('Toán', v_hgt) is distinct from 'hinh_gt' then raise exception 'HGT % mất nhánh', v_hgt; end if;
  if public._kho_nhanh_cua_dang('Toán', v_dai) is not null then raise exception 'dạng Đại % bị gán nhánh', v_dai; end if;
  if public._kho_nhanh_cua_dang('KHTN', v_hh) is not null then raise exception 'KHTN không được có nhánh'; end if;
  if public._kho_ten_dang('Toán', v_hh) is null then raise exception '_kho_ten_dang chưa ra tên Bài %', v_hh; end if;
  if public._kho_ten_dang('Toán', v_hgt) is null then raise exception '_kho_ten_dang chưa ra tên HGT %', v_hgt; end if;
  if public._troly_ten_dang(v_hh) is null then raise exception '_troly_ten_dang chưa ra tên Bài %', v_hh; end if;
  perform 1 from hinh_hoc_bai_ly_thuyet where ma_dang is distinct from ma_bai;
  if found then raise exception 'alias ma_dang lý thuyết sai'; end if;
  if (select prosrc from pg_proc where proname = 'tu_luyen_sinh' and pronamespace = 'public'::regnamespace) not like '%_kho_nhanh_cua_dang(p_mon, v_ma_dang)%'
    then raise exception 'tu_luyen_sinh chưa theo nhánh từng dạng'; end if;
  if exists (select 1 from pg_proc where pronamespace = 'public'::regnamespace and proname in ('tu_luyen_chu_de_sinh', 'htd_ly_thuyet')
             and prosrc not like '%_kho_nhanh_cua_dang(p_mon, p_ma_dang)%') then raise exception 'còn hàm đoán nhánh bằng tiền tố'; end if;
  if exists (select 1 from pg_proc where pronamespace = 'public'::regnamespace and proname in ('fn_nhiem_vu_hoan_thanh', 'fn_thanh_tuu_thang')
             and prosrc not like '%''hinh_hoc''%') then raise exception 'nhiệm vụ/thành tựu chưa gồm Hình học'; end if;
  if (select prosrc from pg_proc where proname = 'hs_dang_evals' and pronamespace = 'public'::regnamespace) not like '%bd_hh.ten_dang%'
    then raise exception 'hs_dang_evals chưa join hinh_hoc_bai'; end if;
end $v$;
