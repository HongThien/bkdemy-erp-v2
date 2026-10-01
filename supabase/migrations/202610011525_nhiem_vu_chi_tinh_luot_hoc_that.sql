-- ============================================================================
-- NHIỆM VỤ CHỈ TÍNH "LƯỢT HỌC THẬT" (spec-v1-app-hs.md §2, Thùy 01/10) — lượt bấm bừa / làm quá nhanh không ăn nhiệm vụ.
--   1. Luật gom về MỘT nơi: _luot_tinh(hs[], từ, đến) (≥5 câu · đúng ≥50% · TB ≥6 s/câu — ngưỡng ở _luot_hoc_that_nguong()).
--      _luot_hoc_that(hs, …) (mig 202610011501) viết lại bằng _luot_tinh ⇒ chuỗi, nhiệm vụ, cổng game dùng chung, không có 2 bản công thức (§2.0).
--   2. fn_nhiem_vu_hoan_thanh (nguồn của fn_hs_nhiem_vu_cua_toi, vòng quay, Chặng): N2 "Luyện 20 câu" chỉ đếm câu đúng MỚI trong lượt tính;
--      N3 "Sửa sai" chỉ trong lượt tính; N1 + T3 + M2 (Thử thách) chỉ khi lượt được tính; tiến độ trong ngày theo cùng luật.
--      ĐIỂM RANK của Thử thách (trg_thu_thach_nop) KHÔNG đổi ở đây — chờ Thùy quyết (đụng bảng xếp hạng).
-- Thân hàm lấy NGUYÊN bản đang chạy (pg_get_functiondef 01/10), chỉ sửa các đoạn trên.
-- ============================================================================

create or replace function public._luot_tinh(p_hs uuid[], p_tu timestamptz, p_den timestamptz)
returns table (bai_lam_id uuid, hoc_sinh_id uuid, mon text, nop_at timestamptz, so_cau integer, dung integer, giay_tb numeric, tinh boolean, ly_do text)
language sql stable as $$
  with ng as (select public._luot_hoc_that_nguong() j),
  l as (
    select bl.id, bl.hoc_sinh_id, bt.mon, bl.nop_at, bl.bat_dau_at
    from public.bai_lam bl join public.bai_test bt on bt.id = bl.bai_test_id
    where bl.hoc_sinh_id = any(p_hs) and bl.trang_thai = 'da_nop' and bt.loai = 'tu_luyen'
      and bl.nop_at >= p_tu and bl.nop_at < p_den
  ),
  c as (
    select l.id, count(*)::int as so_cau, count(*) filter (where blc.verdict = 'correct')::int as dung,
           extract(epoch from max(blc.cham_at) - l.bat_dau_at) / nullif(count(*), 0) as giay_tb
    from l join public.bai_lam_cau blc on blc.bai_lam_id = l.id
    group by l.id, l.bat_dau_at
  )
  select l.id, l.hoc_sinh_id, l.mon, l.nop_at, c.so_cau, c.dung, round(c.giay_tb::numeric, 1),
    (c.so_cau >= (ng.j->>'so_cau_toi_thieu')::int
      and c.dung >= ceil(c.so_cau * (ng.j->>'ti_le_dung')::numeric)
      and c.giay_tb >= (ng.j->>'giay_tb_toi_thieu')::numeric),
    case
      when c.so_cau < (ng.j->>'so_cau_toi_thieu')::int then 'it_cau'
      when c.dung < ceil(c.so_cau * (ng.j->>'ti_le_dung')::numeric) then 'duoi_nguong'
      when c.giay_tb < (ng.j->>'giay_tb_toi_thieu')::numeric then 'qua_nhanh'
    end
  from l join c on c.id = l.id cross join ng
$$;

