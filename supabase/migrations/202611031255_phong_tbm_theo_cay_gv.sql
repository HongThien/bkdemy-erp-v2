-- PHÒNG TRƯỞNG BỘ MÔN — phạm vi THEO CÂY GIÁO VIÊN (Thùy 03/11: phòng của Trang "chỉ Toán").
-- Trưởng bộ môn = người giữ ghế trưởng/phó trong cây team GV của một môn; môn = môn ở GỐC cây (vi_tri.mon của ghế cha_id null).
--   Đo 03/11: gốc KHTN "Trưởng bộ môn KHTN" (anh Ngọc) · gốc Tiếng Anh (Hoà) · gốc Toán "Giám đốc trung tâm" (Thùy);
--   Trang ngồi "Trưởng khối THCS/THPT", "Giáo viên trưởng" trong cây Toán ⇒ phòng Trang = Toán.
-- Admin hệ thống ⇒ mọi môn. Không ghế GV quản lý nào nhưng toàn hệ QLCL ⇒ mọi môn (như cũ).
-- CHỈ thu hẹp PHÒNG LÀM VIỆC — quyền toàn hệ của Trang ở màn khác (hậu kiểm, gậy, chốt tuần…) KHÔNG đổi (_trong_pham_vi giữ nguyên).
-- Không đổi ghế của ai: đổi người quản môn = đổi ghế ở cây GV trên màn, phòng tự theo.

create or replace function public._phong_mon_cua_toi()
 returns text[]
 language sql stable security definer set search_path to 'public'
as $$
  with recursive len as (   -- từ các ghế trưởng/phó của tôi trong team GV đi ngược lên gốc
    select v.id, v.cha_id, v.mon from vi_tri v join team t on t.id = v.team_id and t.ma = 'gv'
     where v.nhan_su_id = public.current_nhan_su_id() and v.cap in ('truong', 'pho')
    union
    select c.id, c.cha_id, c.mon from vi_tri c join len on c.id = len.cha_id
  ),
  mon as (select array_agg(distinct l.mon) filter (where l.mon is not null) as m from len l where l.cha_id is null)
  select case when public._task_la_admin() then null
              when (select cardinality(coalesce(m, '{}')) from mon) > 0 then (select m from mon)
              else null end      -- không có ghế GV quản lý (toàn hệ QLCL) ⇒ mọi môn
$$;

-- Ô (môn × khối) thuộc phòng của tôi = trong phạm vi chung VÀ đúng môn của phòng.
create or replace function public._phong_trong_pham_vi(p_mon text, p_khoi text)
 returns boolean
 language sql stable security definer set search_path to 'public'
as $$
  select public._trong_pham_vi(p_mon, p_khoi)
     and (public._phong_mon_cua_toi() is null or p_mon = any(public._phong_mon_cua_toi()))
$$;

create or replace function public.fn_phong_mon_tbm()
 returns text[]
 language sql stable security definer set search_path to 'public'
as $$ select public._phong_mon_cua_toi() $$;

create or replace function public._phong_ta_cua_tk(p_tk uuid)
 returns table(nhan_su_id uuid, khoi text[])
 language sql stable security definer set search_path to 'public'
as $$
  select pc.nhan_su_id, array_agg(distinct l.khoi order by l.khoi)
    from phan_cong_quan_ly_khoi q
    join lop l on l.mon = q.mon and l.khoi = q.khoi and l.trang_thai = 'dang_hoc'
    join phan_cong_lop pc on pc.lop_id = l.id and pc.vai_tro = 'tg'
    join nhan_su n on n.id = pc.nhan_su_id and n.trang_thai = 'dang_lam' and not n.an_xep_hang
   where q.nhan_su_id = p_tk and q.vai = 'truong' and public._phong_trong_pham_vi(q.mon, q.khoi)
   group by pc.nhan_su_id
$$;

create or replace function public._phong_ta_cua_o(p_mon text, p_khoi text)
 returns table(nhan_su_id uuid, khoi text[])
 language sql stable security definer set search_path to 'public'
