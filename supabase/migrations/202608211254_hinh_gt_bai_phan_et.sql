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
--   ⭐ Thêm 'mt' (cùng đợt, tránh 2 lần paste tay): MT = 1 THỰC THỂ DUY NHẤT/buổi (Thùy: "Đại Hình chỉ
--   là 1 phần của nó") — Đại đến từ `tai_lieu loai='mt_buoi'` (gán từ master, cơ chế cũ giữ nguyên),
--   Hình đến từ `hinh_gt_bai(phan='mt')` của CÙNG buổi — 2 nguồn lưu khác bảng nhưng GỘP LÀM 1 bảng
--   chấm duy nhất ở tab MT (giống hệt cách ET/BTVN đã gộp) — HS/GV thấy "1 bài MT", không phải 2 tài
--   liệu tách rời. Hình phía MT KHÔNG có master (không cần soạn-1-lần-dùng-nhiều-lớp như Đại) — chọn
--   trực tiếp mỗi buổi, ngay trong tab MT lúc chấm.
--
-- MẤT GÌ: không mất gì — nới CHECK cho phép thêm giá trị, dữ liệu cũ ('lop'/'nha') không đổi.
-- ============================================================================

alter table hinh_gt_bai drop constraint if exists hinh_gt_bai_phan_check;
alter table hinh_gt_bai add constraint hinh_gt_bai_phan_check check (phan = any (array['lop','nha','et','mt']));
