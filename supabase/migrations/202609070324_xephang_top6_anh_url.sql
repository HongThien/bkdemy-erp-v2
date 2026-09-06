-- Xếp hạng: top 3 → TOP 6 + avatar thật (CEO 07/09: "bên dưới bục trao giải hiện thông số của top 4-6",
-- màn Xếp hạng theo ảnh gốc có danh sách hạng 4..6 với avatar). Đè lại 4 hàm y nguyên bản
-- 202609062344 (fn_ta_dashboard · fn_gv_dashboard · fn_ops_dashboard · fn_xephang_chung), chỉ đổi:
--   · v_top: limit 3 → limit 6, kèm 'anh_url' (join nhan_su theo nhan_su_id; alias k để không mơ hồ
--     với cột ho_ten/an_xep_hang cùng tên bên nhan_su).
-- Mọi luật khác (ngưỡng ≥20 việc chính thức / top 10 khối lượng tạm thời, sắp theo pct desc, dat desc)
-- GIỮ NGUYÊN. Client chỉ render: top[0..2] lên bục, top[3..5] danh sách dưới bục (§2.0).

create or replace function public.fn_ta_dashboard(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date;
  c_nguong_cl constant numeric := 80;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer; v_items jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;

  create temp table _ta_items on commit drop as
  select * from public.fn_ta_viec_thang(v_tu, v_den);

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

  drop table _ta_items, _ta_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'items', v_items, 'nguongChatLuong', c_nguong_cl,
    'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top);
end $$;
grant execute on function public.fn_ta_dashboard(text) to authenticated;
revoke execute on function public.fn_ta_dashboard(text) from anon;

create or replace function public.fn_gv_dashboard(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer; v_items jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;

  create temp table _gv_items on commit drop as
  select * from public.fn_gv_viec_thang(v_tu, v_den);

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

  drop table _gv_items, _gv_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'items', v_items, 'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top);
end $$;
grant execute on function public.fn_gv_dashboard(text) to authenticated;
revoke execute on function public.fn_gv_dashboard(text) from anon;

create or replace function public.fn_ops_dashboard(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date;
  c_nguong_cl constant numeric := 80;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer; v_items jsonb;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;

  create temp table _ops_items on commit drop as
  select * from public.fn_ops_viec_thang(v_tu, v_den);

  create temp table _ops_tk on commit drop as
  select nhan_su_id, ho_ten, an_xep_hang,
    count(*) as tong,
    count(*) filter (where kq = 'cho') as cho,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    count(*) filter (where kq = 'khong_dat') as khong_dat,
    (case when count(*) filter (where kq <> 'cho') = 0 then null
          else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end) as pct,
    row_number() over (order by count(*) filter (where kq <> 'cho') desc, ho_ten) as vol_rank
  from _ops_items group by nhan_su_id, ho_ten, an_xep_hang;

  select to_jsonb(x) into v_me_row from (
    select tong, cho, den_han, dat, khong_dat, pct,
      (not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) as du_dieu_kien_xep_hang
    from _ops_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong from _ops_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top);
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _ops_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) r
  where r.nhan_su_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han, 'anh_url', anh_url) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select k.ho_ten, k.pct, k.dat, k.den_han, ns.anh_url from _ops_tk k join public.nhan_su ns on ns.id = k.nhan_su_id
        where not k.an_xep_hang and (k.den_han >= c_nguong_rank_final or k.vol_rank <= c_nguong_rank_top)
        order by k.pct desc, k.dat desc, k.ho_ten limit 6) t;

  select coalesce(jsonb_agg(jsonb_build_object('ten_lop', ten_viec, 'ngay', ngay, 'tab', tab, 'kq', kq, 'ly_do', ly_do) order by ngay desc), '[]'::jsonb)
    into v_items
  from (select ten_viec, ngay, tab, kq, ly_do from _ops_items
        where nhan_su_id = v_me and kq in ('dat', 'khong_dat') order by ngay desc limit 200) x;

  drop table _ops_items, _ops_tk;
  return jsonb_build_object(
    'ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'items', v_items, 'nguongChatLuong', c_nguong_cl,
    'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top);
end $$;
comment on function public.fn_ops_dashboard(text) is
  'Của tôi — app OPS. 4 việc: report/báo tan/prep/coi test. Cùng khuôn fn_ta_dashboard (bar+4số+xếp hạng riêng+items).';
grant execute on function public.fn_ops_dashboard(text) to authenticated;
revoke execute on function public.fn_ops_dashboard(text) from anon;

-- ────────────────────────────────────────────────────────────────────────────
-- G) XẾP HẠNG CHUNG (toàn bộ nhân sự BK, gộp mọi vai trò 1 người đang có) — % đạt
--    chuẩn, cùng ngưỡng ≥20 CHÍNH THỨC / TOP 10 khối lượng TẠM THỜI. Gộp 3 nguồn
--    fn_*_viec_thang (đã áp gậy-override) — 1 người vừa TA vừa GV thì CỘNG dat/
--    den_han của cả 2 vai trước khi tính %.
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_xephang_chung(p_ym text)
returns jsonb language plpgsql as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tu date; v_den date;
  c_nguong_rank_final constant integer := 20;
  c_nguong_rank_top constant integer := 10;
  v_me_row jsonb; v_top jsonb; v_rank integer; v_tong integer;
