-- ============================================================================
-- 202611031929 — dtv_mua_bxh   (áp: `node scripts/migrate.mjs --only 202611031929_dtv_mua_bxh.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 03/11 "reset lại toàn bộ bảng xếp hạng của đấu trường" (sau khi đổi luật: sai bị trừ điểm + xáo đáp án),
--   chốt "Chỉ BXH" ⇒ cấp / XP / số trận / chuỗi trong hồ sơ của em GIỮ NGUYÊN, chỉ các bảng xếp hạng về trống.
-- CÁCH LÀM — KHÔNG xoá / sửa dòng dữ liệu cũ nào: thêm MỐC MÙA.
--   · `dtv_mua` (mùa, mốc bắt đầu); mùa 1 = lúc áp mig này. `_dtv_mua_bat_dau()` = mốc của mùa mới nhất.
--   · BXH XP = xp − xp_dau_mua (cột mới, chụp XP hiện tại lúc mở mùa; hồ sơ sinh sau mốc = 0).
--   · BXH chuỗi thắng = chuỗi thắng dài nhất TRONG MÙA (2 cột mới chuoi_thang_mua / chuoi_thang_max_mua, `fn_dtv_ghi_tran_mon` cập nhật).
--   · BXH chuỗi ngày = chuỗi ngày hiện tại nhưng không vượt số ngày từ mốc mùa.
--   · BXH Leo tháp (Kỷ lục / Hôm nay, `fn_dtv_thap_bxh_mon`) + ô C1 "Leo tháp Sinh tồn" của BXH chung (`_bxh_gia_tri`) chỉ đếm lượt từ mốc.
--   · Lịch sử trận (dtv_tran), lượt tháp (dtv_thap_luot), hồ sơ người chơi: giữ nguyên toàn bộ.
-- Mở mùa sau: insert 1 dòng dtv_mua + update xp_dau_mua = xp, chuoi_thang_mua = 0, chuoi_thang_max_mua = 0 (cùng transaction).
-- MẤT GÌ: không. Thêm 1 bảng + 3 cột + 1 hàm; thay thân 4 hàm (giữ chữ ký + quyền).
-- ============================================================================

create table if not exists public.dtv_mua (
  so integer primary key,
  bat_dau_at timestamptz not null default now(),
  ghi_chu text not null,
  tao_at timestamptz not null default now()
);
alter table public.dtv_mua enable row level security;
drop policy if exists dtv_mua_doc on public.dtv_mua;
create policy dtv_mua_doc on public.dtv_mua for select to authenticated using (true);
comment on table public.dtv_mua is 'Mùa bảng xếp hạng Đấu trường: BXH chỉ tính từ bat_dau_at của mùa mới nhất. Lịch sử cũ giữ nguyên.';

insert into public.dtv_mua (so, bat_dau_at, ghi_chu)
values (1, now(), 'Thùy 03/11: reset BXH sau khi đổi luật (sai bị trừ điểm, xáo đáp án) — chỉ BXH, giữ cấp/XP')
on conflict (so) do nothing;

create or replace function public._dtv_mua_bat_dau()
returns timestamptz language sql stable security definer set search_path to 'public'   -- definer: BXH chung gọi qua hàm invoker, mốc phải đọc được dù RLS
as $$ select coalesce(max(bat_dau_at), '-infinity'::timestamptz) from dtv_mua $$;

alter table public.dtv_nguoi_choi add column if not exists xp_dau_mua integer not null default 0;
alter table public.dtv_nguoi_choi add column if not exists chuoi_thang_mua integer not null default 0;
alter table public.dtv_nguoi_choi add column if not exists chuoi_thang_max_mua integer not null default 0;
comment on column public.dtv_nguoi_choi.xp_dau_mua is 'XP lúc mở mùa BXH hiện tại (dtv_mua). BXH XP = xp − xp_dau_mua.';
comment on column public.dtv_nguoi_choi.chuoi_thang_mua is 'Chuỗi thắng đang chạy, tính từ mốc mùa BXH.';
comment on column public.dtv_nguoi_choi.chuoi_thang_max_mua is 'Chuỗi thắng dài nhất trong mùa BXH hiện tại.';
update public.dtv_nguoi_choi set xp_dau_mua = xp where xp_dau_mua = 0;   -- chụp mốc mùa 1 (cột mới, không đổi cột cũ)

create or replace function public.fn_dtv_bxh(p_tieu_chi text, p_uid text default null)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $function$
declare v_mua_ngay integer := _dtv_hom_nay() - (_dtv_mua_bat_dau() at time zone 'Asia/Ho_Chi_Minh')::date + 1;
begin
  perform public._dtv_kiem_uid(p_uid);
  return (with g as (
    select n.uid, n.ma, n.ten, n.nv, c.cap,
           case p_tieu_chi
             when 'chuoi_thang' then n.chuoi_thang_max_mua
             when 'chuoi_ngay'  then case when n.ngay_hoc_cuoi >= _dtv_hom_nay() - 1 then least(n.chuoi_ngay, greatest(v_mua_ngay, 0)) else 0 end
             else n.xp - n.xp_dau_mua end as gt
    from dtv_nguoi_choi n cross join lateral _dtv_cap(n.xp) c
  ), x as (
    select g.*, rank() over (order by gt desc) as hang from g where gt > 0
  )
  select jsonb_build_object(
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang', hang, 'ma', ma, 'ten', ten, 'nv', nv, 'cap', cap, 'gt', gt) order by hang, ten)
                     from (select * from x order by hang, ten limit 50) t), '[]'::jsonb),
    'toi', (select jsonb_build_object('hang', hang, 'gt', gt) from x where uid = p_uid)));
end $function$;

CREATE OR REPLACE FUNCTION public._bxh_gia_tri(p_loai text, p_mon text, p_ky text, p_hs uuid[])
 RETURNS TABLE(hs uuid, gia_tri numeric, phu numeric, dat_luc timestamp with time zone)
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  c record; v_tu date; v_den date; v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date; v_ym text; v_khoi text;
begin
  select k.tu, k.den into v_tu, v_den from public._bxh_ky(p_ky) k;

  if p_loai = 'A1' then
    select n.* into c from nhiem_vu_cau_hinh n where n.mon = p_mon and n.bat;
    if c.mon is null then return; end if;
    v_tu := greatest(v_tu, c.bat_dau);
    if v_den < v_tu then return; end if;
    return query
      select d.hoc_sinh_id, count(*)::numeric, 0::numeric, max(d.nop_at)
      from public._nv_luot_dat(p_mon, p_hs, v_tu, v_den, c.dat_ti_le, c.lan_ngay) d group by d.hoc_sinh_id;

  elsif p_loai = 'A2' then
    return query
      select t.hoc_sinh_id, sum(t.dung)::numeric, 0::numeric, max(t.nop_at)
      from public._luot_tinh(p_hs, v_tu::timestamp at time zone 'Asia/Ho_Chi_Minh', (v_den + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh') t
      where t.mon = p_mon and t.tinh group by t.hoc_sinh_id having sum(t.dung) > 0;

  elsif p_loai = 'A3' then
    return query
      with do_dang as (
        select bl.hoc_sinh_id as h, bc.ma_dang,
               count(*) filter (where blc.verdict is not null) as tong_cau,
               count(*) filter (where blc.verdict = 'correct') as so_dung
        from bai_lam_cau blc
        join bai_lam bl on bl.id = blc.bai_lam_id
        join bai_test_cau bc on bc.id = blc.bai_test_cau_id
        join bai_test bt on bt.id = bl.bai_test_id
        where bt.mon = p_mon and bl.hoc_sinh_id = any(p_hs) and bc.ma_dang is not null
          and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
        group by bl.hoc_sinh_id, bc.ma_dang
      )
      select x.h, round(100.0 * count(*) filter (where x.tong_cau >= 3 and x.so_dung::numeric / x.tong_cau >= 0.75) / count(*), 1),
             count(*)::numeric, null::timestamptz
      from do_dang x group by x.h having count(*) > 0;

  elsif p_loai = 'A5' then
    return query
      select s.h, s.j, s.k, s.b from (
        select u as h, (cc.j->>'so_ngay')::numeric as j, (cc.j->>'ky_luc')::numeric as k,
               ((cc.j->>'bat_dau')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as b
        from unnest(p_hs) u cross join lateral (select public._chuoi_cua(u) as j) cc
      ) s where s.j > 0;

  elsif p_loai = 'C1' then
    -- Leo tháp Sinh tồn: tầng cao nhất của em trong kỳ, CHỈ lượt do MÁY CHỦ chấm (dtv_thap_luot.nguon_cham='server'); hoà ⇒ ít sai hơn, rồi ai đạt sớm hơn
    return query
      select x.h, x.tang::numeric, (- x.sai)::numeric, x.tao_at
      from (
        select distinct on (t.hoc_sinh_id) t.hoc_sinh_id as h, t.tang, t.sai, t.tao_at
        from dtv_thap_luot t
        where t.nguon_cham = 'server' and t.che_do = 'song_con' and t.mon = p_mon and t.hoc_sinh_id = any(p_hs)
          and t.ngay >= v_tu and t.ngay <= v_den and t.tang > 0
          and t.tao_at >= public._dtv_mua_bat_dau()   -- mùa BXH Đấu trường (mig 202611031929)
        order by t.hoc_sinh_id, t.tang desc, t.sai asc, t.tao_at asc
      ) x;

  elsif p_loai = 'B1' then
    -- Mock Test chạy quanh ngày 25 → mùng 10 tháng sau: kỳ "tháng" = đợt đã bắt đầu gần nhất (từ ngày 25 trở đi = tháng này, trước đó = tháng trước)
    v_ym := to_char(case when extract(day from v_nay) >= 25 then v_nay else (v_nay - interval '1 month')::date end, 'YYYY-MM');
    for v_khoi in select distinct h.khoi from hoc_sinh h where h.id = any(p_hs) and h.khoi is not null loop
      return query
        select m.hoc_sinh_id, m.tb, 0::numeric, null::timestamptz
        from public.fn_bxh_diem_mt_khoi(p_mon, v_khoi, v_ym) m where m.tb is not null and m.hoc_sinh_id = any(p_hs);
    end loop;
  end if;
  -- A4 · C1 · E1: chưa sẵn sàng ⇒ không trả dòng nào
end $function$;

CREATE OR REPLACE FUNCTION public.fn_dtv_ghi_tran_mon(p_uid text, p_mon text, p_che_do text, p_chu_de text, p_ket_qua text, p_so_dung integer, p_so_cau integer, p_diem integer, p_doi_thu text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_cau integer := least(greatest(coalesce(p_so_cau, 0), 0), 40);
  v_dung integer := least(greatest(coalesce(p_so_dung, 0), 0), least(greatest(coalesce(p_so_cau, 0), 0), 40));
  v_xp integer; v_hom_nay date := _dtv_hom_nay(); v_cap_truoc integer; v_cap_sau integer;
  v_luot_hom_nay integer; n dtv_nguoi_choi; v_tran uuid;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into n from dtv_nguoi_choi where uid = p_uid for update;
  if not found then raise exception 'Chưa có hồ sơ người chơi'; end if;

  v_xp := case
    when p_che_do = 'on_tap' then v_dung * 2
    when p_che_do = 'noi_tu' then least(v_dung, 30) * 2 + case p_ket_qua when 'thang' then 20 else 0 end
    else v_dung * 5 + case p_ket_qua when 'thang' then 40 when 'hoa' then 20 else 10 end
  end;
  select count(*) into v_luot_hom_nay from dtv_tran
   where uid = p_uid and (tao_at at time zone 'Asia/Ho_Chi_Minh')::date = v_hom_nay;
  if v_luot_hom_nay >= 60 then v_xp := 0; end if;

  insert into dtv_tran (uid, mon, che_do, chu_de, ket_qua, so_dung, so_cau, diem, xp, doi_thu)
  values (p_uid, coalesce(nullif(p_mon, ''), 'Tiếng Anh'), p_che_do, coalesce(nullif(p_chu_de, ''), 'tron'), p_ket_qua, v_dung, v_cau,
          least(greatest(coalesce(p_diem, 0), -10000), 10000), v_xp, nullif(p_doi_thu, ''))
  returning id into v_tran;

  select cap into v_cap_truoc from _dtv_cap(n.xp);
  update dtv_nguoi_choi set
    xp = n.xp + v_xp,
    so_tran  = n.so_tran  + case when p_che_do in ('bot','mang','giai') then 1 else 0 end,
    so_thang = n.so_thang + case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then 1 else 0 end,
    chuoi_thang = case when p_che_do not in ('bot','mang','giai') then n.chuoi_thang
                       when p_ket_qua = 'thang' then n.chuoi_thang + 1
                       when p_ket_qua = 'thua' then 0 else n.chuoi_thang end,
    chuoi_thang_mua = case when p_che_do not in ('bot','mang','giai') then n.chuoi_thang_mua
                       when p_ket_qua = 'thang' then n.chuoi_thang_mua + 1
                       when p_ket_qua = 'thua' then 0 else n.chuoi_thang_mua end,
    chuoi_thang_max_mua = greatest(n.chuoi_thang_max_mua,
                       case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then n.chuoi_thang_mua + 1 else 0 end),
    chuoi_thang_max = greatest(n.chuoi_thang_max,
                       case when p_che_do in ('bot','mang','giai') and p_ket_qua = 'thang' then n.chuoi_thang + 1 else 0 end),
    chuoi_ngay = case when n.ngay_hoc_cuoi = v_hom_nay then n.chuoi_ngay
                      when n.ngay_hoc_cuoi = v_hom_nay - 1 then n.chuoi_ngay + 1 else 1 end,
    ngay_hoc_cuoi = v_hom_nay,
    cap_nhat_at = now()
  where uid = p_uid;
  select cap into v_cap_sau from dtv_nguoi_choi d cross join lateral _dtv_cap(d.xp) where d.uid = p_uid;

  return jsonb_build_object('ho_so', _dtv_ho_so_json(p_uid), 'xp_nhan', v_xp, 'len_cap', v_cap_sau > v_cap_truoc, 'tran_id', v_tran);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_dtv_thap_bxh_mon(p_che_do text, p_mon text, p_nhom text, p_hom_nay boolean, p_uid text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  perform public._dtv_kiem_uid(p_uid);
  return (with l as (
    select distinct on (t.uid) t.uid, t.tang, t.sai, t.ms, t.tao_at
    from dtv_thap_luot t
    where t.che_do = p_che_do and t.mon = p_mon and t.nhom = coalesce(p_nhom, '')
      and (t.nguon_cham = 'server' or not public._kho_co_mon(p_mon))
      and (not p_hom_nay or t.ngay = _dtv_hom_nay())
      and t.tao_at >= public._dtv_mua_bat_dau()   -- chỉ lượt trong mùa BXH hiện tại (mig 202611031929)
    order by t.uid, t.tang desc,
      case when p_che_do = 'song_con' then t.sai else t.ms end asc, t.tao_at asc
  ), x as (
    select l.*, n.ma, n.ten, n.nv,
      row_number() over (order by l.tang desc, case when p_che_do = 'song_con' then l.sai else l.ms end asc, l.tao_at asc) as hang
    from l join dtv_nguoi_choi n on n.uid = l.uid
  )
  select jsonb_build_object(
    'so_nguoi', (select count(*) from x),
    'top', coalesce((select jsonb_agg(jsonb_build_object('hang', hang, 'ma', ma, 'ten', ten, 'nv', nv, 'tang', tang, 'sai', sai, 'ms', ms) order by hang)
                     from (select * from x order by hang limit 50) t), '[]'::jsonb),
    'toi', (select jsonb_build_object('hang', hang, 'tang', tang, 'sai', sai, 'ms', ms) from x where uid = p_uid)));
end $function$;

