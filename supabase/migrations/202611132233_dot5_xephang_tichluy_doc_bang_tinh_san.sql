-- ĐỢT 5 (làm sớm, 13/11/2026): xếp hạng chung + tích luỹ của dashboard nhân sự đọc BẢNG TÍNH SẴN việc tháng (spec-kien-truc.md K2 — hàm client gọi không được tính cả hệ).
-- Trước: mỗi lượt mở Dash TA / GV / OPS, fn_xephang_chung và fn_tich_luy (qua _tich_luy_cua) tính lại việc cả tháng của MỌI nhân sự (3,2–3,4 s, tăng dần theo ngày trong tháng).
-- Sau: đọc dash_viec_thang_luu qua _dash_viec_thang (số cũ tối đa 10 phút — cùng nguồn fn_ta_dashboard / fn_gv_dashboard đang dùng); thêm loại 'ops' vào bảng tính sẵn.
do $g$
begin
  if (select md5(p.prosrc) from pg_proc p where p.oid = '_dash_viec_thang(text,text,integer)'::regprocedure) is distinct from '1152c246f23afd5e9f51046211630b31' then raise exception '% đã đổi từ lúc sinh migration — sinh lại', '_dash_viec_thang(text,text,integer)'; end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_xephang_chung(text)'::regprocedure) is distinct from 'e003b9b36f64caa0504689aec0f98ce6' then raise exception '% đã đổi từ lúc sinh migration — sinh lại', 'fn_xephang_chung(text)'; end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = '_tich_luy_cua(uuid,text)'::regprocedure) is distinct from 'bf446868adcc6ad16682ff0e8f77634e' then raise exception '% đã đổi từ lúc sinh migration — sinh lại', '_tich_luy_cua(uuid,text)'; end if;
end
$g$;

-- nới CHECK cho loại mới (CLAUDE.md §2.1: thêm giá trị vào cột trạng thái/loại phải nới CHECK đi kèm)
alter table public.dash_viec_thang_luu drop constraint dash_viec_thang_luu_loai_check;
alter table public.dash_viec_thang_luu add constraint dash_viec_thang_luu_loai_check check (loai = any (array['ta'::text, 'gv'::text, 'ops'::text]));

CREATE OR REPLACE FUNCTION public._dash_viec_thang(p_loai text, p_ym text, p_cu_phut integer DEFAULT 10)
 RETURNS TABLE(nhan_su_id uuid, ho_ten text, an_xep_hang boolean, ten_lop text, ngay date, tab text, kq text, ly_do text, tinh_luc timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_tu date; v_den date; v_luc timestamptz; v_dong jsonb;
begin
  if not (public.la_thanh_vien() or public._la_tac_vu_nen()) then return; end if;
  if p_loai not in ('ta', 'gv', 'ops') or p_ym !~ '^\d{4}-\d{2}$' then raise exception 'tham số sai'; end if;
  select l.tinh_luc, l.dong into v_luc, v_dong from dash_viec_thang_luu l where l.loai = p_loai and l.ym = p_ym;
  if v_luc is null or v_luc < now() - make_interval(mins => greatest(p_cu_phut, 0)) then
    v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;
    if p_loai = 'ta' then
      select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) into v_dong from public.fn_ta_viec_thang(v_tu, v_den) x;
    elsif p_loai = 'gv' then
      select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) into v_dong from public.fn_gv_viec_thang(v_tu, v_den) x;
    else   -- [13/11] 'ops': cùng khuôn dòng, tên việc đưa vào cột ten_lop
      select coalesce(jsonb_agg(to_jsonb(x) || jsonb_build_object('ten_lop', x.ten_viec)), '[]'::jsonb) into v_dong from public.fn_ops_viec_thang(v_tu, v_den) x;
    end if;
    v_luc := now();
    insert into dash_viec_thang_luu (loai, ym, tinh_luc, dong) values (p_loai, p_ym, v_luc, v_dong)
      on conflict (loai, ym) do update set tinh_luc = excluded.tinh_luc, dong = excluded.dong;
  end if;
  return query select r.nhan_su_id, r.ho_ten, r.an_xep_hang, r.ten_lop, r.ngay, r.tab, r.kq, r.ly_do, v_luc
    from jsonb_to_recordset(v_dong) as r(nhan_su_id uuid, ho_ten text, an_xep_hang boolean, ten_lop text, ngay date, tab text, kq text, ly_do text);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_xephang_chung(p_ym text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
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
    -- [13/11] đọc bảng tính sẵn việc tháng (≤ 10 phút, cùng nguồn với fn_ta_dashboard / fn_gv_dashboard) thay vì tính lại việc cả tháng của mọi nhân sự mỗi lượt mở
    select nhan_su_id, kq from public._dash_viec_thang('ta', p_ym)
    union all
    select nhan_su_id, kq from public._dash_viec_thang('gv', p_ym)
    union all
    select nhan_su_id, kq from public._dash_viec_thang('ops', p_ym)
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
end $function$;

CREATE OR REPLACE FUNCTION public._tich_luy_cua(p_ns uuid, p_ym text)
 RETURNS TABLE(diem_thang integer, chuoi integer, ngay_cuoi date, ngay_trot date)
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v_tu date; v_den date; v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  k_diem integer; r record; v_chuoi integer := 0; v_cuoi date := null; v_trot date := null;
  k_moc constant date := date '2026-09-01';   -- CEO 07/09: tích lũy chỉ tính từ tháng 9/2026
begin
  v_tu := (p_ym || '-01')::date; v_den := (v_tu + interval '1 month' - interval '1 day')::date;
  if v_tu < k_moc then
    return query select 0, 0, null::date, null::date; return;
  end if;
  select gia_tri::integer into k_diem from ta_dinh_muc where ma = 'diem_moi_ngay';
  for r in
    with viec as (
      -- [13/11] đọc bảng tính sẵn việc tháng (≤ 10 phút) — trước tính việc cả tháng của MỌI nhân sự rồi mới lọc một người
      select ngay, kq from public._dash_viec_thang('ta', p_ym) where nhan_su_id = p_ns
      union all select ngay, kq from public._dash_viec_thang('gv', p_ym) where nhan_su_id = p_ns
      union all select ngay, kq from public._dash_viec_thang('ops', p_ym) where nhan_su_id = p_ns
    )
    select ngay, bool_or(kq = 'khong_dat') as trot
    from viec where ngay < v_today and kq <> 'cho'
    group by ngay order by ngay
  loop
    if r.trot then v_chuoi := 0; v_trot := r.ngay; else v_chuoi := v_chuoi + 1; end if;
    v_cuoi := r.ngay;
  end loop;
  return query select v_chuoi * coalesce(k_diem, 100), v_chuoi, v_cuoi, v_trot;
end $function$;
