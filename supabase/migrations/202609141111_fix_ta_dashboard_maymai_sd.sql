-- ============================================================================
-- 202609141111 — fix_ta_dashboard_maymai_sd
-- ----------------------------------------------------------------------------
-- VÌ SAO: TA báo "Nhiệm vụ" (app Của tôi) và "May mắn" (vòng quay) đều lỗi
--   "permission denied for schema auth". Cùng nguyên nhân đã fix cho
--   fn_bt_phat_hanh_dang ở 202609131940: hàm gọi current_nhan_su_id() (bên trong
--   JOIN auth.users) mà THIẾU security definer → PostgREST chạy hàm với quyền
--   authenticated, không đủ USAGE schema auth. fn_ta_dashboard (07/09) và
--   fn_may_man_quay/fn_may_man_cua_toi (07/09) đều thiếu SD từ lúc viết — lỗi
--   luôn tồn tại, hôm nay mới được TA báo. Không phải do sửa mới hôm nay.
-- FIX: thêm `security definer` + `set search_path = public` cho cả 3 hàm, body
--   giữ nguyên 100% (chỉ replace, không đổi logic).
--
-- MẤT GÌ: không mất data, không đổi logic. Chỉ replace 3 function (thêm SD).
-- ============================================================================

create or replace function public.fn_ta_dashboard(p_ym text)
returns jsonb language plpgsql
security definer                                     -- ⭐ fix "permission denied for schema auth" (14/09)
set search_path = public
as $$
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

create or replace function public.fn_may_man_quay()
returns jsonb language plpgsql
security definer                                     -- ⭐ fix "permission denied for schema auth" (14/09)
set search_path = public
as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  p10 numeric; p20 numeric; p50 numeric; v_tran numeric; v_active numeric;
  v_rnd numeric; v_tien integer; v_da integer; v_vuot boolean := false; l may_man_luot;
begin
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  perform pg_advisory_xact_lock(hashtext('maymai:' || v_me::text));
  select gia_tri into v_active from may_man_cau_hinh where ma = 'active';
  if coalesce(v_active, 0) <> 1 then raise exception 'Vòng quay đang tạm đóng.'; end if;
  if exists (select 1 from may_man_luot where nhan_su_id = v_me and ngay = v_today) then
    raise exception 'Hôm nay bạn đã quay rồi — mai quay tiếp nhé!'; end if;
  select gia_tri into p10 from may_man_cau_hinh where ma = 'ti_le_10k';
  select gia_tri into p20 from may_man_cau_hinh where ma = 'ti_le_20k';
  select gia_tri into p50 from may_man_cau_hinh where ma = 'ti_le_50k';
  select gia_tri into v_tran from may_man_cau_hinh where ma = 'tran_thang';
  v_rnd := random() * 100;
  -- giải hiếm xét trước: [0,p50) → 50k · [p50, p50+p20) → 20k · [p50+p20, p50+p20+p10) → 10k · còn lại 0
  v_tien := case when v_rnd < p50 then 50000 when v_rnd < p50 + p20 then 20000 when v_rnd < p50 + p20 + p10 then 10000 else 0 end;
  select coalesce(sum(tien), 0) into v_da from may_man_luot
    where ngay >= date_trunc('month', v_today)::date and ngay < (date_trunc('month', v_today) + interval '1 month')::date;
  if v_tien > 0 and v_da + v_tien > v_tran then v_vuot := true; v_tien := 0; end if;
  insert into may_man_luot (nhan_su_id, ngay, tien, rnd, vuot_tran) values (v_me, v_today, v_tien, v_rnd, v_vuot) returning * into l;
  return jsonb_build_object('id', l.id, 'ngay', l.ngay, 'tien', l.tien, 'vuot_tran', l.vuot_tran);
end $$;
grant execute on function public.fn_may_man_quay() to authenticated;
revoke execute on function public.fn_may_man_quay() from anon;

create or replace function public.fn_may_man_cua_toi()
returns jsonb language plpgsql stable
security definer                                     -- ⭐ fix "permission denied for schema auth" (14/09)
set search_path = public
as $$
declare
  v_me uuid := public.current_nhan_su_id();
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_dau date; v_cuoi date; v_hom_nay jsonb; v_toi integer; v_bk integer; v_tran numeric; v_active numeric; v_ls jsonb;
begin
  if v_me is null then raise exception 'Không xác định được nhân sự.'; end if;
  v_dau := date_trunc('month', v_today)::date; v_cuoi := (v_dau + interval '1 month')::date;
  select to_jsonb(x) into v_hom_nay from (select tien, vuot_tran, created_at from may_man_luot where nhan_su_id = v_me and ngay = v_today) x;
  select coalesce(sum(tien), 0) into v_toi from may_man_luot where nhan_su_id = v_me and ngay >= v_dau and ngay < v_cuoi;
  select coalesce(sum(tien), 0) into v_bk from may_man_luot where ngay >= v_dau and ngay < v_cuoi;
  select gia_tri into v_tran from may_man_cau_hinh where ma = 'tran_thang';
  select gia_tri into v_active from may_man_cau_hinh where ma = 'active';
  select coalesce(jsonb_agg(jsonb_build_object('ho_ten', ns.ho_ten, 'anh_url', ns.anh_url, 'tien', l.tien, 'created_at', l.created_at, 'la_toi', l.nhan_su_id = v_me) order by l.created_at desc), '[]'::jsonb)
    into v_ls
  from (select * from may_man_luot order by created_at desc limit 10) l join nhan_su ns on ns.id = l.nhan_su_id;
  return jsonb_build_object(
    'ngay', v_today, 'active', coalesce(v_active, 0) = 1, 'hom_nay', v_hom_nay,
    'thang', jsonb_build_object('toi', v_toi, 'bk', v_bk, 'tran', v_tran),
    'ti_le', (select jsonb_object_agg(ma, gia_tri) from may_man_cau_hinh where ma like 'ti_le_%'),
    'lich_su', v_ls);
end $$;
grant execute on function public.fn_may_man_cua_toi() to authenticated;
revoke execute on function public.fn_may_man_cua_toi() from anon;
