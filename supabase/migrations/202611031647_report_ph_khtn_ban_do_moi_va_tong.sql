-- ============================================================================
-- 202611031647 — report_ph_khtn_ban_do_moi_va_tong
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 03/11 "Sửa tính năng report phụ huynh của cả toán và KHTN theo bản đồ mới". Đo thật trước khi sửa (lượt đo tháng 10):
--   (1) KHTN: Report PH / Tổng quan vẫn đếm DẠNG CŨ (`khtn_ban_do`) — `_do_o_bdm` chỉ biết kho Đại/HGT nên câu KHTN rơi về mã dạng
--       chép. Bản đồ mới KHTN (mig 202610291707: dạng cũ → NHÓM, cụm cũ → DẠNG BÀI `KDB…`) chưa đọc ở đâu cả. Từ 01/08: 22.695 lượt
--       đo câu KHTN, 16.498 (72%) câu đã xếp dạng bài (`khtn_bdm_gan_cau`); phần còn lại là câu "chưa phân" ⇒ để trống (§1.5), y luật
--       Toán (`_do_o_bdm`: câu còn sống chưa có dạng bài ⇒ NULL).
--   (2) Toán: cột "Tổng" ET/BTVN/MT được client ghép từ Cơ bản + Nâng cao (nợ §2.0) ⇒ lượt đo của dạng bài CHƯA có độ khó mất khỏi
--       cả Tổng. Bản đồ cũ dạng nào cũng có độ khó nên không lộ; bản đồ mới thì K4 100% · K4T ~½ · K6–7 một phần lượt đo rơi vào
--       dạng bài chưa chốt độ khó ⇒ Report PH K4 hiện "—" ở cả ba hoạt động. Thêm `etTong/btvnTong/mtTong` tính ở DB trên MỌI lượt đo
--       của môn; CB/NC giữ nguyên (chỉ dạng có độ khó).
--   Phạm vi CHỈ tổng quan (fn_tong_quan_hs ⇒ Report PH, ảnh báo cáo, Tổng quan Kết quả học tập, trợ lý): ô mastery / bổ trợ / dashboard
--   KHTN vẫn bản đồ cũ tới khi bật cả môn — mọi hàm khác gọi `_mastery_lan_do` 5 tham số ⇒ p_khtn_bdm = false ⇒ y hệt trước.
--   Quy dạng 1 lượt đo gom về MỘT hàm `_do_o_quy` (trước đây chép 2 nơi: `_mastery_lan_do` bước cap + `fn_tong_quan_hs` bước btq).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không — thêm 5 hàm, thay thân 3 hàm (giữ chữ ký + quyền).
-- ============================================================================

-- ── KHTN: lượt đo này có phải của kho KHTN không (câu ở kho KHTN, hoặc không mã câu mà mã dạng chép là dạng cũ KHTN) ──
create or replace function public._khtn_la_lan_do(p_ma_cau text, p_ma_dang_chep text) returns boolean
language sql stable set search_path = public as $$
  select case when p_ma_cau is not null and exists (select 1 from khtn_cau_hoi c where c.ma_cau = p_ma_cau) then true
              when p_ma_cau is not null and (exists (select 1 from dai_cau_hoi c where c.ma_cau = p_ma_cau)
                                          or exists (select 1 from hgt_cau_hoi c where c.ma_cau = p_ma_cau)) then false
              else exists (select 1 from khtn_ban_do b where b.ma_dang = p_ma_dang_chep) end
$$;

-- ── KHTN: dạng bài bản đồ mới của 1 lượt đo — bản KHTN của `_do_o_bdm` (Toán) ──
--   câu có dòng gán ⇒ dạng bài đó · câu còn sống chưa phân ⇒ NULL (§1.5) · câu đã xoá chưa phân ⇒ anh em còn sống cùng dạng cũ đã gán
--   về ĐÚNG 1 dạng bài thì theo, rải ≥2 ⇒ NULL · không mã câu ⇒ dạng cũ (= nhóm, `ma_cu`) có đúng 1 dạng bài thì theo (bản KHTN của
--   `_bdm_dang_cu_mot_dich`; KHTN chuyển 1–1 nên không có bảng đối ứng).
create or replace function public._khtn_do_o_bdm(p_ma_cau text, p_ma_dang_chep text) returns text
language plpgsql stable set search_path = public as $$
declare r record; v text;
begin
  if p_ma_cau is not null then
    select c.dang_chinh, c.xoa_at is not null as da_xoa, g.dang_bai_id into r
      from khtn_cau_hoi c left join khtn_bdm_gan_cau g on g.ma_cau = c.ma_cau
     where c.ma_cau = p_ma_cau;
    if found then
      if r.dang_bai_id is not null or not r.da_xoa then return r.dang_bai_id; end if;
      select min(g.dang_bai_id) into v
        from khtn_cau_hoi s join khtn_bdm_gan_cau g on g.ma_cau = s.ma_cau
       where s.dang_chinh = r.dang_chinh and s.xoa_at is null
      having count(distinct g.dang_bai_id) = 1;
      return v;
    end if;
  end if;
  select min(d.id) into v
    from khtn_bdm_nhom n join khtn_bdm_dang_bai d on d.nhom_id = n.id
   where n.ma_cu = p_ma_dang_chep
  having count(*) = 1;
  return v;
