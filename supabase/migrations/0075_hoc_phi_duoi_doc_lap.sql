-- ============================================================================
-- 0075 — Học phí đuổi ĐỘC LẬP với học phí buổi chính (Thùy sửa lại 0074).
-- ----------------------------------------------------------------------------
-- Mọi khoản (học phí / học phí đuổi / học liệu) đều theo CÙNG 1 quy tắc: mỗi
-- loại 1 bảng "mức" độc lập, LỚP tham chiếu riêng từng cái. Xoá gia_duoi khỏi
-- muc_hoc_phi (mig 0074, CHƯA có data thật nào dùng) — tách hẳn thành
-- muc_hoc_duoi, giống muc_hoc_lieu.
-- ============================================================================
alter table muc_hoc_phi drop column if exists gia_duoi;

create table if not exists muc_hoc_duoi (
  id         uuid primary key default gen_random_uuid(),
  ten        text not null,        -- "150.000đ" | "250.000đ" (tự đặt theo giá, xem lib/hocphi.ts)
  gia        numeric not null,
  created_at timestamptz not null default now()
);
alter table muc_hoc_duoi enable row level security;
create policy muc_hoc_duoi_member_all on muc_hoc_duoi for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on muc_hoc_duoi to authenticated;

alter table lop add column if not exists muc_hoc_duoi_id uuid references muc_hoc_duoi(id);
