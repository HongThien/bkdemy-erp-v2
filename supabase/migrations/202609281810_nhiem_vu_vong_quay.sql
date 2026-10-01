-- ============================================================================
-- 202609281810 — nhiem_vu_vong_quay
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Gamification HS phase 1 (spec-thanh-tuu-nhiem-vu.md §0.4–0.6, de-xuat-nhiem-vu.md — Thùy chốt 28/09):
--   NHIỆM VỤ theo môn (ngày N1–N3 · tuần T1–T4 · rương tuần · tháng M1–M2) → Điểm Chặng → chặng 30 cấp → EXP (KHÔNG cộng Điểm Rank).
--   VÒNG QUAY: lượt = xong ≥ 2 nhiệm vụ ngày của môn; giải 20/30/50/100/200 EXP (40/35/18/6/1%); EXP này ĐỔI RA XU (trần app 30/tháng/môn
--   nằm ở fn_gami_exp_xu_thang — file SQL Editor riêng 202609281811, hàm đó owner postgres).
--
--   Thiết kế (tự quyết kỹ thuật, ghi rõ để Thùy bác nếu lệch):
--   - SUY ĐỘNG hoàn toàn (§1.5/§4): không bảng nhiệm vụ, không dòng chờ, không nút "nhận thưởng". Hoàn thành = suy từ bảng đo
--     (thu_thach_luot · bai_lam_cau tự luyện · gami_grades · btvn_ket_qua · MT · mastery). EXP nhiệm vụ = hàm, chốt xu tháng đọc hàm.
--   - "Sống 3 ngày" = mỗi ngày mở 1 nhiệm vụ mỗi loại, chưa làm thì treo tối đa 3 ngày (cả hôm nay). 1 lần làm CHỈ xong 1 nhiệm vụ,
--     lấp nhiệm vụ CŨ NHẤT còn treo (chống 1 lượt Thử thách ăn 3 ngày cùng lúc). Xếp từ ngày mở (bat_dau) để khớp qua ranh tháng.
--   - Tuần = 4 khối cố định 1–7 · 8–14 · 15–21 · 22–cuối tháng ⇒ đúng 4 rương/tháng = ngân sách 4 × 75 EXP. T2–T4 chưa xong
--     thì dồn tới hết tháng (1 lần làm lấp tuần cũ nhất còn treo); T1 (BTVN đúng hẹn cả tuần) gắn với chính tuần đó.
--   - T4 "lấp 1 lỗ" = dạng YẾU lúc đầu tháng mà tới cuối tuần ĐẠT (độ tin ≥ tb), mastery tính-đến-ngày (mig 202609281809).
--     Dạng lọc theo bản đồ của môn qua registry _kho_ban_do_tbl (§1.6 — không if môn).
--   - Mở từ nhiem_vu_cau_hinh.bat_dau (Toán 01/10/2026). Trước ngày đó vòng quay chạy LUẬT CŨ (tự luyện ≥ 70%, EXP không thành xu).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không. Thêm bảng/hàm; thay thân fn_may_man_hs_du_dieu_kien / fn_may_man_hs_quay / fn_may_man_hs_cua_toi (cùng chữ ký) — nhánh
--   trước bat_dau giữ NGUYÊN luật cũ. Thêm 6 dòng cấu hình may_man_hs_cau_hinh (khoá nv_*), không sửa dòng cũ.
-- ============================================================================

