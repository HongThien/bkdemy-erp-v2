-- ============================================================================
-- 202610281926 — xu_tong_ket_dashboard   (áp: `node scripts/migrate.mjs --only <file này>`, owner claude_build)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 28/10: "Huỷ tính năng chốt xu. Thay bằng TỔNG KẾT XU — dashboard xu của toàn bộ HS ở trung tâm, mỗi HS
--   1 dòng, cột = tổng xu + các thành phần tạo ra xu: ET, BTVN, trên lớp, vòng quay app, thành tựu…".
--
-- VẤN ĐỀ: xu đổi từ EXP KHÔNG cộng theo nguồn được. Với mỗi (HS × môn × tháng), fn_gami_exp_xu_thang tính
--   xu = ⌈EXP lớp/100⌉ + min(trần app, ⌈EXP app/100⌉) — làm tròn lên + trần chỉ có nghĩa trên TỔNG.
-- CÁCH CHIA (chỉ để HIỂN THỊ, không tạo/bớt xu nào) — 2 bước, đều làm tròn bằng PHƯƠNG PHÁP PHẦN DƯ LỚN NHẤT
--   (Hamilton / largest remainder — cách chia ghế quốc hội theo tỉ lệ phiếu) nên mọi cột là số nguyên và cộng ĐÚNG:
--   ① _xu_thanh_phan_tinh: xu theo công thức của từng khối (lớp | app) chia cho các nguồn trong khối theo EXP dương.
--      Kết quả LƯU ở bảng xu_thanh_phan (tỉ lệ chia, không phải tiền).
--   ② fn_xu_tong_ket: số xu ĐÃ VÀO SỔ (chot_thang + chot_lai của HS × môn × tháng — đọc sống) chia lại theo tỉ lệ ①.
--      ⇒ các cột luôn cộng đúng bằng ví, kể cả tháng 8 (chốt tay, đóng băng — công thức hôm nay ra nhiều hơn 1.322 xu
--      so với số đã phát). Cặp chưa có tỉ lệ (vừa có EXP lần đầu sau lượt cron gần nhất) ⇒ tạm vào cột "Khác".
--   ⚠ ① lặp lại cấu trúc công thức (lớp không trần · app có trần) chỉ để lấy TỈ LỆ; tiền thật vẫn từ sổ.
-- VÌ SAO LƯU ① mà không tính sống: đo 28/10 ở 4 phiên mới, tính sống ① toàn trung tâm mất 16–20 s (phần EXP nhiệm vụ của
--   fn_exp_app_thang), vượt trần PostgREST 8 s. ① được làm mới trong _xu_dong_bo ở lượt TOÀN TRUNG TÂM (cron phút 05 mỗi
--   giờ, cùng cửa sổ tháng trước + tháng này), làm TRƯỚC khi khoá ví — không kéo dài thời gian khoá ví (tủ quà vẫn đổi được).
--   Lượt 1 HS (mở ví, tủ quà) KHÔNG làm mới ① cho đỡ nặng — tiền vẫn đúng từng giây, chỉ tỉ lệ chia chậm tối đa 1 giờ.
--   Tháng 8 → hiện tại nạp 1 lần ở cuối file. Ghi kiểu upsert: cặp hết EXP về 0, không xoá dòng. Có nhãn môn (§1.6).
-- Kỳ: từ tháng 8/2026 (tháng đầu đổi xu); EXP tháng 6–7 chưa bao giờ đổi ra xu.
--
-- MẤT GÌ (Luật xoá): Không xoá gì. Thêm bảng xu_thanh_phan + 4 hàm; thay thân _xu_dong_bo (chỉ THÊM bước ⓪ làm mới tỉ lệ —
--   phần đồng bộ sổ giữ nguyên từng chữ so với mig 202610061809, đã đối chiếu bản live 28/10). Màn "Chốt xu tháng" bỏ khỏi menu ở commit đi kèm (file chưa xoá — chờ Thùy gật).
-- ============================================================================

