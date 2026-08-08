-- ============================================================================
-- 202608082109 — hinh_giai_tich_kho
-- ----------------------------------------------------------------------------
-- VÌ SAO: Hình giải tích (lượng giác, sau này Oxy/Oxyz) TƯ DUY như Đại — chia
-- chuyên đề/dạng, không phải mô hình/DAG như Hình tổng hợp. Thùy chốt: đây là 1
-- NHÁNH thứ 3 của Toán (Đại/Hình/Hình-giải-tích), tái dùng NGUYÊN i bản đồ 3 tầng
-- (BranchConfig) + "Làm tài liệu" (TaiLieuScreen/TaiLieuBuilder) của Đại — nhưng
-- BẢNG RIÊNG, không gộp (§1.6, giống KHTN clone dai_* — xem 0050_khtn_kho.sql).
--
-- `tai_lieu.mon` GIỮ NGUYÊN 'Toán' cho tài liệu Hình giải tích (RBAC/billing/
-- lop.mon vẫn cần mon sạch — §1.6 symmetry test). Phân biệt Đại/Hình-giải-tích
-- trong CÙNG mon='Toán' qua cột MỚI `tai_lieu.nhanh` (null = Đại, 'hinh_gt' = mới).
--
-- MẤT GÌ: không (chỉ tạo bảng/cột mới, không xoá/thu hẹp gì).
-- ============================================================================

create sequence if not exists hgt_dang_seq;
create sequence if not exists hgt_cau_seq;

create table if not exists hgt_ban_do (
  ma_dang        text primary key default ('GT' || lpad(nextval('hgt_dang_seq')::text, 5, '0')),
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

create table if not exists hgt_cau_hoi (
  ma_cau        text primary key default ('GC' || lpad(nextval('hgt_cau_seq')::text, 6, '0')),
  dang_chinh    text not null references hgt_ban_do(ma_dang) on delete restrict,
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
  parent_ma_cau text references hgt_cau_hoi(ma_cau),
  clone_method  text,
  created_at    timestamptz not null default now()
);

create table if not exists hgt_dang_ly_thuyet (
  ma_dang     text primary key references hgt_ban_do(ma_dang) on delete cascade,
  noi_dung    text not null default '',
  file_url    text,
  ten_file    text,
  cap_nhat_at timestamptz not null default now()
);

create table if not exists hgt_chuyen_de_ly_thuyet (
  ma_chuyen_de text primary key,
  noi_dung     text not null default '',
  file_url     text,
  ten_file     text,
  khong_can    boolean not null default false,
  cap_nhat_at  timestamptz not null default now()
);

alter table hgt_ban_do enable row level security;
alter table hgt_cau_hoi enable row level security;
alter table hgt_dang_ly_thuyet enable row level security;
alter table hgt_chuyen_de_ly_thuyet enable row level security;
create policy hgt_ban_do_member_all             on hgt_ban_do             for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy hgt_cau_hoi_member_all            on hgt_cau_hoi            for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy hgt_dang_ly_thuyet_member_all     on hgt_dang_ly_thuyet     for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
create policy hgt_chuyen_de_ly_thuyet_member_all on hgt_chuyen_de_ly_thuyet for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hgt_ban_do, hgt_cau_hoi, hgt_dang_ly_thuyet, hgt_chuyen_de_ly_thuyet to authenticated;

-- Tài liệu: NHÁNH trong cùng mon='Toán' (mon giữ sạch cho RBAC/billing). null = Đại (không đổi hành vi cũ).
alter table tai_lieu add column if not exists nhanh text;