-- ---------- 1. Cấu hình theo môn ----------
create table if not exists nhiem_vu_cau_hinh (
  mon           text primary key,
  bat           boolean not null default false,
  bat_dau       date not null,
  song_ngay     integer not null,   -- nhiệm vụ ngày treo tối đa N ngày
  n2_cau        integer not null,   -- N2: số câu đúng trên app
  n3_cau        integer not null,   -- N3: số câu sửa sai
  n3_cua_so     integer not null,   -- N3: dạng từng sai trong N ngày trước
  t3_ngay       integer not null,   -- T3: số ngày pass Thử thách
  m1_top_pct    numeric not null,   -- M1: hoặc top x% khối
  m2_ngay       integer not null,   -- M2: số ngày pass Thử thách trong tháng
  diem_ngay     integer not null, diem_tuan integer not null, diem_ruong integer not null, diem_thang integer not null,
  ruong_can     integer not null,   -- số nhiệm vụ / tuần để mở rương
  ruong_exp     integer not null,
  cap_diem      integer not null,   -- Điểm Chặng / cấp
  cap_max       integer not null,
  exp_cap       integer not null,
  moc           jsonb not null,     -- [[cấp, EXP thưởng thêm], …]
  vq_can        integer not null,   -- vòng quay: số nhiệm vụ ngày xong trong hôm nay
  tran_xu_app   integer not null    -- trần xu từ app / tháng / môn (đọc ở fn_gami_exp_xu_thang)
);
comment on table nhiem_vu_cau_hinh is 'Bộ số Nhiệm vụ + Vòng quay + trần xu app theo môn (de-xuat-nhiem-vu.md, Thùy chốt 28/09). bat_dau = ngày mở.';
insert into nhiem_vu_cau_hinh values
  ('Toán', true,  date '2026-10-01', 3, 20, 2, 14, 4, 0.3, 15, 10, 40, 60, 150, 12, 75, 50, 30, 25, '[[10,100],[20,150],[30,200]]', 2, 30),
  ('KHTN', false, date '2026-10-01', 3, 20, 2, 14, 4, 0.3, 15, 10, 40, 60, 150, 12, 75, 50, 30, 25, '[[10,100],[20,150],[30,200]]', 2, 30)
on conflict do nothing;
alter table nhiem_vu_cau_hinh enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'nhiem_vu_cau_hinh' and policyname = 'nhiem_vu_cau_hinh_member_all') then
    create policy nhiem_vu_cau_hinh_member_all on nhiem_vu_cau_hinh for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
  end if;
end $$;

insert into may_man_hs_cau_hinh (ma, gia_tri, mo_ta) values
  ('nv_ti_le_20', 40, '% trúng 20 EXP (luật nhiệm vụ, từ nhiem_vu_cau_hinh.bat_dau)'),
  ('nv_ti_le_30', 35, '% trúng 30 EXP (luật nhiệm vụ)'),
  ('nv_ti_le_50', 18, '% trúng 50 EXP (luật nhiệm vụ)'),
  ('nv_ti_le_100', 6, '% trúng 100 EXP (luật nhiệm vụ)'),
  ('nv_ti_le_200', 1, '% trúng 200 EXP — jackpot (luật nhiệm vụ)')
on conflict (ma) do nothing;

-- ---------- 2. Xếp "1 lần làm lấp 1 nhiệm vụ cũ nhất còn treo" ----------
-- p_mo[i] = số nhiệm vụ mở ngày i · p_units[i] = số lần làm hợp lệ ngày i · p_cap = số nhiệm vụ treo tối đa (nhiệm vụ cũ hơn tự hết hạn).
create or replace function public._nv_xep(p_mo integer[], p_units integer[], p_cap integer) returns integer[]
language plpgsql immutable as $$
declare k integer := 0; f integer; outp integer[] := '{}'; i integer;
begin
  for i in 1 .. coalesce(array_length(p_mo, 1), 0) loop
    k := least(k + p_mo[i], p_cap);
    f := least(coalesce(p_units[i], 0), k);
    k := k - f;
    outp := outp || f;
  end loop;
  return outp;
end $$;

create or replace function public._nv_con_mo(p_mo integer[], p_units integer[], p_cap integer) returns integer
language plpgsql immutable as $$
declare k integer := 0; i integer;
begin
  for i in 1 .. coalesce(array_length(p_mo, 1), 0) loop
    k := least(k + p_mo[i], p_cap);
    k := k - least(coalesce(p_units[i], 0), k);
  end loop;
  return k;
end $$;

-- ---------- 3. Nhiệm vụ đã xong trong tháng (nguồn DUY NHẤT) ----------
-- tang: 'ngay' · 'tuan' · 'thang' · 'ruong' = nhiệm vụ xong (so = số cái, xong_ngay = ngày làm) ;
--       'con_mo' = số nhiệm vụ còn treo tới hôm nay (N1–N3, T2–T4) ; 'tien_do' = số liệu thô (N1/N2/N3 hôm nay, M2 = ngày pass trong tháng).
create or replace function public.fn_nhiem_vu_hoan_thanh(p_mon text, p_ym text, p_hs uuid[] default null)
returns table(hoc_sinh_id uuid, ma text, tang text, xong_ngay date, so integer)
language plpgsql stable as $$
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
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt')) into v_dangs;

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
end $$;
comment on function public.fn_nhiem_vu_hoan_thanh(text, text, uuid[]) is 'Nhiệm vụ của môn trong tháng, SUY ĐỘNG: nhiệm vụ đã xong (ngay/tuan/thang/ruong), còn treo (con_mo), tiến độ thô (tien_do). Nguồn DUY NHẤT cho chặng, EXP nhiệm vụ, lượt vòng quay.';

