-- ============================================================================
-- 202611131000 — muc_tieu_tuan  (spec-muc-tieu-tuan.md, Thùy chốt 12–13/11)
-- ----------------------------------------------------------------------------
-- VÌ SAO: tờ MỤC TIÊU TUẦN của học sinh (HS × môn × tuần) — một bộ hàm, ba người xem: app HS · app phụ huynh (FDW) · ERP
--   (tab "Mục tiêu tuần" trong Dashboard học tập, cũng hiện trong Phòng làm việc trưởng khối).
--
-- GỒM:
--   · mtt_lop_chot  — dấu "lớp đã chốt mục tiêu tuần" (sau buổi họp chiều thứ Hai). CHƯA CHỐT THÌ CHƯA HIỆN (spec §12.4).
--                     Append-only: dòng = bằng chứng ai chốt, lúc nào. Không có đường xoá.
--   · mtt_dau       — số ĐẦU TUẦN của từng nhóm (chụp lần đầu tờ tuần được tính, bất biến) ⇒ ▲/▼ so với đầu tuần + mục tiêu tuần.
--   · mtt_luu       — tờ tuần ĐANG CHẠY, bảng đệm (ghi đè từng em), chỉ _mtt_ghi ghi. App đọc bảng này (không tính lại cả hệ — §2.0).
--   · mtt_chot      — SỔ CHỐT TUẦN, bất biến: chụp lúc 00:00 thứ Hai cho tuần vừa qua (spec §3.3, §10). Trend + "các tuần đã chốt".
--   · mtt_top       — top 20 tiến độ theo (tuần, môn) toàn trung tâm, tính sẵn (app PH đọc qua FDW, không thấy bảng khác của em khác).
--   · _mtt_tinh     — MỘT nơi tính tờ tuần (jsonb). Mọi con số của 3 màn ra từ đây.
--   · _mtt_lam_moi  — cron 5 phút, ngân sách giây: chốt sổ tuần trước · tính tờ còn thiếu / cũ · xếp hạng · top 20.
--   · fn_mtt_cua_toi / fn_mtt_hs / fn_mtt_cac_tuan / fn_mtt_top / fn_mtt_trung_tam / fn_mtt_chot_lop — hàm cho màn.
--
-- LUẬT CHÍNH (spec):
--   · Tuần = thứ Hai → Chủ nhật, giờ VN. Cửa sổ mục tiêu LÙI MỘT BUỔI: buổi b thuộc mục tiêu tuần W khi BUỔI KẾ của lớp rơi vào W
--     (BTVN của b chấm xong trước buổi kế). Buổi trong W mà buổi kế đã sang tuần sau = "sắp học" (tính vào tuần sau).
--   · Đơn vị đánh giá = NHÓM bài (cap 'nhom' của mastery). % nhóm = mastery theo lần ĐANG CHẠY, có tính BTVN (p_include_btvn = true,
--     y như Dashboard học tập · bổ trợ đang đọc). KHÔNG đổi luật mastery toàn hệ ở đây (spec §8.2 làm riêng, cần so cũ–mới).
--   · Mục tiêu tuần của nhóm = min(80%, mastery nếu mọi lần đo trong tuần đều Tốt 80%), tính từ các lần cũ chụp đầu tuần
--     (bỏ lần sẽ quá 30 ngày lúc hết tuần) + số lần đo dự kiến trong tuần. Không có lần đo nào trong tuần ⇒ không có mục tiêu tuần.
--   · Tiến độ tổng = TB min(% hiện tại / mục tiêu tuần, 1) trên nhóm ĐÃ CÓ số và có mục tiêu tuần. Xếp hạng toàn trung tâm theo tiến độ,
--     mỗi môn một bảng, chung mọi khối.
--   · Việc của con: ET từng buổi trong tuần · BTVN của buổi thuộc cửa sổ · test sau giờ · ca bổ trợ yếu. Nhãn Tốt ≥80 · Tạm ổn ≥50 ·
--     Chưa tốt; CHỈ BTVN xét thái độ (khác "nghiêm túc" ⇒ hạ 1 mức + ghi chú). Tự luyện = thống kê, không tính vào x/y.
--   · Vắng ⇒ việc buổi đó "chưa hoàn thành" (phải học bù). Mới vào lớp ⇒ buổi trước ngày vào không có dòng (chưa có dữ liệu).
--
-- MẤT GÌ (Luật xoá): không — chỉ thêm bảng + hàm mới, không sửa/xoá bảng hay hàm cũ.
-- CHẠY SAU: file 202611131001_muc_tieu_tuan_cron_sql_editor.sql ở SQL Editor (lịch cron).
-- ============================================================================

-- ── 1. Bảng ─────────────────────────────────────────────────────────────────
create table if not exists public.mtt_lop_chot (
  tuan     date not null,
  lop_id   uuid not null references public.lop(id) on delete cascade,
  chot_at  timestamptz not null default now(),
  chot_boi uuid references public.nhan_su(id),
  primary key (tuan, lop_id)
);
comment on table public.mtt_lop_chot is 'Lớp đã chốt mục tiêu tuần (mig 202611131000). Append-only. Chưa có dòng ⇒ tờ tuần của em lớp đó chưa hiện.';

