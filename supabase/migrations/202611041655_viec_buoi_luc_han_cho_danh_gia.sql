-- ============================================================================
-- viec_buoi_luc_han_cho_danh_gia — Thùy 04/11 (nối tiếp mig 202611041642): MỌI chỗ ĐÁNH GIÁ người theo việc
-- buổi học phải tính theo NGƯỜI PHỤ TRÁCH LÚC TỚI HẠN, không theo phân công HIỆN TẠI.
-- ----------------------------------------------------------------------------
-- LỖI CŨ: fn_viec_buoi_thuong(p_tu, p_den, true) gắn người = phan_cong_lop BÂY GIỜ. Lớp đổi TA (A → B) ⇒ mọi việc cũ
-- của lớp (kể cả lúc A còn giữ) chạy sang B ở: Chất lượng vận hành theo tháng (fn_ta_viec_thang / fn_gv_viec_thang),
-- Hiệu suất TA (fn_hsta_task, fn_hsta_gay), Trợ lý (_troly_viec_buoi_goc, _troly_cc_viec_van_hanh), Báo cáo tuần
-- trưởng khối (fn_bctk_so), Phòng làm việc (_phong_viec_ta_pv). Ca thật: 8B1 — Khánh giữ tới 03/11, Đỗ Xuân Phong nhận
-- từ 03/11 ⇒ việc BTVN/ET tháng 10 của Khánh hiện thành của Phong.
--
-- MỚI:
--   · _viec_nguoi_luc_han(...) — MỘT nguồn luật "ai phụ trách khâu này tại giờ hạn" (tra ngược phan_cong_lop_log;
--     MT theo sơ đồ chỉ trong 6 giờ sau hạn). fn_viec_chup_phu_trach (bản chụp) và hàm đọc dưới đây cùng gọi nó.
--   · fn_viec_buoi_thuong_lh(p_tu, p_den) — cùng cột với fn_viec_buoi_thuong(…, true):
--       việc CHƯA tới hạn (hoặc không có hạn) ⇒ phân công hiện tại (đúng: chưa ai trễ, người hiện tại đang phải làm);
--       việc ĐÃ tới hạn ⇒ bản chụp viec_phu_trach_snap; chưa có bản chụp (cron chưa chạy tới) ⇒ tính đúng luật chụp
--       ngay lúc đọc; luật không ra được ai (mơ hồ / MT quá 6 giờ) ⇒ KHÔNG gắn cho ai (§1.5 thà bỏ trống).
--   · Các hàm đánh giá kể trên đổi sang đọc fn_viec_buoi_thuong_lh. GIỮ phân công hiện tại ở hàng đợi HÀNH ĐỘNG
--     (Việc của tôi, đếm push fn_ta_push_dem*, bản tin việc tồn _tg_viec_ton) — đó là "ai phải làm bây giờ", không chấm ai.
-- Sổ phan_cong_lop_log tin được từ 12/10/2026; trước đó sổ dựng lại từ created_at của phân công còn sống lúc 12/10 ⇒
-- người đã rời lớp trước 12/10 không có trong sổ ⇒ việc đó bỏ trống (không quy cho người đến sau).
-- ============================================================================

-- ── 1. LUẬT DUY NHẤT: người phụ trách 1 khâu tại giờ hạn ──
create or replace function public._viec_nguoi_luc_han(p_lop uuid, p_mon text, p_khoi text, p_tab text, p_han timestamptz)
returns table (nhan_su_id uuid, vai text, nguon text)
language sql stable security definer set search_path = public
as $$
  select x.ns, x.vai, 'nhat_ky_phan_cong'::text
  from (select case p_tab
                 when 'danhgia' then public._pc_chon(p_lop, p_han, 'gv')
                 when 'ingame'  then case when exists (select 1 from public._pc_luc(p_lop, p_han) p where p.vai_tro = 'tg')
                                          then public._pc_chon(p_lop, p_han, 'tg') else public._pc_chon(p_lop, p_han, 'gv') end
                 else public._pc_chon(p_lop, p_han, 'tg') end as ns,
               case p_tab
                 when 'danhgia' then 'gv'
                 when 'ingame'  then case when exists (select 1 from public._pc_luc(p_lop, p_han) p where p.vai_tro = 'tg')
                                          then 'tg' else 'gv' end
                 else 'tg' end as vai) x
  where p_tab <> 'mt' and x.ns is not null
  union all
  -- MT: Phó khối (không có ⇒ Trưởng) theo sơ đồ — chỉ khi đang sát hạn (sơ đồ không có sổ lịch sử)
  select k.nhan_su_id, 'tk', 'so_do_luc_chup'
  from public._khoi_van_hanh(p_mon, p_khoi) k
  where p_tab = 'mt' and now() - p_han <= interval '6 hours'
  union all
  -- MT, khối không ai giữ ghế ⇒ GV chính của lớp tại giờ hạn
  select g.ns, 'gv', 'nhat_ky_phan_cong'
  from (select public._pc_chon(p_lop, p_han, 'gv') as ns) g
  where p_tab = 'mt' and now() - p_han <= interval '6 hours' and g.ns is not null
    and not exists (select 1 from public._khoi_van_hanh(p_mon, p_khoi));
$$;
revoke execute on function public._viec_nguoi_luc_han(uuid, text, text, text, timestamptz) from public, anon;
grant execute on function public._viec_nguoi_luc_han(uuid, text, text, text, timestamptz) to authenticated, postgres;

