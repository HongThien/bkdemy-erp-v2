-- ============================================================================
-- 0074 — HỌC PHÍ (spec-hocphi.md, chốt với Thùy 07-05).
-- ----------------------------------------------------------------------------
-- Model chốt (KHÁC bản spec gốc ở 2 chỗ, Thùy sửa trực tiếp khi review):
--  · Giá học phí + giá đuổi đi CÙNG NHAU theo 1 "mức" — mỗi LỚP gán 1 mức
--    (muc_hoc_phi), KHÔNG gõ tay từng lớp, KHÔNG hằng số GIA_DUOI toàn hệ
--    (giá đuổi có 2 bậc 150k/250k, đi theo mức của LỚP GỐC — không phải hằng số).
--  · Học liệu = mức RIÊNG theo LỚP (muc_hoc_lieu, độc lập mức học phí) — KHÔNG
--    phải bậc sub-linear theo TỔNG số lớp của 1 con (spec gốc §11 sai giả định
--    thực tế). Tổng học liệu 1 con/tháng = Σ muc_hoc_lieu.gia của MỌI lớp con học.
--  · `loai='duoi'` trong spec SAI — giá trị thật là `bo_tro_duoi` (mig 0055, đã
--    verify schema trước khi viết migration này, đúng §SQL rule).
-- ============================================================================

-- ── 1) MỨC HỌC PHÍ + MỨC HỌC LIỆU (config sửa 1 chỗ, đổi hàng loạt lớp) ──────
create table if not exists muc_hoc_phi (
  id             uuid primary key default gen_random_uuid(),
  ten            text not null,           -- "Mức 250k"...
  don_gia_buoi   numeric not null,        -- 150000 | 180000 | 200000 | 250000...
  gia_duoi       numeric not null,        -- 150000 | 250000 (giá đuổi CỦA MỨC này)
  created_at     timestamptz not null default now()
);
create table if not exists muc_hoc_lieu (
  id         uuid primary key default gen_random_uuid(),
  ten        text not null,               -- "Mức 20k"...
  gia        numeric not null,            -- 20000 | 30000...
  created_at timestamptz not null default now()
);
alter table muc_hoc_phi  enable row level security;
alter table muc_hoc_lieu enable row level security;
create policy muc_hoc_phi_member_all  on muc_hoc_phi  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy muc_hoc_lieu_member_all on muc_hoc_lieu for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on muc_hoc_phi, muc_hoc_lieu to authenticated;

-- ── 2) LỚP gán mức (thay lop.don_gia_buoi tự gõ) ────────────────────────────
alter table lop add column if not exists muc_hoc_phi_id  uuid references muc_hoc_phi(id);
alter table lop add column if not exists muc_hoc_lieu_id uuid references muc_hoc_lieu(id);

-- ── 3) HỆ SỐ HỌC PHÍ per-HS (tài sản GIA ĐÌNH, đóng dấu lên mọi con — §4) ────
alter table hoc_sinh add column if not exists he_so_hoc_phi numeric not null default 1;
alter table hoc_sinh add column if not exists he_so_nguon   text    not null default 'auto' check (he_so_nguon in ('auto','manual'));

-- ── 4) BẢNG GIAO DỊCH (append-only + trigger log tiền = phải có vết) ────────
create table if not exists hoa_don (
  id          uuid primary key default gen_random_uuid(),
  phu_huynh_id uuid not null references phu_huynh(id),
  ky          date not null,              -- mốc THÁNG (instant UTC, ngày 1 đầu tháng VN)
  trang_thai  text not null default 'chua_thu' check (trang_thai in ('chua_thu','da_thu','thu_mot_phan','qua_han','xet_duyet','mien')),
  tong_tien   numeric not null default 0,
  dong_at     timestamptz,                -- mốc "chốt kỳ" (Ảo→Thật), atomic claim (where null)
  created_by  uuid,
  created_at  timestamptz not null default now(),
  unique (phu_huynh_id, ky)
);
create table if not exists hoa_don_dong (
  id          uuid primary key default gen_random_uuid(),
  hoa_don_id  uuid not null references hoa_don(id) on delete cascade,
  loai        text not null check (loai in ('hoc_phi','hoc_duoi','hoc_lieu','phat_sinh','no_ky_truoc')),
  hoc_sinh_id uuid references hoc_sinh(id),
  lop_id      uuid references lop(id),
  mo_ta       text,
  so_luong    numeric,
  don_gia     numeric,
  he_so       numeric,
  thanh_tien  numeric not null,
  snapshot    jsonb,                      -- đóng băng {so_buoi,don_gia,he_so} lúc chốt (giống band_luc_thi)
  created_at  timestamptz not null default now()
);
create table if not exists thanh_toan (
  id          uuid primary key default gen_random_uuid(),
  hoa_don_id  uuid not null references hoa_don(id) on delete cascade,
  so_tien     numeric not null,
  ngay        date not null default current_date,
  phuong_thuc text,
  nguoi_thu   uuid,
  ghi_chu     text,
  created_at  timestamptz not null default now()
);
create table if not exists hoc_phi_xet_duyet (
  id             uuid primary key default gen_random_uuid(),
  hoc_sinh_id    uuid not null references hoc_sinh(id),
  lop_id         uuid not null references lop(id),
  ky             date not null,
  ly_do          text not null check (ly_do in ('nghi_30','window_lech')),
  so_buoi_lop    int,
  so_buoi_window int,
  so_buoi_nghi   int,
  trang_thai     text not null default 'cho_duyet' check (trang_thai in ('cho_duyet','da_duyet')),
  so_buoi_chot   int,
  quyet_dinh     text,
  nguoi_duyet    uuid,
  duyet_at       timestamptz,
  created_at     timestamptz not null default now(),
  unique (hoc_sinh_id, lop_id, ky)
);

