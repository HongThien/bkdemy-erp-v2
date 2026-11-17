-- 17/11/2026 · Thùy duyệt scope điểm 5 — bước 2 / 2: HS YẾU = em có ≥ 1 NHÓM YẾU ở Báo cáo tuần + QLCL; Báo cáo tuần có thêm chỉ số "Nhóm yếu".
-- fn_bctk_so: HS yếu đầu/cuối · bổ trợ (HS yếu đầu tuần, được bổ trợ, độ phủ, hết yếu sau ca) · danh sách HS còn yếu (kèm tên nhóm yếu) đếm theo so_nhom_yeu;
--   thêm khối 'nhom_yeu' (đầu · cuối · giảm · tỉ lệ) cho toàn khối + từng lớp; phien_ban 2 + 'hs_yeu_theo' = 'nhom'. Báo cáo đã nộp giữ bản snap cũ (phien_ban 1 = theo dạng).
-- fn_qlcl_tong_quan: số HS yếu hiện tại + đầu tuần theo nhóm · fn_qlcl_nhom_yeu: đếm NHÓM YẾU thật (bỏ cách "nhóm có chứa dạng yếu") · fn_qlcl_dang_yeu_hs: danh sách HS yếu theo nhóm.
-- Chỉ số DẠNG yếu giữ nguyên. Sinh từ thân ĐANG CHẠY (chốt md5).
do $$ begin
  if md5(pg_get_functiondef('public.fn_bctk_so'::regproc)) <> '01ee5cea0537bebd13c04bd04b8cfcf3' then raise exception 'Hàm fn_bctk_so đã bị đổi sau lúc sinh — sinh lại'; end if;
  if md5(pg_get_functiondef('public.fn_qlcl_tong_quan'::regproc)) <> '3b707a4cf231dda886f24852d6286de8' then raise exception 'Hàm fn_qlcl_tong_quan đã bị đổi sau lúc sinh — sinh lại'; end if;
  if md5(pg_get_functiondef('public.fn_qlcl_nhom_yeu'::regproc)) <> '95759cf58b9eaece516dfb0c1e518177' then raise exception 'Hàm fn_qlcl_nhom_yeu đã bị đổi sau lúc sinh — sinh lại'; end if;
  if md5(pg_get_functiondef('public.fn_qlcl_dang_yeu_hs'::regproc)) <> '1c84091e27c7b4c5d4606e72b4d18aa6' then raise exception 'Hàm fn_qlcl_dang_yeu_hs đã bị đổi sau lúc sinh — sinh lại'; end if;
end $$;

CREATE OR REPLACE FUNCTION public._bctk_ny(ny_dau bigint, ny_cuoi bigint)
 RETURNS jsonb
 LANGUAGE sql
 IMMUTABLE
AS $function$
  -- 17/11: chỉ số Nhóm yếu của Báo cáo tuần (đầu tuần · cuối tuần · giảm · tỉ lệ giảm)
  select jsonb_build_object('nhom_yeu', jsonb_build_object('dau', ny_dau, 'cuoi', ny_cuoi, 'giam', ny_dau - ny_cuoi, 'ti_le_giam', public._bctk_pct(ny_dau - ny_cuoi, ny_dau)))
$function$;
revoke execute on function public._bctk_ny(bigint, bigint) from public, anon;