create table if not exists public.mtt_dau (
  tuan        date not null,
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  nhom        jsonb not null,            -- {ma_nhom: {"s": điểm đầu tuần 0..1, "cs": cửa sổ lần, "lan": [[epoch, giá trị], …] mới nhất trước}}
  tinh_at     timestamptz not null default now(),
  primary key (tuan, hoc_sinh_id)
);
comment on table public.mtt_dau is 'Số đầu tuần (00:00 thứ Hai) của từng nhóm, chụp 1 lần, bất biến (mig 202611131000).';

create table if not exists public.mtt_luu (
  tuan         date not null,
  mon          text not null,
  hoc_sinh_id  uuid not null references public.hoc_sinh(id) on delete cascade,
  lop_id       uuid,
  khoi         text,
  tien_do      numeric,                  -- 0..100; NULL = KHÔNG ÁP DỤNG (tuần này không nhóm nào có số + mục tiêu tuần) ⇒ không xếp hạng
  viec_xong    integer not null default 0,
  viec_tong    integer not null default 0,
  viec_den_han integer not null default 0,
  hang         integer,                  -- NULL = không xếp hạng (tien_do NULL)
  hang_truoc   integer,
  hang_ngay    date,
  so_hs        integer,
  payload      jsonb not null,
  tinh_at      timestamptz not null default now(),
  primary key (tuan, mon, hoc_sinh_id)
);
comment on table public.mtt_luu is 'Tờ mục tiêu tuần ĐANG CHẠY — bảng đệm, chỉ _mtt_ghi ghi (mig 202611131000).';
create index if not exists mtt_luu_xep_idx on public.mtt_luu (tuan, mon, tien_do desc);

create table if not exists public.mtt_chot (
  tuan         date not null,
  mon          text not null,
  hoc_sinh_id  uuid not null references public.hoc_sinh(id) on delete cascade,
  lop_id       uuid,
  khoi         text,
  tien_do      numeric,
  viec_xong    integer not null default 0,
  viec_tong    integer not null default 0,
  viec_den_han integer not null default 0,
  hang         integer,
  so_hs        integer,
  payload      jsonb not null,
  chot_at      timestamptz not null default now(),
  primary key (tuan, mon, hoc_sinh_id)
);
comment on table public.mtt_chot is 'SỔ CHỐT TUẦN — bất biến, chụp 00:00 thứ Hai cho tuần vừa qua (mig 202611131000). Không sửa, không xoá.';

create table if not exists public.mtt_top (
  tuan    date not null,
  mon     text not null,
  ds      jsonb not null,               -- [{hang, ten (tên gọi), lop, tien_do}]
  tinh_at timestamptz not null default now(),
  primary key (tuan, mon)
);
comment on table public.mtt_top is 'Top 20 tiến độ tuần toàn trung tâm theo môn, tính sẵn (mig 202611131000).';

-- sổ chốt bất biến: chặn sửa / xoá ở DB (không dựa vào lời hứa của app)
create or replace function public._mtt_chot_bat_bien() returns trigger language plpgsql as $$
begin
  raise exception 'Sổ chốt tuần (mtt_chot) là bất biến — không sửa / xoá.';
end $$;
drop trigger if exists mtt_chot_bat_bien_trg on public.mtt_chot;
create trigger mtt_chot_bat_bien_trg before update or delete on public.mtt_chot
  for each row execute function public._mtt_chot_bat_bien();
drop trigger if exists mtt_lop_chot_bat_bien_trg on public.mtt_lop_chot;
create trigger mtt_lop_chot_bat_bien_trg before update or delete on public.mtt_lop_chot
  for each row execute function public._mtt_chot_bat_bien();

alter table public.mtt_lop_chot enable row level security;
alter table public.mtt_dau      enable row level security;
alter table public.mtt_luu      enable row level security;
alter table public.mtt_chot     enable row level security;
alter table public.mtt_top      enable row level security;
revoke all on public.mtt_lop_chot, public.mtt_dau, public.mtt_luu, public.mtt_chot, public.mtt_top from anon, authenticated;
-- không policy cho authenticated: chỉ đọc qua hàm security definer bên dưới

-- ── 2. Hàm nhỏ ──────────────────────────────────────────────────────────────
create or replace function public._mtt_tuan(p_ngay date) returns date
language sql immutable as $$ select date_trunc('week', p_ngay)::date $$;

