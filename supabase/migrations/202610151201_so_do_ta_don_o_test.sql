-- ============================================================================
-- 202610151201 — so_do_ta_don_o_test
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 15/10 duyệt dọn sơ đồ tổ chức team Trợ giảng: "Dữ liệu nào lỗi, test thì bỏ. Uyên, Dương giữ lại."
--   (TA làm nhiều khối có nhiều ô là ĐÚNG — Hà Giang, Vân Anh giữ cả 2 ô.)
--
-- MẤT GÌ (Luật xoá — Thùy đã gật 15/10, liệt kê CHÍNH XÁC):
--   Xoá 3 dòng vi_tri (không có ô con nào trỏ cha_id vào chúng — đã kiểm):
--     · 95c4110a-cd0c-4877-a721-f3847b9c7706  "Trợ giảng" của TA_Test (dưới Quản lý trợ giảng) — tài khoản test, mất quyền app TA.
--     · c2321aea-4256-4fe6-a301-5463e8d839f3  "Trợ giảng" của Đào Xuân Thùy (dưới Trưởng khối 8) — ô TA theo lớp test 8S0.
--       (Thùy vẫn giữ quyền qua admin hệ thống + các ô khác.)
--     · f420db25-82f7-4ece-897c-a270ee9e101d  ô trống: không tên, không người, dưới Quản lý trợ giảng.
--   Sửa tên ô (không mất gì): "Trợ gaingr" (gõ nhầm) · "Trợ Giảng" · ô không tên của Hải/Uyên · "Thành viên" ⇒ "Trợ giảng".
-- ============================================================================

delete from vi_tri where id in ('95c4110a-cd0c-4877-a721-f3847b9c7706', 'c2321aea-4256-4fe6-a301-5463e8d839f3', 'f420db25-82f7-4ece-897c-a270ee9e101d')
  and not exists (select 1 from vi_tri c where c.cha_id = vi_tri.id);

update vi_tri v set ten = 'Trợ giảng'
  from team t
 where t.id = v.team_id and t.ma = 'ta' and v.cap = 'thanh_vien' and v.nhan_su_id is not null
   and (v.ten is null or v.ten in ('Trợ gaingr', 'Trợ Giảng', 'Thành viên'));