CREATE OR REPLACE FUNCTION public.fn_bctk_so(p_o jsonb, p_tu date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_den date := p_tu + 6;
  v_t1 date := p_tu + 7;                                                       -- ảnh cuối kỳ = ảnh đầu tuần sau
  v_tu_ts timestamptz := (p_tu::timestamp at time zone 'Asia/Ho_Chi_Minh');
  v_t1_ts timestamptz := (v_t1::timestamp at time zone 'Asia/Ho_Chi_Minh');
  v jsonb;
begin
  with o as (select x->>'mon' as mon, x->>'khoi' as khoi from jsonb_array_elements(p_o) x),
  lop_o as (
    select l.id, l.ten_lop, l.mon, l.khoi from lop l join o on o.mon = l.mon and o.khoi = l.khoi
     where l.trang_thai = 'dang_hoc'
        or exists (select 1 from buoi_hoc b where b.lop_id = l.id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between p_tu and v_den)
  ),
  -- 1. ET chấm đúng hạn — theo buổi, lần đóng ĐẦU ≤ hạn (cùng cách Gậy / Hiệu suất TA); chỉ việc đã tới hạn hoặc đã đóng
  et_viec as (
    select distinct on (v.buoi_id) v.lop_id, v.buoi_id, v.han, public._viec_dong_dau(v.buoi_id, 'et', v.dong_at) as dd
      from public.fn_viec_buoi_thuong_lh(p_tu, v_den) v
     where v.tab = 'et' and v.vai = 'tg' and not v.et_online and v.lop_id in (select id from lop_o)
       and (v.dong_at is not null or v.han <= now())
  ),
  -- 1+2. điểm ET / BTVN theo LƯỢT (cùng nguồn bảng Học tập tuần) — trung bình toàn khối trên lượt, không trên trung bình lớp
  mx as (
    select lo.id as lop_id, p.pha, m.pct
      from lop_o lo cross join (values ('et'), ('btvn')) p(pha)
      cross join lateral public._troly_matrix(lo.id, p.pha, p_tu, v_den) m
     where m.status = 'done' and m.pct is not null
  ),
  -- 2. nộp BTVN (không tính xin phép)
  nop as (
    select b.lop_id, k.trang_thai_nop as t from btvn_ket_qua k join buoi_hoc b on b.id = k.buoi_hoc_id
     where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between p_tu and v_den
       and b.lop_id in (select id from lop_o) and k.trang_thai_nop is not null
  ),
  -- HS của ô trong kỳ (một em một lớp mỗi môn)
  hs as (
    select distinct on (hl.hoc_sinh_id, lo.mon) hl.hoc_sinh_id, lo.id as lop_id, lo.mon
      from hoc_sinh_lop hl join lop_o lo on lo.id = hl.lop_id
     where hl.ngay_vao <= v_den and (hl.ngay_roi is null or hl.ngay_roi >= p_tu)
     order by hl.hoc_sinh_id, lo.mon, hl.ngay_vao desc
  ),
  -- 3+4. ảnh dạng yếu đầu / cuối kỳ
  dau as (select z.*, hs.lop_id from dang_yeu_dau_tuan z join hs on hs.hoc_sinh_id = z.hoc_sinh_id and hs.mon = z.mon where z.tuan = p_tu),
  cuoi as (select z.*, hs.lop_id from dang_yeu_dau_tuan z join hs on hs.hoc_sinh_id = z.hoc_sinh_id and hs.mon = z.mon where z.tuan = v_t1),
  a as (select d.hoc_sinh_id, d.mon, e->>'ma_dang' as ma from dau d, jsonb_array_elements(d.dang) e),
  b as (select d.hoc_sinh_id, d.mon, e->>'ma_dang' as ma from cuoi d, jsonb_array_elements(d.dang) e),
  ra as (select a.* from a
          where not exists (select 1 from b where b.hoc_sinh_id = a.hoc_sinh_id and b.mon = a.mon and b.ma = a.ma)
            and exists (select 1 from cuoi c where c.hoc_sinh_id = a.hoc_sinh_id and c.mon = a.mon)),
  ra_bc as (select ra.* from ra where exists (     -- hết yếu NHỜ lần đo mới trong kỳ
              select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
               where g.hoc_sinh_id = ra.hoc_sinh_id and g.graded_at >= v_tu_ts and g.graded_at < v_t1_ts
                 and public._do_o_bdm(p.ma_cau, p.ma_dang) = ra.ma)),
  do_ky as (select hs.hoc_sinh_id from hs where exists (
              select 1 from gami_grades g where g.hoc_sinh_id = hs.hoc_sinh_id and g.graded_at >= v_tu_ts and g.graded_at < v_t1_ts)),
  -- 5. bổ trợ Yếu + Nhẹ đã thực hiện (em có mặt), quy môn qua ca
  bt as (
    select b.id as buoi_id, b.loai, x.hoc_sinh_id
      from buoi_hoc b
      left join ca_bo_tro cy on cy.id = b.ca_bo_tro_id
      left join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
      join buoi_hoc_hs x on x.buoi_hoc_id = b.id and x.diem_danh = 'co_mat'
      join hs on hs.hoc_sinh_id = x.hoc_sinh_id and hs.mon = coalesce(cy.mon, cn.mon)
     where b.loai in ('bo_tro_yeu', 'bo_tro_nhe') and b.trang_thai <> 'huy' and b.ngay between p_tu and v_den
  ),
  lop_so as (
    select lo.id, lo.ten_lop, lo.mon, lo.khoi,
      (select count(*) from et_viec e where e.lop_id = lo.id) as et_viec,
      (select count(*) from et_viec e where e.lop_id = lo.id and e.dd is not null and e.dd <= e.han) as et_dung,
      (select count(*) from mx where mx.lop_id = lo.id and mx.pha = 'et') as et_luot,
      (select round(avg(mx.pct), 1) from mx where mx.lop_id = lo.id and mx.pha = 'et') as et_tb,
      (select count(*) from nop where nop.lop_id = lo.id and nop.t <> 'xin_phep') as bt_can,
      (select count(*) from nop where nop.lop_id = lo.id and nop.t = 'nop_dung_han') as bt_dung,
      (select count(*) from nop where nop.lop_id = lo.id and nop.t = 'nop_muon') as bt_muon,
      (select count(*) from mx where mx.lop_id = lo.id and mx.pha = 'btvn') as bt_luot,
      (select round(avg(mx.pct), 1) from mx where mx.lop_id = lo.id and mx.pha = 'btvn') as bt_tb,
      (select sum(d.so_dang_yeu) from dau d where d.lop_id = lo.id) as dy_dau,
      (select sum(d.so_dang_yeu) from cuoi d where d.lop_id = lo.id) as dy_cuoi,
      (select count(*) filter (where d.so_nhom_yeu > 0) from dau d where d.lop_id = lo.id) as hy_dau,
      (select count(*) filter (where d.so_nhom_yeu > 0) from cuoi d where d.lop_id = lo.id) as hy_cuoi,
      (select sum(d.so_nhom_yeu) from dau d where d.lop_id = lo.id) as ny_dau,
      (select sum(d.so_nhom_yeu) from cuoi d where d.lop_id = lo.id) as ny_cuoi,
      (select count(*) from hs where hs.lop_id = lo.id) as si_so
    from lop_o lo
  ),
  co as (select exists (select 1 from dau) as co_dau, exists (select 1 from cuoi) as co_cuoi)
  select jsonb_build_object(
    'tu', p_tu, 'den', v_den, 'o', p_o, 'phien_ban', 2, 'hs_yeu_theo', 'nhom',   /* 17/11 Thùy: HS yếu = ≥ 1 NHÓM yếu (bản phien_ban 1 = theo dạng) */
    'co_anh_dau', co.co_dau, 'co_anh_cuoi', co.co_cuoi,     -- false = chưa có ảnh (chưa chụp) ⇒ số dạng yếu / HS yếu tương ứng không áp dụng
    'tong', public._bctk_nhom(
        (select count(*) from et_viec), (select count(*) from et_viec e where e.dd is not null and e.dd <= e.han),
        (select count(*) from mx where mx.pha = 'et'), (select round(avg(mx.pct), 1) from mx where mx.pha = 'et'),
        (select count(*) from nop where nop.t <> 'xin_phep'), (select count(*) from nop where nop.t = 'nop_dung_han'),
        (select count(*) from nop where nop.t = 'nop_muon'),
        (select count(*) from mx where mx.pha = 'btvn'), (select round(avg(mx.pct), 1) from mx where mx.pha = 'btvn'),
        case when co.co_dau then (select coalesce(sum(so_dang_yeu), 0) from dau) end,
        case when co.co_cuoi then (select coalesce(sum(so_dang_yeu), 0) from cuoi) end,
        case when co.co_dau then (select count(*) from dau where so_nhom_yeu > 0) end,
        case when co.co_cuoi then (select count(*) from cuoi where so_nhom_yeu > 0) end,
        (select count(*) from hs))
      || public._bctk_ny(case when co.co_dau then (select coalesce(sum(so_nhom_yeu), 0) from dau) end,
                         case when co.co_cuoi then (select coalesce(sum(so_nhom_yeu), 0) from cuoi) end)   /* 17/11: chỉ số Nhóm yếu */
      || jsonb_build_object(
        'dong_chay', case when co.co_dau and co.co_cuoi then jsonb_build_object(
            'vao', (select count(*) from b where not exists (select 1 from a where a.hoc_sinh_id = b.hoc_sinh_id and a.mon = b.mon and a.ma = b.ma)),
            'ra_bang_chung', (select count(*) from ra_bc),
            'ra_cua_so', (select count(*) from ra) - (select count(*) from ra_bc)) end,
        'do_phu', jsonb_build_object('so_hs', (select count(*) from hs), 'so_hs_co_do', (select count(*) from do_ky),
                                     'ti_le', public._bctk_pct((select count(*) from do_ky), (select count(*) from hs))),
        'bo_tro', jsonb_build_object(
            'ca_yeu', (select count(distinct buoi_id) from bt where loai = 'bo_tro_yeu'),
            'ca_nhe', (select count(distinct buoi_id) from bt where loai = 'bo_tro_nhe'),
            'luot_hs', (select count(*) from bt),
            'hs_yeu_dau', case when co.co_dau then (select count(*) from dau where so_nhom_yeu > 0) end,
            'hs_yeu_duoc_bt', case when co.co_dau then (select count(distinct bt.hoc_sinh_id) from bt join dau d on d.hoc_sinh_id = bt.hoc_sinh_id and d.so_nhom_yeu > 0) end,
            'do_phu', case when co.co_dau then public._bctk_pct(
                (select count(distinct bt.hoc_sinh_id) from bt join dau d on d.hoc_sinh_id = bt.hoc_sinh_id and d.so_nhom_yeu > 0),
                (select count(*) from dau where so_nhom_yeu > 0)) end,
            'het_yeu_sau_ca', case when co.co_dau and co.co_cuoi then (
                select count(distinct bt.hoc_sinh_id) from bt
                  join dau d on d.hoc_sinh_id = bt.hoc_sinh_id and d.so_nhom_yeu > 0
                  join cuoi c on c.hoc_sinh_id = bt.hoc_sinh_id and c.mon = d.mon and c.so_nhom_yeu = 0) end)),
    'lop', (select coalesce(jsonb_agg(
              jsonb_build_object('lop_id', s.id, 'ten_lop', s.ten_lop, 'mon', s.mon, 'khoi', s.khoi)
              || public._bctk_nhom(s.et_viec, s.et_dung, s.et_luot, s.et_tb, s.bt_can, s.bt_dung, s.bt_muon, s.bt_luot, s.bt_tb,
                                   case when co.co_dau then coalesce(s.dy_dau, 0) end, case when co.co_cuoi then coalesce(s.dy_cuoi, 0) end,
                                   case when co.co_dau then s.hy_dau end, case when co.co_cuoi then s.hy_cuoi end, s.si_so)
              || public._bctk_ny(case when co.co_dau then coalesce(s.ny_dau, 0) end, case when co.co_cuoi then coalesce(s.ny_cuoi, 0) end)
              order by s.mon, coalesce(substring(s.khoi from '^[0-9]+')::int, 0), s.khoi, s.ten_lop), '[]'::jsonb) from lop_so s),
    -- 4. HS còn yếu cuối kỳ + trạng thái xử lý (chưa xử lý xếp đầu)
    'hs_con_yeu', (select coalesce(jsonb_agg(jsonb_build_object(
              'hoc_sinh_id', h.id, 'ho_ten', h.ho_ten, 'ten_lop', lo.ten_lop, 'mon', c.mon, 'so_dang_yeu', c.so_dang_yeu, 'so_nhom_yeu', c.so_nhom_yeu,
              'nhom', (select coalesce(jsonb_agg(e->>'ten_nhom'), '[]'::jsonb) from jsonb_array_elements(c.nhom) e),
              'dang', (select coalesce(jsonb_agg(e->>'ten_dang'), '[]'::jsonb) from jsonb_array_elements(c.dang) e),
              'xu_ly', xl.xu_ly)
              order by (xl.xu_ly = 'chua') desc, c.so_nhom_yeu desc, c.so_dang_yeu desc, h.ho_ten), '[]'::jsonb)
            from cuoi c
            join hoc_sinh h on h.id = c.hoc_sinh_id
            join lop_o lo on lo.id = c.lop_id
            cross join lateral (select case
                when exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = c.hoc_sinh_id and y.mon = c.mon and y.trang_thai = 'dang_xu') then 'bo_tro_yeu'
                when exists (select 1 from bt where bt.hoc_sinh_id = c.hoc_sinh_id and bt.loai = 'bo_tro_nhe') then 'ca_nhe'
                when exists (select 1 from bo_tro_theo_doi t where t.hoc_sinh_id = c.hoc_sinh_id and t.mon = c.mon and t.trang_thai = 'theo_doi') then 'theo_doi'
                else 'chua' end as xu_ly) xl
           where c.so_nhom_yeu > 0)
  ) into v
  from co;
  return v;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_qlcl_tong_quan()
 RETURNS TABLE(mon text, khoi text, vai text, so_hs integer, so_hs_yeu integer, so_dang_yeu integer, so_can_tinh integer, tinh_at timestamp with time zone, dau_tuan_hs_yeu integer, dau_tuan_dang_yeu integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- 11/11 (audit timeout): CÙNG số bản cũ — bản cũ gọi _qlcl_hs_cua_o 4 lần + _qlcl_hs_can_tinh 1 lần cho MỖI ô (Giám đốc ~20 ô);
  -- giờ mỗi ô quét danh sách em đúng 1 lần, đếm cả 5 số trên cùng lượt đó. Luật "em cần tính lại" giữ nguyên chữ của _qlcl_hs_can_tinh.
  with p as materialized (select * from public.fn_pham_vi_cua_toi() where public.la_thanh_vien()),
  moc as materialized (select public._btyeu_moc_2_cua_so() as m, public._qlcl_tuan_nay() as tuan),
  dt as materialized (
    select z.mon, z.khoi, count(*) filter (where z.so_nhom_yeu > 0)::int as hs_yeu   /* 17/11: HS yếu = ≥ 1 nhóm yếu */, coalesce(sum(z.so_dang_yeu), 0)::int as dang_yeu
      from dang_yeu_dau_tuan z, moc where z.tuan = moc.tuan group by z.mon, z.khoi
  ),
  dt_mon as materialized (select distinct z.mon from dang_yeu_dau_tuan z, moc where z.tuan = moc.tuan),
  s as (
    select p.mon, p.khoi, p.vai,
           count(*)::int as so_hs,
           count(*) filter (where d.so_nhom_yeu > 0)::int as so_hs_yeu,
           coalesce(sum(d.so_dang_yeu), 0)::int as so_dang_yeu,
           count(*) filter (where d.hoc_sinh_id is null
                               or d.moc <> moc.m
                               or d.tinh_at < now() - interval '12 hours'
                               or exists (select 1 from gami_grades g where g.hoc_sinh_id = h.hoc_sinh_id and g.graded_at > d.tinh_at))::int as so_can_tinh,
           max(d.tinh_at) as tinh_at
      from p
      cross join moc
      join lateral public._qlcl_hs_cua_o(p.mon, p.khoi) h on true
      left join dang_yeu_hien_tai d on d.mon = p.mon and d.hoc_sinh_id = h.hoc_sinh_id
     group by p.mon, p.khoi, p.vai
  )
  select p.mon, p.khoi, p.vai,
         coalesce(s.so_hs, 0), coalesce(s.so_hs_yeu, 0), coalesce(s.so_dang_yeu, 0), coalesce(s.so_can_tinh, 0), s.tinh_at,
         case when exists (select 1 from dt_mon where dt_mon.mon = p.mon) then coalesce((select dt.hs_yeu from dt where dt.mon = p.mon and dt.khoi = p.khoi), 0) end,
         case when exists (select 1 from dt_mon where dt_mon.mon = p.mon) then coalesce((select dt.dang_yeu from dt where dt.mon = p.mon and dt.khoi = p.khoi), 0) end
    from p left join s on s.mon = p.mon and s.khoi = p.khoi
   order by p.mon, p.khoi
$function$;

CREATE OR REPLACE FUNCTION public.fn_qlcl_nhom_yeu()
 RETURNS TABLE(mon text, khoi text, so_hs integer, so_hs_yeu integer, so_nhom_yeu integer, dau_tuan_nhom_yeu integer, co_anh_dau_tuan boolean, cu_3 integer, cu_2 integer, cu_1 integer, moi_3 integer, moi_2 integer, moi_1 integer, so_nhom_da_go integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with o as (select p.mon, p.khoi from public.fn_pham_vi_cua_toi() p where public.la_thanh_vien()),
  co_anh as (select distinct z.mon, z.khoi from dang_yeu_dau_tuan z where z.tuan = public._qlcl_tuan_nay()),
  hs as (select o.mon, o.khoi, h.hoc_sinh_id from o cross join lateral public._qlcl_hs_cua_o(o.mon, o.khoi) h),
  em as (   -- mỗi em: tập nhóm hiện tại (b) · tập nhóm đầu tuần (a)
    select hs.mon, hs.khoi, hs.hoc_sinh_id,
           array(select e->>'nhom' from jsonb_array_elements(d.nhom) e) b,   /* 17/11: NHÓM YẾU thật (trước: nhóm có chứa dạng yếu) */
           array(select e->>'nhom' from jsonb_array_elements(z.nhom) e) a,
           (d.hoc_sinh_id is not null) co_ht, (z.hoc_sinh_id is not null) co_dt
      from hs
      left join dang_yeu_hien_tai d on d.mon = hs.mon and d.hoc_sinh_id = hs.hoc_sinh_id
      left join dang_yeu_dau_tuan z on z.tuan = public._qlcl_tuan_nay() and z.mon = hs.mon and z.khoi = hs.khoi and z.hoc_sinh_id = hs.hoc_sinh_id
     where d.hoc_sinh_id is not null or z.hoc_sinh_id is not null
  ),
  dem as (
    select em.mon, em.khoi, em.co_ht, em.co_dt,
           cardinality(em.b) n_ht, cardinality(em.a) n_dt,
           (select count(*) from unnest(em.b) x where x = any(em.a))::int n_cu,
           (select count(*) from unnest(em.b) x where not (x = any(em.a)))::int n_moi,
           (select count(*) from unnest(em.a) x where not (x = any(em.b)))::int n_go
      from em
  )
  select o.mon, o.khoi,
         (select count(*)::int from hs where hs.mon = o.mon and hs.khoi = o.khoi),
         (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_ht > 0),
         (select coalesce(sum(n_ht), 0)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi),
         case when ca.mon is not null then (select coalesce(sum(n_dt), 0)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi) end,
         ca.mon is not null,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_cu >= 3) end,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_cu = 2) end,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_cu = 1) end,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_moi >= 3) end,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_moi = 2) end,
         case when ca.mon is not null then (select count(*)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi and n_moi = 1) end,
         case when ca.mon is not null then (select coalesce(sum(n_go), 0)::int from dem where dem.mon = o.mon and dem.khoi = o.khoi) end
    from o left join co_anh ca on ca.mon = o.mon and ca.khoi = o.khoi
   order by o.mon, o.khoi
