-- ============================================================================
-- Migration 0043 — Bảng thành tích: kì thi/điểm thi (Level) · catalog thành tích
-- · ghim · bậc lương xu · BTVN. (Theo ADR "Bảng thành tích HS & 3 hệ điểm".)
-- ----------------------------------------------------------------------------
-- Additive, an toàn dù CHƯA nhập liệu. Level/Xu/thành tích = SUY ĐỘNG (không bảng).
-- Anti-NULL §1.5: diem_thi/btvn_ket_qua chỉ có dòng khi CÓ kết quả thật.
-- ============================================================================

-- Kì thi = instance đo Level (không tách 4 kì trường thành 4 entity). MT sát hạch nối buổi gami.
create table if not exists ky_thi (
  id          uuid primary key default gen_random_uuid(),
  ten         text not null,
  loai        text not null check (loai in ('truong','mt_sat_hach','khao_sat_thang')),
  he_so       int  not null check (he_so in (1,2)),
  dot         text check (dot in ('giua_ky_1','cuoi_ky_1','giua_ky_2','cuoi_ky_2')), -- ghép cặp trường↔BK; khảo sát tháng = null
  ngay        date,
  mon         text,
  khoi        text,
  mua         text,                                  -- mã mùa 'YYYY-YY'
  buoi_hoc_id uuid references buoi_hoc(id) on delete set null, -- chỉ mt_sat_hach (1 sự kiện nuôi Elo+Level)
  created_at  timestamptz not null default now()
);

-- Điểm thi per HS — verdict so band TẠI THỜI ĐIỂM thi (snapshot band_luc_thi).
create table if not exists diem_thi (
  ky_thi_id    uuid not null references ky_thi(id) on delete cascade,
  hoc_sinh_id  uuid not null references hoc_sinh(id),
  diem         numeric,                              -- thang 10
  band_luc_thi text,                                 -- snapshot ma band lúc thi (muc_nang_luc.ma)
  verdict      text not null check (verdict in ('dat','gan_dat','khong_dat')),
  vuot_band    boolean not null default false,
  graded_by    uuid,
  updated_at   timestamptz not null default now(),
  primary key (ky_thi_id, hoc_sinh_id)
);

-- Mỗi band 1 mức kì vọng (thang 10) — duyệt verdict theo đây. NULL = chưa set (define sau).
alter table muc_nang_luc add column if not exists diem_ky_vong numeric;

-- Catalog thành tích (canonical). Thêm loại mới = thêm dòng, không đẻ schema.
create table if not exists thanh_tich_loai (
  key      text primary key,
  ten      text not null,
  icon     text,
  nhom     text,                  -- gioi | thi | tien_bo | cham | cot_moc
  kieu     text,                  -- dem | chuoi | max | ti_le
  nguon    text,                  -- mô tả nguồn event (tham chiếu)
  per_mon  boolean not null default true,
  trong_so int not null default 0, -- "độ ấn tượng" cho hệ gợi ý (set sau)
  thu_tu   int not null default 0,
  active   boolean not null default true
);

-- HS ghim thành tích muốn khoe. KHÔNG có dòng → hệ tự gợi ý top.
create table if not exists hoc_sinh_thanh_tich_ghim (
  hoc_sinh_id uuid not null references hoc_sinh(id),
  mon         text not null,
  loai_key    text not null references thanh_tich_loai(key),
  thu_tu      int  not null default 0,
  primary key (hoc_sinh_id, mon, loai_key)
);

-- Bậc lương: EXP (tháng) ≥ min_exp → xu. Tra = xu của bậc min_exp lớn nhất ≤ EXP.
create table if not exists luong_bac (
  min_exp int primary key,
  xu      int not null
);

