-- MCQ FORM — 4 rule cho "Tìm x — phương trình tích qua rút nhân tử chung" (T108030602, khối 8, 42/42 câu).
-- Đáp số kho là 2 NGHIỆM, định dạng không nhất quán ("x = 2; x = 9" hoặc "-2; 1/2") — canon riêng
-- `chuanHoaDanhSachNghiem` trích mọi giá trị số/phân số, sắp xếp rồi nối lại (thứ tự nghiệm không quan trọng).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R297','Tìm x pt tích: quên đổi dấu nghiệm thứ nhất','Rút đúng nhân tử chung nhưng quên đổi dấu khi giải nghiệm từ cụm hợp (nhân tử thứ nhất)','$(x-2)^2-7(x-2)=0$ đúng $x=2$ hoặc $x=9$ → nhầm $x=-2$','khai_niem','{T108030602}',false),
('R298','Tìm x pt tích: quên đổi dấu nghiệm thứ hai','Rút đúng nhân tử chung nhưng quên đổi dấu khi giải nghiệm ở phần còn lại (nhân tử thứ hai)','$(x-2)^2-7(x-2)=0$ đúng $x=2$ hoặc $x=9$ → nhầm $x=-9$','khai_niem','{T108030602}',false),
('R299','Tìm x pt tích: lệch 1 đơn vị nghiệm thứ hai','Rule dự phòng — đúng cấu trúc nhưng nghiệm thứ hai lệch 1 đơn vị','Đúng $x=9$ → nhầm $x=10$','tinh','{T108030602}',true),
('R300','Tìm x pt tích: lệch 1 đơn vị nghiệm thứ hai, chiều ngược lại','Đúng cấu trúc nhưng nghiệm thứ hai lệch 1 đơn vị theo chiều ngược lại với R299','Đúng $x=9$ → nhầm $x=8$','tinh','{T108030602}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
