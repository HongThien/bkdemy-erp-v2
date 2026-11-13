-- GỘP THEO KHUÔN — họ de_xuat_cau (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_de_xuat_cau. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_de_xuat_cau detach partition public.<nhánh>_de_xuat_cau; alter table … drop constraint <nhánh>_de_xuat_cau_kho_chk, drop column kho;
set local lock_timeout = '5s';
alter table public.dai_de_xuat_cau add column kho text not null default 'dai' constraint dai_de_xuat_cau_kho_chk check (kho = 'dai');
alter table public.khtn_de_xuat_cau add column kho text not null default 'khtn' constraint khtn_de_xuat_cau_kho_chk check (kho = 'khtn');
alter table public.vatly_de_xuat_cau add column kho text not null default 'vatly' constraint vatly_de_xuat_cau_kho_chk check (kho = 'vatly');
alter table public.hoahoc_de_xuat_cau add column kho text not null default 'hoahoc' constraint hoahoc_de_xuat_cau_kho_chk check (kho = 'hoahoc');

create table public.kho_de_xuat_cau (
  de_xuat_id           uuid not null,
  ma_cau               text not null,
  kho                  text not null
) partition by list (kho);
comment on table public.kho_de_xuat_cau is 'Bảng CHUNG khuôn dạng–câu, họ de_xuat_cau. Mỗi nhánh là một phần: <nhánh>_de_xuat_cau. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_de_xuat_cau attach partition public.dai_de_xuat_cau for values in ('dai');
alter table public.kho_de_xuat_cau attach partition public.khtn_de_xuat_cau for values in ('khtn');
alter table public.kho_de_xuat_cau attach partition public.vatly_de_xuat_cau for values in ('vatly');
alter table public.kho_de_xuat_cau attach partition public.hoahoc_de_xuat_cau for values in ('hoahoc');

alter table public.kho_de_xuat_cau enable row level security;
revoke all on public.kho_de_xuat_cau from anon;
create policy kho_de_xuat_cau_member_all on public.kho_de_xuat_cau for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_de_xuat_cau for select to claude_ro using (true);
