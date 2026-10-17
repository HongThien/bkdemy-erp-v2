-- Thùy 17/10: luật "2 cuối / 2 đầu lớp" KHÔNG áp khi QUÁ NỬA lớp cùng điểm với em (vd 9/10 bạn cùng 50% thì không ai là "2 cuối lớp" — rơi về luật so TB).
-- Hai mốc theo TB lớp (<85% / >115%) giữ nguyên.
CREATE OR REPLACE FUNCTION public.fn_botro_et_btvn(p_hs uuid, p_n integer DEFAULT 4)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_et jsonb; v_bt jsonb;
begin
  if not public.la_thanh_vien() then return '{}'::jsonb; end if;
  with b as (  -- 4 buổi ET gần nhất em có điểm
    select sp.buoi_hoc_id, bh.ngay, bh.lop_id
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = p_hs and sp.phase = 'et' and bh.trang_thai <> 'huy'
    group by sp.buoi_hoc_id, bh.ngay, bh.lop_id order by bh.ngay desc limit greatest(1, least(coalesce(p_n, 4), 12))
  ),
  diem as (  -- điểm từng bạn mỗi buổi đó
    select sp.buoi_hoc_id, g.hoc_sinh_id, 100.0 * avg(case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end) as d
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
    where sp.phase = 'et' and sp.buoi_hoc_id in (select buoi_hoc_id from b)
    group by sp.buoi_hoc_id, g.hoc_sinh_id
  ),
  th as (
    select d.buoi_hoc_id, avg(d.d) as tb, count(*) as n,
           (array_agg(d.d order by d.d asc))[least(2, count(*))] as thap2, (array_agg(d.d order by d.d desc))[least(2, count(*))] as cao2
    from diem d group by d.buoi_hoc_id
  ),
  x as (
    select b.ngay, b.buoi_hoc_id, em.d as diem, th.tb, th.n, th.thap2, th.cao2,
           (select count(*) from diem o where o.buoi_hoc_id = b.buoi_hoc_id and o.d > em.d) + 1 as hang,
           (select count(*) from diem o where o.buoi_hoc_id = b.buoi_hoc_id and o.d = em.d) as so_bang
    from b join diem em on em.buoi_hoc_id = b.buoi_hoc_id and em.hoc_sinh_id = p_hs join th on th.buoi_hoc_id = b.buoi_hoc_id
  ),
  m as (
    select x.*,
      case when x.diem < x.tb * 0.85 or (x.n >= 4 and x.so_bang * 2 <= x.n and x.diem < x.tb and x.diem <= x.thap2) then 'do_dam'
           when x.diem < x.tb then 'do_nhat'
           when x.diem > x.tb * 1.15 or (x.n >= 4 and x.so_bang * 2 <= x.n and x.diem > x.tb and x.diem >= x.cao2) then 'xanh'
           else 'xanh_nhat' end as mau
    from x
  )
  select coalesce(jsonb_agg(jsonb_build_object('buoi_id', buoi_hoc_id, 'ngay', ngay, 'diem', round(diem::numeric, 1), 'tb_lop', round(tb::numeric, 1), 'n', n,
      'hang', hang, 'so_bang', so_bang, 'mau', mau,
      'ly_do', case mau when 'do_dam' then case when diem < tb * 0.85 then 'dưới 85% TB lớp' else 'thuộc 2 cuối lớp' end
                        when 'do_nhat' then 'từ 85% TB lớp đến TB lớp' when 'xanh' then case when diem > tb * 1.15 then 'trên 115% TB lớp' else 'thuộc 2 đầu lớp' end
                        else 'bằng hoặc trên TB lớp' end) order by ngay desc), '[]'::jsonb) into v_et from m;

  select coalesce(jsonb_agg(jsonb_build_object('buoi_id', t.buoi_hoc_id, 'ngay', t.ngay, 'd', t.d, 'c', t.c, 's', t.s, 'tong', t.d + t.c + t.s,
      'pct', round(100.0 * t.d / nullif(t.d + t.c + t.s, 0))) order by t.ngay desc), '[]'::jsonb) into v_bt
  from (
    select sp.buoi_hoc_id, bh.ngay,
           count(*) filter (where g.result = 'correct') as d, count(*) filter (where g.result = 'partial') as c, count(*) filter (where g.result = 'wrong') as s
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = p_hs and sp.phase = 'btvn' and bh.trang_thai <> 'huy'
    group by sp.buoi_hoc_id, bh.ngay order by bh.ngay desc limit greatest(1, least(coalesce(p_n, 4), 12))
  ) t;
  return jsonb_build_object('et', v_et, 'btvn', v_bt);
end $function$
;
