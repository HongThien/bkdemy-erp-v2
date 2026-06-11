-- 0015 — Khối STATIC: nhân sự + tổ chức + lớp + học sinh + thời khóa biểu.
-- Triết lý: chuẩn hóa hết slot cố định của V1 thành bảng nối (chống NULL, đa-lớp/đa-vai thoải mái).
-- Session/điểm danh/chấm = DYNAMIC, KHÔNG ở đây (suy ra sau khi có hoạt động thật).

-- ── Thang năng lực MỊN: mỗi bậc S/A/B/C × 3 mức = 12, roll-up về lop_bac ──
create table if not exists muc_nang_luc (
  id       uuid primary key default gen_random_uuid(),
  ma       text not null unique,                 -- 'S1','A2','C3'…
  bac      text not null references lop_bac(ma),  -- roll-up S/A/B/C (Kho dùng bac này)
  muc      smallint not null check (muc between 1 and 3),  -- 1 = xịn nhất trong bậc
  thu_tu   smallint not null unique,              -- 1..12 toàn cục; LỚN = giỏi hơn (khớp lop_bac)
  ten      text
);
-- thu_tu: lớn = giỏi. S1=12 (đỉnh) … C3=1 (đáy). mức 1 = xịn nhất trong bậc.
insert into muc_nang_luc (ma, bac, muc, thu_tu, ten) values
  ('S1','S',1,12,'S mức 1'),('S2','S',2,11,'S mức 2'),('S3','S',3,10,'S mức 3'),
  ('A1','A',1, 9,'A mức 1'),('A2','A',2, 8,'A mức 2'),('A3','A',3, 7,'A mức 3'),
  ('B1','B',1, 6,'B mức 1'),('B2','B',2, 5,'B mức 2'),('B3','B',3, 4,'B mức 3'),
  ('C1','C',1, 3,'C mức 1'),('C2','C',2, 2,'C mức 2'),('C3','C',3, 1,'C mức 3')
on conflict (ma) do nothing;

