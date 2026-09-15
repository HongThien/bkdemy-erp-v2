-- MCQ FORM — 4 rule cho "Chia đa thức cho đa thức một biến" (T108010403, khối 8, 42 câu, phép chia dài).
-- Đáp số dạng "THƯƠNG dư DƯ" — TEXT_DANG, canon chuanHoaChiaDaThuc coi "không ghi dư" = "dư 0".
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R155','Dừng sau 1 bước','Chỉ thực hiện ĐÚNG 1 bước chia hạng tử dẫn đầu rồi dừng, không lặp lại thuật toán cho các hạng tử còn thiếu của thương','$x^3-6x^2+11x-3:(x-1)$ đúng=$x^2-5x+6$ dư $3$ → nhầm dừng ở bước 1, thương chỉ có $x^2$','khai_niem','{T108010403}',false),
('R156','Nhầm dấu khi trừ mỗi bước','Ở mỗi bước của phép chia dài, CỘNG tích ngược lại thay vì TRỪ (quên đổi dấu khi hạ hạng tử)','Chia dài mỗi bước phải TRỪ đi tích thương·mẫu — nhầm CỘNG vào, sai lệch toàn bộ thương và dư','tinh','{T108010403}',false),
('R157','Quên ghi phần dư','Tính đúng thương nhưng QUÊN ghi phần dư, trình bày như thể chia hết dù dư khác 0','$x^2-5x+6$ dư $3$ → nhầm chỉ ghi $x^2-5x+6$ (bỏ mất dư 3)','khai_niem','{T108010403}',false),
('R158','Chia đa thức dài: lệch 1 đơn vị ở hệ số đầu của thương','Rule dự phòng — tính đúng cấu trúc nhưng hệ số hạng tử đầu của thương lệch 1 đơn vị','Đúng=$x^2-5x+6$ dư $3$ → nhầm hệ số hạng đầu thành $2$','tinh','{T108010403}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
