-- BÁO CÁO TUẦN TRƯỞNG KHỐI — Pha P2 (spec-bao-cao-tuan.md, Thùy chốt 03/11).
-- Kỳ = T2 → CN tuần trước. Nháp: số tính TRỰC TIẾP (cùng hàm). Bấm NỘP: tính + ghi SNAP trong cùng transaction — từ đó không tính lại.
-- Một báo cáo / (người báo cáo × tuần), gồm mọi ô (môn × khối) người đó là TRƯỞNG + (nếu là trưởng bộ môn) các ô của môn chưa có trưởng khối.
-- Mọi chỉ số tính ở fn_bctk_so — MỘT nguồn cho báo cáo, trend, (P3) tổng môn. Tỉ lệ tính ở _bctk_nhom — một chỗ công thức tỉ lệ.
-- Nguồn tái dùng: ET đúng hạn = lần đóng đầu ≤ hạn (_viec_dong_dau, như Gậy) · điểm ET/BTVN theo lượt = _troly_matrix (nguồn bảng Học tập
-- tuần) · dạng yếu đầu/cuối = ảnh dang_yeu_dau_tuan (chụp tự động T2 00:00, mig 202611031346) · Vào/Ra/Độ phủ = cùng logic fn_qlcl_dong_chay
-- nhưng theo đúng 2 tuần của kỳ · bổ trợ Yếu + Nhẹ quy môn qua ca_bo_tro / ca_bo_tro_nhe (bù · đuổi · ôn thi chưa đưa vào — Thùy 03/11).
-- Bảng chỉ đi qua RPC security definer (RLS bật, không policy cho authenticated).

create table public.bao_cao_tuan_khoi (
  id uuid primary key default gen_random_uuid(),
  tuan date not null check (extract(isodow from tuan) = 1),          -- thứ 2 đầu kỳ
  nguoi_bao_cao uuid not null references public.nhan_su(id),
  trang_thai text not null default 'nhap' check (trang_thai in ('nhap', 'da_nop', 'tra_lai', 'da_duyet')),
  o jsonb not null default '[]'::jsonb,                               -- [{mon, khoi}] ô báo cáo (chốt lúc nộp)
  so jsonb,                                                            -- SNAP phần số; NULL = không áp dụng (còn nháp)
  ca_nhan jsonb not null default '[]'::jsonb,                         -- task phát triển: nháp = các ô người điền · đã nộp = snap đầy đủ
  tu_viet jsonb not null default '{}'::jsonb,                         -- {nhan_dinh, uu_tien[], can_ho_tro}
  phien_ban integer not null default 1,                               -- phiên bản công thức fn_bctk_so lúc snap
  nop_at timestamptz,
  tre boolean,
  xu_ly_boi uuid references public.nhan_su(id),
  xu_ly_at timestamptz,
  tra_lai_ly_do text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tuan, nguoi_bao_cao),
  check (trang_thai = 'nhap' or (so is not null and nop_at is not null and tre is not null))
);
alter table public.bao_cao_tuan_khoi enable row level security;

create table public.bao_cao_tuan_khoi_log (
  id bigint generated always as identity primary key,
  bao_cao_id uuid not null references public.bao_cao_tuan_khoi(id),
  tu text,
  den text not null,
  nguoi uuid,
  ghi_chu text,
  at timestamptz not null default now()
);
alter table public.bao_cao_tuan_khoi_log enable row level security;

-- Mọi đổi trạng thái tự ghi vết (CLAUDE.md §4) — app không phải nhớ ghi log.
create or replace function public._bctk_ghi_log()
 returns trigger language plpgsql security definer set search_path to 'public'
as $$
begin
  if tg_op = 'INSERT' or old.trang_thai is distinct from new.trang_thai then
    insert into bao_cao_tuan_khoi_log (bao_cao_id, tu, den, nguoi, ghi_chu)
    values (new.id, case when tg_op = 'UPDATE' then old.trang_thai end, new.trang_thai, public.current_nhan_su_id(),
            case when new.trang_thai = 'tra_lai' then new.tra_lai_ly_do end);
  end if;
  return new;
end $$;
create trigger bao_cao_tuan_khoi_log_trg after insert or update of trang_thai on public.bao_cao_tuan_khoi
  for each row execute function public._bctk_ghi_log();

