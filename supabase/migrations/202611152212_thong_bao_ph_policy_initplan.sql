-- ============================================================================
-- 202611152212 — thong_bao_ph_policy_initplan
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   thong_bao_ph vừa đổi chủ sang claude_build (Thùy chạy ở SQL Editor 15/11 ~22:10) ⇒ policy của nó sửa được bằng migration,
--   không cần nằm trong file SQL Editor 202611152145 nữa. Policy nhân sự gọi la_thanh_vien() TRẦN ⇒ chạy lại cho từng dòng;
--   bọc (select …) ⇒ một lần mỗi câu lệnh (cùng cách mig 202611021935 / 202611152146). Bảng vừa thêm 76 dòng thông báo giải tháng.
--   Ngữ nghĩa giữ nguyên. Policy đọc của app phụ huynh (thong_bao_ph_fdw_read) không đụng.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — ALTER POLICY giữ tên, lệnh, role.
-- ============================================================================
set local lock_timeout = '3s';
alter policy thong_bao_ph_member_all on public.thong_bao_ph using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
