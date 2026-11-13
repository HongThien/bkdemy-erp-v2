-- GỘP THEO KHUÔN — họ mcq_rule (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_mcq_rule. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_mcq_rule detach partition public.<nhánh>_mcq_rule; alter table … drop constraint <nhánh>_mcq_rule_kho_chk, drop column kho;
set local lock_timeout = '5s';
alter table public.dai_mcq_rule add column kho text not null default 'dai' constraint dai_mcq_rule_kho_chk check (kho = 'dai');
alter table public.hgt_mcq_rule add column kho text not null default 'hgt' constraint hgt_mcq_rule_kho_chk check (kho = 'hgt');
alter table public.khtn_mcq_rule add column kho text not null default 'khtn' constraint khtn_mcq_rule_kho_chk check (kho = 'khtn');
alter table public.vatly_mcq_rule add column kho text not null default 'vatly' constraint vatly_mcq_rule_kho_chk check (kho = 'vatly');
alter table public.hoahoc_mcq_rule add column kho text not null default 'hoahoc' constraint hoahoc_mcq_rule_kho_chk check (kho = 'hoahoc');

create table public.kho_mcq_rule (
  ma                   text not null,
  ten                  text not null,
  mo_ta                text not null,
  vi_du                text,
  nhom                 text not null,
  ap_dung              text[] not null default '{}'::text[],
  du_phong             boolean not null default false,
  active               boolean not null default true,
  created_at           timestamp with time zone not null default now(),
  kho                  text not null
) partition by list (kho);
comment on table public.kho_mcq_rule is 'Bảng CHUNG khuôn dạng–câu, họ mcq_rule. Mỗi nhánh là một phần: <nhánh>_mcq_rule. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_mcq_rule attach partition public.dai_mcq_rule for values in ('dai');
alter table public.kho_mcq_rule attach partition public.hgt_mcq_rule for values in ('hgt');
alter table public.kho_mcq_rule attach partition public.khtn_mcq_rule for values in ('khtn');
alter table public.kho_mcq_rule attach partition public.vatly_mcq_rule for values in ('vatly');
alter table public.kho_mcq_rule attach partition public.hoahoc_mcq_rule for values in ('hoahoc');

alter table public.kho_mcq_rule enable row level security;
revoke all on public.kho_mcq_rule from anon;
create policy kho_mcq_rule_member_all on public.kho_mcq_rule for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_mcq_rule for select to claude_ro using (true);
