-- PHÒNG TRƯỞNG BỘ MÔN (Thùy 03/11, sửa tiếp mig 202611031237): "Phó giám đốc chuyên môn" gọi đúng là TRƯỞNG BỘ MÔN — mỗi môn một người
-- (vd anh Ngọc = trưởng bộ môn KHTN). Chế độ phòng 'pgd' đổi tên 'tbm' và mở cho QUẢN LÝ MÔN (_quan_ly_mon), không chỉ người toàn hệ.
-- Phạm vi = phạm vi của tôi (_trong_pham_vi): toàn hệ ⇒ mọi môn · quản lý môn ⇒ môn của mình.
--
-- Ô chưa có trưởng khối (đo 03/11: KHTN 7 · 8 · 9 chưa phân công) KHÔNG được biến mất im lặng (spec-truong-khoi §2.1):
-- mỗi ô như vậy = 1 "ghế trống" trong phòng, vẫn mang chỉ số gộp TA của ô, bấm vào xem TA của ô đó.
--
-- fn_phong_truong_khoi (mig 1237) không đổi được cột trả về bằng create or replace ⇒ hàm mới fn_phong_ghe_tbm() thay nó trên màn;
-- fn_phong_truong_khoi để nguyên (không xoá — Luật xoá: hỏi CEO trước).

-- ── Chế độ phòng: 'tbm' = toàn hệ QLCL hoặc quản lý môn ──
create or replace function public.fn_phong_che_do()
 returns text
 language sql stable security definer set search_path to 'public'
as $$ select case when public._qlcl_toan_he() or cardinality(coalesce(public._quan_ly_mon(), '{}')) > 0 then 'tbm' else 'tk' end $$;

-- Môn của phòng trưởng bộ môn: null = toàn hệ (mọi môn) · mảng môn = quản lý môn.
create or replace function public.fn_phong_mon_tbm()
 returns text[]
 language sql stable security definer set search_path to 'public'
as $$ select case when public._qlcl_toan_he() then null else public._quan_ly_mon() end $$;

-- TA của một trưởng khối: chỉ các ô vừa do người đó làm trưởng VỪA nằm trong phạm vi của tôi.
create or replace function public._phong_ta_cua_tk(p_tk uuid)
 returns table(nhan_su_id uuid, khoi text[])
 language sql stable security definer set search_path to 'public'
as $$
  select pc.nhan_su_id, array_agg(distinct l.khoi order by l.khoi)
    from phan_cong_quan_ly_khoi q
    join lop l on l.mon = q.mon and l.khoi = q.khoi and l.trang_thai = 'dang_hoc'
    join phan_cong_lop pc on pc.lop_id = l.id and pc.vai_tro = 'tg'
    join nhan_su n on n.id = pc.nhan_su_id and n.trang_thai = 'dang_lam' and not n.an_xep_hang
   where q.nhan_su_id = p_tk and q.vai = 'truong' and public._trong_pham_vi(q.mon, q.khoi)
   group by pc.nhan_su_id
$$;

-- TA của một ô (môn × khối) — cho ghế trống (ô chưa có trưởng khối).
create or replace function public._phong_ta_cua_o(p_mon text, p_khoi text)
 returns table(nhan_su_id uuid, khoi text[])
 language sql stable security definer set search_path to 'public'
as $$
  select pc.nhan_su_id, array_agg(distinct l.khoi order by l.khoi)
    from lop l
    join phan_cong_lop pc on pc.lop_id = l.id and pc.vai_tro = 'tg'
    join nhan_su n on n.id = pc.nhan_su_id and n.trang_thai = 'dang_lam' and not n.an_xep_hang
   where l.mon = p_mon and l.khoi = p_khoi and l.trang_thai = 'dang_hoc' and public._trong_pham_vi(p_mon, p_khoi)
   group by pc.nhan_su_id
$$;

create or replace function public.fn_phong_cap_duoi_cua(p_tk uuid)
 returns table(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[],
               hieu_suat numeric, hieu_suat_du boolean,
               viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 language plpgsql stable security definer set search_path to 'public'
as $$
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn xem được phòng của trưởng khối khác'; end if;
  return query
  select n.id, n.ho_ten, n.anh_url, ds.khoi,
         c.hieu_suat, c.hieu_suat_du, c.viec_tuan, c.dang_lam, c.da_xong, c.tre_han, c.qua_han, c.gay_thang
    from public._phong_ta_cua_tk(p_tk) ds
    join nhan_su n on n.id = ds.nhan_su_id
    join public._phong_chi_so(array(select d.nhan_su_id from public._phong_ta_cua_tk(p_tk) d)) c on c.nhan_su_id = ds.nhan_su_id
   order by n.ho_ten;
end $$;

-- Phòng của một ô chưa có trưởng khối (cùng hình dạng fn_phong_cap_duoi).
create or replace function public.fn_phong_cap_duoi_o(p_mon text, p_khoi text)
 returns table(nhan_su_id uuid, ho_ten text, anh_url text, khoi text[],
               hieu_suat numeric, hieu_suat_du boolean,
               viec_tuan integer, dang_lam integer, da_xong integer, tre_han integer, qua_han integer, gay_thang integer)
 language plpgsql stable security definer set search_path to 'public'
as $$
begin
  if public.fn_phong_che_do() <> 'tbm' then raise exception 'Chỉ phòng Trưởng bộ môn xem được'; end if;
  return query
  select n.id, n.ho_ten, n.anh_url, ds.khoi,
         c.hieu_suat, c.hieu_suat_du, c.viec_tuan, c.dang_lam, c.da_xong, c.tre_han, c.qua_han, c.gay_thang
    from public._phong_ta_cua_o(p_mon, p_khoi) ds
    join nhan_su n on n.id = ds.nhan_su_id
    join public._phong_chi_so(array(select d.nhan_su_id from public._phong_ta_cua_o(p_mon, p_khoi) d)) c on c.nhan_su_id = ds.nhan_su_id
   order by n.ho_ten;
end $$;

-- ── Ghế trong phòng trưởng bộ môn: 1 dòng / trưởng khối (ô trong phạm vi) + 1 dòng / ô chưa có trưởng khối ──
-- khoa = 'tk:<uuid>' hoặc 'o:<môn>|<khối>' (khoá ổn định để vẽ + nhớ ghế đang xem). Chỉ số = gộp TA (một nguồn: _phong_chi_so).
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
  with o_ds as (   -- ô trong phạm vi = lớp đang học
    select distinct l.mon, l.khoi from lop l
     where l.trang_thai = 'dang_hoc' and l.khoi is not null and public._trong_pham_vi(l.mon, l.khoi)
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

revoke execute on function public._phong_ta_cua_o(text, text) from public, anon;
revoke execute on function public.fn_phong_mon_tbm() from public, anon;
revoke execute on function public.fn_phong_cap_duoi_o(text, text) from public, anon;
revoke execute on function public.fn_phong_ghe_tbm() from public, anon;
grant execute on function public.fn_phong_mon_tbm() to authenticated;
grant execute on function public.fn_phong_cap_duoi_o(text, text) to authenticated;
grant execute on function public.fn_phong_ghe_tbm() to authenticated;
