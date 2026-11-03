-- ============================================================================
-- 202611031736 — phong_giam_doc
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 03/11 — "Cần phòng làm việc của Thùy: Thùy quản lý Trưởng vận hành là Lộc và trưởng bộ môn là Trang, Ngọc.
--   Logic như cũ: click vào ai ra việc detail của người đó. Lộc chưa có cơ cấu phòng vận hành thì cứ để tạm Lộc ở đấy."
--
-- CÁCH (theo GHẾ, không gõ tên/uuid — đổi người = đổi ghế trên sơ đồ tổ chức, phòng tự theo):
--   • Giám đốc = người giữ ghế GỐC 'truong' của team 'core' (_phong_la_gd). Cấp phòng này nằm TRÊN phòng trưởng bộ môn.
--   • Trưởng vận hành = ghế gốc 'truong' của team 'ops' (03/11: Lộc). Chưa có cơ cấu phòng vận hành ⇒ chỉ ngồi đó, không số.
--   • Trưởng bộ môn của môn X = ghế cao nhất (gần gốc nhất) trong cây team 'gv' môn X, cấp truong/pho, KHÁC người xem
--     (Toán: gốc là Thùy ⇒ xuống Trang · KHTN ⇒ Ngọc · Tiếng Anh ⇒ anh Hoà) — khớp _phong_mon_cua_toi đang dùng cho phòng TBM.
--     Môn có lớp đang học mà chưa có ai ⇒ ghế trống đỏ (như ô chưa có trưởng khối).
--   • Số trên đầu trưởng bộ môn = gộp các ghế trưởng khối của môn đó (một nguồn: _phong_ghe_tbm_core):
--     hiệu suất = trung bình theo số TA đã có số; việc / trễ / gậy = cộng.
--   • Bấm trưởng bộ môn ⇒ phòng trưởng bộ môn của môn đó (fn_phong_ghe_tbm_mon) ⇒ bấm trưởng khối ⇒ phòng trưởng khối (hàm sẵn có).
--   • fn_phong_ghe_tbm: thân dời sang _phong_ghe_tbm_core(p_mon) (NULL = phạm vi của người xem, đúng như cũ).
--
-- MẤT GÌ: không xoá/drop gì. Viết lại fn_phong_ghe_tbm (thân dời sang core, kết quả không đổi).
-- ============================================================================

create or replace function public._phong_la_gd()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from vi_tri v join team t on t.id = v.team_id and t.ma = 'core'
                  where v.cha_id is null and v.cap = 'truong' and v.nhan_su_id = public.current_nhan_su_id())
$$;

create or replace function public.fn_phong_la_gd()
returns boolean language sql stable security definer set search_path = public as $$ select public._phong_la_gd() $$;

