-- ============================================================================
-- 202608222209 — giai_thuong_lop_thang_rls
-- ----------------------------------------------------------------------------
-- VÌ SAO: mirror đúng pattern RLS của giai_thuong/buoi_hoc/gami_grades — bật
-- RLS + policy la_thanh_vien() cho staff app. Bảng tạo tay qua SQL Editor
-- (owner postgres) nên cần chạy tay cả bước này (claude_build không đủ quyền
-- ALTER/CREATE POLICY trên bảng không sở hữu).
--
-- MẤT GÌ: không xoá gì, chỉ bật RLS + thêm policy.
-- ============================================================================

alter table giai_thuong_lop_thang enable row level security;

create policy giai_thuong_lop_thang_member_all on giai_thuong_lop_thang
  for all to authenticated
  using (la_thanh_vien())
  with check (la_thanh_vien());