-- ---------- 4. Chặng tháng + EXP nhiệm vụ ----------
create or replace function public.fn_nhiem_vu_chang_thang(p_mon text, p_ym text, p_hs uuid[] default null)
returns table(hoc_sinh_id uuid, diem_chang integer, cap integer, so_ruong integer, exp integer)
language sql stable as $$
  with c as (select * from nhiem_vu_cau_hinh where mon = p_mon and bat),
  x as (
    select h.hoc_sinh_id,
           sum(h.so * case h.tang when 'ngay' then c.diem_ngay when 'tuan' then c.diem_tuan
                                  when 'ruong' then c.diem_ruong when 'thang' then c.diem_thang end)::int as diem,
           coalesce(sum(h.so) filter (where h.tang = 'ruong'), 0)::int as ruong
    from public.fn_nhiem_vu_hoan_thanh(p_mon, p_ym, p_hs) h cross join c
    where h.tang in ('ngay', 'tuan', 'ruong', 'thang')
    group by h.hoc_sinh_id
  )
  select x.hoc_sinh_id, x.diem, least(c.cap_max, x.diem / c.cap_diem)::int, x.ruong,
         (least(c.cap_max, x.diem / c.cap_diem) * c.exp_cap
          + coalesce((select sum((m->>1)::int) from jsonb_array_elements(c.moc) m where least(c.cap_max, x.diem / c.cap_diem) >= (m->>0)::int), 0)
          + x.ruong * c.ruong_exp)::int
  from x cross join c
$$;

-- ---------- 5. EXP trên app theo tháng (đầu vào trần xu app) ----------
create or replace function public.fn_exp_app_thang(p_ym text, p_hs uuid default null, p_mon text default null)
returns table(hoc_sinh_id uuid, mon text, exp_nhiem_vu integer, exp_may_man integer, exp_app integer)
language plpgsql stable as $$
declare c record;
begin
  for c in select n.* from nhiem_vu_cau_hinh n where n.bat and (p_mon is null or n.mon = p_mon) loop
    return query
    with nv as (
      select n.hoc_sinh_id, n.exp from public.fn_nhiem_vu_chang_thang(c.mon, p_ym, case when p_hs is null then null else array[p_hs] end) n
    ), mm as (
      select m.hoc_sinh_id, sum(m.exp)::int as exp from may_man_hs_luot m
      where m.mon = c.mon and m.ngay >= c.bat_dau and to_char(m.ngay, 'YYYY-MM') = p_ym and (p_hs is null or m.hoc_sinh_id = p_hs)
      group by 1
    )
    select coalesce(nv.hoc_sinh_id, mm.hoc_sinh_id), c.mon, coalesce(nv.exp, 0), coalesce(mm.exp, 0), coalesce(nv.exp, 0) + coalesce(mm.exp, 0)
    from nv full join mm on mm.hoc_sinh_id = nv.hoc_sinh_id
    where coalesce(nv.exp, 0) + coalesce(mm.exp, 0) > 0;
  end loop;
end $$;
comment on function public.fn_exp_app_thang(text, uuid, text) is 'EXP kiếm trên app trong tháng theo môn (nhiệm vụ + vòng quay từ ngày mở). fn_gami_exp_xu_thang đổi ra xu với trần tran_xu_app. Thành tựu thêm vào đây khi build.';

