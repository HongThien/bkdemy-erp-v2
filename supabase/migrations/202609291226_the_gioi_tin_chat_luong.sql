-- ============================================================================
-- THẾ GIỚI BK — TIN CHẤT LƯỢNG (Thùy 29/09: "Xong 1 bài toán đâu thể là tin tức. Ít nhất phải là hoàn thành ET 9, 10 điểm… thông tin tích cực"
-- · "người ta chỉ lướt 1–2 trang đầu nên phải là tin chất lượng").
--  1) _et_diem_buoi(): điểm ET 1 (HS × buổi) — tách từ nhiệm vụ T2 thành NGUỒN CÔNG THỨC DUY NHẤT (CLAUDE §2.0); fn_nhiem_vu_hoan_thanh
--     dùng lại (định nghĩa lấy nguyên từ DB đang chạy, chỉ thay khúc T2 — kết quả T2 không đổi).
--  2) _the_gioi_tin: BỎ tin "xong N bài" (no_luc) · THÊM ET điểm cao (≥5 câu: 10đ = A, 9–9,5đ = B) · Tự luyện ≥50 câu đúng/ngày (B).
--     Số đo 28 ngày (29/09): ET 1.622 lượt · 663 lượt 10đ (phần lớn ET 1–3 câu) · ET ≥5 câu & 10đ = 140 (~5/ngày) · Thử thách 0 lượt ·
--     btvn_ket_qua.ti_le_dung chưa bao giờ ghi ⇒ chưa dùng làm tin.
--  3) fn_the_gioi_kenh: xếp tin theo tầng S → A → B rồi mới theo giờ.
-- ============================================================================

create or replace function public._et_diem_buoi(p_tu date, p_den date)
returns table (hoc_sinh_id uuid, buoi_hoc_id uuid, ngay date, mon text, lop_id uuid, so_cau int, ti_le numeric, cham_at timestamptz)
language sql stable set search_path = public as $$
  -- điểm ET = trung bình (đúng 1 · đúng một phần 0,5 · sai 0) các câu phase 'et' đã chấm của buổi; buổi huỷ không tính
  select g.hoc_sinh_id, g.buoi_hoc_id, b.ngay, l.mon, b.lop_id, count(*)::int,
         avg(case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end), max(g.graded_at)
  from gami_grades g
  join gami_session_problems sp on sp.id = g.problem_id and sp.phase = 'et'
  join buoi_hoc b on b.id = g.buoi_hoc_id join lop l on l.id = b.lop_id
  where b.ngay between p_tu and p_den and b.trang_thai <> 'huy'
  group by g.hoc_sinh_id, g.buoi_hoc_id, b.ngay, l.mon, b.lop_id
$$;
-- security INVOKER (như khúc T2 cũ chạy trong fn_nhiem_vu_hoan_thanh) ⇒ RLS gami_grades giữ nguyên với người gọi.
revoke execute on function public._et_diem_buoi(date, date) from public, anon;
grant execute on function public._et_diem_buoi(date, date) to authenticated;

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
end $function$;

