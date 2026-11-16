-- ============================================================================
-- 202611161920 — giao_trinh_tuan_bo_de_xuat_theo_ca
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/11 bỏ đề xuất theo ca (lớp có Đại + Hình ⇒ hệ không đoán giáo trình cho ca); thay bằng buổi kế tiếp theo giáo trình người chọn
--   (mig 202611161916). Hai hàm của mig 202611161902 không còn ai gọi (đo 16/11: pg_proc chỉ fn_gtt_nhan_de_xuat gọi _gtt_de_xuat;
--   src/ + scripts/ không chỗ nào). Thùy gật "Xoá đi".
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   DROP 2 hàm: fn_gtt_nhan_de_xuat(text, text, date) · _gtt_de_xuat(uuid[], date, date). Không mất dữ liệu (cả hai không lưu gì riêng;
--   dòng gtt_ca đã tạo vẫn nguyên). Định nghĩa còn trong mig 202611161902 nếu cần dựng lại.
-- ============================================================================

drop function if exists fn_gtt_nhan_de_xuat(text, text, date);
drop function if exists _gtt_de_xuat(uuid[], date, date);
