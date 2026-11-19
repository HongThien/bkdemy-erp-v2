-- BÁO CÁO TUẦN — màn "TUẦN NÀY" cho trưởng bộ môn / giám đốc (Thùy 19/11: "cần màn realtime xem kết quả học tập của các khối tuần hiện tại; hiện chỉ xem được báo cáo đã chốt").
-- Phiếu 10 câu (spec-kien-truc §9): 1 miền QLCL / báo cáo tuần, sở hữu bảng bctk_so_hien_tai_o · 2 khoá tự nhiên (mon, khoi) · 3 có nhãn mon ·
-- 4 đọc: chỉ qua hàm có cổng trưởng bộ môn (bảng không có policy cho người dùng); ghi: chỉ hàm làm mới · 5 mở tab = MỘT lượt fn_bctk_hien_tai; bấm một khối = một lượt fn_bctk_hien_tai_o ·
-- 6 fn_bctk_hien_tai chỉ ĐỌC sổ (vài chục dòng); fn_bctk_hien_tai_o tính MỘT ô (đo: 0,1–0,5 s) · 7 số cả môn / cả hệ ⇒ sổ tính sẵn theo đơn vị nhỏ nhất = 1 ô,
-- tổng môn là GOM tử / mẫu (K2, K5); làm mới theo lịch 30 phút (nguồn là dang_yeu_hien_tai đã tự làm mới 5 phút) · 8 khoá chính đủ · 9 không polling · 10 ≤ ~20 dòng, ghi đè.
-- Là bản CHIẾU (K21): xoá đi thì lượt làm mới kế dựng lại từ fn_bctk_so.

create table if not exists public.bctk_so_hien_tai_o (
  mon text not null,
  khoi text not null,
  tuan date not null,                        -- thứ Hai của tuần đang chạy lúc tính
  tong jsonb not null,                       -- khối 'tong' của fn_bctk_so cho đúng một ô
  tinh_at timestamptz not null default now(),
  primary key (mon, khoi)
);
alter table public.bctk_so_hien_tai_o enable row level security;   -- không policy cho authenticated: chỉ đọc qua fn_bctk_hien_tai (có cổng)
revoke all on public.bctk_so_hien_tai_o from anon, authenticated;

-- Làm mới: ô cũ nhất trước (ô chưa có / còn số của tuần trước lên đầu), có ngân sách giây; ô không còn lớp đang học thì thôi không làm mới (dòng cũ tự bị lọc theo tuần).
create or replace function public._bctk_hien_tai_lam_moi(p_ngan_sach_giay int default 20)
returns int
language plpgsql security definer
set search_path to 'public'
as $fn$
declare
  v_bd timestamptz := clock_timestamp();
  v_tuan date := date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh')::date;
  r record; n int := 0;
begin
  for r in
    select o.mon, o.khoi
      from (select distinct l.mon, l.khoi from lop l where l.trang_thai = 'dang_hoc' and l.mon is not null and l.khoi is not null) o
      left join bctk_so_hien_tai_o s on s.mon = o.mon and s.khoi = o.khoi
     order by (s.tuan is distinct from v_tuan) desc, s.tinh_at nulls first
  loop
    exit when clock_timestamp() - v_bd > make_interval(secs => p_ngan_sach_giay);
    insert into bctk_so_hien_tai_o as t (mon, khoi, tuan, tong, tinh_at)
    values (r.mon, r.khoi, v_tuan, public.fn_bctk_so(jsonb_build_array(jsonb_build_object('mon', r.mon, 'khoi', r.khoi)), v_tuan)->'tong', now())
    on conflict (mon, khoi) do update set tuan = excluded.tuan, tong = excluded.tong, tinh_at = excluded.tinh_at;
    n := n + 1;
  end loop;
  return n;
end
$fn$;
revoke all on function public._bctk_hien_tai_lam_moi(int) from public, anon, authenticated;