create or replace function public._mtt_moc(p_ngay date) returns timestamptz
language sql immutable as $$ select (p_ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh' $$;

create or replace function public._mtt_hom_nay() returns date
language sql stable as $$ select (now() at time zone 'Asia/Ho_Chi_Minh')::date $$;

-- nhãn 3 mức (cùng ngưỡng mastery 0,8 / 0,5 — spec §6)
create or replace function public._mtt_muc(p numeric) returns text
language sql immutable as $$ select case when p is null then null when p >= 0.8 then 'tot' when p >= 0.5 then 'tam_on' else 'chua_tot' end $$;

create or replace function public._mtt_ha_muc(p_muc text) returns text
language sql immutable as $$ select case p_muc when 'tot' then 'tam_on' when 'tam_on' then 'chua_tot' else p_muc end $$;

create or replace function public._mtt_ten_nhom(p_ma text) returns text
language sql stable security definer set search_path to 'public' as $$
  select coalesce((select nb.ten from dai_bdm_nhom nb where nb.id = p_ma),
                  (select 'Hình · ' || hb.ten_bai from hinh_hoc_bai hb where hb.ma_bai = p_ma), p_ma)
$$;

-- tên gọi (2 chữ cuối) — bảng xếp hạng toàn trung tâm không hiện họ
create or replace function public._mtt_ten_goi(p_ho_ten text) returns text
language sql immutable as $$
  select array_to_string((string_to_array(btrim(regexp_replace(coalesce(p_ho_ten, ''), '\s+', ' ', 'g')), ' '))[
           greatest(1, cardinality(string_to_array(btrim(regexp_replace(coalesce(p_ho_ten, ''), '\s+', ' ', 'g')), ' ')) - 1):], ' ')
$$;

-- % của MỘT hoạt động (ET / BTVN / ca bổ trợ) của 1 em ở 1 buổi: Đ/C/S = 1 / 0,5 / 0, trung bình trên số câu.
-- Nguồn y như mastery: bảng chấm buổi (gami_grades) + bài làm app (bai_lam_cau, bỏ câu đã có bản sao trong bảng chấm buổi).
-- p_den: chỉ tính chấm trước mốc (sổ chốt: bài chấm sau giờ chốt không sửa bản đã chốt).
create or replace function public._mtt_diem(p_hs uuid, p_buoi uuid, p_kieu text, p_den timestamptz)
returns table(pct numeric, so_cau integer)
language sql stable security definer set search_path to 'public' as $$
  with g as (
    select case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as v
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
     where g.hoc_sinh_id = p_hs and sp.buoi_hoc_id = p_buoi
       and sp.phase = case when p_kieu = 'btvn' then 'btvn' else 'et' end
       and (p_den is null or g.graded_at < p_den)
    union all
    select case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end
      from bai_test bt
      join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = p_hs
      join bai_lam_cau blc on blc.bai_lam_id = bl.id
     where bt.buoi_hoc_id = p_buoi and blc.verdict is not null
       and case when p_kieu = 'btvn' then bt.loai = 'btvn' else bt.loai not in ('btvn', 'tu_luyen') end
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
       and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
       and (p_den is null or blc.cham_at < p_den)
  )
  select avg(v), count(*)::int from g having count(*) > 0
$$;

-- nhóm bài của MỘT buổi: từ tài liệu đã soạn trên hệ (giáo trình / ET / BTVN của lớp, ngày đó) + câu đã giao trong buổi.
create or replace function public._mtt_nhom_buoi(p_lop uuid, p_ngay date, p_buoi uuid)
returns text[]
language sql stable security definer set search_path to 'public' as $$
  with c as (
    select distinct coalesce(tc.ma_cau, '') as kc, '' as kd
      from tai_lieu t join tai_lieu_phan tp on tp.tai_lieu_id = t.id join tai_lieu_cau tc on tc.phan_id = tp.id
     where t.lop_id = p_lop and t.ngay = p_ngay and t.loai in ('giao_trinh_buoi', 'et', 'btvn') and t.hoc_sinh_id is null
       and tc.ma_cau is not null
    union
    select distinct coalesce(sp.ma_cau, ''), coalesce(sp.ma_dang, '')
      from gami_session_problems sp
     where sp.buoi_hoc_id = p_buoi and sp.phase in ('et', 'btvn') and sp.hoc_sinh_id is null
  )
  select coalesce(array_agg(distinct n) filter (where n is not null), '{}')
    from (select public._do_o_quy(public._mastery_bdm_bat(), false, c.kc, c.kd) as n from c) x
$$;

-- số đầu tuần (00:00 thứ Hai): mỗi nhóm = ≤ cs lần gần nhất trong 30 ngày tính tới mốc — cùng luật _mastery_lan_cap
-- (lần = TB câu của lượt; xếp t desc, luot desc; Hình–Học cửa sổ 3).
create or replace function public._mtt_dau_tinh(p_hs uuid, p_tuan date)
returns jsonb
language sql stable security definer set search_path to 'public' as $$
  with d as (
    select * from public._mastery_lan_d(public._mastery_bdm_bat(), array[p_hs], true,
                                        public._mtt_moc(p_tuan) - interval '30 days', public._mtt_moc(p_tuan))
  ),
  l as (select nhom, luot, avg(value) as v, max(t) as t, bool_or(hh) as hh from d where nhom is not null group by nhom, luot),
  r as (select l.*, row_number() over (partition by nhom order by t desc, luot desc) as rn,
               case when bool_or(hh) over (partition by nhom) then 3 else 5 end as cs from l)
  select coalesce(jsonb_object_agg(x.nhom, jsonb_build_object('s', round(x.s, 4), 'cs', x.cs, 'lan', x.lan)), '{}'::jsonb)
    from (select nhom, max(cs) as cs, avg(v) filter (where rn <= cs) as s,
                 jsonb_agg(jsonb_build_array(extract(epoch from t)::bigint, round(v, 4)) order by rn) filter (where rn <= cs) as lan
            from r group by nhom) x
$$;

-- ── 3. MỘT nơi tính tờ tuần ─────────────────────────────────────────────────
-- p_den NULL = bây giờ (tờ đang chạy); p_den = mốc ⇒ "tại mốc" (sổ chốt).
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
end $$;

-- ── 4. Ghi bảng đệm (cron + lúc chốt lớp) ───────────────────────────────────
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
  insert into mtt_luu (tuan, mon, hoc_sinh_id, lop_id, khoi, tien_do, viec_xong, viec_tong, viec_den_han, payload, tinh_at)
  values (p_tuan, p_mon, p_hs, (v->'hs'->>'lop_id')::uuid, v->'hs'->>'khoi', (v->>'tien_do')::numeric,
          (v->>'viec_xong')::int, (v->>'viec_tong')::int, (v->>'viec_den_han')::int, v, now())
  on conflict (tuan, mon, hoc_sinh_id) do update set
    lop_id = excluded.lop_id, khoi = excluded.khoi, tien_do = excluded.tien_do, viec_xong = excluded.viec_xong,
    viec_tong = excluded.viec_tong, viec_den_han = excluded.viec_den_han, payload = excluded.payload, tinh_at = excluded.tinh_at;
end $$;

-- xếp hạng + top 20 của (tuần, môn) — đọc bảng đệm, một câu lệnh
create or replace function public._mtt_xep_hang(p_tuan date, p_mon text)
returns void
language plpgsql volatile security definer set search_path to 'public' as $$
declare v_hom_nay date := public._mtt_hom_nay();
begin
  with r as (
    select hoc_sinh_id, rank() over (order by tien_do desc) as h, count(*) over () as so
      from mtt_luu where tuan = p_tuan and mon = p_mon and tien_do is not null
  )
  update mtt_luu m set
    hang_truoc = case when m.hang_ngay is distinct from v_hom_nay then m.hang else m.hang_truoc end,
    hang_ngay  = v_hom_nay,
    hang = rr.h, so_hs = rr.so
  from (select x.hoc_sinh_id, r.h, r.so from mtt_luu x left join r on r.hoc_sinh_id = x.hoc_sinh_id
         where x.tuan = p_tuan and x.mon = p_mon) rr
  where m.tuan = p_tuan and m.mon = p_mon and m.hoc_sinh_id = rr.hoc_sinh_id
    and (m.hang is distinct from rr.h or m.so_hs is distinct from rr.so or m.hang_ngay is distinct from v_hom_nay);

  insert into mtt_top (tuan, mon, ds, tinh_at)
  select p_tuan, p_mon, coalesce((
           select jsonb_agg(jsonb_build_object('hang', t.hang, 'ten', public._mtt_ten_goi(h.ho_ten),
                                               'lop', t.payload->'hs'->>'lop', 'tien_do', round(t.tien_do)::int) order by t.hang, h.ho_ten)
             from (select * from mtt_luu where tuan = p_tuan and mon = p_mon and hang is not null and hang <= 20) t
             join hoc_sinh h on h.id = t.hoc_sinh_id), '[]'::jsonb), now()
  on conflict (tuan, mon) do update set ds = excluded.ds, tinh_at = excluded.tinh_at;
end $$;

-- ── 5. Cron 5 phút: chốt sổ tuần trước · tính tờ thiếu / cũ · xếp hạng ─────
create or replace function public._mtt_lam_moi(p_giay integer default 40)
returns jsonb
language plpgsql volatile security definer set search_path to 'public' as $$
declare
  v_bat   timestamptz := clock_timestamp();
  v_w     date := public._mtt_tuan(public._mtt_hom_nay());
  v_p     date := v_w - 7;
  r       record;
  v_chot  int := 0;
  v_tinh  int := 0;
  v_mon   text;
  v_pl    jsonb;
begin
  -- (a) SỔ CHỐT tuần vừa qua: tính lại TẠI MỐC 00:00 thứ Hai (bài chấm sau mốc không vào bản chốt), hạng = hạng cuối của bảng đệm
  for r in
    select m.hoc_sinh_id, m.mon, m.lop_id, m.khoi, m.hang, m.so_hs
      from mtt_luu m
     where m.tuan = v_p and not exists (select 1 from mtt_chot c where c.tuan = v_p and c.mon = m.mon and c.hoc_sinh_id = m.hoc_sinh_id)
     order by m.mon, m.hoc_sinh_id
  loop
    exit when clock_timestamp() - v_bat > make_interval(secs => p_giay * 0.5);
    v_pl := public._mtt_tinh(r.hoc_sinh_id, r.mon, v_p, public._mtt_moc(v_w));
    if v_pl is not null then
      insert into mtt_chot (tuan, mon, hoc_sinh_id, lop_id, khoi, tien_do, viec_xong, viec_tong, viec_den_han, hang, so_hs, payload)
      values (v_p, r.mon, r.hoc_sinh_id, r.lop_id, r.khoi, (v_pl->>'tien_do')::numeric, (v_pl->>'viec_xong')::int,
              (v_pl->>'viec_tong')::int, (v_pl->>'viec_den_han')::int, r.hang, r.so_hs, v_pl)
      on conflict do nothing;
      v_chot := v_chot + 1;
    end if;
  end loop;

  -- (b) tờ tuần này: em của lớp đã chốt — thiếu trước, rồi cũ nhất (cache mastery mới hơn lần tính, hoặc quá 20 phút)
  for r in
    select x.hoc_sinh_id, x.mon from (
      select distinct hl.hoc_sinh_id, l.mon
        from mtt_lop_chot c join lop l on l.id = c.lop_id
        join hoc_sinh_lop hl on hl.lop_id = l.id and hl.trang_thai = 'dang_hoc'
        join hoc_sinh h on h.id = hl.hoc_sinh_id and h.trang_thai = 'dang_hoc'
       where c.tuan = v_w
    ) x
    left join mtt_luu m on m.tuan = v_w and m.mon = x.mon and m.hoc_sinh_id = x.hoc_sinh_id
    left join mastery_luu_san_tinh t on t.hoc_sinh_id = x.hoc_sinh_id
   where m.hoc_sinh_id is null or m.tinh_at < now() - interval '20 minutes' or m.tinh_at < t.tinh_at
   order by (m.hoc_sinh_id is not null), m.tinh_at nulls first
  loop
    exit when clock_timestamp() - v_bat > make_interval(secs => p_giay * 0.9);
    perform public._mtt_ghi(r.hoc_sinh_id, r.mon, v_w);
    v_tinh := v_tinh + 1;
  end loop;

  -- (c) xếp hạng + top 20 từng môn của tuần này
  for v_mon in select distinct mon from mtt_luu where tuan = v_w loop
    perform public._mtt_xep_hang(v_w, v_mon);
  end loop;

  return jsonb_build_object('tuan', v_w, 'chot_so', v_chot, 'tinh', v_tinh,
                            'giay', round(extract(epoch from clock_timestamp() - v_bat)::numeric, 1));
end $$;

-- ── 6. Hàm cho màn ──────────────────────────────────────────────────────────
-- gắn hạng vào payload (hạng nằm ở cột vì cron xếp sau khi tính)
create or replace function public._mtt_kem_hang(p_payload jsonb, p_hang integer, p_hang_truoc integer, p_so integer, p_tinh_at timestamptz)
returns jsonb language sql immutable as $$
  select p_payload || jsonb_build_object('hang', p_hang, 'hang_truoc', p_hang_truoc, 'hang_doi', p_hang_truoc - p_hang, 'so_hs', p_so, 'so_tinh_at', p_tinh_at)
$$;

-- tờ tuần của MỘT em (dùng chung cho HS và nhân sự). p_can_chot = true ⇒ lớp chưa chốt thì không trả tờ.
create or replace function public._mtt_doc(p_hs uuid, p_mon text, p_tuan date, p_can_chot boolean)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_w date := public._mtt_tuan(public._mtt_hom_nay());
  v_t date := public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay()));
  v   jsonb;
  m   record;
