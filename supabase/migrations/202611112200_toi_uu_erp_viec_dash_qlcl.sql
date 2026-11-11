-- ============================================================================
-- toi_uu_erp_viec_dash_qlcl — audit timeout 11/11 (reports/audit-timeout-11-11.md), CLAUDE.md §2.0
-- "GỌI ĐÚNG CÁI ĐANG HIỆN · SỐ KHÔNG REALTIME THÌ TÍNH SẴN". Không đổi nghĩa con số; so cũ–mới trong ROLLBACK 5 tài khoản, 0 lệch.
--  ① Index cho các lượt tra theo (lớp, ngày) mà fn_viec_buoi_thuong / _lh / fn_han_viec chạy cho TỪNG buổi (trước quét cả bảng mỗi buổi).
--  ② fn_bao_sai_cho_duyet_cua_toi: "Duyệt báo sai" trong Việc của tôi gom ở DB (thay select lồng 3 tầng + gom ở client).
--  ③ Dashboard TA/GV: số cả tháng của MỌI người (xếp hạng) đọc từ bảng tính sẵn dash_viec_thang_luu (làm mới ≤10 phút,
--     cron giữ nóng tháng hiện tại) — trước: mỗi lượt mở tính lại toàn bộ việc tháng của mọi TA/GV (~35k block/lượt → ~1k).
--  ④ fn_qlcl_tong_quan: mỗi ô quét danh sách em 1 lần thay 5 lần (~32k → ~2,8k block với Giám đốc), cùng số.
--  ⑤ _qlcl_lam_moi_nen: làm mới NỀN số dạng yếu lưu sẵn (pg_cron, file _cron_sql_editor cùng tên) — widget không còn tự chạy
--     fn_qlcl_lam_moi qua mọi ô mỗi lần mở. fn_btyeu_dang_yeu_2_cua_so_moi chỉ thêm "hoặc tác vụ nền" vào điều kiện vào.
-- ============================================================================

-- ① Index
create index if not exists tai_lieu_mt_buoi_idx on public.tai_lieu (lop_id, ngay) where loai = 'mt_buoi';
create index if not exists bai_test_et_lop_ngay_idx on public.bai_test (lop_id, ngay) where loai = 'et';
create index if not exists thoi_khoa_bieu_lop_idx on public.thoi_khoa_bieu (lop_id);
create index if not exists linkgen_jobs_status_idx on public.linkgen_jobs (status);   -- màn Kho đọc status in (pending, processing, failed)

-- ② Báo sai chờ duyệt của tôi
create or replace function public.fn_bao_sai_cho_duyet_cua_toi()
 returns table(lop_id uuid, ngay date, so_bao integer, bao_dau timestamptz)
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  -- 11/11 (audit timeout): "Duyệt báo sai" trong Việc của tôi — DB gom report `moi` theo (lớp × ngày) đúng các lớp tôi là TA (vai tg).
  -- Thay select lồng 3 tầng qua PostgREST (RLS chạy từng dòng, 410 ms/lượt) + gom ở client.
  select bt.lop_id, bt.ngay, count(*)::int, min(r.created_at)
    from bai_test_report r
    join bai_lam_cau blc on blc.id = r.bai_lam_cau_id
    join bai_test_cau c on c.id = blc.bai_test_cau_id
    join bai_test bt on bt.id = c.bai_test_id
   where r.trang_thai = 'moi'
     and bt.lop_id in (select pc.lop_id from phan_cong_lop pc where pc.nhan_su_id = public.current_nhan_su_id() and pc.vai_tro = 'tg')
     and public.la_thanh_vien()
   group by bt.lop_id, bt.ngay
$function$;
revoke execute on function public.fn_bao_sai_cho_duyet_cua_toi() from public, anon;
grant execute on function public.fn_bao_sai_cho_duyet_cua_toi() to authenticated;

-- ③ Dashboard TA/GV đọc bảng tính sẵn
create table if not exists public.dash_viec_thang_luu (
  loai     text not null check (loai in ('ta', 'gv')),
  ym       text not null check (ym ~ '^\d{4}-\d{2}$'),
  tinh_luc timestamptz not null,
  dong     jsonb not null,            -- đúng các dòng fn_ta_viec_thang / fn_gv_viec_thang trả lúc tinh_luc
  primary key (loai, ym)
);
alter table public.dash_viec_thang_luu enable row level security;   -- chỉ đọc/ghi qua _dash_viec_thang (security definer)