$function$;

CREATE OR REPLACE FUNCTION public.fn_qlcl_dang_yeu_hs(p_mon text, p_khoi text)
 RETURNS TABLE(hoc_sinh_id uuid, ho_ten text, ma_hs text, lop_id uuid, ten_lop text, so_dang_yeu integer, dang jsonb, tinh_at timestamp with time zone, so_dang_dau_tuan integer, so_ca_nhe_tuan integer, co_case_yeu boolean, dang_theo_doi boolean, theo_doi_nguon text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_tuan date := public._qlcl_tuan_nay();
begin
  if not public.la_thanh_vien() or not public._trong_pham_vi(p_mon, p_khoi) then raise exception 'Ngoài phạm vi khối của bạn.'; end if;
  return query
  select h.id, h.ho_ten, h.ma_hs, l.id, l.ten_lop, d.so_dang_yeu, d.dang, d.tinh_at,
         (select z.so_dang_yeu from dang_yeu_dau_tuan z where z.tuan = v_tuan and z.mon = p_mon and z.hoc_sinh_id = h.id),
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7),
         exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = h.id and y.mon = p_mon and y.trang_thai = 'dang_xu'),
         exists (select 1 from bo_tro_theo_doi t where t.hoc_sinh_id = h.id and t.mon = p_mon and t.trang_thai = 'theo_doi'),
         (select t.nguon from bo_tro_theo_doi t where t.hoc_sinh_id = h.id and t.mon = p_mon and t.trang_thai = 'theo_doi' limit 1)
    from dang_yeu_hien_tai d
    join hoc_sinh h on h.id = d.hoc_sinh_id
    join lateral (select l.id, l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                   where hl.hoc_sinh_id = d.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
                   order by hl.ngay_vao desc limit 1) l on true
   where d.mon = p_mon and d.so_nhom_yeu > 0   /* 17/11: HS yếu = ≥ 1 nhóm yếu */
   order by d.so_nhom_yeu desc, d.so_dang_yeu desc, h.ho_ten;
end $function$;
