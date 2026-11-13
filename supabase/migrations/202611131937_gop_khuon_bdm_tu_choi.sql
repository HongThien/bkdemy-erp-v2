-- GỘP THEO KHUÔN — họ bdm_tu_choi (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_bdm_tu_choi. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_bdm_tu_choi detach partition public.<nhánh>_bdm_tu_choi; alter table … drop constraint <nhánh>_bdm_tu_choi_kho_chk, drop column kho;
set local lock_timeout = '5s';
-- Cột tự tăng kiểu IDENTITY không gắn làm phần được ⇒ đổi sang sequence + default (số kế tiếp giữ nguyên)
alter table public.dai_bdm_tu_choi alter column id drop identity;
create sequence public.dai_bdm_tu_choi_id_seq2 owned by public.dai_bdm_tu_choi.id;
select setval('public.dai_bdm_tu_choi_id_seq2', greatest((select coalesce(max(id), 0) from public.dai_bdm_tu_choi), 1), (select count(*) > 0 from public.dai_bdm_tu_choi));
alter table public.dai_bdm_tu_choi alter column id set default nextval('public.dai_bdm_tu_choi_id_seq2');
alter table public.hgt_bdm_tu_choi alter column id drop identity;
create sequence public.hgt_bdm_tu_choi_id_seq2 owned by public.hgt_bdm_tu_choi.id;
select setval('public.hgt_bdm_tu_choi_id_seq2', greatest((select coalesce(max(id), 0) from public.hgt_bdm_tu_choi), 1), (select count(*) > 0 from public.hgt_bdm_tu_choi));
alter table public.hgt_bdm_tu_choi alter column id set default nextval('public.hgt_bdm_tu_choi_id_seq2');
alter table public.khtn_bdm_tu_choi alter column id drop identity;
create sequence public.khtn_bdm_tu_choi_id_seq2 owned by public.khtn_bdm_tu_choi.id;
select setval('public.khtn_bdm_tu_choi_id_seq2', greatest((select coalesce(max(id), 0) from public.khtn_bdm_tu_choi), 1), (select count(*) > 0 from public.khtn_bdm_tu_choi));
alter table public.khtn_bdm_tu_choi alter column id set default nextval('public.khtn_bdm_tu_choi_id_seq2');
alter table public.vatly_bdm_tu_choi alter column id drop identity;
create sequence public.vatly_bdm_tu_choi_id_seq2 owned by public.vatly_bdm_tu_choi.id;
select setval('public.vatly_bdm_tu_choi_id_seq2', greatest((select coalesce(max(id), 0) from public.vatly_bdm_tu_choi), 1), (select count(*) > 0 from public.vatly_bdm_tu_choi));
alter table public.vatly_bdm_tu_choi alter column id set default nextval('public.vatly_bdm_tu_choi_id_seq2');
alter table public.hoahoc_bdm_tu_choi alter column id drop identity;
create sequence public.hoahoc_bdm_tu_choi_id_seq2 owned by public.hoahoc_bdm_tu_choi.id;
select setval('public.hoahoc_bdm_tu_choi_id_seq2', greatest((select coalesce(max(id), 0) from public.hoahoc_bdm_tu_choi), 1), (select count(*) > 0 from public.hoahoc_bdm_tu_choi));
alter table public.hoahoc_bdm_tu_choi alter column id set default nextval('public.hoahoc_bdm_tu_choi_id_seq2');
alter table public.dai_bdm_tu_choi add column kho text not null default 'dai' constraint dai_bdm_tu_choi_kho_chk check (kho = 'dai');
alter table public.hgt_bdm_tu_choi add column kho text not null default 'hgt' constraint hgt_bdm_tu_choi_kho_chk check (kho = 'hgt');
alter table public.khtn_bdm_tu_choi add column kho text not null default 'khtn' constraint khtn_bdm_tu_choi_kho_chk check (kho = 'khtn');
alter table public.vatly_bdm_tu_choi add column kho text not null default 'vatly' constraint vatly_bdm_tu_choi_kho_chk check (kho = 'vatly');
alter table public.hoahoc_bdm_tu_choi add column kho text not null default 'hoahoc' constraint hoahoc_bdm_tu_choi_kho_chk check (kho = 'hoahoc');

create table public.kho_bdm_tu_choi (
  id                   bigint not null,
  ma_cau               text not null,
  dang_bai_ai_id       text,
  hang                 text not null,
  kho_rac              boolean not null default false,
  ly_do                text not null,
  actor                uuid default jwt_uid(),
  at                   timestamp with time zone not null default now(),
  kho                  text not null
) partition by list (kho);
comment on table public.kho_bdm_tu_choi is 'Bảng CHUNG khuôn dạng–câu, họ bdm_tu_choi. Mỗi nhánh là một phần: <nhánh>_bdm_tu_choi. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_bdm_tu_choi attach partition public.dai_bdm_tu_choi for values in ('dai');
alter table public.kho_bdm_tu_choi attach partition public.hgt_bdm_tu_choi for values in ('hgt');
alter table public.kho_bdm_tu_choi attach partition public.khtn_bdm_tu_choi for values in ('khtn');
alter table public.kho_bdm_tu_choi attach partition public.vatly_bdm_tu_choi for values in ('vatly');
alter table public.kho_bdm_tu_choi attach partition public.hoahoc_bdm_tu_choi for values in ('hoahoc');

alter table public.kho_bdm_tu_choi enable row level security;
revoke all on public.kho_bdm_tu_choi from anon;
create policy kho_bdm_tu_choi_member_all on public.kho_bdm_tu_choi for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_bdm_tu_choi for select to claude_ro using (true);
