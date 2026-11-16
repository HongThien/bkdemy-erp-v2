set local lock_timeout = '3s';
-- ============================================================================
-- 202611161754 — muc_tieu_tuan_doc_ke_hoach
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Giáo trình tuần bước 6 (spec-giao-trinh-tuan.md §6): Phần 1 · Kiến thức mới của mục tiêu tuần chỉ biết nhóm của buổi SAU KHI buổi được gán
--   cho lớp (đúng ngày dạy) ⇒ thứ Hai tờ tuần thiếu nhóm của buổi sắp dạy. Thêm 2 thứ:
--   (1) _mtt_tinh thấy CA CHIẾU từ TKB (buổi thường tương lai chưa có dòng buoi_hoc) qua _gtt_ca — cửa sổ "lùi một buổi" đủ ngay thứ Hai.
--       Ca chiếu KHÔNG thành dòng Việc của con (chưa mở buổi thì chưa có ET/BTVN để đo).
--   (2) _mtt_nhom_buoi / _mtt_nhom_lui: lớp chưa có bản chép cho ngày đó ⇒ đọc câu của buổi kế hoạch (gtt_ca → builder), quy nhóm bằng
--       đúng _do_o_quy (không công thức thứ hai). Có bản chép rồi ⇒ y như cũ.
--   So cũ–mới (K18): DEVLOG 16/11.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Thay thân 3 hàm (giữ chữ ký).
-- ============================================================================

CREATE OR REPLACE FUNCTION public._mtt_nhom_buoi(p_lop uuid, p_ngay date, p_buoi uuid)
 RETURNS text[]
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with ot as (
    select distinct tc.ma_cau
      from tai_lieu t join tai_lieu_phan tp on tp.tai_lieu_id = t.id join tai_lieu_cau tc on tc.phan_id = tp.id
     where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'btvn' and t.hoc_sinh_id is null
       and tp.loai_phan in ('ontap', 'ontap_nhom') and tc.ma_cau is not null
  ),
  c as (
    select distinct coalesce(tc.ma_cau, '') as kc, '' as kd
      from tai_lieu t join tai_lieu_phan tp on tp.tai_lieu_id = t.id join tai_lieu_cau tc on tc.phan_id = tp.id
     where t.lop_id = p_lop and t.ngay = p_ngay and t.loai in ('giao_trinh_buoi', 'et', 'btvn') and t.hoc_sinh_id is null
       and tc.ma_cau is not null and tp.loai_phan not in ('ontap', 'ontap_nhom')
    union
    select distinct coalesce(sp.ma_cau, ''), coalesce(sp.ma_dang, '')
      from gami_session_problems sp
     where sp.buoi_hoc_id = p_buoi and sp.phase in ('et', 'btvn') and sp.hoc_sinh_id is null
       and not (sp.phase = 'btvn' and exists (select 1 from ot where ot.ma_cau = sp.ma_cau))
    union
    -- 16/11 Giáo trình tuần: lớp CHƯA có bản chép giáo trình buổi cho ngày này ⇒ câu của buổi KẾ HOẠCH trong builder (gtt_ca),
    -- bỏ phần ôn / luyện lại (ontap, ontap_nhom) — cùng luật với nhánh bản chép ở trên; quy câu → nhóm bằng đúng _do_o_quy bên dưới.
    select distinct tc.ma_cau, ''
      from gtt_ca g
      join lateral (select p.id, p.loai_phan from tai_lieu_phan p where p.cha_id = g.buoi_id
                    union all
                    select q.id, q.loai_phan from tai_lieu_phan p join tai_lieu_phan q on q.cha_id = p.id
                     where p.cha_id = g.buoi_id and p.loai_phan not in ('ontap', 'ontap_nhom')) ph on true
      join tai_lieu_cau tc on tc.phan_id = ph.id
     where g.lop_id = p_lop and g.ngay = p_ngay and ph.loai_phan not in ('ontap', 'ontap_nhom') and tc.ma_cau is not null
       and not exists (select 1 from tai_lieu t where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'giao_trinh_buoi' and t.hoc_sinh_id is null)
  )
  select coalesce(array_agg(distinct n) filter (where n is not null), '{}')
    from (select public._do_o_quy(public._mastery_bdm_bat(), false, c.kc, c.kd) as n from c) x