as $$
  select pc.nhan_su_id, array_agg(distinct l.khoi order by l.khoi)
    from lop l
    join phan_cong_lop pc on pc.lop_id = l.id and pc.vai_tro = 'tg'
    join nhan_su n on n.id = pc.nhan_su_id and n.trang_thai = 'dang_lam' and not n.an_xep_hang
   where l.mon = p_mon and l.khoi = p_khoi and l.trang_thai = 'dang_hoc' and public._phong_trong_pham_vi(p_mon, p_khoi)
   group by pc.nhan_su_id
$$;

-- Thân như mig 202611031246, chỉ đổi _trong_pham_vi → _phong_trong_pham_vi ở danh sách ô.
create or replace function public.fn_phong_ghe_tbm()
 returns table(khoa text, nhan_su_id uuid, ho_ten text, anh_url text, o text[], mon text, khoi text,
               so_ta integer, so_ta_co_hs integer, hieu_suat numeric,
               viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 language plpgsql stable security definer set search_path to 'public'
as $$
#variable_conflict use_column
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn xem được'; end if;
  return query
  with o_ds as (   -- ô của phòng = lớp đang học, đúng môn của phòng
    select distinct l.mon, l.khoi from lop l
     where l.trang_thai = 'dang_hoc' and l.khoi is not null and public._phong_trong_pham_vi(l.mon, l.khoi)
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
  cs as (select * from public._phong_chi_so(array(select distinct x.ta from ta_ghe x)))
  select g.khoa, g.nhan_su_id, n.ho_ten, n.anh_url, g.o, g.mon, g.khoi,
         count(x.ta)::int, count(cs.hieu_suat)::int, round(avg(cs.hieu_suat), 1),
         coalesce(sum(cs.viec_tuan), 0)::int, coalesce(sum(cs.dang_lam), 0)::int, coalesce(sum(cs.da_xong), 0)::int,
         coalesce(sum(cs.tre_han), 0)::int, coalesce(sum(cs.qua_han), 0)::int, coalesce(sum(cs.gay_thang), 0)::int
    from ghe g
    left join nhan_su n on n.id = g.nhan_su_id
    left join ta_ghe x on x.khoa = g.khoa
    left join cs on cs.nhan_su_id = x.ta
   group by g.khoa, g.nhan_su_id, n.ho_ten, n.anh_url, g.o, g.mon, g.khoi, g.m_sx, g.k_sx
   order by g.m_sx, g.k_sx, g.khoa;
end $$;

-- Báo cáo Sư phạm "Mọi khối" của PHÒNG (đúng môn của phòng) — cùng lõi _troly_bc_theo_lop.
create or replace function public.fn_troly_phong_lay(p_so_ngay integer DEFAULT 14)
 returns jsonb
 language plpgsql security definer set search_path to 'public'
as $$
declare
  v_khoi text[];
  v_lops text[];
begin
  select coalesce(array_agg(distinct l.khoi), '{}'), coalesce(array_agg(l.ten_lop), '{}') into v_khoi, v_lops
    from lop l where l.khoi is not null and public._phong_trong_pham_vi(l.mon, l.khoi);
  if cardinality(v_lops) = 0 then raise exception 'Phòng của bạn chưa có khối nào.' using errcode = '42501'; end if;
  return public._troly_bc_theo_lop(p_so_ngay, v_khoi, v_lops,
    'Báo cáo các khối của bộ môn' || coalesce(' ' || array_to_string(public._phong_mon_cua_toi(), ' · '), ''),
    'Lọc từ báo cáo Sư phạm toàn trung tâm theo lớp thuộc bộ môn của phòng. Cảnh báo bất thường chung chưa lọc được theo khối nên không hiện ở đây.');
end $$;

revoke execute on function public._phong_mon_cua_toi() from public, anon;
revoke execute on function public._phong_trong_pham_vi(text, text) from public, anon;
revoke execute on function public.fn_troly_phong_lay(integer) from public, anon;
grant execute on function public.fn_troly_phong_lay(integer) to authenticated;