-- ── Người ──
create table if not exists nhan_su (
  id             uuid primary key default gen_random_uuid(),
  ho_ten         text not null,
  so_dien_thoai  text,
  email          text,
  trang_thai     text not null default 'dang_lam' check (trang_thai in ('dang_lam','nghi')),
  ngay_vao_lam   date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Nối đăng nhập (auth.users.id) ↔ người. KHÔNG FK sang schema auth (claude_build không đụng auth).
create table if not exists tai_khoan (
  id          uuid primary key,                  -- = auth.users.id (theo quy ước, không ràng FK)
  nhan_su_id  uuid references nhan_su(id) on delete set null,
  email       text,
  created_at  timestamptz not null default now()
);

-- ── Team (6) + cây phân cấp per-team ──
create table if not exists team (
  id      uuid primary key default gen_random_uuid(),
  ma      text not null unique,
  ten     text not null,
  thu_tu  smallint not null default 0
);
insert into team (ma, ten, thu_tu) values
  ('gv','Giáo viên',1),('ta','Trợ giảng',2),('ops','Vận hành',3),
  ('hoc_thuat','Học thuật',4),('media','Media',5),('marketing','Marketing',6)
on conflict (ma) do nothing;

create table if not exists thanh_vien_team (
  id          uuid primary key default gen_random_uuid(),
  nhan_su_id  uuid not null references nhan_su(id) on delete cascade,
  team_id     uuid not null references team(id) on delete cascade,
  vai_tro     text not null default 'thanh_vien' check (vai_tro in ('truong','pho','thanh_vien')),
  quan_ly_id  uuid references nhan_su(id) on delete set null,  -- cấp trên TRONG team này; null = đỉnh
  unique (nhan_su_id, team_id)
);

-- ── Lớp (1 lớp = 1 môn) ──
create table if not exists lop (
  id          uuid primary key default gen_random_uuid(),
  ten_lop     text not null,
  mon         text not null,
  khoi        smallint,
  bac         text references lop_bac(ma),       -- bậc THÔ của lớp (S/A/B/C)
  co_so       text,                              -- chi nhánh (vd 'CS1'); null nếu 1 cơ sở
  trang_thai  text not null default 'dang_hoc' check (trang_thai in ('dang_hoc','dong')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Phân công GV/TA vào lớp (thay gv1/gv2/tg1/tg2 của V1)
create table if not exists phan_cong_lop (
  id          uuid primary key default gen_random_uuid(),
  nhan_su_id  uuid not null references nhan_su(id) on delete cascade,
  lop_id      uuid not null references lop(id) on delete cascade,
  vai_tro     text not null check (vai_tro in ('gv','tg')),
  la_chinh    boolean not null default false,    -- GV/TG chính (thay nghĩa gv1 vs gv2)
  created_at  timestamptz not null default now(),
  unique (nhan_su_id, lop_id, vai_tro)
);

-- ── Học sinh ──
create table if not exists hoc_sinh (
  id                 uuid primary key default gen_random_uuid(),
  ma_hs              text unique,                 -- mã người-đọc (tùy)
  ho_ten             text not null,
  ngay_sinh          date,
  gioi_tinh          text check (gioi_tinh in ('nam','nu') or gioi_tinh is null),
  khoi               smallint,
  trang_thai         text not null default 'dang_hoc' check (trang_thai in ('dang_hoc','bao_luu','nghi')),
  ten_ph             text,
  sdt_ph             text,
  email_ph           text,
  diem_test_dau_vao  numeric,                     -- nguồn của band (tùy)
  ngay_nhap_hoc      date,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- HS thuộc lớp nào (thay 4 cột lop_toan/van/anh/khtn) — band MỊN per-môn ở đây
create table if not exists hoc_sinh_lop (
  id                uuid primary key default gen_random_uuid(),
  hoc_sinh_id       uuid not null references hoc_sinh(id) on delete cascade,
  lop_id            uuid not null references lop(id) on delete cascade,
  muc_nang_luc_id   uuid references muc_nang_luc(id),  -- band của HS trong lớp/môn này
  ngay_vao          date,
  trang_thai        text not null default 'dang_hoc' check (trang_thai in ('dang_hoc','da_roi')),
  unique (hoc_sinh_id, lop_id)
);

-- ── Thời khóa biểu: khung lặp tuần, hiệu-lực-theo-thời-gian (sửa = đóng cũ + mở mới) ──
create table if not exists thoi_khoa_bieu (
  id            uuid primary key default gen_random_uuid(),
  lop_id        uuid not null references lop(id) on delete cascade,
  thu           smallint not null check (thu between 2 and 8),  -- 2..7 = T2..T7, 8 = CN
  gio_bat_dau   time not null,
  gio_ket_thuc  time not null,
  phong         text,
  hieu_luc_tu   date not null,
  hieu_luc_den  date,                              -- null = còn hiệu lực
  created_at    timestamptz not null default now()
);

-- RLS: bật, chỉ authenticated (lọc phạm vi = cách B ở query layer; siết RLS sau).
alter table muc_nang_luc    enable row level security;
alter table nhan_su         enable row level security;
alter table tai_khoan       enable row level security;
alter table team            enable row level security;
alter table thanh_vien_team enable row level security;
alter table lop             enable row level security;
alter table phan_cong_lop   enable row level security;
alter table hoc_sinh        enable row level security;
alter table hoc_sinh_lop    enable row level security;
alter table thoi_khoa_bieu  enable row level security;

do $$
declare t text;
begin
  foreach t in array array['muc_nang_luc','nhan_su','tai_khoan','team','thanh_vien_team','lop','phan_cong_lop','hoc_sinh','hoc_sinh_lop','thoi_khoa_bieu']
  loop
    execute format('create policy %I_auth_all on %I for all to authenticated using (true) with check (true)', t, t);
  end loop;
end $$;