create or replace function public._dash_viec_thang(p_loai text, p_ym text, p_cu_phut integer default 10)
 returns table(nhan_su_id uuid, ho_ten text, an_xep_hang boolean, ten_lop text, ngay date, tab text, kq text, ly_do text, tinh_luc timestamptz)
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_tu date; v_den date; v_luc timestamptz; v_dong jsonb;
begin
  if not (public.la_thanh_vien() or public._la_tac_vu_nen()) then return; end if;
  if p_loai not in ('ta', 'gv') or p_ym !~ '^\d{4}-\d{2}$' then raise exception 'tham số sai'; end if;
  select l.tinh_luc, l.dong into v_luc, v_dong from dash_viec_thang_luu l where l.loai = p_loai and l.ym = p_ym;
  if v_luc is null or v_luc < now() - make_interval(mins => greatest(p_cu_phut, 0)) then
    v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;
    if p_loai = 'ta' then
      select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) into v_dong from public.fn_ta_viec_thang(v_tu, v_den) x;
    else
      select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) into v_dong from public.fn_gv_viec_thang(v_tu, v_den) x;
    end if;
    v_luc := now();
    insert into dash_viec_thang_luu (loai, ym, tinh_luc, dong) values (p_loai, p_ym, v_luc, v_dong)
      on conflict (loai, ym) do update set tinh_luc = excluded.tinh_luc, dong = excluded.dong;
  end if;
  return query select r.nhan_su_id, r.ho_ten, r.an_xep_hang, r.ten_lop, r.ngay, r.tab, r.kq, r.ly_do, v_luc
    from jsonb_to_recordset(v_dong) as r(nhan_su_id uuid, ho_ten text, an_xep_hang boolean, ten_lop text, ngay date, tab text, kq text, ly_do text);
end $function$;
revoke execute on function public._dash_viec_thang(text, text, integer) from public, anon;
grant execute on function public._dash_viec_thang(text, text, integer) to authenticated;
CREATE OR REPLACE FUNCTION public.fn_ta_dashboard(p_ym text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date;
  c_nguong_cl constant numeric := 80;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_luc timestamptz; v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer; v_items jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;

  create temp table _ta_items on commit drop as
  select * from public._dash_viec_thang('ta', p_ym);   -- 11/11: đọc bảng tính sẵn (≤10 phút), không tính lại cả tháng mọi người mỗi lượt mở

  create temp table _ta_tk on commit drop as
  select nhan_su_id, ho_ten, an_xep_hang,
    count(*) as tong,
    count(*) filter (where kq = 'cho') as cho,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    count(*) filter (where kq = 'khong_dat') as khong_dat,
    (case when count(*) filter (where kq <> 'cho') = 0 then null
          else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end) as pct,
    row_number() over (order by count(*) filter (where kq <> 'cho') desc, ho_ten) as vol_rank
  from _ta_items group by nhan_su_id, ho_ten, an_xep_hang;

  select to_jsonb(x) into v_me_row from (
    select tong, cho, den_han, dat, khong_dat, pct,
      (pct = 100 and den_han >= c_nguong_rank_final) as dat_moc_thuong,
      (not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) as du_dieu_kien_xep_hang
    from _ta_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong from _ta_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top);
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _ta_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) r
  where r.nhan_su_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han, 'anh_url', anh_url) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select k.ho_ten, k.pct, k.dat, k.den_han, ns.anh_url from _ta_tk k join public.nhan_su ns on ns.id = k.nhan_su_id
        where not k.an_xep_hang and (k.den_han >= c_nguong_rank_final or k.vol_rank <= c_nguong_rank_top)
        order by k.pct desc, k.dat desc, k.ho_ten limit 6) t;

  select coalesce(jsonb_agg(jsonb_build_object('ten_lop', ten_lop, 'ngay', ngay, 'tab', tab, 'kq', kq, 'ly_do', ly_do) order by ngay desc), '[]'::jsonb)
    into v_items
  from (select ten_lop, ngay, tab, kq, ly_do from _ta_items
        where nhan_su_id = v_me and kq in ('dat', 'khong_dat') order by ngay desc limit 100) x;

  select max(tinh_luc) into v_luc from _ta_items;
  drop table _ta_items, _ta_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'items', v_items, 'nguongChatLuong', c_nguong_cl,
    'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top,
    'tinhLuc', coalesce(v_luc, now()));