-- ── ① CHIA xu theo công thức của 1 tháng theo nguồn (thuần tính) ──
create or replace function public._xu_thanh_phan_tinh(p_ym text, p_hs uuid default null)
returns table(hoc_sinh_id uuid, mon text, nguon text, exp integer, xu integer)
language sql stable set search_path = public
as $$
  with cua_so as (
    select ((p_ym || '-01')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as tu,
           (((p_ym || '-01')::date + interval '1 month')::timestamp) at time zone 'Asia/Ho_Chi_Minh' as den
  ), lop as (   -- CÙNG bộ lọc với nhánh `lop` của fn_gami_exp_xu_thang
    select l.hoc_sinh_id as hs, coalesce(l.mon, '') as mon,
           case l.source when 'exp_et' then 'et' when 'exp_btvn' then 'btvn' when 'exp_btvn_thang' then 'btvn'
                         when 'exp_tren_lop' then 'tren_lop' when 'attend_floor' then 'tham_du' else 'khac' end as nguon,
           sum(l.amount)::integer as exp
    from public.gami_exp_ledger l, cua_so w
    where (p_hs is null or l.hoc_sinh_id = p_hs)
      and (
        (l.source in ('exp_thang', 'exp_et', 'exp_btvn', 'exp_btvn_thang', 'exp_tren_lop') and l.note = p_ym)
        or (l.source = 'attend_floor' and l.created_at >= w.tu and l.created_at < w.den)
      )
    group by 1, 2, 3
  ), app as (   -- CÙNG nguồn với nhánh `app` (fn_exp_app_thang: nhiệm vụ · vòng quay đã trần EXP · huy hiệu + thành tựu)
    select a.hoc_sinh_id as hs, a.mon, x.nguon, x.exp
    from public.fn_exp_app_thang(p_ym, p_hs, null) a
    cross join lateral (values ('nhiem_vu', a.exp_nhiem_vu), ('vong_quay', a.exp_may_man), ('thanh_tuu', a.exp_thanh_tuu)) x(nguon, exp)
    where x.exp <> 0
  ), dong as (
    select hs, mon, 'lop'::text as khoi, nguon, exp from lop
    union all
    select hs, mon, 'app', nguon, exp from app
  ), khoi as (   -- xu của cả khối, đúng cấu trúc fn_gami_exp_xu_thang
    select d.hs, d.mon, d.khoi, sum(greatest(d.exp, 0)) as w,
           case when d.khoi = 'lop' then public.fn_xu_tu_exp(sum(d.exp)::integer)
                else least(coalesce(max(c.tran_xu_app), 0), public.fn_xu_tu_exp(sum(d.exp)::integer)) end as x
    from dong d
    left join public.nhiem_vu_cau_hinh c on c.mon = d.mon and c.bat
    group by 1, 2, 3
  ), chia as (
    select d.hs, d.mon, d.khoi, d.nguon, d.exp, k.x,
           case when k.w > 0 then k.x::numeric * greatest(d.exp, 0) / k.w else 0 end as q
    from dong d join khoi k on k.hs = d.hs and k.mon = d.mon and k.khoi = d.khoi
  ), xep as (
    select c.*, floor(c.q)::integer as san,
           c.x - sum(floor(c.q)) over (partition by c.hs, c.mon, c.khoi) as con,
           row_number() over (partition by c.hs, c.mon, c.khoi order by c.q - floor(c.q) desc, c.nguon) as hang
    from chia c
  )
  select hs, mon, nguon, exp, (san + case when hang <= con then 1 else 0 end)::integer
  from xep
$$;

create table public.xu_thanh_phan (
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  mon text not null,
  thang text not null check (thang ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  nguon text not null check (nguon in ('et', 'btvn', 'tren_lop', 'tham_du', 'khac', 'nhiem_vu', 'vong_quay', 'thanh_tuu')),
  exp integer not null,
  xu integer not null,
  cap_nhat_at timestamptz not null default now(),
  primary key (hoc_sinh_id, mon, thang, nguon)
);
comment on table public.xu_thanh_phan is
  'TỈ LỆ chia xu đổi từ EXP theo nguồn (màn Tổng kết xu) = kết quả _xu_thanh_phan_tinh, làm mới bởi _xu_dong_bo lượt toàn trung tâm. KHÔNG phải sổ tiền — tiền luôn đọc qlht_xu_ledger.';
alter table public.xu_thanh_phan enable row level security;
create policy xu_thanh_phan_sel on public.xu_thanh_phan for select to authenticated using (public.current_nhan_su_id() is not null);

-- ── Làm mới tỉ lệ cho các tháng, toàn trung tâm (upsert; cặp hết EXP về 0, không xoá dòng) ──
create or replace function public._xu_thanh_phan_lam_moi(p_thang text[])
returns integer
language plpgsql volatile security definer set search_path = public
as $$
declare v_n integer;
begin
  with moi as (
    select t.ym as thang, f.hoc_sinh_id, f.mon, f.nguon, f.exp, f.xu
    from unnest(p_thang) t(ym) cross join lateral public._xu_thanh_phan_tinh(t.ym, null) f
  ), cu as (
    select x.hoc_sinh_id, x.mon, x.thang, x.nguon from public.xu_thanh_phan x where x.thang = any(p_thang)
  )
  insert into public.xu_thanh_phan (hoc_sinh_id, mon, thang, nguon, exp, xu)
  select coalesce(m.hoc_sinh_id, c.hoc_sinh_id), coalesce(m.mon, c.mon), coalesce(m.thang, c.thang), coalesce(m.nguon, c.nguon),
         coalesce(m.exp, 0), coalesce(m.xu, 0)
  from moi m full join cu c on c.hoc_sinh_id = m.hoc_sinh_id and c.mon = m.mon and c.thang = m.thang and c.nguon = m.nguon
  on conflict (hoc_sinh_id, mon, thang, nguon) do update
    set exp = excluded.exp, xu = excluded.xu, cap_nhat_at = now()
    where (public.xu_thanh_phan.exp, public.xu_thanh_phan.xu) is distinct from (excluded.exp, excluded.xu);
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- ── ĐỒNG BỘ XU: y hệt mig 202610061809 + bước ⓪ (chỉ lượt toàn trung tâm) ──
create or replace function public._xu_dong_bo(p_hs uuid default null, p_thang text[] default null, p_nguoi uuid default null)
returns table(so_dong integer, tong_xu integer)
language plpgsql volatile security definer set search_path = public
as $$
declare
  c_tu constant text := '2026-09';   -- tháng đầu quy đổi TỰ ĐỘNG (Thùy 06/10); tháng 8 đã chốt tay, đóng băng
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_cac text[];
  v_dich jsonb;
begin
  v_cac := coalesce(p_thang, array(
    select t from unnest(array[to_char(v_nay - interval '1 month', 'YYYY-MM'), to_char(v_nay, 'YYYY-MM')]) t
    where t >= c_tu));
  if exists (select 1 from unnest(v_cac) t where t !~ '^\d{4}-(0[1-9]|1[0-2])$') then
    raise exception 'Tháng không hợp lệ: %', v_cac;
  end if;
  if cardinality(v_cac) = 0 then so_dong := 0; tong_xu := 0; return next; return; end if;

  -- ⓪ (28/10) Lượt TOÀN TRUNG TÂM: làm mới tỉ lệ chia xu theo nguồn (màn Tổng kết xu) — TRƯỚC khi khoá ví.
  if p_hs is null then perform public._xu_thanh_phan_lam_moi(v_cac); end if;

  -- ① Đích (xu theo EXP tới giờ) — tính TRƯỚC khi khoá ví.
  select coalesce(jsonb_agg(jsonb_build_object('hs', f.hoc_sinh_id, 'mon', f.mon, 'thang', t.ym, 'exp', f.exp, 'xu', f.xu)), '[]'::jsonb)
    into v_dich
  from unnest(v_cac) t(ym)
  cross join lateral public.fn_gami_exp_xu_thang(t.ym, p_hs, null) f
  where f.hoc_sinh_id is not null;

  -- ② Khoá ví (thứ tự id — cùng quy ước fn_tuqua_doi). Gồm cả HS đã được phát mà nay EXP về 0 (trừ thật).
  perform 1 from public.hoc_sinh h
  where h.id in (
    select (e->>'hs')::uuid from jsonb_array_elements(v_dich) e
    union
    select x.hoc_sinh_id from public.qlht_xu_ledger x
    where x.loai in ('chot_thang', 'chot_lai') and x.thang = any(v_cac) and (p_hs is null or x.hoc_sinh_id = p_hs)
  )
  order by h.id
  for update;

  -- ③ Ghi chênh = đích − đã phát (đọc "đã phát" SAU khi khoá). SELECT … INTO (không RETURN QUERY bọc INSERT).
  with d as (
    select * from jsonb_to_recordset(v_dich) as d(hs uuid, mon text, thang text, exp integer, xu integer)
  ), da as (
    select x.hoc_sinh_id as hs, coalesce(x.mon, '') as mon, x.thang,
           sum(x.amount)::integer as xu, bool_or(x.loai = 'chot_thang') as co_goc
    from public.qlht_xu_ledger x
    where x.loai in ('chot_thang', 'chot_lai') and x.thang = any(v_cac) and (p_hs is null or x.hoc_sinh_id = p_hs)
    group by 1, 2, 3
  ), lech as (
    select coalesce(d.hs, da.hs) as hs, coalesce(d.mon, da.mon) as mon, coalesce(d.thang, da.thang) as thang,
           coalesce(d.exp, 0) as exp, coalesce(d.xu, 0) - coalesce(da.xu, 0) as chenh, coalesce(da.co_goc, false) as co_goc
    from d full join da on da.hs = d.hs and da.mon = d.mon and da.thang = d.thang
  ), ghi as (
    insert into public.qlht_xu_ledger (hoc_sinh_id, amount, loai, mon, thang, exp_snapshot, ly_do, nguoi_tao)
    select l.hs, l.chenh, case when l.co_goc then 'chot_lai' else 'chot_thang' end, l.mon, l.thang, l.exp,
           format('Quy đổi xu tháng %s · %s · %s EXP', l.thang, coalesce(nullif(l.mon, ''), '?'), l.exp), p_nguoi
    from lech l
    where l.chenh <> 0
    returning amount
  )
  select count(*)::integer, coalesce(sum(g.amount), 0)::integer into so_dong, tong_xu from ghi g;
  return next;
end $$;

-- ── ② DASHBOARD: mỗi HS 1 dòng. p_thang null = từ 8/2026 tới nay; p_hoc_sinh_id = vá 1 dòng sau khi cộng/trừ tay ──
-- Cột từ EXP = xu ĐÃ VÀO SỔ chia theo ①; các nguồn ghi thẳng sổ (nông trại, giải thưởng, thầy cô ±, đổi quà) đọc qlht_xu_ledger.
-- tong = mọi khoản vào/ra ví trong kỳ TRỪ đổi quà ⇒ với "toàn bộ": tong − da_tieu = so_du (số dư hiện tại, không theo kỳ).
create or replace function public.fn_xu_tong_ket(p_thang text default null, p_hoc_sinh_id uuid default null)
returns table(
  hoc_sinh_id uuid, ho_ten text, ma_hs text, khoi text, lop text, trang_thai text,
  et integer, btvn integer, tren_lop integer, tham_du integer,
  nhiem_vu integer, vong_quay integer, thanh_tuu integer, nong_trai integer,
  giai_thuong integer, thay_co_cong integer, thay_co_tru integer, khac integer,
  tong integer, da_tieu integer, so_du integer)
language plpgsql stable security definer set search_path = public
as $$
declare v_cac text[];
begin
  if public.current_nhan_su_id() is null then raise exception 'Chỉ nhân sự được xem tổng kết xu.'; end if;
  if p_thang is not null and p_thang !~ '^\d{4}-(0[1-9]|1[0-2])$' then raise exception 'Tháng không hợp lệ: %', p_thang; end if;
  v_cac := case when p_thang is not null then array[p_thang] else array(
    select to_char(d, 'YYYY-MM') from generate_series(date '2026-08-01', (now() at time zone 'Asia/Ho_Chi_Minh')::date, interval '1 month') d) end;

  return query
  with f as (   -- ① tỉ lệ đã lưu
    select x.thang, x.hoc_sinh_id as hs, x.mon, x.nguon, x.xu as w
    from public.xu_thanh_phan x
    where x.thang = any(v_cac) and (p_hoc_sinh_id is null or x.hoc_sinh_id = p_hoc_sinh_id)
  ), p as (     -- xu ĐÃ VÀO SỔ theo (HS × môn × tháng)
    select l.hoc_sinh_id as hs, coalesce(l.mon, '') as mon, l.thang, sum(l.amount)::integer as tien
    from public.qlht_xu_ledger l
    where l.loai in ('chot_thang', 'chot_lai') and l.thang = any(v_cac)
      and (p_hoc_sinh_id is null or l.hoc_sinh_id = p_hoc_sinh_id)
    group by 1, 2, 3
  ), nhom as (
    select p.hs, p.mon, p.thang, p.tien, coalesce(sum(f.w), 0) as tw
    from p left join f on f.hs = p.hs and f.mon = p.mon and f.thang = p.thang
    group by 1, 2, 3, 4
  ), chia as (  -- chia được: tiền > 0 và có tỉ lệ
    select n.hs, f.nguon, n.tien, n.tien::numeric * f.w / n.tw as q, n.mon, n.thang
    from nhom n join f on f.hs = n.hs and f.mon = n.mon and f.thang = n.thang
    where n.tien > 0 and n.tw > 0
  ), xep as (
    select c.hs, c.nguon, floor(c.q)::integer as san,
           c.tien - sum(floor(c.q)) over (partition by c.hs, c.mon, c.thang) as con,
           row_number() over (partition by c.hs, c.mon, c.thang order by c.q - floor(c.q) desc, c.nguon) as hang
    from chia c
  ), nguon as (
    select x.hs, x.nguon, (x.san + case when x.hang <= x.con then 1 else 0 end) as xu from xep x
    union all   -- không chia được ⇒ Khác
    select n.hs, 'khac', n.tien from nhom n where not (n.tien > 0 and n.tw > 0)
  ), tp as (
    select g.hs,
           sum(g.xu) filter (where g.nguon = 'et') as et,
           sum(g.xu) filter (where g.nguon = 'btvn') as btvn,
           sum(g.xu) filter (where g.nguon = 'tren_lop') as tren_lop,
           sum(g.xu) filter (where g.nguon = 'tham_du') as tham_du,
           sum(g.xu) filter (where g.nguon = 'nhiem_vu') as nhiem_vu,
           sum(g.xu) filter (where g.nguon = 'vong_quay') as vong_quay,
           sum(g.xu) filter (where g.nguon = 'thanh_tuu') as thanh_tuu,
           sum(g.xu) filter (where g.nguon = 'khac') as khac,
           sum(g.xu) as doi_exp
    from nguon g group by 1
  ), so as (
    select l.hoc_sinh_id as hs,
           sum(l.amount) filter (where l.loai = 'nong_trai' and (p_thang is null or l.thang = p_thang)) as nong_trai,
           sum(l.amount) filter (where l.loai = 'giai_thuong' and (p_thang is null or k.ky = p_thang)) as giai_thuong,
           sum(l.amount) filter (where l.loai = 'cong_tay' and (p_thang is null or k.ky = p_thang)) as cong,
           sum(l.amount) filter (where l.loai = 'tru_tay' and (p_thang is null or k.ky = p_thang)) as tru,
           sum(l.amount) filter (where l.loai in ('doi_qua', 'hoan') and (p_thang is null or k.ky = p_thang)) as tieu,
           sum(l.amount) as so_du
    from public.qlht_xu_ledger l
    cross join lateral (select to_char(l.created_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') as ky) k
    where p_hoc_sinh_id is null or l.hoc_sinh_id = p_hoc_sinh_id
    group by 1
  ), lop_nay as (
    select hl.hoc_sinh_id as hs, string_agg(distinct lp.ten_lop, ', ' order by lp.ten_lop) as lop
    from public.hoc_sinh_lop hl join public.lop lp on lp.id = hl.lop_id
    where hl.ngay_roi is null and (p_hoc_sinh_id is null or hl.hoc_sinh_id = p_hoc_sinh_id)
    group by 1
  )
  select h.id, h.ho_ten, h.ma_hs, h.khoi, ln.lop, h.trang_thai,
         coalesce(tp.et, 0)::integer, coalesce(tp.btvn, 0)::integer, coalesce(tp.tren_lop, 0)::integer, coalesce(tp.tham_du, 0)::integer,
         coalesce(tp.nhiem_vu, 0)::integer, coalesce(tp.vong_quay, 0)::integer, coalesce(tp.thanh_tuu, 0)::integer, coalesce(so.nong_trai, 0)::integer,
         coalesce(so.giai_thuong, 0)::integer, coalesce(so.cong, 0)::integer, coalesce(so.tru, 0)::integer, coalesce(tp.khac, 0)::integer,
         (coalesce(tp.doi_exp, 0) + coalesce(so.nong_trai, 0) + coalesce(so.giai_thuong, 0) + coalesce(so.cong, 0) + coalesce(so.tru, 0))::integer,
         (-coalesce(so.tieu, 0))::integer,
         coalesce(so.so_du, 0)::integer
  from public.hoc_sinh h
  left join tp on tp.hs = h.id
  left join so on so.hs = h.id
  left join lop_nay ln on ln.hs = h.id
  where (p_hoc_sinh_id is null or h.id = p_hoc_sinh_id)
    and h.trang_thai <> 'test'
    and (h.trang_thai = 'dang_hoc' or tp.hs is not null or so.hs is not null)
  order by h.khoi, h.ho_ten;
end $$;

-- ── Dòng TỔNG toàn trung tâm (§2.0: không cộng ở client) ──
create or replace function public.fn_xu_tong_ket_tong(p_thang text default null)
returns table(so_hs integer, et integer, btvn integer, tren_lop integer, tham_du integer,
  nhiem_vu integer, vong_quay integer, thanh_tuu integer, nong_trai integer,
  giai_thuong integer, thay_co_cong integer, thay_co_tru integer, khac integer,
  tong integer, da_tieu integer, so_du integer)
language sql stable set search_path = public
as $$
  select count(*)::integer, sum(t.et)::integer, sum(t.btvn)::integer, sum(t.tren_lop)::integer, sum(t.tham_du)::integer,
         sum(t.nhiem_vu)::integer, sum(t.vong_quay)::integer, sum(t.thanh_tuu)::integer, sum(t.nong_trai)::integer,
         sum(t.giai_thuong)::integer, sum(t.thay_co_cong)::integer, sum(t.thay_co_tru)::integer, sum(t.khac)::integer,
         sum(t.tong)::integer, sum(t.da_tieu)::integer, sum(t.so_du)::integer
  from public.fn_xu_tong_ket(p_thang) t
$$;

revoke all on function public._xu_thanh_phan_tinh(text, uuid) from public, anon, authenticated;
revoke all on function public._xu_thanh_phan_lam_moi(text[]) from public, anon, authenticated;
revoke all on function public.fn_xu_tong_ket(text, uuid) from public, anon;
grant execute on function public.fn_xu_tong_ket(text, uuid) to authenticated;
revoke all on function public.fn_xu_tong_ket_tong(text) from public, anon;
grant execute on function public.fn_xu_tong_ket_tong(text) to authenticated;

-- ── Nạp 1 lần: tháng 8/2026 → tháng hiện tại ──
select public._xu_thanh_phan_lam_moi(array(
  select to_char(d, 'YYYY-MM') from generate_series(date '2026-08-01', (now() at time zone 'Asia/Ho_Chi_Minh')::date, interval '1 month') d));
