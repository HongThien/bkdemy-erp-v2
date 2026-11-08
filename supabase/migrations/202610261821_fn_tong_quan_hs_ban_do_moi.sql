-- ============================================================================
-- 202610261821 — fn_tong_quan_hs_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/10 "Report và tổng quan cũng chuyển đi" — Report PH + phần Tổng quan của Kết quả học tập là chỗ CUỐI CÙNG
--   còn đọc bản đồ cũ: `getTongQuanHS` (src/lib/mastery.ts) fetch thô gami_grades/bai_lam_cau/bt_grades rồi tự gom theo mã
--   dạng CHÉP + độ khó bản đồ cũ, tự tính %ET/%BTVN/%MT, %Cơ bản/%Nâng cao, trend 30 ngày, mastery từng dạng bằng JS (nợ §2.0).
--   Chuyển xuống DB: một hàm trả jsonb ĐÚNG khuôn `TongQuanHS`, đọc lần đo qua NGUỒN CHUNG `_mastery_lan_do(_mastery_bdm_bat(), …)`
--   (dạng đã quy theo công tắc; cấp 1 tự giữ cũ bên trong) — cùng một nguồn luật với ô mastery, nên Report PH / Tổng quan /
--   Dạng bài không còn nói ba chuyện. Độ khó: dạng bài NDB lấy `bdm_ban_do.muc_do` (null = chưa chốt ⇒ không vào CB/NC, y như
--   client `dangInfoCuaMon`); dạng cũ / cấp 1 vẫn lấy bảng bản đồ của nhánh (registry `_kho_ds_nhanh` + `_kho_ban_do_tbl`).
--   Điểm thi (`diem_thi`, `ky_thi`) giữ y như cũ.
--   Ý NGHĨA CHỈ SỐ GIỮ NGUYÊN — kể cả 1 chỗ lệch cũ (xem `top_cur`): khi xem theo tháng (Report PH) tự luyện KHÔNG vào ① dù cấp 1.
--   Khác cũ do đổi nguồn (chủ đích, cùng luật ô mastery): dạng quy theo câu · test cuối ca bổ trợ (`bo_tro_test`) tính là ET ·
--   bỏ `on_thi_luyen`/`thi_thu` · câu app đã có bản sao chấm buổi lấy bản chấm buổi · 5 lần gần nhất cùng ngày xếp như ô mastery.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không — chỉ thêm 2 hàm mới.
-- ============================================================================

-- Dạng → (cột báo cáo Đại/Hình, độ khó để CHIA cơ bản/nâng cao) theo MÔN — bản DB của `dangInfoCuaMon` (src/lib/mastery.ts).
-- Bảng theo registry nhánh `_kho_ds_nhanh` → `_kho_ban_do_tbl` (nhánh đứng trước thắng), rồi dạng bài bản đồ mới `NDB…` ở `bdm_ban_do`.
-- Thuộc tính báo cáo của nhánh (khớp NHANH_CUA_MON, src/lib/tailieu.ts): hinh_gt + hinh_hoc ⇒ cột 'hinh'; hinh_hoc chưa gán độ khó ⇒ 1
-- (Thùy 29/09 "tạm tính Cơ bản"). Dạng bài NDB: nhánh bdm 'hgt' ⇒ 'hinh'; độ khó null ⇒ null (chưa chốt ⇒ không vào CB/NC).
create or replace function public._tq_dang_info(p_mon text, p_ma text[])
returns table(ma_dang text, nhom_bc text, muc_do_bc smallint)
language plpgsql stable
set search_path = public
as $$
declare
  v_ds text[] := public._kho_ds_nhanh(p_mon);
  v_nh text; v_tbl text; v_seen text[] := '{}'; v_got text[] := '{}'; r record;