-- ── 2. Bản chụp dùng đúng luật trên (hành vi KHÔNG đổi so với mig 202611041642) ──
create or replace function public.fn_viec_chup_phu_trach(p_tu date default null)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_n int;
begin
  with b as (
    select bh.id, bh.lop_id, bh.ngay, bh.gio_bat_dau, l.mon, l.khoi,
           exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = bh.lop_id and tl.ngay = bh.ngay) as co_mt
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy'
      and bh.ngay >= coalesce(p_tu, v_hom_nay - 10) and bh.ngay <= v_hom_nay
  ),
  t as (   -- khâu của buổi: y hệt fn_viec_buoi_thuong (MT thay hẳn các khâu; ingame bỏ từ 01/10/2026)
    select b.*, x.tab, public.fn_han_viec(b.lop_id, b.ngay, b.gio_bat_dau, x.tab) as han
    from b cross join lateral unnest(
      case when b.co_mt then array['mt']
           when b.ngay >= date '2026-10-01' then array['danhgia', 'et', 'btvn']
           else array['danhgia', 'ingame', 'et', 'btvn'] end) as x(tab)
  ),
  cho as (
    select t.* from t
    where t.han is not null and t.han <= now()
      and not exists (select 1 from viec_phu_trach_snap s where s.buoi_id = t.id and s.tab = t.tab)
  )
  insert into viec_phu_trach_snap (buoi_id, tab, nhan_su_id, han, nguon)
  select c.id, c.tab, o.nhan_su_id, c.han, o.nguon
  from cho c
  cross join lateral public._viec_nguoi_luc_han(c.lop_id, c.mon, c.khoi, c.tab, c.han) o
  on conflict do nothing;
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- ── 3. Việc buổi THƯỜNG cho ĐÁNH GIÁ (mọi người): tới hạn ⇒ người lúc hạn ──
create or replace function public.fn_viec_buoi_thuong_lh(p_tu date default null, p_den date default null)
returns table (nhan_su_id uuid, buoi_id uuid, lop_id uuid, ten_lop text, ngay date, vai text, tab text,
               dong_at timestamptz, han timestamptz, et_online boolean, ref_key text)
language sql stable set search_path = public
as $$
  with b as (
    select bh.id, bh.lop_id, l.ten_lop, l.khoi, l.mon, bh.ngay, bh.gio_bat_dau,
           bh.ingame_dong_at, bh.et_dong_at, bh.danh_gia_xong_at, bh.btvn_dong_at, bh.mt_dong_at,
           exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = bh.lop_id and tl.ngay = bh.ngay) as co_mt,
           exists (select 1 from bai_test bt where bt.lop_id = bh.lop_id and bt.ngay = bh.ngay and bt.loai = 'et') as et_online
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy'
      and (p_tu is null or bh.ngay >= p_tu)
      and (p_den is null or bh.ngay <= p_den)
  ),
  k as (   -- khâu của buổi: cùng bảng khâu với fn_viec_chup_phu_trach
    select b.id, b.lop_id, b.ten_lop, b.mon, b.khoi, b.ngay, b.et_online, x.tab,
           public.fn_han_viec(b.lop_id, b.ngay, b.gio_bat_dau, x.tab) as han,
           case x.tab when 'ingame' then b.ingame_dong_at when 'et' then b.et_dong_at when 'danhgia' then b.danh_gia_xong_at
                      when 'btvn' then b.btvn_dong_at else b.mt_dong_at end as dong_at
    from b cross join lateral unnest(
      case when b.co_mt then array['mt']
           when b.ngay >= date '2026-10-01' then array['danhgia', 'et', 'btvn']
           else array['danhgia', 'ingame', 'et', 'btvn'] end) as x(tab)
  ),
  den as (select * from k where k.han is not null and k.han <= now()),
  nguoi as (
    select d.*, s.nhan_su_id,
           case s.tab when 'mt' then case when s.nguon = 'so_do_luc_chup' then 'tk' else 'gv' end
                      when 'danhgia' then 'gv' else 'tg' end as vai
    from den d join viec_phu_trach_snap s on s.buoi_id = d.id and s.tab = d.tab
    union all
    select d.*, o.nhan_su_id, o.vai
    from den d cross join lateral public._viec_nguoi_luc_han(d.lop_id, d.mon, d.khoi, d.tab, d.han) o
    where not exists (select 1 from viec_phu_trach_snap s where s.buoi_id = d.id and s.tab = d.tab)
  )
  select v.nhan_su_id, v.buoi_id, v.lop_id, v.ten_lop, v.ngay, v.vai, v.tab, v.dong_at, v.han, v.et_online, v.ref_key
  from public.fn_viec_buoi_thuong(p_tu, p_den, true) v
  where v.han is null or v.han > now()
  union all
  select n.nhan_su_id, n.id, n.lop_id, n.ten_lop, n.ngay, n.vai, n.tab, n.dong_at, n.han, n.et_online,
         'vh:' || n.id::text || '|' || n.tab || '|' || n.nhan_su_id::text
  from nguoi n;
$$;
revoke execute on function public.fn_viec_buoi_thuong_lh(date, date) from public, anon;
grant execute on function public.fn_viec_buoi_thuong_lh(date, date) to authenticated;

-- ── 4. Các hàm ĐÁNH GIÁ đổi nguồn (thân hàm chép từ DB live 04/11, chỉ đổi lời gọi engine việc) ──

CREATE OR REPLACE FUNCTION public.fn_ta_viec_thang(p_tu date, p_den date)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, an_xep_hang boolean, ten_lop text, ngay date, tab text, kq text, ly_do text)
 LANGUAGE sql
 STABLE
AS $function$
  with raw as (
    select v.nhan_su_id, v.ten_lop, v.ngay, v.tab, v.ref_key,
      case
        when d.id is not null then case when d.tien_do >= 100 and d.chat_luong >= 80 then 'dat' else 'khong_dat' end
        when v.dong_at is not null then case when v.dong_at <= v.han then 'dat' else 'khong_dat' end
        when v.han < now() then 'khong_dat'
        else 'cho'
      end as kq_raw,
      case
        when d.id is not null and (d.tien_do < 100 or d.chat_luong < 80) then
          case when d.chat_luong < 80 then 'chat_luong' else 'tre' end
        when v.dong_at is not null and v.dong_at > v.han then 'tre'
        when v.dong_at is null and v.han < now() then 'no_qua_han'
        else null
      end as ly_do_raw
    from public.fn_viec_buoi_thuong_lh(p_tu, p_den) v
    left join viec_van_hanh_duyet d on d.buoi_hoc_id = v.buoi_id and d.tab = v.tab and d.nhan_su_id = v.nhan_su_id
    where v.vai = 'tg' and not (v.tab = 'et' and v.et_online)
  ),
  gay_adj as (
    select r.nhan_su_id, r.ten_lop, r.ngay, r.tab,
      (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') then
         (case when public.fn_gay_dang_hieu_luc(r.ref_key) then 'khong_dat' else 'dat' end)
       else r.kq_raw end) as kq,
      (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') and not public.fn_gay_dang_hieu_luc(r.ref_key)
         then null else r.ly_do_raw end) as ly_do
    from raw r
  )
  -- Ân xá lịch sử (CEO 07/09): việc TRƯỚC 01/09/2026 luôn ĐẠT CHUẨN, bất kể gậy — luật gậy-driven
  -- chỉ tính từ tháng 9. Mốc cố định, KHÔNG phải "tháng hiện tại".
  select g.nhan_su_id, ns.ho_ten, ns.an_xep_hang, g.ten_lop, g.ngay, g.tab,
    (case when g.ngay < date '2026-09-01' and g.kq = 'khong_dat' then 'dat' else g.kq end) as kq,
    (case when g.ngay < date '2026-09-01' then null else g.ly_do end) as ly_do
  from gay_adj g join nhan_su ns on ns.id = g.nhan_su_id
