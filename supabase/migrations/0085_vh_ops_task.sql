-- ============================================================================
-- 0085 — TASK REPORT + BÁO TAN (BKDEMY_OPS_SPEC_DETAIL.md Story 1+2).
-- ----------------------------------------------------------------------------
-- ⚠ KHÁC bản PLAN gốc (phát hiện lúc code): Report phải tồn tại & đóng được
-- TRƯỚC KHI buổi "mở" (report gửi tối hôm trước; buổi chỉ mở lúc vào học) →
-- lúc đó CHƯA CÓ dòng buoi_hoc để gắn cột. Ép mở buổi sớm để có chỗ lưu sẽ đẻ
-- tác dụng phụ (roster/GV snapshot sớm). → bảng TỰ CHỨA riêng, khoá theo
-- (tkb_id, ngày, loại việc), KHÔNG phụ thuộc buoi_hoc tồn tại.
-- Tự chứa cả "duyệt" (KHÔNG reuse viec_van_hanh_duyet — bảng đó bắt buộc
-- buoi_hoc_id not null). Công thức tinhHieuSuat/deXuatTienDo (vanhanh.ts) vẫn
-- TÁI DÙNG nguyên (hàm thuần nhận số) — chỉ khác nơi lưu kết quả.
-- Anti-NULL (CLAUDE.md §1.5): 1 dòng ra đời = đã ĐÓNG (có anh_url+dong_at).
-- ============================================================================

create table if not exists vh_ops_task (
  id          uuid primary key default gen_random_uuid(),
  tkb_id      uuid not null references thoi_khoa_bieu(id) on delete cascade,
  ngay        date not null,
  tab         text not null check (tab in ('report', 'tan')),
  nhan_su_id  uuid not null references nhan_su(id),   -- người ĐÓNG (snapshot — dù phân công gốc đổi sau vẫn đúng ai đã làm)
  anh_url     text,
  dong_at     timestamptz,
  chat_luong  numeric not null default 100,
  nguoi_duyet uuid references nhan_su(id),
  duyet_at    timestamptz,
  created_at  timestamptz not null default now(),
  unique (tkb_id, ngay, tab)
);

create index if not exists idx_vh_ops_task_ngay on vh_ops_task(ngay);
create index if not exists idx_vh_ops_task_ns   on vh_ops_task(nhan_su_id);

alter table vh_ops_task enable row level security;
create policy vh_ops_task_member_all on vh_ops_task for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on vh_ops_task to authenticated;
