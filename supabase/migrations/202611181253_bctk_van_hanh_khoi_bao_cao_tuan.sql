-- BÁO CÁO TUẦN trưởng khối — thêm khối VẬN HÀNH (Thùy 18/11: tách 3 phần Vận hành · Học tập · Phát triển cá nhân).
-- Vận hành = việc sau buổi của khối trong kỳ (đánh giá · chấm ET · chấm BTVN · MT · chấm trên lớp): đúng hạn / đóng muộn / chưa đóng,
-- theo khâu · theo người phụ trách · theo lớp + danh sách việc muộn / chưa đóng.
-- NGUỒN DUY NHẤT của việc + người + hạn = fn_viec_buoi_thuong_lh (engine việc; cùng cách Gậy / Hiệu suất TA); đúng hạn = lần đóng ĐẦU ≤ hạn
-- (_viec_dong_dau) — y hệt chỉ số "Chấm ET đúng hạn" đang có ở fn_bctk_so. KHÔNG công thức thứ hai.
-- Chi phí: MỘT lượt gọi engine việc cho đúng 7 ngày của kỳ (lọc theo buoi_hoc.ngay), giữ lại lớp của ô — đo 18/11: 0,16–0,23 s cả hệ.
-- Không gọi trong fn_bctk_trend (trend gọi fn_bctk_so 4 lần) ⇒ gắn ở 4 chỗ dựng "so": fn_bctk_lay · fn_bctk_nop · fn_bcmt_lay · fn_bcmt_chot.
-- Bản snap cũ không có khoá 'van_hanh' ⇒ màn ghi rõ "bản chốt trước 18/11".