-- ---------- 6. Vòng quay: điều kiện + quay + màn ----------
create or replace function public.fn_may_man_hs_du_dieu_kien(p_hs uuid default null) returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_me uuid := coalesce(p_hs, public.my_hoc_sinh_id());
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_nguong numeric; v_row record; c record; v_so integer; v_max integer := 0; v_can integer;
begin
  if v_me is null then return jsonb_build_object('du', false); end if;
  -- LUẬT MỚI (từ bat_dau của môn): xong ≥ vq_can nhiệm vụ ngày hôm nay của môn đó
  for c in select n.* from nhiem_vu_cau_hinh n
           where n.bat and n.bat_dau <= v_today
             and exists (select 1 from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                         where hl.hoc_sinh_id = v_me and hl.trang_thai = 'dang_hoc' and l.mon = n.mon)
           order by n.mon loop
    v_can := c.vq_can;
    select coalesce(sum(h.so), 0)::int into v_so from public.fn_nhiem_vu_hoan_thanh(c.mon, to_char(v_today, 'YYYY-MM'), array[v_me]) h
      where h.tang = 'ngay' and h.xong_ngay = v_today;
    if v_so >= c.vq_can then
      return jsonb_build_object('du', true, 'che_do', 'nhiem_vu', 'mon', c.mon, 'so_nv', v_so, 'can', c.vq_can);
    end if;
    v_max := greatest(v_max, v_so);
  end loop;
  if v_can is not null then
    return jsonb_build_object('du', false, 'che_do', 'nhiem_vu', 'so_nv', v_max, 'can', v_can);
  end if;
  -- LUẬT CŨ (trước ngày mở) — giữ nguyên
  select gia_tri into v_nguong from may_man_hs_cau_hinh where ma = 'nguong_dung_pct';
  v_nguong := coalesce(v_nguong, 70);
  select bl.id as bai_lam_id, bt.mon,
         (select count(*) from bai_lam_cau blc where blc.bai_lam_id = bl.id and blc.verdict = 'correct')::int as so_dung,
         bt.so_cau
    into v_row
    from bai_lam bl
    join bai_test bt on bt.id = bl.bai_test_id
    where bl.hoc_sinh_id = v_me
      and bt.loai = 'tu_luyen'
      and bl.trang_thai = 'da_nop'
      and bt.ngay = v_today
      and bt.so_cau > 0
      and (select count(*) from bai_lam_cau blc2 where blc2.bai_lam_id = bl.id and blc2.verdict = 'correct')::numeric * 100.0
          >= v_nguong * bt.so_cau
    order by bl.nop_at asc nulls last, bl.bat_dau_at asc
    limit 1;
  if v_row.bai_lam_id is null then
    return jsonb_build_object('du', false, 'nguong_pct', v_nguong);
  end if;
  return jsonb_build_object(
    'du', true, 'nguong_pct', v_nguong,
    'bai_lam_id', v_row.bai_lam_id, 'mon', v_row.mon,
    'so_dung', v_row.so_dung, 'so_cau', v_row.so_cau
  );
end $$;

create or replace function public.fn_may_man_hs_quay() returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_active numeric;
  p50 numeric; p100 numeric; p150 numeric; p200 numeric;
  q20 numeric; q30 numeric; q50 numeric; q100 numeric; q200 numeric;
  v_dk jsonb; v_bl_id uuid; v_mon text;
  v_rnd numeric; v_exp integer;
  l may_man_hs_luot;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;
  perform pg_advisory_xact_lock(hashtext('maymai_hs:' || v_me::text));
  select gia_tri into v_active from may_man_hs_cau_hinh where ma = 'active';
  if coalesce(v_active, 0) <> 1 then raise exception 'Vòng quay đang tạm đóng.'; end if;
  if exists (select 1 from may_man_hs_luot where hoc_sinh_id = v_me and ngay = v_today) then
    raise exception 'Hôm nay em đã quay rồi — mai quay tiếp nhé!'; end if;
  v_dk := public.fn_may_man_hs_du_dieu_kien(v_me);
  if not coalesce((v_dk->>'du')::boolean, false) then
    if v_dk->>'che_do' = 'nhiem_vu' then
      raise exception 'Xong % nhiệm vụ ngày hôm nay là được quay (em đang xong %).', v_dk->>'can', coalesce(v_dk->>'so_nv', '0');
    end if;
    raise exception 'Can lam 1 luot tu luyen 10 cau dung >= % phan tram de quay.', coalesce((v_dk->>'nguong_pct')::int, 70);
  end if;
  v_bl_id := (v_dk->>'bai_lam_id')::uuid;
  v_mon := v_dk->>'mon';
  v_rnd := random() * 100;
  if v_dk->>'che_do' = 'nhiem_vu' then
    select gia_tri into q20 from may_man_hs_cau_hinh where ma = 'nv_ti_le_20';
    select gia_tri into q30 from may_man_hs_cau_hinh where ma = 'nv_ti_le_30';
    select gia_tri into q50 from may_man_hs_cau_hinh where ma = 'nv_ti_le_50';
    select gia_tri into q100 from may_man_hs_cau_hinh where ma = 'nv_ti_le_100';
    select gia_tri into q200 from may_man_hs_cau_hinh where ma = 'nv_ti_le_200';
    -- giải hiếm xét trước; phần còn lại → 20
    v_exp := case
      when v_rnd < q200                     then 200
      when v_rnd < q200 + q100              then 100
      when v_rnd < q200 + q100 + q50        then 50
      when v_rnd < q200 + q100 + q50 + q30  then 30
      else                                       20
    end;
  else
    select gia_tri into p50  from may_man_hs_cau_hinh where ma = 'ti_le_50';
    select gia_tri into p100 from may_man_hs_cau_hinh where ma = 'ti_le_100';
    select gia_tri into p150 from may_man_hs_cau_hinh where ma = 'ti_le_150';
    select gia_tri into p200 from may_man_hs_cau_hinh where ma = 'ti_le_200';
    v_exp := case
      when v_rnd < p200                       then 200
      when v_rnd < p200 + p150                then 150
      when v_rnd < p200 + p150 + p100         then 100
      else                                          50
    end;
  end if;
  insert into may_man_hs_luot (hoc_sinh_id, ngay, exp, rnd, mon, bai_lam_id)
    values (v_me, v_today, v_exp, v_rnd, v_mon, v_bl_id)
    returning * into l;
  return jsonb_build_object('id', l.id, 'ngay', l.ngay, 'exp', l.exp, 'mon', l.mon);