begin
  if v_t < v_w then   -- tuần đã qua ⇒ sổ chốt (chưa chốt sổ thì đọc bảng đệm cuối)
    select c.payload, c.hang, c.so_hs, c.chot_at into m from mtt_chot c where c.tuan = v_t and c.mon = p_mon and c.hoc_sinh_id = p_hs;
    if found then return public._mtt_kem_hang(m.payload, m.hang, null, m.so_hs, m.chot_at) || jsonb_build_object('da_chot_so', true); end if;
  end if;
  select l.payload, l.hang, l.hang_truoc, l.so_hs, l.tinh_at into m from mtt_luu l where l.tuan = v_t and l.mon = p_mon and l.hoc_sinh_id = p_hs;
  if found then
    if p_can_chot and not coalesce((m.payload->>'chot')::boolean, false) then
      return jsonb_build_object('chua_chot', true, 'tuan', v_t, 'mon', p_mon);
    end if;
    return public._mtt_kem_hang(m.payload, m.hang, m.hang_truoc, m.so_hs, m.tinh_at);
  end if;
  v := public._mtt_tinh(p_hs, p_mon, v_t, case when v_t < v_w then public._mtt_moc(v_t + 7) end);   -- cron chưa kịp ⇒ tính trực tiếp
  if v is null then return null; end if;
  if p_can_chot and not coalesce((v->>'chot')::boolean, false) then
    return jsonb_build_object('chua_chot', true, 'tuan', v_t, 'mon', p_mon);
  end if;
  return v;
