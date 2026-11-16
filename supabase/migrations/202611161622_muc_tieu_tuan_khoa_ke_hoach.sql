-- ============================================================================
-- 202611161622 — muc_tieu_tuan_khoa_ke_hoach  (Thùy 16/11)
-- ----------------------------------------------------------------------------
-- VÌ SAO: "Hành vi chốt phải là: hệ thống đọc bổ trợ và giáo trình của tuần này để ghi ra mục tiêu" + luồng tuần Thùy duyệt 16/11:
--   · 00:00 thứ Hai MÁY chốt KẾT QUẢ tuần cũ vào sổ (mtt_chot — đã có, cron _mtt_lam_moi). Người chỉ xem.
--   · Sau buổi họp thứ Hai, trưởng khối bấm "Chốt mục tiêu tuần" ⇒ hệ đọc giáo trình + bổ trợ tuần này ⇒ GHI CỨNG MỤC TIÊU.
--   · Cả tuần chỉ SỐ ĐO chạy (vài phút một lần); mục tiêu không đổi theo việc sửa giáo trình / duyệt thêm bổ trợ giữa tuần.
--   Trước mig này: chỉ số đầu tuần bị khoá, danh sách nhóm + cờ mục tiêu tuần tính lại mỗi 5 phút ⇒ mục tiêu trôi.
-- GỒM:
--   · mtt_ke_hoach (tuan, mon, hoc_sinh_id) — bản khoá: nhom [{ma, ten, phan, mt, k, ngay_hoc}] · viec [{loai, buoi_id, ngay}] · chot_at.
--     Bất biến (trigger chặn sửa/xoá). Ghi 1 lần ở lần đầu _mtt_ghi tính tờ sau khi lớp chốt (lúc bấm chốt: trong ngân sách 4 s;
--     em còn lại: cron ≤ 5 phút). Em vào lớp giữa tuần ⇒ khoá lúc tờ của em được tính lần đầu.
--   · _mtt_tinh: có bản khoá ⇒ nhóm/phần/mục tiêu/số lần đo lấy từ bản khoá, số đo tính trực tiếp; nhóm mới sau chốt ⇒ 'them_sau_chot'
--     (chỉ nhân sự thấy); việc không có trong bản khoá (vd ca bổ trợ xếp thêm) ⇒ vẫn hiện, gắn 'them_sau'.
--   · _mtt_ghi: lớp đã chốt + em chưa có bản khoá ⇒ ghi bản khoá rồi tính lại theo bản khoá.
-- MẤT GÌ (Luật xoá): không — thêm 1 bảng; create or replace 2 hàm (thân cũ giữ nguyên, chỉ thêm khối khoá).
-- ============================================================================

create table if not exists public.mtt_ke_hoach (
  tuan        date not null,
  mon         text not null,
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  nhom        jsonb not null,
  viec        jsonb not null,
  chot_at     timestamptz not null default now(),
  primary key (tuan, mon, hoc_sinh_id)
);
comment on table public.mtt_ke_hoach is 'Mục tiêu tuần ĐÃ KHOÁ lúc lớp chốt (mig 202611161622). Bất biến. Số đo vẫn tính trực tiếp trong _mtt_tinh.';
drop trigger if exists mtt_ke_hoach_bat_bien_trg on public.mtt_ke_hoach;
create trigger mtt_ke_hoach_bat_bien_trg before update or delete on public.mtt_ke_hoach
  for each row execute function public._mtt_chot_bat_bien();
alter table public.mtt_ke_hoach enable row level security;
revoke all on public.mtt_ke_hoach from anon, authenticated;

