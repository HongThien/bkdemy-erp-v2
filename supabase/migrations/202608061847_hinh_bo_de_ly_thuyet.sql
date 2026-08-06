-- ============================================================================
-- 202608061847 — hinh_bo_de_ly_thuyet
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy): bổ đề là cấu trúc TO — có lý thuyết + ví dụ đàng hoàng, không phải 1 câu phát biểu.
--   Nội dung bổ đề phải soạn giống LÝ THUYẾT DẠNG bên Đại: gõ tay hoặc upload ảnh/PDF → AI bóc LaTeX,
--   cắt hình chèn, dán clipboard. Tái dùng NGUYÊN component LyThuyetModal. Bảng này = mirror
--   hinh_dang_ly_thuyet / dai_dang_ly_thuyet, khoá theo hinh_bo_de.id. (`ten` + `phat_bieu` ngắn ở
--   bảng hinh_bo_de vẫn giữ làm tiêu đề + phát biểu cô đọng; noi_dung ở đây = lý thuyết + ví dụ đầy đủ.)
--
-- MẤT GÌ: không mất gì — chỉ THÊM 1 bảng + RLS.
-- ============================================================================
create table if not exists hinh_bo_de_ly_thuyet (
  bo_de_id    uuid primary key references hinh_bo_de(id) on delete cascade,
  noi_dung    text not null default '',
  file_url    text,
  ten_file    text,
  cap_nhat_at timestamptz not null default now()
);
alter table hinh_bo_de_ly_thuyet enable row level security;
drop policy if exists hinh_bo_de_ly_thuyet_member_all on hinh_bo_de_ly_thuyet;
create policy hinh_bo_de_ly_thuyet_member_all on hinh_bo_de_ly_thuyet
  for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
