-- ============================================================================
-- 202607271436 — hinh_dang_ly_thuyet
-- ----------------------------------------------------------------------------
-- VÌ SAO: dạng bài Hình cần lý thuyết/phương pháp giống dạng Đại (dai_dang_ly_thuyet).
--   Tái dùng NGUYÊN component soạn của Đại (LyThuyetModal — upload ảnh/PDF → AI bóc LaTeX,
--   cắt hình chèn, dán clipboard). Bảng này = mirror dai_dang_ly_thuyet, khoá theo hinh_dang.id.
--   Gắn ở TERMINAL dạng (lá của cây loại-câu-hỏi › cách-xử-lý).
--
-- MẤT GÌ: không mất gì — chỉ THÊM 1 bảng + RLS.
-- ============================================================================
create table if not exists hinh_dang_ly_thuyet (
  dang_id    uuid primary key references hinh_dang(id) on delete cascade,
  noi_dung   text not null default '',
  file_url   text,
  ten_file   text,
  cap_nhat_at timestamptz not null default now()
);
alter table hinh_dang_ly_thuyet enable row level security;
drop policy if exists hinh_dang_ly_thuyet_member_all on hinh_dang_ly_thuyet;
create policy hinh_dang_ly_thuyet_member_all on hinh_dang_ly_thuyet
  for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
