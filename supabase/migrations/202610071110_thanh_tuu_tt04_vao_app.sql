-- ============================================================================
-- 202610071110 — thanh_tuu_tt04_vao_app   (áp: `node scripts/migrate.mjs --only 202610071110_thanh_tuu_tt04_vao_app.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO: thành tựu TT04 "Vào app liên tiếp" (7/14/30/60/90/150/210/300 ngày → 30/50/80/100/150/200/250/400 EXP; spec-kinh-te-nhiem-vu.md §11) trước đây ⛔ vì
--   chưa có log mở app. Thêm bảng `hs_mo_app` (1 dòng / HS / ngày VN — SỰ KIỆN thật, chỉ có dòng khi em thật sự mở app) + RPC `fn_hs_mo_app()` (app gọi 1 lần khi mở),
--   thêm nhánh TT04 vào _tt_dat_duoc, bật san_sang. Chuỗi tính từ ngày có log đầu tiên (không có dữ liệu lùi) — nghĩa là bậc 7 ngày đầu tiên sớm nhất sau 7 ngày kể từ lúc áp.
-- MẤT GÌ: không xoá/sửa dữ liệu. Thay thân hàm _tt_dat_duoc (thêm 1 nhánh, các nhánh TT05–TT12 giữ NGUYÊN); bật thanh_tuu_loai.TT04.san_sang.
-- ============================================================================

create table if not exists hs_mo_app (
  hoc_sinh_id uuid not null references hoc_sinh(id),
  ngay date not null,                                   -- ngày VN
  lan_dau_at timestamptz not null default now(),
  primary key (hoc_sinh_id, ngay)
);
comment on table hs_mo_app is 'Log mở app HS: 1 dòng/HS/ngày VN (chỉ khi em thật sự mở app). Nguồn của thành tựu TT04. Không chứa chi tiết dùng app.';
alter table hs_mo_app enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'hs_mo_app' and policyname = 'hs_mo_app_doc') then
    create policy hs_mo_app_doc on hs_mo_app for select to authenticated using (hoc_sinh_id = public.my_hoc_sinh_id() or public.la_thanh_vien());
  end if;
end $$;

create or replace function public.fn_hs_mo_app() returns void
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then return; end if;
  insert into hs_mo_app (hoc_sinh_id, ngay) values (v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date) on conflict do nothing;
end $$;
revoke all on function public.fn_hs_mo_app() from public, anon;
grant execute on function public.fn_hs_mo_app() to authenticated;

update thanh_tuu_loai set san_sang = true where ma = 'TT04';

create or replace function public._tt_dat_duoc(p_hs uuid)
returns table(ma text, bac integer, mon text, dat_at timestamptz)
language plpgsql stable as $$
declare
  v_mua text; v_tu date; v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tu_ts timestamptz; v_den_ts timestamptz; v_mon0 text; v_j jsonb; v_so int; v_bd date; v_ym text; c record;
  v_ngay date[] := '{}';
begin
  select m.mua, m.tu into v_mua, v_tu from public._tt_mua() m;
  if v_mua is null then return; end if;
  v_tu_ts := v_tu::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_den_ts := (v_nay + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_mon0 := public._tt_mon_chinh(p_hs);

  -- TT05 Chuỗi làm bài: lấy max(chuỗi hiện tại, kỷ lục), kẹp theo số ngày của mùa; ngày đạt = ngày thứ `ngưỡng` của chuỗi hiện tại nếu có, không thì lúc ghi sổ
  if v_mon0 is not null then
    v_j := public._chuoi_cua(p_hs);
    v_so := least(greatest(coalesce((v_j->>'so_ngay')::int, 0), coalesce((v_j->>'ky_luc')::int, 0)), v_nay - v_tu + 1);
    v_bd := (v_j->>'bat_dau')::date;
    return query
      select b.ma, b.bac, v_mon0,
             least(now(), case when coalesce((v_j->>'so_ngay')::int, 0) >= b.nguong and v_bd is not null and v_bd >= v_tu
                               then ((v_bd + b.nguong)::timestamp at time zone 'Asia/Ho_Chi_Minh') else now() end)
      from thanh_tuu_bac b join thanh_tuu_loai l on l.ma = b.ma and l.san_sang
      where b.ma = 'TT05' and b.nguong <= v_so;

    -- TT06 Nhiệm vụ ngày liên tiếp (hợp các môn bật nhiệm vụ): chuỗi ngày liên tiếp dài nhất trong mùa
    for v_ym in select to_char(g, 'YYYY-MM') from generate_series(date_trunc('month', v_tu::timestamp), v_nay::timestamp, interval '1 month') g loop
      for c in select n.mon from nhiem_vu_cau_hinh n where n.bat loop
        v_ngay := v_ngay || array(select h.xong_ngay from public.fn_nhiem_vu_hoan_thanh(c.mon, v_ym, array[p_hs]) h
                                  where h.hoc_sinh_id = p_hs and h.ma = 'N' and h.xong_ngay >= v_tu);
      end loop;
    end loop;
    return query
      with d as (select distinct x as ngay from unnest(v_ngay) x),
           g as (select d.ngay, d.ngay - (row_number() over (order by d.ngay))::int as grp from d),
           runs as (select min(g.ngay) as s, count(*)::int as n from g group by g.grp)
      select b.ma, b.bac, v_mon0,
             least(now(), (((select min(r.s + b.nguong - 1) from runs r where r.n >= b.nguong) + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh'))
      from thanh_tuu_bac b join thanh_tuu_loai l on l.ma = b.ma and l.san_sang
      where b.ma = 'TT06' and exists (select 1 from runs r where r.n >= b.nguong);

    -- TT04 Vào app liên tiếp: các ngày em có mở app (hs_mo_app) trong mùa; chuỗi ngày liên tiếp dài nhất
    return query
      with d as (select distinct m.ngay from hs_mo_app m where m.hoc_sinh_id = p_hs and m.ngay >= v_tu),
           g as (select d.ngay, d.ngay - (row_number() over (order by d.ngay))::int as grp from d),
           runs as (select min(g.ngay) as s, count(*)::int as n from g group by g.grp)
      select b.ma, b.bac, v_mon0,
             least(now(), (((select min(r.s + b.nguong - 1) from runs r where r.n >= b.nguong) + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh'))
      from thanh_tuu_bac b join thanh_tuu_loai l on l.ma = b.ma and l.san_sang
      where b.ma = 'TT04' and exists (select 1 from runs r where r.n >= b.nguong);
  end if;

  -- TT07 Luyện dạng yếu đạt liên tiếp (theo môn): chuỗi lượt đạt dài nhất không bị lượt không đạt cắt
  return query
    with l as (
      select t.mon as m, t.nop_at, (t.tinh and t.dung >= ceil(t.so_cau * n.dat_ti_le)) as dat
      from public._luot_tinh(array[p_hs], v_tu_ts, v_den_ts) t
      join public.bai_lam bl on bl.id = t.bai_lam_id join public.bai_test bt on bt.id = bl.bai_test_id
      join nhiem_vu_cau_hinh n on n.mon = t.mon and n.bat
      -- lượt dưới ngưỡng (< 50% đúng) vẫn là một lần thử thật ⇒ CẮT chuỗi; lượt quá nhanh / quá ít câu thì bỏ qua (không phải học thật)
      where (t.tinh or t.ly_do = 'duoi_nguong') and bt.luyen_yeu and not bt.thu_thach
    ), x as (
      select l.*, row_number() over (partition by l.m order by l.nop_at) as rn,
             row_number() over (partition by l.m, l.dat order by l.nop_at) as rd from l
    ), runs as (
      select x.m, array_agg(x.nop_at order by x.nop_at) as ts from x where x.dat group by x.m, (x.rn - x.rd)
    )
    select b.ma, b.bac, r.m, min(r.ts[b.nguong])
    from thanh_tuu_bac b join thanh_tuu_loai lo on lo.ma = b.ma and lo.san_sang
    join runs r on cardinality(r.ts) >= b.nguong
    where b.ma = 'TT07' group by b.ma, b.bac, r.m;

  -- TT08 Tổng câu luyện đạt (cộng dồn cả mùa, theo môn)
  return query
    with s as (
      select t.mon as m, t.nop_at, sum(t.dung) over (partition by t.mon order by t.nop_at) as cum
      from public._luot_tinh(array[p_hs], v_tu_ts, v_den_ts) t
      join nhiem_vu_cau_hinh n on n.mon = t.mon and n.bat
      where t.tinh
    )
    select b.ma, b.bac, s.m, min(s.nop_at)
    from thanh_tuu_bac b join thanh_tuu_loai lo on lo.ma = b.ma and lo.san_sang
    join s on s.cum >= b.nguong
    where b.ma = 'TT08' group by b.ma, b.bac, s.m;

  -- TT09 / TT10 Top 5 / Top 1 khối ở Mock Test tháng (mỗi môn, mỗi tháng có MT trong mùa)
  for v_ym in select to_char(g, 'YYYY-MM') from generate_series(date_trunc('month', v_tu::timestamp), v_nay::timestamp, interval '1 month') g loop
    for c in select n.mon from nhiem_vu_cau_hinh n where n.bat loop
      return query
        select b.ma, b.bac, c.mon, (m.ngay::timestamp at time zone 'Asia/Ho_Chi_Minh')
        from public.fn_mt_hang_thang(c.mon, v_ym) m
        join thanh_tuu_bac b on (b.ma = 'TT09' and m.hang <= b.nguong) or (b.ma = 'TT10' and m.hang <= b.nguong)
        join thanh_tuu_loai lo on lo.ma = b.ma and lo.san_sang
        where m.hoc_sinh_id = p_hs and m.ngay >= v_tu;
    end loop;
  end loop;

  -- TT12 Mock Test 10 điểm lần đầu trong mùa (theo môn)
  return query
    select b.ma, b.bac, kt.mon, min(bh.ngay)::timestamp at time zone 'Asia/Ho_Chi_Minh'
    from diem_thi dt
    join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'mt_sat_hach'
    join buoi_hoc bh on bh.id = kt.buoi_hoc_id
    join thanh_tuu_bac b on b.ma = 'TT12' and coalesce(dt.diem, dt.diem_thi_lai) >= b.nguong
    join thanh_tuu_loai lo on lo.ma = b.ma and lo.san_sang
    join nhiem_vu_cau_hinh n on n.mon = kt.mon and n.bat
    where dt.hoc_sinh_id = p_hs and bh.ngay >= v_tu
    group by b.ma, b.bac, kt.mon;
end $$;
revoke all on function public._tt_dat_duoc(uuid) from public, anon, authenticated;
