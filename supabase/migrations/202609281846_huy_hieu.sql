-- ============================================================================
-- 202609281846 — huy_hieu
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Huy hiệu phase 1 môn Toán (spec-thanh-tuu-nhiem-vu.md §0.7 + spec-huy-hieu-build.md — Thùy chốt 28/09):
--   8 huy hiệu Hy Lạp · sao = 1/2/4/6/9 tháng trong năm huy hiệu (tháng 7 → 4) · ★1–3 đếm tháng ĐẠT CHUẨN, ★4–5 đếm tháng HOÀN HẢO ·
--   thành tựu ↔ huy hiệu N–N (bảng nối vai chuan/them = màn Ma trận) · ★4–5 có bản cứng, GV lớp trao · đạt rồi không mất ·
--   mùa sau đạt lại ⇒ lan = 2, 3… (bản cứng chỉ lần đầu) · tính lùi từ 07/2026, điều kiện của tính năng chưa mở = không áp dụng.
--   - fn_thanh_tuu_thang = 1 hàm đo chung, dispatch theo loai_chi_so; ngưỡng ở tham_so (bảng), không viết cứng.
--   - CHỐT tháng T từ 10/T+1 (cửa sổ MT đóng): ghi hs_thanh_tuu_thang 1 lần (idempotent, không thu hồi) → sao mới → hs_huy_hieu_dat.
--     Trước chốt: tạm tính động. Không có pg_cron ⇒ nhân sự gọi fn_huy_hieu_chot_thang (gắn vào màn Chốt xu).
--   - Đo BTVN đúng: gami_grades phase btvn (btvn_ket_qua.ti_le_dung đang rỗng 100% — đo 28/09); BTVN online đã mirror vào gami_grades.
--   - EXP huy hiệu (★3/4/5 = 100/200/300) vào EXP app của THÁNG ĐẠT (fn_exp_app_thang) ⇒ chung trần 30 xu app.
--   - Ghim khoe + catalog cũ thanh_tich_loai: CHƯA đụng (đổi FK / tắt catalog cũ = thay đổi bảng đang dùng ⇒ làm riêng khi làm màn khoe C11).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   drop function fn_exp_app_thang(text, uuid, text) rồi tạo lại NGAY (thêm cột exp_thanh_tuu) — không mất dữ liệu.
-- ============================================================================

-- ---------- 1. Catalog ----------
create table if not exists thanh_tuu (
  mon          text not null,
  key          text not null,
  ten          text not null,
  loai_chi_so  text not null check (loai_chi_so in ('diem_danh_du', 'btvn_dung_han_du', 'tu_luyen_cau_dung', 'thu_thach_ngay_pass',
                 'thu_thach_luot_full', 'et_ti_le_bai', 'mt_top_pct', 'btvn_ti_le_tb', 'mt_hon_moc', 'lap_lo', 'dua_thang_top_pct')),
  tham_so      jsonb not null default '{}',
  mo_tu        date,     -- tháng kết thúc trước ngày này ⇒ 'khong_ap_dung' (tính năng chưa mở). NULL = luôn áp dụng
  active       boolean not null default true,
  thu_tu       integer not null default 0,
  primary key (mon, key)
);
comment on table thanh_tuu is 'THÀNH TỰU = 1 điều kiện đo được trong 1 tháng (spec-huy-hieu-build.md §3). Đo bằng fn_thanh_tuu_thang theo loai_chi_so + tham_so.';

create table if not exists huy_hieu (
  mon         text not null,
  key         text not null,
  ten         text not null,
  bieu_tuong  text not null,
  ghi_nhan    text not null,
  cau_chuyen  text,
  thu_tu      integer not null default 0,
  active      boolean not null default true,
  primary key (mon, key)
);
comment on table huy_hieu is 'Huy hiệu (bộ Hy Lạp phase 1). Mỗi huy hiệu 5 sao theo huy_hieu_thang_sao.';

create table if not exists huy_hieu_dieu_kien (
  mon            text not null,
  huy_hieu_key   text not null,
  thanh_tuu_key  text not null,
  vai            text not null check (vai in ('chuan', 'them')),
  primary key (mon, huy_hieu_key, thanh_tuu_key),
  foreign key (mon, huy_hieu_key) references huy_hieu(mon, key),
  foreign key (mon, thanh_tuu_key) references thanh_tuu(mon, key)
);
comment on table huy_hieu_dieu_kien is 'Bảng nối N–N = màn Ma trận. chuan: điều kiện tháng đạt chuẩn (★1–5) · them: điều kiện thêm cho tháng hoàn hảo (★4–5).';

create table if not exists huy_hieu_thang_sao (
  mon         text not null,
  sao         smallint not null check (sao between 1 and 5),
  so_thang    integer not null,
  loai_thang  text not null check (loai_thang in ('chuan', 'hoan_hao')),
  ban_cung    boolean not null,
  exp         integer not null,
  primary key (mon, sao)
);

