-- GỘP THEO KHUÔN — họ bdm_log (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_bdm_log. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_bdm_log detach partition public.<nhánh>_bdm_log; alter table … drop constraint <nhánh>_bdm_log_kho_chk, drop column kho;
set local lock_timeout = '5s';
-- Cột tự tăng kiểu IDENTITY không gắn làm phần được ⇒ đổi sang sequence + default (số kế tiếp giữ nguyên)
alter table public.khtn_bdm_log alter column id drop identity;
create sequence public.khtn_bdm_log_id_seq2 owned by public.khtn_bdm_log.id;
select setval('public.khtn_bdm_log_id_seq2', greatest((select coalesce(max(id), 0) from public.khtn_bdm_log), 1), (select count(*) > 0 from public.khtn_bdm_log));
alter table public.khtn_bdm_log alter column id set default nextval('public.khtn_bdm_log_id_seq2');
alter table public.vatly_bdm_log alter column id drop identity;
create sequence public.vatly_bdm_log_id_seq2 owned by public.vatly_bdm_log.id;
select setval('public.vatly_bdm_log_id_seq2', greatest((select coalesce(max(id), 0) from public.vatly_bdm_log), 1), (select count(*) > 0 from public.vatly_bdm_log));
alter table public.vatly_bdm_log alter column id set default nextval('public.vatly_bdm_log_id_seq2');
alter table public.hoahoc_bdm_log alter column id drop identity;
create sequence public.hoahoc_bdm_log_id_seq2 owned by public.hoahoc_bdm_log.id;
select setval('public.hoahoc_bdm_log_id_seq2', greatest((select coalesce(max(id), 0) from public.hoahoc_bdm_log), 1), (select count(*) > 0 from public.hoahoc_bdm_log));
alter table public.hoahoc_bdm_log alter column id set default nextval('public.hoahoc_bdm_log_id_seq2');
alter table public.dai_bdm_log add column kho text not null default 'dai' constraint dai_bdm_log_kho_chk check (kho = 'dai');
alter table public.khtn_bdm_log add column kho text not null default 'khtn' constraint khtn_bdm_log_kho_chk check (kho = 'khtn');
alter table public.vatly_bdm_log add column kho text not null default 'vatly' constraint vatly_bdm_log_kho_chk check (kho = 'vatly');
alter table public.hoahoc_bdm_log add column kho text not null default 'hoahoc' constraint hoahoc_bdm_log_kho_chk check (kho = 'hoahoc');

create table public.kho_bdm_log (
  id                   bigint not null,
  bang                 text not null,
  khoa                 text,
  hanh_dong            text not null,
  cu                   jsonb,
  moi                  jsonb,
  actor                uuid default jwt_uid(),
  at                   timestamp with time zone not null default now(),
  kho                  text not null
) partition by list (kho);
comment on table public.kho_bdm_log is 'Bảng CHUNG khuôn dạng–câu, họ bdm_log. Mỗi nhánh là một phần: <nhánh>_bdm_log. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_bdm_log attach partition public.dai_bdm_log for values in ('dai');
alter table public.kho_bdm_log attach partition public.khtn_bdm_log for values in ('khtn');
alter table public.kho_bdm_log attach partition public.vatly_bdm_log for values in ('vatly');
alter table public.kho_bdm_log attach partition public.hoahoc_bdm_log for values in ('hoahoc');

alter table public.kho_bdm_log enable row level security;
revoke all on public.kho_bdm_log from anon;
create policy kho_bdm_log_member_all on public.kho_bdm_log for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_bdm_log for select to claude_ro using (true);
