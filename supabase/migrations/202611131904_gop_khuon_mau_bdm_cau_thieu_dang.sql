-- GỘP THEO KHUÔN — họ mẫu bdm_cau_thieu_dang (spec-kien-truc.md, quyết định "riêng theo khuôn, chung trong cùng khuôn" — Thùy 13/11)
-- Cách làm: KHÔNG chép dữ liệu, KHÔNG đổi tên. Mỗi bảng theo nhánh thêm cột `kho` (hằng) rồi GẮN làm một PHẦN của bảng chung kho_bdm_cau_thieu_dang.
-- Tên cũ vẫn là bảng thật ⇒ hàm, trigger, policy, khoá ngoại, script đang dùng tên cũ chạy y như trước. Bảng chung là cửa đọc/ghi xuyên nhánh, thay cho view UNION.
-- Hoàn tác: alter table kho_bdm_cau_thieu_dang detach partition <bảng>; rồi drop column kho.
set local lock_timeout = '5s';
alter table public.dai_bdm_cau_thieu_dang add column kho text not null default 'dai' constraint dai_bdm_cau_thieu_dang_kho_chk check (kho = 'dai');
alter table public.hgt_bdm_cau_thieu_dang add column kho text not null default 'hgt' constraint hgt_bdm_cau_thieu_dang_kho_chk check (kho = 'hgt');
alter table public.khtn_bdm_cau_thieu_dang add column kho text not null default 'khtn' constraint khtn_bdm_cau_thieu_dang_kho_chk check (kho = 'khtn');
alter table public.vatly_bdm_cau_thieu_dang add column kho text not null default 'vatly' constraint vatly_bdm_cau_thieu_dang_kho_chk check (kho = 'vatly');
alter table public.hoahoc_bdm_cau_thieu_dang add column kho text not null default 'hoahoc' constraint hoahoc_bdm_cau_thieu_dang_kho_chk check (kho = 'hoahoc');

create table public.kho_bdm_cau_thieu_dang (
  ma_cau    text        not null,
  ly_do     text        not null,
  nguon     text        not null default 'ai',
  actor     uuid        default public.jwt_uid(),
  at        timestamptz not null default now(),
  chu_de_id text,
  kho       text        not null
) partition by list (kho);
comment on table public.kho_bdm_cau_thieu_dang is 'Bảng CHUNG của khuôn dạng–câu (mọi nhánh). Mỗi nhánh là một phần: <nhánh>_bdm_cau_thieu_dang. Thêm/sửa cột Ở ĐÂY — tự áp cho mọi nhánh.';
alter table public.kho_bdm_cau_thieu_dang attach partition public.dai_bdm_cau_thieu_dang for values in ('dai');
alter table public.kho_bdm_cau_thieu_dang attach partition public.hgt_bdm_cau_thieu_dang for values in ('hgt');
alter table public.kho_bdm_cau_thieu_dang attach partition public.khtn_bdm_cau_thieu_dang for values in ('khtn');
alter table public.kho_bdm_cau_thieu_dang attach partition public.vatly_bdm_cau_thieu_dang for values in ('vatly');
alter table public.kho_bdm_cau_thieu_dang attach partition public.hoahoc_bdm_cau_thieu_dang for values in ('hoahoc');

alter table public.kho_bdm_cau_thieu_dang enable row level security;
revoke all on public.kho_bdm_cau_thieu_dang from anon;
create policy kho_bdm_cau_thieu_dang_member_all on public.kho_bdm_cau_thieu_dang for all to authenticated using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
create policy claude_ro_select on public.kho_bdm_cau_thieu_dang for select to claude_ro using (true);
