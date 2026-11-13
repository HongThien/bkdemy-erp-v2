-- GỘP THEO KHUÔN — họ ban_do (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_ban_do. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_ban_do detach partition public.<nhánh>_ban_do; alter table … drop constraint <nhánh>_ban_do_kho_chk, drop column kho;
set local lock_timeout = '5s';
-- Làm khớp cột: thêm cột còn thiếu ở từng nhánh (cho phép rỗng; dữ liệu sẵn có không đổi)
alter table public.hgt_ban_do add column xoa_at timestamp with time zone;
alter table public.hgt_ban_do add column gop_vao text;
alter table public.khtn_ban_do add column xoa_at timestamp with time zone;
alter table public.khtn_ban_do add column gop_vao text;
alter table public.vatly_ban_do add column xoa_at timestamp with time zone;
alter table public.vatly_ban_do add column gop_vao text;
alter table public.hoahoc_ban_do add column xoa_at timestamp with time zone;
alter table public.hoahoc_ban_do add column gop_vao text;
alter table public.dai_ban_do add column kho text not null default 'dai' constraint dai_ban_do_kho_chk check (kho = 'dai');
alter table public.hgt_ban_do add column kho text not null default 'hgt' constraint hgt_ban_do_kho_chk check (kho = 'hgt');
alter table public.khtn_ban_do add column kho text not null default 'khtn' constraint khtn_ban_do_kho_chk check (kho = 'khtn');
alter table public.vatly_ban_do add column kho text not null default 'vatly' constraint vatly_ban_do_kho_chk check (kho = 'vatly');
alter table public.hoahoc_ban_do add column kho text not null default 'hoahoc' constraint hoahoc_ban_do_kho_chk check (kho = 'hoahoc');

create table public.kho_ban_do (
  ma_dang              text not null,
  khoi                 text not null,
  ma_chu_de            text not null,
  ten_chu_de           text not null,
  ma_chuyen_de         text not null,
  ten_chuyen_de        text not null,
  ten_dang             text not null,
  muc_do               smallint not null,
  created_at           timestamp with time zone not null default now(),
  bac_toi_thieu        text not null,
  mo_ta_ngan           text,
  xoa_at               timestamp with time zone,
  gop_vao              text,
  kho                  text not null
) partition by list (kho);
comment on table public.kho_ban_do is 'Bảng CHUNG khuôn dạng–câu, họ ban_do. Mỗi nhánh là một phần: <nhánh>_ban_do. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_ban_do attach partition public.dai_ban_do for values in ('dai');
alter table public.kho_ban_do attach partition public.hgt_ban_do for values in ('hgt');
alter table public.kho_ban_do attach partition public.khtn_ban_do for values in ('khtn');
alter table public.kho_ban_do attach partition public.vatly_ban_do for values in ('vatly');
alter table public.kho_ban_do attach partition public.hoahoc_ban_do for values in ('hoahoc');

alter table public.kho_ban_do enable row level security;
revoke all on public.kho_ban_do from anon;
create policy kho_ban_do_member_all on public.kho_ban_do for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_ban_do for select to claude_ro using (true);
