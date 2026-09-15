-- MCQ FORM — 4 rule cho "Giải phương trình tích của 2 nhị thức bậc nhất" (T109020401, khối 9, 32/32 câu).
-- "$(2x-4)\cdot(3x+9)=0$" — 2 nhân tử ĐỘC LẬP (khác T108030602: không chung 1 cụm hợp) — hàm mới
-- `timXTichHaiNhiThuc`, tái dùng canon `chuanHoaDanhSachNghiem` (đã sửa bug strip nhầm ngoặc nhọn của \dfrac).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R310','Tìm x pt tích 2 nhị thức: quên đổi dấu nghiệm thứ nhất','Giải đúng cách nhưng quên đổi dấu khi giải nghiệm từ nhân tử thứ nhất','$(2x-4)(3x+9)=0$ đúng $x=2$ hoặc $x=-3$ → nhầm $x=-2$','khai_niem','{T109020401}',false),
('R311','Tìm x pt tích 2 nhị thức: quên đổi dấu nghiệm thứ hai','Giải đúng cách nhưng quên đổi dấu khi giải nghiệm từ nhân tử thứ hai','$(2x-4)(3x+9)=0$ đúng $x=2$ hoặc $x=-3$ → nhầm $x=3$','khai_niem','{T109020401}',false),
('R312','Tìm x pt tích 2 nhị thức: lệch 1 đơn vị nghiệm thứ hai','Rule dự phòng — đúng cấu trúc nhưng nghiệm thứ hai lệch 1 đơn vị','Đúng $x=-3$ → nhầm $x=-2$','tinh','{T109020401}',true),
('R313','Tìm x pt tích 2 nhị thức: lệch 1 đơn vị nghiệm thứ hai, chiều ngược lại','Đúng cấu trúc nhưng nghiệm thứ hai lệch 1 đơn vị theo chiều ngược lại với R312','Đúng $x=-3$ → nhầm $x=-4$','tinh','{T109020401}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
