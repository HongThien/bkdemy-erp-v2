-- ============================================================================
-- 202608211254 — hinh_gt_bai_phan_et
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 21/08, sau khi CTO nhầm — "giáo trình Hình KHÔNG link vào ET, ET là builder RIÊNG"):
--   1 buổi có 3 nội dung tách bạch: "Trên lớp"/"Về nhà" (giáo trình, `hinh_gt_bai.phan` hiện có
--   'lop'/'nha' — CHỈ ra Kho tài liệu để in, KHÔNG link chấm) và "ET" (tài liệu kiểm tra RIÊNG, đúng
--   khớp `trichXuatBuoi()`/ETScreen bên Đại: ET không nằm trong giáo trình).
--   Builder ET Hình (mô hình) TÁI DÙNG NGUYÊN `BuoiPickEditor` (component đã tách bạch, props thuần
--   picks/cheDo/soDong, không phụ thuộc GiaoTrinhScreen) — chỉ cần thêm phan='et' để lưu pick ET
--   SONG SONG với 'lop'/'nha' của CÙNG buổi giáo trình (nếu có), không phải bảng mới, không phải
--   `hinh_gt_buoi` mới — về đúng 1 buổi = 1 `hinh_gt_buoi` (khớp lop_id+ngay), 3 phan riêng.
--
-- MẤT GÌ: không mất gì — nới CHECK cho phép thêm 1 giá trị, dữ liệu cũ ('lop'/'nha') không đổi.
-- ============================================================================

alter table hinh_gt_bai drop constraint if exists hinh_gt_bai_phan_check;
alter table hinh_gt_bai add constraint hinh_gt_bai_phan_check check (phan = any (array['lop','nha','et']));