CREATE OR REPLACE FUNCTION public._the_gioi_tin(p_tu timestamp with time zone)
 RETURNS TABLE(khoa text, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text, at timestamp with time zone, chi_tiet jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Nhất buổi (giải 1 xếp hạng buổi)
  select 'nhat_buoi:' || g.buoi_hoc_id || ':' || g.hoc_sinh_id, 'A', 'hoc', 'nhat_buoi', g.hoc_sinh_id, array[g.hoc_sinh_id], b.lop_id, g.mon,
         coalesce(b.giai_chot_at, g.created_at), jsonb_build_object('ngay', b.ngay)
  from buoi_giai g join buoi_hoc b on b.id = g.buoi_hoc_id
  where g.giai = 1 and coalesce(b.giai_chot_at, g.created_at) >= p_tu
  union all
  -- Nhất game buổi (cá nhân) — Bắn Quà chế độ đội thì tin theo ĐỘI ở dưới
  select 'game:' || l.id, 'A', 'game', 'game_nhat', l.hoc_sinh_id, array[l.hoc_sinh_id], b.lop_id, l.mon, l.at,
         jsonb_build_object('game', l.game, 'ngay', b.ngay)
  from buoi_game_luot l join buoi_hoc b on b.id = l.buoi_hoc_id
  where l.giai = 1 and l.at >= p_tu
    and not exists (select 1 from buoi_ban_qua q where q.buoi_hoc_id = l.buoi_hoc_id and q.che_do = 'doi' and l.game = 'ban_qua')
  union all
  -- 🧋 trúng trà sữa — tầng S
  select 'tra_sua:' || q.luot_id, 'S', 'mayman', 'tra_sua', q.hoc_sinh_id, array[q.hoc_sinh_id], b.lop_id, l.mon, q.at,
         jsonb_build_object('game', l.game, 'ngay', b.ngay)
  from buoi_game_qua q join buoi_game_luot l on l.id = q.luot_id join buoi_hoc b on b.id = q.buoi_hoc_id
  where q.qua = 'tra_sua' and q.at >= p_tu
  union all
  -- Đội thắng Bắn Quà (chế độ đội)
  select 'ban_qua:' || q.buoi_hoc_id || ':' || d.doi, 'A', 'game', 'doi_thang', null::uuid,
         array(select h.hoc_sinh_id from buoi_ban_qua_hs h where h.buoi_hoc_id = q.buoi_hoc_id and h.doi = d.doi),
         b.lop_id, q.mon, q.chot_at, jsonb_build_object('doi', d.doi, 'game', 'ban_qua', 'ngay', b.ngay)
  from buoi_ban_qua q join buoi_ban_qua_doi d on d.buoi_hoc_id = q.buoi_hoc_id and d.hang = 1 join buoi_hoc b on b.id = q.buoi_hoc_id
  where q.che_do = 'doi' and q.chot_at >= p_tu
  union all
  -- Huy hiệu: ★4–5 = S, ★1–3 = A
  select 'huy_hieu:' || x.id, case when x.sao >= 4 then 'S' else 'A' end, 'hoc', 'huy_hieu', x.hoc_sinh_id, array[x.hoc_sinh_id], null::uuid, x.mon, x.dat_at,
         jsonb_build_object('key', x.huy_hieu_key, 'ten', hh.ten, 'sao', x.sao)
  from hs_huy_hieu_dat x left join huy_hieu hh on hh.mon = x.mon and hh.key = x.huy_hieu_key
  where x.dat_at >= p_tu
  union all
  -- Giải tháng đã công bố — tầng S
  select 'giai_thang:' || g.id, 'S', 'hoc', 'giai_thang', g.hoc_sinh_id, array[g.hoc_sinh_id], g.lop_id, g.mon, g.cong_bo_at,
         jsonb_build_object('loai_giai', g.loai_giai, 'thang', g.thang)
  from giai_thuong g where g.cong_bo_at >= p_tu
  union all
  -- ET điểm cao (Thùy 29/09: tin phải là THÀNH TÍCH có số, tích cực — bỏ tin "xong N bài"). Chỉ ET từ 5 câu (đo 28 ngày: 41% lượt ET
  -- được 10 điểm nhưng phần lớn là ET 1–3 câu ⇒ không đáng khoe). ET 10 điểm = A (~5/ngày toàn trung tâm) · ET 9–9,5 = B.
  select 'et:' || e.buoi_hoc_id || ':' || e.hoc_sinh_id, case when e.ti_le = 1 then 'A' else 'B' end, 'hoc', 'et_cao',
         e.hoc_sinh_id, array[e.hoc_sinh_id], e.lop_id, e.mon, e.cham_at,
         jsonb_build_object('ngay', e.ngay, 'diem', round(e.ti_le * 10, 1), 'so_cau', e.so_cau)
  from public._et_diem_buoi((p_tu at time zone 'Asia/Ho_Chi_Minh')::date, (now() at time zone 'Asia/Ho_Chi_Minh')::date) e
  where e.so_cau >= 5 and e.ti_le >= 0.9 and e.cham_at >= p_tu
  union all
  -- Tự luyện chăm (tầng B): ≥ 50 câu ĐÚNG trong 1 ngày / môn (đo 28 ngày: trung vị 12, top 10% ≈ 59) — 1 tin / em / ngày / môn
  select 'tu_luyen:' || bl.hoc_sinh_id || ':' || (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date || ':' || bt.mon, 'B', 'noluc', 'tu_luyen',
         bl.hoc_sinh_id, array[bl.hoc_sinh_id], null::uuid, bt.mon, max(blc.cham_at),
         jsonb_build_object('ngay', (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date, 'so_dung', count(*))
  from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
  where bt.loai = 'tu_luyen' and blc.verdict = 'correct' and blc.cham_at >= p_tu
  group by bl.hoc_sinh_id, (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date, bt.mon
  having count(*) >= 50
$function$;

CREATE OR REPLACE FUNCTION public.fn_the_gioi_kenh(p_kenh text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_ban uuid[];
  v_lop uuid[];
  v_hom_nay timestamptz := ((now() at time zone 'Asia/Ho_Chi_Minh')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_tin jsonb; v_gop jsonb := '[]'::jsonb;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới xem được Thế giới BK'; end if;
  if p_kenh not in ('tg', 'lop', 'ban') then raise exception 'Kênh không hợp lệ: %', p_kenh; end if;
  v_ban := array(select public._ban_be_cua(v_me));
  v_lop := array(select hl.lop_id from hoc_sinh_lop hl where hl.hoc_sinh_id = v_me and hl.trang_thai = 'dang_hoc');

  create temp table if not exists _tgk (khoa text, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text, at timestamptz, chi_tiet jsonb, ten_lop text) on commit drop;
  truncate _tgk;
  insert into _tgk
  select t.*, coalesce((select l.ten_lop from lop l where l.id = t.lop_id), (select x.ten_lop from public._the_gioi_lop(t.thanh_vien[1], t.mon) x))
  from public._the_gioi_tin(now() - interval '7 days') t
  where not exists (select 1 from the_gioi_an_tin a where a.tin_khoa = t.khoa and a.an and not (v_me = any(t.thanh_vien)));
  -- lớp của tin chưa gắn lop_id (huy hiệu, nỗ lực) = lớp môn đó của em chủ tin
  update _tgk set lop_id = (select x.lop_id from public._the_gioi_lop(thanh_vien[1], mon) x) where lop_id is null;

  -- Thùy 29/09: "người ta chỉ lướt 1–2 trang đầu ⇒ phải là tin chất lượng" ⇒ xếp theo TẦNG trước (S → A → B), cùng tầng mới theo giờ.
  select coalesce(jsonb_agg(j order by ghim desc, hang, at desc), '[]'::jsonb) into v_tin from (
    select t.at, (t.tang = 'S' and t.at >= now() - interval '24 hours') as ghim,
      case t.tang when 'S' then 0 when 'A' then 1 else 2 end as hang,
      jsonb_build_object(
        'khoa', t.khoa, 'tang', t.tang, 'nhom', t.nhom, 'kieu', t.kieu, 'mon', t.mon, 'at', t.at, 'lop', t.ten_lop, 'chi_tiet', t.chi_tiet,
        'ghim', (t.tang = 'S' and t.at >= now() - interval '24 hours'),
        'nguoi', case when t.hoc_sinh_id is not null then public._the_gioi_nguoi(t.hoc_sinh_id, t.ten_lop, t.hoc_sinh_id = any(v_ban) or t.hoc_sinh_id = v_me) end,
        'doi', case when t.hoc_sinh_id is null then jsonb_build_object('so', coalesce(array_length(t.thanh_vien, 1), 0),
                 'thanh_vien', (select coalesce(jsonb_agg(public._the_gioi_nguoi(m, t.ten_lop, m = any(v_ban) or m = v_me)), '[]'::jsonb) from unnest(t.thanh_vien[1:4]) m)) end,
        'cua_toi', v_me = any(t.thanh_vien),
        'la_ban', t.thanh_vien && v_ban,
        'da_an', exists (select 1 from the_gioi_an_tin a where a.tin_khoa = t.khoa and a.an),
        'khen', public._the_gioi_khen_json(t.khoa, v_me, v_ban)) j
    from _tgk t
    where case p_kenh
      when 'tg'  then t.tang = 'S'
      when 'lop' then t.lop_id = any(v_lop)
      when 'ban' then t.thanh_vien && v_ban
    end
    order by case t.tang when 'S' then 0 when 'A' then 1 else 2 end, t.at desc limit 60) q;

  if p_kenh = 'tg' then
    -- tin A gộp 1 thẻ / loại: hôm nay (huy hiệu ★1–3 gộp 7 ngày vì chốt tháng đổ dồn 1 ngày)
    select coalesce(jsonb_agg(g order by g->>'kieu'), '[]'::jsonb) into v_gop from (
      select jsonb_build_object('kieu', t.kieu, 'so', count(*),
        'ds', (select jsonb_agg(jsonb_build_object('khoa', u.khoa, 'kieu', u.kieu, 'nhom', u.nhom, 'lop', u.ten_lop, 'chi_tiet', u.chi_tiet, 'at', u.at,
                  'nguoi', case when u.hoc_sinh_id is not null then public._the_gioi_nguoi(u.hoc_sinh_id, u.ten_lop, u.hoc_sinh_id = any(v_ban) or u.hoc_sinh_id = v_me) end,
                  'doi', case when u.hoc_sinh_id is null then jsonb_build_object('so', coalesce(array_length(u.thanh_vien, 1), 0)) end,
                  'la_ban', u.thanh_vien && v_ban, 'cua_toi', v_me = any(u.thanh_vien),
                  'khen', public._the_gioi_khen_json(u.khoa, v_me, v_ban)) order by (u.thanh_vien && v_ban) desc, u.at desc)
               from (select * from _tgk u2 where u2.tang = 'A' and u2.kieu = t.kieu
                       and u2.at >= case when t.kieu = 'huy_hieu' then now() - interval '7 days' else v_hom_nay end
                     order by u2.at desc limit 30) u)) g
      from _tgk t
      where t.tang = 'A' and t.at >= case when t.kieu = 'huy_hieu' then now() - interval '7 days' else v_hom_nay end
      group by t.kieu) z;
  end if;

  return jsonb_build_object(
    'toi', jsonb_build_object('hien', coalesce((select hien from the_gioi_cai_dat where hoc_sinh_id = v_me), 'ten'),
                              'so_ban', coalesce(array_length(v_ban, 1), 0),
                              'loi_moi', (select count(*) from ban_be_loi_moi where nguoi_nhan = v_me and trang_thai = 'cho')),
    'tin', v_tin, 'gop', v_gop);
end $function$;
