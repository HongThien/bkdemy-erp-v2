-- GỘP THEO KHUÔN — họ cau_hoi (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_cau_hoi. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_cau_hoi detach partition public.<nhánh>_cau_hoi; alter table … drop constraint <nhánh>_cau_hoi_kho_chk, drop column kho;
set local lock_timeout = '5s';
-- Làm khớp cột: thêm cột còn thiếu ở từng nhánh (cho phép rỗng; dữ liệu sẵn có không đổi)
alter table public.dai_cau_hoi add column muc_cau smallint;
alter table public.hgt_cau_hoi add column nguon_loai text;
alter table public.hgt_cau_hoi add column muc_cau smallint;
alter table public.khtn_cau_hoi add column nguon_loai text;
alter table public.vatly_cau_hoi add column nguon_loai text;
alter table public.hoahoc_cau_hoi add column nguon_loai text;
alter table public.dai_cau_hoi add column kho text not null default 'dai' constraint dai_cau_hoi_kho_chk check (kho = 'dai');
alter table public.hgt_cau_hoi add column kho text not null default 'hgt' constraint hgt_cau_hoi_kho_chk check (kho = 'hgt');
alter table public.khtn_cau_hoi add column kho text not null default 'khtn' constraint khtn_cau_hoi_kho_chk check (kho = 'khtn');
alter table public.vatly_cau_hoi add column kho text not null default 'vatly' constraint vatly_cau_hoi_kho_chk check (kho = 'vatly');
alter table public.hoahoc_cau_hoi add column kho text not null default 'hoahoc' constraint hoahoc_cau_hoi_kho_chk check (kho = 'hoahoc');

create table public.kho_cau_hoi (
  ma_cau               text not null,
  dang_chinh           text not null,
  loai_cau             text not null,
  noi_dung             text not null,
  lua_chon             jsonb,
  menh_de              jsonb,
  dap_an               text,
  loi_giai             text,
  anh_de               text,
  anh_dap_an           text,
  created_at           timestamp with time zone not null default now(),
  nguon                text not null default 'le'::text,
  parent_ma_cau        text,
  clone_method         text,
  nguon_giai           text not null default 'nguoi'::text,
  xoa_at               timestamp with time zone,
  ma_cum               text,
  da_duyet             boolean not null default false,
  duyet_boi            uuid,
  duyet_at             timestamp with time zone,
  giai_method          text,
  loi_giai_ai          text,
  dap_an_ai            text,
  ai_model             text,
  ai_de_xuat_at        timestamp with time zone,
  kiem_may             text,
  kiem_may_at          timestamp with time zone,
  kiem_may_boi         text,
  kiem_may_ghi         text,
  duyet_nguon          text,
  dang_ai_de_xuat      text,
  kiem_may_lo          uuid,
  kho_chuan            boolean generated always as (_kho_cau_chuan(da_duyet, kiem_may, created_at, giai_method)) stored,
  ten_de_goc           text,
  nguon_loai           text,
  muc_cau              smallint,
  kho                  text not null
) partition by list (kho);
comment on table public.kho_cau_hoi is 'Bảng CHUNG khuôn dạng–câu, họ cau_hoi. Mỗi nhánh là một phần: <nhánh>_cau_hoi. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_cau_hoi attach partition public.dai_cau_hoi for values in ('dai');
alter table public.kho_cau_hoi attach partition public.hgt_cau_hoi for values in ('hgt');
alter table public.kho_cau_hoi attach partition public.khtn_cau_hoi for values in ('khtn');
alter table public.kho_cau_hoi attach partition public.vatly_cau_hoi for values in ('vatly');
alter table public.kho_cau_hoi attach partition public.hoahoc_cau_hoi for values in ('hoahoc');

alter table public.kho_cau_hoi enable row level security;
revoke all on public.kho_cau_hoi from anon;
create policy kho_cau_hoi_member_all on public.kho_cau_hoi for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_cau_hoi for select to claude_ro using (true);
