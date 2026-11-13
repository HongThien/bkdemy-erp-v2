-- GỘP THEO KHUÔN — họ cau_hoi_yeu_cau_giai (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_cau_hoi_yeu_cau_giai. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_cau_hoi_yeu_cau_giai detach partition public.<nhánh>_cau_hoi_yeu_cau_giai; alter table … drop constraint <nhánh>_cau_hoi_yeu_cau_giai_kho_chk, drop column kho;
set local lock_timeout = '5s';
alter table public.dai_cau_hoi_yeu_cau_giai add column kho text not null default 'dai' constraint dai_cau_hoi_yeu_cau_giai_kho_chk check (kho = 'dai');
alter table public.hgt_cau_hoi_yeu_cau_giai add column kho text not null default 'hgt' constraint hgt_cau_hoi_yeu_cau_giai_kho_chk check (kho = 'hgt');
alter table public.khtn_cau_hoi_yeu_cau_giai add column kho text not null default 'khtn' constraint khtn_cau_hoi_yeu_cau_giai_kho_chk check (kho = 'khtn');
alter table public.vatly_cau_hoi_yeu_cau_giai add column kho text not null default 'vatly' constraint vatly_cau_hoi_yeu_cau_giai_kho_chk check (kho = 'vatly');
alter table public.hoahoc_cau_hoi_yeu_cau_giai add column kho text not null default 'hoahoc' constraint hoahoc_cau_hoi_yeu_cau_giai_kho_chk check (kho = 'hoahoc');

create table public.kho_cau_hoi_yeu_cau_giai (
  id                   uuid not null default gen_random_uuid(),
  ma_cau               text not null,
  ghi_chu              text,
  nguoi_yeu_cau        uuid,
  created_at           timestamp with time zone not null default now(),
  xu_ly_at             timestamp with time zone,
  nguoi_giai           uuid,
  trang_thai           text not null default 'cho_claude'::text,
  han_at               timestamp with time zone,
  nop_at               timestamp with time zone,
  cap_nhat_at          timestamp with time zone,
  loi_giai_nhap        text,
  anh_nhap             text,
  dap_an_nhap          text,
  tu_choi_lan          integer not null default 0,
  ly_do_tu_choi        text,
  tu_choi_at           timestamp with time zone,
  duyet_boi            uuid,
  duyet_at             timestamp with time zone,
  so_ky_tu             integer generated always as (length(COALESCE(loi_giai_nhap, ''::text))) stored,
  so_cong_thuc         integer generated always as (((length(COALESCE(loi_giai_nhap, ''::text)) - length(replace(COALESCE(loi_giai_nhap, ''::text), '$'::text, ''::text))) / 2)) stored,
  loi_giai_ai          text,
  ai_model             text,
  che_do               text not null default 'giai'::text,
  y_nhap               jsonb,
  kho                  text not null
) partition by list (kho);
comment on table public.kho_cau_hoi_yeu_cau_giai is 'Bảng CHUNG khuôn dạng–câu, họ cau_hoi_yeu_cau_giai. Mỗi nhánh là một phần: <nhánh>_cau_hoi_yeu_cau_giai. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_cau_hoi_yeu_cau_giai attach partition public.dai_cau_hoi_yeu_cau_giai for values in ('dai');
alter table public.kho_cau_hoi_yeu_cau_giai attach partition public.hgt_cau_hoi_yeu_cau_giai for values in ('hgt');
alter table public.kho_cau_hoi_yeu_cau_giai attach partition public.khtn_cau_hoi_yeu_cau_giai for values in ('khtn');
alter table public.kho_cau_hoi_yeu_cau_giai attach partition public.vatly_cau_hoi_yeu_cau_giai for values in ('vatly');
alter table public.kho_cau_hoi_yeu_cau_giai attach partition public.hoahoc_cau_hoi_yeu_cau_giai for values in ('hoahoc');

alter table public.kho_cau_hoi_yeu_cau_giai enable row level security;
revoke all on public.kho_cau_hoi_yeu_cau_giai from anon;
create policy kho_cau_hoi_yeu_cau_giai_member_all on public.kho_cau_hoi_yeu_cau_giai for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_cau_hoi_yeu_cau_giai for select to claude_ro using (true);