create or replace function public._bctk_van_hanh(p_o jsonb, p_tu date)
returns jsonb
language sql stable
set search_path to 'public'
as $fn$
  with o as (select x->>'mon' as mon, x->>'khoi' as khoi from jsonb_array_elements(p_o) x),
  lop_o as (   -- cùng tập lớp với fn_bctk_so
    select l.id from lop l join o on o.mon = l.mon and o.khoi = l.khoi
     where l.trang_thai = 'dang_hoc'
        or exists (select 1 from buoi_hoc b where b.lop_id = l.id and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between p_tu and p_tu + 6)
  ),
  f as materialized (   -- việc đã tới hạn hoặc đã đóng (việc còn hạn chưa phải số của kỳ); trừ ET online (máy chấm)
    select v.nhan_su_id, v.vai, v.buoi_id, v.tab, v.lop_id, v.ten_lop, v.ngay, v.han,
           public._viec_dong_dau(v.buoi_id, v.tab, v.dong_at) as dd
      from public.fn_viec_buoi_thuong_lh(p_tu, p_tu + 6) v
     where v.lop_id in (select id from lop_o)
       and not (v.tab = 'et' and v.et_online)
       and (v.dong_at is not null or v.han <= now())
  ),
  x as materialized (
    select f.*, case when f.dd is null then 'chua' when f.han is null or f.dd <= f.han then 'dung' else 'muon' end as kq from f
  ),
  viec as (select distinct on (x.buoi_id, x.tab) x.buoi_id, x.tab, x.lop_id, x.ten_lop, x.ngay, x.han, x.dd, x.kq from x order by x.buoi_id, x.tab),
  dem as (
    select tab, lop_id, max(ten_lop) as ten_lop, count(*)::int as so_viec, count(*) filter (where kq = 'dung')::int as dung_han,
           count(*) filter (where kq = 'muon')::int as muon, count(*) filter (where kq = 'chua')::int as chua
      from viec group by grouping sets ((), (tab), (lop_id))
  ),
  ng as (
    select x.nhan_su_id, x.vai, count(*)::int as so_viec, count(*) filter (where x.kq = 'dung')::int as dung_han,
           count(*) filter (where x.kq = 'muon')::int as muon, count(*) filter (where x.kq = 'chua')::int as chua
      from x group by x.nhan_su_id, x.vai
  )
  select jsonb_build_object(
    'phien_ban', 1,
    'tong', (select jsonb_build_object('so_viec', d.so_viec, 'dung_han', d.dung_han, 'muon', d.muon, 'chua', d.chua,
                                       'ti_le_dung_han', public._bctk_pct(d.dung_han, d.so_viec))
               from dem d where d.tab is null and d.lop_id is null),
    'khau', (select coalesce(jsonb_agg(jsonb_build_object('tab', d.tab, 'so_viec', d.so_viec, 'dung_han', d.dung_han, 'muon', d.muon, 'chua', d.chua,
                                       'ti_le_dung_han', public._bctk_pct(d.dung_han, d.so_viec))
                      order by array_position(array['danhgia', 'ingame', 'et', 'btvn', 'mt'], d.tab)), '[]'::jsonb)
               from dem d where d.tab is not null),
    'lop', (select coalesce(jsonb_agg(jsonb_build_object('lop_id', d.lop_id, 'ten_lop', d.ten_lop, 'so_viec', d.so_viec, 'dung_han', d.dung_han,
                                       'muon', d.muon, 'chua', d.chua, 'ti_le_dung_han', public._bctk_pct(d.dung_han, d.so_viec))
                      order by public._bctk_pct(d.dung_han, d.so_viec), d.ten_lop), '[]'::jsonb)
              from dem d where d.lop_id is not null),
    'nguoi', (select coalesce(jsonb_agg(jsonb_build_object('nhan_su_id', ng.nhan_su_id, 'ho_ten', ns.ho_ten, 'vai', ng.vai, 'so_viec', ng.so_viec,
                                       'dung_han', ng.dung_han, 'muon', ng.muon, 'chua', ng.chua, 'ti_le_dung_han', public._bctk_pct(ng.dung_han, ng.so_viec))
                      order by public._bctk_pct(ng.dung_han, ng.so_viec), ng.chua desc, ns.ho_ten), '[]'::jsonb)
                from ng join nhan_su ns on ns.id = ng.nhan_su_id),
    'tre', (select coalesce(jsonb_agg(jsonb_build_object('buoi_id', v.buoi_id, 'tab', v.tab, 'ten_lop', v.ten_lop, 'ngay', v.ngay, 'han', v.han,
                                       'dong', v.dd, 'kq', v.kq,
                                       'nguoi', (select string_agg(distinct ns.ho_ten, ', ') from x join nhan_su ns on ns.id = x.nhan_su_id
                                                  where x.buoi_id = v.buoi_id and x.tab = v.tab))
                      order by (v.kq = 'chua') desc, v.ngay, v.ten_lop, v.tab), '[]'::jsonb)
              from viec v where v.kq <> 'dung'));
$fn$;
-- hàm nội bộ: chỉ các hàm fn_bctk_* / fn_bcmt_* (security definer, đã có cổng) gọi — không mở cho người dùng gọi thẳng
revoke all on function public._bctk_van_hanh(jsonb, date) from public, authenticated;

-- fn_bctk_lay: thêm khoá 'van_hanh' vào "so" (phần còn lại giữ nguyên bản đang chạy)
CREATE OR REPLACE FUNCTION public.fn_bctk_lay(p_tuan date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := public.current_nhan_su_id();
  v_tuan date := coalesce(p_tuan, public._bctk_tuan_truoc());
  r bao_cao_tuan_khoi%rowtype;
  v_o jsonb;
  v_snap boolean;
begin
  if v_me is null then raise exception 'Chưa đăng nhập' using errcode = '42501'; end if;
  select * into r from bao_cao_tuan_khoi where tuan = v_tuan and nguoi_bao_cao = v_me;
  v_snap := found and r.trang_thai <> 'nhap';
  v_o := case when v_snap then r.o else public._bctk_o_cua_toi() end;
  if jsonb_array_length(v_o) = 0 then return jsonb_build_object('co_bao_cao', false); end if;
  return jsonb_build_object(
    'co_bao_cao', true, 'id', r.id, 'tuan', v_tuan, 'den', v_tuan + 6,
    'han', public._bctk_han(v_tuan), 'qua_han', now() > public._bctk_han(v_tuan),
    'ky_xong', v_tuan + 7 <= (now() at time zone 'Asia/Ho_Chi_Minh')::date,
    'trang_thai', coalesce(r.trang_thai, 'nhap'), 'o', v_o,
    'so', case when v_snap then r.so else public.fn_bctk_so(v_o, v_tuan) || jsonb_build_object('trend', public.fn_bctk_trend(v_o, v_tuan))
             || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, v_tuan)) end,
    'ca_nhan', case when v_snap then r.ca_nhan else public._bctk_ca_nhan(v_me, v_tuan, r.ca_nhan) end,
    'tu_viet', coalesce(r.tu_viet, '{}'::jsonb),
    'nop_at', r.nop_at, 'tre', r.tre, 'tra_lai_ly_do', r.tra_lai_ly_do);