-- Gom 'tong' của nhiều ô thành một 'tong' cùng khuôn (chỉ các số màn "Tuần này" dùng): cộng tử / mẫu rồi mới ra tỉ lệ.
create or replace function public._bctk_gom_tong(p jsonb[])
returns jsonb
language sql immutable
set search_path to 'public'
as $fn$
  with s as (
    select count(*) as n,
      sum((x #>> '{hai_chieu,nhom,dau}')::numeric) nd, sum((x #>> '{hai_chieu,nhom,con_yeu}')::numeric) nc, sum((x #>> '{hai_chieu,nhom,het_yeu}')::numeric) nh,
      sum((x #>> '{hai_chieu,nhom,phat_sinh}')::numeric) np, sum((x #>> '{hai_chieu,nhom,cuoi}')::numeric) nk, sum((x #>> '{hai_chieu,nhom,roi}')::numeric) nr,
      sum((x #>> '{hai_chieu,dang,dau}')::numeric) dd, sum((x #>> '{hai_chieu,dang,con_yeu}')::numeric) dc, sum((x #>> '{hai_chieu,dang,het_yeu}')::numeric) dh,
      sum((x #>> '{hai_chieu,dang,phat_sinh}')::numeric) dp, sum((x #>> '{hai_chieu,dang,cuoi}')::numeric) dk, sum((x #>> '{hai_chieu,dang,roi}')::numeric) dr,
      count(*) filter (where x -> 'hai_chieu' is not null and jsonb_typeof(x -> 'hai_chieu') = 'object') as co_hc,
      sum((x #>> '{hs_yeu,dau}')::numeric) h1d, sum((x #>> '{hs_yeu,cuoi}')::numeric) h1c, sum((x #>> '{hs_yeu,si_so}')::numeric) si,
      sum((x #>> '{ht,hs_yeu_2,dau}')::numeric) h2d, sum((x #>> '{ht,hs_yeu_2,cuoi}')::numeric) h2c,
      sum((x #>> '{ht,xep,yeu_1}')::numeric) y1, sum((x #>> '{ht,xep,xep_1}')::numeric) x1, sum((x #>> '{ht,xep,yeu_2}')::numeric) y2, sum((x #>> '{ht,xep,xep_2}')::numeric) x2,
      sum((x #>> '{ht,hieu_suat,don_vi}')::numeric) dv, sum((x #>> '{ht,hieu_suat,het_yeu}')::numeric) hy,
      sum((x #>> '{ht,vang,luot_xep}')::numeric) lx, sum((x #>> '{ht,vang,da_diem_danh}')::numeric) ldd, sum((x #>> '{ht,vang,vang}')::numeric) vg,
      sum((x #>> '{ht,chua_xu_ly,n1}')::numeric) c1, sum((x #>> '{ht,chua_xu_ly,n2}')::numeric) c2
    from unnest(p) t(x)
  )
  select jsonb_build_object(
    'hai_chieu', case when s.co_hc > 0 then jsonb_build_object(
        'nhom', jsonb_build_object('dau', s.nd, 'con_yeu', s.nc, 'het_yeu', s.nh, 'phat_sinh', s.np, 'cuoi', s.nk, 'roi', s.nr, 'ti_le_het_yeu', public._bctk_pct(s.nh, s.nd)),
        'dang', jsonb_build_object('dau', s.dd, 'con_yeu', s.dc, 'het_yeu', s.dh, 'phat_sinh', s.dp, 'cuoi', s.dk, 'roi', s.dr, 'ti_le_het_yeu', public._bctk_pct(s.dh, s.dd))) end,
    'hs_yeu', jsonb_build_object('dau', s.h1d, 'cuoi', s.h1c, 'giam', s.h1d - s.h1c, 'ti_le_giam', public._bctk_pct(s.h1d - s.h1c, s.h1d), 'si_so', s.si),
    'ht', jsonb_build_object(
        'hs_yeu_2', jsonb_build_object('dau', s.h2d, 'cuoi', s.h2c, 'giam', s.h2d - s.h2c, 'ti_le_giam', public._bctk_pct(s.h2d - s.h2c, s.h2d)),
        'xep', case when s.y1 is not null then jsonb_build_object('yeu_1', s.y1, 'xep_1', s.x1, 'ti_le_1', public._bctk_pct(s.x1, s.y1), 'yeu_2', s.y2, 'xep_2', s.x2, 'ti_le_2', public._bctk_pct(s.x2, s.y2)) end,
        'hieu_suat', jsonb_build_object('don_vi', coalesce(s.dv, 0), 'het_yeu', coalesce(s.hy, 0), 'ti_le', public._bctk_pct(s.hy, s.dv)),
        'vang', jsonb_build_object('luot_xep', coalesce(s.lx, 0), 'da_diem_danh', coalesce(s.ldd, 0), 'vang', coalesce(s.vg, 0), 'ti_le', public._bctk_pct(s.vg, s.ldd)),
        'chua_xu_ly', case when s.c1 is not null then jsonb_build_object('n1', s.c1, 'n2', s.c2) end))
    from s;
$fn$;
revoke all on function public._bctk_gom_tong(jsonb[]) from public, anon, authenticated;

-- MÀN "TUẦN NÀY": mọi khối của các môn tôi là trưởng bộ môn (giám đốc / toàn hệ: mọi môn) — chỉ đọc sổ, một lượt gọi.
create or replace function public.fn_bctk_hien_tai()
returns jsonb
language plpgsql stable security definer
set search_path to 'public'
as $fn$
declare
  v_tuan date := date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_mon text[];
begin
  perform public._bctk_gac_tbm();
  v_mon := public._bctk_cac_mon_toi();
  return jsonb_build_object(
    'tuan', v_tuan, 'den', v_tuan + 6,
    'mon', (select coalesce(jsonb_agg(jsonb_build_object(
              'mon', m.mon,
              'tinh_at', (select min(s.tinh_at) from bctk_so_hien_tai_o s where s.mon = m.mon and s.tuan = v_tuan),
              'tong', (select public._bctk_gom_tong(array_agg(s.tong)) from bctk_so_hien_tai_o s where s.mon = m.mon and s.tuan = v_tuan),
              'khoi', (select coalesce(jsonb_agg(jsonb_build_object(
                          'khoi', s.khoi, 'tinh_at', s.tinh_at, 'tong', s.tong,
                          'truong', (select n.ho_ten from phan_cong_quan_ly_khoi q join nhan_su n on n.id = q.nhan_su_id
                                      where q.mon = s.mon and q.khoi = s.khoi and q.vai = 'truong'))
                        order by coalesce(substring(s.khoi from '^[0-9]+')::int, 0), s.khoi), '[]'::jsonb)
                         from bctk_so_hien_tai_o s where s.mon = m.mon and s.tuan = v_tuan))
            order by m.mon), '[]'::jsonb)
              from unnest(v_mon) m(mon)));
end
$fn$;

-- Bấm MỘT khối ⇒ báo cáo đủ của khối đó cho tuần đang chạy (tính trực tiếp một ô). Trend: tuần này = số vừa tính; tuần cũ đọc sổ đã chốt, thiếu mới tính.
create or replace function public.fn_bctk_hien_tai_o(p_mon text, p_khoi text)
returns jsonb
language plpgsql stable security definer
set search_path to 'public'
as $fn$
declare
  v_tuan date := date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_o jsonb := jsonb_build_array(jsonb_build_object('mon', p_mon, 'khoi', p_khoi));
  v_so jsonb;
begin
  perform public._bctk_gac_tbm();
  if not (p_mon = any(public._bctk_cac_mon_toi())) then raise exception 'Môn ngoài phạm vi của bạn' using errcode = '42501'; end if;
  v_so := public.fn_bctk_so(v_o, v_tuan);
  return v_so
    || jsonb_build_object('trend', (
         select jsonb_agg(jsonb_build_object('tuan', w.tuan, 'tong', case when w.k = 0 then v_so->'tong' else coalesce(
                    (select s.tong from bctk_so_tuan_o s where s.tuan = w.tuan and s.mon = p_mon and s.khoi = p_khoi),
                    public.fn_bctk_so(v_o, w.tuan)->'tong') end) order by w.tuan)
           from (select k, (v_tuan - 7 * k)::date as tuan from generate_series(0, 3) k) w))
    || jsonb_build_object('van_hanh', public._bctk_van_hanh(v_o, v_tuan))
    || jsonb_build_object('thuong_dat', public._bctk_thuong_dat(v_o, v_tuan));
end
$fn$;

-- đăng ký bộ điều phối (K4): 30 phút một lượt, 6h–23h VN, 20 giây; ban đêm không ai xem nên không chạy
insert into tinh_san_dang_ky (ma, ten, lenh, chu_ky_phut, gio_chay, uu_tien, ngan_sach_giay, bat, ghi_chu) values
  ('bctk_hien_tai', 'Báo cáo tuần: số tuần đang chạy của từng khối (màn Tuần này của trưởng bộ môn / giám đốc)', 'public._bctk_hien_tai_lam_moi(20)', 30,
   array[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 75, 20, true, 'Thùy 19/11 · spec-van-hanh-tuan §5.8b · ô cũ nhất trước, ghi đè')
on conflict (ma) do nothing;
