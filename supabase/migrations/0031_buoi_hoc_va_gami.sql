-- 0031 — LỚP ĐỘNG: buổi học (session) + điểm danh + bảng gami GĐ A (Elo/EXP/chấm bài).
-- Buổi = pure-derive (suy từ TKB × ngày); chỉ ĐẺ DÒNG khi OPS "Mở buổi" (đông cứng snapshot).
-- RLS = member-gate (chuẩn V2, KHÔNG disable như spec gốc viết cho repo cũ).

-- ── BUỔI HỌC (session) ────────────────────────────────────────────
create table if not exists buoi_hoc (
  id            uuid primary key default gen_random_uuid(),
  ma_buoi       text unique,                       -- đọc: '8A1.T2.15062026' (+ '.B' nếu bù) — snapshot lúc tạo
  loai          text not null default 'thuong'
                check (loai in ('thuong','bu','bo_tro_yeu','bo_tro_duoi','mt')),
  lop_id        uuid references lop(id) on delete set null,  -- null = bổ trợ ghép (khác lớp)
  ngay          date not null,
  thu           smallint,                          -- suy từ ngày, lưu cho mã/hiển thị
  gio_bat_dau   time, gio_ket_thuc time, phong text,  -- snapshot từ TKB lúc mở
  nguoi_day     uuid references nhan_su(id) on delete set null,  -- GV THỰC TẾ (dạy thay → đổi; mặc định = phân công)
  nguoi_day_tg  uuid references nhan_su(id) on delete set null,
  trang_thai    text not null default 'mo' check (trang_thai in ('mo','hoan_tat','huy')),
  ly_do_huy     text,
  ingame_dong_at timestamptz,                       -- mốc đóng phase (idempotent closePhase)
  et_dong_at     timestamptz,
  created_by    uuid,                               -- auth.uid OPS mở buổi (app set)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists buoi_hoc_lop_ngay_idx on buoi_hoc (lop_id, ngay);

-- HS trong buổi = điểm danh (OPS) + link bù theo TỪNG HS (1 buổi bù phục vụ HS từ nhiều buổi gốc/lớp)
create table if not exists buoi_hoc_hs (
  id             uuid primary key default gen_random_uuid(),
  buoi_hoc_id    uuid not null references buoi_hoc(id) on delete cascade,
  hoc_sinh_id    uuid not null references hoc_sinh(id) on delete cascade,
  diem_danh      text check (diem_danh in ('co_mat','vang','vang_phep')),  -- null = chưa điểm danh
  bu_cho_buoi_id uuid references buoi_hoc(id) on delete set null,           -- HS này đang bù buổi gốc nào (null nếu không)
  created_at     timestamptz not null default now(),
  unique (buoi_hoc_id, hoc_sinh_id)
);

-- ── GAMI GĐ A ─────────────────────────────────────────────────────
create table if not exists gami_elo (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null unique references hoc_sinh(id) on delete cascade,
  elo int not null default 1000,
  sessions_played int not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists gami_session_problems (
  id uuid primary key default gen_random_uuid(),
  buoi_hoc_id uuid not null references buoi_hoc(id) on delete cascade,
  phase text not null check (phase in ('ingame','et','mt')),
  problem_no int not null,
  opened_at timestamptz not null default now(),
  deadline_at timestamptz,
  hidden boolean not null default false
);
create table if not exists gami_grades (
  id uuid primary key default gen_random_uuid(),
  buoi_hoc_id uuid not null references buoi_hoc(id) on delete cascade,
  problem_id uuid not null references gami_session_problems(id) on delete cascade,
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  result text not null check (result in ('correct','partial','wrong')),
  presentation text not null check (presentation in ('clean','ok','sloppy')),
  speed text not null check (speed in ('fast','normal','slow')),
  points numeric not null,
  graded_by uuid,
  graded_at timestamptz not null default now(),
  unique (problem_id, hoc_sinh_id)
);
create table if not exists gami_elo_history (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  buoi_hoc_id uuid not null references buoi_hoc(id) on delete cascade,
  phase text not null,
  elo_before int not null, expected numeric not null, actual numeric not null,
  delta int not null, elo_after int not null,
  created_at timestamptz not null default now()
);
create table if not exists gami_exp_ledger (   -- INSERT-only (cộng dồn, không sửa/xóa)
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  source text not null,   -- 'rank_ingame'|'rank_et'|'rank_mt'|'attend_floor'|'btvn'|'daily'|'streak'|'team'|'boss'
  amount int not null,
  ref_buoi_hoc_id uuid references buoi_hoc(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

-- ── RLS member-gate (chuẩn V2 — chỉ thành viên) ───────────────────
do $$
declare t text;
begin
  foreach t in array array['buoi_hoc','buoi_hoc_hs','gami_elo','gami_session_problems','gami_grades','gami_elo_history','gami_exp_ledger']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I_member_all on %I for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien())', t, t);
    execute format('grant select, insert, update, delete on %I to authenticated', t);
  end loop;
end $$;
