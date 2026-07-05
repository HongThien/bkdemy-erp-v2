-- ============================================================================
-- 0078 — Chi phí phát sinh: 1 chỗ nhập, 2 loại (Thùy 07-05).
-- ----------------------------------------------------------------------------
-- loai='lop'    → áp cho MỌI HS đang học (dang_hoc) lớp đó tại thời điểm tính phiếu
--                 (pure-derive — không snapshot danh sách HS lúc tạo).
-- loai='ca_nhan'→ áp riêng 1 HS.
-- Gắn theo KỲ (tháng) — hiện trong phiếu ảo của kỳ đó, cộng dồn khi chốt.
-- ============================================================================
create table if not exists hoc_phi_phat_sinh (
  id         uuid primary key default gen_random_uuid(),
  ky         date not null,
  loai       text not null check (loai in ('lop', 'ca_nhan')),
  lop_id     uuid references lop(id),
  hoc_sinh_id uuid references hoc_sinh(id),
  mo_ta      text not null,
  so_tien    numeric not null,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint hoc_phi_phat_sinh_dung_loai check (
    (loai = 'lop' and lop_id is not null and hoc_sinh_id is null) or
    (loai = 'ca_nhan' and hoc_sinh_id is not null and lop_id is null)
  )
);
alter table hoc_phi_phat_sinh enable row level security;
create policy hoc_phi_phat_sinh_member_all on hoc_phi_phat_sinh for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hoc_phi_phat_sinh to authenticated;
create index if not exists idx_hoc_phi_phat_sinh_ky on hoc_phi_phat_sinh(ky);