-- ---------- 2. Kết quả (chỉ ghi lúc chốt — dòng thật) ----------
create table if not exists hs_thanh_tuu_thang (
  hoc_sinh_id    uuid not null references hoc_sinh(id),
  mon            text not null,
  thang          text not null check (thang ~ '^\d{4}-\d{2}$'),
  thanh_tuu_key  text not null,
  ket_qua        text not null check (ket_qua in ('dat', 'khong_dat', 'khong_ap_dung')),
  chot_at        timestamptz not null default now(),
  chot_boi       uuid references nhan_su(id),
  primary key (hoc_sinh_id, mon, thang, thanh_tuu_key)
);
comment on table hs_thanh_tuu_thang is 'Kết quả thành tựu ĐÃ CHỐT của 1 tháng (ghi 1 lần, không thu hồi). khong_dat là kết quả thật, không phải chưa đo. Không có dòng cho tháng em không học.';
create index if not exists hs_thanh_tuu_thang_mon_thang on hs_thanh_tuu_thang (mon, thang);

create table if not exists hs_huy_hieu_dat (
  id            uuid primary key default gen_random_uuid(),
  hoc_sinh_id   uuid not null references hoc_sinh(id),
  mon           text not null,
  huy_hieu_key  text not null,
  sao           smallint not null check (sao between 1 and 5),
  mua           text not null references gami_mua(mua),
  lan           integer not null check (lan >= 1),
  thang_chot    text not null,
  dat_at        timestamptz not null default now(),
  unique (hoc_sinh_id, mon, huy_hieu_key, sao, mua),
  foreign key (mon, huy_hieu_key) references huy_hieu(mon, key)
);
comment on table hs_huy_hieu_dat is 'Huy hiệu × sao đã đạt (append-only). lan = lần đạt sao này qua các mùa (H8: bản mềm ×lan, bản cứng chỉ lan = 1).';

create table if not exists hs_huy_hieu_trao (
  dat_id     uuid primary key references hs_huy_hieu_dat(id),
  trao_at    timestamptz not null default now(),
  trao_boi   uuid not null references nhan_su(id)
);
comment on table hs_huy_hieu_trao is 'GV đã trao BẢN CỨNG. Việc trao còn treo = đạt sao có bản cứng, lan = 1, TRỪ dòng ở đây (suy động §4).';

do $$ declare t text; begin
  foreach t in array array['thanh_tuu', 'huy_hieu', 'huy_hieu_dieu_kien', 'huy_hieu_thang_sao', 'hs_thanh_tuu_thang', 'hs_huy_hieu_dat', 'hs_huy_hieu_trao'] loop
    execute format('alter table %I enable row level security', t);
    if not exists (select 1 from pg_policies where tablename = t and policyname = t || '_member_all') then
      execute format('create policy %I on %I for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())', t || '_member_all', t);
    end if;
  end loop;
end $$;

-- ---------- 3. Seed (đúng ma-tran-thanh-tuu-huy-hieu.xlsx) ----------
insert into thanh_tuu (mon, key, ten, loai_chi_so, tham_so, mo_tu, thu_tu) values
  ('Toán', 'A1',  'Không vắng buổi nào trong tháng',              'diem_danh_du',        '{}', null, 1),
  ('Toán', 'A2',  'Nộp đủ, đúng hạn mọi BTVN trong tháng',          'btvn_dung_han_du',    '{}', null, 2),
  ('Toán', 'A4',  'Tự luyện ≥ 200 câu đúng trong tháng',            'tu_luyen_cau_dung',   '{"n": 200}', null, 3),
  ('Toán', 'A5',  'Vượt Thử thách ≥ 10 ngày trong tháng',           'thu_thach_ngay_pass', '{"n": 10}', date '2026-10-01', 4),
  ('Toán', 'A6',  'Vượt Thử thách ≥ 15 ngày trong tháng',           'thu_thach_ngay_pass', '{"n": 15}', date '2026-10-01', 5),
  ('Toán', 'B1',  'ET đúng ≥ 80% ở ≥ ¾ số bài ET trong tháng',      'et_ti_le_bai',        '{"ti_le": 0.8, "phan": 0.75}', null, 6),
  ('Toán', 'B2',  'MT top 30% khối',                                'mt_top_pct',          '{"pct": 0.3}', null, 7),
  ('Toán', 'B4',  'BTVN đúng trung bình ≥ 85% trong tháng',         'btvn_ti_le_tb',       '{"ti_le": 0.85}', null, 8),
  ('Toán', 'B5',  'BTVN đúng trung bình ≥ 90% trong tháng',         'btvn_ti_le_tb',       '{"ti_le": 0.9}', null, 9),
  ('Toán', 'B6',  '≥ 5 lượt Thử thách đúng hết trong tháng',        'thu_thach_luot_full', '{"n": 5}', date '2026-10-01', 10),
  ('Toán', 'P1',  'Hạng MT tốt hơn tháng đầu năm (hoặc top 10%)',   'mt_hon_moc',          '{"top_pct": 0.1}', null, 11),
  ('Toán', 'C3',  'Lấp ≥ 1 lỗ (dạng yếu → đạt), hoặc không còn dạng yếu', 'lap_lo',        '{}', null, 12),
  ('Toán', 'D30', 'Top 30% Bảng đua tháng (khối)',                  'dua_thang_top_pct',   '{"pct": 0.3}', null, 13),
  ('Toán', 'D10', 'Top 10% Bảng đua tháng (khối)',                  'dua_thang_top_pct',   '{"pct": 0.1}', null, 14)