end $$;

-- app HS: tờ của chính em
create or replace function public.fn_mtt_cua_toi(p_mon text, p_tuan date default null)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Chỉ tài khoản học sinh.'; end if;
  return public._mtt_doc(v_hs, p_mon, p_tuan, true);
end $$;

-- ERP: tờ của 1 em (nhân sự xem cả khi lớp chưa chốt — payload có cờ 'chot')
create or replace function public.fn_mtt_hs(p_hs uuid, p_mon text, p_tuan date default null)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  return public._mtt_doc(p_hs, p_mon, p_tuan, false);
end $$;

-- các tuần đã chốt (trend): HS đọc của mình (p_hs null), nhân sự đọc em bất kỳ
create or replace function public.fn_mtt_cac_tuan(p_mon text, p_hs uuid default null, p_so integer default 8)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare v_hs uuid;
begin
  if p_hs is null then v_hs := public.my_hoc_sinh_id();
  elsif public.la_thanh_vien() then v_hs := p_hs;
  else raise exception 'Không có quyền.'; end if;
  if v_hs is null then raise exception 'Chỉ tài khoản học sinh.'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
             'tuan', c.tuan, 'tien_do', c.tien_do, 'viec_xong', c.viec_xong, 'viec_tong', c.viec_tong, 'hang', c.hang, 'so_hs', c.so_hs,
             'nhom', (select coalesce(jsonb_agg(jsonb_build_object('ma', e->>'ma', 'ten', e->>'ten', 'p', e->'p')), '[]'::jsonb)
                        from jsonb_array_elements(c.payload->'nhom') e))
           order by c.tuan)
      from (select * from mtt_chot where mon = p_mon and hoc_sinh_id = v_hs order by tuan desc limit greatest(1, least(coalesce(p_so, 8), 26))) c
  ), '[]'::jsonb);