end $function$
;
CREATE OR REPLACE FUNCTION public.fn_gv_dashboard(p_ym text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_luc timestamptz; v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer; v_items jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;

  create temp table _gv_items on commit drop as
  select * from public._dash_viec_thang('gv', p_ym);   -- 11/11: đọc bảng tính sẵn (≤10 phút), không tính lại cả tháng mọi người mỗi lượt mở

  create temp table _gv_tk on commit drop as
  select nhan_su_id, ho_ten, an_xep_hang,
    count(*) as tong,
    count(*) filter (where kq = 'cho') as cho,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    count(*) filter (where kq = 'khong_dat') as khong_dat,
    (case when count(*) filter (where kq <> 'cho') = 0 then null
          else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end) as pct,
    row_number() over (order by count(*) filter (where kq <> 'cho') desc, ho_ten) as vol_rank
  from _gv_items group by nhan_su_id, ho_ten, an_xep_hang;

  select to_jsonb(x) into v_me_row from (
    select tong, cho, den_han, dat, khong_dat, pct,
      (not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) as du_dieu_kien_xep_hang
    from _gv_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong from _gv_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top);
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _gv_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) r
  where r.nhan_su_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han, 'anh_url', anh_url) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select k.ho_ten, k.pct, k.dat, k.den_han, ns.anh_url from _gv_tk k join public.nhan_su ns on ns.id = k.nhan_su_id
        where not k.an_xep_hang and (k.den_han >= c_nguong_rank_final or k.vol_rank <= c_nguong_rank_top)
        order by k.pct desc, k.dat desc, k.ho_ten limit 6) t;

  select coalesce(jsonb_agg(jsonb_build_object('ten_lop', ten_lop, 'ngay', ngay, 'tab', tab, 'kq', kq, 'ly_do', ly_do) order by ngay desc), '[]'::jsonb)
    into v_items
  from (select ten_lop, ngay, tab, kq, ly_do from _gv_items
        where nhan_su_id = v_me and kq in ('dat', 'khong_dat') order by ngay desc limit 100) x;

  select max(tinh_luc) into v_luc from _gv_items;
  drop table _gv_items, _gv_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'items', v_items, 'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top,
    'tinhLuc', coalesce(v_luc, now()));
end $function$
;