end $function$;

-- fn_bctk_nop: thêm khoá 'van_hanh' vào "so" (phần còn lại giữ nguyên bản đang chạy)
CREATE OR REPLACE FUNCTION public.fn_bctk_nop(p_tuan date, p_ca_nhan jsonb, p_tu_viet jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_me uuid := public.current_nhan_su_id();
  r bao_cao_tuan_khoi%rowtype;
  v_o jsonb;
begin
  if v_me is null then raise exception 'Chưa đăng nhập' using errcode = '42501'; end if;
  if p_tuan + 7 > (now() at time zone 'Asia/Ho_Chi_Minh')::date then raise exception 'Tuần này chưa kết thúc — chỉ nộp được sau Chủ nhật'; end if;
  if coalesce(trim(p_tu_viet->>'nhan_dinh'), '') = ''
     or not exists (select 1 from jsonb_array_elements_text(coalesce(p_tu_viet->'uu_tien', '[]'::jsonb)) u where trim(u) <> '') then
    raise exception 'Cần viết Nhận định và ít nhất 1 việc ưu tiên tuần tới trước khi nộp';
  end if;
  perform public.fn_bctk_luu_nhap(p_tuan, p_ca_nhan, p_tu_viet);   -- ghi phần chữ trước (tạo dòng nếu chưa có)
  select * into r from bao_cao_tuan_khoi where tuan = p_tuan and nguoi_bao_cao = v_me for update;
  if r.trang_thai = 'tra_lai' then
    update bao_cao_tuan_khoi set trang_thai = 'da_nop', tra_lai_ly_do = null, updated_at = now() where id = r.id;
  elsif r.trang_thai = 'nhap' then
    v_o := public._bctk_o_cua_toi();
    if jsonb_array_length(v_o) = 0 then v_o := r.o; end if;
    update bao_cao_tuan_khoi set
      trang_thai = 'da_nop', o = v_o,
      so = public.fn_bctk_so(v_o, p_tuan) || jsonb_build_object('trend', public.fn_bctk_trend(v_o, p_tuan))
             || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, p_tuan)),
      ca_nhan = public._bctk_ca_nhan(v_me, p_tuan, r.ca_nhan),
      phien_ban = 1, nop_at = now(), tre = now() > public._bctk_han(p_tuan), updated_at = now()
     where id = r.id;
  end if;
  return public.fn_bctk_lay(p_tuan);
end $function$;

