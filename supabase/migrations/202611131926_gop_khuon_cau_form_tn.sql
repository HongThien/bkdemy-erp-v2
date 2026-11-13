-- GỘP THEO KHUÔN — họ cau_form_tn (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_cau_form_tn. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_cau_form_tn detach partition public.<nhánh>_cau_form_tn; alter table … drop constraint <nhánh>_cau_form_tn_kho_chk, drop column kho;
set local lock_timeout = '5s';
alter table public.dai_cau_form_tn add column kho text not null default 'dai' constraint dai_cau_form_tn_kho_chk check (kho = 'dai');
alter table public.hgt_cau_form_tn add column kho text not null default 'hgt' constraint hgt_cau_form_tn_kho_chk check (kho = 'hgt');
alter table public.khtn_cau_form_tn add column kho text not null default 'khtn' constraint khtn_cau_form_tn_kho_chk check (kho = 'khtn');
alter table public.vatly_cau_form_tn add column kho text not null default 'vatly' constraint vatly_cau_form_tn_kho_chk check (kho = 'vatly');
alter table public.hoahoc_cau_form_tn add column kho text not null default 'hoahoc' constraint hoahoc_cau_form_tn_kho_chk check (kho = 'hoahoc');

create table public.kho_cau_form_tn (
  id                   uuid not null default gen_random_uuid(),
  ma_cau               text not null,
  lua_chon             jsonb not null,
  dap_an               text not null,
  key_gia_tri          text not null,
  nguon                text not null default 'ai'::text,
  ai_model             text,
  sinh_at              timestamp with time zone not null default now(),
  da_duyet             boolean not null default false,
  duyet_boi            uuid,
  duyet_at             timestamp with time zone,
  sua_truoc_duyet      boolean not null default false,
  tu_choi_ly_do        text,
  xoa_at               timestamp with time zone,
  updated_at           timestamp with time zone not null default now(),
  tu_choi_boi          uuid,
  kho                  text not null
) partition by list (kho);
comment on table public.kho_cau_form_tn is 'Bảng CHUNG khuôn dạng–câu, họ cau_form_tn. Mỗi nhánh là một phần: <nhánh>_cau_form_tn. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_cau_form_tn attach partition public.dai_cau_form_tn for values in ('dai');
alter table public.kho_cau_form_tn attach partition public.hgt_cau_form_tn for values in ('hgt');
alter table public.kho_cau_form_tn attach partition public.khtn_cau_form_tn for values in ('khtn');
alter table public.kho_cau_form_tn attach partition public.vatly_cau_form_tn for values in ('vatly');
alter table public.kho_cau_form_tn attach partition public.hoahoc_cau_form_tn for values in ('hoahoc');

alter table public.kho_cau_form_tn enable row level security;
revoke all on public.kho_cau_form_tn from anon;
create policy kho_cau_form_tn_member_all on public.kho_cau_form_tn for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_cau_form_tn for select to claude_ro using (true);
