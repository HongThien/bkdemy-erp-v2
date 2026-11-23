-- GIÁO TRÌNH TUẦN — lựa chọn "KIỂM TRA THÁNG – MT" cho một ca (Thùy 23/11: "buổi này sẽ test chứ không học; cũng cần thông báo trong Mục tiêu tuần").
-- Phiếu 10 câu (spec-kien-truc §9): 1 miền Vận hành lớp, bảng mới gtt_ca_mt · 2 khoá tự nhiên (lop_id, ngay) — như gtt_ca · 3 có nhãn mon (trigger lấy từ lớp) ·
-- 4 đọc: nhân sự; ghi chỉ qua fn_gtt_dat_mt (cổng _gtt_kiem_ca: phạm vi khối + ca còn hiệu lực) · 5 không thêm lượt gọi: đi trong fn_gtt_man_tuan / fn_mtt_* sẵn có ·
-- 6 tra theo khoá chính (lớp, ngày) · 7 không cần tính sẵn · 8 PK đủ · 9 không polling · 10 vài chục dòng / tháng.
-- Vì sao BẢNG RIÊNG chứ không thêm cột vào gtt_ca: gtt_ca = "ca ⇄ buổi builder" (buoi_id NOT NULL, unique) và 16 hàm đang dựa vào nghĩa đó; ca kiểm tra KHÔNG có buổi.
-- Một ca chỉ là MỘT trong hai: gắn buổi học (gtt_ca) hoặc kiểm tra tháng (gtt_ca_mt) — đặt cái này thì cái kia tự gỡ (trigger hai chiều), có vết ở gtt_ca_log.
-- Đây là KẾ HOẠCH (như buổi kế hoạch); đề MT thật vẫn gán bằng luồng MT sẵn có (tai_lieu loai 'mt_buoi') — màn tuần hiện "đã có đề / chưa có đề".

create table if not exists public.gtt_ca_mt (
  lop_id  uuid not null references lop(id),
  ngay    date not null,
  mon     text not null,
  dat_boi uuid references nhan_su(id),
  dat_at  timestamptz not null default now(),
  primary key (lop_id, ngay)
);
alter table public.gtt_ca_mt enable row level security;
drop policy if exists gtt_ca_mt_doc on public.gtt_ca_mt;
create policy gtt_ca_mt_doc on public.gtt_ca_mt for select to authenticated using ((select public.la_thanh_vien()));
revoke all on public.gtt_ca_mt from anon, public;
grant select on public.gtt_ca_mt to authenticated;   -- ghi: chỉ fn_gtt_dat_mt (secdef) và trigger

-- vết: dùng chung sổ gtt_ca_log, thêm cột 'viec' cho hai sự kiện của ca MT (dòng đổi liên kết buổi để trống)
alter table public.gtt_ca_log add column if not exists viec text;
alter table public.gtt_ca_log drop constraint if exists gtt_ca_log_viec_check;
alter table public.gtt_ca_log add constraint gtt_ca_log_viec_check check (viec is null or viec in ('mt_dat', 'mt_bo'));

create or replace function public._gtt_ca_mt_trg()
returns trigger
language plpgsql security definer
set search_path to 'public'
as $fn$
begin
  if tg_op = 'INSERT' then
    new.mon := (select l.mon from lop l where l.id = new.lop_id);
    new.dat_boi := coalesce(new.dat_boi, public.current_nhan_su_id());
    delete from gtt_ca where lop_id = new.lop_id and ngay = new.ngay;   -- ca kiểm tra thì không còn gắn buổi học
    insert into gtt_ca_log (lop_id, ngay, buoi_cu, buoi_moi, nhan_su_id, viec) values (new.lop_id, new.ngay, null, null, public.current_nhan_su_id(), 'mt_dat');
    return new;
  end if;
  insert into gtt_ca_log (lop_id, ngay, buoi_cu, buoi_moi, nhan_su_id, viec) values (old.lop_id, old.ngay, null, null, public.current_nhan_su_id(), 'mt_bo');
  return old;
