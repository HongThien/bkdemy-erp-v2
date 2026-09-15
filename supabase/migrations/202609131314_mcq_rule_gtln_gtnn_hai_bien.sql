-- MCQ FORM — 4 rule dùng CHUNG cho 3 dạng GTLN-GTNN 2 biến (T108020201 độc lập, T108020202 có hạng chéo,
-- T108020203 sub-shape đơn giản — cùng bản chất toán học: dạng toàn phương 2 biến). Đáp số là 1 GIÁ TRỊ
-- HỮU TỈ — SPECIAL_DANG, giải bằng đại số tuyến tính (hệ đạo hàm riêng = 0), không cần đoán cách nhóm bình
-- phương của kho.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R208','Quên hạng chéo khi tìm cực trị','Khi biểu thức có hạng tử chéo xy, giải hệ tìm điểm cực trị NHƯ THỂ không có hạng chéo (bỏ qua ảnh hưởng của xy)','$2x^2+2xy+y^2-4x+7$ đúng GTNN=3 → nhầm ra 5 (tìm điểm cực trị sai vì bỏ qua xy)','khai_niem','{T108020201,T108020202,T108020203}',false),
('R209','Nhầm dấu điểm cực trị','Giải hệ đúng công thức nhưng nhầm dấu, lấy điểm ĐỐI XỨNG qua gốc toạ độ thay vì điểm đúng','Đúng điểm $(x,y)=(-1,-2)$ → nhầm dùng $(1,2)$','khai_niem','{T108020201,T108020202,T108020203}',false),
('R210','Quên hệ số 2 trong định thức','Khi giải hệ 2 ẩn tìm điểm cực trị, quên hệ số 2 trong công thức định thức','Công thức đúng dùng $4ac-b^2$ → nhầm dùng $ac-b^2$ (thiếu hệ số 4/2)','khai_niem','{T108020201,T108020202,T108020203}',false),
('R211','GTLN-GTNN 2 biến: lệch 1 đơn vị','Rule dự phòng — tìm đúng cách giải nhưng GTLN/GTNN lệch 1 đơn vị','Đúng=6 → nhầm ra 7','tinh','{T108020201,T108020202,T108020203}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
