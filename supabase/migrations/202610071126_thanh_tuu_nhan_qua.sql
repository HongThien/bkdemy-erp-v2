-- ============================================================================
-- 202610071126 — thanh_tuu_nhan_qua   (áp: `node scripts/migrate.mjs --only 202610071126_thanh_tuu_nhan_qua.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 07/10): "mỗi thành tựu là 1 card, chỉ hiện mức gần nhất; xong mức 1 mới hiện mức 2; phải có nút NHẬN QUÀ sáng lên khi hoàn thành;
--   khi có thành tựu hoàn thành thì ô Thành tựu phải có chỉ số để học sinh thấy ngay".
--   ⇒ TÁCH "ĐẠT" (suy từ lịch sử, _tt_dat_duoc) khỏi "ĐÃ NHẬN" (sự kiện thật = dòng thanh_tuu_dat). EXP chỉ tính khi em BẤM NHẬN (tháng nhận = tháng ghi sổ, như cũ).
--   Trước đó (mig 202610071018) bậc đạt được TỰ ghi sổ khi em về màn chính — nay bỏ: fn_thanh_tuu_chot() thành no-op trả [] (bản app cũ gọi vẫn không lỗi, không tự thưởng).
--   Dòng thanh_tuu_dat đã ghi trước đó (nếu có) tính là ĐÃ NHẬN — không thu hồi.
-- THÊM: fn_thanh_tuu_nhan(ma, bậc) (bấm nhận · idempotent · chỉ nhận bậc đã đạt) · fn_thanh_tuu_cho_nhan() (số THẺ đang có quà chờ — cho chỉ số trên ô) ·
--   tiến độ cho mọi loại đo được (TT04–TT08) · fn_thanh_tuu_cua_toi trả thêm cờ co_the_nhan từng bậc + cho_nhan.
-- MẤT GÌ: không xoá dữ liệu. Thay thân hàm fn_thanh_tuu_chot (→ no-op), _tt_tien_do, fn_thanh_tuu_cua_toi. _tt_dat_duoc / _tt_chot_hs giữ nguyên (không còn ai gọi _tt_chot_hs).
-- ============================================================================

-- Số THẺ có quà chờ nhận (mỗi loại có ≥ 1 bậc đã đạt mà chưa nhận)
create or replace function public._tt_cho_nhan(p_hs uuid) returns integer
language plpgsql stable as $$
declare v_mua text; v_n int;
begin
  select m.mua into v_mua from public._tt_mua() m;
  if v_mua is null then return 0; end if;
  with d as (select distinct x.ma, x.bac from public._tt_dat_duoc(p_hs) x)
  select count(distinct d.ma)::int into v_n from d
  where not exists (select 1 from thanh_tuu_dat t where t.hoc_sinh_id = p_hs and t.ma = d.ma and t.bac = d.bac and t.mua = v_mua);
  return coalesce(v_n, 0);
end $$;
revoke all on function public._tt_cho_nhan(uuid) from public, anon, authenticated;

create or replace function public.fn_thanh_tuu_cho_nhan() returns integer
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then return 0; end if;
  return public._tt_cho_nhan(v_hs);
end $$;
revoke all on function public.fn_thanh_tuu_cho_nhan() from public, anon;
grant execute on function public.fn_thanh_tuu_cho_nhan() to authenticated;

-- Bản app cũ vẫn gọi: không còn tự thưởng
create or replace function public.fn_thanh_tuu_chot() returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if public.my_hoc_sinh_id() is null then raise exception 'Không xác định được học sinh.'; end if;
  return '[]'::jsonb;
end $$;

-- BẤM NHẬN QUÀ: ghi sổ bậc đã đạt (mọi môn đã đạt bậc đó). Idempotent: nhận lần 2 trả moi=false, không cộng thêm.
create or replace function public.fn_thanh_tuu_nhan(p_ma text, p_bac integer) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id(); v_mua text; v_ym text := to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'); v_kq jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select m.mua into v_mua from public._tt_mua() m;
  if v_mua is null then raise exception 'Chưa có mùa thành tựu.'; end if;
  perform pg_advisory_xact_lock(hashtext('tt_nhan:' || v_hs::text));
  if not exists (select 1 from thanh_tuu_bac b join thanh_tuu_loai l on l.ma = b.ma and l.san_sang where b.ma = p_ma and b.bac = p_bac) then
    raise exception 'Thành tựu không tồn tại hoặc chưa mở.';
  end if;
  if not exists (select 1 from public._tt_dat_duoc(v_hs) x where x.ma = p_ma and x.bac = p_bac) then
    raise exception 'Em chưa đạt thành tựu này.';
  end if;
  with d as (
    select x.ma, x.bac, x.mon, min(x.dat_at) as dat_at from public._tt_dat_duoc(v_hs) x where x.ma = p_ma and x.bac = p_bac group by x.ma, x.bac, x.mon
  ), ghi as (
    insert into thanh_tuu_dat (hoc_sinh_id, ma, bac, mua, mon, dat_at, thang, exp, xu)
    select v_hs, d.ma, d.bac, v_mua, d.mon, d.dat_at, v_ym, b.exp, b.xu from d join thanh_tuu_bac b on b.ma = d.ma and b.bac = d.bac
    on conflict (hoc_sinh_id, ma, bac, mua, mon) do nothing
    returning mon, exp, xu
  )
  select jsonb_build_object('ma', p_ma, 'bac', p_bac, 'ten', (select l.ten from thanh_tuu_loai l where l.ma = p_ma),
                            'exp', coalesce(sum(g.exp), 0)::int, 'xu', coalesce(sum(g.xu), 0)::int, 'mon', min(g.mon), 'moi', count(*) > 0)
    into v_kq from ghi g;
  return v_kq;
end $$;
revoke all on function public.fn_thanh_tuu_nhan(text, integer) from public, anon;
grant execute on function public.fn_thanh_tuu_nhan(text, integer) to authenticated;

-- Tiến độ HIỆN TẠI trong mùa (mốc để so với ngưỡng bậc): TT04 vào app · TT05 chuỗi · TT06 nhiệm vụ ngày · TT07 luyện yếu đạt · TT08 tổng câu
create or replace function public._tt_tien_do(p_hs uuid) returns jsonb
language plpgsql stable as $$
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
  return v_out || jsonb_build_object('TT08', v_c);
end $$;
revoke all on function public._tt_tien_do(uuid) from public, anon, authenticated;

-- Màn Thành tựu: danh mục + từng bậc (dat = ĐÃ NHẬN · co_the_nhan = đã đạt, chưa nhận) + tiến độ + số thẻ chờ nhận.
create or replace function public.fn_thanh_tuu_cua_toi() returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_mua text; v_td jsonb; v_dat jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select m.mua into v_mua from public._tt_mua() m;
  v_td := public._tt_tien_do(v_hs);
  select coalesce(jsonb_agg(distinct x.ma || '|' || x.bac), '[]'::jsonb) into v_dat from public._tt_dat_duoc(v_hs) x;
  return jsonb_build_object(
    'mua', v_mua,
    'tien_do', v_td,
    'tong_exp_mua', coalesce((select sum(d.exp) from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.mua = v_mua), 0),
    'cho_nhan', (select count(distinct b.ma) from thanh_tuu_bac b
                 where v_dat ? (b.ma || '|' || b.bac)
                   and not exists (select 1 from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.ma = b.ma and d.bac = b.bac and d.mua = v_mua)),
    'loai', coalesce((
      select jsonb_agg(jsonb_build_object(
        'ma', l.ma,
        'ten', case when l.an and not exists (select 1 from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.ma = l.ma and d.mua = v_mua) then 'Thành tựu ẩn' else l.ten end,
        'mo_ta', case when l.an and not exists (select 1 from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.ma = l.ma and d.mua = v_mua) then 'Hãy khám phá để mở khoá' else l.mo_ta end,
        'kieu', l.kieu, 'don_vi', l.don_vi, 'an', l.an, 'san_sang', l.san_sang,
        'tien_do', v_td->l.ma,
        'bac', (select coalesce(jsonb_agg(jsonb_build_object('bac', b.bac, 'nguong', b.nguong, 'exp', b.exp, 'xu', b.xu,
                  'dat', exists (select 1 from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.ma = b.ma and d.bac = b.bac and d.mua = v_mua),
                  'co_the_nhan', (v_dat ? (b.ma || '|' || b.bac))
                                 and not exists (select 1 from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.ma = b.ma and d.bac = b.bac and d.mua = v_mua),
                  'dat_at', (select min(d.dat_at) from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.ma = b.ma and d.bac = b.bac and d.mua = v_mua)) order by b.bac), '[]'::jsonb)
                from thanh_tuu_bac b where b.ma = l.ma)
      ) order by l.thu_tu) from thanh_tuu_loai l), '[]'::jsonb));
end $$;
