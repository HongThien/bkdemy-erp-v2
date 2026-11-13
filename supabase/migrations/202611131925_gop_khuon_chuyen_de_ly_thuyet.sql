-- GỘP THEO KHUÔN — họ chuyen_de_ly_thuyet (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_chuyen_de_ly_thuyet. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_chuyen_de_ly_thuyet detach partition public.<nhánh>_chuyen_de_ly_thuyet; alter table … drop constraint <nhánh>_chuyen_de_ly_thuyet_kho_chk, drop column kho;
set local lock_timeout = '5s';
alter table public.dai_chuyen_de_ly_thuyet add column kho text not null default 'dai' constraint dai_chuyen_de_ly_thuyet_kho_chk check (kho = 'dai');
alter table public.hgt_chuyen_de_ly_thuyet add column kho text not null default 'hgt' constraint hgt_chuyen_de_ly_thuyet_kho_chk check (kho = 'hgt');
alter table public.khtn_chuyen_de_ly_thuyet add column kho text not null default 'khtn' constraint khtn_chuyen_de_ly_thuyet_kho_chk check (kho = 'khtn');
alter table public.vatly_chuyen_de_ly_thuyet add column kho text not null default 'vatly' constraint vatly_chuyen_de_ly_thuyet_kho_chk check (kho = 'vatly');
alter table public.hoahoc_chuyen_de_ly_thuyet add column kho text not null default 'hoahoc' constraint hoahoc_chuyen_de_ly_thuyet_kho_chk check (kho = 'hoahoc');

create table public.kho_chuyen_de_ly_thuyet (
  ma_chuyen_de         text not null,
  noi_dung             text not null default ''::text,
  file_url             text,
  ten_file             text,
  cap_nhat_at          timestamp with time zone not null default now(),
  khong_can            boolean not null default false,
  kho                  text not null
) partition by list (kho);
comment on table public.kho_chuyen_de_ly_thuyet is 'Bảng CHUNG khuôn dạng–câu, họ chuyen_de_ly_thuyet. Mỗi nhánh là một phần: <nhánh>_chuyen_de_ly_thuyet. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_chuyen_de_ly_thuyet attach partition public.dai_chuyen_de_ly_thuyet for values in ('dai');
alter table public.kho_chuyen_de_ly_thuyet attach partition public.hgt_chuyen_de_ly_thuyet for values in ('hgt');
alter table public.kho_chuyen_de_ly_thuyet attach partition public.khtn_chuyen_de_ly_thuyet for values in ('khtn');
alter table public.kho_chuyen_de_ly_thuyet attach partition public.vatly_chuyen_de_ly_thuyet for values in ('vatly');
alter table public.kho_chuyen_de_ly_thuyet attach partition public.hoahoc_chuyen_de_ly_thuyet for values in ('hoahoc');

alter table public.kho_chuyen_de_ly_thuyet enable row level security;
revoke all on public.kho_chuyen_de_ly_thuyet from anon;
create policy kho_chuyen_de_ly_thuyet_member_all on public.kho_chuyen_de_ly_thuyet for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_chuyen_de_ly_thuyet for select to claude_ro using (true);
