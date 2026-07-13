-- 0098 — hoc_phi_cong_thuc: LỰA CHỌN công thức học phí chính của NGƯỜI DÙNG (Thùy chốt 07-13).
-- 2 công thức: ct1 = Số buổi LỚP × đơn giá × hệ số (nghỉ ít, <30%) · ct2 = (buổi HS học thực tế
-- + buổi bù) × đơn giá × hệ số (nghỉ nhiều, ≥30%). Hệ thống ĐỀ XUẤT theo ngưỡng 30% (pure-derive,
-- không ghi) — bảng này CHỈ có dòng khi người dùng CHỌN TAY (anti-NULL: không có dòng = theo đề
-- xuất; xoá dòng = quay về theo đề xuất). PK (hs, lop, ky) — 1 lựa chọn / HS / lớp / kỳ.
create table if not exists hoc_phi_cong_thuc (
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  lop_id uuid not null references lop(id) on delete cascade,
  ky date not null,
  cong_thuc text not null check (cong_thuc in ('ct1','ct2')),
  actor uuid,
  updated_at timestamptz not null default now(),
  primary key (hoc_sinh_id, lop_id, ky)
);
alter table hoc_phi_cong_thuc enable row level security;
drop policy if exists hoc_phi_cong_thuc_member_all on hoc_phi_cong_thuc;
create policy hoc_phi_cong_thuc_member_all on hoc_phi_cong_thuc for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on hoc_phi_cong_thuc to authenticated;
