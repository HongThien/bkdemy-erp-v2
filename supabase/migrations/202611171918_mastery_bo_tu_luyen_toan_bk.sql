-- MASTERY: MỘT bản, KHÔNG tính tự luyện cho TOÀN BK (Thùy 17/11: "thôi tạm thời làm 1 bản mastery thôi - ko tính tự luyện. áp cho toàn bộ BK").
-- Trước: khối 3·4·5 tính tự luyện (Thùy 10/11 + 12/11) ở _mastery_lan_d (Toán) · _mastery_mon_d (KHTN/Lý/Hoá); fn_tong_quan_hs (KQHT tổng quan +
-- report PH) còn tính tự luyện cho cấp 1 (gồm 4T·5T) ở cột ET+MT và cho MỌI khối ở cột "có BTVN" (bot_cur khi xem mọi lúc).
-- Sau: tự luyện chỉ còn được ĐẾM làm hoạt động (mục tiêu tuần "Việc của con", thành tựu) — không vào mức đạt/yếu ở đâu.
-- Thân hàm = pg_get_functiondef bản đang chạy 17/11, chỉ thay đúng các dòng tự luyện. Cuối: đánh bẩn cache mọi em khối 3·4·5 để bản chụp làm lại.

CREATE OR REPLACE FUNCTION public._mastery_lan_d(p_bdm boolean, p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone, p_den timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, luot text, value numeric, t timestamp with time zone, src text, dang text, nhom text, chuyen_de text, chu_de text, hh boolean)
 LANGUAGE sql
 STABLE
AS $function$
  select l.hoc_sinh_id, l.luot, l.value, l.t, l.src, l.ma_dang,
         coalesce(hh.ma_bai, db.nhom_id),
         coalesce(hh.ma_bai, nb.chuyen_de_id),        -- Hình–Học: bài học = chuyên đề = nhóm (Thùy 28/10)
         coalesce(hh.chu_de_id, nb.chu_de_id),
         (hh.ma_bai is not null)
    from public._mastery_luot_do_quy(p_bdm, false, p_hs, p_include_btvn, p_since, p_den) l
    left join hinh_hoc_bai hh on hh.ma_bai = l.ma_dang
    left join dai_bdm_dang_bai db on db.id = l.ma_dang
    left join dai_bdm_nhom nb on nb.id = db.nhom_id
   where l.src <> 'tu_luyen'          -- Thùy 17/11: MỘT mastery, KHÔNG tính tự luyện cho mọi khối (bỏ ngoại lệ cấp 1)
$function$;

