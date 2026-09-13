-- MCQ FORM — 4 rule cho "Giải phương trình bậc ba qua nhóm hạng tử" (T108030603, khối 8, 6 câu). Đáp số kho
-- là TẬP HỢP "{r1;r2;r3}" — tái dùng canon `chuanHoaDanhSachNghiem` (đã strip {} sẵn từ T108030602).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R301','Giải pt bậc 3 qua nhóm: nhầm dấu 1 nghiệm','Nhóm và phân tích đúng nhưng nhầm dấu 1 trong 3 nghiệm khi giải từng nhân tử','$x^3-3x^2-4x+12=0$ đúng $\{-2;2;3\}$ → nhầm $\{2;2;3\}$','khai_niem','{T108030603}',false),
('R302','Giải pt bậc 3 qua nhóm: quên xét 1 trường hợp','Phân tích đúng thành tích 3 nhân tử nhưng quên xét 1 trường hợp, chỉ tìm được 2/3 nghiệm','Đúng $\{-2;2;3\}$ → nhầm chỉ ghi $\{2;3\}$','khai_niem','{T108030603}',false),
('R303','Giải pt bậc 3 qua nhóm: lệch 1 đơn vị 1 nghiệm','Rule dự phòng — đúng cấu trúc nhưng 1 nghiệm lệch 1 đơn vị','Đúng $\{-2;2;3\}$ → nhầm $\{-2;2;4\}$','tinh','{T108030603}',false),
('R304','Giải pt bậc 3 qua nhóm: lệch 1 đơn vị 1 nghiệm, chiều ngược lại','Rule cứu, chiều ngược lại R303','Đúng $\{-2;2;3\}$ → nhầm $\{-2;2;2\}$','tinh','{T108030603}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