end
$fn$;
drop trigger if exists gtt_ca_mt_trg on public.gtt_ca_mt;
create trigger gtt_ca_mt_trg before insert or delete on public.gtt_ca_mt for each row execute function public._gtt_ca_mt_trg();

-- chiều ngược lại: ca được gắn buổi học (màn tuần, hoặc trigger theo ngày dạy khi GV gán buổi thật) ⇒ thôi là ca kiểm tra
create or replace function public._gtt_ca_bo_mt_trg()
returns trigger
language plpgsql security definer
set search_path to 'public'
as $fn$
begin
  delete from gtt_ca_mt where lop_id = new.lop_id and ngay = new.ngay;
  return new;
end
$fn$;
drop trigger if exists gtt_ca_bo_mt_trg on public.gtt_ca;
create trigger gtt_ca_bo_mt_trg after insert on public.gtt_ca for each row execute function public._gtt_ca_bo_mt_trg();
revoke all on function public._gtt_ca_mt_trg() from public, anon, authenticated;
revoke all on function public._gtt_ca_bo_mt_trg() from public, anon, authenticated;

-- Đặt / bỏ "Kiểm tra tháng – MT" cho một ca. Trả ca để màn vá tại chỗ.
create or replace function public.fn_gtt_dat_mt(p_lop uuid, p_ngay date, p_bat boolean)
returns jsonb
language plpgsql security definer
set search_path to 'public'
as $fn$
declare l lop;
begin
  l := public._gtt_kiem_ca(p_lop, p_ngay);   -- cổng: lớp trong phạm vi của người gọi · ca còn trong TKB, chưa huỷ, chưa qua
  if coalesce(p_bat, false) then
    insert into gtt_ca_mt (lop_id, ngay, mon) values (p_lop, p_ngay, l.mon) on conflict (lop_id, ngay) do nothing;
  else
    delete from gtt_ca_mt where lop_id = p_lop and ngay = p_ngay;
  end if;
  return public._gtt_ca_json(p_lop, p_ngay, public._gtt_snap_duyet(l.mon, l.khoi, p_ngay - (extract(isodow from p_ngay)::int - 1)));
end
$fn$;

-- Mục tiêu tuần: các buổi KIỂM TRA THÁNG của em trong tuần (theo lớp em đang học ở môn đó) — gắn vào tờ tuần lúc đọc.
create or replace function public._mtt_kem_kiem_tra(p_to jsonb, p_hs uuid, p_mon text, p_tuan date)
returns jsonb
language sql stable
set search_path to 'public'
as $fn$
  select case when p_to is null then null else p_to || jsonb_build_object('kiem_tra', coalesce((
    select jsonb_agg(jsonb_build_object('ngay', m.ngay, 'lop', l.ten_lop) order by m.ngay)
      from hoc_sinh_lop hl
      join lop l on l.id = hl.lop_id and l.mon = p_mon
      join gtt_ca_mt m on m.lop_id = l.id
     where hl.hoc_sinh_id = p_hs
       and m.ngay between public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay())) and public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay())) + 6
       and hl.ngay_vao <= m.ngay and coalesce(hl.ngay_roi, 'infinity'::date) >= m.ngay), '[]'::jsonb)) end;
$fn$;
revoke all on function public._mtt_kem_kiem_tra(jsonb, uuid, text, date) from public, anon, authenticated;

