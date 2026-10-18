-- ============================================================================
-- giai_thuong_vao_thanh_tuu_huy_hieu — GIẢI THƯỞNG THÁNG ĐƯỢC GHI VÀO THÀNH TỰU + HUY HIỆU (Thùy 17/10: "Giải này cũng phải được ghi vào thành tựu - huy hiệu")
-- ----------------------------------------------------------------------------
-- Nguồn duy nhất = sổ ghi nhận hs_giai_thuong (mig giai_thuong_tu_dong_xu_tin_moi; giai_thuong gốc thuộc owner postgres nên hàm của claude_build không đọc được).
--   · THÀNH TỰU MÙA — loại TT16 "Giải thưởng tháng" (tích luỹ theo số giải nhận trong mùa): bậc 1 = 1 giải · bậc 2 = 3 giải · bậc 3 = 6 giải. EXP 0, xu 0:
--     phần thưởng của giải là 30 xu (khối 3–7) đã cộng riêng ⇒ KHÔNG thưởng trùng. Thêm TT16 vào _tt_dat_duoc + _tt_tien_do.
--   · HUY HIỆU — "Vinh danh" 🏆 (Toán): điều kiện chuẩn = thành tựu tháng G1 "Nhận giải thưởng cuối tháng" (loai_chi_so mới 'giai_thuong' ⇒ có giải ở môn đó trong tháng).
--     Sao theo luật chung của môn (1/2/4 tháng có giải = sao 1/2/3; 6 và 9 tháng = sao 4/5 huy hiệu cứng). Mới chỉ Toán có cấu hình huy hiệu; giải KHTN ghi vào thành tựu TT16 nhưng chưa có huy hiệu KHTN.
--   · Tên/biểu tượng "Vinh danh 🏆" và hình riêng cho TT16 là TẠM — Thùy đặt lại (huy_hieu.ten/bieu_tuong; hình tt16 trong style).
-- MẤT GÌ: không xoá dữ liệu. Thay thân 3 hàm (chỉ THÊM nhánh): _tt_dat_duoc, _tt_tien_do, fn_thanh_tuu_thang. Nới CHECK thanh_tuu.loai_chi_so thêm 'giai_thuong'.
-- ============================================================================
alter table public.thanh_tuu drop constraint thanh_tuu_loai_chi_so_check;
alter table public.thanh_tuu add constraint thanh_tuu_loai_chi_so_check
  check (loai_chi_so = any (array['diem_danh_du','btvn_dung_han_du','tu_luyen_cau_dung','thu_thach_ngay_pass','thu_thach_luot_full','et_ti_le_bai','mt_top_pct','btvn_ti_le_tb','mt_hon_moc','lap_lo','dua_thang_top_pct','giai_thuong']::text[]));

insert into public.thanh_tuu_loai (ma, ten, mo_ta, kieu, don_vi, gan_mon, an, san_sang, thu_tu)
values ('TT16', 'Giải thưởng tháng', 'Nhận giải Xuất sắc / Tiến bộ / Chăm chỉ cuối tháng của lớp', 'tich_luy', 'giải', true, false, true, 16)
on conflict (ma) do nothing;
insert into public.thanh_tuu_bac (ma, bac, nguong, exp, xu) values ('TT16', 1, 1, 0, 0), ('TT16', 2, 3, 0, 0), ('TT16', 3, 6, 0, 0)
on conflict (ma, bac) do nothing;

insert into public.thanh_tuu (mon, key, ten, loai_chi_so, tham_so, mo_tu, active, thu_tu)
values ('Toán', 'G1', 'Nhận giải thưởng cuối tháng của lớp', 'giai_thuong', '{}'::jsonb, null, true, 20)
on conflict (mon, key) do nothing;
insert into public.huy_hieu (mon, key, ten, bieu_tuong, ghi_nhan, cau_chuyen, thu_tu, active)
values ('Toán', 'vinh_danh', 'Vinh danh', '🏆', 'Được thầy cô trao giải cuối tháng', null, 9, true)
on conflict (mon, key) do nothing;
insert into public.huy_hieu_dieu_kien (mon, huy_hieu_key, thanh_tuu_key, vai)
values ('Toán', 'vinh_danh', 'G1', 'chuan')
on conflict do nothing;

