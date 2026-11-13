-- GỘP THEO KHUÔN — họ cum_bai (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_cum_bai. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_cum_bai detach partition public.<nhánh>_cum_bai; alter table … drop constraint <nhánh>_cum_bai_kho_chk, drop column kho;
set local lock_timeout = '5s';
alter table public.dai_cum_bai add column kho text not null default 'dai' constraint dai_cum_bai_kho_chk check (kho = 'dai');
alter table public.hgt_cum_bai add column kho text not null default 'hgt' constraint hgt_cum_bai_kho_chk check (kho = 'hgt');
alter table public.khtn_cum_bai add column kho text not null default 'khtn' constraint khtn_cum_bai_kho_chk check (kho = 'khtn');
alter table public.vatly_cum_bai add column kho text not null default 'vatly' constraint vatly_cum_bai_kho_chk check (kho = 'vatly');
alter table public.hoahoc_cum_bai add column kho text not null default 'hoahoc' constraint hoahoc_cum_bai_kho_chk check (kho = 'hoahoc');

create table public.kho_cum_bai (
  ma_cum               text not null default ('DCUM'::text || lpad((nextval('dai_cum_seq'::regclass))::text, 5, '0'::text)),
  ma_dang              text not null,
  ten                  text,
  thu_tu               smallint not null default 1,
  ghi_chu              text,
  created_at           timestamp with time zone not null default now(),
  kho                  text not null
) partition by list (kho);
comment on table public.kho_cum_bai is 'Bảng CHUNG khuôn dạng–câu, họ cum_bai. Mỗi nhánh là một phần: <nhánh>_cum_bai. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_cum_bai attach partition public.dai_cum_bai for values in ('dai');
alter table public.kho_cum_bai attach partition public.hgt_cum_bai for values in ('hgt');
alter table public.kho_cum_bai attach partition public.khtn_cum_bai for values in ('khtn');
alter table public.kho_cum_bai attach partition public.vatly_cum_bai for values in ('vatly');
alter table public.kho_cum_bai attach partition public.hoahoc_cum_bai for values in ('hoahoc');

alter table public.kho_cum_bai enable row level security;
revoke all on public.kho_cum_bai from anon;
create policy kho_cum_bai_member_all on public.kho_cum_bai for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_cum_bai for select to claude_ro using (true);