-- _gtt_ca_json: thêm khoá mt (phần còn lại giữ nguyên bản đang chạy)
CREATE OR REPLACE FUNCTION public._gtt_ca_json(p_lop uuid, p_ngay date, p_snap jsonb)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'lop_id', c.lop_id, 'ngay', c.ngay, 'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc, 'phong', c.phong, 'huy', c.huy,
    'buoi', case when g.buoi_id is null then null else jsonb_build_object(
        'id', p.id, 'tai_lieu_id', t.id, 'ten_gt', t.ten, 'nhanh', t.nhanh, 'luu_tru', t.luu_tru_tu is not null,
        'tieu_de', p.tieu_de,
        'stt', (select count(*) from tai_lieu_phan x where x.tai_lieu_id = p.tai_lieu_id and x.loai_phan = 'buoi'
                  and (x.thu_tu < p.thu_tu or (x.thu_tu = p.thu_tu and x.id <= p.id))),
        'khung', public._gtt_khung(p.id)) end,
    -- 23/11: ca KIỂM TRA THÁNG (MT) — không gắn buổi; co_de = lớp đã được gán đề MT cho đúng ngày đó chưa
    'mt', case when m.lop_id is null then null else jsonb_build_object('dat_at', m.dat_at,
        'co_de', exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = c.lop_id and tl.ngay = c.ngay and tl.hoc_sinh_id is null)) end,
    'da_gan', (select jsonb_build_object('tai_lieu_id', b.id, 'khop', b.nguon_buoi = g.buoi_id::text)
                 from tai_lieu b where b.lop_id = c.lop_id and b.ngay = c.ngay and b.loai = 'giao_trinh_buoi' limit 1),
    'sua_sau_duyet', case when p_snap is null then false else
        (p_snap -> (c.lop_id::text || '|' || c.ngay::text)) is distinct from
        case when m.lop_id is not null then jsonb_build_object('mt', true)
             when g.buoi_id is null then null
             else jsonb_build_object('buoi', g.buoi_id, 'k', to_jsonb(public._gtt_khung_khoa(g.buoi_id))) end end)
  from public._gtt_ca(array[p_lop], p_ngay, p_ngay) c
  left join gtt_ca g on g.lop_id = c.lop_id and g.ngay = c.ngay
  left join gtt_ca_mt m on m.lop_id = c.lop_id and m.ngay = c.ngay
  left join tai_lieu_phan p on p.id = g.buoi_id
  left join tai_lieu t on t.id = p.tai_lieu_id
$function$;

-- _gtt_snap: bản chụp lúc duyệt gồm cả ca MT
CREATE OR REPLACE FUNCTION public._gtt_snap(p_mon text, p_khoi text, p_tuan date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_object_agg(x.k, x.v), '{}'::jsonb)
    from (
      select g.lop_id::text || '|' || g.ngay::text as k, jsonb_build_object('buoi', g.buoi_id, 'k', to_jsonb(public._gtt_khung_khoa(g.buoi_id))) as v
        from gtt_ca g join lop l on l.id = g.lop_id
       where l.mon = p_mon and l.khoi = p_khoi and g.ngay between p_tuan and p_tuan + 6
      union all   -- 23/11: ca Kiểm tra tháng (MT)
      select m.lop_id::text || '|' || m.ngay::text, jsonb_build_object('mt', true)
        from gtt_ca_mt m join lop l on l.id = m.lop_id
       where l.mon = p_mon and l.khoi = p_khoi and m.ngay between p_tuan and p_tuan + 6
    ) x
$function$;