end $$;

-- ── MỘT nơi quy dạng cho 1 lượt đo (câu, mã dạng chép) — trước đây chép ở `_mastery_lan_do` (cap) và `fn_tong_quan_hs` (btq) ──
--   p_bdm = công tắc bản đồ mới Toán (`_mastery_bdm_bat`) · p_khtn_bdm = quy câu KHTN theo bản đồ mới KHTN (hiện chỉ tổng quan bật).
create or replace function public._do_o_quy(p_bdm boolean, p_khtn_bdm boolean, p_kc text, p_kd text) returns text
language sql stable set search_path = public as $$
  select case when public._btyeu_la_hinh_mh(p_kd) then null   -- 14/10: bài mô hình đo ở fn_mastery_cells_hinh
              when p_khtn_bdm and public._khtn_la_lan_do(nullif(p_kc, ''), nullif(p_kd, '')) then public._khtn_do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))
              when p_bdm then public._do_o_bdm(nullif(p_kc, ''), nullif(p_kd, ''))   -- BẢN ĐỒ MỚI Toán (K6–12; cấp 1 + Hình giữ cũ bên trong)
              else public._do_nhom_cua_o(nullif(p_kc, ''), nullif(p_kd, '')) end
$$;

-- ── Nguồn lượt đo chung, thêm công tắc KHTN. Thân y hệt `_mastery_lan_do` cũ, chỉ bước cap gọi `_do_o_quy`. ──
create or replace function public._mastery_lan_do_quy(p_bdm boolean, p_khtn_bdm boolean, p_hs uuid[], p_include_btvn boolean,
                                                      p_since timestamptz, p_den timestamptz)
returns table(hoc_sinh_id uuid, ma_dang text, value numeric, t timestamptz, src text)
language sql stable as $function$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '4T', '5', '5T')) as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    -- gami_grades: t = NGÀY BUỔI (mọi gsp gắn buổi theo schema, join left để phòng thủ)
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src, sp.ma_cau
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)
    union all
    -- bai_lam_cau online: t = ngày buổi của bai_test (nếu có), fallback cham_at
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'bo_tro_test' then 'et' -- Thùy 22/09: test cuối ca bổ trợ yếu tính mastery như ET
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end, btc.ma_cau
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id) -- 23/10: câu app đã có BẢN SAO trong bảng chấm buổi ⇒ lấy bản chấm buổi
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
      and (p_den is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) < p_den)
    union all
    -- bt_grades: bổ trợ không gắn buổi, giữ graded_at
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt', btg.ma_cau
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
      and (p_den is null or btg.graded_at < p_den)
  ),
  mf as (
    select m.* from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  -- 12/10 ĐO ĐI THEO CÂU (spec-ban-do-4-tang §10): dạng của một lượt đo = quy theo (câu, mã chép) — tính 1 lần cho mỗi cặp
  cap as materialized (   -- 24/10: KHÔNG để Postgres inline — inline thì quy dạng chạy lại cho TỪNG lượt đo (38k) thay vì từng cặp câu–mã (12k)
    select d.kc, d.kd, public._do_o_quy(p_bdm, p_khtn_bdm, d.kc, d.kd) as nhom
    from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from mf) d
  )
  select mf.hoc_sinh_id, cap.nhom, mf.value, mf.t, mf.src
  from mf join cap on cap.kc = coalesce(mf.ma_cau, '') and cap.kd = coalesce(mf.ma_dang, '') and cap.nhom is not null
$function$;