begin
  if p_ma is null or cardinality(p_ma) = 0 then return; end if;
  if cardinality(v_ds) = 0 then v_ds := array[null::text]; end if;   -- môn 1 nhánh / chưa khai: chỉ bảng gốc (như client)
  foreach v_nh in array v_ds loop
    v_tbl := public._kho_ban_do_tbl(p_mon, v_nh);
    if v_tbl = any(v_seen) then continue; end if;
    v_seen := v_seen || v_tbl;
    for r in execute format('select b.ma_dang::text as ma, b.muc_do::smallint as md from %I b where b.ma_dang = any($1)', v_tbl) using p_ma loop
      if r.ma = any(v_got) then continue; end if;
      v_got := v_got || r.ma;
      ma_dang := r.ma;
      nhom_bc := case when v_nh in ('hinh_gt', 'hinh_hoc') then 'hinh' else 'dai' end;
      muc_do_bc := coalesce(r.md, case when v_nh = 'hinh_hoc' then 1::smallint end);
      return next;
    end loop;
  end loop;
  -- bản đồ mới (Toán K6–12 khi bật công tắc) — chỉ môn mà registry trỏ nhánh 'bdm' về bdm_ban_do
  if cardinality(public._kho_ds_nhanh(p_mon)) > 0 and public._kho_ban_do_tbl(p_mon, 'bdm') = 'bdm_ban_do' then
    return query
      select b.ma_dang, case when b.nhanh_bdm = 'hgt' then 'hinh' else 'dai' end, b.muc_do::smallint
        from bdm_ban_do b
       where b.ma_dang = any(p_ma) and b.ma_dang like 'NDB%' and not (b.ma_dang = any(v_got));
  end if;
end $$;

