-- ============================================================================
-- 202608071600 — Giáo trình HÌNH (buổi → gán lớp), ĐỘC LẬP với giáo trình Đại
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy): Hình cần giáo trình từng buổi + gán lớp "y xì Đại" nhưng là 2 hệ ĐỘC LẬP (bảng riêng).
--   Đơn vị nội dung Hình = node + bài chọn Lớp/Nhà + ghép a,b,c + ẩn/hiện hình (= nháp "Theo mô hình").
--   1 buổi giáo trình = bản LƯU của nháp đó. Nội dung lưu STRUCTURED (không JSON blob).
--   Gán lớp = SNAPSHOT: tạo buổi-kiểu-lớp mới + COPY bài → sửa master sau không đụng lớp đã gán.
-- MẤT GÌ: không mất gì — 3 bảng mới + RLS.
-- ============================================================================

-- ① Master giáo trình (phát triển) — theo khối.
create table if not exists hinh_giao_trinh (
  id          uuid primary key default gen_random_uuid(),
  ten         text not null,
  khoi        text not null,
  mon         text not null default 'Toán',
  created_by  uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ② Buổi — ĐA HÌNH: buổi của MASTER (giao_trinh_id) HOẶC bản ĐÓNG BĂNG của lớp (lop_id, ngay, stt_lop, nguon_buoi_id).
create table if not exists hinh_gt_buoi (
  id              uuid primary key default gen_random_uuid(),
  thu_tu          integer not null default 0,
  tieu_de         text,
  mo_hinh_chinh_id uuid references hinh_mo_hinh(id) on delete set null,
  -- master buổi:
  giao_trinh_id   uuid references hinh_giao_trinh(id) on delete cascade,
  -- bản lớp (snapshot lúc gán):
  lop_id          uuid,
  ngay            date,
  stt_lop         integer,
  nguon_buoi_id   uuid,   -- buổi master đã copy ra (trace, không FK cứng để xoá master không vướng)
  created_by      uuid,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists hinh_gt_buoi_gt_idx  on hinh_gt_buoi(giao_trinh_id);
create index if not exists hinh_gt_buoi_lop_idx on hinh_gt_buoi(lop_id, ngay);

-- ③ Bài trong buổi (thay cho nháp sel/ghep/anDe). ref_id ĐA HÌNH theo `loai` (không FK cứng):
--    chuan → baitoan_id · bienthe → bien_the_id · y → hinh_y.id · ghep → null (dùng ghep_node_ids).
create table if not exists hinh_gt_bai (
  id            uuid primary key default gen_random_uuid(),
  buoi_id       uuid not null references hinh_gt_buoi(id) on delete cascade,
  phan          text not null check (phan in ('lop', 'nha')),
  loai          text not null check (loai in ('chuan', 'bienthe', 'y', 'ghep')),
  ref_id        uuid,
  ghep_node_ids uuid[] not null default '{}',
  lua_id        uuid,          -- ghép lứa (bản đổi đỉnh) — để dành cho đợt ghép lứa
  an_de         boolean not null default false,   -- ẩn hình → chừa ô HS vẽ
  thu_tu        integer not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists hinh_gt_bai_buoi_idx on hinh_gt_bai(buoi_id);

-- RLS: thành viên toàn quyền (giống các bảng hinh_ khác).
alter table hinh_giao_trinh enable row level security;
alter table hinh_gt_buoi    enable row level security;
alter table hinh_gt_bai     enable row level security;
drop policy if exists hinh_giao_trinh_member_all on hinh_giao_trinh;
drop policy if exists hinh_gt_buoi_member_all    on hinh_gt_buoi;
drop policy if exists hinh_gt_bai_member_all     on hinh_gt_bai;
create policy hinh_giao_trinh_member_all on hinh_giao_trinh for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
create policy hinh_gt_buoi_member_all    on hinh_gt_buoi    for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
create policy hinh_gt_bai_member_all     on hinh_gt_bai     for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
