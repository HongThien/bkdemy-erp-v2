-- ============================================================================
-- Migration 0063 — TEST ONLINE (nền tảng: login HS + bảng phát hành/bài làm)
-- ----------------------------------------------------------------------------
-- Spec: spec-test-online.md. Slice 1 = BTVN + trắc nghiệm. Migration này dựng
-- TOÀN BỘ nền (cả ET/tra_loi_ngan/dung_sai) để không phải migrate lại; code
-- slice 1 chỉ dùng phần trắc nghiệm.
--
-- 3 tầng (spec §3): KHO → bai_test (đông cứng, snapshot đề+key) → bai_lam
-- (HS-facing, RLS) → đo lường (gami_grades/btvn_ket_qua, sync sau).
--
-- ⚠ Login HS = NET-NEW. HS đăng nhập bằng Supabase Auth THẬT (email tổng hợp
--   <ma_hs>@hs.bkdemy.local, password = PIN) → auth.uid() thật → RLS chạy được.
--   tai_khoan thêm cột hoc_sinh_id (song song nhan_su_id) → 1 người = HS HOẶC NS.
--   HS KHÔNG phải la_thanh_vien() (đó là cổng STAFF) → mọi bảng HS-facing phải
--   khai policy HS-scoped RIÊNG (0026 blanket member_all không phủ bảng mới).
-- ⚠ Tạo dòng auth.users cho HS làm bằng SERVICE_ROLE/Dashboard (claude_build cấm
--   schema auth) — migration này CHỈ lo public schema.
-- ============================================================================

-- ── 1) tai_khoan trỏ được sang HỌC SINH ─────────────────────────────────────
alter table tai_khoan add column if not exists hoc_sinh_id uuid references hoc_sinh(id) on delete set null;
create index if not exists idx_tai_khoan_hoc_sinh on tai_khoan(hoc_sinh_id) where hoc_sinh_id is not null;

-- id học sinh của người gọi (mirror la_thanh_vien/self_link_account, 0026).
-- security definer né RLS tai_khoan; đọc JWT qua jwt_uid() (KHÔNG auth.uid()).
create or replace function public.my_hoc_sinh_id() returns uuid
language sql stable security definer set search_path = public as $$
  select hoc_sinh_id from tai_khoan where id = public.jwt_uid() and hoc_sinh_id is not null;
$$;
revoke all on function public.my_hoc_sinh_id() from public;
grant execute on function public.my_hoc_sinh_id() to authenticated;

-- HS đang ghi danh lớp p_lop? (live-derive — spec §1.4, không snapshot roster)
create or replace function public.hs_o_lop(p_lop uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from hoc_sinh_lop
    where hoc_sinh_id = public.my_hoc_sinh_id()
      and lop_id = p_lop and trang_thai = 'dang_hoc'
  );
$$;
revoke all on function public.hs_o_lop(uuid) from public;
grant execute on function public.hs_o_lop(uuid) to authenticated;

-- ── 2) bai_test — 1 lần phát hành 1 doc cho 1 lớp (instance đông cứng) ───────
create table if not exists bai_test (
  id                uuid primary key default gen_random_uuid(),
  nguon_tai_lieu_id uuid references tai_lieu(id) on delete set null,  -- truy nguồn (soạn), KHÔNG để chấm
  lop_id            uuid not null references lop(id),
  ngay              date not null,
  loai              text not null check (loai in ('et','btvn')),
  mon               text not null default 'Toán',
  trang_thai        text not null default 'mo' check (trang_thai in ('mo','dong')),
  mo_at             timestamptz not null default now(),
  dong_at           timestamptz,
  deadline          timestamptz,
  khoa_reveal       boolean not null default false,   -- ET tùy chọn giữ đáp án tới khi đóng
  created_by        uuid,
  created_at        timestamptz not null default now()
);
-- 1 doc × lớp × ngày × loại = 1 bai_test (idempotent phát hành, spec §5.1)
create unique index if not exists uq_bai_test_doc
  on bai_test(nguon_tai_lieu_id, lop_id, ngay, loai)
  where nguon_tai_lieu_id is not null;

-- ── 3) bai_test_cau — câu ĐÔNG CỨNG (snapshot đề + key, nguồn chấm) ──────────
create table if not exists bai_test_cau (
  id           uuid primary key default gen_random_uuid(),
  bai_test_id  uuid not null references bai_test(id) on delete cascade,
  thu_tu       int not null,
  ma_cau       text,                    -- nguồn kho, CHỈ truy vết (report→backfill), KHÔNG chấm
  loai_cau     text not null,           -- trac_nghiem | tra_loi_ngan | dung_sai
  noi_dung     text,                    -- snapshot đề
  lua_chon     jsonb,                   -- snapshot (trắc nghiệm)
  menh_de      jsonb,                   -- snapshot (đúng/sai: 4 mệnh đề)
  dap_an_key   jsonb,                   -- KEY để chấm (snapshot): TN=chữ cái · TLN=chuỗi · ĐS=4 bool
  diem         numeric not null default 1
);
create index if not exists idx_bai_test_cau_test on bai_test_cau(bai_test_id, thu_tu);

