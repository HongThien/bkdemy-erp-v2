-- ============================================================================
-- 0081 — DUYỆT CHẤT LƯỢNG VẬN HÀNH (Thùy chốt 07-05): mỗi task vận hành (buổi ×
-- nghiệp vụ × người làm) đã XONG cần 1 lượt DUYỆT mới coi là chính thức.
-- Tiến độ vẫn 100% MÁY tự tính từ deadline có sẵn (KHÔNG đụng). Chất lượng mặc
-- định đề xuất 100%, quản lý bấm duyệt (giữ nguyên hoặc sửa số) mới chính thức.
-- Anti-NULL (CLAUDE.md §1.5): CHƯA DUYỆT = KHÔNG có dòng — KHÔNG insert "cho_duyet"
-- rỗng trước. Duyệt HÀNG LOẠT (mặc định 100%) hay TỪNG CÁI (sửa số) đều chỉ là
-- INSERT 1 dòng lúc duyệt thật — không có state "đang chờ" lưu DB, tự suy từ
-- việc CHƯA có dòng.
-- ============================================================================
create table if not exists viec_van_hanh_duyet (
  id          uuid primary key default gen_random_uuid(),
  buoi_hoc_id uuid not null references buoi_hoc(id) on delete cascade,
  tab         text not null check (tab in ('danhgia','ingame','et','btvn')),
  nhan_su_id  uuid not null references nhan_su(id),   -- người LÀM (được đánh giá)
  chat_luong  numeric not null default 100,
  nguoi_duyet uuid not null references nhan_su(id),   -- người DUYỆT
  ghi_chu     text,
  duyet_at    timestamptz not null default now(),
  unique (buoi_hoc_id, tab, nhan_su_id)
);
alter table viec_van_hanh_duyet enable row level security;
create policy viec_van_hanh_duyet_member_all on viec_van_hanh_duyet for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on viec_van_hanh_duyet to authenticated;
create index if not exists idx_vvhd_nhan_su on viec_van_hanh_duyet(nhan_su_id);
create index if not exists idx_vvhd_nguoi_duyet on viec_van_hanh_duyet(nguoi_duyet);