on conflict do nothing;

insert into huy_hieu (mon, key, ten, bieu_tuong, ghi_nhan, cau_chuyen, thu_tu) values
  ('Toán', 'helios',     'Helios',     '☀️', 'Chuyên cần — đi học không nghỉ',   'Thần Mặt Trời — ngày nào cũng mọc, chưa từng nghỉ', 1),
  ('Toán', 'chronos',    'Chronos',    '⏳', 'Nộp BTVN đủ, đúng hạn',            'Thần Thời Gian', 2),
  ('Toán', 'athena',     'Athena',     '🦉', 'Làm tốt bài ET trên lớp',          'Nữ thần Trí Tuệ', 3),
  ('Toán', 'zeus',       'Zeus',       '⚡', 'MT top khối',                      'Vua các vị thần, đứng trên đỉnh Olympus', 4),
  ('Toán', 'phoenix',    'Phoenix',    '🔥', 'Hạng MT bứt phá so với đầu năm',   'Phượng hoàng tái sinh từ tro, bay vút lên', 5),
  ('Toán', 'hercules',   'Hercules',   '💪', 'Vượt Thử thách mỗi ngày',          '12 kỳ công — 12 thử thách', 6),
  ('Toán', 'hephaestus', 'Hephaestus', '🔨', 'Lấp lỗ: dạng yếu → đạt',           'Thần thợ rèn — rèn lại chỗ hỏng', 7),
  ('Toán', 'nike',       'Nike',       '🏅', 'Top Bảng đua tháng',               'Nữ thần Chiến Thắng', 8)
on conflict do nothing;

insert into huy_hieu_dieu_kien (mon, huy_hieu_key, thanh_tuu_key, vai) values
  ('Toán', 'helios', 'A1', 'chuan'), ('Toán', 'helios', 'A2', 'them'), ('Toán', 'helios', 'A6', 'them'),
  ('Toán', 'chronos', 'A2', 'chuan'), ('Toán', 'chronos', 'A1', 'them'), ('Toán', 'chronos', 'A4', 'them'),
  ('Toán', 'athena', 'B1', 'chuan'), ('Toán', 'athena', 'A2', 'them'), ('Toán', 'athena', 'B4', 'them'),
  ('Toán', 'zeus', 'B2', 'chuan'), ('Toán', 'zeus', 'B1', 'them'), ('Toán', 'zeus', 'B5', 'them'),
  ('Toán', 'phoenix', 'P1', 'chuan'), ('Toán', 'phoenix', 'A2', 'them'), ('Toán', 'phoenix', 'A1', 'them'),
  ('Toán', 'hercules', 'A5', 'chuan'), ('Toán', 'hercules', 'A6', 'them'), ('Toán', 'hercules', 'B6', 'them'), ('Toán', 'hercules', 'A2', 'them'),
  ('Toán', 'hephaestus', 'C3', 'chuan'), ('Toán', 'hephaestus', 'A2', 'them'), ('Toán', 'hephaestus', 'A5', 'them'),
  ('Toán', 'nike', 'D30', 'chuan'), ('Toán', 'nike', 'D10', 'them'), ('Toán', 'nike', 'A1', 'them'), ('Toán', 'nike', 'A2', 'them')
on conflict do nothing;

insert into huy_hieu_thang_sao (mon, sao, so_thang, loai_thang, ban_cung, exp) values
  ('Toán', 1, 1, 'chuan', false, 0), ('Toán', 2, 2, 'chuan', false, 0), ('Toán', 3, 4, 'chuan', false, 100),
  ('Toán', 4, 6, 'hoan_hao', true, 200), ('Toán', 5, 9, 'hoan_hao', true, 300)
on conflict do nothing;