-- Chữ ký cũ giữ nguyên cho mọi người gọi (_mastery_cells_core, fn_mastery_lan_do_moi, hs_dang_evals) — KHTN bản đồ cũ như trước.
create or replace function public._mastery_lan_do(p_bdm boolean, p_hs uuid[], p_include_btvn boolean default false,
                                                  p_since timestamptz default null, p_den timestamptz default null)
returns table(hoc_sinh_id uuid, ma_dang text, value numeric, t timestamptz, src text)
language sql stable as $function$
  select * from public._mastery_lan_do_quy(p_bdm, false, p_hs, p_include_btvn, p_since, p_den)
$function$;

-- ── Registry dạng bài bản đồ mới theo MÔN (một nơi): Toán `bdm_ban_do` (NDB…) · KHTN `khtn_bdm_dang_bai` (KDB…) ──
create or replace function public._bdm_dang_bai_cua_mon(p_mon text, p_ma text[])
returns table(ma_dang text, nhanh_bdm text, muc_do smallint)
language sql stable set search_path = public as $$
  select b.ma_dang, b.nhanh_bdm, b.muc_do::smallint
    from bdm_ban_do b
   where cardinality(public._kho_ds_nhanh(p_mon)) > 0 and public._kho_ban_do_tbl(p_mon, 'bdm') = 'bdm_ban_do'
     and b.ma_dang = any(p_ma) and b.ma_dang like 'NDB%'
  union all
  select d.id, 'khtn', d.muc_do::smallint
    from khtn_bdm_dang_bai d
   where public._kho_ban_do_tbl(p_mon, null) = 'khtn_ban_do' and d.id = any(p_ma)
$$;

create or replace function public._tq_dang_info(p_mon text, p_ma text[])
returns table(ma_dang text, nhom_bc text, muc_do_bc smallint)
language plpgsql stable
set search_path = public
as $function$
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
  -- dạng bài bản đồ mới của môn (Toán NDB · KHTN KDB) — qua registry, không rẽ nhánh theo tên môn ở đây
  return query
    select x.ma_dang, case when x.nhanh_bdm = 'hgt' then 'hinh' else 'dai' end, x.muc_do
      from public._bdm_dang_bai_cua_mon(p_mon, p_ma) x
     where not (x.ma_dang = any(v_got));
end $function$;

-- ── TỔNG QUAN 1 HS × 1 MÔN — thân như mig 202610261927, đổi 3 chỗ:
--   · lượt đo qua `_mastery_lan_do_quy(…, p_khtn_bdm = true, …)` ⇒ câu KHTN quy về dạng bài bản đồ mới (câu Toán không đổi);
--   · câu BTVN bỏ trống quy dạng cùng hàm `_do_o_quy`;
--   · ② thêm `etTong/btvnTong/mtTong` = % trên MỌI lượt đo của môn (kể cả dạng bài chưa chốt độ khó) — thay cho client ghép CB+NC.
create or replace function public.fn_tong_quan_hs(p_hs uuid, p_mon text, p_ym text default null)
returns jsonb
language plpgsql stable
set search_path to 'public'
as $function$
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
           (ld.src in ('et', 'mt') or (v_cap1 and ld.src = 'tu_luyen')) as top_all,
           -- "hiện tại": p_ym null = mọi lần đo; có p_ym ⇒ ET/BTVN/BT/TỰ LUYỆN trong tháng, MT trong cửa sổ MT. Tự luyện theo tháng đi CÙNG
           -- luật như xem mọi lúc (Thùy 26/10 "Có" — trước đây nhánh lọc tháng bỏ quên): etMt gồm tự luyện chỉ khi cấp 1; coBTVN luôn gồm.
           case when p_ym is null then (ld.src in ('et', 'mt') or (v_cap1 and ld.src = 'tu_luyen'))
                else (ld.src = 'et' and ld.ngay >= v_m0 and ld.ngay < v_m1) or (ld.src = 'mt' and ld.ngay >= v_mt0 and ld.ngay < v_mt1)
                  or (v_cap1 and ld.src = 'tu_luyen' and ld.ngay >= v_m0 and ld.ngay < v_m1) end as top_cur,
           case when p_ym is null then true
                else (ld.src in ('et', 'btvn', 'bt', 'tu_luyen') and ld.ngay >= v_m0 and ld.ngay < v_m1) or (ld.src = 'mt' and ld.ngay >= v_mt0 and ld.ngay < v_mt1) end as bot_cur,
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
