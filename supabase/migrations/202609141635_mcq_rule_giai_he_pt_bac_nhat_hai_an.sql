-- MCQ FORM — 4 rule cho "Giải hệ phương trình bậc nhất hai ẩn cơ bản" (T109010201, khối 9, 33/33 câu) và
-- "Giải hệ PT đưa về hệ bậc nhất" (T109010202, 14/14 câu — cùng hàm, mở rộng gộp hạng chéo xy trước khi kiểm
-- bậc). Giải bằng định thức Cramer (hàm mới `giaiHePtBacNhatHaiAn`), đáp số kho "(x;y)" giữ thứ tự.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R323','Giải hệ PT bậc nhất 2 ẩn: hoán đổi nhầm giá trị x và y','Giải đúng hệ nhưng hoán đổi nhầm giá trị của x và y khi kết luận nghiệm','Đúng $(0;2)$ → nhầm $(2;0)$','khai_niem','{T109010201,T109010202}',false),
('R324','Giải hệ PT bậc nhất 2 ẩn: nhầm dấu định thức, nhầm dấu cả 2 nghiệm','Tính đúng cấu trúc nhưng nhầm dấu định thức, dẫn tới nhầm dấu cả 2 nghiệm x và y','Đúng $(7;3)$ → nhầm $(-7;-3)$','khai_niem','{T109010201,T109010202}',false),
('R325','Giải hệ PT bậc nhất 2 ẩn: lệch 1 đơn vị ở nghiệm x','Rule dự phòng — đúng cấu trúc nhưng nghiệm x lệch 1 đơn vị','Đúng $x=7$ → nhầm $x=8$','tinh','{T109010201,T109010202}',true),
('R326','Giải hệ PT bậc nhất 2 ẩn: lệch 1 đơn vị ở nghiệm y','Rule cứu — đúng cấu trúc nhưng nghiệm y lệch 1 đơn vị','Đúng $y=3$ → nhầm $y=2$','tinh','{T109010201,T109010202}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
