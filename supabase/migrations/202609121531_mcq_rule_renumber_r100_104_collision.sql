-- SỰ CỐ TRÙNG MÃ RULE giữa 2 luồng MCQ dùng chung bảng dai_mcq_rule (spec-mcq-quy-trinh-sinh.md §0 đã cảnh
-- báo trước đúng ca này). Migration 202609121415_mcq_rule_don_thuc_khoi8.sql (luồng khối 8-9, worktree
-- form-tn) đã insert R100-R104 cho T108010101-104 lúc 07:16 hôm nay. Sau đó luồng "trắc nghiệm 1 phần"
-- (worktree mcq-tung-phan) ĐÈ MẤT nội dung 5 dòng đó bằng UPDATE/UPSERT KHÔNG qua migration file có sổ
-- (không xuất hiện trong _migrations) — rất có thể do so sánh max(ma) bằng CHUỖI (R100 < R99 kiểu chữ) rồi
-- tưởng R100-104 còn trống. Hậu quả: 5 dòng dai_mcq_rule R100-104 hiện mang nội dung "phần trăm" của luồng
-- kia (ap_dung=T107010205/T106020304), trong khi 104 dòng dai_cau_form_tn CỦA LUỒNG NÀY (T108010101-104,
-- da_duyet=false, sinh trước sự cố) vẫn lưu rule='R100'..'R104' trỏ NHẦM catalog. duong_sai hiển thị cho
-- học sinh KHÔNG bị ảnh hưởng (lưu trực tiếp trong lua_chon lúc sinh, không join lại) — chỉ catalog
-- (dai_mcq_rule.ten/mo_ta tra theo mã) bị sai nếu dùng cho báo cáo/audit về sau.
-- FIX: KHÔNG đụng 5 dòng R100-104 hiện có (đã là sự thật sống của luồng kia) — cấp mã MỚI (R130-R134,
-- nối tiếp sau R129) giữ NGUYÊN nội dung gốc của luồng khối 8-9, rồi 1 script riêng (không phải migration,
-- vì là sửa DỮ LIỆU không phải DDL) sẽ vá lại 104 dòng dai_cau_form_tn cũ trỏ sang mã mới.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R130','Đồng dạng: nhầm phải cùng hệ số','Sai khái niệm — nghĩ 2 đơn thức đồng dạng phải có CÙNG HỆ SỐ, không chỉ cùng phần biến','3x^2y đồng dạng với 5x^2y (khác hệ số, đúng vẫn đồng dạng) → nhầm cho là không đồng dạng','khai_niem','{T108010104}',false),
('R131','Bậc đơn thức: cộng thừa 1','Rule dự phòng — tính bậc lệch thừa 1 đơn vị so với đúng','Bậc đúng=4 → nhầm ra 5','tinh','{T108010102}',true),
('R132','Hệ số đơn thức: lệch 1 đơn vị','Rule dự phòng — tính hệ số lệch 1 đơn vị so với đúng','Hệ số đúng=-1 → nhầm ra 0','tinh','{T108010103}',true),
('R133','Đếm đơn thức: đếm thừa 2','Rule dự phòng — đếm số đơn thức lệch thừa 2 đơn vị so với đúng','Đúng=4 → nhầm ra 6','tinh','{T108010101}',true),
('R134','Đồng dạng: đếm mọi đơn thức hợp lệ','Rule dự phòng — đếm mọi đơn thức hợp lệ trong danh sách (không lọc theo phần biến giống hệt A)','Danh sách 5 đơn thức hợp lệ, chỉ 3 đồng dạng → nhầm đếm cả 5','khai_niem','{T108010104}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