-- Kết quả BTVN per (HS × buổi) — cho chuỗi BTVN. Anti-NULL: chỉ có dòng khi đã nộp/chấm.
create table if not exists btvn_ket_qua (
  hoc_sinh_id uuid not null references hoc_sinh(id),
  buoi_hoc_id uuid not null references buoi_hoc(id) on delete cascade,
  hoan_thanh  boolean not null default false,
  dung_han    boolean,
  ti_le_dung  numeric,
  updated_at  timestamptz not null default now(),
  primary key (hoc_sinh_id, buoi_hoc_id)
);

-- ── RLS member-gate (bảng mới — 0026 chỉ phủ bảng cũ, phải khai tay) ──
alter table ky_thi                   enable row level security;
alter table diem_thi                 enable row level security;
alter table thanh_tich_loai          enable row level security;
alter table hoc_sinh_thanh_tich_ghim enable row level security;
alter table luong_bac                enable row level security;
alter table btvn_ket_qua             enable row level security;
drop policy if exists ky_thi_member_all                   on ky_thi;
drop policy if exists diem_thi_member_all                 on diem_thi;
drop policy if exists thanh_tich_loai_member_all          on thanh_tich_loai;
drop policy if exists hoc_sinh_thanh_tich_ghim_member_all on hoc_sinh_thanh_tich_ghim;
drop policy if exists luong_bac_member_all                on luong_bac;
drop policy if exists btvn_ket_qua_member_all             on btvn_ket_qua;
create policy ky_thi_member_all                   on ky_thi                   for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy diem_thi_member_all                 on diem_thi                 for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy thanh_tich_loai_member_all          on thanh_tich_loai          for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy hoc_sinh_thanh_tich_ghim_member_all on hoc_sinh_thanh_tich_ghim for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy luong_bac_member_all                on luong_bac                for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy btvn_ket_qua_member_all             on btvn_ket_qua             for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- ── Seed catalog thành tích (định nghĩa, pure-derive — giá trị tính ở service) ──
insert into thanh_tich_loai (key, ten, icon, nhom, kieu, nguon, thu_tu) values
  ('top1_lop',     'Top 1 trên lớp',  '👑', 'gioi',   'dem',   'gami_elo_history rank=1 phase=ingame', 10),
  ('top1_et',      'Top 1 ET',        '👑', 'gioi',   'dem',   'gami_elo_history rank=1 phase=et',      11),
  ('top1_mt',      'Top 1 MT',        '👑', 'gioi',   'dem',   'gami_elo_history rank=1 phase=mt',      12),
  ('elo_dinh',     'Elo đỉnh mùa',    '📈', 'gioi',   'max',   'gami_elo_history elo_after',            13),
  ('diem_10',      'Điểm 10 kì thi',  '💯', 'thi',    'dem',   'diem_thi diem=10',                      20),
  ('diem_9plus',   'Điểm 9+ kì thi',  '⭐', 'thi',    'dem',   'diem_thi diem>=9',                      21),
  ('vuot_band',    'Vượt band',       '🚀', 'thi',    'dem',   'diem_thi vuot_band=true',               22),
  ('len_band',     'Lên band',        '⬆️', 'tien_bo','dem',   'hoc_sinh_lop_log band tăng',            30),
  ('chuoi_di_hoc', 'Chuỗi đi học',    '🔥', 'cham',   'chuoi', 'buoi_hoc_hs co_mat liên tục',           40),
  ('chuoi_btvn',   'Chuỗi BTVN',      '✏️', 'cham',   'chuoi', 'btvn_ket_qua hoan_thanh liên tục',      41),
  ('chuyen_can',   '% Chuyên cần mùa','📅', 'cham',   'ti_le', 'buoi_hoc_hs co_mat / tổng',             42),
  ('tong_buoi',    'Tổng buổi',       '🎖️', 'cot_moc','dem',   'buoi_hoc_hs / gami_elo_history',        50)
on conflict (key) do nothing;

-- ── Seed bậc lương (PROVISIONAL — chỉnh sau khi có data lương thật) ──
insert into luong_bac (min_exp, xu) values
  (0, 0), (5000, 40), (8000, 50), (10000, 60), (12000, 70), (15000, 85), (20000, 110)
on conflict (min_exp) do nothing;