-- ── Ghế trưởng khối của phòng trưởng bộ môn — lõi có lọc môn ─────────────────
create or replace function public._phong_ghe_tbm_core(p_mon text[])
 RETURNS TABLE(khoa text, nhan_su_id uuid, ho_ten text, anh_url text, o text[], mon text, khoi text, so_ta integer, so_ta_co_hs integer, hieu_suat numeric, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
#variable_conflict use_column
begin
  return query
  with o_ds as (   -- ô của phòng = lớp đang học, đúng môn của phòng (và đúng môn được hỏi)
    select distinct l.mon, l.khoi from lop l
     where l.trang_thai = 'dang_hoc' and l.khoi is not null and public._phong_trong_pham_vi(l.mon, l.khoi)
       and (p_mon is null or l.mon = any(p_mon))
  ),
  ghe as (
    select 'tk:' || q.nhan_su_id as khoa, q.nhan_su_id, null::text as mon, null::text as khoi,
           array_agg((case when q.mon = 'Toán' then '' else q.mon || ' ' end) || q.khoi
                     order by q.mon, coalesce(substring(q.khoi from '^[0-9]+')::int, 0), q.khoi) as o,
           min(q.mon) as m_sx, min(coalesce(substring(q.khoi from '^[0-9]+')::int, 0)) as k_sx
      from phan_cong_quan_ly_khoi q
      join o_ds on o_ds.mon = q.mon and o_ds.khoi = q.khoi
      join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
     where q.vai = 'truong'
     group by q.nhan_su_id
    union all
    select 'o:' || o_ds.mon || '|' || o_ds.khoi, null, o_ds.mon, o_ds.khoi,
           array[(case when o_ds.mon = 'Toán' then '' else o_ds.mon || ' ' end) || o_ds.khoi],
           o_ds.mon, coalesce(substring(o_ds.khoi from '^[0-9]+')::int, 0)
      from o_ds
     where not exists (select 1 from phan_cong_quan_ly_khoi q
                        join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
                       where q.mon = o_ds.mon and q.khoi = o_ds.khoi and q.vai = 'truong')
  ),
  ta_ghe as (
    select g.khoa, t.nhan_su_id as ta from ghe g cross join lateral public._phong_ta_cua_tk(g.nhan_su_id) t where g.nhan_su_id is not null
    union all
    select g.khoa, t.nhan_su_id from ghe g cross join lateral public._phong_ta_cua_o(g.mon, g.khoi) t where g.nhan_su_id is null
  ),
  cs as (
    select g.khoa, c.* from ghe g
    cross join lateral public._phong_chi_so_pv(
      array(select x.ta from ta_ghe x where x.khoa = g.khoa),
      case when g.nhan_su_id is not null then public._phong_lop_cua_tk(g.nhan_su_id) else public._phong_lop_cua_o(g.mon, g.khoi) end) c
  )
  select g.khoa, g.nhan_su_id, n.ho_ten, n.anh_url, g.o, g.mon, g.khoi,
         count(x.ta)::int, count(cs.hieu_suat)::int, round(avg(cs.hieu_suat), 1),
         coalesce(sum(cs.viec_tuan), 0)::int, coalesce(sum(cs.dang_lam), 0)::int, coalesce(sum(cs.da_xong), 0)::int,
         coalesce(sum(cs.tre_han), 0)::int, coalesce(sum(cs.qua_han), 0)::int, coalesce(sum(cs.gay_thang), 0)::int
    from ghe g
    left join nhan_su n on n.id = g.nhan_su_id
    left join ta_ghe x on x.khoa = g.khoa
    left join cs on cs.khoa = x.khoa and cs.nhan_su_id = x.ta
   group by g.khoa, g.nhan_su_id, n.ho_ten, n.anh_url, g.o, g.mon, g.khoi, g.m_sx, g.k_sx
   order by g.m_sx, g.k_sx, g.khoa;
end $function$;

create or replace function public.fn_phong_ghe_tbm()
 RETURNS TABLE(khoa text, nhan_su_id uuid, ho_ten text, anh_url text, o text[], mon text, khoi text, so_ta integer, so_ta_co_hs integer, hieu_suat numeric, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn xem được'; end if;
  return query select * from public._phong_ghe_tbm_core(null);
end $function$;

-- Giám đốc bấm 1 trưởng bộ môn ⇒ phòng trưởng bộ môn của đúng môn đó.
create or replace function public.fn_phong_ghe_tbm_mon(p_mon text)
 RETURNS TABLE(khoa text, nhan_su_id uuid, ho_ten text, anh_url text, o text[], mon text, khoi text, so_ta integer, so_ta_co_hs integer, hieu_suat numeric, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
begin
  if not public._phong_la_gd() then raise exception 'Chỉ phòng Giám đốc xem được phòng trưởng bộ môn khác'; end if;
  return query select * from public._phong_ghe_tbm_core(array[p_mon]);
end $function$;

-- ── Phòng Giám đốc: trưởng vận hành + trưởng bộ môn từng môn ─────────────────
create or replace function public.fn_phong_ghe_gd()
 RETURNS TABLE(khoa text, vai text, nhan_su_id uuid, ho_ten text, anh_url text, mon text, so_ghe integer, so_ta integer,
               hieu_suat numeric, viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
#variable_conflict use_column
declare v_me uuid := public.current_nhan_su_id();
begin
  if not public._phong_la_gd() then raise exception 'Chỉ Giám đốc xem được phòng này'; end if;
  return query
  with recursive
  -- cây GV: độ sâu từng ghế (gốc = 0), môn theo gốc
  cay as (
    select v.id, v.nhan_su_id, v.cap, v.mon, 0 as sau from vi_tri v join team t on t.id = v.team_id and t.ma = 'gv' where v.cha_id is null
    union all
    select c.id, c.nhan_su_id, c.cap, cay.mon, cay.sau + 1 from vi_tri c join cay on c.cha_id = cay.id
  ),
  mon_ds as (select distinct l.mon from lop l where l.trang_thai = 'dang_hoc' and l.mon is not null),
  tbm as (   -- mỗi môn: ghế quản lý cao nhất không phải người xem
    select distinct on (cay.mon) cay.mon, cay.nhan_su_id
      from cay join nhan_su n on n.id = cay.nhan_su_id and n.trang_thai = 'dang_lam'
     where cay.cap in ('truong', 'pho') and cay.nhan_su_id is distinct from v_me
     order by cay.mon, cay.sau, (cay.cap = 'truong') desc, n.ho_ten
  ),
  so as (
    select m.mon, count(*)::int as so_ghe, coalesce(sum(g.so_ta), 0)::int as so_ta,
           round(sum(g.hieu_suat * g.so_ta_co_hs) / nullif(sum(g.so_ta_co_hs) filter (where g.hieu_suat is not null), 0), 1) as hs,
           coalesce(sum(g.viec_tuan), 0)::int as vt, coalesce(sum(g.dang_lam), 0)::int as dl, coalesce(sum(g.da_xong), 0)::int as dx,
           coalesce(sum(g.tre_han), 0)::int as tr, coalesce(sum(g.qua_han), 0)::int as qh, coalesce(sum(g.gay_thang), 0)::int as gy
      from mon_ds m cross join lateral public._phong_ghe_tbm_core(array[m.mon]) g
     group by m.mon
  ),
  ops as (
    select v.nhan_su_id from vi_tri v join team t on t.id = v.team_id and t.ma = 'ops'
      join nhan_su n on n.id = v.nhan_su_id and n.trang_thai = 'dang_lam'
     where v.cha_id is null and v.cap = 'truong'
  )
  select 'vh:' || o.nhan_su_id, 'van_hanh', o.nhan_su_id, n.ho_ten, n.anh_url, null::text, 0, 0,
         null::numeric, 0, 0, 0, 0, 0, 0
    from ops o join nhan_su n on n.id = o.nhan_su_id
  union all
  select 'bm:' || m.mon, 'bo_mon', tb.nhan_su_id, n.ho_ten, n.anh_url, m.mon, coalesce(s.so_ghe, 0), coalesce(s.so_ta, 0),
         s.hs, coalesce(s.vt, 0), coalesce(s.dl, 0), coalesce(s.dx, 0), coalesce(s.tr, 0), coalesce(s.qh, 0), coalesce(s.gy, 0)
    from mon_ds m
    left join tbm tb on tb.mon = m.mon
    left join nhan_su n on n.id = tb.nhan_su_id
    left join so s on s.mon = m.mon;
end $function$;

revoke execute on function public._phong_la_gd() from public, anon;
revoke execute on function public.fn_phong_la_gd() from public, anon;
revoke execute on function public._phong_ghe_tbm_core(text[]) from public, anon;
revoke execute on function public.fn_phong_ghe_tbm_mon(text) from public, anon;
revoke execute on function public.fn_phong_ghe_gd() from public, anon;
grant execute on function public._phong_la_gd(), public.fn_phong_la_gd(), public._phong_ghe_tbm_core(text[]),
  public.fn_phong_ghe_tbm_mon(text), public.fn_phong_ghe_gd() to authenticated;