-- ── 4) bai_lam — bài làm 1 HS cho 1 test (HS-facing) — ENABLE RLS ────────────
create table if not exists bai_lam (
  id          uuid primary key default gen_random_uuid(),
  bai_test_id uuid not null references bai_test(id) on delete cascade,
  hoc_sinh_id uuid not null references hoc_sinh(id),
  trang_thai  text not null default 'dang_lam' check (trang_thai in ('dang_lam','da_nop')),
  bat_dau_at  timestamptz not null default now(),
  nop_at      timestamptz,
  unique (bai_test_id, hoc_sinh_id)     -- 1 HS / 1 test
);

-- ── 5) bai_lam_cau — đáp án HS + verdict = PHÉP ĐO (§1.5: chỉ khi HS trả lời) ─
create table if not exists bai_lam_cau (
  id              uuid primary key default gen_random_uuid(),
  bai_lam_id      uuid not null references bai_lam(id) on delete cascade,
  bai_test_cau_id uuid not null references bai_test_cau(id),
  dap_an_hs       jsonb,
  verdict         text check (verdict in ('correct','partial','wrong')),
  diem            numeric,
  cham_boi        text check (cham_boi in ('exact','cache','manual')),
  cham_at         timestamptz not null default now(),
  unique (bai_lam_id, bai_test_cau_id)
);

-- ── 6) bai_test_report — HS báo sai (chủ yếu tra_loi_ngan wrong) ─────────────
create table if not exists bai_test_report (
  id             uuid primary key default gen_random_uuid(),
  bai_lam_cau_id uuid not null references bai_lam_cau(id) on delete cascade,
  hoc_sinh_id    uuid not null references hoc_sinh(id),
  y_kien         text,
  trang_thai     text not null default 'moi' check (trang_thai in ('moi','dung','sai')),  -- người duyệt
  duyet_boi      uuid,
  duyet_at       timestamptz,
  created_at     timestamptz not null default now()
);
create index if not exists idx_report_moi on bai_test_report(trang_thai) where trang_thai = 'moi';

-- ── 7) question_accepted_answers — cache đáp-án-chuẩn-hoá (port V1) ──────────
create table if not exists question_accepted_answers (
  id                uuid primary key default gen_random_uuid(),
  ma_cau            text not null,
  answer_normalized text not null,
  answer_raw        text,
  source            text not null default 'manual',   -- manual | ai
  ai_reason         text,
  hit_count         int not null default 1,
  created_at        timestamptz not null default now(),
  unique (ma_cau, answer_normalized)
);
create or replace function public.increment_qaa_hit(p_id uuid) returns void
language sql security definer set search_path = public as $$
  update question_accepted_answers set hit_count = hit_count + 1 where id = p_id;
$$;
grant execute on function public.increment_qaa_hit(uuid) to authenticated;

-- ── 8) RLS — bảng mới KHÔNG được 0026 blanket phủ, khai TAY ─────────────────
alter table bai_test                enable row level security;
alter table bai_test_cau            enable row level security;
alter table bai_lam                 enable row level security;
alter table bai_lam_cau             enable row level security;
alter table bai_test_report         enable row level security;
alter table question_accepted_answers enable row level security;

-- STAFF (thành viên) toàn quyền: phát hành, xem cả lớp, chấm lại, duyệt report.
create policy bai_test_staff       on bai_test                for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy bai_test_cau_staff   on bai_test_cau            for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy bai_lam_staff        on bai_lam                 for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy bai_lam_cau_staff    on bai_lam_cau             for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy report_staff         on bai_test_report         for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy qaa_staff            on question_accepted_answers for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- HS: chỉ ĐỌC test của lớp mình đang ghi danh (live-derive).
create policy bai_test_hs_read on bai_test for select to authenticated
  using (public.hs_o_lop(lop_id));
create policy bai_test_cau_hs_read on bai_test_cau for select to authenticated
  using (exists (select 1 from bai_test bt where bt.id = bai_test_id and public.hs_o_lop(bt.lop_id)));

-- HS: đọc/ghi/sửa BÀI LÀM CỦA MÌNH.
create policy bai_lam_hs on bai_lam for all to authenticated
  using (hoc_sinh_id = public.my_hoc_sinh_id())
  with check (hoc_sinh_id = public.my_hoc_sinh_id());
create policy bai_lam_cau_hs on bai_lam_cau for all to authenticated
  using (exists (select 1 from bai_lam bl where bl.id = bai_lam_id and bl.hoc_sinh_id = public.my_hoc_sinh_id()))
  with check (exists (select 1 from bai_lam bl where bl.id = bai_lam_id and bl.hoc_sinh_id = public.my_hoc_sinh_id()));

-- HS: tạo/đọc report của mình.
create policy report_hs on bai_test_report for all to authenticated
  using (hoc_sinh_id = public.my_hoc_sinh_id())
  with check (hoc_sinh_id = public.my_hoc_sinh_id());

grant select, insert, update, delete on bai_test, bai_test_cau, bai_lam, bai_lam_cau, bai_test_report, question_accepted_answers to authenticated;