-- ---------- 4. Đo thành tựu 1 tháng (hàm chung, dispatch theo loai_chi_so) ----------
create or replace function public.fn_thanh_tuu_thang(p_mon text, p_ym text, p_hs uuid[] default null)
returns table(hoc_sinh_id uuid, thanh_tuu_key text, ket_qua text)
language plpgsql as $$   -- volatile: dùng bảng tạm
declare
  v_ms date := (p_ym || '-01')::date;
  v_me date := ((p_ym || '-01')::date + interval '1 month')::date - 1;
  v_tu timestamptz := (p_ym || '-01')::date::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_den timestamptz := (((p_ym || '-01')::date + interval '1 month')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_mua record; v_hs uuid[]; v_dangs text[]; v_khoi text; v_ym text;
begin
  select * into v_mua from gami_mua where p_ym between thang_dau and thang_cuoi limit 1;
  -- em "học tháng đó" = có dòng điểm danh ở buổi lớp môn trong tháng
  select array_agg(distinct h.hoc_sinh_id) into v_hs
  from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id join lop l on l.id = b.lop_id
  where l.mon = p_mon and b.ngay between v_ms and v_me and b.trang_thai <> 'huy'
    and (p_hs is null or h.hoc_sinh_id = any(p_hs));
  if v_hs is null then return; end if;
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt')) into v_dangs;

  -- Bảng đua tháng: chỉ các khối có em trong danh sách (1 HS ⇒ 1 khối)
  create temp table _dua (hoc_sinh_id uuid, hang integer, so_em integer) on commit drop;
  for v_khoi in select distinct l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and hl.hoc_sinh_id = any(v_hs) and l.khoi is not null loop
    insert into _dua select d.hoc_sinh_id, d.hang, d.so_em_co_diem from public.fn_rank_dua_thang(p_mon, v_khoi, p_ym) d;
  end loop;
  -- MT: tháng này + mốc (tháng MT đầu tiên của em trong mùa)
  create temp table _mt (ym text, hoc_sinh_id uuid, hang integer, so_em integer) on commit drop;
  for v_ym in select to_char(g, 'YYYY-MM') from generate_series((coalesce(v_mua.thang_dau, p_ym) || '-01')::date, v_ms, interval '1 month') g loop
    insert into _mt select v_ym, m.hoc_sinh_id, m.hang, m.so_em from public.fn_mt_hang_thang(p_mon, v_ym) m where m.hoc_sinh_id = any(v_hs);
  end loop;

  return query
  with
  hs as (select unnest(v_hs) as hs),
  dd as (select h.hoc_sinh_id as hs, count(*) filter (where h.diem_danh = 'co_mat') as co, count(*) filter (where h.diem_danh in ('vang', 'vang_phep')) as vang
         from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id join lop l on l.id = b.lop_id
         where l.mon = p_mon and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and h.hoc_sinh_id = any(v_hs)
         group by 1),
  bt as (select k.hoc_sinh_id as hs, count(*) as n, count(*) filter (where k.trang_thai_nop = 'nop_dung_han') as dh
         from btvn_ket_qua k join buoi_hoc b on b.id = k.buoi_hoc_id join lop l on l.id = b.lop_id
         where l.mon = p_mon and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and k.trang_thai_nop is not null and k.hoc_sinh_id = any(v_hs)
         group by 1),
  bai as (   -- tỉ lệ đúng từng bài (em × buổi × phase) — cùng quy đổi mastery
    select g.hoc_sinh_id as hs, sp.phase, g.buoi_hoc_id, avg(case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end) as tl
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id and sp.phase in ('et', 'btvn')
    join buoi_hoc b on b.id = g.buoi_hoc_id join lop l on l.id = b.lop_id
    where l.mon = p_mon and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and g.hoc_sinh_id = any(v_hs)
    group by 1, 2, 3),
  tl as (select bl.hoc_sinh_id as hs, count(*) as n
         from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt2 on bt2.id = bl.bai_test_id
         where bt2.loai = 'tu_luyen' and bt2.mon = p_mon and blc.verdict = 'correct' and bl.hoc_sinh_id = any(v_hs)
           and blc.cham_at >= v_tu and blc.cham_at < v_den
         group by 1),
  tt as (select t.hoc_sinh_id as hs, count(distinct t.ngay) filter (where t.pass) as ngay_pass, count(*) filter (where t.so_dung = t.so_cau) as so_full
         from thu_thach_luot t where t.mon = p_mon and t.ngay between v_ms and v_me and t.hoc_sinh_id = any(v_hs) group by 1),
  mt_nay as (select * from _mt where ym = p_ym),
  mt_moc as (select distinct on (m.hoc_sinh_id) m.hoc_sinh_id, m.ym, m.hang, m.so_em from _mt m order by m.hoc_sinh_id, m.ym),
  ms0 as (select m.hoc_sinh_id as hs, m.ma_dang from public.fn_mastery_cells(v_hs, false, null, 5, 5, 3, v_tu) m
          where m.muc = 'yeu' and m.ma_dang = any(v_dangs)),
  ms1 as (select m.hoc_sinh_id as hs, m.ma_dang, m.muc, m.tin from public.fn_mastery_cells(v_hs, false, null, 5, 5, 3, v_den) m
          where m.ma_dang = any(v_dangs)),
  msdo as (select distinct m.hoc_sinh_id as hs from public.fn_mastery_cells(v_hs, false, v_tu, 5, 5, 3, v_den) m where m.ma_dang = any(v_dangs)),
  ll as (select h.hs,
                exists (select 1 from ms0 join ms1 on ms1.hs = ms0.hs and ms1.ma_dang = ms0.ma_dang
                        where ms0.hs = h.hs and ms1.muc = 'dat' and ms1.tin in ('tb', 'cao')) as lap,
                not exists (select 1 from ms1 where ms1.hs = h.hs and ms1.muc = 'yeu') and exists (select 1 from msdo where msdo.hs = h.hs) as sach
         from hs h),
  tk as (select * from thanh_tuu where mon = p_mon and active)
  select h.hs, tk.key,
    case
      when tk.mo_tu is not null and v_me < tk.mo_tu then 'khong_ap_dung'
      when tk.loai_chi_so = 'mt_hon_moc' and (select mm.ym from mt_moc mm where mm.hoc_sinh_id = h.hs) = p_ym then 'khong_ap_dung'
      when case tk.loai_chi_so
        when 'diem_danh_du'        then coalesce((select dd.co >= 1 and dd.vang = 0 from dd where dd.hs = h.hs), false)
        when 'btvn_dung_han_du'    then coalesce((select bt.n >= 1 and bt.dh = bt.n from bt where bt.hs = h.hs), false)
        when 'tu_luyen_cau_dung'   then coalesce((select tl.n >= (tk.tham_so->>'n')::int from tl where tl.hs = h.hs), false)
        when 'thu_thach_ngay_pass' then coalesce((select tt.ngay_pass >= (tk.tham_so->>'n')::int from tt where tt.hs = h.hs), false)
        when 'thu_thach_luot_full' then coalesce((select tt.so_full >= (tk.tham_so->>'n')::int from tt where tt.hs = h.hs), false)
        when 'et_ti_le_bai'        then coalesce((select count(*) >= 1 and count(*) filter (where bai.tl >= (tk.tham_so->>'ti_le')::numeric)
                                                         >= (tk.tham_so->>'phan')::numeric * count(*)
                                                  from bai where bai.hs = h.hs and bai.phase = 'et'), false)
        when 'btvn_ti_le_tb'       then coalesce((select avg(bai.tl) >= (tk.tham_so->>'ti_le')::numeric from bai where bai.hs = h.hs and bai.phase = 'btvn'), false)
        when 'mt_top_pct'          then coalesce((select m.hang <= ceil((tk.tham_so->>'pct')::numeric * m.so_em) from mt_nay m where m.hoc_sinh_id = h.hs), false)
        when 'mt_hon_moc'          then coalesce((select m.hang::numeric / m.so_em < mc.hang::numeric / mc.so_em
                                                         or m.hang <= ceil((tk.tham_so->>'top_pct')::numeric * m.so_em)
                                                  from mt_nay m join mt_moc mc on mc.hoc_sinh_id = m.hoc_sinh_id where m.hoc_sinh_id = h.hs), false)
        when 'lap_lo'              then coalesce((select ll.lap or ll.sach from ll where ll.hs = h.hs), false)
        when 'dua_thang_top_pct'   then coalesce((select d.hang <= ceil((tk.tham_so->>'pct')::numeric * d.so_em) from _dua d where d.hoc_sinh_id = h.hs), false)
      end then 'dat'
      else 'khong_dat'
    end
  from hs h cross join tk;
  drop table _dua; drop table _mt;
end $$;
comment on function public.fn_thanh_tuu_thang(text, text, uuid[]) is 'Đo MỌI thành tựu của môn trong tháng cho các em có học tháng đó (dat/khong_dat/khong_ap_dung). Hàm đo DUY NHẤT — tạm tính và chốt đều dùng.';

-- ---------- 5. Tháng chuẩn / hoàn hảo của từng huy hiệu ----------
-- Tháng đã chốt ⇒ đọc hs_thanh_tuu_thang; chưa chốt ⇒ tạm tính động. chuan/hoan_hao NULL = tháng không đếm (mọi điều kiện chuẩn không áp dụng).
create or replace function public.fn_huy_hieu_thang(p_mon text, p_ym text, p_hs uuid[] default null)
returns table(hoc_sinh_id uuid, huy_hieu_key text, chuan boolean, hoan_hao boolean, da_chot boolean)
language plpgsql as $$   -- volatile: có thể gọi fn_thanh_tuu_thang
declare v_chot boolean := exists (select 1 from hs_thanh_tuu_thang where mon = p_mon and thang = p_ym);
begin
  return query
  with kq as (
    select t.hoc_sinh_id, t.thanh_tuu_key, t.ket_qua from hs_thanh_tuu_thang t
      where v_chot and t.mon = p_mon and t.thang = p_ym and (p_hs is null or t.hoc_sinh_id = any(p_hs))
    union all
    select f.hoc_sinh_id, f.thanh_tuu_key, f.ket_qua from public.fn_thanh_tuu_thang(p_mon, p_ym, p_hs) f where not v_chot
  ), x as (
    select kq.hoc_sinh_id, dk.huy_hieu_key,
           bool_and(kq.ket_qua = 'dat') filter (where dk.vai = 'chuan' and kq.ket_qua <> 'khong_ap_dung') as chuan,
           bool_and(kq.ket_qua in ('dat', 'khong_ap_dung')) filter (where dk.vai = 'them') as them
    from kq join huy_hieu_dieu_kien dk on dk.mon = p_mon and dk.thanh_tuu_key = kq.thanh_tuu_key
    join huy_hieu hh on hh.mon = p_mon and hh.key = dk.huy_hieu_key and hh.active
    group by kq.hoc_sinh_id, dk.huy_hieu_key
  )
  select x.hoc_sinh_id, x.huy_hieu_key, x.chuan, x.chuan and coalesce(x.them, true), v_chot from x;
end $$;

-- ---------- 6. Chốt tháng → sao mới ----------
create or replace function public.fn_huy_hieu_chot_thang(p_mon text, p_ym text) returns jsonb
language plpgsql as $$
declare
  v_mua record; v_ns uuid := public.current_nhan_su_id(); v_moi integer := 0; v_ghi integer := 0; v_m text;
  v_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự được chốt huy hiệu.'; end if;
  select * into v_mua from gami_mua where p_ym between thang_dau and hh_thang_cuoi limit 1;
  if v_mua.mua is null then raise exception 'Tháng % không thuộc năm huy hiệu nào (tháng 7 → 4).', p_ym; end if;
  if v_nay < ((p_ym || '-01')::date + interval '1 month' + interval '9 days')::date then
    raise exception 'Tháng % chỉ chốt được từ ngày 10 tháng sau (chờ cửa sổ MT đóng).', p_ym;
  end if;
  -- chốt theo thứ tự: tháng trước trong mùa phải chốt rồi
  for v_m in select to_char(g, 'YYYY-MM') from generate_series((v_mua.thang_dau || '-01')::date, (p_ym || '-01')::date - interval '1 month', interval '1 month') g loop
    if not exists (select 1 from hs_thanh_tuu_thang where mon = p_mon and thang = v_m) then
      raise exception 'Chưa chốt tháng % — chốt theo thứ tự.', v_m;
    end if;
  end loop;
  perform pg_advisory_xact_lock(hashtext('huy_hieu_chot:' || p_mon));

  if not exists (select 1 from hs_thanh_tuu_thang where mon = p_mon and thang = p_ym) then
    insert into hs_thanh_tuu_thang (hoc_sinh_id, mon, thang, thanh_tuu_key, ket_qua, chot_boi)
    select f.hoc_sinh_id, p_mon, p_ym, f.thanh_tuu_key, f.ket_qua, v_ns from public.fn_thanh_tuu_thang(p_mon, p_ym) f;
    get diagnostics v_ghi = row_count;
  end if;

  with thang as (select to_char(g, 'YYYY-MM') as ym from generate_series((v_mua.thang_dau || '-01')::date, (p_ym || '-01')::date, interval '1 month') g),
  dem as (
    select h.hoc_sinh_id, h.huy_hieu_key, count(*) filter (where h.chuan) as n_chuan, count(*) filter (where h.hoan_hao) as n_hh
    from thang cross join lateral public.fn_huy_hieu_thang(p_mon, thang.ym) h
    group by 1, 2
  ), dat as (
    select d.hoc_sinh_id, d.huy_hieu_key, s.sao from dem d join huy_hieu_thang_sao s on s.mon = p_mon
    where (case s.loai_thang when 'chuan' then d.n_chuan else d.n_hh end) >= s.so_thang
  )
  insert into hs_huy_hieu_dat (hoc_sinh_id, mon, huy_hieu_key, sao, mua, lan, thang_chot)
  select dat.hoc_sinh_id, p_mon, dat.huy_hieu_key, dat.sao, v_mua.mua,
         1 + (select count(*) from hs_huy_hieu_dat o where o.hoc_sinh_id = dat.hoc_sinh_id and o.mon = p_mon
              and o.huy_hieu_key = dat.huy_hieu_key and o.sao = dat.sao and o.mua <> v_mua.mua), p_ym
  from dat
  on conflict (hoc_sinh_id, mon, huy_hieu_key, sao, mua) do nothing;
  get diagnostics v_moi = row_count;
  return jsonb_build_object('mon', p_mon, 'thang', p_ym, 'dong_thanh_tuu', v_ghi, 'sao_moi', v_moi);
end $$;

-- ---------- 7. EXP app: thêm thành tựu ----------
drop function public.fn_exp_app_thang(text, uuid, text);
create function public.fn_exp_app_thang(p_ym text, p_hs uuid default null, p_mon text default null)
returns table(hoc_sinh_id uuid, mon text, exp_nhiem_vu integer, exp_may_man integer, exp_app integer, exp_thanh_tuu integer)
language plpgsql stable as $$
declare c record;
begin
  for c in select n.* from nhiem_vu_cau_hinh n where n.bat and (p_mon is null or n.mon = p_mon) loop
    return query
    with nv as (
      select n.hoc_sinh_id, n.exp from public.fn_nhiem_vu_chang_thang(c.mon, p_ym, case when p_hs is null then null else array[p_hs] end) n
    ), mm as (
      select m.hoc_sinh_id, sum(m.exp)::int as exp from may_man_hs_luot m
      where m.mon = c.mon and m.ngay >= c.bat_dau and to_char(m.ngay, 'YYYY-MM') = p_ym and (p_hs is null or m.hoc_sinh_id = p_hs)
      group by 1
    ), tt as (   -- EXP huy hiệu tính vào tháng ĐẠT (giờ VN)
      select d.hoc_sinh_id, sum(s.exp)::int as exp from hs_huy_hieu_dat d
      join huy_hieu_thang_sao s on s.mon = d.mon and s.sao = d.sao
      where d.mon = c.mon and to_char(d.dat_at at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM') = p_ym and (p_hs is null or d.hoc_sinh_id = p_hs)
      group by 1
    ), ids as (select nv.hoc_sinh_id from nv union select mm.hoc_sinh_id from mm union select tt.hoc_sinh_id from tt)
    select ids.hoc_sinh_id, c.mon, coalesce(nv.exp, 0), coalesce(mm.exp, 0),
           coalesce(nv.exp, 0) + coalesce(mm.exp, 0) + coalesce(tt.exp, 0), coalesce(tt.exp, 0)
    from ids left join nv on nv.hoc_sinh_id = ids.hoc_sinh_id left join mm on mm.hoc_sinh_id = ids.hoc_sinh_id
    left join tt on tt.hoc_sinh_id = ids.hoc_sinh_id
    where coalesce(nv.exp, 0) + coalesce(mm.exp, 0) + coalesce(tt.exp, 0) > 0;
  end loop;
end $$;
comment on function public.fn_exp_app_thang(text, uuid, text) is 'EXP kiếm trên app trong tháng theo môn: nhiệm vụ + vòng quay (từ ngày mở) + huy hiệu (tháng đạt). fn_gami_exp_xu_thang đổi ra xu với trần tran_xu_app.';

-- ---------- 8. App HS: album ----------
create or replace function public.fn_hs_album(p_mon text) returns jsonb
language plpgsql security definer set search_path to 'public' as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_ym text := to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'YYYY-MM');
  v_mua record; v_khoi text; v_den text;
begin
  if v_hs is null then return null; end if;
  if not exists (select 1 from huy_hieu where mon = p_mon and active) then return null; end if;
  select * into v_mua from gami_mua where v_ym between thang_dau and thang_cuoi limit 1;
  if v_mua.mua is null then return null; end if;
  v_den := least(v_ym, v_mua.hh_thang_cuoi);
  select l.khoi into v_khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon order by hl.ngay_vao desc nulls last limit 1;

  create temp table _thang on commit drop as
    select t.ym, h.huy_hieu_key, h.chuan, h.hoan_hao, h.da_chot
    from (select to_char(g, 'YYYY-MM') as ym from generate_series((v_mua.thang_dau || '-01')::date, (v_den || '-01')::date, interval '1 month') g) t
    cross join lateral public.fn_huy_hieu_thang(p_mon, t.ym, array[v_hs]) h;
  create temp table _nay on commit drop as
    select f.thanh_tuu_key, f.ket_qua from public.fn_thanh_tuu_thang(p_mon, v_ym, array[v_hs]) f
    where v_ym <= v_mua.hh_thang_cuoi;
  create temp table _khoi on commit drop as
    select distinct hl.hoc_sinh_id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = v_khoi;

  return jsonb_build_object(
    'mon', p_mon, 'mua', v_mua.mua, 'thang', v_ym, 'thang_cuoi', v_mua.hh_thang_cuoi,
    'si_so_khoi', (select count(*) from _khoi),
    'thang_sao', (select jsonb_agg(jsonb_build_object('sao', s.sao, 'so_thang', s.so_thang, 'loai', s.loai_thang, 'ban_cung', s.ban_cung, 'exp', s.exp) order by s.sao)
                  from huy_hieu_thang_sao s where s.mon = p_mon),
    'huy_hieu', (select jsonb_agg(jsonb_build_object(
        'key', hh.key, 'ten', hh.ten, 'bieu_tuong', hh.bieu_tuong, 'ghi_nhan', hh.ghi_nhan, 'cau_chuyen', hh.cau_chuyen,
        'n_chuan', coalesce((select count(*) from _thang t where t.huy_hieu_key = hh.key and t.chuan), 0),
        'n_hoan_hao', coalesce((select count(*) from _thang t where t.huy_hieu_key = hh.key and t.hoan_hao), 0),
        'n_chuan_tam', coalesce((select count(*) from _thang t where t.huy_hieu_key = hh.key and t.chuan and not t.da_chot), 0),
        'sao', coalesce((select max(d.sao) from hs_huy_hieu_dat d where d.hoc_sinh_id = v_hs and d.mon = p_mon and d.huy_hieu_key = hh.key and d.mua = v_mua.mua), 0),
        'dat', coalesce((select jsonb_agg(jsonb_build_object('sao', d.sao, 'lan', d.lan, 'dat_at', d.dat_at, 'thang_chot', d.thang_chot,
                    'da_trao', exists (select 1 from hs_huy_hieu_trao tr where tr.dat_id = d.id),
                    'so_ban_khoi', (select count(distinct o.hoc_sinh_id) from hs_huy_hieu_dat o join _khoi k on k.hoc_sinh_id = o.hoc_sinh_id
                                    where o.mon = p_mon and o.huy_hieu_key = hh.key and o.sao = d.sao and o.mua = v_mua.mua)) order by d.sao)
                  from hs_huy_hieu_dat d where d.hoc_sinh_id = v_hs and d.mon = p_mon and d.huy_hieu_key = hh.key and d.mua = v_mua.mua), '[]'::jsonb),
        'lich_su', coalesce((select jsonb_agg(jsonb_build_object('thang', t.ym, 'chuan', t.chuan, 'hoan_hao', t.hoan_hao, 'da_chot', t.da_chot) order by t.ym)
                  from _thang t where t.huy_hieu_key = hh.key), '[]'::jsonb),
        'thang_nay', coalesce((select jsonb_agg(jsonb_build_object('key', dk.thanh_tuu_key, 'ten', tk.ten, 'vai', dk.vai,
                    'ket_qua', (select n.ket_qua from _nay n where n.thanh_tuu_key = dk.thanh_tuu_key)) order by dk.vai, tk.thu_tu)
                  from huy_hieu_dieu_kien dk join thanh_tuu tk on tk.mon = dk.mon and tk.key = dk.thanh_tuu_key
                  where dk.mon = p_mon and dk.huy_hieu_key = hh.key), '[]'::jsonb)
      ) order by hh.thu_tu) from huy_hieu hh where hh.mon = p_mon and hh.active)
  );
end $$;

-- ---------- 9. GV trao bản cứng ----------
create or replace function public.fn_huy_hieu_viec_trao() returns table(
  dat_id uuid, hoc_sinh_id uuid, ho_ten text, ma_hs text, ten_lop text, mon text, huy_hieu text, bieu_tuong text, sao smallint, dat_at timestamptz)
language sql stable as $$
  select d.id, d.hoc_sinh_id, hs.ho_ten, hs.ma_hs, l.ten_lop, d.mon, hh.ten, hh.bieu_tuong, d.sao, d.dat_at
  from hs_huy_hieu_dat d
  join huy_hieu_thang_sao s on s.mon = d.mon and s.sao = d.sao and s.ban_cung
  join huy_hieu hh on hh.mon = d.mon and hh.key = d.huy_hieu_key
  join hoc_sinh hs on hs.id = d.hoc_sinh_id
  join hoc_sinh_lop hl on hl.hoc_sinh_id = d.hoc_sinh_id and hl.trang_thai = 'dang_hoc'
  join lop l on l.id = hl.lop_id and l.mon = d.mon
  join phan_cong_lop pc on pc.lop_id = l.id and pc.vai_tro = 'gv' and pc.la_chinh and pc.nhan_su_id = public.current_nhan_su_id()
  where d.lan = 1 and not exists (select 1 from hs_huy_hieu_trao t where t.dat_id = d.id)
  order by d.dat_at, l.ten_lop, hs.ho_ten
$$;
comment on function public.fn_huy_hieu_viec_trao() is 'Việc trao bản cứng của GV đang đăng nhập (GV chính lớp môn): đạt sao có bản cứng, lần đầu, TRỪ đã trao — suy động §4.';

create or replace function public.fn_huy_hieu_trao(p_dat_id uuid) returns jsonb
language plpgsql as $$
declare v_ns uuid := public.current_nhan_su_id();
begin
  if v_ns is null or not public.la_thanh_vien() then raise exception 'Chỉ nhân sự được xác nhận trao.'; end if;
  if not exists (select 1 from hs_huy_hieu_dat d join huy_hieu_thang_sao s on s.mon = d.mon and s.sao = d.sao and s.ban_cung
                 where d.id = p_dat_id and d.lan = 1) then
    raise exception 'Huy hiệu này không có bản cứng để trao.';
  end if;
  insert into hs_huy_hieu_trao (dat_id, trao_boi) values (p_dat_id, v_ns) on conflict (dat_id) do nothing;
  return (select jsonb_build_object('dat_id', t.dat_id, 'trao_at', t.trao_at) from hs_huy_hieu_trao t where t.dat_id = p_dat_id);
end $$;

-- ---------- 10. Quyền ----------
revoke all on function public.fn_thanh_tuu_thang(text, text, uuid[]), public.fn_huy_hieu_thang(text, text, uuid[]),
  public.fn_huy_hieu_chot_thang(text, text), public.fn_exp_app_thang(text, uuid, text), public.fn_hs_album(text),
  public.fn_huy_hieu_viec_trao(), public.fn_huy_hieu_trao(uuid) from public, anon;
grant execute on function public.fn_thanh_tuu_thang(text, text, uuid[]), public.fn_huy_hieu_thang(text, text, uuid[]),
  public.fn_huy_hieu_chot_thang(text, text), public.fn_exp_app_thang(text, uuid, text), public.fn_hs_album(text),
  public.fn_huy_hieu_viec_trao(), public.fn_huy_hieu_trao(uuid) to authenticated;
