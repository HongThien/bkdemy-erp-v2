-- MCQ FORM — 4 rule cho "Tính giá trị biểu thức ứng dụng lập phương tổng-hiệu" (T108020302, khối 8, 16
-- câu). Đáp số là 1 GIÁ TRỊ HỮU TỈ — SPECIAL_DANG, thế trực tiếp giá trị vào đa thức.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R221','Sai dấu kết quả cuối cùng','Tính đúng độ lớn nhưng sai dấu kết quả cuối cùng','Đúng=1000 → nhầm ra -1000','tinh','{T108020302}',false),
('R222','Tính giá trị lập phương: lệch 1 đơn vị','Rule dự phòng — tính đúng cách nhưng kết quả lệch 1 đơn vị','Đúng=1000 → nhầm ra 1001','tinh','{T108020302}',true),
('R223','Tính giá trị lập phương: lệch 1 đơn vị chiều ngược lại','Tính đúng cách nhưng kết quả lệch 1 đơn vị theo chiều ngược lại với R222','Đúng=1000 → nhầm ra 999','tinh','{T108020302}',false),
('R224','Quên hạng tử hằng số','Thế số vào từng hạng tử có biến nhưng QUÊN cộng hạng tử hằng số (không có biến)','$y^3+6y^2+12y+8$ tại $y=8$ đúng=1000 → nhầm ra 992 (quên cộng 8)','khai_niem','{T108020302}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