end $$;

-- top 20 toàn trung tâm (tính sẵn) — HS và nhân sự
create or replace function public.fn_mtt_top(p_mon text, p_tuan date default null)
returns jsonb
language sql stable security definer set search_path to 'public' as $$
  select case when public.my_hoc_sinh_id() is null and not public.la_thanh_vien() then null else
    coalesce((select jsonb_build_object('tuan', t.tuan, 'ds', t.ds, 'tinh_at', t.tinh_at) from mtt_top t
               where t.tuan = public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay())) and t.mon = p_mon),
             jsonb_build_object('tuan', public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay())), 'ds', '[]'::jsonb, 'tinh_at', null)) end
$$;

-- ERP — tab trung tâm: tổng khối · theo lớp (kèm trạng thái chốt) · em cần để ý
create or replace function public.fn_mtt_trung_tam(p_mon text, p_khoi text, p_tuan date default null)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_w date := public._mtt_tuan(public._mtt_hom_nay());
  v_t date := public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay()));
  v_r jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  with lop_k as (
    select l.id, l.ten_lop from lop l where l.mon = p_mon and l.khoi = p_khoi and l.trang_thai = 'dang_hoc'
  ),
  t as (   -- tuần đã qua: sổ chốt; tuần đang chạy: bảng đệm
    select c.hoc_sinh_id, c.lop_id, c.tien_do, c.viec_xong, c.viec_tong, c.viec_den_han, c.hang, c.payload, c.chot_at as at
      from mtt_chot c where v_t < v_w and c.tuan = v_t and c.mon = p_mon and c.lop_id in (select id from lop_k)
    union all
    select m.hoc_sinh_id, m.lop_id, m.tien_do, m.viec_xong, m.viec_tong, m.viec_den_han, m.hang, m.payload, m.tinh_at
      from mtt_luu m where m.tuan = v_t and m.mon = p_mon and m.lop_id in (select id from lop_k)
       and (v_t >= v_w or not exists (select 1 from mtt_chot c where c.tuan = v_t and c.mon = p_mon and c.hoc_sinh_id = m.hoc_sinh_id))
  ),
  vb as (   -- BTVN từng em: mức hiển thị + thái độ gốc (trung tâm thấy đủ 4 mức)
    select t.hoc_sinh_id, t.lop_id, e->>'muc' as muc, e->>'thai_do' as thai_do
      from t cross join lateral jsonb_array_elements(t.payload->'viec') e where e->>'loai' = 'btvn'
  ),
  em as (
    select t.*, h.ho_ten,
           array_remove(array[
             case when t.viec_den_han > 0 and t.viec_xong = 0 then 'Chưa làm việc nào trong ' || t.viec_den_han || ' việc đến hạn' end,
             case when (t.payload->>'tien_do')::numeric < (t.payload->>'tien_do_dau')::numeric
                  then 'Tiến độ giảm so với đầu tuần (' || round((t.payload->>'tien_do_dau')::numeric) || '% → ' || round((t.payload->>'tien_do')::numeric) || '%)' end,
             case when exists (select 1 from vb where vb.hoc_sinh_id = t.hoc_sinh_id and vb.thai_do in ('chua_nghiem_tuc', 'chong_doi'))
                  then 'BTVN: ' || (select string_agg(distinct case vb.thai_do when 'chong_doi' then 'chống đối' else 'chưa nghiêm túc' end, ', ')
                                      from vb where vb.hoc_sinh_id = t.hoc_sinh_id and vb.thai_do in ('chua_nghiem_tuc', 'chong_doi')) end,
             case when exists (select 1 from jsonb_array_elements(t.payload->'viec') e where e->>'loai' in ('sau_gio', 'bo_tro') and e->>'tt' = 'vang')
                  then 'Vắng ca bổ trợ / test sau giờ' end,
             case when (select count(*) from jsonb_array_elements(t.payload->'viec') e where e->>'loai' = 'btvn' and e->>'tt' = 'chua_nop') > 0
                  then 'Chưa nộp ' || (select count(*) from jsonb_array_elements(t.payload->'viec') e where e->>'loai' = 'btvn' and e->>'tt' = 'chua_nop') || ' BTVN' end
           ], null) as ly_do
      from t join hoc_sinh h on h.id = t.hoc_sinh_id
  ),
  theo_lop as (
    select lk.id as lop_id, lk.ten_lop,
           (select count(*) from hoc_sinh_lop hl join hoc_sinh h on h.id = hl.hoc_sinh_id
             where hl.lop_id = lk.id and hl.trang_thai = 'dang_hoc' and h.trang_thai = 'dang_hoc')::int as si_so,
           (select c.chot_at from mtt_lop_chot c where c.tuan = v_t and c.lop_id = lk.id) as chot_at,
           (select count(*) from buoi_hoc b where b.lop_id = lk.id and b.loai = 'thuong' and b.trang_thai <> 'huy'
             and b.ngay between v_t and v_t + 6)::int as so_buoi,
           (select count(*) from buoi_hoc b where b.lop_id = lk.id and b.loai = 'thuong' and b.trang_thai <> 'huy'
             and b.ngay between v_t and v_t + 6
             and exists (select 1 from tai_lieu tl where tl.lop_id = lk.id and tl.ngay = b.ngay and tl.hoc_sinh_id is null
                           and tl.loai in ('giao_trinh_buoi', 'et', 'btvn')))::int as so_buoi_co_tl,
           (select count(*) from bo_tro_de_xuat d where d.lop_id = lk.id and d.mon = p_mon and d.trang_thai in ('nhap', 'cho_duyet')
             and d.tao_at >= public._mtt_moc(v_t - 7))::int as bo_tro_cho,
           (select round(avg(em.tien_do), 1) from em where em.lop_id = lk.id) as tien_do_tb,
           (select round(avg((em.payload->>'tien_do_dau')::numeric), 1) from em where em.lop_id = lk.id and em.tien_do is not null) as tien_do_dau_tb,
           (select coalesce(sum(em.viec_xong), 0) from em where em.lop_id = lk.id)::int as viec_xong,
           (select coalesce(sum(em.viec_den_han), 0) from em where em.lop_id = lk.id)::int as viec_den_han,
           (select count(*) from vb where vb.lop_id = lk.id and vb.muc = 'tot')::int as btvn_tot,
           (select count(*) from vb where vb.lop_id = lk.id and vb.muc = 'tam_on')::int as btvn_tam_on,
           (select count(*) from vb where vb.lop_id = lk.id and vb.muc = 'chua_tot')::int as btvn_chua_tot,
           (select count(*) from em where em.lop_id = lk.id and em.viec_den_han > 0 and em.viec_xong = 0)::int as chua_lam
      from lop_k lk
  )
  select jsonb_build_object(
    'tuan', v_t, 'dang_chay', v_t >= v_w, 'tinh_at', (select max(at) from t),
    'tong', jsonb_build_object(
      'so_em', (select count(*) from t),
      'tien_do_tb', (select round(avg(tien_do), 1) from t),
      'tien_do_dau_tb', (select round(avg((payload->>'tien_do_dau')::numeric), 1) from t where tien_do is not null),
      'viec_xong', (select coalesce(sum(viec_xong), 0) from t),
      'viec_den_han', (select coalesce(sum(viec_den_han), 0) from t),
      'viec_pct', (select case when sum(viec_den_han) > 0 then round(100.0 * sum(viec_xong) / sum(viec_den_han))::int end from t),
      'tien_do_d', (select round(avg(tien_do) - avg((payload->>'tien_do_dau')::numeric) filter (where tien_do is not null)) from t),
      'btvn_tot', (select count(*) from vb where muc = 'tot'),
      'btvn_tam_on', (select count(*) from vb where muc = 'tam_on'),
      'btvn_chua_tot', (select count(*) from vb where muc = 'chua_tot'),
      'thai_do', jsonb_build_object(
        'nghiem_tuc', (select count(*) from vb where thai_do = 'nghiem_tuc'),
        'chua_het_suc', (select count(*) from vb where thai_do = 'chua_het_suc'),
        'chua_nghiem_tuc', (select count(*) from vb where thai_do = 'chua_nghiem_tuc'),
        'chong_doi', (select count(*) from vb where thai_do = 'chong_doi')),
      'chua_lam', (select count(*) from em where viec_den_han > 0 and viec_xong = 0)),
    'lop', coalesce((select jsonb_agg(to_jsonb(tl) || jsonb_build_object(
                       'tien_do_d', round(tl.tien_do_tb - tl.tien_do_dau_tb),
                       'viec_pct', case when tl.viec_den_han > 0 then round(100.0 * tl.viec_xong / tl.viec_den_han)::int end)
                     order by tl.ten_lop) from theo_lop tl), '[]'::jsonb),
    'em', coalesce((select jsonb_agg(jsonb_build_object('id', em.hoc_sinh_id, 'ten', em.ho_ten, 'lop', em.payload->'hs'->>'lop',
                                                          'tien_do', em.tien_do, 'viec_xong', em.viec_xong, 'viec_den_han', em.viec_den_han,
                                                          'ly_do', to_jsonb(em.ly_do))
                                     order by cardinality(em.ly_do) desc, em.tien_do nulls first, em.ho_ten)
                      from em where cardinality(em.ly_do) > 0), '[]'::jsonb))
    into v_r;
  return v_r;