begin
  if p_ym !~ '^\d{4}-\d{2}$' then raise exception 'p_ym phải dạng YYYY-MM'; end if;
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;

  create temp table _chung_tk on commit drop as
  with gop as (
    select nhan_su_id, kq from public.fn_ta_viec_thang(v_tu, v_den)
    union all
    select nhan_su_id, kq from public.fn_gv_viec_thang(v_tu, v_den)
    union all
    select nhan_su_id, kq from public.fn_ops_viec_thang(v_tu, v_den)
  )
  select g.nhan_su_id, ns.ho_ten, ns.an_xep_hang,
    count(*) filter (where kq <> 'cho') as den_han,
    count(*) filter (where kq = 'dat') as dat,
    (case when count(*) filter (where kq <> 'cho') = 0 then null
          else round(100.0 * count(*) filter (where kq = 'dat') / count(*) filter (where kq <> 'cho')) end) as pct,
    row_number() over (order by count(*) filter (where kq <> 'cho') desc, ns.ho_ten) as vol_rank
  from gop g join nhan_su ns on ns.id = g.nhan_su_id
  group by g.nhan_su_id, ns.ho_ten, ns.an_xep_hang;

  select to_jsonb(x) into v_me_row from (
    select den_han, dat, pct,
      (not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) as du_dieu_kien_xep_hang
    from _chung_tk where nhan_su_id = v_me) x;

  select count(*) into v_tong from _chung_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top);
  select r.rk into v_rank from (
    select nhan_su_id, row_number() over (order by pct desc, dat desc, ho_ten) as rk
    from _chung_tk where not an_xep_hang and (den_han >= c_nguong_rank_final or vol_rank <= c_nguong_rank_top)) r
  where r.nhan_su_id = v_me;

  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ho_ten, 'pct', pct, 'dat', dat, 'den_han', den_han, 'anh_url', anh_url) order by pct desc, dat desc, ho_ten), '[]'::jsonb)
    into v_top
  from (select k.ho_ten, k.pct, k.dat, k.den_han, ns.anh_url from _chung_tk k join public.nhan_su ns on ns.id = k.nhan_su_id
        where not k.an_xep_hang and (k.den_han >= c_nguong_rank_final or k.vol_rank <= c_nguong_rank_top)
        order by k.pct desc, k.dat desc, k.ho_ten limit 6) t;

  drop table _chung_tk;
  return jsonb_build_object('ym', p_ym, 'me', coalesce(v_me_row, '{}'::jsonb), 'rank', v_rank, 'tongXepHang', v_tong,
    'top', v_top, 'nguongRankFinal', c_nguong_rank_final, 'nguongRankTop', c_nguong_rank_top);
end $$;
comment on function public.fn_xephang_chung(text) is
  'Bảng xếp hạng CHUNG toàn công ty (mọi vai trò TA/GV/OPS gộp lại theo nhan_su_id) — % đạt chuẩn, ngưỡng ≥20 việc/tháng CHÍNH THỨC hoặc TOP 10 khối lượng TẠM THỜI.';
grant execute on function public.fn_xephang_chung(text) to authenticated;
revoke execute on function public.fn_xephang_chung(text) from anon;