-- ── Mốc ──
create or replace function public._bctk_tuan_truoc()
 returns date language sql stable
as $$ select date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date - 7 $$;

-- Hạn nộp = 17:00 thứ 2 tuần sau kỳ (spec §5 "bàn sau": đề xuất 17:00 — đổi ở đây là đổi mọi nơi).
create or replace function public._bctk_han(p_tuan date)
 returns timestamptz language sql immutable
as $$ select ((p_tuan + 7)::timestamp + interval '17 hours') at time zone 'Asia/Ho_Chi_Minh' $$;

-- Ô tôi báo cáo: ô tôi là TRƯỞNG + (trưởng bộ môn) ô của môn mình chưa có trưởng khối (spec §2.2, Thùy 03/11).
create or replace function public._bctk_o_cua_toi()
 returns jsonb language sql stable security definer set search_path to 'public'
as $$
  with tk as (
    select q.mon, q.khoi from phan_cong_quan_ly_khoi q where q.nhan_su_id = public.current_nhan_su_id() and q.vai = 'truong'
  ),
  mo_coi as (
    select distinct l.mon, l.khoi from lop l
     where public._phong_mon_cua_toi() is not null and l.mon = any(public._phong_mon_cua_toi())
       and l.trang_thai = 'dang_hoc' and l.khoi is not null
       and not exists (select 1 from phan_cong_quan_ly_khoi q join nhan_su n on n.id = q.nhan_su_id and n.trang_thai = 'dang_lam'
                        where q.mon = l.mon and q.khoi = l.khoi and q.vai = 'truong')
  )
  select coalesce(jsonb_agg(jsonb_build_object('mon', x.mon, 'khoi', x.khoi)
                  order by x.mon, coalesce(substring(x.khoi from '^[0-9]+')::int, 0), x.khoi), '[]'::jsonb)
    from (select * from tk union select * from mo_coi) x
$$;

-- Tỉ lệ % (một chỗ công thức). NULL = không áp dụng (mẫu số 0 — không có việc / không có ảnh), không phải 0%.
create or replace function public._bctk_pct(a numeric, b numeric)
 returns numeric language sql immutable
as $$ select case when b is null or b = 0 or a is null then null else round(100.0 * a / b, 1) end $$;

-- Gói chỉ số của một phạm vi (một lớp / cả khối) từ các số đếm thô — MỘT chỗ cho mọi tỉ lệ.
create or replace function public._bctk_nhom(
  et_viec bigint, et_dung bigint, et_luot bigint, et_tb numeric,
  bt_can bigint, bt_dung bigint, bt_muon bigint, bt_luot bigint, bt_tb numeric,
  dy_dau bigint, dy_cuoi bigint, hy_dau bigint, hy_cuoi bigint, si_so bigint)
 returns jsonb language sql immutable
as $$
  select jsonb_build_object(
    'et', jsonb_build_object('so_viec', et_viec, 'dung_han', et_dung, 'ti_le_dung_han', public._bctk_pct(et_dung, et_viec),
                             'so_luot', et_luot, 'diem_tb', et_tb),
    'btvn', jsonb_build_object('can_nop', bt_can, 'dung_han', bt_dung, 'muon', bt_muon,
                               'ti_le_nop', public._bctk_pct(bt_dung + bt_muon, bt_can), 'ti_le_dung_han', public._bctk_pct(bt_dung, bt_can),
                               'so_luot', bt_luot, 'diem_tb', bt_tb),
    'dang_yeu', jsonb_build_object('dau', dy_dau, 'cuoi', dy_cuoi, 'giam', dy_dau - dy_cuoi, 'ti_le_giam', public._bctk_pct(dy_dau - dy_cuoi, dy_dau)),
    'hs_yeu', jsonb_build_object('dau', hy_dau, 'cuoi', hy_cuoi, 'giam', hy_dau - hy_cuoi, 'ti_le_giam', public._bctk_pct(hy_dau - hy_cuoi, hy_dau),
                                 'si_so', si_so))
$$;

-- ── 6 NHÓM CHỈ SỐ của các ô p_o trong kỳ p_tu → p_tu+6 (toàn khối + từng lớp + HS còn yếu) ──
create or replace function public.fn_bctk_so(p_o jsonb, p_tu date)
 returns jsonb language plpgsql stable security definer set search_path to 'public'
