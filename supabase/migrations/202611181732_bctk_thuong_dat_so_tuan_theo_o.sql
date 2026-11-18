-- BÁO CÁO TUẦN — THƯỜNG ĐẠT theo ô (Thùy 18/11: "thêm chỉ số THƯỜNG ĐẠT — trung bình thời gian dài"; "Dựng luôn").
-- Phiếu 10 câu (spec-kien-truc §9): 1 miền Quản lý chất lượng / báo cáo tuần, sở hữu bảng bctk_so_tuan_o · 2 khoá tự nhiên (tuan, mon, khoi), máy ghi một lần ·
-- 3 có nhãn mon · 4 nhân sự đọc; KHÔNG ai ghi tay (chỉ hàm chốt chạy bằng quyền chủ) · 5 không thêm RPC — đi kèm fn_bctk_lay / fn_bcmt_lay ·
-- 6 hàm đọc _bctk_thuong_dat: tra khoá chính ≤ 8 tuần × số ô của báo cáo (vài chục dòng) · 7 đơn vị tính = 1 ô (môn × khối) × 1 tuần ĐÃ ĐÓNG, chốt một lần (K6),
-- cấp trên (báo cáo nhiều ô, báo cáo môn) = GOM tử số / mẫu số từ các ô (K5) · 8 khoá chính đủ cho mọi đường tra · 9 không polling · 10 ~20 dòng / tuần, giữ mãi (nhỏ).
-- Là bản CHIẾU (K21): dựng lại được từ fn_bctk_so vì ảnh dang_yeu_dau_tuan là dữ liệu gốc bất biến.
-- Thường đạt = trung bình các TUẦN ĐÃ ĐÓNG liền trước (tối đa 8 tuần), cần ít nhất 4 tuần có số. CHƯA lọc nhiễu (hàng rào Tukey của Tổng kết tuần) — thêm khi đủ tuần để có nhiễu.

create table if not exists public.bctk_so_tuan_o (
  tuan date not null,
  mon text not null,
  khoi text not null,
  tong jsonb not null,                       -- khối 'tong' của fn_bctk_so cho đúng một ô, tính lúc tuần đã đóng
  phien_ban int not null,
  tinh_at timestamptz not null default now(),
  primary key (tuan, mon, khoi)
);
alter table public.bctk_so_tuan_o enable row level security;
drop policy if exists bctk_so_tuan_o_doc on public.bctk_so_tuan_o;
create policy bctk_so_tuan_o_doc on public.bctk_so_tuan_o for select to authenticated using ((select public.la_thanh_vien()));
revoke all on public.bctk_so_tuan_o from anon;

-- Chốt số các tuần ĐÃ ĐÓNG còn thiếu (có đủ ảnh đầu tuần + ảnh đầu tuần sau), mỗi ô một dòng, có ngân sách giây — bộ điều phối gọi ban đêm.
create or replace function public._bctk_so_tuan_chot(p_ngan_sach_giay int default 40)
returns int
language plpgsql security definer
set search_path to 'public'
as $fn$
declare
  v_bd timestamptz := clock_timestamp();
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  r record; v_so jsonb; n int := 0;
begin
  for r in
    select t.tuan, o.mon, o.khoi
      from (select distinct z.tuan from dang_yeu_dau_tuan z
             where z.tuan >= v_nay - 70 and z.tuan + 7 <= v_nay
               and exists (select 1 from dang_yeu_dau_tuan c where c.tuan = z.tuan + 7)) t   -- đã có ảnh cuối tuần
      cross join lateral (select distinct z.mon, z.khoi from dang_yeu_dau_tuan z where z.tuan = t.tuan and z.khoi is not null) o
     where not exists (select 1 from bctk_so_tuan_o s where s.tuan = t.tuan and s.mon = o.mon and s.khoi = o.khoi)
     order by t.tuan desc, o.mon, o.khoi
  loop
    exit when clock_timestamp() - v_bd > make_interval(secs => p_ngan_sach_giay);
    v_so := public.fn_bctk_so(jsonb_build_array(jsonb_build_object('mon', r.mon, 'khoi', r.khoi)), r.tuan);
    insert into bctk_so_tuan_o (tuan, mon, khoi, tong, phien_ban)
    values (r.tuan, r.mon, r.khoi, v_so->'tong', coalesce((v_so->>'phien_ban')::int, 0))
    on conflict (tuan, mon, khoi) do nothing;
    n := n + 1;
  end loop;
  return n;
end
$fn$;
revoke all on function public._bctk_so_tuan_chot(int) from public, anon, authenticated;