end $$;

-- ERP — chốt mục tiêu tuần cho 1 lớp (sau buổi họp thứ Hai). Tính ngay trong ngân sách 4 giây, phần còn lại cron làm.
create or replace function public.fn_mtt_chot_lop(p_lop uuid, p_tuan date default null)
returns jsonb
language plpgsql volatile security definer set search_path to 'public' as $$
declare
  v_t   date := public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay()));
  v_l   record;
  v_bat timestamptz := clock_timestamp();
  v_n   int := 0;
  v_tong int := 0;
  r     record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select l.id, l.mon, l.khoi into v_l from lop l where l.id = p_lop;
  if not found then raise exception 'Không thấy lớp.'; end if;
  if not exists (select 1 from public.fn_pham_vi_cua_toi() p where p.mon = v_l.mon and p.khoi = v_l.khoi) then
    raise exception 'Lớp ngoài phạm vi của bạn.';
  end if;
  if v_t < public._mtt_tuan(public._mtt_hom_nay()) then raise exception 'Không chốt được tuần đã qua.'; end if;
  insert into mtt_lop_chot (tuan, lop_id, chot_boi) values (v_t, p_lop, public.current_nhan_su_id())
  on conflict (tuan, lop_id) do nothing;
  for r in select hl.hoc_sinh_id from hoc_sinh_lop hl join hoc_sinh h on h.id = hl.hoc_sinh_id
            where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc' and h.trang_thai = 'dang_hoc' loop
    v_tong := v_tong + 1;
    continue when clock_timestamp() - v_bat > interval '4 seconds';
    perform public._mtt_ghi(r.hoc_sinh_id, v_l.mon, v_t);
    v_n := v_n + 1;
  end loop;
  if v_n > 0 then perform public._mtt_xep_hang(v_t, v_l.mon); end if;
  return jsonb_build_object('tuan', v_t, 'lop_id', p_lop,
                            'chot_at', (select c.chot_at from mtt_lop_chot c where c.tuan = v_t and c.lop_id = p_lop),
                            'da_tinh', v_n, 'tong', v_tong);
