-- ============================================================================
-- 202610071340 — bxh_c1_leo_thap   (áp: `node scripts/migrate.mjs --only <file này>`)
-- VÌ SAO (P1 phase 2): sau khi tầng Leo tháp do MÁY CHỦ tính (mig 202610071335), mở khoá bảng xếp hạng C1 "Leo tháp Sinh tồn" (spec-bang-xep-hang.md): tầng cao nhất trong 5 phút,
--   Khối mình / Toàn BK, kỳ Hôm nay · Kỷ lục; CHỈ tính lượt nguon_cham='server' (Toán · KHTN). Tiếng Anh chưa chấm ở máy chủ ⇒ bảng Anh rỗng cho tới Phase 2 tiếp theo.
--   Bảng xếp hạng BÊN TRONG game (fn_dtv_thap_bxh_mon) với môn có kho DB cũng chỉ tính lượt máy chủ chấm (môn khác giữ nguyên).
-- MẤT GÌ: không xoá dữ liệu. Thay thân _bxh_ky (thêm 'hom_nay'), _bxh_gia_tri (thêm nhánh C1), fn_dtv_thap_bxh_mon (thêm điều kiện nguồn); đổi cấu hình bxh_loai.C1. Sinh từ định nghĩa LIVE.
-- ============================================================================
update bxh_loai set san_sang = true, ghi_chu = null, ky_cho_phep = '{hom_nay,hien_tai}', ky_mac_dinh = 'hom_nay',
  mo_ta = 'Tầng cao nhất trong 5 phút (chỉ tính lượt máy chủ chấm)' where ma = 'C1';

CREATE OR REPLACE FUNCTION public._bxh_ky(p_ky text)
 RETURNS TABLE(tu date, den date)
 LANGUAGE sql
 STABLE
AS $function$
  with n as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d)
  select case p_ky
           when 'hom_nay' then n.d
           when 'tuan'  then date_trunc('week', n.d::timestamp)::date
           when 'thang' then date_trunc('month', n.d::timestamp)::date
           when 'mua'   then make_date(extract(year from n.d)::int - case when extract(month from n.d) >= 7 then 0 else 1 end, 7, 1)
           else date '2000-01-01' end,
         n.d
  from n
$function$
;

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
          and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
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
end $function$
;

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
end $function$
;
