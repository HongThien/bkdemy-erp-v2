-- 0017 — Phụ huynh thành THỰC THỂ (có mã). 1 PH ↔ nhiều con (HS).
-- Lý do: thu học phí gom theo PH; tài khoản PH theo dõi nhiều con. Bỏ 3 cột PH text rời ở hoc_sinh.
create sequence if not exists ph_seq;
create table if not exists phu_huynh (
  id             uuid primary key default gen_random_uuid(),
  ma_ph          text not null unique default ('PH' || lpad(nextval('ph_seq')::text, 4, '0')),
  ho_ten         text not null,
  so_dien_thoai  text,
  email          text,
  dia_chi        text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table hoc_sinh add column if not exists phu_huynh_id uuid references phu_huynh(id) on delete set null;
-- bỏ 3 cột PH rời (thay bằng quan hệ; tránh trùng/đa-con không bắt cặp được)
alter table hoc_sinh drop column if exists ten_ph;
alter table hoc_sinh drop column if exists sdt_ph;
alter table hoc_sinh drop column if exists email_ph;

alter table phu_huynh enable row level security;
create policy phu_huynh_auth_all on phu_huynh for all to authenticated using (true) with check (true);
