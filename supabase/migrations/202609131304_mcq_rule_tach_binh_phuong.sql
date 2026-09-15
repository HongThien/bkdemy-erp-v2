-- MCQ FORM — 4 rule cho "Tách biểu thức thành bình phương" (T108020104, khối 8, 95 câu — hoàn thiện bình
-- phương tổng quát $Ax^2+Bx+C=A(x+p)^2+q$). Đáp số là 1 BIỂU THỨC — TEXT_DANG, canon khai triển lại rồi so.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R200','Quên trừ lại phần thừa','Cộng thêm $(B/2A)^2$ vào trong ngoặc để tạo bình phương nhưng QUÊN trừ lại phần đã cộng thừa, giữ nguyên hằng số gốc','$x^2+4x+7=(x+2)^2+3$ đúng → nhầm ra $(x+2)^2+7$ (giữ nguyên hằng số gốc 7)','khai_niem','{T108020104}',false),
('R201','Nhầm dấu p','Tính đúng độ lớn nhưng nhầm dấu của $p$ trong nhị thức','Đúng $(x+2)^2+3$ → nhầm ra $(x-2)^2+3$','khai_niem','{T108020104}',false),
('R202','Quên chia 2 khi tìm p','Tìm $p$ từ hệ số $B$ nhưng quên chia 2 — coi $p=B/A$ thay vì $B/(2A)$','$x^2+4x+7$ đúng $p=2$ (từ $4/2$) → nhầm $p=4$ (quên chia 2)','khai_niem','{T108020104}',false),
('R203','Tách bình phương: lệch 1 đơn vị hằng số','Rule dự phòng — tách đúng cấu trúc nhưng hằng số cộng thêm lệch 1 đơn vị','Đúng=$(x+2)^2+3$ → nhầm ra $(x+2)^2+4$','tinh','{T108020104}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
