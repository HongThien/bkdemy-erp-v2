-- ============================================================================
-- 202610071018 — thanh_tuu_moi_giai_doan_1   (áp: `node scripts/migrate.mjs --only 202610071018_thanh_tuu_moi_giai_doan_1.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy chốt 06/10 — spec-kinh-te-nhiem-vu.md §11): THÀNH TỰU = 15 loại, "đạt là đạt, không mức thấp/cao", mỗi bậc thưởng EXP riêng,
--   mỗi bậc thưởng MỘT LẦN trong mùa (reset 01/07, bảng gami_mua), KHÔNG trần xu cho nguồn thành tựu. Thay hệ ~89 thành tựu cũ (bảng `thanh_tuu`).
-- GIAI ĐOẠN 1 (migration này) — dựng KHUNG + các loại đã có nguồn dữ liệu rõ:
--   TT05 Chuỗi làm bài liên tiếp · TT06 Nhiệm vụ ngày liên tiếp · TT07 Luyện dạng yếu đạt liên tiếp · TT08 Tổng câu luyện đạt ·
--   TT09 Top 5 khối (MT tháng) · TT10 Top 1 khối · TT12 MT 10 điểm lần đầu.
--   CHƯA sẵn sàng (hiện "Sắp có", chưa có hàm đo): TT01–TT03 (BTVN/ET theo tháng — thiếu định nghĩa "làm 7 lần"/"đủ 7 bài"), TT04 (chưa có log mở app),
--   TT11 (ET 10 điểm), TT13 (100% dạng của khối cùng lúc), TT14 (bạn bè mới trong mùa — trả xu), TT15 (Master chủ đề — ẩn).
-- THIẾT KẾ: thành tựu là SỰ KIỆN THẬT (§1.5): `thanh_tuu_dat` chỉ có dòng khi đã đạt. Đạt hay chưa SUY từ lịch sử (`_tt_dat_duoc`, thuần tính, không lưu cờ);
--   `fn_thanh_tuu_chot()` ghi các bậc mới (idempotent: unique hs·mã·bậc·mùa·môn) — gọi lười khi em mở app (chưa có cron). EXP tính vào THÁNG GHI SỔ (`thang`),
--   không phải tháng đạt, để xu quy đổi (`_xu_dong_bo` chỉ nhìn tháng trước + tháng này) không bao giờ bỏ sót đợt đạt muộn.
--   `fn_exp_app_thang` cộng EXP thành tựu (không trần) vào exp_thanh_tuu ⇒ ceil MỘT lần ở fn_gami_exp_xu_thang như mọi nguồn.
-- LƯU Ý lệch spec (đã ghi, chờ Thùy): spec nói thành tựu không gắn môn (TT05/TT06) ghi vào "EXP chung" — nhưng đường xu (fn_gami_exp_xu_thang, owner postgres)
--   chỉ cấp xu cho (môn có nhiệm vụ bật); EXP không nhãn môn sẽ ra 0 xu. Nên TẠM gắn môn chính của em (môn đầu tiên bật nhiệm vụ mà em đang học).
--   Muốn đúng "chung": cần sửa fn_gami_exp_xu_thang qua SQL Editor.
-- MẤT GÌ: không xoá/sửa dữ liệu. Thay thân hàm fn_exp_app_thang (thêm nguồn thanh_tuu_dat). Bảng cũ `thanh_tuu`, `hs_thanh_tuu_thang` GIỮ NGUYÊN (không còn dùng cho thưởng).
-- ============================================================================

create table if not exists thanh_tuu_loai (
  ma text primary key,                          -- TT05…
  ten text not null,
  mo_ta text not null,
  kieu text not null check (kieu in ('thang', 'lien_tiep', 'tich_luy', 'mot_lan')),
  don_vi text not null,
  gan_mon boolean not null,
  an boolean not null default false,            -- thành tựu ẩn (TT15)
  san_sang boolean not null default false,      -- false = "Sắp có"
  thu_tu integer not null default 0
);
create table if not exists thanh_tuu_bac (
  ma text not null references thanh_tuu_loai(ma),
  bac integer not null,
  nguong integer not null,
  exp integer not null default 0,
  xu integer not null default 0,                -- TT14 trả XU thẳng
  primary key (ma, bac)
);
create table if not exists thanh_tuu_dat (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  ma text not null,
  bac integer not null,
  mua text not null references gami_mua(mua),
  mon text not null,                            -- môn nhận EXP (xem LƯU Ý ở đầu file)
  dat_at timestamptz not null,                  -- lúc thật sự đạt (thông tin)
  thang text not null,                          -- THÁNG GHI SỔ — EXP tính vào tháng này
  exp integer not null,
  xu integer not null default 0,
  chot_at timestamptz not null default now(),
  foreign key (ma, bac) references thanh_tuu_bac(ma, bac),
  unique (hoc_sinh_id, ma, bac, mua, mon)
);
create index if not exists thanh_tuu_dat_hs_idx on thanh_tuu_dat (hoc_sinh_id, thang);
comment on table thanh_tuu_dat is 'Thành tựu ĐÃ ĐẠT (sự kiện thật). Đạt/chưa suy từ lịch sử bằng _tt_dat_duoc; fn_thanh_tuu_chot ghi sổ idempotent. EXP tính vào cột thang (tháng ghi sổ).';
alter table thanh_tuu_loai enable row level security;
alter table thanh_tuu_bac enable row level security;
alter table thanh_tuu_dat enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'thanh_tuu_loai' and policyname = 'thanh_tuu_loai_doc') then
    create policy thanh_tuu_loai_doc on thanh_tuu_loai for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'thanh_tuu_bac' and policyname = 'thanh_tuu_bac_doc') then
    create policy thanh_tuu_bac_doc on thanh_tuu_bac for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'thanh_tuu_dat' and policyname = 'thanh_tuu_dat_doc') then
    create policy thanh_tuu_dat_doc on thanh_tuu_dat for select to authenticated using (hoc_sinh_id = public.my_hoc_sinh_id() or public.la_thanh_vien());
  end if;
end $$;

insert into thanh_tuu_loai (ma, ten, mo_ta, kieu, don_vi, gan_mon, an, san_sang, thu_tu) values
 ('TT01', 'Chăm làm BTVN',         'Làm BTVN 7 lần trong tháng',                                       'thang',     'lần',  true,  false, false, 10),
 ('TT02', 'BTVN đủ và giỏi',       'Làm đủ 7 BTVN và trung bình trên 80% trong tháng',                 'thang',     'bài',  true,  false, false, 20),
 ('TT03', 'ET đủ và giỏi',         'Làm đủ 7 ET và trung bình trên 80% trong tháng',                   'thang',     'bài',  true,  false, false, 30),
 ('TT04', 'Vào app liên tiếp',     'Số ngày liên tiếp mở app',                                         'lien_tiep', 'ngày', false, false, false, 40),
 ('TT05', 'Chuỗi làm bài',         'Số ngày liên tiếp có lượt luyện được tính',                        'lien_tiep', 'ngày', false, false, true,  50),
 ('TT06', 'Nhiệm vụ ngày liên tiếp','Số ngày liên tiếp hoàn thành nhiệm vụ ngày',                      'lien_tiep', 'ngày', false, false, true,  60),
 ('TT07', 'Luyện yếu đạt liên tiếp','Số lượt Luyện dạng yếu đạt liên tiếp (đúng từ 7/10 câu)',         'lien_tiep', 'lượt', true,  false, true,  70),
 ('TT08', 'Tổng câu luyện đạt',    'Tổng số câu đúng trong các lượt luyện được tính (cả mùa)',          'tich_luy',  'câu',  true,  false, true,  80),
 ('TT09', 'Top 5 khối',            'Vào top 5 khối ở Mock Test tháng',                                 'mot_lan',   'hạng', true,  false, true,  90),
 ('TT10', 'Top 1 khối',            'Đứng nhất khối ở Mock Test tháng',                                 'mot_lan',   'hạng', true,  false, true,  100),
 ('TT11', 'ET 10 điểm',            'Đạt 10 điểm bài ET lần đầu trong mùa',                             'mot_lan',   'điểm', true,  false, false, 110),
 ('TT12', 'Mock Test 10 điểm',     'Đạt 10 điểm Mock Test lần đầu trong mùa',                          'mot_lan',   'điểm', true,  false, true,  120),
 ('TT13', 'Trọn bộ dạng bài',      '100% toàn bộ dạng bài của khối cùng đạt tại một thời điểm',        'mot_lan',   'dạng', true,  false, false, 130),
 ('TT14', 'Nhiều bạn BK',          'Có thêm bạn mới ở BK trong mùa',                                   'tich_luy',  'bạn',  false, false, false, 140),
 ('TT15', 'Thành tựu ẩn',          'Master một chủ đề kiến thức',                                      'mot_lan',   'chủ đề', true, true,  false, 150)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, kieu = excluded.kieu, don_vi = excluded.don_vi, gan_mon = excluded.gan_mon,
  an = excluded.an, san_sang = excluded.san_sang, thu_tu = excluded.thu_tu;

insert into thanh_tuu_bac (ma, bac, nguong, exp, xu) values
 ('TT01', 1, 7, 150, 0), ('TT02', 1, 7, 300, 0), ('TT03', 1, 7, 300, 0),
 ('TT04', 1, 7, 30, 0), ('TT04', 2, 14, 50, 0), ('TT04', 3, 30, 80, 0), ('TT04', 4, 60, 100, 0), ('TT04', 5, 90, 150, 0), ('TT04', 6, 150, 200, 0), ('TT04', 7, 210, 250, 0), ('TT04', 8, 300, 400, 0),
 ('TT05', 1, 7, 100, 0), ('TT05', 2, 14, 200, 0), ('TT05', 3, 30, 300, 0), ('TT05', 4, 60, 400, 0), ('TT05', 5, 90, 500, 0), ('TT05', 6, 150, 600, 0), ('TT05', 7, 210, 700, 0), ('TT05', 8, 300, 800, 0),
 ('TT06', 1, 7, 100, 0), ('TT06', 2, 14, 200, 0), ('TT06', 3, 30, 500, 0), ('TT06', 4, 60, 600, 0), ('TT06', 5, 90, 800, 0),
 ('TT07', 1, 3, 200, 0), ('TT07', 2, 5, 300, 0), ('TT07', 3, 10, 1000, 0),
 ('TT08', 1, 1000, 100, 0), ('TT08', 2, 2000, 200, 0), ('TT08', 3, 5000, 300, 0), ('TT08', 4, 10000, 400, 0),
 ('TT09', 1, 5, 300, 0), ('TT10', 1, 1, 700, 0), ('TT11', 1, 10, 200, 0), ('TT12', 1, 10, 800, 0), ('TT13', 1, 1, 1000, 0),
 ('TT14', 1, 10, 0, 1), ('TT14', 2, 20, 0, 1), ('TT14', 3, 30, 0, 1), ('TT14', 4, 40, 0, 1), ('TT14', 5, 50, 0, 1),
 ('TT15', 1, 1, 1000, 0)
on conflict (ma, bac) do update set nguong = excluded.nguong, exp = excluded.exp, xu = excluded.xu;

-- Mùa hiện tại (theo gami_mua; reset 01/07): mã mùa + ngày đầu
create or replace function public._tt_mua()
returns table(mua text, tu date)
language sql stable as $$
  select m.mua, (m.thang_dau || '-01')::date
  from gami_mua m
  where to_char((now() at time zone 'Asia/Ho_Chi_Minh')::date, 'YYYY-MM') between m.thang_dau and m.thang_cuoi
  limit 1
$$;
revoke all on function public._tt_mua() from public, anon, authenticated;

-- Môn nhận EXP của thành tựu "không gắn môn": môn đầu tiên bật nhiệm vụ mà em đang học (xem LƯU Ý đầu file)
create or replace function public._tt_mon_chinh(p_hs uuid) returns text
language sql stable as $$
  select min(n.mon) from nhiem_vu_cau_hinh n
  where n.bat and exists (select 1 from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                          where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.mon = n.mon)
$$;
revoke all on function public._tt_mon_chinh(uuid) from public, anon, authenticated;

-- TOÀN BỘ bậc em đã đạt TRONG MÙA HIỆN TẠI + lúc đạt (suy từ lịch sử; thuần tính). Chỉ môn có bật nhiệm vụ.
create or replace function public._tt_dat_duoc(p_hs uuid)
returns table(ma text, bac integer, mon text, dat_at timestamptz)
language plpgsql stable as $$
declare
  v_mua text; v_tu date; v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_tu_ts timestamptz; v_den_ts timestamptz; v_mon0 text; v_j jsonb; v_so int; v_bd date; v_ym text; c record;
  v_ngay date[] := '{}';
begin
  select m.mua, m.tu into v_mua, v_tu from public._tt_mua() m;
  if v_mua is null then return; end if;
  v_tu_ts := v_tu::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_den_ts := (v_nay + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_mon0 := public._tt_mon_chinh(p_hs);

  -- TT05 Chuỗi làm bài: lấy max(chuỗi hiện tại, kỷ lục), kẹp theo số ngày của mùa; ngày đạt = ngày thứ `ngưỡng` của chuỗi hiện tại nếu có, không thì lúc ghi sổ
  if v_mon0 is not null then
    v_j := public._chuoi_cua(p_hs);
    v_so := least(greatest(coalesce((v_j->>'so_ngay')::int, 0), coalesce((v_j->>'ky_luc')::int, 0)), v_nay - v_tu + 1);
    v_bd := (v_j->>'bat_dau')::date;
    return query
      select b.ma, b.bac, v_mon0,
             least(now(), case when coalesce((v_j->>'so_ngay')::int, 0) >= b.nguong and v_bd is not null and v_bd >= v_tu
                               then ((v_bd + b.nguong)::timestamp at time zone 'Asia/Ho_Chi_Minh') else now() end)
      from thanh_tuu_bac b join thanh_tuu_loai l on l.ma = b.ma and l.san_sang
      where b.ma = 'TT05' and b.nguong <= v_so;

    -- TT06 Nhiệm vụ ngày liên tiếp (hợp các môn bật nhiệm vụ): chuỗi ngày liên tiếp dài nhất trong mùa
    for v_ym in select to_char(g, 'YYYY-MM') from generate_series(date_trunc('month', v_tu::timestamp), v_nay::timestamp, interval '1 month') g loop
      for c in select n.mon from nhiem_vu_cau_hinh n where n.bat loop
        v_ngay := v_ngay || array(select h.xong_ngay from public.fn_nhiem_vu_hoan_thanh(c.mon, v_ym, array[p_hs]) h
                                  where h.hoc_sinh_id = p_hs and h.ma = 'N' and h.xong_ngay >= v_tu);
      end loop;
    end loop;
    return query
      with d as (select distinct x as ngay from unnest(v_ngay) x),
           g as (select d.ngay, d.ngay - (row_number() over (order by d.ngay))::int as grp from d),
           runs as (select min(g.ngay) as s, count(*)::int as n from g group by g.grp)
      select b.ma, b.bac, v_mon0,
             least(now(), (((select min(r.s + b.nguong - 1) from runs r where r.n >= b.nguong) + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh'))
      from thanh_tuu_bac b join thanh_tuu_loai l on l.ma = b.ma and l.san_sang
      where b.ma = 'TT06' and exists (select 1 from runs r where r.n >= b.nguong);
  end if;

  -- TT07 Luyện dạng yếu đạt liên tiếp (theo môn): chuỗi lượt đạt dài nhất không bị lượt không đạt cắt
  return query
    with l as (
      select t.mon as m, t.nop_at, (t.tinh and t.dung >= ceil(t.so_cau * n.dat_ti_le)) as dat
      from public._luot_tinh(array[p_hs], v_tu_ts, v_den_ts) t
      join public.bai_lam bl on bl.id = t.bai_lam_id join public.bai_test bt on bt.id = bl.bai_test_id
      join nhiem_vu_cau_hinh n on n.mon = t.mon and n.bat
      -- lượt dưới ngưỡng (< 50% đúng) vẫn là một lần thử thật ⇒ CẮT chuỗi; lượt quá nhanh / quá ít câu thì bỏ qua (không phải học thật)
      where (t.tinh or t.ly_do = 'duoi_nguong') and bt.luyen_yeu and not bt.thu_thach
    ), x as (
      select l.*, row_number() over (partition by l.m order by l.nop_at) as rn,
             row_number() over (partition by l.m, l.dat order by l.nop_at) as rd from l
    ), runs as (
      select x.m, array_agg(x.nop_at order by x.nop_at) as ts from x where x.dat group by x.m, (x.rn - x.rd)
    )
    select b.ma, b.bac, r.m, min(r.ts[b.nguong])
    from thanh_tuu_bac b join thanh_tuu_loai lo on lo.ma = b.ma and lo.san_sang
    join runs r on cardinality(r.ts) >= b.nguong
    where b.ma = 'TT07' group by b.ma, b.bac, r.m;

  -- TT08 Tổng câu luyện đạt (cộng dồn cả mùa, theo môn)
  return query
    with s as (
      select t.mon as m, t.nop_at, sum(t.dung) over (partition by t.mon order by t.nop_at) as cum
      from public._luot_tinh(array[p_hs], v_tu_ts, v_den_ts) t
      join nhiem_vu_cau_hinh n on n.mon = t.mon and n.bat
      where t.tinh
    )
    select b.ma, b.bac, s.m, min(s.nop_at)
    from thanh_tuu_bac b join thanh_tuu_loai lo on lo.ma = b.ma and lo.san_sang
    join s on s.cum >= b.nguong
    where b.ma = 'TT08' group by b.ma, b.bac, s.m;

  -- TT09 / TT10 Top 5 / Top 1 khối ở Mock Test tháng (mỗi môn, mỗi tháng có MT trong mùa)
  for v_ym in select to_char(g, 'YYYY-MM') from generate_series(date_trunc('month', v_tu::timestamp), v_nay::timestamp, interval '1 month') g loop
    for c in select n.mon from nhiem_vu_cau_hinh n where n.bat loop
      return query
        select b.ma, b.bac, c.mon, (m.ngay::timestamp at time zone 'Asia/Ho_Chi_Minh')
        from public.fn_mt_hang_thang(c.mon, v_ym) m
        join thanh_tuu_bac b on (b.ma = 'TT09' and m.hang <= b.nguong) or (b.ma = 'TT10' and m.hang <= b.nguong)
        join thanh_tuu_loai lo on lo.ma = b.ma and lo.san_sang
        where m.hoc_sinh_id = p_hs and m.ngay >= v_tu;
    end loop;
  end loop;

  -- TT12 Mock Test 10 điểm lần đầu trong mùa (theo môn)
  return query
    select b.ma, b.bac, kt.mon, min(bh.ngay)::timestamp at time zone 'Asia/Ho_Chi_Minh'
    from diem_thi dt
    join ky_thi kt on kt.id = dt.ky_thi_id and kt.loai = 'mt_sat_hach'
    join buoi_hoc bh on bh.id = kt.buoi_hoc_id
    join thanh_tuu_bac b on b.ma = 'TT12' and coalesce(dt.diem, dt.diem_thi_lai) >= b.nguong
    join thanh_tuu_loai lo on lo.ma = b.ma and lo.san_sang
    join nhiem_vu_cau_hinh n on n.mon = kt.mon and n.bat
    where dt.hoc_sinh_id = p_hs and bh.ngay >= v_tu
    group by b.ma, b.bac, kt.mon;
end $$;
revoke all on function public._tt_dat_duoc(uuid) from public, anon, authenticated;

-- Ghi sổ các bậc MỚI của 1 em (idempotent). Trả các bậc vừa ghi (để app chúc mừng).
create or replace function public._tt_chot_hs(p_hs uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_mua text; v_nay_ym text := to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM'); v_moi jsonb;
begin
  select m.mua into v_mua from public._tt_mua() m;
  if v_mua is null then return '[]'::jsonb; end if;
  perform pg_advisory_xact_lock(hashtext('tt_chot:' || p_hs::text));
  with d as (
    select x.ma, x.bac, x.mon, min(x.dat_at) as dat_at from public._tt_dat_duoc(p_hs) x group by x.ma, x.bac, x.mon
  ), ghi as (
    insert into thanh_tuu_dat (hoc_sinh_id, ma, bac, mua, mon, dat_at, thang, exp, xu)
    select p_hs, d.ma, d.bac, v_mua, d.mon, d.dat_at, v_nay_ym, b.exp, b.xu
    from d join thanh_tuu_bac b on b.ma = d.ma and b.bac = d.bac
    on conflict (hoc_sinh_id, ma, bac, mua, mon) do nothing
    returning ma, bac, mon, exp, xu
  )
  select coalesce(jsonb_agg(jsonb_build_object('ma', g.ma, 'bac', g.bac, 'mon', g.mon, 'exp', g.exp, 'xu', g.xu, 'ten', l.ten) order by g.ma, g.bac), '[]'::jsonb)
    into v_moi from ghi g join thanh_tuu_loai l on l.ma = g.ma;
  return v_moi;
end $$;
revoke all on function public._tt_chot_hs(uuid) from public, anon, authenticated;

-- Em mở app ⇒ chốt thành tựu mới của chính em
create or replace function public.fn_thanh_tuu_chot() returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  return public._tt_chot_hs(v_hs);
end $$;
revoke all on function public.fn_thanh_tuu_chot() from public, anon;
grant execute on function public.fn_thanh_tuu_chot() to authenticated;

-- Tiến độ hiện tại (chỉ các loại đo được liền): TT05 chuỗi hiện tại · TT08 tổng câu luyện đạt trong mùa theo môn
create or replace function public._tt_tien_do(p_hs uuid) returns jsonb
language plpgsql stable as $$
declare v_tu date; v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date; v_mon0 text; v_out jsonb := '{}'::jsonb; v_c int;
begin
  select m.tu into v_tu from public._tt_mua() m;
  if v_tu is null then return v_out; end if;
  v_mon0 := public._tt_mon_chinh(p_hs);
  v_out := v_out || jsonb_build_object('TT05', coalesce((public._chuoi_cua(p_hs)->>'so_ngay')::int, 0));
  select coalesce(sum(t.dung), 0)::int into v_c
    from public._luot_tinh(array[p_hs], v_tu::timestamp at time zone 'Asia/Ho_Chi_Minh', (v_nay + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh') t
    where t.tinh and t.mon = v_mon0;
  return v_out || jsonb_build_object('TT08', v_c);
end $$;
revoke all on function public._tt_tien_do(uuid) from public, anon, authenticated;

-- Màn Thành tựu của em: danh mục + bậc + đã đạt (mùa hiện tại) + tiến độ. Thành tựu ẩn chưa đạt: không lộ tên/mô tả, chỉ đếm.
create or replace function public.fn_thanh_tuu_cua_toi() returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id(); v_mua text; v_td jsonb;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select m.mua into v_mua from public._tt_mua() m;
  v_td := public._tt_tien_do(v_hs);
  return jsonb_build_object(
    'mua', v_mua,
    'tien_do', v_td,
    'tong_exp_mua', coalesce((select sum(d.exp) from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.mua = v_mua), 0),
    'loai', coalesce((
      select jsonb_agg(jsonb_build_object(
        'ma', l.ma, 'ten', case when l.an and not exists (select 1 from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.ma = l.ma and d.mua = v_mua) then 'Thành tựu ẩn' else l.ten end,
        'mo_ta', case when l.an and not exists (select 1 from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.ma = l.ma and d.mua = v_mua) then 'Hãy khám phá để mở khoá' else l.mo_ta end,
        'kieu', l.kieu, 'don_vi', l.don_vi, 'an', l.an, 'san_sang', l.san_sang,
        'tien_do', v_td->l.ma,
        'bac', (select coalesce(jsonb_agg(jsonb_build_object('bac', b.bac, 'nguong', b.nguong, 'exp', b.exp, 'xu', b.xu,
                  'dat', exists (select 1 from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.ma = b.ma and d.bac = b.bac and d.mua = v_mua),
                  'dat_at', (select min(d.dat_at) from thanh_tuu_dat d where d.hoc_sinh_id = v_hs and d.ma = b.ma and d.bac = b.bac and d.mua = v_mua)) order by b.bac), '[]'::jsonb)
                from thanh_tuu_bac b where b.ma = l.ma)
      ) order by l.thu_tu) from thanh_tuu_loai l), '[]'::jsonb));
end $$;
revoke all on function public.fn_thanh_tuu_cua_toi() from public, anon;
grant execute on function public.fn_thanh_tuu_cua_toi() to authenticated;

-- EXP trên app theo nguồn (giữ trần nhiệm vụ 2.000 · vòng quay 1.000 như mig 202610061915) + EXP THÀNH TỰU (không trần, theo THÁNG GHI SỔ)
create or replace function public.fn_exp_app_thang(p_ym text, p_hs uuid default null, p_mon text default null)
returns table(hoc_sinh_id uuid, mon text, exp_nhiem_vu integer, exp_may_man integer, exp_app integer, exp_thanh_tuu integer)
language plpgsql stable as $$
declare c record;
begin
  for c in select n.* from nhiem_vu_cau_hinh n where n.bat and (p_mon is null or n.mon = p_mon) loop
    return query
    with nv as (
      select n.hoc_sinh_id, n.exp from public.fn_nhiem_vu_chang_thang(c.mon, p_ym, case when p_hs is null then null else array[p_hs] end) n
    ), mm as (
      select m.hoc_sinh_id, least(c.tran_exp_vong_quay, sum(m.exp))::int as exp from may_man_hs_luot m
      where m.mon = c.mon and m.ngay >= c.bat_dau and to_char(m.ngay, 'YYYY-MM') = p_ym and (p_hs is null or m.hoc_sinh_id = p_hs)
      group by m.hoc_sinh_id
    ), tt as (   -- huy hiệu sao (từ 06/10 = 0) + thành tựu mới (không trần)
      select z.hoc_sinh_id, sum(z.exp)::int as exp from (
        select d.hoc_sinh_id, s.exp from hs_huy_hieu_dat d
        join huy_hieu_thang_sao s on s.mon = d.mon and s.sao = d.sao
        where d.mon = c.mon and to_char(d.dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = p_ym and (p_hs is null or d.hoc_sinh_id = p_hs)
        union all
        select t.hoc_sinh_id, t.exp from thanh_tuu_dat t
        where t.mon = c.mon and t.thang = p_ym and (p_hs is null or t.hoc_sinh_id = p_hs)
      ) z group by z.hoc_sinh_id
    ), ids as (select nv.hoc_sinh_id from nv union select mm.hoc_sinh_id from mm union select tt.hoc_sinh_id from tt)
    select ids.hoc_sinh_id, c.mon, coalesce(nv.exp, 0), coalesce(mm.exp, 0),
           coalesce(nv.exp, 0) + coalesce(mm.exp, 0) + coalesce(tt.exp, 0), coalesce(tt.exp, 0)
    from ids left join nv on nv.hoc_sinh_id = ids.hoc_sinh_id left join mm on mm.hoc_sinh_id = ids.hoc_sinh_id
    left join tt on tt.hoc_sinh_id = ids.hoc_sinh_id
    where coalesce(nv.exp, 0) + coalesce(mm.exp, 0) + coalesce(tt.exp, 0) > 0;
  end loop;
end $$;