-- _mtt_tinh: ca đã đặt Kiểm tra tháng ⇒ việc MT thay ET (chỉ thêm một điều kiện OR)
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
  v_kh     record;
  v_dmap   jsonb;
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
       and coalesce(d.duyet_at, d.tao_at) >= public._mtt_moc(v_tu) and coalesce(d.duyet_at, d.tao_at) < v_den   /* 16/11: lượt chốt chỉ hiệu lực trong tuần duyệt */
    union all
    select public._mtt_nhom_cua_o(public._do_o_quy(v_bdm, false, '', yd.ma_dang))   /* 16/11: ô → nhóm */
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
               case when (bb.b->>'s')::boolean then 2 else 0 end as k,
               (bb.b->>'s')::boolean as s, true as goc, bb.b->'ngay' as ngay   /* 17/11 tối (Thùy): buổi thuộc tuần của BUỔI KẾ (lùi một buổi); ET + BTVN của buổi đi CÙNG buổi ⇒ 2 lần đo */
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
           (public._mtt_dau_buoi(v_dau->tat.ma, tat.ngay_hoc)->>'s')::numeric as p_dau,   /* 17/11 tối: khởi điểm = TRƯỚC buổi của tuần */
           coalesce((v_dau->tat.ma->>'cs')::int, case when tat.ma like 'HH%' then 3 else 5 end) as cs,
           coalesce(public._mtt_dau_buoi(v_dau->tat.ma, tat.ngay_hoc)->'lan', '[]'::jsonb) as lan,
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
           'muc', v_p->t3.ma->>'muc',   /* 17/11 tối: mức của nhóm (dat · can_luyen · yeu — ngưỡng 80/50 của mastery) ⇒ màn hiện Đạt · Chưa đạt · Yếu */
           'p_dau', case when t3.p_dau is not null then round(100 * t3.p_dau)::int end,
           'd', case when t3.p is not null and t3.p_dau is not null then round(100 * t3.p)::int - round(100 * t3.p_dau)::int end,
           'mt', case when t3.mt is not null then round(100 * t3.mt)::int end, 'dich', 80,
           'k', t3.k, 'tong_dang', t3.tong_dang, 'ngay_hoc', coalesce(t3.ngay_hoc, '[]'::jsonb),
           'tien', case when t3.p is not null and t3.mt is not null and t3.mt > 0 then round(least(t3.p / t3.mt, 1), 4) end,
           'tien_dau', case when t3.p_dau is not null and t3.mt is not null and t3.mt > 0 then round(least(t3.p_dau / t3.mt, 1), 4) end)
         order by t3.phan, t3.p nulls last, t3.ten), '[]'::jsonb)
    into v_nhom
    from t3;

  -- ⭐ KẾ HOẠCH ĐÃ KHOÁ lúc chốt lớp (mig 202611161844): danh sách nhóm · phần · mục tiêu tuần · số lần đo = bản khoá;
  -- số đo (% hiện tại, đầu tuần, tiến độ) vẫn tính trực tiếp. Nhóm mới xuất hiện sau khi chốt ⇒ them_sau_chot (chỉ để nhân sự thấy).
  select k.nhom, k.viec, k.chot_at into v_kh from mtt_ke_hoach k where k.tuan = p_tuan and k.mon = p_mon and k.hoc_sinh_id = p_hs
     and k.chot_at >= coalesce(public._mtt_moc_cong_bo_lai(p_tuan, v_lop), '-infinity'::timestamptz)   /* 18/11: công bố lại ⇒ bản khoá cũ hết hiệu lực (mig 202611181916) */
   order by k.chot_at desc limit 1;
  if found then
    select coalesce(jsonb_agg(jsonb_build_object('ma', e->>'ma', 'ten', e->>'ten', 'phan', (e->>'phan')::int)), '[]'::jsonb)
      into v_them
      from jsonb_array_elements(v_nhom) e
     where (e->>'phan')::int = 1   /* 17/11 tối: chỉ Phần 1 bị khoá — Phần 2 luôn theo lượt chốt bổ trợ mới nhất */
       and not exists (select 1 from jsonb_array_elements(v_kh.nhom) x where x->>'ma' = e->>'ma' and (x->>'phan')::int = 1);
    with x as (
      select x.e->>'ma' as ma, x.e->>'ten' as ten, (x.e->>'phan')::int as phan, (x.e->>'mt')::numeric / 100 as mt,
             (x.e->>'k')::int as k, coalesce(x.e->'ngay_hoc', '[]'::jsonb) as ngay_hoc, x.o
        from jsonb_array_elements(v_kh.nhom) with ordinality as x(e, o)
       where (x.e->>'phan')::int = 1   /* 17/11 tối: bản khoá chỉ giữ Phần 1; nhóm nay là nợ (Phần 2 sống) thì nhường cho Phần 2 */
         and not exists (select 1 from jsonb_array_elements(v_nhom) l where (l->>'phan')::int = 2 and l->>'ma' = x.e->>'ma')
    ),
    y as (
      select x.*, (v_p->x.ma->>'s')::numeric as p, (v_p->x.ma->>'n')::int as n, (public._mtt_dau_buoi(v_dau->x.ma, x.ngay_hoc)->>'s')::numeric as p_dau,   /* 17/11 tối: khởi điểm trước buổi */
             (select count(*) from dai_bdm_dang_bai db where db.nhom_id = x.ma)::int as tong_dang
        from x
    )
    select coalesce(jsonb_agg(jsonb_build_object(
             'ma', y.ma, 'ten', y.ten, 'phan', y.phan,
             'p', case when y.p is not null then round(100 * y.p)::int end, 'n', y.n,
             'muc', v_p->y.ma->>'muc',   /* 17/11 tối */
             'p_dau', case when y.p_dau is not null then round(100 * y.p_dau)::int end,
             'd', case when y.p is not null and y.p_dau is not null then round(100 * y.p)::int - round(100 * y.p_dau)::int end,
             'mt', case when y.mt is not null then round(100 * y.mt)::int end, 'dich', 80,
             'k', y.k, 'tong_dang', y.tong_dang, 'ngay_hoc', y.ngay_hoc,
             'tien', case when y.p is not null and y.mt is not null and y.mt > 0 then round(least(y.p / y.mt, 1), 4) end,
             'tien_dau', case when y.p_dau is not null and y.mt is not null and y.mt > 0 then round(least(y.p_dau / y.mt, 1), 4) end)
           order by y.o), '[]'::jsonb)
           || coalesce((select jsonb_agg(l order by l->>'ten') from jsonb_array_elements(v_nhom) l where (l->>'phan')::int = 2), '[]'::jsonb)   /* 17/11 tối: Phần 2 LUÔN SỐNG */
      into v_nhom
      from y;
  end if;

  -- DẠNG của từng nhóm trong tuần (Thùy 16/11: "học sinh có mục tiêu học dạng A, click vào dạng A ⇒ lý thuyết · luyện tập") — để app mở thẳng màn dạng
  -- của Học từ đầu. Không khoá: là đường dẫn, đơn vị đánh giá vẫn là NHÓM. Nhóm không có dạng nào thấy được ⇒ 'dang' = [] (app hiện nút chung).
  v_dmap := public._mtt_dang_nhom(p_hs, p_mon, v_buoi, v_den, v_bdm);
  select coalesce(jsonb_agg(e || jsonb_build_object('dang', coalesce(v_dmap->(e->>'ma'), '[]'::jsonb),
                                              /* mig 202611180010: cờ đạt mục tiêu tuần — cùng điều kiện với tiến độ */
                                              'dat_mt', (e->>'p') is not null and (e->>'p')::numeric >= coalesce((e->>'mt')::numeric, (e->>'dich')::numeric, 80))
                              order by o), '[]'::jsonb)
    into v_nhom
    from jsonb_array_elements(v_nhom) with ordinality as t(e, o);

  -- đầu tuần: cùng tập nhóm đang tính tiến độ; nhóm CHƯA có số lúc đầu tuần (kiến thức mới) tính 0 — chưa học thì chưa tới đâu
  -- TIẾN ĐỘ (Thùy 17/11 khuya, mig 202611172340) = số nhóm CHẠM MỤC TIÊU TUẦN ÷ MỌI nhóm trên tờ (chưa đo = chưa đạt;
  -- nhóm không có mục tiêu tuần ⇒ so với đích 80). Đầu tuần: cùng phép đếm trên p_dau.
  select round(100.0 * count(*) filter (where e->>'p' is not null
                 and (e->>'p')::numeric >= coalesce((e->>'mt')::numeric, (e->>'dich')::numeric, 80)) / nullif(count(*), 0), 1),
         round(100.0 * count(*) filter (where e->>'p_dau' is not null
                 and (e->>'p_dau')::numeric >= coalesce((e->>'mt')::numeric, (e->>'dich')::numeric, 80)) / nullif(count(*), 0), 1)
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
   where (e->>'w')::boolean and not (e->>'s')::boolean   /* 17/11 tối: khôi phục — buổi trong tuần mà buổi kế sang tuần sau ⇒ tính vào tuần sau */
   order by e->>'ngay' limit 1;

  -- VIỆC CỦA CON
  with bb as (select e as b from jsonb_array_elements(v_buoi) e),
  et as (
    select case when exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = (bb.b->>'lop_id')::uuid
                                and tl.ngay = (bb.b->>'ngay')::date and tl.hoc_sinh_id is null)
                  or exists (select 1 from gtt_ca_mt gm where gm.lop_id = (bb.b->>'lop_id')::uuid and gm.ngay = (bb.b->>'ngay')::date)   /* 23/11: ca đã đặt Kiểm tra tháng ở Giáo trình tuần */
                then 'mt' else 'et' end::text as loai,   /* 17/11 tối: buổi có MT ⇒ việc MT thay ET (như việc nhân sự: buổi gán MT chỉ có Chấm MT) */
           (bb.b->>'id')::uuid as buoi_id, (bb.b->>'ngay')::date as ngay, null::date as han, bb.b->>'dd' as dd, 1 as o
      from bb where (bb.b->>'s')::boolean   /* 17/11 tối: ET của buổi thuộc tuần (s) — kể cả ca chiếu chưa mở buổi (id null ⇒ "sắp tới") */
  ),
  bt as (
    select 'btvn'::text, (bb.b->>'id')::uuid, (bb.b->>'ngay')::date, (bb.b->>'sau')::date, bb.b->>'dd', 2
      from bb where (bb.b->>'s')::boolean   /* 17/11 tối: BTVN của buổi thuộc tuần (s) — đi cùng ET của buổi đó, kể cả ca chiếu */
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
      left join lateral public._mtt_diem(p_hs, tat.buoi_id, case when tat.loai in ('btvn', 'mt') then tat.loai else 'et' end, p_den) dm on true
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
                          where (bx->>'id')::uuid = d2.buoi_id
                             or (d2.buoi_id is null and bx->>'id' is null and (bx->>'ngay')::date = d2.ngay)) end,   /* 17/11 tối: việc của ca chiếu */
           'gio', (select h.value->>'gio' from jsonb_array_elements(v_ho_tro) h where (h.value->>'id')::uuid = d2.buoi_id),
           'phong', (select h.value->>'phong' from jsonb_array_elements(v_ho_tro) h where (h.value->>'id')::uuid = d2.buoi_id))
         order by d2.ngay, d2.o), '[]'::jsonb)
    into v_viec
    from d2;

  -- tự luyện trên app (không bắt buộc, không tính vào x/y)
  select jsonb_build_object('so_cau', count(*), 'so_luot', count(distinct bl.id),
           'pct', case when count(*) > 0 then round(100 * avg(case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end))::int end,
           'nhom', coalesce((select jsonb_agg(distinct public._mtt_ten_nhom(q.n)) from (
                     select public._mtt_nhom_cua_o(public._do_o_quy(v_bdm, false, coalesce(btc2.ma_cau, ''), coalesce(btc2.ma_dang, ''))) as n   /* 16/11: ô → nhóm */
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
    select coalesce(jsonb_agg(e || jsonb_build_object('them_sau', e->>'loai' not in ('sau_gio', 'bo_tro') and not exists (   /* 17/11 tối: ca bổ trợ luôn sống */
             select 1 from jsonb_array_elements(v_kh.viec) x where x->>'loai' = e->>'loai' and x->>'ngay' = e->>'ngay'))   /* 17/11 tối: so theo NGÀY — lúc công bố buổi sắp dạy chưa có mã buổi */
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
end $function$;

-- fn_mtt_cua_toi · fn_mtt_hs: kèm khoá kiem_tra
CREATE OR REPLACE FUNCTION public.fn_mtt_cua_toi(p_mon text, p_tuan date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Chỉ tài khoản học sinh.'; end if;
  return public._mtt_kem_kiem_tra(public._mtt_doc(v_hs, p_mon, p_tuan, true), v_hs, p_mon, p_tuan);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_mtt_hs(p_hs uuid, p_mon text, p_tuan date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not public._mon_duoc_xem(p_mon) then raise exception 'Môn % ngoài quyền môn của bạn.', p_mon; end if;
  return public._mtt_kem_kiem_tra(public._mtt_doc(p_hs, p_mon, p_tuan, false), p_hs, p_mon, p_tuan);
end $function$;
