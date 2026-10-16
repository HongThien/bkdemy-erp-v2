-- ============================================================================
-- 202610161746 — tt07_5_10_20_va_thang_dat
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 16/10 (soát EXP app):
--   ① Thành tựu ghi EXP vào THÁNG EM BẤM NHẬN (_tt_chot_hs / fn_thanh_tuu_nhan dùng tháng hiện tại) ⇒ mở tính năng 09/10
--      thì mọi thành tựu tháng 8–9 (Mock Test top khối, chuỗi…) dồn vào EXP/xu tháng 10. "Backdate lại" ⇒ thang = tháng ĐẠT
--      (dat_at), cho cả dòng cũ lẫn lần nhận sau.
--   ② TT07 "Luyện yếu đạt liên tiếp" quá dễ (mốc 10 lượt = 1.000 EXP, có em đạt trong 1 giờ) ⇒ Thùy: "5 · 10 · 20 lần liên
--      tiếp đúng ≥70% (7/10)". Thưởng giữ 200 / 300 / 1.000 EXP. Tính lại: em không còn đủ mốc ⇒ THU HỒI (xoá dòng đạt),
--      còn đủ ⇒ giữ, ngày đạt = lúc chạm mốc mới.
--   ③ "Thu hồi xu và chốt lại cho công bằng": _xu_dong_bo tháng 09 + 10 (ghi chênh âm/dương vào qlht_xu_ledger). Tháng 08
--      ĐÓNG BĂNG (chốt tay 6.950 xu; đồng bộ lại cả tháng sẽ trả thêm ~1.300 xu KHÔNG liên quan) ⇒ chỉ ghi đúng phần xu của
--      thành tựu đạt trong tháng 8 (EXP app tháng 8 trước đó = 0 ⇒ xu = fn_xu_tu_exp(EXP thành tựu tháng 8 của em)).
--   Đào Đức Minh Hiếu đã tiêu xu ⇒ ví âm sau thu hồi ⇒ Thùy: "về 0" (1 dòng cong_tay bù đúng phần âm).
-- MẤT GÌ (Luật xoá — Thùy gật 16/10 "ok thu hồi đi", danh sách chính xác ở DEVLOG 16/10): các dòng thanh_tuu_dat TT07 không còn đạt theo mốc
--   mới. Xu: ghi dòng chênh trong qlht_xu_ledger (không xoá dòng sổ xu nào).
-- ============================================================================

update thanh_tuu_bac set nguong = case bac when 1 then 5 when 2 then 10 when 3 then 20 end where ma = 'TT07' and bac in (1, 2, 3);