alter table hoa_don             enable row level security;
alter table hoa_don_dong        enable row level security;
alter table thanh_toan          enable row level security;
alter table hoc_phi_xet_duyet   enable row level security;
create policy hoa_don_member_all            on hoa_don             for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy hoa_don_dong_member_all       on hoa_don_dong        for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy thanh_toan_member_all         on thanh_toan          for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy hoc_phi_xet_duyet_member_all  on hoc_phi_xet_duyet   for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hoa_don, hoa_don_dong, thanh_toan, hoc_phi_xet_duyet to authenticated;

-- ── 5) TRIGGER LOG (§4: tiền/hệ-số phải có vết, append-only + state-log) ────
create table if not exists hoa_don_log (
  id          uuid primary key default gen_random_uuid(),
  hoa_don_id  uuid not null references hoa_don(id) on delete cascade,
  hanh_dong   text not null,              -- tao | doi_trang_thai | chot_ky
  truoc       jsonb,
  sau         jsonb not null,
  actor       uuid,
  ts          timestamptz not null default now()
);
alter table hoa_don_log enable row level security;
create policy hoa_don_log_member_all on hoa_don_log for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert on hoa_don_log to authenticated;

create or replace function public.log_hoa_don() returns trigger
language plpgsql security definer set search_path = public as $$
declare hd text;
begin
  if tg_op = 'INSERT' then hd := 'tao';
  elsif new.dong_at is not null and old.dong_at is null then hd := 'chot_ky';
  elsif new.trang_thai <> old.trang_thai then hd := 'doi_trang_thai';
  else hd := 'sua';
  end if;
  insert into hoa_don_log (hoa_don_id, hanh_dong, truoc, sau, actor)
  values (new.id, hd, case when tg_op = 'UPDATE' then to_jsonb(old) end, to_jsonb(new), public.jwt_uid());
  return new;
end $$;
drop trigger if exists trg_log_hoa_don on hoa_don;
create trigger trg_log_hoa_don after insert or update on hoa_don
  for each row execute function public.log_hoa_don();

-- hệ số học phí đổi (auto recompute HOẶC người sửa tay) → ghi vết trên hoc_sinh_lop_log
-- (tái dùng bảng đã có, KHÔNG đẻ bảng mới — hanh_dong mới 'doi_he_so_hoc_phi').
create or replace function public.log_he_so_hoc_phi() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.he_so_hoc_phi is distinct from old.he_so_hoc_phi or new.he_so_nguon is distinct from old.he_so_nguon then
    insert into hoc_sinh_lop_log (hoc_sinh_id, hanh_dong, truoc, sau, actor)
    values (new.id, 'doi_he_so_hoc_phi',
      jsonb_build_object('he_so_hoc_phi', old.he_so_hoc_phi, 'he_so_nguon', old.he_so_nguon),
      jsonb_build_object('he_so_hoc_phi', new.he_so_hoc_phi, 'he_so_nguon', new.he_so_nguon),
      public.jwt_uid());
  end if;
  return new;
end $$;
drop trigger if exists trg_log_he_so_hoc_phi on hoc_sinh;
create trigger trg_log_he_so_hoc_phi after update on hoc_sinh
  for each row execute function public.log_he_so_hoc_phi();