CREATE OR REPLACE FUNCTION public._tt_dat_duoc(p_hs uuid)
 RETURNS TABLE(ma text, bac integer, mon text, dat_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE
AS $function$
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

  -- TT16 Giải thưởng tháng (Thùy 17/10): cộng dồn số giải nhận trong mùa, theo môn của giải (nguồn: sổ ghi nhận hs_giai_thuong)
  return query
    with s as (
      select g.mon as m, g.cong_bo_at, row_number() over (partition by g.mon order by g.thang, g.giai_thuong_id) as cum
      from hs_giai_thuong g where g.hoc_sinh_id = p_hs and g.thang >= date_trunc('month', v_tu::timestamp)::date
    )
    select b.ma, b.bac, s.m, min(s.cong_bo_at)
    from thanh_tuu_bac b join thanh_tuu_loai lo on lo.ma = b.ma and lo.san_sang
    join s on s.cum >= b.nguong
    where b.ma = 'TT16' group by b.ma, b.bac, s.m;
end $function$;

CREATE OR REPLACE FUNCTION public._tt_tien_do(p_hs uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v_tu date; v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date; v_mon0 text; v_out jsonb := '{}'::jsonb; v_j jsonb; v_c int;
  v_tu_ts timestamptz; v_den_ts timestamptz; v_ym text; c record; v_ngay date[] := '{}';
begin
  select m.tu into v_tu from public._tt_mua() m;
  if v_tu is null then return v_out; end if;
  v_tu_ts := v_tu::timestamp at time zone 'Asia/Ho_Chi_Minh'; v_den_ts := (v_nay + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_mon0 := public._tt_mon_chinh(p_hs);

  -- TT05 chuỗi (cùng công thức với _tt_dat_duoc: max(chuỗi hiện tại, kỷ lục) kẹp theo số ngày mùa)
  v_j := public._chuoi_cua(p_hs);
  v_out := v_out || jsonb_build_object('TT05', least(greatest(coalesce((v_j->>'so_ngay')::int, 0), coalesce((v_j->>'ky_luc')::int, 0)), v_nay - v_tu + 1));

  -- TT04 vào app: chuỗi ngày liên tiếp dài nhất trong mùa
  select coalesce(max(n), 0) into v_c from (
    select count(*)::int as n from (select m.ngay, m.ngay - (row_number() over (order by m.ngay))::int as grp from hs_mo_app m where m.hoc_sinh_id = p_hs and m.ngay >= v_tu) g group by g.grp) r;
  v_out := v_out || jsonb_build_object('TT04', v_c);

  -- TT06 nhiệm vụ ngày liên tiếp
  for v_ym in select to_char(g, 'YYYY-MM') from generate_series(date_trunc('month', v_tu::timestamp), v_nay::timestamp, interval '1 month') g loop
    for c in select n.mon from nhiem_vu_cau_hinh n where n.bat loop
      v_ngay := v_ngay || array(select h.xong_ngay from public.fn_nhiem_vu_hoan_thanh(c.mon, v_ym, array[p_hs]) h
                                where h.hoc_sinh_id = p_hs and h.ma = 'N' and h.xong_ngay >= v_tu);
    end loop;
  end loop;
  select coalesce(max(n), 0) into v_c from (
    select count(*)::int as n from (select d.ngay, d.ngay - (row_number() over (order by d.ngay))::int as grp from (select distinct x as ngay from unnest(v_ngay) x) d) g group by g.grp) r;
  v_out := v_out || jsonb_build_object('TT06', v_c);

  -- TT07 luyện yếu đạt liên tiếp (lượt dưới ngưỡng cắt chuỗi) — lấy môn có chuỗi dài nhất
  select coalesce(max(n), 0) into v_c from (
    select count(*)::int as n from (
      select l.m, l.dat, row_number() over (partition by l.m order by l.nop_at) as rn, row_number() over (partition by l.m, l.dat order by l.nop_at) as rd from (
        select t.mon as m, t.nop_at, (t.tinh and t.dung >= ceil(t.so_cau * n.dat_ti_le)) as dat
        from public._luot_tinh(array[p_hs], v_tu_ts, v_den_ts) t
        join public.bai_lam bl on bl.id = t.bai_lam_id join public.bai_test bt on bt.id = bl.bai_test_id
        join nhiem_vu_cau_hinh n on n.mon = t.mon and n.bat
        where (t.tinh or t.ly_do = 'duoi_nguong') and bt.luyen_yeu and not bt.thu_thach) l) x
    where x.dat group by x.m, (x.rn - x.rd)) r;
  v_out := v_out || jsonb_build_object('TT07', v_c);

  -- TT08 tổng câu luyện đạt (môn chính)
  select coalesce(sum(t.dung), 0)::int into v_c from public._luot_tinh(array[p_hs], v_tu_ts, v_den_ts) t where t.tinh and t.mon = v_mon0;
  v_out := v_out || jsonb_build_object('TT08', v_c);

  -- TT16 giải thưởng tháng: số giải đã nhận trong mùa
  select count(*)::int into v_c from hs_giai_thuong g where g.hoc_sinh_id = p_hs and g.thang >= date_trunc('month', v_tu::timestamp)::date;
  return v_out || jsonb_build_object('TT16', v_c);
end $function$;

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
        when 'giai_thuong'         then exists (select 1 from hs_giai_thuong g where g.hoc_sinh_id = h.hs and g.mon = p_mon and g.thang = v_ms)
      end then 'dat'
      else 'khong_dat'
    end
  from hs h cross join tk;
  drop table _dua; drop table _mt;
end $function$;
