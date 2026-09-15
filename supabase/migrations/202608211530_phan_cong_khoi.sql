-- ============================================================================
-- TRƯỞNG KHỐI — phân công nhân sự phụ trách RÀ SOÁT dữ liệu của 1 khối.
-- ----------------------------------------------------------------------------
-- Thùy 21/08: BK có vị trí "trợ giảng trưởng khối" chịu trách nhiệm kiểm tra
-- dữ liệu (điểm danh + ET/MT/BTVN) của CẢ khối phụ trách (vd khối 6) — không
-- gán theo lớp được vì phạm vi là cả khối, không phải 1-vài lớp cụ thể.
-- Giống pattern phan_cong_ops: 1 bảng gán riêng, độc lập, KHÔNG đưa vào cây
-- vị trí (vi_tri/team) — đây không phải chức danh tổ chức chính thức, chỉ là
-- phạm vi dữ liệu. unique(nhan_su_id, khoi) — 1 người có thể phụ trách nhiều
-- khối, 1 khối có thể có nhiều người phụ trách (không ép "độc quyền 1 người").
-- Quyền đi kèm (áp ở code, không ở RLS — cùng model app-level scope của repo):
-- XEM báo cáo vận hành + SỬA điểm ET/MT/BTVN của mọi lớp trong khối phụ trách.
-- Điểm danh KHÔNG đụng — vẫn giữ luật chỉ OPS sửa (CLAUDE.md §5).
-- ============================================================================

create table if not exists phan_cong_khoi (
  id         uuid primary key default gen_random_uuid(),
  nhan_su_id uuid not null references nhan_su(id),
  khoi       text not null,
  created_at timestamptz not null default now(),
  unique (nhan_su_id, khoi)
);

create index if not exists idx_phan_cong_khoi_ns   on phan_cong_khoi(nhan_su_id);
create index if not exists idx_phan_cong_khoi_khoi on phan_cong_khoi(khoi);

alter table phan_cong_khoi enable row level security;
create policy phan_cong_khoi_member_all on phan_cong_khoi for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on phan_cong_khoi to authenticated;