as $$
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
      from public.fn_viec_buoi_thuong(p_tu, v_den, true) v
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
end $$;

-- ── 6. TREND 4 tuần gần nhất (kỳ này + 3 tuần trước), theo khối ──
-- Tuần đã có báo cáo nộp của tôi ⇒ lấy số đã snap; chưa có ⇒ tính bằng chính fn_bctk_so (dạng yếu chỉ có từ khi có ảnh — Thùy 03/11 không tính ngược).
create or replace function public.fn_bctk_trend(p_o jsonb, p_tu date)
 returns jsonb language sql stable security definer set search_path to 'public'
as $$
  select coalesce(jsonb_agg(jsonb_build_object('tuan', w.tuan, 'tong', coalesce(
            (select r.so->'tong' from bao_cao_tuan_khoi r
              where r.tuan = w.tuan and r.nguoi_bao_cao = public.current_nhan_su_id() and r.trang_thai <> 'nhap'),
            public.fn_bctk_so(p_o, w.tuan)->'tong')) order by w.tuan), '[]'::jsonb)
    from (select (p_tu - 7 * k)::date as tuan from generate_series(0, 3) k) w
$$;

-- Danh sách task phát triển của tôi cho phần CÁ NHÂN: task đã được NGƯỜI GIAO duyệt (trong kỳ) ⇒ tự điền + khoá; còn lại lấy ô người điền ở nháp.
create or replace function public._bctk_ca_nhan(p_ns uuid, p_tu date, p_nhap jsonb)
 returns jsonb language sql stable security definer set search_path to 'public'
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
      'task_id', t.id, 'tieu_de', t.tieu_de, 'han', t.han, 'so_lan_gia_han', t.so_lan_gia_han, 'trang_thai_task', t.trang_thai,
      'tu_dien', t.trang_thai = 'da_duyet',
      'trang_thai', case when t.trang_thai = 'da_duyet' then 'Hoàn thành'
                         else coalesce(nullif(d.x->>'trang_thai', ''), case t.trang_thai when 'cho_duyet' then 'Chờ duyệt' else 'Đang làm' end) end,
      'mo_ta', case when t.trang_thai = 'da_duyet' then coalesce(t.nhan_xet, '') else coalesce(d.x->>'mo_ta', '') end,
      'pct', case when t.trang_thai = 'da_duyet' then t.ket_qua_pct else nullif(d.x->>'pct', '')::numeric end)
      order by (t.trang_thai = 'da_duyet'), t.han), '[]'::jsonb)
    from task_phat_trien t
    left join lateral (select x from jsonb_array_elements(coalesce(p_nhap, '[]'::jsonb)) x where x->>'task_id' = t.id::text limit 1) d on true
   where t.nguoi_lam_id = p_ns
     and (t.trang_thai in ('dang_lam', 'cho_duyet')
          or (t.trang_thai = 'da_duyet' and (t.dong_at at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_tu + 6))
$$;

-- Chỉ giữ các ô người được điền ở phần cá nhân (không tin client gửi tiêu đề / hạn / tự điền).
create or replace function public._bctk_loc_nhap(p jsonb)
 returns jsonb language sql immutable
as $$
  select coalesce(jsonb_agg(jsonb_build_object('task_id', x->>'task_id', 'trang_thai', coalesce(x->>'trang_thai', ''),
                                               'mo_ta', coalesce(x->>'mo_ta', ''), 'pct', x->>'pct')), '[]'::jsonb)
    from jsonb_array_elements(coalesce(p, '[]'::jsonb)) x where x ? 'task_id'
$$;

-- ── Đọc báo cáo của tôi cho 1 tuần (mặc định tuần trước) ──
create or replace function public.fn_bctk_lay(p_tuan date default null)
 returns jsonb language plpgsql stable security definer set search_path to 'public'
as $$
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
    'so', case when v_snap then r.so else public.fn_bctk_so(v_o, v_tuan) || jsonb_build_object('trend', public.fn_bctk_trend(v_o, v_tuan)) end,
    'ca_nhan', case when v_snap then r.ca_nhan else public._bctk_ca_nhan(v_me, v_tuan, r.ca_nhan) end,
    'tu_viet', coalesce(r.tu_viet, '{}'::jsonb),
    'nop_at', r.nop_at, 'tre', r.tre, 'tra_lai_ly_do', r.tra_lai_ly_do);