CREATE OR REPLACE FUNCTION public._tt_chot_hs(p_hs uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_mua text; v_nay_ym text := to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'); v_moi jsonb;
begin
  select m.mua into v_mua from public._tt_mua() m;
  if v_mua is null then return '[]'::jsonb; end if;
  perform pg_advisory_xact_lock(hashtext('tt_chot:' || p_hs::text));
  with d as (
    select x.ma, x.bac, x.mon, min(x.dat_at) as dat_at from public._tt_dat_duoc(p_hs) x group by x.ma, x.bac, x.mon
  ), ghi as (
    insert into thanh_tuu_dat (hoc_sinh_id, ma, bac, mua, mon, dat_at, thang, exp, xu)
    select p_hs, d.ma, d.bac, v_mua, d.mon, d.dat_at, to_char(d.dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'), b.exp, b.xu   -- Thùy 16/10: EXP tính vào THÁNG ĐẠT, không phải tháng nhận
    from d join thanh_tuu_bac b on b.ma = d.ma and b.bac = d.bac
    on conflict (hoc_sinh_id, ma, bac, mua, mon) do nothing
    returning ma, bac, mon, exp, xu
  )
  select coalesce(jsonb_agg(jsonb_build_object('ma', g.ma, 'bac', g.bac, 'mon', g.mon, 'exp', g.exp, 'xu', g.xu, 'ten', l.ten) order by g.ma, g.bac), '[]'::jsonb)
    into v_moi from ghi g join thanh_tuu_loai l on l.ma = g.ma;
  return v_moi;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_thanh_tuu_nhan(p_ma text, p_bac integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    select v_hs, d.ma, d.bac, v_mua, d.mon, d.dat_at, to_char(d.dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'), b.exp, b.xu from d   -- tháng ĐẠT join thanh_tuu_bac b on b.ma = d.ma and b.bac = d.bac
    on conflict (hoc_sinh_id, ma, bac, mua, mon) do nothing
    returning mon, exp, xu
  )
  select jsonb_build_object('ma', p_ma, 'bac', p_bac, 'ten', (select l.ten from thanh_tuu_loai l where l.ma = p_ma),
                            'exp', coalesce(sum(g.exp), 0)::int, 'xu', coalesce(sum(g.xu), 0)::int, 'mon', min(g.mon), 'moi', count(*) > 0)
    into v_kq from ghi g;
  return v_kq;
end $function$;

do $$
declare r record; v_ns uuid := (select id from nhan_su where ho_ten = 'Đào Xuân Thùy' and la_admin_he_thong limit 1);
        v_xoa int := 0; v_giu int := 0;
begin
  -- ② TT07 theo mốc mới
  for r in select distinct hoc_sinh_id from thanh_tuu_dat where ma = 'TT07' loop
    create temp table if not exists _moi (ma text, bac int, mon text, dat_at timestamptz) on commit drop;
    truncate _moi;
    insert into _moi select x.ma, x.bac, x.mon, min(x.dat_at) from public._tt_dat_duoc(r.hoc_sinh_id) x where x.ma = 'TT07' group by 1, 2, 3;
    delete from thanh_tuu_dat d where d.hoc_sinh_id = r.hoc_sinh_id and d.ma = 'TT07'
      and not exists (select 1 from _moi m where m.bac = d.bac and m.mon = d.mon);
    get diagnostics v_xoa = row_count;
    update thanh_tuu_dat d set dat_at = m.dat_at from _moi m
     where d.hoc_sinh_id = r.hoc_sinh_id and d.ma = 'TT07' and m.bac = d.bac and m.mon = d.mon;
  end loop;

  -- ① tháng = tháng đạt (mọi thành tựu)
  update thanh_tuu_dat set thang = to_char(dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM')
   where thang is distinct from to_char(dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM');

  -- ③ tháng 8: chỉ phần xu của thành tựu đạt trong tháng 8 (chưa từng ghi)
  insert into qlht_xu_ledger (hoc_sinh_id, amount, loai, mon, thang, exp_snapshot, ly_do, nguoi_tao)
  select t.hoc_sinh_id, public.fn_xu_tu_exp(sum(t.exp)::int), 'chot_lai', t.mon, '2026-08', sum(t.exp)::int,
         format('Thành tựu đạt tháng 08 (dời từ tháng 10) · %s EXP', sum(t.exp)), v_ns
    from thanh_tuu_dat t
   where t.thang = '2026-08'
     and not exists (select 1 from qlht_xu_ledger x where x.hoc_sinh_id = t.hoc_sinh_id and x.thang = '2026-08' and x.ly_do like 'Thành tựu đạt tháng 08%')
   group by t.hoc_sinh_id, t.mon
  having public.fn_xu_tu_exp(sum(t.exp)::int) <> 0;

  -- ③ tháng 9 + 10: đồng bộ chênh (thu hồi / bù)
  perform public._xu_dong_bo(null, array['2026-09', '2026-10'], v_ns);

  -- Thùy 16/10: Đào Đức Minh Hiếu đã tiêu xu ⇒ thu hồi xong ví âm ⇒ "về 0" (bù đúng phần âm, ghi rõ lý do)
  insert into qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, nguoi_tao)
  select h.id, -v.xu, 'cong_tay', 'Bù ví về 0 sau thu hồi thành tựu TT07 (Thùy 16/10)', v_ns
    from hoc_sinh h cross join lateral (select coalesce(sum(x.amount), 0)::int as xu from qlht_xu_ledger x where x.hoc_sinh_id = h.id) v
   where h.ho_ten = 'Đào Đức Minh Hiếu' and v.xu < 0;
end $$;
