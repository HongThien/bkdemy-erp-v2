-- 0050 — Kho KHTN (môn mới). ADR Chiều Môn: app.notion.com/p/389d4530bcdb81d1b700ff61afcc2faf
-- Bảng RIÊNG mỗi môn (Thùy chốt). KHTN = clone shape dai_* (Chủ-đề→Chuyên-đề→Dạng), KHÔNG nhánh Đại/Hình.
-- Toán (dai_/hinh_) KHÔNG đụng. Engine kho tham-số-hoá để dùng chung UI.

create sequence if not exists khtn_dang_seq;
create sequence if not exists khtn_cau_seq;

create table if not exists khtn_ban_do (
  ma_dang        text primary key default ('KG' || lpad(nextval('khtn_dang_seq')::text, 5, '0')),
  khoi           text not null,
  ma_chu_de      text not null,
  ten_chu_de     text not null,
  ma_chuyen_de   text not null,
  ten_chuyen_de  text not null,
  ten_dang       text not null,
  muc_do         smallint not null,
  bac_toi_thieu  text not null references lop_bac(ma),
  created_at     timestamptz not null default now()
);

create table if not exists khtn_cau_hoi (
  ma_cau        text primary key default ('KC' || lpad(nextval('khtn_cau_seq')::text, 6, '0')),
  dang_chinh    text not null references khtn_ban_do(ma_dang) on delete restrict,
  loai_cau      text not null,
  noi_dung      text not null,
  lua_chon      jsonb,
  menh_de       jsonb,
  dap_an        text,
  loi_giai      text,
  anh_de        text,
  anh_dap_an    text,
  nguon         text not null default 'le',
  nguon_giai    text not null default 'nguoi',
  parent_ma_cau text references khtn_cau_hoi(ma_cau),
  clone_method  text,
  created_at    timestamptz not null default now()
);

create table if not exists khtn_dang_ly_thuyet (
  ma_dang     text primary key references khtn_ban_do(ma_dang) on delete cascade,
  noi_dung    text not null default '',
  file_url    text,
  ten_file    text,
  cap_nhat_at timestamptz not null default now()
);

create table if not exists khtn_chuyen_de_ly_thuyet (
  ma_chuyen_de text primary key,
  noi_dung     text not null default '',
  file_url     text,
  ten_file     text,
  khong_can    boolean not null default false,
  cap_nhat_at  timestamptz not null default now()
);

alter table khtn_ban_do enable row level security;
alter table khtn_cau_hoi enable row level security;
alter table khtn_dang_ly_thuyet enable row level security;
alter table khtn_chuyen_de_ly_thuyet enable row level security;
create policy khtn_ban_do_member_all            on khtn_ban_do            for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy khtn_cau_hoi_member_all           on khtn_cau_hoi           for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy khtn_dang_ly_thuyet_member_all    on khtn_dang_ly_thuyet    for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy khtn_chuyen_de_ly_thuyet_member_all on khtn_chuyen_de_ly_thuyet for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on khtn_ban_do, khtn_cau_hoi, khtn_dang_ly_thuyet, khtn_chuyen_de_ly_thuyet to authenticated;

-- Tài liệu: gắn MÔN (default toan); nới FK ma_cau (để trỏ được câu môn khác — dispatch theo tai_lieu.mon).
alter table tai_lieu add column if not exists mon text not null default 'toan';
alter table tai_lieu_cau drop constraint if exists tai_lieu_cau_ma_cau_fkey;
