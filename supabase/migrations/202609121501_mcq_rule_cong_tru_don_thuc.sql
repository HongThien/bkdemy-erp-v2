-- MCQ FORM — 4 rule cho "Phép cộng trừ đơn thức đồng dạng" (T108010201, khối 8, 34 câu). Đáp số là 1 ĐƠN
-- THỨC (kết quả cộng/trừ các hệ số, giữ nguyên phần biến) — TEXT_DANG với canon = re-parse + format lại
-- (chuanHoaDonThucKetQua), tránh brittleness do kho khi bọc "$…$" khi không.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R121','Cộng luôn cả số mũ của biến','Sai khái niệm căn bản — khi cộng/trừ đơn thức đồng dạng, cộng luôn số mũ của biến thay vì chỉ cộng hệ số và giữ nguyên phần biến','$7x^2y^3+4x^2y^3$ đúng=$11x^2y^3$ → nhầm ra $11x^4y^6$ (cộng cả số mũ 2+2, 3+3)','khai_niem','{T108010201}',false),
('R122','Đảo ngược phép tính','Đề yêu cầu tính TỔNG nhưng tính thành HIỆU (hoặc ngược lại)','Đề: tính tổng $7x^2y^3$ và $4x^2y^3$ → nhầm tính hiệu ra $3x^2y^3$ (đúng: $11x^2y^3$)','tinh','{T108010201}',false),
('R123','Bỏ dấu âm của kết quả','Tính đúng giá trị tuyệt đối nhưng bỏ mất dấu âm của kết quả cuối','$9x^3+(-14x^3)$ đúng=$-5x^3$ → nhầm ra $5x^3$','tinh','{T108010201}',false),
('R124','Cộng trừ đơn thức đồng dạng: lệch 1 đơn vị','Rule dự phòng — tính hệ số kết quả lệch 1 đơn vị so với đúng','Đúng=$11x^2y^3$ → nhầm ra $12x^2y^3$','tinh','{T108010201}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
