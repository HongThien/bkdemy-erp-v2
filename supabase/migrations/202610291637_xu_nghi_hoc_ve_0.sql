-- ============================================================================
-- 202610291637 — EM NGHỈ HỌC TỰ VỀ 0 XU (Thùy 29/10: "Các tài khoản nghỉ tự động về 0 xu")
-- ----------------------------------------------------------------------------
-- CÁCH LÀM (sổ append-only, không sửa/xoá dòng cũ):
--   (1) Loại sổ mới 'nghi_ve_0' — dòng hệ thống (nguoi_tao NULL), amount = −số dư ⇒ ví về đúng 0 (âm thì cộng lên 0).
--       mon = NULL (ví là tài sản CHUNG, không theo môn — §1.6), thang = tháng ghi.
--   (2) _xu_nghi_ve_0(p_hs): khoá ví (thứ tự id, cùng quy ước _xu_dong_bo/fn_tuqua_doi) rồi ghi dòng cho mọi em trang_thai = 'nghi' có số dư ≠ 0.
--   (3) Gắn vào CUỐI _xu_dong_bo (cron 'xu-dong-bo' mỗi giờ phút :05) ⇒ đổi em sang "nghỉ" thì chậm nhất ~1 giờ ví về 0;
--       EXP cũ của em còn nhích (chấm ET muộn) ⇒ ③ quy đổi thêm rồi ④ đưa lại về 0 trong cùng lượt.
--       Bước ③ chỉ so 'chot_thang'/'chot_lai' ⇒ KHÔNG "trả lại" phần đã đưa về 0. Em đi học lại: xu cũ không hoàn, tích lại từ đầu.
--   (4) fn_xu_tong_ket: khoản 'nghi_ve_0' vào cột Khác + Tổng ⇒ giữ đẳng thức tổng − đã tiêu = số dư.
--   Phạm vi: chỉ 'nghi'. 'bao_luu' giữ xu; 'tot_nghiep' hiện 0 em; 'test' không đụng.
-- MẤT GÌ (Luật xoá): không xoá dòng nào. Nới 2 CHECK; thay 2 hàm bằng create or replace (giữ chữ ký);
--   lượt chạy cuối file ghi ~19 dòng 'nghi_ve_0' (đo 29/10: 19 em nghỉ, ví lớn nhất 84) — Thùy yêu cầu.
-- ============================================================================

alter table public.qlht_xu_ledger drop constraint qlht_xu_ledger_loai_check;
alter table public.qlht_xu_ledger add constraint qlht_xu_ledger_loai_check
  check (loai = any (array['cong_tay', 'tru_tay', 'doi_qua', 'hoan', 'chot_thang', 'chot_lai', 'nong_trai', 'giai_thuong', 'nghi_ve_0']));
alter table public.qlht_xu_ledger drop constraint qlht_xu_ledger_nguoi_tao_may;
alter table public.qlht_xu_ledger add constraint qlht_xu_ledger_nguoi_tao_may
  check (nguoi_tao is not null or loai = any (array['chot_thang', 'chot_lai', 'nong_trai', 'giai_thuong', 'nghi_ve_0']));

create or replace function public._xu_nghi_ve_0(p_hs uuid default null)
returns integer
language plpgsql volatile security definer set search_path = public
as $$
declare
  v_ym text := to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM');
  n integer;
begin
  perform 1 from public.hoc_sinh h
  where h.trang_thai = 'nghi' and (p_hs is null or h.id = p_hs)
    and exists (select 1 from public.qlht_xu_ledger x where x.hoc_sinh_id = h.id)
  order by h.id
  for update;

  insert into public.qlht_xu_ledger (hoc_sinh_id, amount, loai, mon, thang, ly_do, nguoi_tao)
  select s.hs, -s.du, 'nghi_ve_0', null, v_ym, format('Nghỉ học — đưa ví về 0 (số dư trước: %s xu)', s.du), null
  from (
    select x.hoc_sinh_id as hs, sum(x.amount)::integer as du
    from public.qlht_xu_ledger x
    join public.hoc_sinh h on h.id = x.hoc_sinh_id
    where h.trang_thai = 'nghi' and (p_hs is null or h.id = p_hs)
    group by 1
  ) s
  where s.du <> 0;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public._xu_nghi_ve_0(uuid) from public;
revoke execute on function public._xu_nghi_ve_0(uuid) from anon, authenticated;

-- ── _xu_dong_bo: thân giữ nguyên bản 202610281926, chỉ thêm bước ④ ──
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

  -- ④ (29/10) Em NGHỈ HỌC ⇒ ví về 0 (gồm xu vừa quy đổi ở ③ nếu EXP cũ còn nhích).
  perform public._xu_nghi_ve_0(p_hs);
  return next;
end $$;

-- ── fn_xu_tong_ket: thân giữ nguyên bản 202610281926, 'nghi_ve_0' vào Khác + Tổng ──
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
           sum(l.amount) filter (where l.loai = 'nghi_ve_0' and (p_thang is null or k.ky = p_thang)) as ve_0,
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
         coalesce(so.giai_thuong, 0)::integer, coalesce(so.cong, 0)::integer, coalesce(so.tru, 0)::integer, (coalesce(tp.khac, 0) + coalesce(so.ve_0, 0))::integer,
         (coalesce(tp.doi_exp, 0) + coalesce(so.nong_trai, 0) + coalesce(so.giai_thuong, 0) + coalesce(so.cong, 0) + coalesce(so.tru, 0) + coalesce(so.ve_0, 0))::integer,
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

-- ── Chạy ngay 1 lượt cho các em đang nghỉ ──
select public._xu_nghi_ve_0();