-- ④ Tổng quan QLCL
CREATE OR REPLACE FUNCTION public.fn_qlcl_tong_quan()
 RETURNS TABLE(mon text, khoi text, vai text, so_hs integer, so_hs_yeu integer, so_dang_yeu integer, so_can_tinh integer, tinh_at timestamp with time zone, dau_tuan_hs_yeu integer, dau_tuan_dang_yeu integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- 11/11 (audit timeout): CÙNG số bản cũ — bản cũ gọi _qlcl_hs_cua_o 4 lần + _qlcl_hs_can_tinh 1 lần cho MỖI ô (Giám đốc ~20 ô);
  -- giờ mỗi ô quét danh sách em đúng 1 lần, đếm cả 5 số trên cùng lượt đó. Luật "em cần tính lại" giữ nguyên chữ của _qlcl_hs_can_tinh.
  with p as materialized (select * from public.fn_pham_vi_cua_toi() where public.la_thanh_vien()),
  moc as materialized (select public._btyeu_moc_2_cua_so() as m, public._qlcl_tuan_nay() as tuan),
  dt as materialized (
    select z.mon, z.khoi, count(*) filter (where z.so_dang_yeu > 0)::int as hs_yeu, coalesce(sum(z.so_dang_yeu), 0)::int as dang_yeu
      from dang_yeu_dau_tuan z, moc where z.tuan = moc.tuan group by z.mon, z.khoi
  ),
  dt_mon as materialized (select distinct z.mon from dang_yeu_dau_tuan z, moc where z.tuan = moc.tuan),
  s as (
    select p.mon, p.khoi, p.vai,
           count(*)::int as so_hs,
           count(*) filter (where d.so_dang_yeu > 0)::int as so_hs_yeu,
           coalesce(sum(d.so_dang_yeu), 0)::int as so_dang_yeu,
           count(*) filter (where d.hoc_sinh_id is null
                               or d.moc <> moc.m
                               or d.tinh_at < now() - interval '12 hours'
                               or exists (select 1 from gami_grades g where g.hoc_sinh_id = h.hoc_sinh_id and g.graded_at > d.tinh_at))::int as so_can_tinh,
           max(d.tinh_at) as tinh_at
      from p
      cross join moc
      join lateral public._qlcl_hs_cua_o(p.mon, p.khoi) h on true
      left join dang_yeu_hien_tai d on d.mon = p.mon and d.hoc_sinh_id = h.hoc_sinh_id
     group by p.mon, p.khoi, p.vai
  )
  select p.mon, p.khoi, p.vai,
         coalesce(s.so_hs, 0), coalesce(s.so_hs_yeu, 0), coalesce(s.so_dang_yeu, 0), coalesce(s.so_can_tinh, 0), s.tinh_at,
         case when exists (select 1 from dt_mon where dt_mon.mon = p.mon) then coalesce((select dt.hs_yeu from dt where dt.mon = p.mon and dt.khoi = p.khoi), 0) end,
         case when exists (select 1 from dt_mon where dt_mon.mon = p.mon) then coalesce((select dt.dang_yeu from dt where dt.mon = p.mon and dt.khoi = p.khoi), 0) end
    from p left join s on s.mon = p.mon and s.khoi = p.khoi
   order by p.mon, p.khoi
$function$;

-- ⑤ Làm mới nền dạng yếu
CREATE OR REPLACE FUNCTION public.fn_btyeu_dang_yeu_2_cua_so_moi(p_hs uuid, p_mon text)
 RETURNS TABLE(ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not (public.la_thanh_vien() or public._la_tac_vu_nen()) or v_bd is null then return; end if;   -- 11/11: cho phép tác vụ nền (_qlcl_lam_moi_nen, pg_cron)
  if public._mastery_theo_lan_bat() then
    -- 10/11: theo NHÓM yếu (_btyeu_dang_theo_nhom)
    return query select d.ma_dang, d.ten_dang, d.score, d.n from public._btyeu_dang_theo_nhom(array[p_hs], p_mon, null, v_moc, null) d;
  else
  return query execute format($q$
    select m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells_bdm(array[$1]::uuid[], true) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
    where m.muc = 'yeu'
      -- 12/10: "có đo gần đây" tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — phân giải 1 lần cho mỗi cặp câu–mã chép
      and m.ma_dang in (select public._do_o_bdm(d.ma_cau, d.ma_dang)
                        from (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                              left join buoi_hoc b on b.id = g.buoi_hoc_id
                              where g.hoc_sinh_id = $1 and p.ma_dang is not null and coalesce(b.ngay, g.graded_at::date) >= $2) d)
    order by (m.n >= 3) desc, m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon;
  end if;
  -- 14/10: dạng = bài mô hình Hình (ma_dang = hinh_baitoan.ma) — yếu + có đo trong 2 cửa sổ gần nhất, cùng luật "cứ yếu là bổ trợ".
  return query
    select hb.ma::text, public._kho_ten_dang(p_mon, hb.ma)::text, h.score::numeric, h.n::integer
    from public.fn_mastery_cells_hinh(array[p_hs], true) h
    join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = p_mon
    where h.muc = 'yeu'
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = p_hs and p.hinh_baitoan_id = hb.id and coalesce(b.ngay, g.graded_at::date) >= v_moc)
    order by (h.n >= 2) desc, h.score;
end $function$
;
create or replace function public._qlcl_lam_moi_nen(p_ngan_giay integer default 25)
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
-- 11/11 (audit timeout): làm mới NỀN số dạng yếu lưu sẵn (dang_yeu_hien_tai) cho MỌI ô (môn × khối đang học) — thay cho việc mỗi lần
-- nhân sự mở widget là client tự gọi fn_qlcl_lam_moi qua mọi ô trong phạm vi. Cùng công thức + cùng luật "em cần tính lại" (_qlcl_hs_can_tinh),
-- em cũ nhất trước, tính xong em nào lưu em đó, hết ngân sách giây thì dừng (lượt sau tính tiếp). Chỉ chạy ở tác vụ nền (pg_cron / SQL Editor).
declare
  v_bd timestamptz := clock_timestamp();
  v_moc date := public._btyeu_moc_2_cua_so();
  v_n int := 0;
  v_dang jsonb;
  r record;
begin
  if not public._la_tac_vu_nen() then raise exception 'Chỉ tác vụ nền.'; end if;
  for r in
    select o.mon, h.hoc_sinh_id, d.tinh_at
      from (select distinct l.mon, l.khoi from lop l where l.trang_thai = 'dang_hoc' and l.khoi is not null and l.mon is not null) o
      cross join lateral public._qlcl_hs_can_tinh(o.mon, o.khoi) h
      left join dang_yeu_hien_tai d on d.mon = o.mon and d.hoc_sinh_id = h.hoc_sinh_id
     group by o.mon, h.hoc_sinh_id, d.tinh_at          -- 1 em học 2 lớp cùng môn khác khối ⇒ tính 1 lần
     order by d.tinh_at nulls first
  loop
    exit when clock_timestamp() - v_bd > make_interval(secs => p_ngan_giay);
    select coalesce(jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'ten_dang', x.ten_dang, 'score', round(x.score, 2), 'n', x.n) order by x.score), '[]'::jsonb)
      into v_dang from public.fn_btyeu_dang_yeu_2_cua_so_moi(r.hoc_sinh_id, r.mon) x;
    insert into dang_yeu_hien_tai (mon, hoc_sinh_id, so_dang_yeu, dang, moc, tinh_at)
      values (r.mon, r.hoc_sinh_id, jsonb_array_length(v_dang), v_dang, v_moc, now())
      on conflict (mon, hoc_sinh_id) do update set so_dang_yeu = excluded.so_dang_yeu, dang = excluded.dang, moc = excluded.moc, tinh_at = excluded.tinh_at;
    v_n := v_n + 1;
  end loop;
  return v_n;
end $function$;
revoke execute on function public._qlcl_lam_moi_nen(integer) from public, anon, authenticated;