-- fn_bcmt_lay: thêm khoá 'van_hanh' vào "so" (phần còn lại giữ nguyên bản đang chạy)
CREATE OR REPLACE FUNCTION public.fn_bcmt_lay(p_tuan date, p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b bao_cao_chuyen_mon_tuan%rowtype; v_ids uuid[]; v_chot boolean; v_o jsonb;
begin
  perform public._bctk_gac_tbm();
  if not (p_mon = any(public._bctk_cac_mon_toi())) then raise exception 'Môn ngoài phạm vi của bạn' using errcode = '42501'; end if;
  select * into b from bao_cao_chuyen_mon_tuan where tuan = p_tuan and mon = p_mon;
  v_chot := found and b.trang_thai = 'da_chot';
  v_ids := case when v_chot then b.bao_cao_ids else public._bcmt_duoc_ghep(p_tuan, p_mon) end;
  v_o := public._bctk_o_cua_mon(p_mon);
  return jsonb_build_object(
    'tuan', p_tuan, 'den', p_tuan + 6, 'mon', p_mon, 'id', b.id,
    'trang_thai', coalesce(b.trang_thai, 'nhap'), 'nhan_xet', coalesce(b.nhan_xet, ''), 'chot_at', b.chot_at,
    'chot_boi', (select ho_ten from nhan_su where id = b.chot_boi),
    'ky_xong', p_tuan + 7 <= (now() at time zone 'Asia/Ho_Chi_Minh')::date,
    'tong', case when v_chot then b.tong else public.fn_bctk_so(v_o, p_tuan) || jsonb_build_object('trend', public.fn_bctk_trend(v_o, p_tuan))
             || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, p_tuan)) end,
    'cac_khoi', (select coalesce(jsonb_agg(jsonb_build_object(
                    'id', r.id, 'ho_ten', n.ho_ten, 'o', r.o, 'trang_thai', r.trang_thai, 'tre', r.tre,
                    'so', r.so, 'tu_viet', r.tu_viet) order by r.o->0->>'khoi', n.ho_ten), '[]'::jsonb)
                   from bao_cao_tuan_khoi r join nhan_su n on n.id = r.nguoi_bao_cao where r.id = any(v_ids)),
    -- ô của môn chưa có báo cáo được ghép (khối thiếu — không im lặng)
    'o_thieu', (select coalesce(jsonb_agg(x order by coalesce(substring(x->>'khoi' from '^[0-9]+')::int, 0), x->>'khoi'), '[]'::jsonb)
                  from jsonb_array_elements(v_o) x
                 where not exists (select 1 from bao_cao_tuan_khoi r, jsonb_array_elements(r.o) y
                                    where r.id = any(v_ids) and y->>'mon' = x->>'mon' and y->>'khoi' = x->>'khoi')));
end $function$;

-- fn_bcmt_chot: thêm khoá 'van_hanh' vào "so" (phần còn lại giữ nguyên bản đang chạy)
CREATE OR REPLACE FUNCTION public.fn_bcmt_chot(p_tuan date, p_mon text, p_nhan_xet text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_o jsonb;
begin
  perform public._bctk_gac_tbm();
  if not (p_mon = any(public._bctk_cac_mon_toi())) then raise exception 'Môn ngoài phạm vi của bạn' using errcode = '42501'; end if;
  if p_tuan + 7 > (now() at time zone 'Asia/Ho_Chi_Minh')::date then raise exception 'Tuần chưa kết thúc'; end if;
  if coalesce(trim(p_nhan_xet), '') = '' then raise exception 'Cần viết nhận xét của trưởng bộ môn trước khi chốt'; end if;
  if exists (select 1 from bao_cao_chuyen_mon_tuan where tuan = p_tuan and mon = p_mon and trang_thai = 'da_chot') then
    raise exception 'Báo cáo môn tuần này đã chốt';
  end if;
  v_o := public._bctk_o_cua_mon(p_mon);
  insert into bao_cao_chuyen_mon_tuan as b (tuan, mon, nhan_xet, trang_thai, tong, bao_cao_ids, chot_boi, chot_at)
  values (p_tuan, p_mon, trim(p_nhan_xet), 'da_chot',
          public.fn_bctk_so(v_o, p_tuan) || jsonb_build_object('trend', public.fn_bctk_trend(v_o, p_tuan))
             || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, p_tuan)),
          public._bcmt_duoc_ghep(p_tuan, p_mon), public.current_nhan_su_id(), now())
  on conflict (tuan, mon) do update set nhan_xet = excluded.nhan_xet, trang_thai = 'da_chot', tong = excluded.tong,
    bao_cao_ids = excluded.bao_cao_ids, chot_boi = excluded.chot_boi, chot_at = excluded.chot_at, updated_at = now();
  return public.fn_bcmt_lay(p_tuan, p_mon);
end $function$;