-- Thường đạt của một báo cáo (một hay nhiều ô): mỗi tuần GOM tử / mẫu của các ô rồi mới ra tỉ lệ; sau đó trung bình các tuần.
create or replace function public._bctk_thuong_dat(p_o jsonb, p_tu date)
returns jsonb
language sql stable
set search_path to 'public'
as $fn$
  with o as (select x->>'mon' as mon, x->>'khoi' as khoi from jsonb_array_elements(p_o) x),
  w as (   -- mỗi tuần đã đóng một dòng: tổng các ô
    select s.tuan,
           sum((s.tong #>> '{hai_chieu,nhom,het_yeu}')::numeric) as nhom_het, sum((s.tong #>> '{hai_chieu,nhom,dau}')::numeric) as nhom_dau,
           sum((s.tong #>> '{hai_chieu,dang,het_yeu}')::numeric) as dang_het, sum((s.tong #>> '{hai_chieu,dang,dau}')::numeric) as dang_dau,
           sum((s.tong #>> '{hs_yeu,giam}')::numeric) as hs1_giam, sum((s.tong #>> '{hs_yeu,dau}')::numeric) as hs1_dau,
           sum((s.tong #>> '{ht,hs_yeu_2,giam}')::numeric) as hs2_giam, sum((s.tong #>> '{ht,hs_yeu_2,dau}')::numeric) as hs2_dau,
           sum((s.tong #>> '{ht,xep,xep_2}')::numeric) as xep, sum((s.tong #>> '{ht,xep,yeu_2}')::numeric) as xep_mau,
           sum((s.tong #>> '{ht,hieu_suat,het_yeu}')::numeric) as hs_het, sum((s.tong #>> '{ht,hieu_suat,don_vi}')::numeric) as hs_dv,
           sum((s.tong #>> '{ht,vang,vang}')::numeric) as vang, sum((s.tong #>> '{ht,vang,da_diem_danh}')::numeric) as vang_mau,
           sum((s.tong #>> '{ht,chua_xu_ly,n1}')::numeric) as chua
      from bctk_so_tuan_o s join o on o.mon = s.mon and o.khoi = s.khoi
     where s.tuan < p_tu and s.tuan >= p_tu - 56
     group by s.tuan
  ),
  n as (select count(*)::int as so_tuan from w)
  select jsonb_build_object('so_tuan', n.so_tuan, 'can', 4, 'toi_da', 8) ||
    case when n.so_tuan < 4 then '{}'::jsonb else (
      select jsonb_build_object(
        'nhom', jsonb_build_object('so', round(avg(nhom_het), 1), 'ti_le', round(avg(public._bctk_pct(nhom_het, nhom_dau)), 1)),
        'dang', jsonb_build_object('so', round(avg(dang_het), 1), 'ti_le', round(avg(public._bctk_pct(dang_het, dang_dau)), 1)),
        'hs_yeu_1', jsonb_build_object('so', round(avg(hs1_giam), 1), 'ti_le', round(avg(public._bctk_pct(hs1_giam, hs1_dau)), 1)),
        'hs_yeu_2', jsonb_build_object('so', round(avg(hs2_giam), 1), 'ti_le', round(avg(public._bctk_pct(hs2_giam, hs2_dau)), 1)),
        'xep', jsonb_build_object('ti_le', round(avg(public._bctk_pct(xep, xep_mau)), 1)),
        'hieu_suat', jsonb_build_object('ti_le', round(avg(public._bctk_pct(hs_het, hs_dv)), 1)),
        'vang', jsonb_build_object('ti_le', round(avg(public._bctk_pct(vang, vang_mau)), 1)),
        'chua_xu_ly', jsonb_build_object('so', round(avg(chua), 1)))
      from w) end
    from n;
$fn$;
revoke all on function public._bctk_thuong_dat(jsonb, date) from public, anon, authenticated;

-- đăng ký bộ điều phối (K4 — không cron riêng): ban đêm 1h–5h VN (ngoài 17–22 h, K22); tuần nào đủ rồi thì lượt chạy chỉ là một câu kiểm thiếu
insert into tinh_san_dang_ky (ma, ten, lenh, chu_ky_phut, gio_chay, uu_tien, ngan_sach_giay, bat, ghi_chu) values
  ('bctk_so_tuan', 'Báo cáo tuần: chốt số từng ô của tuần đã đóng (nguồn Thường đạt)', 'public._bctk_so_tuan_chot(40)', 60, array[1, 2, 3, 4, 5], 90, 40, true,
   'Thùy 18/11 · spec-van-hanh-tuan §5.5b · mỗi ô × tuần chốt một lần, chạy lại không trùng')
on conflict (ma) do nothing;

-- fn_bctk_lay: thêm khoá 'thuong_dat' vào "so" (phần còn lại giữ nguyên bản đang chạy)
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
             || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, v_tuan))
             || jsonb_build_object('thuong_dat', public._bctk_thuong_dat(v_o, v_tuan)) end,
    'ca_nhan', case when v_snap then r.ca_nhan else public._bctk_ca_nhan(v_me, v_tuan, r.ca_nhan) end,
    'tu_viet', coalesce(r.tu_viet, '{}'::jsonb),
    'nop_at', r.nop_at, 'tre', r.tre, 'tra_lai_ly_do', r.tra_lai_ly_do);
end $function$;

-- fn_bctk_nop: thêm khoá 'thuong_dat' vào "so" (phần còn lại giữ nguyên bản đang chạy)
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
             || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, p_tuan))
             || jsonb_build_object('thuong_dat', public._bctk_thuong_dat(v_o, p_tuan)),
      ca_nhan = public._bctk_ca_nhan(v_me, p_tuan, r.ca_nhan),
      phien_ban = 1, nop_at = now(), tre = now() > public._bctk_han(p_tuan), updated_at = now()
     where id = r.id;
  end if;
  return public.fn_bctk_lay(p_tuan);
end $function$;

-- fn_bcmt_lay: thêm khoá 'thuong_dat' vào "so" (phần còn lại giữ nguyên bản đang chạy)
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
             || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, p_tuan))
             || jsonb_build_object('thuong_dat', public._bctk_thuong_dat(v_o, p_tuan)) end,
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

-- fn_bcmt_chot: thêm khoá 'thuong_dat' vào "so" (phần còn lại giữ nguyên bản đang chạy)
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
             || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, p_tuan))
             || jsonb_build_object('thuong_dat', public._bctk_thuong_dat(v_o, p_tuan)),
          public._bcmt_duoc_ghep(p_tuan, p_mon), public.current_nhan_su_id(), now())
  on conflict (tuan, mon) do update set nhan_xet = excluded.nhan_xet, trang_thai = 'da_chot', tong = excluded.tong,
    bao_cao_ids = excluded.bao_cao_ids, chot_boi = excluded.chot_boi, chot_at = excluded.chot_at, updated_at = now();
  return public.fn_bcmt_lay(p_tuan, p_mon);
end $function$;