end $$;

-- ── 7. Quyền ────────────────────────────────────────────────────────────────
do $$
declare f text;
begin
  foreach f in array array[
    '_mtt_chot_bat_bien()', '_mtt_tuan(date)', '_mtt_moc(date)', '_mtt_hom_nay()', '_mtt_muc(numeric)', '_mtt_ha_muc(text)',
    '_mtt_ten_nhom(text)', '_mtt_ten_goi(text)', '_mtt_diem(uuid, uuid, text, timestamptz)', '_mtt_nhom_buoi(uuid, date, uuid)',
    '_mtt_dau_tinh(uuid, date)', '_mtt_tinh(uuid, text, date, timestamptz)', '_mtt_ghi(uuid, text, date)',
    '_mtt_xep_hang(date, text)', '_mtt_lam_moi(integer)', '_mtt_kem_hang(jsonb, integer, integer, integer, timestamptz)',
    '_mtt_doc(uuid, text, date, boolean)',
    'fn_mtt_cua_toi(text, date)', 'fn_mtt_hs(uuid, text, date)', 'fn_mtt_cac_tuan(text, uuid, integer)',
    'fn_mtt_top(text, date)', 'fn_mtt_trung_tam(text, text, date)', 'fn_mtt_chot_lop(uuid, date)'
  ] loop
    execute format('revoke execute on function public.%s from public, anon', f);
  end loop;
end $$;
grant execute on function public.fn_mtt_cua_toi(text, date)            to authenticated;
grant execute on function public.fn_mtt_hs(uuid, text, date)           to authenticated;
grant execute on function public.fn_mtt_cac_tuan(text, uuid, integer)  to authenticated;
grant execute on function public.fn_mtt_top(text, date)                to authenticated;
grant execute on function public.fn_mtt_trung_tam(text, text, date)    to authenticated;
grant execute on function public.fn_mtt_chot_lop(uuid, date)           to authenticated;

-- app phụ huynh (repo bkdemy-ph-app) đọc qua postgres_fdw bằng role fdw_bkdemy_web — đủ 2 cổng (GRANT + policy, bảng bật RLS;
-- thiếu policy ⇒ FDW đọc ra 0 dòng im lặng). Chỉ 3 bảng tự đủ: tờ đang chạy (mtt_luu chỉ có em của lớp đã chốt), sổ chốt, top 20.
-- Lọc theo con của PH làm ở app (admin client + phu_huynh_id), y khuôn bao_cao_ph_ky.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'fdw_bkdemy_web') then
    grant select on public.mtt_luu, public.mtt_chot, public.mtt_top to fdw_bkdemy_web;
    drop policy if exists fdw_bkdemy_web_read on public.mtt_luu;
    create policy fdw_bkdemy_web_read on public.mtt_luu for select to fdw_bkdemy_web using ((payload->>'chot')::boolean);
    drop policy if exists fdw_bkdemy_web_read on public.mtt_chot;
    create policy fdw_bkdemy_web_read on public.mtt_chot for select to fdw_bkdemy_web using (true);
    drop policy if exists fdw_bkdemy_web_read on public.mtt_top;
    create policy fdw_bkdemy_web_read on public.mtt_top for select to fdw_bkdemy_web using (true);
  end if;
end $$;