$function$;

CREATE OR REPLACE FUNCTION public._mtt_nhom_lui(p_lop uuid, p_ngay date)
 RETURNS text[]
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with phieu as (
    select t.id from tai_lieu t where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'btvn' and t.hoc_sinh_id is null
  ),
  c as (
    select tc.ma_cau
      from phieu f join tai_lieu_phan tp on tp.tai_lieu_id = f.id join tai_lieu_cau tc on tc.phan_id = tp.id
     where tp.loai_phan in ('ontap', 'ontap_nhom') and tc.ma_cau is not null
    union
    select tc.ma_cau
      from tai_lieu t
      join tai_lieu_phan k on k.cha_id = case when t.nguon_buoi ~ '^[0-9a-fA-F-]{36}$' then t.nguon_buoi::uuid end
                          and k.loai_phan = 'ontap_nhom' and k.lui_bac is not null
      join tai_lieu_cau tc on tc.phan_id = k.id
     where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'giao_trinh_buoi' and t.ban_do = 'moi' and t.hoc_sinh_id is null
       and not exists (select 1 from phieu)
    union
    -- 16/11 Giáo trình tuần: chưa có cả phiếu lẫn bản chép giáo trình buổi ⇒ phần luyện lại đã soạn ở buổi KẾ HOẠCH (gtt_ca)
    select tc.ma_cau
      from gtt_ca g
      join tai_lieu_phan k on k.cha_id = g.buoi_id and k.loai_phan = 'ontap_nhom' and k.lui_bac is not null
      join tai_lieu_cau tc on tc.phan_id = k.id
     where g.lop_id = p_lop and g.ngay = p_ngay
       and not exists (select 1 from phieu)
       and not exists (select 1 from tai_lieu t where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'giao_trinh_buoi' and t.hoc_sinh_id is null)
  )
  select coalesce(array_agg(distinct n) filter (where n is not null), '{}')
    from (select public._do_o_quy(public._mastery_bdm_bat(), false, c.ma_cau, '') as n from c) x
$function$;

