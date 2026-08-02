-- Học phí (08-01): TÍN DỤNG GIỚI THIỆU — người cũ giới thiệu HS mới → được trừ vào học phí.
-- Trễ 1 tháng (giới thiệu T6 → hiệu lực T7), NGƯỜI NHẬP TAY (không auto-điều-kiện), trừ trải nhiều tháng đến hết.
create table if not exists hoc_phi_tin_dung (
  id              uuid primary key default gen_random_uuid(),
  phu_huynh_id    uuid not null references phu_huynh(id) on delete cascade,   -- người HƯỞNG (người giới thiệu)
  hoc_sinh_moi_id uuid references hoc_sinh(id) on delete set null,            -- HS ĐƯỢC giới thiệu (lưu lại)
  so_tien         numeric not null default 500000,                           -- tín dụng (mặc định 500k, ghi tự do)
  hieu_luc_tu     date not null,                                             -- tháng bắt đầu áp (trễ 1 tháng)
  mo_ta           text,
  created_by      uuid,
  created_at      timestamptz not null default now()
);
alter table hoc_phi_tin_dung enable row level security;
drop policy if exists hoc_phi_tin_dung_member_all on hoc_phi_tin_dung;
create policy hoc_phi_tin_dung_member_all on hoc_phi_tin_dung for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hoc_phi_tin_dung to authenticated;
create index if not exists idx_hoc_phi_tin_dung_ph on hoc_phi_tin_dung(phu_huynh_id, hieu_luc_tu);

-- hoa_don_dong.loai: thêm 'giam_gioi_thieu' (dòng ÂM = trừ tín dụng khi chốt).
alter table hoa_don_dong drop constraint if exists hoa_don_dong_loai_check;
alter table hoa_don_dong add constraint hoa_don_dong_loai_check
  check (loai in ('hoc_phi','hoc_duoi','hoc_lieu','phat_sinh','no_ky_truoc','giam_gioi_thieu'));
