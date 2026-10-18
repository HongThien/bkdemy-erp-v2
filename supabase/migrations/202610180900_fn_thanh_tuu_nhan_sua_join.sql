-- ============================================================================
-- 202610180900 — fn_thanh_tuu_nhan_sua_join
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Mig 202610161746 dán `join thanh_tuu_bac b …` vào SAU comment "-- tháng ĐẠT" trên cùng 1 dòng ⇒ join bị comment
--   mất, `b.exp, b.xu` không có FROM. PL/pgSQL chỉ kiểm lúc CHẠY nên migrate vẫn qua; từ 16/10 MỌI lượt "Nhận quà"
--   Thành tựu lỗi `missing FROM-clause entry for table "b"` (HS HS0421 báo 17/10 "không nhận quà được").
--   Thân hàm y hệt bản 16/10, chỉ tách join xuống dòng riêng.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không.
-- ============================================================================

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
    select v_hs, d.ma, d.bac, v_mua, d.mon, d.dat_at,
           to_char(d.dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'),   -- tháng ĐẠT
           b.exp, b.xu
      from d
      join thanh_tuu_bac b on b.ma = d.ma and b.bac = d.bac
    on conflict (hoc_sinh_id, ma, bac, mua, mon) do nothing
    returning mon, exp, xu
  )
  select jsonb_build_object('ma', p_ma, 'bac', p_bac, 'ten', (select l.ten from thanh_tuu_loai l where l.ma = p_ma),
                            'exp', coalesce(sum(g.exp), 0)::int, 'xu', coalesce(sum(g.xu), 0)::int, 'mon', min(g.mon), 'moi', count(*) > 0)
    into v_kq from ghi g;
  return v_kq;
end $function$;
