-- KHO ẢNH HỌC SINH (Thùy 11/11: "1 HS sau này gửi 3 ảnh thì chọn 1 trong 3"). Mỗi ảnh tải lên = 1 dòng, không đè.
-- Ảnh ĐANG CHỌN cho vinh danh vẫn là hoc_sinh_anh_chan_dung (1 dòng/em) — fn_vinh_danh_hs không đổi.
-- Không phải dữ liệu học tập ⇒ không nhãn môn. File trong bucket không xoá (Luật xoá).
create table if not exists public.hoc_sinh_kho_anh (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references public.hoc_sinh(id),
  url text not null unique,
  tai_boi uuid references public.nhan_su(id) default public.current_nhan_su_id(),
  tai_at timestamptz not null default now()
);
create index if not exists hoc_sinh_kho_anh_hs_idx on public.hoc_sinh_kho_anh (hoc_sinh_id, tai_at desc);
alter table public.hoc_sinh_kho_anh enable row level security;
drop policy if exists hs_kho_anh_member_all on public.hoc_sinh_kho_anh;
create policy hs_kho_anh_member_all on public.hoc_sinh_kho_anh
  for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
revoke all on public.hoc_sinh_kho_anh from anon;

-- Ảnh đã có (192 ảnh nhập 11/11 + ảnh tải tay) vào kho, giữ nguyên lựa chọn hiện tại.
insert into public.hoc_sinh_kho_anh (hoc_sinh_id, url, tai_boi, tai_at)
select a.hoc_sinh_id, a.url, a.cap_nhat_boi, a.cap_nhat_at from public.hoc_sinh_anh_chan_dung a
on conflict (url) do nothing;