CREATE OR REPLACE FUNCTION public._mastery_mon_d(p_hs uuid[], p_include_btvn boolean, p_since timestamp with time zone, p_den timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, mon text, luot text, value numeric, t timestamp with time zone, src text, dang text, nhom text, chuyen_de text, chu_de text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select l.hoc_sinh_id, d.mon, l.luot, l.value, l.t, l.src, l.ma_dang, d.nhom_id, n.chuyen_de_id, n.chu_de_id
    from public._mastery_luot_do_quy(public._mastery_bdm_bat(), true, p_hs, p_include_btvn, p_since, p_den) l
    join tl_bdm_dang_bai_v d on d.id = l.ma_dang and d.mon = any(public._mastery_mon_ds())
    join tl_bdm_nhom_v n on n.id = d.nhom_id and n.mon = d.mon
   where l.src <> 'tu_luyen'   -- Thùy 17/11: không tính tự luyện cho mọi khối
$function$;

CREATE OR REPLACE FUNCTION public.fn_tong_quan_hs(p_hs uuid, p_mon text, p_ym text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
declare
  v_bdm boolean := public._mastery_bdm_bat();
  v_cap1 boolean;
  v_now timestamptz := now();
  v_cut1 timestamptz := v_now - interval '720 hours';
  v_cut2 timestamptz := v_now - interval '1440 hours';
  v_homnay date := (v_now at time zone 'Asia/Ho_Chi_Minh')::date;
  v_mua timestamptz;
  v_m0 date; v_m1 date; v_mt0 date; v_mt1 date;
  v_out jsonb;
begin
  if p_ym is not null and p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM: %', p_ym; end if;
  select h.khoi in ('3', '4', '4T', '5', '5T') into v_cap1 from hoc_sinh h where h.id = p_hs;
  v_cap1 := coalesce(v_cap1, false);
  v_mua := make_timestamptz(extract(year from v_homnay)::int - case when extract(month from v_homnay) < 8 then 1 else 0 end,
                            8, 1, 0, 0, 0, 'Asia/Ho_Chi_Minh');
  if p_ym is not null then
    v_m0 := (p_ym || '-01')::date;
    v_m1 := (v_m0 + interval '1 month')::date;
    v_mt0 := v_m0 + 24;        -- ngày 25/M
    v_mt1 := v_m1 + 10;        -- < ngày 11/(M+1) = qua hết mùng 10
  end if;

  with ld as materialized (   -- NGUỒN ĐO CHUNG (lọc nguồn + quy dạng theo công tắc) — đắt, tính 1 lần
    select x.ma_dang as ma, x.value, x.t, x.src, (x.t at time zone 'Asia/Ho_Chi_Minh')::date as ngay
      from public._mastery_lan_do_quy(v_bdm, true, array[p_hs], true, null, null) x
  ),
  di as materialized (        -- dạng hợp lệ của môn + cột + độ khó (chỉ dạng CÓ lần đo, như client cũ)
    select * from public._tq_dang_info(p_mon, (select array_agg(distinct ld.ma) from ld))
  ),
  l as materialized (
    select ld.ma, ld.value, ld.t, ld.src, ld.ngay, di.nhom_bc,
           case when di.muc_do_bc is null then null when di.muc_do_bc <= 3 then 'cb' else 'nc' end as bc,
           (ld.src in ('et', 'mt')) as top_all,   -- 17/11: bỏ tự luyện cấp 1
           -- "hiện tại": p_ym null = mọi lần đo; có p_ym ⇒ ET/BTVN/BT/TỰ LUYỆN trong tháng, MT trong cửa sổ MT. Tự luyện theo tháng đi CÙNG
           -- luật như xem mọi lúc (Thùy 26/10 "Có" — trước đây nhánh lọc tháng bỏ quên): etMt gồm tự luyện chỉ khi cấp 1; coBTVN luôn gồm.
           case when p_ym is null then (ld.src in ('et', 'mt'))
                else (ld.src = 'et' and ld.ngay >= v_m0 and ld.ngay < v_m1) or (ld.src = 'mt' and ld.ngay >= v_mt0 and ld.ngay < v_mt1) end as top_cur,
           case when p_ym is null then ld.src <> 'tu_luyen'   -- 17/11: bản có BTVN cũng KHÔNG gồm tự luyện
                else (ld.src in ('et', 'btvn', 'bt') and ld.ngay >= v_m0 and ld.ngay < v_m1) or (ld.src = 'mt' and ld.ngay >= v_mt0 and ld.ngay < v_mt1) end as bot_cur,
           case when p_ym is null then true
                when ld.src = 'mt' then ld.ngay >= v_mt0 and ld.ngay < v_mt1
                else ld.ngay >= v_m0 and ld.ngay < v_m1 end as act_cur,
           (ld.t >= v_cut1 and ld.t >= v_mua) as rec,
           (ld.t >= v_cut2 and ld.t < v_cut1 and ld.t >= v_mua) as pri,
           (hh.ma_bai is not null) as hinh3
      from ld join di on di.ma_dang = ld.ma
      left join hinh_hoc_bai hh on hh.ma_bai = ld.ma
  ),
  -- ① mastery từng dạng trên 4 bộ đo: top (etMt hiện tại) · bot (coBTVN hiện tại) · rec/pri (etMt 30 ngày gần/trước, cho trend)
  s as (
    select k.tap, l.* from l
    cross join lateral (values ('top', l.top_cur), ('bot', l.bot_cur), ('rec', l.top_all and l.rec), ('pri', l.top_all and l.pri)) k(tap, co)
    where k.co
  ),
  rk as (
    select s.tap, s.ma, s.nhom_bc, s.bc, s.value,
           case s.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by s.tap, s.ma order by s.t desc, s.src, s.value desc) as rn,
           case when s.hinh3 then 3 else 5 end as cs
      from s
  ),
  o as (
    select tap, ma, max(nhom_bc) as nhom_bc, max(bc) as bc,
           sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) as score
      from rk group by tap, ma
  ),
  ht as (
    select o.tap, f.k,
           count(*) filter (where o.score >= 0.8) as dat,
           count(*) filter (where o.score >= 0.5 and o.score < 0.8) as can,
           count(*) filter (where o.score < 0.5) as yeu,
           count(*) as total
      from o
      cross join lateral (values ('toanBo', true),
                                 ('daiCoBan', o.nhom_bc = 'dai' and o.bc = 'cb'), ('daiNangCao', o.nhom_bc = 'dai' and o.bc = 'nc'),
                                 ('hinhCoBan', o.nhom_bc = 'hinh' and o.bc = 'cb'), ('hinhNangCao', o.nhom_bc = 'hinh' and o.bc = 'nc')) f(k, co)
     where f.co
     group by o.tap, f.k
  ),
  hj as (
    select tap, k, jsonb_build_object('dat', dat, 'can_luyen', can, 'yeu', yeu, 'total', total,
                                      'pct', round((dat + can * 0.5) / total * 100)) as b,
           round((dat + can * 0.5) / total * 100) as pct_raw
      from ht
  ),
  -- ② %ET/%BTVN/%MT × (Tổng | CB | NC) — Tổng = mọi lượt của môn; CB/NC = câu thuộc dạng có độ khó.
  --    BTVN thêm câu bỏ trống (value 0) chỉ cho số % này (mastery giữ nguyên, §5)
  bt0 as materialized (
    select b.ngay, sp.ma_cau, sp.ma_dang
      from public._btvn_cau_bo_trong(p_hs) b join gami_session_problems sp on sp.id = b.problem_id
     where sp.ma_dang is not null
  ),
  btq as materialized (       -- quy dạng câu bỏ trống: CÙNG hàm quy với nguồn lượt đo
    select d.kc, d.kd, public._do_o_quy(v_bdm, true, d.kc, d.kd) as nhom
      from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from bt0) d
  ),
  act as (
    select l.src, l.bc, l.value, l.act_cur, l.rec, l.pri from l where l.src in ('et', 'btvn', 'mt')
    union all
    select 'btvn', case when di.muc_do_bc is null then null when di.muc_do_bc <= 3 then 'cb' else 'nc' end, 0,
           p_ym is null or (b.ngay >= v_m0 and b.ngay < v_m1),
           ((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh') >= v_cut1 and ((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh') >= v_mua,
           ((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh') >= v_cut2 and ((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh') < v_cut1
             and ((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh') >= v_mua
      from bt0 b
      join btq q on q.kc = coalesce(b.ma_cau, '') and q.kd = coalesce(b.ma_dang, '')
      join di on di.ma_dang = q.nhom
  ),
  ag as (
    select src, k.bc,
           sum(value) filter (where act_cur) as s_cur, count(*) filter (where act_cur) as n_cur,
           sum(value) filter (where rec) as s_rec, count(*) filter (where rec) as n_rec,
           sum(value) filter (where pri) as s_pri, count(*) filter (where pri) as n_pri
      from act
      cross join lateral (values ('tong'), (act.bc)) k(bc)
     where k.bc is not null
     group by src, k.bc
  ),
  aj as (
    select src || case bc when 'cb' then 'CoBan' when 'nc' then 'NangCao' else 'Tong' end as k,
           jsonb_build_object('pct', case when n_cur > 0 then round(s_cur / n_cur * 100) end, 'n', n_cur) as b,
           case when n_rec > 0 and n_pri > 0 then round(s_rec / n_rec * 100) - round(s_pri / n_pri * 100) end as tr
      from ag
  ),
  -- ③ điểm nhập tay — y như cũ
  dt as (
    select k.loai, d.diem, d.diem_co_ban, d.diem_nang_cao, d.diem_thi_lai, d.diem_thi_lai_co_ban, d.diem_thi_lai_nang_cao,
           case when k.khung_co_ban > 0 then k.khung_co_ban end as kcb, case when k.khung_nang_cao > 0 then k.khung_nang_cao end as knc
      from diem_thi d
      join ky_thi k on k.id = d.ky_thi_id
      left join buoi_hoc bh on bh.id = k.buoi_hoc_id
     where d.hoc_sinh_id = p_hs and (coalesce(k.mon, '') = '' or k.mon = p_mon)
       and ((k.loai = 'truong' and (p_ym is null or (k.ngay >= v_m0 and k.ngay < v_m1)))
         or (k.loai = 'mt_sat_hach' and (p_ym is null or (coalesce(k.ngay, bh.ngay) >= v_mt0 and coalesce(k.ngay, bh.ngay) < v_mt1))))
  ),
  dj as (
    select
      jsonb_build_object(
        'tb', round(avg(diem) filter (where loai = 'mt_sat_hach'), 1), 'n', count(diem) filter (where loai = 'mt_sat_hach'),
        'coBan', round(avg(diem_co_ban) filter (where loai = 'mt_sat_hach'), 1), 'nCoBan', count(diem_co_ban) filter (where loai = 'mt_sat_hach'),
        'nangCao', round(avg(diem_nang_cao) filter (where loai = 'mt_sat_hach'), 1), 'nNangCao', count(diem_nang_cao) filter (where loai = 'mt_sat_hach'),
        'pctCoBan', round(sum(diem_co_ban) filter (where loai = 'mt_sat_hach' and kcb is not null)
                          / nullif(sum(kcb) filter (where loai = 'mt_sat_hach' and diem_co_ban is not null), 0) * 100),
        'pctNangCao', round(sum(diem_nang_cao) filter (where loai = 'mt_sat_hach' and knc is not null)
                            / nullif(sum(knc) filter (where loai = 'mt_sat_hach' and diem_nang_cao is not null), 0) * 100),
        'thiLai', jsonb_build_object(
          'tb', round(avg(diem_thi_lai) filter (where loai = 'mt_sat_hach'), 1), 'n', count(diem_thi_lai) filter (where loai = 'mt_sat_hach'),
          'coBan', round(avg(diem_thi_lai_co_ban) filter (where loai = 'mt_sat_hach'), 1), 'nCoBan', count(diem_thi_lai_co_ban) filter (where loai = 'mt_sat_hach'),
          'nangCao', round(avg(diem_thi_lai_nang_cao) filter (where loai = 'mt_sat_hach'), 1), 'nNangCao', count(diem_thi_lai_nang_cao) filter (where loai = 'mt_sat_hach'),
          'pctCoBan', round(sum(diem_thi_lai_co_ban) filter (where loai = 'mt_sat_hach' and kcb is not null)
                            / nullif(sum(kcb) filter (where loai = 'mt_sat_hach' and diem_thi_lai_co_ban is not null), 0) * 100),
          'pctNangCao', round(sum(diem_thi_lai_nang_cao) filter (where loai = 'mt_sat_hach' and knc is not null)
                              / nullif(sum(knc) filter (where loai = 'mt_sat_hach' and diem_thi_lai_nang_cao is not null), 0) * 100))
      ) as mt,
      jsonb_build_object('tb', round(avg(diem) filter (where loai = 'truong'), 1), 'n', count(diem) filter (where loai = 'truong')) as truong
    from dt
  )
  select jsonb_build_object(
    'hoanThanh', (
      select jsonb_object_agg(k.k, jsonb_build_object(
               'etMt', coalesce((select b from hj where hj.tap = 'top' and hj.k = k.k), z.b),
               'coBTVN', coalesce((select b from hj where hj.tap = 'bot' and hj.k = k.k), z.b)))
        from unnest(array['toanBo', 'daiCoBan', 'daiNangCao', 'hinhCoBan', 'hinhNangCao']) k(k),
             (select jsonb_build_object('dat', 0, 'can_luyen', 0, 'yeu', 0, 'total', 0, 'pct', 0) as b) z),
    'hoatDong', (
      select jsonb_object_agg(k.k, coalesce((select b from aj where aj.k = k.k), jsonb_build_object('pct', null, 'n', 0)))
        from unnest(array['etTong', 'etCoBan', 'etNangCao', 'btvnTong', 'btvnCoBan', 'btvnNangCao', 'mtTong', 'mtCoBan', 'mtNangCao']) k(k)),
    'diem', (select jsonb_build_object('mt', dj.mt, 'truong', dj.truong) from dj),
    'trend', (
      select jsonb_build_object('hoanThanhToanBo',
               (select r.pct_raw from hj r where r.tap = 'rec' and r.k = 'toanBo') - (select p.pct_raw from hj p where p.tap = 'pri' and p.k = 'toanBo'))
          || coalesce((select jsonb_object_agg(k.k, (select tr from aj where aj.k = k.k))
                         from unnest(array['etCoBan', 'etNangCao', 'btvnCoBan', 'btvnNangCao', 'mtCoBan', 'mtNangCao']) k(k)), '{}'::jsonb))
  ) into v_out;
  return v_out;
end
$function$;

-- bản chụp mastery của các em từng được tính tự luyện ⇒ bẩn, bộ điều phối làm lại (lô 20 em / 5 phút)
select public._mastery_danh_dau_ban(array(select id from hoc_sinh where khoi in ('3', '4', '5')));