create or replace function public._mtt_tinh(p_hs uuid, p_mon text, p_tuan date, p_den timestamptz default null)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
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
  v_kh     record;
  v_them   jsonb := '[]'::jsonb;
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
  with b as (
    select bh.id, bh.lop_id, bh.ngay, bh.gio_bat_dau,
           lead(bh.ngay) over (partition by bh.lop_id order by bh.ngay, bh.gio_bat_dau) as sau
      from buoi_hoc bh
     where bh.lop_id = any(v_lop) and bh.loai = 'thuong' and bh.trang_thai <> 'huy'
       and bh.ngay between v_tu - 28 and v_toi + 21
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', b.id, 'lop_id', b.lop_id, 'ngay', b.ngay, 'sau', b.sau,
           'w', b.ngay between v_tu and v_toi, 's', coalesce(b.sau between v_tu and v_toi, false),
           'dd', (select x.diem_danh from buoi_hoc_hs x where x.buoi_hoc_id = b.id and x.hoc_sinh_id = p_hs limit 1),
           'nhom', to_jsonb(public._mtt_nhom_buoi(b.lop_id, b.ngay, b.id))) order by b.ngay, b.gio_bat_dau), '[]'::jsonb)
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
    select n.value #>> '{}' as ma,
           sum((case when (bb.b->>'w')::boolean then 1 else 0 end) + (case when (bb.b->>'s')::boolean then 1 else 0 end))::int as k,
           bool_or((bb.b->>'s')::boolean) as trong_cua_so,
           jsonb_agg(distinct bb.b->'ngay') filter (where (bb.b->>'s')::boolean) as ngay_hoc
      from bb cross join lateral jsonb_array_elements(bb.b->'nhom') n
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

  -- ⭐ KẾ HOẠCH ĐÃ KHOÁ lúc chốt lớp (mig 202611161622): danh sách nhóm · phần · mục tiêu tuần · số lần đo = bản khoá;
  -- số đo (% hiện tại, đầu tuần, tiến độ) vẫn tính trực tiếp. Nhóm mới xuất hiện sau khi chốt ⇒ them_sau_chot (chỉ để nhân sự thấy).
  select k.nhom, k.viec, k.chot_at into v_kh from mtt_ke_hoach k where k.tuan = p_tuan and k.mon = p_mon and k.hoc_sinh_id = p_hs;
  if found then
    select coalesce(jsonb_agg(jsonb_build_object('ma', e->>'ma', 'ten', e->>'ten', 'phan', (e->>'phan')::int)), '[]'::jsonb)
      into v_them
      from jsonb_array_elements(v_nhom) e
     where not exists (select 1 from jsonb_array_elements(v_kh.nhom) x where x->>'ma' = e->>'ma');
    with x as (
      select x.e->>'ma' as ma, x.e->>'ten' as ten, (x.e->>'phan')::int as phan, (x.e->>'mt')::numeric / 100 as mt,
             (x.e->>'k')::int as k, coalesce(x.e->'ngay_hoc', '[]'::jsonb) as ngay_hoc, x.o
        from jsonb_array_elements(v_kh.nhom) with ordinality as x(e, o)
    ),
    y as (
      select x.*, (v_p->x.ma->>'s')::numeric as p, (v_p->x.ma->>'n')::int as n, (v_dau->x.ma->>'s')::numeric as p_dau,
             (select count(*) from dai_bdm_dang_bai db where db.nhom_id = x.ma)::int as tong_dang
        from x
    )
    select coalesce(jsonb_agg(jsonb_build_object(
             'ma', y.ma, 'ten', y.ten, 'phan', y.phan,
             'p', case when y.p is not null then round(100 * y.p)::int end, 'n', y.n,
             'p_dau', case when y.p_dau is not null then round(100 * y.p_dau)::int end,
             'd', case when y.p is not null and y.p_dau is not null then round(100 * y.p)::int - round(100 * y.p_dau)::int end,
             'mt', case when y.mt is not null then round(100 * y.mt)::int end, 'dich', 80,
             'k', y.k, 'tong_dang', y.tong_dang, 'ngay_hoc', y.ngay_hoc,
             'tien', case when y.p is not null and y.mt is not null and y.mt > 0 then round(least(y.p / y.mt, 1), 4) end,
             'tien_dau', case when y.p_dau is not null and y.mt is not null and y.mt > 0 then round(least(y.p_dau / y.mt, 1), 4) end)
           order by y.o), '[]'::jsonb)
      into v_nhom
      from y;
  end if;

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
      from bb where (bb.b->>'w')::boolean
  ),
  bt as (
    select 'btvn'::text, (bb.b->>'id')::uuid, (bb.b->>'ngay')::date, (bb.b->>'sau')::date, bb.b->>'dd', 2
      from bb where (bb.b->>'s')::boolean
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

  if v_kh.nhom is not null then
    select coalesce(jsonb_agg(e || jsonb_build_object('them_sau', not exists (
             select 1 from jsonb_array_elements(v_kh.viec) x where x->>'loai' = e->>'loai' and x->>'buoi_id' = e->>'buoi_id'))
           order by o), '[]'::jsonb)
      into v_viec
      from jsonb_array_elements(v_viec) with ordinality as t(e, o);
  end if;

  return jsonb_build_object(
    'tuan', v_tu, 'den_ngay', v_toi, 'mon', p_mon, 'chot', v_chot,
    'ke_hoach_at', v_kh.chot_at, 'them_sau_chot', v_them,
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
end $$;

create or replace function public._mtt_ghi(p_hs uuid, p_mon text, p_tuan date)
returns void
language plpgsql volatile security definer set search_path to 'public' as $$
declare v jsonb;
begin
  -- đầu tuần chụp 1 lần (chỉ khi đã qua 00:00 thứ Hai của tuần đó)
  if now() >= public._mtt_moc(p_tuan) then
    insert into mtt_dau (tuan, hoc_sinh_id, nhom) values (p_tuan, p_hs, public._mtt_dau_tinh(p_hs, p_tuan))
    on conflict (tuan, hoc_sinh_id) do nothing;
  end if;
  v := public._mtt_tinh(p_hs, p_mon, p_tuan, null);
  if v is null then return; end if;
  -- ⭐ KHOÁ KẾ HOẠCH tuần (mig 202611161622): lần đầu tính tờ SAU KHI LỚP CHỐT ⇒ ghi cứng nhóm · phần · mục tiêu tuần · số lần đo · danh sách việc
  if coalesce((v->>'chot')::boolean, false) and v->>'ke_hoach_at' is null then
    insert into mtt_ke_hoach (tuan, mon, hoc_sinh_id, nhom, viec)
    values (p_tuan, p_mon, p_hs,
            coalesce((select jsonb_agg(jsonb_build_object('ma', e->>'ma', 'ten', e->>'ten', 'phan', (e->>'phan')::int, 'mt', e->'mt',
                                                          'k', e->'k', 'ngay_hoc', e->'ngay_hoc') order by o)
                        from jsonb_array_elements(v->'nhom') with ordinality as t(e, o)), '[]'::jsonb),
            coalesce((select jsonb_agg(jsonb_build_object('loai', e->>'loai', 'buoi_id', e->>'buoi_id', 'ngay', e->>'ngay'))
                        from jsonb_array_elements(v->'viec') e), '[]'::jsonb))
    on conflict (tuan, mon, hoc_sinh_id) do nothing;
    v := public._mtt_tinh(p_hs, p_mon, p_tuan, null);
  end if;
  insert into mtt_luu (tuan, mon, hoc_sinh_id, lop_id, khoi, tien_do, viec_xong, viec_tong, viec_den_han, payload, tinh_at)
  values (p_tuan, p_mon, p_hs, (v->'hs'->>'lop_id')::uuid, v->'hs'->>'khoi', (v->>'tien_do')::numeric,
          (v->>'viec_xong')::int, (v->>'viec_tong')::int, (v->>'viec_den_han')::int, v, now())
  on conflict (tuan, mon, hoc_sinh_id) do update set
    lop_id = excluded.lop_id, khoi = excluded.khoi, tien_do = excluded.tien_do, viec_xong = excluded.viec_xong,
    viec_tong = excluded.viec_tong, viec_den_han = excluded.viec_den_han, payload = excluded.payload, tinh_at = excluded.tinh_at;
end $$;

revoke execute on function public._mtt_tinh(uuid, text, date, timestamptz) from public, anon;
revoke execute on function public._mtt_ghi(uuid, text, date) from public, anon;
