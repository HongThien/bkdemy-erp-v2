-- ============================================================================
-- Migration 0047 — HỆ THỐNG BÁO LỖI (auto-report Pha 1)
-- ----------------------------------------------------------------------------
-- Nhân sự báo lỗi (mô tả + context tự đính + ảnh) → Thùy FILTER (cổng 2:
-- cho-fix/từ-chối/để-tự-làm) → AI fix trên branch+PR (bước 3) → Thùy apply+test (bước 4).
-- Immutable core + state-log §4 (trigger tự ghi vết đổi trạng thái: actor + ts + cũ/mới).
-- Ảnh chụp màn: tái dùng bucket 'kho-anh' (prefix report/) — khỏi tạo bucket mới trên Dashboard.
-- ============================================================================
create table if not exists bao_loi (
  id uuid primary key default gen_random_uuid(),
  mo_ta text not null,                          -- nhân sự tả lỗi (kỹ nhất có thể)
  route text,                                   -- leaf/màn đang mở lúc báo
  context jsonb,                                -- vai trò + tài khoản + console errors + url + viewport...
  anh_url text,                                 -- ảnh chụp màn (kho-anh/report/) — best-effort
  trang_thai text not null default 'moi',       -- moi|cho_fix|tu_choi|tu_lam|da_fix|xong|tra_lai
  ghi_chu_duyet text,                           -- ghi chú Thùy lúc duyệt (cổng 2)
  fix_note text,                                -- AI mô tả đã fix gì (bước 3)
  branch text, pr_url text, commit_sha text,    -- theo dõi fix (bước 3-4)
  created_by uuid,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
alter table bao_loi drop constraint if exists bao_loi_trang_thai_check;
alter table bao_loi add constraint bao_loi_trang_thai_check
  check (trang_thai in ('moi','cho_fix','tu_choi','tu_lam','da_fix','xong','tra_lai'));

-- state-log §4: ghi vết mỗi lần đổi trạng thái (actor + ts + cũ/mới)
create table if not exists bao_loi_log (
  id uuid primary key default gen_random_uuid(),
  bao_loi_id uuid not null references bao_loi(id) on delete cascade,
  trang_thai_cu text, trang_thai_moi text,
  actor uuid,
  created_at timestamp with time zone not null default now()
);
create or replace function log_bao_loi() returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' and new.trang_thai is distinct from old.trang_thai then
    insert into bao_loi_log (bao_loi_id, trang_thai_cu, trang_thai_moi, actor)
    values (new.id, old.trang_thai, new.trang_thai, public.jwt_uid());
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists trg_log_bao_loi on bao_loi;
create trigger trg_log_bao_loi before update on bao_loi
  for each row execute function log_bao_loi();

-- RLS member-gate: chỉ thành viên (nhân sự) tạo/đọc/cập nhật.
alter table bao_loi enable row level security;
alter table bao_loi_log enable row level security;
drop policy if exists bao_loi_member_all on bao_loi;
create policy bao_loi_member_all on bao_loi for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
drop policy if exists bao_loi_log_member_all on bao_loi_log;
create policy bao_loi_log_member_all on bao_loi_log for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