end $$;

create or replace function public.fn_may_man_hs_cua_toi() returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_dau date; v_cuoi date;
  v_hom_nay jsonb; v_thang integer; v_ls jsonb; v_dk jsonb; v_active numeric; v_moi boolean;
begin
  if v_me is null then raise exception 'Không xác định được học sinh.'; end if;
  v_dau := date_trunc('month', v_today)::date;
  v_cuoi := (v_dau + interval '1 month')::date;
  select to_jsonb(x) into v_hom_nay from (
    select exp, mon, created_at from may_man_hs_luot where hoc_sinh_id = v_me and ngay = v_today
  ) x;
  select coalesce(sum(exp), 0)::int into v_thang
    from may_man_hs_luot where hoc_sinh_id = v_me and ngay >= v_dau and ngay < v_cuoi;
  select coalesce(jsonb_agg(jsonb_build_object('ngay', ngay, 'exp', exp, 'mon', mon, 'created_at', created_at) order by created_at desc), '[]'::jsonb)
    into v_ls
    from (select * from may_man_hs_luot where hoc_sinh_id = v_me order by created_at desc limit 10) t;
  v_dk := public.fn_may_man_hs_du_dieu_kien(v_me);
  v_moi := v_dk->>'che_do' = 'nhiem_vu';
  select gia_tri into v_active from may_man_hs_cau_hinh where ma = 'active';
  return jsonb_build_object(
    'ngay', v_today,
    'active', coalesce(v_active, 0) = 1,
    'hom_nay', v_hom_nay,
    'exp_thang', v_thang,
    'du_dieu_kien', v_dk,
    'che_do', case when v_moi then 'nhiem_vu' else 'tu_luyen' end,
    -- khoá giữ dạng 'ti_le_<exp>' như cũ để màn đọc chung 1 kiểu
    'ti_le', (select jsonb_object_agg(case when v_moi then substr(ma, 4) else ma end, gia_tri) from may_man_hs_cau_hinh
              where ma like case when v_moi then 'nv\_ti\_le\_%' else 'ti\_le\_%' end),
    'lich_su', v_ls
  );
end $$;