$function$;

CREATE OR REPLACE FUNCTION public.fn_gv_viec_thang(p_tu date, p_den date)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, an_xep_hang boolean, ten_lop text, ngay date, tab text, kq text, ly_do text)
 LANGUAGE sql
 STABLE
AS $function$
  with raw as (
    select v.nhan_su_id, v.ten_lop, v.ngay, v.tab, v.ref_key,
      case
        when v.dong_at is not null then case when v.dong_at <= v.han then 'dat' else 'khong_dat' end
        when v.han < now() then 'khong_dat'
        else 'cho'
      end as kq_raw,
      case
        when v.dong_at is not null and v.dong_at > v.han then 'tre'
        when v.dong_at is null and v.han < now() then 'no_qua_han'
        else null
      end as ly_do_raw
    from public.fn_viec_buoi_thuong_lh(p_tu, p_den) v
    where v.vai = 'gv'
  ),
  gay_adj as (
    select r.nhan_su_id, r.ten_lop, r.ngay, r.tab,
      (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') then
         (case when public.fn_gay_dang_hieu_luc(r.ref_key) then 'khong_dat' else 'dat' end)
       else r.kq_raw end) as kq,
      (case when r.kq_raw = 'khong_dat' and r.ly_do_raw in ('tre', 'no_qua_han') and not public.fn_gay_dang_hieu_luc(r.ref_key)
         then null else r.ly_do_raw end) as ly_do
    from raw r
  )
  select g.nhan_su_id, ns.ho_ten, ns.an_xep_hang, g.ten_lop, g.ngay, g.tab,
    (case when g.ngay < date '2026-09-01' and g.kq = 'khong_dat' then 'dat' else g.kq end) as kq,
    (case when g.ngay < date '2026-09-01' then null else g.ly_do end) as ly_do
  from gay_adj g join nhan_su ns on ns.id = g.nhan_su_id
$function$;

CREATE OR REPLACE FUNCTION public._troly_viec_buoi_goc(p_tu date, p_den date)
 RETURNS TABLE(buoi_id uuid, tab text, ten_lop text, ngay date, dong_at timestamp with time zone, han timestamp with time zone, phu_trach text, nguoi_ids uuid[], n_dl integer, n_thieu integer, ten_thieu text, kq text)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
