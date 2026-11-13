-- GỘP THEO KHUÔN — họ bdm_kiem_mau (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_bdm_kiem_mau. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_bdm_kiem_mau detach partition public.<nhánh>_bdm_kiem_mau; alter table … drop constraint <nhánh>_bdm_kiem_mau_kho_chk, drop column kho;
set local lock_timeout = '5s';
alter table public.dai_bdm_kiem_mau add column kho text not null default 'dai' constraint dai_bdm_kiem_mau_kho_chk check (kho = 'dai');
alter table public.hgt_bdm_kiem_mau add column kho text not null default 'hgt' constraint hgt_bdm_kiem_mau_kho_chk check (kho = 'hgt');
alter table public.khtn_bdm_kiem_mau add column kho text not null default 'khtn' constraint khtn_bdm_kiem_mau_kho_chk check (kho = 'khtn');
alter table public.vatly_bdm_kiem_mau add column kho text not null default 'vatly' constraint vatly_bdm_kiem_mau_kho_chk check (kho = 'vatly');
alter table public.hoahoc_bdm_kiem_mau add column kho text not null default 'hoahoc' constraint hoahoc_bdm_kiem_mau_kho_chk check (kho = 'hoahoc');

create table public.kho_bdm_kiem_mau (
  ma_cau               text not null,
  dang_bai_ai_id       text not null,
  ket_qua              text not null,
  actor                uuid default jwt_uid(),
  at                   timestamp with time zone not null default now(),
  kho                  text not null
) partition by list (kho);
comment on table public.kho_bdm_kiem_mau is 'Bảng CHUNG khuôn dạng–câu, họ bdm_kiem_mau. Mỗi nhánh là một phần: <nhánh>_bdm_kiem_mau. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_bdm_kiem_mau attach partition public.dai_bdm_kiem_mau for values in ('dai');
alter table public.kho_bdm_kiem_mau attach partition public.hgt_bdm_kiem_mau for values in ('hgt');
alter table public.kho_bdm_kiem_mau attach partition public.khtn_bdm_kiem_mau for values in ('khtn');
alter table public.kho_bdm_kiem_mau attach partition public.vatly_bdm_kiem_mau for values in ('vatly');
alter table public.kho_bdm_kiem_mau attach partition public.hoahoc_bdm_kiem_mau for values in ('hoahoc');

alter table public.kho_bdm_kiem_mau enable row level security;
revoke all on public.kho_bdm_kiem_mau from anon;
create policy kho_bdm_kiem_mau_member_all on public.kho_bdm_kiem_mau for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_bdm_kiem_mau for select to claude_ro using (true);