-- ---------- 7. App HS: bảng nhiệm vụ của tôi ----------
create or replace function public.fn_hs_nhiem_vu_cua_toi(p_mon text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_ym text := to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM');
  c record; ch record; v_w integer;
begin
  if v_hs is null then return null; end if;
  select * into c from nhiem_vu_cau_hinh where mon = p_mon and bat;
  if c.mon is null then return null; end if;
  if v_today < c.bat_dau then
    return jsonb_build_object('mon', p_mon, 'mo', false, 'bat_dau', c.bat_dau);
  end if;
  v_w := least(4, (extract(day from v_today)::int - 1) / 7 + 1);
  create temp table _nv on commit drop as select * from public.fn_nhiem_vu_hoan_thanh(p_mon, v_ym, array[v_hs]);
  select * into ch from public.fn_nhiem_vu_chang_thang(p_mon, v_ym, array[v_hs]);
  return (
    select jsonb_build_object(
      'mon', p_mon, 'mo', true, 'thang', v_ym, 'tuan', v_w,
      'cau_hinh', jsonb_build_object('song_ngay', c.song_ngay, 'n2_cau', c.n2_cau, 'n3_cau', c.n3_cau, 't3_ngay', c.t3_ngay,
                   'm2_ngay', c.m2_ngay, 'ruong_can', c.ruong_can, 'ruong_exp', c.ruong_exp, 'cap_diem', c.cap_diem, 'cap_max', c.cap_max,
                   'exp_cap', c.exp_cap, 'moc', c.moc, 'vq_can', c.vq_can, 'diem_ngay', c.diem_ngay, 'diem_tuan', c.diem_tuan, 'diem_thang', c.diem_thang),
      'ngay', (select jsonb_object_agg(m, jsonb_build_object(
                 'xong_hom_nay', coalesce((select sum(so) from _nv where ma = m and tang = 'ngay' and xong_ngay = v_today), 0),
                 'con_mo', coalesce((select sum(so) from _nv where ma = m and tang = 'con_mo'), 0),
                 'tien_do', coalesce((select sum(so) from _nv where ma = m and tang = 'tien_do'), 0),
                 'xong_thang', coalesce((select sum(so) from _nv where ma = m and tang = 'ngay'), 0)))
               from unnest(array['N1', 'N2', 'N3']) m),
      'tuan_nv', (select jsonb_object_agg(m, jsonb_build_object(
                 'xong_tuan_nay', coalesce((select sum(so) from _nv where ma = m and tang = 'tuan'
                                           and least(4, (extract(day from xong_ngay)::int - 1) / 7 + 1) = v_w), 0),
                 'con_mo', coalesce((select sum(so) from _nv where ma = m and tang = 'con_mo'), 0),
                 'xong_thang', coalesce((select sum(so) from _nv where ma = m and tang = 'tuan'), 0)))
               from unnest(array['T1', 'T2', 'T3', 'T4']) m),
      'thang_nv', jsonb_build_object(
                 'M1', exists (select 1 from _nv where ma = 'M1' and tang = 'thang'),
                 'M2', exists (select 1 from _nv where ma = 'M2' and tang = 'thang'),
                 'ngay_pass', coalesce((select sum(so) from _nv where ma = 'M2' and tang = 'tien_do'), 0)),
      'ruong', (select jsonb_agg(jsonb_build_object('tuan', w,
                 'so_nv', coalesce((select sum(so) from _nv where tang in ('ngay', 'tuan', 'thang')
                                   and least(4, (extract(day from xong_ngay)::int - 1) / 7 + 1) = w), 0),
                 'mo', exists (select 1 from _nv where tang = 'ruong' and least(4, (extract(day from xong_ngay)::int - 1) / 7 + 1) = w)) order by w)
               from generate_series(1, 4) w),
      'chang', jsonb_build_object('diem', coalesce(ch.diem_chang, 0), 'cap', coalesce(ch.cap, 0), 'exp', coalesce(ch.exp, 0), 'so_ruong', coalesce(ch.so_ruong, 0)),
      'vong_quay', jsonb_build_object('xong_hom_nay', coalesce((select sum(so) from _nv where tang = 'ngay' and xong_ngay = v_today), 0),
                                      'can', c.vq_can)
    ));
end $$;

-- ---------- 8. Quyền ----------
revoke all on function public._nv_xep(integer[], integer[], integer), public._nv_con_mo(integer[], integer[], integer),
  public.fn_nhiem_vu_hoan_thanh(text, text, uuid[]), public.fn_nhiem_vu_chang_thang(text, text, uuid[]),
  public.fn_exp_app_thang(text, uuid, text), public.fn_hs_nhiem_vu_cua_toi(text),
  public.fn_may_man_hs_du_dieu_kien(uuid), public.fn_may_man_hs_quay(), public.fn_may_man_hs_cua_toi() from public, anon;
grant execute on function public._nv_xep(integer[], integer[], integer), public._nv_con_mo(integer[], integer[], integer),
  public.fn_nhiem_vu_hoan_thanh(text, text, uuid[]), public.fn_nhiem_vu_chang_thang(text, text, uuid[]),
  public.fn_exp_app_thang(text, uuid, text), public.fn_hs_nhiem_vu_cua_toi(text),
  public.fn_may_man_hs_du_dieu_kien(uuid), public.fn_may_man_hs_quay(), public.fn_may_man_hs_cua_toi() to authenticated;
