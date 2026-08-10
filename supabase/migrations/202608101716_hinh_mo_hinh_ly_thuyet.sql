-- ============================================================================
-- 202608101716 — hinh_mo_hinh_ly_thuyet
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy): "mô hình cần có chỗ gán lý thuyết cho nó" — mô hình (cấu hình hình học, vd "Tứ giác",
--   "Hình thang cân") hiện chỉ có giả thiết (đề) + hình, chưa có chỗ giải thích LÝ THUYẾT/tính chất của
--   chính cấu hình đó. Mirror y hệt `hinh_bo_de_ly_thuyet`/`hinh_dang_ly_thuyet` — khoá theo
--   `hinh_mo_hinh.id`, tái dùng NGUYÊN component `LyThuyetModal` (gõ tay hoặc ảnh/PDF → AI bóc LaTeX,
--   cắt hình chèn, dán clipboard).
--
-- MẤT GÌ: không — chỉ THÊM 1 bảng + RLS.
-- ============================================================================
create table if not exists hinh_mo_hinh_ly_thuyet (
  mo_hinh_id  uuid primary key references hinh_mo_hinh(id) on delete cascade,
  noi_dung    text not null default '',
  file_url    text,
  ten_file    text,
  cap_nhat_at timestamptz not null default now()
);
alter table hinh_mo_hinh_ly_thuyet enable row level security;
drop policy if exists hinh_mo_hinh_ly_thuyet_member_all on hinh_mo_hinh_ly_thuyet;
create policy hinh_mo_hinh_ly_thuyet_member_all on hinh_mo_hinh_ly_thuyet
  for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
