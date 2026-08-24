-- ============================================================================
-- 202608222140 — giai_thuong_bang_goc
-- ----------------------------------------------------------------------------
-- VÌ SAO: Trao giải tháng — 3 loại/lớp (Xuất sắc/Tiến bộ/Chăm chỉ). Chỉ lưu dòng
-- khi người duyệt CHỐT thật (anti-NULL: đề xuất tính sống, không lưu draft).
-- Bảng này ĐÃ được chạy tay qua SQL Editor trước migration này tồn tại — file
-- này chỉ ghi lại đúng SQL đó để repo có sổ, apply bằng --baseline (không chạy lại).
--
-- MẤT GÌ: không xoá gì, chỉ tạo bảng mới.
-- ============================================================================

create table giai_thuong (
  id uuid primary key default gen_random_uuid(),
  thang date not null,                 -- ngày 1 của tháng dương lịch, vd 2026-08-01
  lop_id uuid not null references lop(id),
  mon text not null,                   -- snapshot lop.mon lúc chốt
  hoc_sinh_id uuid not null references hoc_sinh(id),
  loai_giai text not null check (loai_giai in ('xuat_sac','tien_bo','cham_chi')),
  duyet_boi uuid not null references nhan_su(id),
  duyet_at timestamptz not null default now(),
  cong_bo_at timestamptz,              -- NULL=nháp nội bộ, NOT NULL=đã công bố ra app PH/HS
  unique (thang, mon, hoc_sinh_id)     -- 1 HS / 1 giải / tháng, scope theo môn
);
