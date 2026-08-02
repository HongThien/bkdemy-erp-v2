-- Học phí (08-01, Cách 2): HỆ SỐ effective-dated — hệ số áp dụng TỪ tháng nào (luật "đủ 1 tháng mới giảm").
-- Tính tiền tháng X → dùng entry có hieu_luc_tu ≤ X, MỚI NHẤT. Không có entry → mặc định 1.
-- hoc_sinh.he_so_hoc_phi cũ GIỮ làm denormalize "hệ số hiện tại" (hiển thị nhanh); nguồn chân lý billing = bảng này.
create table if not exists hoc_sinh_he_so (
  id          uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  he_so       numeric not null,
  hieu_luc_tu date not null,                     -- 'YYYY-MM-01' — hệ số áp dụng TỪ kỳ này trở đi
  nguon       text not null default 'manual',    -- auto | manual
  created_by  uuid,
  created_at  timestamptz not null default now(),
  unique (hoc_sinh_id, hieu_luc_tu)
);
alter table hoc_sinh_he_so enable row level security;
drop policy if exists hoc_sinh_he_so_member_all on hoc_sinh_he_so;
create policy hoc_sinh_he_so_member_all on hoc_sinh_he_so for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hoc_sinh_he_so to authenticated;
create index if not exists idx_hoc_sinh_he_so_hs on hoc_sinh_he_so(hoc_sinh_id, hieu_luc_tu);

-- Backfill: HS đang có hệ số ≠ 1 → 1 entry hiệu lực từ đầu mùa (2026-07-01), giữ nguồn cũ.
insert into hoc_sinh_he_so (hoc_sinh_id, he_so, hieu_luc_tu, nguon)
  select id, he_so_hoc_phi, date '2026-07-01', coalesce(nullif(he_so_nguon, ''), 'auto')
  from hoc_sinh
  where he_so_hoc_phi is not null and he_so_hoc_phi <> 1
on conflict (hoc_sinh_id, hieu_luc_tu) do nothing;