begin
  perform public._troly_gac();
  return query
  with moc as (select least(p_tu, p_den - 60) as tu_rong),
  b as (  -- cửa sổ RỘNG (60 ngày) để biết lớp nào thật sự chạy khâu nào
    select bh.id, bh.lop_id, bh.ngay, l.ten_lop
    from buoi_hoc bh join lop l on l.id = bh.lop_id, moc
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy' and bh.ngay between moc.tu_rong and p_den
  ),
  tl as (
    select t.lop_id, t.ngay, bool_or(t.loai = 'et') as co_et, bool_or(t.loai = 'btvn') as co_btvn
    from tai_lieu t, moc
    where t.loai in ('et', 'btvn') and t.lop_id is not null and t.ngay between moc.tu_rong and p_den
    group by t.lop_id, t.ngay
  ),
  bt as (
    select x.lop_id, x.ngay, bool_or(x.loai = 'et') as co_et, bool_or(x.loai = 'btvn') as co_btvn
    from bai_test x, moc
    where x.loai in ('et', 'btvn') and x.ngay between moc.tu_rong and p_den
    group by x.lop_id, x.ngay
  ),
  gsp as (
    select sp.buoi_hoc_id, bool_or(sp.phase = 'et') as co_et, bool_or(sp.phase = 'btvn') as co_btvn,
           bool_or(sp.phase = 'ingame') as co_ingame
    from gami_session_problems sp where sp.buoi_hoc_id in (select id from b)
    group by sp.buoi_hoc_id
  ),
  de as (
    select b.id as buoi_id, b.lop_id, b.ngay, k.khau,
      case k.khau
        when 'et' then coalesce(tl.co_et, false) or coalesce(bt.co_et, false) or coalesce(gsp.co_et, false)
        when 'btvn' then coalesce(tl.co_btvn, false) or coalesce(bt.co_btvn, false) or coalesce(gsp.co_btvn, false)
        when 'ingame' then coalesce(gsp.co_ingame, false)
        else true end as co_de        -- đánh giá + MT: buổi đã sinh việc thì luôn phải làm
    from b cross join (values ('et'), ('btvn'), ('ingame'), ('danhgia'), ('mt')) k(khau)
    left join tl on tl.lop_id = b.lop_id and tl.ngay = b.ngay
    left join bt on bt.lop_id = b.lop_id and bt.ngay = b.ngay
    left join gsp on gsp.buoi_hoc_id = b.id
  ),
  chay as (
    select de.lop_id, de.khau, (count(*) < 4 or avg(de.co_de::int) >= 0.6) as chay
    from de where de.ngay >= p_den - 60 group by de.lop_id, de.khau
  ),
  v as (  -- việc + người phụ trách + hạn: NGUỒN DUY NHẤT là engine việc
    select f.buoi_id, f.tab, max(f.ten_lop) as ten_lop, max(f.ngay) as ngay,
           max(f.dong_at) as dong_at, max(f.han) as han,
           string_agg(distinct ns.ho_ten || case f.vai when 'gv' then ' (GV)' when 'tg' then ' (TA)'
                                                       when 'tk' then ' (trưởng khối)' else '' end, ', ') as phu_trach,
           array_agg(distinct f.nhan_su_id) as nguoi_ids
    from public.fn_viec_buoi_thuong_lh(p_tu, p_den) f
    join nhan_su ns on ns.id = f.nhan_su_id
    -- CEO 29/09: chấm bài trên lớp chỉ BẮT BUỘC từ tháng 10 ⇒ buổi trước mốc không sinh việc
    where f.tab <> 'ingame' or f.ngay >= (public._troly_bc_gia_dinh()->>'ingame_bat_buoc_tu')::date
    group by f.buoi_id, f.tab
  ),
  cm as (
    select h.buoi_hoc_id, h.hoc_sinh_id from buoi_hoc_hs h
    where h.buoi_hoc_id in (select buoi_id from v) and h.diem_danh = 'co_mat'
  ),
  co as (  -- (buổi, khâu, học sinh) ĐÃ có dữ liệu
    select sp.buoi_hoc_id, sp.phase as tab, g.hoc_sinh_id
      from gami_session_problems sp join gami_grades g on g.problem_id = sp.id
     where sp.phase in ('et', 'ingame', 'mt') and sp.buoi_hoc_id in (select buoi_id from v)
    union
    select b.id, 'et', bl.hoc_sinh_id
      from b join bai_test x on x.loai = 'et' and x.lop_id = b.lop_id and x.ngay = b.ngay
      join bai_lam bl on bl.bai_test_id = x.id and bl.trang_thai = 'da_nop'
     where b.id in (select buoi_id from v)
    union
    select d.buoi_hoc_id, 'danhgia', d.hoc_sinh_id from buoi_danh_gia d where d.buoi_hoc_id in (select buoi_id from v)
    union
    select k.buoi_hoc_id, 'btvn', k.hoc_sinh_id from btvn_ket_qua k where k.buoi_hoc_id in (select buoi_id from v)
  ),
  thieu as (  -- em CÓ MẶT mà khâu đó chưa có dòng, hoặc dòng BTVN chưa tick đủ
    select cm.buoi_hoc_id, k.tab, cm.hoc_sinh_id
    from cm cross join (values ('et'), ('danhgia'), ('btvn'), ('mt')) k(tab)
    where not exists (select 1 from co where co.buoi_hoc_id = cm.buoi_hoc_id and co.tab = k.tab and co.hoc_sinh_id = cm.hoc_sinh_id)
    union
    select k.buoi_hoc_id, 'btvn', k.hoc_sinh_id from btvn_ket_qua k
    where k.buoi_hoc_id in (select buoi_id from v)
      and (k.trang_thai_nop is null or (k.thai_do is null and k.trang_thai_nop in ('nop_dung_han', 'nop_muon')))
  ),
  n as (select co.buoi_hoc_id, co.tab, count(*)::int as n from co group by co.buoi_hoc_id, co.tab),
  nt as (
    select t.buoi_hoc_id, t.tab, count(*)::int as n,
           left(string_agg(hs.ho_ten, ', ' order by hs.ho_ten), 240) as ten
    from thieu t join hoc_sinh hs on hs.id = t.hoc_sinh_id
    group by t.buoi_hoc_id, t.tab
  )
  select v.buoi_id, v.tab, v.ten_lop, v.ngay, v.dong_at, v.han, v.phu_trach, v.nguoi_ids,
         coalesce(n.n, 0), coalesce(nt.n, 0), nt.ten,
    case
      when not de.co_de and coalesce(n.n, 0) = 0 then
           case when coalesce(ch.chay, true) and v.tab in ('et', 'btvn', 'ingame') then 'khong_co_de' else 'bo_qua' end
      when v.dong_at is not null and coalesce(n.n, 0) = 0 then 'dong_ma_trong'
      when v.dong_at is not null and coalesce(nt.n, 0) > 0 and v.tab <> 'ingame' then 'thieu_hs'
      when v.dong_at is not null and v.han is not null and v.dong_at > v.han then 'xong_muon'
      when v.dong_at is null and v.han is not null and v.han < now() then 'cham'
      when v.dong_at is not null then 'dung_chuan'
      else 'con_han'
    end
  from v
  join de on de.buoi_id = v.buoi_id and de.khau = v.tab
  left join chay ch on ch.lop_id = de.lop_id and ch.khau = v.tab
  left join n on n.buoi_hoc_id = v.buoi_id and n.tab = v.tab
  left join nt on nt.buoi_hoc_id = v.buoi_id and nt.tab = v.tab;
end $function$;

