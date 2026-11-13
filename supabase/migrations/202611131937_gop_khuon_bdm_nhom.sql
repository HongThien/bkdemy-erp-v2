-- GỘP THEO KHUÔN — họ bdm_nhom (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_bdm_nhom. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_bdm_nhom detach partition public.<nhánh>_bdm_nhom; alter table … drop constraint <nhánh>_bdm_nhom_kho_chk, drop column kho;
set local lock_timeout = '5s';
-- Làm khớp cột: thêm cột còn thiếu ở từng nhánh (cho phép rỗng; dữ liệu sẵn có không đổi)
alter table public.dai_bdm_nhom add column ma_cu text;
alter table public.dai_bdm_nhom add column kho text not null default 'dai' constraint dai_bdm_nhom_kho_chk check (kho = 'dai');
alter table public.khtn_bdm_nhom add column kho text not null default 'khtn' constraint khtn_bdm_nhom_kho_chk check (kho = 'khtn');
alter table public.vatly_bdm_nhom add column kho text not null default 'vatly' constraint vatly_bdm_nhom_kho_chk check (kho = 'vatly');
alter table public.hoahoc_bdm_nhom add column kho text not null default 'hoahoc' constraint hoahoc_bdm_nhom_kho_chk check (kho = 'hoahoc');

create table public.kho_bdm_nhom (
  id                   text not null,
  chu_de_id            text not null,
  chuyen_de_id         text not null,
  ten                  text not null,
  mo_ta                text not null default ''::text,
  ly_thuyet            text not null default ''::text,
  ly_thuyet_file_url   text,
  ly_thuyet_ten_file   text,
  thu_tu               integer,
  created_at           timestamp with time zone not null default now(),
  updated_at           timestamp with time zone not null default now(),
  ma_cu                text,
  kho                  text not null
) partition by list (kho);
comment on table public.kho_bdm_nhom is 'Bảng CHUNG khuôn dạng–câu, họ bdm_nhom. Mỗi nhánh là một phần: <nhánh>_bdm_nhom. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_bdm_nhom attach partition public.dai_bdm_nhom for values in ('dai');
alter table public.kho_bdm_nhom attach partition public.khtn_bdm_nhom for values in ('khtn');
alter table public.kho_bdm_nhom attach partition public.vatly_bdm_nhom for values in ('vatly');
alter table public.kho_bdm_nhom attach partition public.hoahoc_bdm_nhom for values in ('hoahoc');

alter table public.kho_bdm_nhom enable row level security;
revoke all on public.kho_bdm_nhom from anon;
create policy kho_bdm_nhom_member_all on public.kho_bdm_nhom for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_bdm_nhom for select to claude_ro using (true);
