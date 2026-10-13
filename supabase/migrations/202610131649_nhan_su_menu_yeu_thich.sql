-- ============================================================================
-- 202610131649 — nhan_su_menu_yeu_thich
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 13/10: ERP có màn Home, trên đó có mục "Yêu thích" do TỪNG NGƯỜI tự chọn — bấm là vào
--   thẳng màn đó. Lưu ở DB (không localStorage) để danh sách đi theo TÀI KHOẢN: cùng một người
--   mở máy công ty, máy nhà, điện thoại đều thấy đúng bộ của mình.
--   Cùng khuôn `phim_tat_cong_thuc` (mig 202609030144): dữ liệu cá nhân, không nhãn môn, nằm ngay
--   trên dòng nhan_su của người đó, ghi qua policy `nhan_su_member_all` sẵn có.
--   Giá trị = mảng id mục menu theo THỨ TỰ người dùng thêm, vd ["buoihoc","lamtailieu:et"].
--   Id là KHOÁ TỰ NHIÊN của mục (src/mock/fixtures.ts `adminLeaves`), không phải vị trí; mục bị
--   thu quyền/đổi tên thì app chỉ bỏ qua lúc hiển thị, không tự xoá khỏi mảng.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ THÊM 1 cột có default.
-- ============================================================================
alter table nhan_su
  add column if not exists menu_yeu_thich jsonb not null default '[]'::jsonb;
comment on column nhan_su.menu_yeu_thich is
  'Mục menu ERP người này ghim lên Home: mảng id theo thứ tự thêm, vd ["buoihoc","lamtailieu:et"]. Cá nhân, không nhãn môn.';