-- _luot_hoc_that: giữ NGUYÊN chữ ký + cột trả về, lấy luật từ _luot_tinh; thêm dung_moi + cờ Thử thách.
create or replace function public._luot_hoc_that(p_hs uuid, p_tu timestamptz, p_den timestamptz)
returns table (
  bai_lam_id uuid, mon text, nop_at timestamptz, ngay date, thu_thach boolean,
  so_cau integer, dung integer, dung_moi integer, giay_tb numeric, tinh boolean, ly_do text
)
language sql stable as $$
  select t.bai_lam_id, t.mon, t.nop_at, (t.nop_at at time zone 'Asia/Ho_Chi_Minh')::date, coalesce(bt.thu_thach, false),
         t.so_cau, t.dung,
         (select count(*)::int from public.bai_lam_cau blc
            join public.bai_test_cau tc on tc.id = blc.bai_test_cau_id
            where blc.bai_lam_id = t.bai_lam_id and blc.verdict = 'correct' and not exists (
              select 1 from public.bai_lam bl2
              join public.bai_lam_cau b2 on b2.bai_lam_id = bl2.id
              join public.bai_test_cau t2 on t2.id = b2.bai_test_cau_id
              where bl2.hoc_sinh_id = p_hs and bl2.id <> t.bai_lam_id and t2.ma_cau = tc.ma_cau
                and b2.verdict = 'correct' and b2.cham_at < blc.cham_at)),
         t.giay_tb, t.tinh, t.ly_do
  from public._luot_tinh(array[p_hs], p_tu, p_den) t
  join public.bai_lam bl on bl.id = t.bai_lam_id
  join public.bai_test bt on bt.id = bl.bai_test_id
$$;

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
  -- 01/10 (spec-v1-app-hs §2): nhiệm vụ CHỈ tính lượt học thật (≥5 câu · đúng ≥50% · TB ≥6 s/câu) — nguồn DUY NHẤT _luot_tinh.
  luot_tinh as (
    select t.bai_lam_id from public._luot_tinh(v_hs, (c.bat_dau::timestamp at time zone 'Asia/Ho_Chi_Minh'), ((v_den + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh')) t
    where t.tinh and t.mon = p_mon
  ),
  -- Lần ĐÚNG ĐẦU TIÊN của em với từng câu (mọi bài, mọi thời gian) — N2 chỉ đếm câu đúng "mới" (hết kho thì câu lặp không đếm).
  lan_dung as (
    select blc.id, row_number() over (partition by bl.hoc_sinh_id, coalesce(btc.ma_cau, btc.id::text) order by blc.cham_at, blc.id) as rn
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    where blc.verdict = 'correct' and bl.hoc_sinh_id = any(v_hs)
  ),
  cau_app as (   -- câu làm trên app (tự luyện, gồm Thử thách) của môn, TRONG LƯỢT HỌC THẬT, từ ngày mở
    select bl.hoc_sinh_id as hs, blc.verdict, btc.ma_dang, blc.cham_at as t, (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date as d,
           coalesce(ld.rn, 0) = 1 as moi
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join luot_tinh lt on lt.bai_lam_id = bl.id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    left join lan_dung ld on ld.id = blc.id
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
           where tl.mon = p_mon and tl.pass and tl.hoc_sinh_id = any(v_hs) and tl.ngay between c.bat_dau and v_den
             and tl.bai_lam_id in (select bai_lam_id from luot_tinh)),
  -- ===== NGÀY: đơn vị theo ngày → xếp lấp nhiệm vụ treo =====
  u_ngay as (
    select 'N1'::text as ma, tl.hoc_sinh_id as hs, tl.ngay as d, count(*)::int as n from thu_thach_luot tl
      where tl.mon = p_mon and tl.pass and tl.hoc_sinh_id = any(v_hs) and tl.ngay between c.bat_dau and v_den
        and tl.bai_lam_id in (select bai_lam_id from luot_tinh) group by 2, 3
    union all
    select 'N2', a.hs, a.d, (count(*) / c.n2_cau)::int from cau_app a where a.verdict = 'correct' and a.moi group by 2, 3
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
      -- điểm ET 1 buổi = _et_diem_buoi (nguồn công thức DUY NHẤT, mig 202609291226)
      select e.hoc_sinh_id as hs, e.ngay as d, e.buoi_hoc_id
      from public._et_diem_buoi(greatest(v_ms, c.bat_dau), v_den) e
      where e.mon = p_mon and e.hoc_sinh_id = any(v_hs) and e.ti_le >= 0.8
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
        where p.mon = p_mon and p.pass and p.hoc_sinh_id = any(v_hs) and p.ngay = v_den
          and p.bai_lam_id in (select bai_lam_id from luot_tinh) group by 2
      union all select 'N2', a.hs, count(*)::int from cau_app a where a.verdict = 'correct' and a.moi and a.d = v_den group by 2
      union all select 'N3', s.hs, count(*)::int from sua_sai s where s.d = v_den group by 2
      union all select 'M2', p.hs, count(*)::int from pass p where p.d >= v_ms group by 2
    ) u(ma, hs, n)
  )
  select * from tat_ca
  union all select * from ruong
  union all select * from con_mo
  union all select * from tien_do;
end $function$;

revoke all on function public._luot_tinh(uuid[], timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public._luot_hoc_that(uuid, timestamptz, timestamptz) from public, anon, authenticated;