-- ── TỔNG QUAN 1 HS × 1 MÔN — khuôn `TongQuanHS` (src/lib/mastery.ts). p_ym 'YYYY-MM' = Report PH theo tháng; null = suy động mọi lần đo.
--   ① hoanThanh: % hoàn thành bản đồ = (đạt + 0.5·cần)/đã-đo trên 2 bộ lần đo — etMt (et+mt, + tự luyện nếu cấp 1) · coBTVN (+btvn+bt+tự luyện);
--      toàn bộ + (Đại|Hình) × (cơ bản ≤3 | nâng cao ≥4) theo độ khó DẠNG. Mastery từng dạng = CÙNG công thức `_mastery_cells_core`
--      (5 lần gần nhất theo t desc, src, value desc · trọng số mt 3 / et 2 / khác 1 · Hình–Học cửa sổ 3 · đạt ≥0.8, cần ≥0.5).
--   ② hoatDong: %đúng câu ET/BTVN/MT × CB/NC theo độ khó dạng của câu; BTVN cộng câu bỏ trống = sai (Thùy 16/10, `_btvn_cau_bo_trong`).
--   ③ diem: điểm nhập tay ky_thi/diem_thi — MT (mt_sat_hach, cửa sổ 25/M→10/M+1) + thi lại + thi trường (tháng lịch).
--   trend: 30 ngày gần − 30 ngày trước (sàn mùa 1/8 giờ VN — SEASON src/gami/config.js), trên toàn lịch sử, không lọc theo p_ym.
create or replace function public.fn_tong_quan_hs(p_hs uuid, p_mon text, p_ym text default null)
returns jsonb
language plpgsql stable
set search_path = public
as $$
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
      from public._mastery_lan_do(v_bdm, array[p_hs], true, null, null) x
  ),
  di as materialized (        -- dạng hợp lệ của môn + cột + độ khó (chỉ dạng CÓ lần đo, như client cũ)
    select * from public._tq_dang_info(p_mon, (select array_agg(distinct ld.ma) from ld))
  ),
  l as materialized (
    select ld.ma, ld.value, ld.t, ld.src, ld.ngay, di.nhom_bc,
           case when di.muc_do_bc is null then null when di.muc_do_bc <= 3 then 'cb' else 'nc' end as bc,
           (ld.src in ('et', 'mt') or (v_cap1 and ld.src = 'tu_luyen')) as top_all,
           -- "hiện tại": p_ym null = mọi lần đo; có p_ym ⇒ ET/BTVN/BT trong tháng, MT trong cửa sổ MT. Theo tháng KHÔNG có tự luyện
           -- (kể cả cấp 1) — y hệt client cũ (nhánh lọc tháng dựng lại bộ đo chỉ từ et/mt/btvn/bt).
           case when p_ym is null then (ld.src in ('et', 'mt') or (v_cap1 and ld.src = 'tu_luyen'))
                else (ld.src = 'et' and ld.ngay >= v_m0 and ld.ngay < v_m1) or (ld.src = 'mt' and ld.ngay >= v_mt0 and ld.ngay < v_mt1) end as top_cur,
           case when p_ym is null then true
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
  -- ② %ET/%BTVN/%MT × CB/NC — câu thuộc dạng có độ khó; BTVN thêm câu bỏ trống (value 0) chỉ cho số % này (mastery giữ nguyên, §5)
  bt0 as materialized (
    select b.ngay, sp.ma_cau, sp.ma_dang
      from public._btvn_cau_bo_trong(p_hs) b join gami_session_problems sp on sp.id = b.problem_id
     where sp.ma_dang is not null
  ),
  btq as materialized (       -- quy dạng câu bỏ trống: CÙNG luật bước `cap` của _mastery_lan_do
    select d.kc, d.kd,
           case when public._btyeu_la_hinh_mh(d.kd) then null
                when v_bdm then public._do_o_bdm(nullif(d.kc, ''), nullif(d.kd, ''))
                else public._do_nhom_cua_o(nullif(d.kc, ''), nullif(d.kd, '')) end as nhom
      from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from bt0) d
  ),
  act as (
    select l.src, l.bc, l.value, l.act_cur, l.rec, l.pri from l where l.bc is not null and l.src in ('et', 'btvn', 'mt')
    union all
    select 'btvn', case when di.muc_do_bc <= 3 then 'cb' else 'nc' end, 0,
           p_ym is null or (b.ngay >= v_m0 and b.ngay < v_m1),
           ((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh') >= v_cut1 and ((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh') >= v_mua,
           ((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh') >= v_cut2 and ((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh') < v_cut1
             and ((b.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh') >= v_mua
      from bt0 b
      join btq q on q.kc = coalesce(b.ma_cau, '') and q.kd = coalesce(b.ma_dang, '')
      join di on di.ma_dang = q.nhom
     where di.muc_do_bc is not null
  ),
  ag as (
    select src, bc,
           sum(value) filter (where act_cur) as s_cur, count(*) filter (where act_cur) as n_cur,
           sum(value) filter (where rec) as s_rec, count(*) filter (where rec) as n_rec,
           sum(value) filter (where pri) as s_pri, count(*) filter (where pri) as n_pri
      from act group by src, bc
  ),
  aj as (
    select src || case bc when 'cb' then 'CoBan' else 'NangCao' end as k,
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
        from unnest(array['etCoBan', 'etNangCao', 'btvnCoBan', 'btvnNangCao', 'mtCoBan', 'mtNangCao']) k(k)),
    'diem', (select jsonb_build_object('mt', dj.mt, 'truong', dj.truong) from dj),
    'trend', (
      select jsonb_build_object('hoanThanhToanBo',
               (select r.pct_raw from hj r where r.tap = 'rec' and r.k = 'toanBo') - (select p.pct_raw from hj p where p.tap = 'pri' and p.k = 'toanBo'))
          || coalesce((select jsonb_object_agg(k.k, (select tr from aj where aj.k = k.k))
                         from unnest(array['etCoBan', 'etNangCao', 'btvnCoBan', 'btvnNangCao', 'mtCoBan', 'mtNangCao']) k(k)), '{}'::jsonb))
  ) into v_out;
  return v_out;
end $$;

revoke execute on function public._tq_dang_info(text, text[]) from public, anon;
revoke execute on function public.fn_tong_quan_hs(uuid, text, text) from public, anon;
grant execute on function public._tq_dang_info(text, text[]) to authenticated;
grant execute on function public.fn_tong_quan_hs(uuid, text, text) to authenticated;