end $$;

-- ── Lưu nháp (nháp hoặc bị trả lại: chỉ phần chữ / phần cá nhân; số đã snap không đổi) ──
create or replace function public.fn_bctk_luu_nhap(p_tuan date, p_ca_nhan jsonb, p_tu_viet jsonb)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
declare
  v_me uuid := public.current_nhan_su_id();
  r bao_cao_tuan_khoi%rowtype;
begin
  if v_me is null then raise exception 'Chưa đăng nhập' using errcode = '42501'; end if;
  if jsonb_array_length(public._bctk_o_cua_toi()) = 0 and not exists (select 1 from bao_cao_tuan_khoi where tuan = p_tuan and nguoi_bao_cao = v_me) then
    raise exception 'Bạn không có khối nào để báo cáo';
  end if;
  select * into r from bao_cao_tuan_khoi where tuan = p_tuan and nguoi_bao_cao = v_me for update;
  if not found then
    insert into bao_cao_tuan_khoi (tuan, nguoi_bao_cao, o, ca_nhan, tu_viet)
    values (p_tuan, v_me, public._bctk_o_cua_toi(), public._bctk_loc_nhap(p_ca_nhan), coalesce(p_tu_viet, '{}'::jsonb));
  elsif r.trang_thai = 'nhap' then
    update bao_cao_tuan_khoi set ca_nhan = public._bctk_loc_nhap(p_ca_nhan), tu_viet = coalesce(p_tu_viet, '{}'::jsonb), updated_at = now()
     where id = r.id;
  elsif r.trang_thai = 'tra_lai' then   -- danh sách task đã snap: chỉ cập nhật các ô người điền theo task_id
    update bao_cao_tuan_khoi set
      ca_nhan = (select coalesce(jsonb_agg(case when (s->>'tu_dien')::boolean or d.x is null then s
                    else s || jsonb_build_object('trang_thai', d.x->>'trang_thai', 'mo_ta', d.x->>'mo_ta', 'pct', nullif(d.x->>'pct', '')::numeric) end), '[]'::jsonb)
                   from jsonb_array_elements(r.ca_nhan) s
                   left join lateral (select x from jsonb_array_elements(public._bctk_loc_nhap(p_ca_nhan)) x where x->>'task_id' = s->>'task_id' limit 1) d on true),
      tu_viet = coalesce(p_tu_viet, '{}'::jsonb), updated_at = now()
     where id = r.id;
  else
    raise exception 'Báo cáo đã nộp — không sửa được nữa';
  end if;
  return jsonb_build_object('ok', true);
end $$;

-- ── NỘP: tính + SNAP trong cùng transaction (nháp) · nộp lại sau khi bị trả lại (số giữ bản snap) ──
create or replace function public.fn_bctk_nop(p_tuan date, p_ca_nhan jsonb, p_tu_viet jsonb)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $$
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
      so = public.fn_bctk_so(v_o, p_tuan) || jsonb_build_object('trend', public.fn_bctk_trend(v_o, p_tuan)),
      ca_nhan = public._bctk_ca_nhan(v_me, p_tuan, r.ca_nhan),
      phien_ban = 1, nop_at = now(), tre = now() > public._bctk_han(p_tuan), updated_at = now()
     where id = r.id;
  end if;
  return public.fn_bctk_lay(p_tuan);
end $$;

revoke execute on function public._bctk_ghi_log() from public, anon, authenticated;
revoke execute on function public._bctk_o_cua_toi() from public, anon;
revoke execute on function public.fn_bctk_so(jsonb, date) from public, anon, authenticated;
revoke execute on function public.fn_bctk_trend(jsonb, date) from public, anon, authenticated;
revoke execute on function public._bctk_ca_nhan(uuid, date, jsonb) from public, anon, authenticated;
revoke execute on function public.fn_bctk_lay(date) from public, anon;
revoke execute on function public.fn_bctk_luu_nhap(date, jsonb, jsonb) from public, anon;
revoke execute on function public.fn_bctk_nop(date, jsonb, jsonb) from public, anon;
grant execute on function public.fn_bctk_lay(date) to authenticated;
grant execute on function public.fn_bctk_luu_nhap(date, jsonb, jsonb) to authenticated;
grant execute on function public.fn_bctk_nop(date, jsonb, jsonb) to authenticated;
