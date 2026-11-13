-- GỘP THEO KHUÔN — họ de_xuat_quyet_dinh (spec-kien-truc.md §2b; mẫu: mig 202611131904). Sinh bởi scripts/kien-truc/gop-khuon.mjs.
-- Không chép dữ liệu, không đổi tên: mỗi bảng nhánh thêm cột `kho` (hằng) rồi gắn làm một PHẦN của bảng chung kho_de_xuat_quyet_dinh. Tên cũ vẫn là bảng thật.
-- Hoàn tác: alter table public.kho_de_xuat_quyet_dinh detach partition public.<nhánh>_de_xuat_quyet_dinh; alter table … drop constraint <nhánh>_de_xuat_quyet_dinh_kho_chk, drop column kho;
set local lock_timeout = '5s';
alter table public.dai_de_xuat_quyet_dinh add column kho text not null default 'dai' constraint dai_de_xuat_quyet_dinh_kho_chk check (kho = 'dai');
alter table public.khtn_de_xuat_quyet_dinh add column kho text not null default 'khtn' constraint khtn_de_xuat_quyet_dinh_kho_chk check (kho = 'khtn');
alter table public.vatly_de_xuat_quyet_dinh add column kho text not null default 'vatly' constraint vatly_de_xuat_quyet_dinh_kho_chk check (kho = 'vatly');
alter table public.hoahoc_de_xuat_quyet_dinh add column kho text not null default 'hoahoc' constraint hoahoc_de_xuat_quyet_dinh_kho_chk check (kho = 'hoahoc');

create table public.kho_de_xuat_quyet_dinh (
  de_xuat_id           uuid not null,
  hanh_dong            text not null,
  ket_qua_ma_dang      text,
  ket_qua_ma_cum       text,
  tra_loi              text,
  so_cau_doi           integer not null default 0,
  nguoi                uuid not null,
  quyet_at             timestamp with time zone not null default now(),
  kho                  text not null
) partition by list (kho);
comment on table public.kho_de_xuat_quyet_dinh is 'Bảng CHUNG khuôn dạng–câu, họ de_xuat_quyet_dinh. Mỗi nhánh là một phần: <nhánh>_de_xuat_quyet_dinh. Thêm/sửa cột, index Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_de_xuat_quyet_dinh attach partition public.dai_de_xuat_quyet_dinh for values in ('dai');
alter table public.kho_de_xuat_quyet_dinh attach partition public.khtn_de_xuat_quyet_dinh for values in ('khtn');
alter table public.kho_de_xuat_quyet_dinh attach partition public.vatly_de_xuat_quyet_dinh for values in ('vatly');
alter table public.kho_de_xuat_quyet_dinh attach partition public.hoahoc_de_xuat_quyet_dinh for values in ('hoahoc');

alter table public.kho_de_xuat_quyet_dinh enable row level security;
revoke all on public.kho_de_xuat_quyet_dinh from anon;
create policy kho_de_xuat_quyet_dinh_member_all on public.kho_de_xuat_quyet_dinh for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_de_xuat_quyet_dinh for select to claude_ro using (true);