CREATE OR REPLACE FUNCTION public._mtt_tinh(p_hs uuid, p_mon text, p_tuan date, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_bdm    boolean := public._mastery_bdm_bat();
  v_tu     date := p_tuan;
  v_toi    date := p_tuan + 6;
  v_den    timestamptz := coalesce(p_den, now());
  v_today  date := (coalesce(p_den, now()) at time zone 'Asia/Ho_Chi_Minh')::date;
  v_han30  bigint := extract(epoch from public._mtt_moc(p_tuan + 7) - interval '30 days')::bigint;
  v_hs     record;
  v_lop    uuid[];
  v_lop1   uuid;
  v_chot   boolean;
  v_buoi   jsonb;
  v_ho_tro jsonb;
  v_p      jsonb;
  v_dau    jsonb;
  v_n2     text[];
  v_nhom   jsonb;
  v_viec   jsonb;
  v_tl     jsonb;
  v_sap    jsonb;
  v_hang   jsonb;
  v_td     numeric;
  v_td_dau numeric;
begin
  select h.id, h.ho_ten, h.khoi into v_hs from hoc_sinh h where h.id = p_hs;
  if not found then return null; end if;

  -- lớp của em cho môn này có mặt trong tuần (vào trước hết tuần, chưa rời trước đầu tuần)
  select array_agg(distinct l.id), (array_agg(l.id order by hl.ngay_vao desc))[1]
    into v_lop, v_lop1
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and l.mon = p_mon
     and hl.ngay_vao <= v_toi and coalesce(hl.ngay_roi, 'infinity'::date) >= v_tu;
  v_lop := coalesce(v_lop, '{}');
  v_chot := exists (select 1 from mtt_lop_chot c where c.tuan = p_tuan and c.lop_id = any(v_lop));

  -- buổi thường của lớp quanh tuần + buổi kế (lead) — chỉ buổi em đã ở trong lớp
  -- 16/11 Giáo trình tuần (spec-giao-trinh-tuan §6): buổi thường tương lai chưa có dòng buoi_hoc (sinh lúc mở buổi) ⇒ thêm CA CHIẾU từ TKB
  -- (_gtt_ca, từ hôm nay trở đi, chưa có buổi thường, không huỷ; id null). Nhờ vậy cửa sổ "buổi cuối tuần trước + buổi đầu tuần này" đủ ngay
  -- thứ Hai (lead 'sau' thấy buổi kế), và nhóm của buổi sắp dạy lấy từ kế hoạch tuần (_mtt_nhom_buoi nhánh gtt_ca).
  with b0 as (
    select bh.id, bh.lop_id, bh.ngay, bh.gio_bat_dau
      from buoi_hoc bh
     where bh.lop_id = any(v_lop) and bh.loai = 'thuong' and bh.trang_thai <> 'huy'
       and bh.ngay between v_tu - 28 and v_toi + 21
    union all
    select null::uuid, c.lop_id, c.ngay, c.gio_bat_dau
      from public._gtt_ca(v_lop, greatest(v_tu - 28, v_today), v_toi + 21) c
     where c.buoi_hoc_id is null and not c.huy
  ),
  b as (
    select b0.*, lead(b0.ngay) over (partition by b0.lop_id order by b0.ngay, b0.gio_bat_dau) as sau from b0
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', b.id, 'lop_id', b.lop_id, 'ngay', b.ngay, 'sau', b.sau,
           'w', b.ngay between v_tu and v_toi, 's', coalesce(b.sau between v_tu and v_toi, false),
           'dd', (select x.diem_danh from buoi_hoc_hs x where x.buoi_hoc_id = b.id and x.hoc_sinh_id = p_hs limit 1),
           'nhom', to_jsonb(public._mtt_nhom_buoi(b.lop_id, b.ngay, b.id)),
           'lui', case when coalesce(b.sau between v_tu and v_toi, false)
                       then to_jsonb(public._mtt_nhom_lui(b.lop_id, b.ngay)) else '[]'::jsonb end) order by b.ngay, b.gio_bat_dau), '[]'::jsonb)
    into v_buoi
    from b
   where (b.ngay between v_tu and v_toi or b.sau between v_tu and v_toi)
     and exists (select 1 from hoc_sinh_lop hl where hl.hoc_sinh_id = p_hs and hl.lop_id = b.lop_id
                    and hl.ngay_vao <= b.ngay and coalesce(hl.ngay_roi, 'infinity'::date) >= b.ngay);

  -- ca hỗ trợ trong tuần: test sau giờ (bo_tro_nhe) · bổ trợ yếu (bo_tro_yeu)
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', b.id, 'loai', b.loai, 'ngay', b.ngay, 'gio', to_char(b.gio_bat_dau, 'HH24:MI'),
           'phong', coalesce(b.phong, cn.phong, cb.phong), 'dd', x.diem_danh) order by b.ngay, b.gio_bat_dau), '[]'::jsonb)
    into v_ho_tro
    from buoi_hoc_hs x
    join buoi_hoc b on b.id = x.buoi_hoc_id
    left join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
    left join ca_bo_tro cb on cb.id = b.ca_bo_tro_id
    left join lop lb on lb.id = b.lop_id
   where x.hoc_sinh_id = p_hs and b.loai in ('bo_tro_nhe', 'bo_tro_yeu') and b.trang_thai <> 'huy'
     and b.ngay between v_tu and v_toi
     and coalesce(cn.mon, cb.mon, lb.mon) = p_mon
     and coalesce(cn.trang_thai, 'mo') <> 'huy' and coalesce(cb.trang_thai, 'mo') <> 'huy';

  -- % nhóm hiện tại = mastery theo lần ĐANG CHẠY (có BTVN), chỉ nhóm của bản đồ môn này (như Dashboard học tập / bổ trợ)
  select coalesce(jsonb_object_agg(m.nut, jsonb_build_object('s', round(m.score, 4), 'n', m.n, 'muc', m.muc)), '{}'::jsonb)
    into v_p
    from public._mastery_lan_cap_nhanh(v_bdm, array[p_hs], true, null, p_den, array['nhom'], 5, 5, 3) m
    left join dai_bdm_nhom nb on nb.id = m.nut
    left join hinh_hoc_bai hh on hh.ma_bai = m.nut
   where public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' and m.cap = 'nhom' and m.score is not null
     and (nb.id is not null or hh.ma_bai is not null);

  -- số đầu tuần: bản chụp nếu đã có (bất biến), chưa có thì tính tại mốc
  select d.nhom into v_dau from mtt_dau d where d.tuan = p_tuan and d.hoc_sinh_id = p_hs;
  v_dau := coalesce(v_dau, public._mtt_dau_tinh(p_hs, p_tuan));

  -- Phần 2 = nhóm do lượt chốt bổ trợ đưa vào: đề xuất MỚI NHẤT đã duyệt gần đây + dạng của case bổ trợ còn mở
  select coalesce(array_agg(distinct x.ma) filter (where x.ma is not null), '{}') into v_n2 from (
    select e->>'ma' as ma
      from bo_tro_de_xuat d cross join lateral jsonb_array_elements(d.nhom) e
     where d.hoc_sinh_id = p_hs and d.mon = p_mon and d.trang_thai = 'da_duyet'
       and d.id = (select d2.id from bo_tro_de_xuat d2 where d2.hoc_sinh_id = p_hs and d2.mon = p_mon
                     and d2.tao_at < v_den order by d2.tao_at desc limit 1)
       and coalesce(d.duyet_at, d.tao_at) >= public._mtt_moc(v_tu - 7) and coalesce(d.duyet_at, d.tao_at) < v_den
    union all
    select public._do_o_quy(v_bdm, false, '', yd.ma_dang)
      from bo_tro_yeu y join bo_tro_yeu_dang yd on yd.bo_tro_yeu_id = y.id
     where y.hoc_sinh_id = p_hs and y.mon = p_mon and y.trang_thai in ('dang_xu', 'nhe_mo')
       and yd.dong_at is null and y.created_at < v_den
  ) x;

  -- NHÓM của tờ: Phần 1 (dạy trong cửa sổ) + Phần 2 (nợ). Một nhóm chỉ ở 1 phần (nợ ưu tiên).
  with bb as (select e as b from jsonb_array_elements(v_buoi) e),
  n1 as (   -- nhóm của buổi thuộc cửa sổ (s) + số lần đo dự kiến trong tuần: ET của buổi trong tuần (w) + BTVN của buổi cửa sổ (s)
    -- 13/11 BTVN xếp chồng: nhóm luyện lại trong phiếu của buổi cửa sổ (lui) = thêm 1 lần đo, vẫn thuộc Phần 1
    select x.ma, sum(x.k)::int as k, bool_or(x.s) as trong_cua_so,
           jsonb_agg(distinct x.ngay) filter (where x.s and x.goc) as ngay_hoc
      from (
        select n.value #>> '{}' as ma,
               (case when (bb.b->>'w')::boolean then 1 else 0 end) + (case when (bb.b->>'s')::boolean then 1 else 0 end) as k,
               (bb.b->>'s')::boolean as s, true as goc, bb.b->'ngay' as ngay
          from bb cross join lateral jsonb_array_elements(bb.b->'nhom') n
        union all
        select n.value #>> '{}', 1, true, false, bb.b->'ngay'
          from bb cross join lateral jsonb_array_elements(coalesce(bb.b->'lui', '[]'::jsonb)) n
         where not coalesce(bb.b->'nhom', '[]'::jsonb) @> jsonb_build_array(n.value)
      ) x
     group by 1
  ),
  tat as (
    select coalesce(n2.ma, n1.ma) as ma,
           case when n2.ma is not null then 2 else 1 end as phan,
           coalesce(n1.k, 0) + case when n2.ma is not null then jsonb_array_length(v_ho_tro) else 0 end as k,
           n1.ngay_hoc
      from (select ma, k, ngay_hoc from n1 where trong_cua_so) n1
      full join (select unnest(v_n2) as ma) n2 on n2.ma = n1.ma
  ),
  t2 as (
    select tat.*, public._mtt_ten_nhom(tat.ma) as ten,
           (v_p->tat.ma->>'s')::numeric as p, (v_p->tat.ma->>'n')::int as n,
           (v_dau->tat.ma->>'s')::numeric as p_dau,
           coalesce((v_dau->tat.ma->>'cs')::int, case when tat.ma like 'HH%' then 3 else 5 end) as cs,
           coalesce(v_dau->tat.ma->'lan', '[]'::jsonb) as lan,
           (select count(*) from dai_bdm_dang_bai db where db.nhom_id = tat.ma)::int as tong_dang
      from tat
  ),
  t3 as (
    select t2.*,
           case when t2.k > 0 then (
             select least(0.8, avg(z.v)) from (
               select s.v from (
                 select 0.8::numeric as v, 0 as o, gs as i from generate_series(1, t2.k) gs
                 union all
                 select (a.e->>1)::numeric, 1, a.ord::int from jsonb_array_elements(t2.lan) with ordinality as a(e, ord)
                  where (a.e->>0)::bigint > v_han30
               ) s order by s.o, s.i limit t2.cs
             ) z) end as mt
      from t2
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma', t3.ma, 'ten', t3.ten, 'phan', t3.phan,
           'p', case when t3.p is not null then round(100 * t3.p)::int end, 'n', t3.n,
           'p_dau', case when t3.p_dau is not null then round(100 * t3.p_dau)::int end,
           'd', case when t3.p is not null and t3.p_dau is not null then round(100 * t3.p)::int - round(100 * t3.p_dau)::int end,
           'mt', case when t3.mt is not null then round(100 * t3.mt)::int end, 'dich', 80,
           'k', t3.k, 'tong_dang', t3.tong_dang, 'ngay_hoc', coalesce(t3.ngay_hoc, '[]'::jsonb),
           'tien', case when t3.p is not null and t3.mt is not null and t3.mt > 0 then round(least(t3.p / t3.mt, 1), 4) end,
           'tien_dau', case when t3.p_dau is not null and t3.mt is not null and t3.mt > 0 then round(least(t3.p_dau / t3.mt, 1), 4) end)
         order by t3.phan, t3.p nulls last, t3.ten), '[]'::jsonb)
    into v_nhom
    from t3;

  -- đầu tuần: cùng tập nhóm đang tính tiến độ; nhóm CHƯA có số lúc đầu tuần (kiến thức mới) tính 0 — chưa học thì chưa tới đâu
  select round(100 * avg((e->>'tien')::numeric), 1),
         round(100 * avg(coalesce((e->>'tien_dau')::numeric, 0)) filter (where e->>'tien' is not null), 1)
    into v_td, v_td_dau
    from jsonb_array_elements(v_nhom) e;

  -- đang xếp hàng: nhóm đang YẾU mà chưa vào tờ tuần này
  select coalesce(jsonb_agg(jsonb_build_object('ma', k.key, 'ten', public._mtt_ten_nhom(k.key),
                                                'p', round(100 * (k.value->>'s')::numeric)::int) order by (k.value->>'s')::numeric), '[]'::jsonb)
    into v_hang
    from jsonb_each(v_p) k
   where k.value->>'muc' = 'yeu'
     and not exists (select 1 from jsonb_array_elements(v_nhom) e where e->>'ma' = k.key);

  -- sắp học: buổi trong tuần mà buổi kế đã sang tuần sau ⇒ tính vào mục tiêu tuần sau
  select jsonb_build_object('ngay', e->'ngay',
           'nhom', coalesce((select jsonb_agg(public._mtt_ten_nhom(n.value #>> '{}')) from jsonb_array_elements(e->'nhom') n), '[]'::jsonb))
    into v_sap
    from jsonb_array_elements(v_buoi) e
   where (e->>'w')::boolean and not (e->>'s')::boolean
   order by e->>'ngay' limit 1;

  -- VIỆC CỦA CON
  with bb as (select e as b from jsonb_array_elements(v_buoi) e),
  et as (
    select 'et'::text as loai, (bb.b->>'id')::uuid as buoi_id, (bb.b->>'ngay')::date as ngay, null::date as han, bb.b->>'dd' as dd, 1 as o
      from bb where (bb.b->>'w')::boolean and bb.b->>'id' is not null   -- ca chiếu (chưa mở buổi) không thành việc của con
  ),
  bt as (
    select 'btvn'::text, (bb.b->>'id')::uuid, (bb.b->>'ngay')::date, (bb.b->>'sau')::date, bb.b->>'dd', 2
      from bb where (bb.b->>'s')::boolean and bb.b->>'id' is not null
  ),
  ht as (
    select case h.value->>'loai' when 'bo_tro_nhe' then 'sau_gio' else 'bo_tro' end, (h.value->>'id')::uuid, (h.value->>'ngay')::date,
           null::date, h.value->>'dd', 3
      from jsonb_array_elements(v_ho_tro) h
  ),
  tat as (select * from et union all select * from bt union all select * from ht),
  d as (
    select tat.*, dm.pct, dm.so_cau,
           kq.thai_do, kq.trang_thai_nop,
           exists (select 1 from btvn_nop np where np.hoc_sinh_id = p_hs and np.buoi_hoc_id = tat.buoi_id and np.nop_at < v_den) as da_nop
      from tat
      left join lateral public._mtt_diem(p_hs, tat.buoi_id, case when tat.loai = 'btvn' then 'btvn' else 'et' end, p_den) dm on true
      left join btvn_ket_qua kq on tat.loai = 'btvn' and kq.hoc_sinh_id = p_hs and kq.buoi_hoc_id = tat.buoi_id
  ),
  d2 as (
    select d.*,
           case
             when d.pct is not null then 'xong'
             when d.loai = 'btvn' then case when d.da_nop or d.trang_thai_nop in ('nop_dung_han', 'nop_muon') then 'cho_cham'
                                            when d.trang_thai_nop = 'xin_phep' then 'xin_phep'
                                            when d.han is null or d.han > v_today then 'sap_toi'
                                            else 'chua_nop' end
             when d.ngay >= v_today then 'sap_toi'
             when d.dd in ('vang', 'vang_phep') then 'vang'
             else 'cho_cham'
           end as tt,
           case when d.pct is null then null
                when d.loai = 'btvn' and d.thai_do is not null and d.thai_do <> 'nghiem_tuc' then public._mtt_ha_muc(public._mtt_muc(d.pct))
                else public._mtt_muc(d.pct) end as muc
      from d
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'loai', d2.loai, 'buoi_id', d2.buoi_id, 'ngay', d2.ngay, 'han', d2.han, 'tt', d2.tt,
           'pct', case when d2.pct is not null then round(100 * d2.pct)::int end, 'so_cau', d2.so_cau, 'muc', d2.muc,
           'thai_do', d2.thai_do, 'nop', d2.trang_thai_nop, 'dd', d2.dd,
           'ghi_chu', case when d2.loai = 'btvn' and d2.pct is not null and d2.thai_do is not null and d2.thai_do <> 'nghiem_tuc'
                             then 'Thiếu nghiêm túc (hạ 1 mức)'
                           when d2.tt = 'vang' then 'Vắng — cần học bù'
                           when d2.loai = 'btvn' and d2.trang_thai_nop = 'nop_muon' then 'Nộp muộn' end,
           'nhom', case when d2.loai in ('sau_gio', 'bo_tro') then
                     (select jsonb_agg(e->'ten') from jsonb_array_elements(v_nhom) e where (e->>'phan')::int = 2)
                   else (select jsonb_agg(public._mtt_ten_nhom(n.value #>> '{}'))
                           from jsonb_array_elements(v_buoi) bx cross join lateral jsonb_array_elements(bx->'nhom') n
                          where (bx->>'id')::uuid = d2.buoi_id) end,
           'gio', (select h.value->>'gio' from jsonb_array_elements(v_ho_tro) h where (h.value->>'id')::uuid = d2.buoi_id),
           'phong', (select h.value->>'phong' from jsonb_array_elements(v_ho_tro) h where (h.value->>'id')::uuid = d2.buoi_id))
         order by d2.ngay, d2.o), '[]'::jsonb)
    into v_viec
    from d2;

  -- tự luyện trên app (không bắt buộc, không tính vào x/y)
  select jsonb_build_object('so_cau', count(*), 'so_luot', count(distinct bl.id),
           'pct', case when count(*) > 0 then round(100 * avg(case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end))::int end,
           'nhom', coalesce((select jsonb_agg(distinct public._mtt_ten_nhom(q.n)) from (
                     select public._do_o_quy(v_bdm, false, coalesce(btc2.ma_cau, ''), coalesce(btc2.ma_dang, '')) as n
                       from bai_lam bl2 join bai_test bt2 on bt2.id = bl2.bai_test_id
                       join bai_lam_cau blc2 on blc2.bai_lam_id = bl2.id join bai_test_cau btc2 on btc2.id = blc2.bai_test_cau_id
                      where bl2.hoc_sinh_id = p_hs and bt2.loai = 'tu_luyen' and bt2.mon = p_mon and blc2.verdict is not null
                        and blc2.cham_at >= public._mtt_moc(v_tu) and blc2.cham_at < least(v_den, public._mtt_moc(v_toi + 1))
                      group by 1 limit 6) q where q.n is not null), '[]'::jsonb))
    into v_tl
    from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id
    join bai_lam_cau blc on blc.bai_lam_id = bl.id
   where bl.hoc_sinh_id = p_hs and bt.loai = 'tu_luyen' and bt.mon = p_mon and blc.verdict is not null
     and blc.cham_at >= public._mtt_moc(v_tu) and blc.cham_at < least(v_den, public._mtt_moc(v_toi + 1));

  return jsonb_build_object(
    'tuan', v_tu, 'den_ngay', v_toi, 'mon', p_mon, 'chot', v_chot,
    'hs', jsonb_build_object('id', v_hs.id, 'ten', v_hs.ho_ten, 'khoi', v_hs.khoi,
                             'lop_id', v_lop1, 'lop', (select l.ten_lop from lop l where l.id = v_lop1)),
    'tien_do', v_td, 'tien_do_dau', v_td_dau, 'tien_do_d', round(v_td - v_td_dau),
    'nhom', v_nhom, 'xep_hang_cho', v_hang, 'sap_hoc', v_sap,
    'viec', v_viec,
    'viec_tong', jsonb_array_length(v_viec),
    'viec_xong', (select count(*) from jsonb_array_elements(v_viec) e where e->>'tt' in ('xong', 'cho_cham')),
    'viec_den_han', (select count(*) from jsonb_array_elements(v_viec) e where e->>'tt' <> 'sap_toi'),
    'tu_luyen', v_tl,
    'tinh_at', now());
end $function$;
