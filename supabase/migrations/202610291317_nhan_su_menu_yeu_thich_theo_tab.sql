-- ============================================================================
-- 202610291317 — nhan_su_menu_yeu_thich_theo_tab
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 29/10: Yêu thích chia nhiều TAB tự đặt tên, mỗi tab ≤ 12 mục, ghim là chọn luôn tab hiển thị.
--   Dùng LẠI cột jsonb `menu_yeu_thich` (không cột mới): app ghi khuôn mới { tabs: [{ id, ten, muc: [leafId…] }] }.
--   Dữ liệu cũ (mảng phẳng) app tự đọc thành 1 tab "Yêu thích" (src/lib/yeuThich.ts docCayYT) ⇒ KHÔNG chuyển dữ liệu;
--   lần ghi kế tiếp của từng người tự lưu khuôn mới. File này chỉ sửa chú thích cột cho khớp hai khuôn.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ thay chú thích (comment) của 1 cột, không đụng dữ liệu.
-- ============================================================================
comment on column nhan_su.menu_yeu_thich is
  'Mục menu ERP người này ghim (Yêu thích). Khuôn mới (29/10): {"tabs":[{"id":"t…","ten":"Kho","muc":["buoihoc","lamtailieu:et"]}]} — tab tự đặt tên, ≤ 8 tab, ≤ 12 mục/tab, id tab bất biến. Khuôn cũ: mảng id phẳng (app đọc thành 1 tab). Cá nhân, không nhãn môn.';