CREATE OR REPLACE FUNCTION public._troly_cc_viec_van_hanh(p jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v_ns jsonb; v_ns_id uuid; v_lop jsonb; v_lop_id uuid;
  v_tt text := lower(coalesce(nullif(btrim(p->>'trang_thai'), ''), 'chua_xong'));
  v_den date; v_tu date; v jsonb;
  c_tran constant int := 60;
begin
  perform public._troly_gac();
  if v_tt not in ('chua_xong', 'qua_han', 'da_xong', 'tat_ca') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'trang_thai phải là: chua_xong | qua_han | da_xong | tat_ca.');
  end if;
  if nullif(btrim(p->>'ten_nhan_vien'), '') is not null then
    v_ns := public._troly_chon_ns(p->>'ten_nhan_vien');
    if v_ns ? 'loi' then return v_ns; end if;
    v_ns_id := (v_ns->>'id')::uuid;
  end if;
  if nullif(btrim(p->>'ten_lop'), '') is not null then
    v_lop := public._troly_chon_lop(p->>'ten_lop');
    if v_lop ? 'loi' then return v_lop; end if;
    v_lop_id := (v_lop->>'id')::uuid;
  end if;
  v_den := public._troly_ngay(p->>'den_ngay', public._troly_hom_nay());
  v_tu := public._troly_ngay(p->>'tu_ngay', v_den - 14);
  if v_den - v_tu > 120 then v_tu := v_den - 120; end if;

  with t as (
    select f.nhan_su_id, ns.ho_ten, f.ten_lop, f.ngay, f.vai, f.tab, f.dong_at, f.han,
           case when f.dong_at is not null and f.dong_at <= f.han then 'xong_dung_han'
                when f.dong_at is not null then 'xong_tre'
                when f.han < now() then 'chua_xong_qua_han'
                else 'chua_xong_con_han' end as tinh_trang
    from public.fn_viec_buoi_thuong_lh(v_tu, v_den) f
    join nhan_su ns on ns.id = f.nhan_su_id
    where (v_ns_id is null or f.nhan_su_id = v_ns_id)
      and (v_lop_id is null or f.lop_id = v_lop_id)
  ),
  loc as (
    select * from t
    where v_tt = 'tat_ca'
       or (v_tt = 'chua_xong' and tinh_trang in ('chua_xong_qua_han', 'chua_xong_con_han'))
       or (v_tt = 'qua_han' and tinh_trang = 'chua_xong_qua_han')
       or (v_tt = 'da_xong' and tinh_trang in ('xong_dung_han', 'xong_tre'))
  )
  select jsonb_build_object(
    'khoang_ngay', jsonb_build_object('tu', v_tu, 'den', v_den),
    'loc', jsonb_build_object('nhan_vien', v_ns->>'ho_ten', 'lop', v_lop->>'ten_lop', 'trang_thai', v_tt),
    'tong', (select jsonb_build_object(
        'so_viec', count(*),
        'xong_dung_han', count(*) filter (where tinh_trang = 'xong_dung_han'),
        'xong_tre', count(*) filter (where tinh_trang = 'xong_tre'),
        'chua_xong_qua_han', count(*) filter (where tinh_trang = 'chua_xong_qua_han'),
        'chua_xong_con_han', count(*) filter (where tinh_trang = 'chua_xong_con_han')) from t),
    'theo_nguoi', (select coalesce(jsonb_agg(to_jsonb(g) order by g.chua_xong_qua_han desc, g.ho_ten), '[]'::jsonb) from (
        select ho_ten, count(*)::int as so_viec,
               count(*) filter (where tinh_trang = 'xong_dung_han')::int as xong_dung_han,
               count(*) filter (where tinh_trang = 'xong_tre')::int as xong_tre,
               count(*) filter (where tinh_trang = 'chua_xong_qua_han')::int as chua_xong_qua_han,
               count(*) filter (where tinh_trang = 'chua_xong_con_han')::int as chua_xong_con_han
        from t group by ho_ten) g),
    'theo_khau', (select coalesce(jsonb_agg(to_jsonb(g) order by g.chua_xong_qua_han desc), '[]'::jsonb) from (
        select tab as khau, count(*)::int as so_viec,
               count(*) filter (where tinh_trang = 'chua_xong_qua_han')::int as chua_xong_qua_han,
               count(*) filter (where tinh_trang = 'chua_xong_con_han')::int as chua_xong_con_han
        from t group by tab) g),
    'viec', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select ho_ten, vai, tab as khau, ten_lop, ngay as ngay_buoi,
               to_char(han at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI') as han,
               to_char(dong_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI') as dong_luc,
               tinh_trang
        from loc order by han, ho_ten, ten_lop limit c_tran) r),
    'da_cat', (select count(*) > c_tran from loc),
    'ghi_chu', jsonb_build_array(
      'Việc suy từ PHÂN CÔNG LỚP × buổi thường đã mở (cùng nguồn với màn Việc của tôi và bảng hiệu suất). khau: danhgia · ingame (chấm bài trên lớp) · et · btvn · mt.',
      'Chưa gồm việc của Ops (điểm danh, report, báo tan, chuẩn bị phòng) và việc phát triển — việc phát triển hỏi công cụ viec_phat_trien.',
      'tong / theo_nguoi / theo_khau đếm TẤT CẢ trạng thái trong khoảng (không theo bộ lọc trang_thai) và không bị cắt; danh sách "viec" mới theo bộ lọc.',
      format('Danh sách "viec" cắt ở %s dòng, hạn cũ nhất trước. Bị cắt thì lọc thêm theo người hoặc lớp.', c_tran))
  ) into v;
  return v;
end $function$;

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
      (select count(*) filter (where d.so_dang_yeu > 0) from dau d where d.lop_id = lo.id) as hy_dau,
      (select count(*) filter (where d.so_dang_yeu > 0) from cuoi d where d.lop_id = lo.id) as hy_cuoi,
      (select count(*) from hs where hs.lop_id = lo.id) as si_so
    from lop_o lo
  ),
  co as (select exists (select 1 from dau) as co_dau, exists (select 1 from cuoi) as co_cuoi)
  select jsonb_build_object(
    'tu', p_tu, 'den', v_den, 'o', p_o, 'phien_ban', 1,
    'co_anh_dau', co.co_dau, 'co_anh_cuoi', co.co_cuoi,     -- false = chưa có ảnh (chưa chụp) ⇒ số dạng yếu / HS yếu tương ứng không áp dụng
    'tong', public._bctk_nhom(
        (select count(*) from et_viec), (select count(*) from et_viec e where e.dd is not null and e.dd <= e.han),
        (select count(*) from mx where mx.pha = 'et'), (select round(avg(mx.pct), 1) from mx where mx.pha = 'et'),
        (select count(*) from nop where nop.t <> 'xin_phep'), (select count(*) from nop where nop.t = 'nop_dung_han'),
        (select count(*) from nop where nop.t = 'nop_muon'),
        (select count(*) from mx where mx.pha = 'btvn'), (select round(avg(mx.pct), 1) from mx where mx.pha = 'btvn'),
        case when co.co_dau then (select coalesce(sum(so_dang_yeu), 0) from dau) end,
        case when co.co_cuoi then (select coalesce(sum(so_dang_yeu), 0) from cuoi) end,
        case when co.co_dau then (select count(*) from dau where so_dang_yeu > 0) end,
        case when co.co_cuoi then (select count(*) from cuoi where so_dang_yeu > 0) end,
        (select count(*) from hs))
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
            'hs_yeu_dau', case when co.co_dau then (select count(*) from dau where so_dang_yeu > 0) end,
            'hs_yeu_duoc_bt', case when co.co_dau then (select count(distinct bt.hoc_sinh_id) from bt join dau d on d.hoc_sinh_id = bt.hoc_sinh_id and d.so_dang_yeu > 0) end,
            'do_phu', case when co.co_dau then public._bctk_pct(
                (select count(distinct bt.hoc_sinh_id) from bt join dau d on d.hoc_sinh_id = bt.hoc_sinh_id and d.so_dang_yeu > 0),
                (select count(*) from dau where so_dang_yeu > 0)) end,
            'het_yeu_sau_ca', case when co.co_dau and co.co_cuoi then (
                select count(distinct bt.hoc_sinh_id) from bt
                  join dau d on d.hoc_sinh_id = bt.hoc_sinh_id and d.so_dang_yeu > 0
                  join cuoi c on c.hoc_sinh_id = bt.hoc_sinh_id and c.mon = d.mon and c.so_dang_yeu = 0) end)),
    'lop', (select coalesce(jsonb_agg(
              jsonb_build_object('lop_id', s.id, 'ten_lop', s.ten_lop, 'mon', s.mon, 'khoi', s.khoi)
              || public._bctk_nhom(s.et_viec, s.et_dung, s.et_luot, s.et_tb, s.bt_can, s.bt_dung, s.bt_muon, s.bt_luot, s.bt_tb,
                                   case when co.co_dau then coalesce(s.dy_dau, 0) end, case when co.co_cuoi then coalesce(s.dy_cuoi, 0) end,
                                   case when co.co_dau then s.hy_dau end, case when co.co_cuoi then s.hy_cuoi end, s.si_so)
              order by s.mon, coalesce(substring(s.khoi from '^[0-9]+')::int, 0), s.khoi, s.ten_lop), '[]'::jsonb) from lop_so s),
    -- 4. HS còn yếu cuối kỳ + trạng thái xử lý (chưa xử lý xếp đầu)
    'hs_con_yeu', (select coalesce(jsonb_agg(jsonb_build_object(
              'hoc_sinh_id', h.id, 'ho_ten', h.ho_ten, 'ten_lop', lo.ten_lop, 'mon', c.mon, 'so_dang_yeu', c.so_dang_yeu,
              'dang', (select coalesce(jsonb_agg(e->>'ten_dang'), '[]'::jsonb) from jsonb_array_elements(c.dang) e),
              'xu_ly', xl.xu_ly)
              order by (xl.xu_ly = 'chua') desc, c.so_dang_yeu desc, h.ho_ten), '[]'::jsonb)
            from cuoi c
            join hoc_sinh h on h.id = c.hoc_sinh_id
            join lop_o lo on lo.id = c.lop_id
            cross join lateral (select case
                when exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = c.hoc_sinh_id and y.mon = c.mon and y.trang_thai = 'dang_xu') then 'bo_tro_yeu'
                when exists (select 1 from bt where bt.hoc_sinh_id = c.hoc_sinh_id and bt.loai = 'bo_tro_nhe') then 'ca_nhe'
                when exists (select 1 from bo_tro_theo_doi t where t.hoc_sinh_id = c.hoc_sinh_id and t.mon = c.mon and t.trang_thai = 'theo_doi') then 'theo_doi'
                else 'chua' end as xu_ly) xl
           where c.so_dang_yeu > 0)
  ) into v
  from co;
  return v;
end $function$;

CREATE OR REPLACE FUNCTION public._phong_viec_ta_pv(p_ns uuid, p_lop uuid[])
 RETURNS TABLE(buoi_id uuid, ten_lop text, ngay date, tab text, han timestamp with time zone, dong_dau timestamp with time zone, trang_thai text, la_ton boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with moc as (
    select date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date as tu
  ),
  v as (
    select x.*, public._viec_dong_dau(x.buoi_id, x.tab, x.dong_at) as dd, x.ngay < m.tu as ton
      from moc m, public.fn_viec_buoi_thuong_lh(m.tu - 30, m.tu + 6) x
     where x.nhan_su_id = p_ns and x.vai = 'tg' and x.tab in ('btvn', 'et') and not (x.tab = 'et' and x.et_online)
       and (p_lop is null or x.lop_id = any(p_lop))
  )
  select v.buoi_id, v.ten_lop, v.ngay, v.tab, v.han, v.dd,
         case when v.dd is null and (v.han is null or v.han >= now()) then 'dang_lam'
              when v.dd is null then 'qua_han'
              when v.han is not null and v.dd > v.han then 'xong_tre'
              else 'xong' end,
         v.ton
    from v
   where not v.ton or (v.dd is null and v.han < now())   -- buổi cũ chỉ lấy việc TỒN
$function$;

CREATE OR REPLACE FUNCTION public.fn_hsta_task(p_tu date, p_den date, p_ns uuid DEFAULT NULL::uuid)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, dau_viec text, buoi_id uuid, ten_lop text, ngay date, han timestamp with time zone, dong_dau timestamp with time zone, dong_cuoi timestamp with time zone, so_mo_lai integer, tre_gio numeric, tru_tien_do integer, gay_chat_luong integer, gay_tre integer, tru_chat_luong integer, diem numeric, tinh boolean, ly_do_khong_tinh text, co text[], so_co_mat integer, so_kq integer, nop_dung_han integer, nop_muon integer, khong_lam integer, xin_phep integer, pct_dung_han numeric, pct_dung_han_lop_khac numeric, so_cau integer, o_can integer, o_cham integer, pct_o_cham numeric, so_hs_vang_co_diem integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
begin
  if not (public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with v as (
    select v.*, ns.ho_ten
    from public.fn_viec_buoi_thuong_lh(p_tu, p_den) v
    join nhan_su ns on ns.id = v.nhan_su_id
    where v.vai = 'tg' and v.tab in ('btvn', 'et') and not (v.tab = 'et' and v.et_online)
      and not ns.an_xep_hang
      -- CHỈ lớp được phân công TRỰC TIẾP (TA chính) — CEO 08/10; khớp cách Gậy chọn người chịu (la_chinh).
      -- Việc ĐÃ tới hạn: fn_viec_buoi_thuong_lh đã chọn đúng 1 TA (duy nhất / chính) LÚC HẠN — không xét lại theo
      -- phân công hiện tại (Thùy 04/11). Việc đóng sớm, chưa tới hạn: TA chính hiện tại như cũ.
      and (v.han <= now() or exists (select 1 from phan_cong_lop pc where pc.lop_id = v.lop_id and pc.nhan_su_id = v.nhan_su_id
                    and pc.vai_tro = 'tg' and pc.la_chinh))
      and (p_ns is null or v.nhan_su_id = p_ns)
      and (v.dong_at is not null or v.han <= now())   -- chưa tới hạn mà chưa đóng = chưa phải việc để đo
  ),
  t as materialized (
    select v.*,
      -- lần đóng ĐẦU TIÊN: lịch sử phase (từ 23/09) + giá trị cũ khi mở lại/đổi mốc; trước đó chỉ còn dong_at
      public._viec_dong_dau(v.buoi_id, v.tab, v.dong_at) as dd,
      (select count(*) from buoi_hoc_phase_log l where l.buoi_hoc_id = v.buoi_id and l.phase = v.tab and l.su_kien = 'mo_lai')::int as mo_lai,
      exists (select 1 from ta_vang tv where tv.buoi_hoc_id = v.buoi_id and tv.nhan_su_id = v.nhan_su_id) as vang,
      (select count(*) from gami_session_problems p where p.buoi_hoc_id = v.buoi_id and p.phase = v.tab and not p.hidden)::int as n_cau,
      (select coalesce(sum(g.so_gay), 0) from gay_ledger g left join gay_loi lo on lo.id = g.loi_id
        where g.ref_id = v.ref_key and g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
          and coalesce(lo.ma, '') <> 'cham_deadline')::int as g_cl,
      (select coalesce(sum(g.so_gay), 0) from gay_ledger g join gay_loi lo on lo.id = g.loi_id
        where g.ref_id = v.ref_key and g.thu_hoi_at is null and g.loai <> 'go' and g.so_gay > 0
          and lo.ma = 'cham_deadline')::int as g_tre,
      exists (select 1 from gay_de_xuat d where d.ref_key = v.ref_key and d.trang_thai = 'cho') as g_cho,
      (select count(*) from buoi_hoc_hs h where h.buoi_hoc_id = v.buoi_id and h.diem_danh = 'co_mat')::int as n_co_mat
    from v
  ),
  -- materialized: ước lượng 1 dòng từ hàm set-returning ⇒ planner lặp lại cả CTE cho MỖI task (đo: 474 × 50ms = 25s)
  btvn as materialized (
    select t.buoi_id, t.nhan_su_id,
      count(k.*)::int as kq,
      count(*) filter (where k.trang_thai_nop = 'nop_dung_han')::int as dung,
      count(*) filter (where k.trang_thai_nop = 'nop_muon')::int as muon,
      count(*) filter (where k.trang_thai_nop = 'khong_lam')::int as khong,
      count(*) filter (where k.trang_thai_nop = 'xin_phep')::int as phep
    from t join btvn_ket_qua k on k.buoi_hoc_id = t.buoi_id
    where t.tab = 'btvn' group by t.buoi_id, t.nhan_su_id
  ),
  -- nhân chứng độc lập: CHÍNH các em đó nộp đúng hạn bao nhiêu ở LỚP KHÁC (TA khác chấm), ±90 ngày
  btvn_lop_khac as materialized (
    select t.buoi_id, t.nhan_su_id,
      count(*) as n,
      count(*) filter (where k2.trang_thai_nop = 'nop_dung_han') as dung
    from t
    join btvn_ket_qua k on k.buoi_hoc_id = t.buoi_id
    join btvn_ket_qua k2 on k2.hoc_sinh_id = k.hoc_sinh_id and k2.trang_thai_nop is not null and k2.trang_thai_nop <> 'xin_phep'
    join buoi_hoc b2 on b2.id = k2.buoi_hoc_id and b2.lop_id <> t.lop_id and b2.ngay between t.ngay - 90 and t.ngay + 30
    where t.tab = 'btvn' group by t.buoi_id, t.nhan_su_id
  ),
  et as materialized (
    select t.buoi_id, t.nhan_su_id,
      (select count(*) from buoi_hoc_hs h join gami_session_problems p on p.buoi_hoc_id = t.buoi_id and p.phase = 'et' and not p.hidden
                                                                      and (p.hoc_sinh_id is null or p.hoc_sinh_id = h.hoc_sinh_id)
        where h.buoi_hoc_id = t.buoi_id and h.diem_danh = 'co_mat')::int as can,
      -- đi qua câu của buổi (index buoi_hoc_id, phase) → điểm theo problem_id; gami_grades không có index buoi_hoc_id
      (select count(*) from gami_session_problems p join gami_grades g on g.problem_id = p.id
                                         join buoi_hoc_hs h on h.buoi_hoc_id = t.buoi_id and h.hoc_sinh_id = g.hoc_sinh_id and h.diem_danh = 'co_mat'
        where p.buoi_hoc_id = t.buoi_id and p.phase = 'et' and not p.hidden)::int as cham,
      (select count(distinct g.hoc_sinh_id) from gami_session_problems p join gami_grades g on g.problem_id = p.id
        where p.buoi_hoc_id = t.buoi_id and p.phase = 'et'
          and not exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = t.buoi_id and h.hoc_sinh_id = g.hoc_sinh_id and h.diem_danh = 'co_mat'))::int as hs_vang_co_diem
    from t where t.tab = 'et'
  ),
  s as (
    select t.*,
      extract(epoch from (coalesce(t.dd, now()) - t.han)) / 3600 as tre,   -- trễ theo LẦN ĐÓNG ĐẦU (cùng cách hệ Gậy đo)
      -- TIẾN ĐỘ theo GẬY (CEO 08/10): CHỈ trừ khi có gậy Chậm deadline đã vào sổ; mức theo trễ lần đóng đầu.
      -- Gậy đã vào sổ mà lần đóng đầu đúng hạn (chốt trước khi sửa máy quét) ⇒ vẫn trừ mức thấp nhất + cờ để người chốt xem lại.
      case when t.g_tre > 0 then greatest(public._hsta_tru_tien_do((extract(epoch from (coalesce(t.dd, now()) - t.han)) / 3600)::numeric), 10) else 0 end as td,
      case when t.vang then 'TA vắng buổi này'
           when t.n_cau = 0 and t.g_tre + t.g_cl = 0 then case t.tab when 'btvn' then 'Buổi không có câu BTVN trên hệ thống' else 'Buổi không có câu ET trên hệ thống' end
           when t.han is null then 'Chưa xác định được hạn (không tìm thấy buổi kế tiếp)'
      end as khong_tinh
    from t
  )
  select s.nhan_su_id, s.ho_ten, s.tab, s.buoi_id, s.ten_lop, s.ngay,
    s.han, s.dd, s.dong_at, s.mo_lai,
    round(greatest(s.tre, 0)::numeric, 1),
    s.td,
    s.g_cl, s.g_tre,
    s.g_cl * public._hsta_tru_moi_gay(),
    case when s.khong_tinh is null
         then greatest(0, 100 - s.td - s.g_cl * public._hsta_tru_moi_gay())::numeric end,
    s.khong_tinh is null,
    s.khong_tinh,
    array_remove(array[
      case when s.dd is null then 'chua_dong' end,
      case when s.g_cho then 'gay_cho_chot' end,
      case when s.n_cau = 0 and s.g_tre + s.g_cl > 0 then 'khong_cau_co_gay' end,
      case when s.g_tre > 0 and s.dd is not null and s.dd <= s.han then 'gay_dau_dung_han' end,
      case when s.mo_lai > 0 then 'mo_lai' end,
      case when s.tab = 'btvn' and b.kq >= 3 and (b.muon + b.khong) * 1.0 / b.kq >= 0.4 then 'nop_muon_cao' end,
      case when s.tab = 'btvn' and b.kq >= 3 and lk.n >= 5
                and b.dung * 100.0 / b.kq < lk.dung * 100.0 / lk.n - 30 then 'lech_lop_khac' end,
      case when s.tab = 'btvn' and s.dd is not null and s.n_cau > 0 and coalesce(b.kq, 0) = 0 then 'dong_khong_du_lieu' end,
      case when s.tab = 'et' and s.dd is not null and s.n_cau > 0 and e.can > 0 and e.cham < e.can then 'et_thieu_o' end,
      case when s.tab = 'et' and s.dd is not null and s.n_cau = 0 then 'dong_khong_du_lieu' end,
      case when s.tab = 'et' and e.hs_vang_co_diem > 0 then 'hs_vang_co_diem' end
    ], null),
    s.n_co_mat,
    case when s.tab = 'btvn' then coalesce(b.kq, 0) end,
    b.dung, b.muon, b.khong, b.phep,
    case when b.kq > 0 then round(b.dung * 100.0 / b.kq, 0) end,
    case when lk.n >= 5 then round(lk.dung * 100.0 / lk.n, 0) end,
    s.n_cau,
    e.can, e.cham,
    case when e.can > 0 then round(e.cham * 100.0 / e.can, 0) end,
    e.hs_vang_co_diem
  from s
  left join btvn b on b.buoi_id = s.buoi_id and b.nhan_su_id = s.nhan_su_id
  left join btvn_lop_khac lk on lk.buoi_id = s.buoi_id and lk.nhan_su_id = s.nhan_su_id
  left join et e on e.buoi_id = s.buoi_id and e.nhan_su_id = s.nhan_su_id
  order by s.ho_ten, s.tab, s.ngay;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_hsta_gay(p_tu date, p_den date, p_ns uuid)
 RETURNS TABLE(nguon text, id uuid, trang_thai text, ma_loi text, ten_loi text, so_gay integer, tre_phut integer, ly_do text, ref_key text, nguoi text, tao_at timestamp with time zone, thu_hoi_at timestamp with time zone, gan_voi text, buoi_id uuid, ngay_task date, ten_lop text, tinh_vao text, ly_do_khong_tinh text)
 LANGUAGE plpgsql
 STABLE
AS $function$
#variable_conflict use_column
begin
  if not (public.co_chuc_nang('db_chatluong') or (p_ns is not null and public._phong_la_cap_duoi(p_ns))) then raise exception 'Không có quyền xem hiệu suất'; end if;
  return query
  with g as (
    select 'so'::text as nguon, l.id, case when l.thu_hoi_at is null then 'da_vao_so' else 'da_thu_hoi' end as tt,
      lo.ma, lo.ten, l.so_gay, d.tre_phut, coalesce(l.ly_do, l.ref_mo_ta) as ly_do, l.ref_id, n.ho_ten as nguoi,
      l.created_at, l.thu_hoi_at, l.ky
    from gay_ledger l left join gay_loi lo on lo.id = l.loi_id left join gay_de_xuat d on d.ledger_id = l.id
    left join nhan_su n on n.id = l.nguoi_tao
    where l.nhan_su_id = p_ns and l.loai <> 'go' and l.so_gay > 0
    union all
    select 'de_xuat', d.id, 'cho_chot', 'cham_deadline', 'Chậm deadline trên ERP (đề xuất)', d.so_gay, d.tre_phut, d.mo_ta, d.ref_key,
      null, d.created_at, null, date_trunc('month', coalesce(d.deadline_at, d.created_at) at time zone 'Asia/Ho_Chi_Minh')::date
    from gay_de_xuat d where d.nhan_su_id = p_ns and d.trang_thai = 'cho'
  ),
  x as (
    select g.*, split_part(g.ref_id, '|', 2) as tab, b.id as bid, b.ngay as bngay, b.loai as bloai, (select lp.ten_lop from lop lp where lp.id = b.lop_id) as tlop,
      -- TA chính LÚC HẠN (bản chụp, Thùy 04/11); chưa có bản chụp (chưa tới hạn) ⇒ phân công hiện tại như cũ
      case when exists (select 1 from viec_phu_trach_snap s where s.buoi_id = b.id and s.tab = split_part(g.ref_id, '|', 2))
           then exists (select 1 from viec_phu_trach_snap s where s.buoi_id = b.id and s.tab = split_part(g.ref_id, '|', 2) and s.nhan_su_id = p_ns)
           else exists (select 1 from phan_cong_lop pc where pc.lop_id = b.lop_id and pc.nhan_su_id = p_ns and pc.vai_tro = 'tg' and pc.la_chinh) end as ta_chinh
    from g left join buoi_hoc b
      on b.id = case when g.ref_id ~ '^vh:[0-9a-f-]{36}[|]' then substring(g.ref_id from 4 for 36)::uuid end
  )
  select x.nguon, x.id, x.tt, x.ma, x.ten, x.so_gay, coalesce(td.tre_phut, x.tre_phut), x.ly_do, x.ref_id, x.nguoi, x.created_at, x.thu_hoi_at,
    case when x.bid is null then 'ngoai_task'
         when x.bloai in ('bu', 'bo_tro_yeu', 'bo_tro_duoi') then 'bo_tro'
         when x.tab in ('btvn', 'et') then x.tab
         else 'khac_' || x.tab end,
    x.bid, x.bngay, x.tlop,
    case when x.tt <> 'da_vao_so' then null
         when x.bid is null or x.bloai <> 'thuong' or x.tab not in ('btvn', 'et') or not x.ta_chinh then null
         when x.ma = 'cham_deadline' then 'tien_do' else 'chat_luong' end,
    case when x.tt = 'cho_chot' then 'Đề xuất chưa được xác nhận'
         when x.tt = 'da_thu_hoi' then 'Đã thu hồi'
         when x.bid is null then 'Không gắn buổi học nào'
         when x.bloai <> 'thuong' then 'Gậy của ca bổ trợ — bổ trợ chấm tay'
         when x.tab not in ('btvn', 'et') then 'Không thuộc Chấm BTVN / Chấm ET'
         when not x.ta_chinh then 'Không phải lớp TA chính của người này'
    end
  from x
  left join lateral public.fn_viec_tien_do(array[x.ref_id]) td on x.ma = 'cham_deadline'
  where (x.bid is not null and x.bngay between p_tu and p_den)
     or (x.bid is null and x.ky between date_trunc('month', p_tu)::date and p_den)
  order by coalesce(x.bngay, x.ky), x.created_at;
end $function$;
