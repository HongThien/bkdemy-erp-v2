-- MCQ FORM — 9 rule cho "Khai triển / hoàn thiện hằng đẳng thức lập phương tổng-hiệu" (T108020301, khối 8,
-- 43 câu, trộn 2 sub-shape). Đáp số là 1 ĐA THỨC — TEXT_DANG, tái dùng chuanHoaDaThuc/hienThiDaThuc.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R212','Quên 2 hạng tử giữa','Lỗi kinh điển của hằng đẳng thức lập phương — quên mất 2 hạng tử giữa khi khai triển tổng/hiệu lập phương','$(x+1)^3$ đúng=$x^3+3x^2+3x+1$ → nhầm ra $x^3+1$ (quên $3x^2$ và $3x$)','khai_niem','{T108020301}',false),
('R213','Nhầm dấu 1 hạng tử giữa','Khai triển đúng cấu trúc nhưng nhầm dấu của 1 trong 2 hạng tử giữa','Đúng=$x^3+3x^2+3x+1$ → nhầm ra $x^3-3x^2+3x+1$','khai_niem','{T108020301}',false),
('R214','Nhân 3 thay vì lập phương','Hiểu nhầm "lập phương" thành "nhân 3" — tính $3(a+b)$ thay vì $(a+b)^3$','$(x+1)^3$ đúng=$x^3+3x^2+3x+1$ → nhầm ra $3x+3$','khai_niem','{T108020301}',false),
('R215','Lập phương: lệch 1 đơn vị hệ số bậc cao nhất','Rule dự phòng — khai triển đúng cấu trúc nhưng hệ số hạng tử bậc cao nhất lệch 1 đơn vị','Đúng=$x^3+3x^2+3x+1$ → nhầm hệ số hạng bậc cao nhất thành $2$','tinh','{T108020301}',true),
('R216','Hoàn thiện lập phương: quên khai căn','Tính đúng $b^2$ nhưng QUÊN khai căn, dùng thẳng $b^2$ làm hạng tự do của nhị thức','$x^3+\ldots+12x+\ldots=(x+2)^3$ đúng ($b^2=4,b=2$) → nhầm ra $x+4$ (dùng thẳng $b^2$)','khai_niem','{T108020301}',false),
('R217','Hoàn thiện lập phương: nhầm dấu b','Tìm đúng độ lớn nhưng nhầm dấu của $b$ trong nhị thức','Đúng=$x+2$ → nhầm ra $x-2$','khai_niem','{T108020301}',false),
('R218','Hoàn thiện lập phương: quên căn bậc ba A','Không lấy căn bậc ba của hệ số A, dùng thẳng A làm hệ số của nhị thức','$8x^3+\ldots=(2x+1)^3$ đúng → nhầm ra $8x+1$ (dùng thẳng A=8 thay vì căn bậc ba √A=2)','khai_niem','{T108020301}',false),
('R219','Hoàn thiện lập phương: lệch 1 đơn vị b','Rule dự phòng — tìm đúng cấu trúc nhưng hạng tự do của nhị thức lệch 1 đơn vị','Đúng=$x+2$ → nhầm ra $x+3$','tinh','{T108020301}',true),
('R220','Hoàn thiện lập phương: lệch 1 đơn vị b chiều ngược lại','Tìm đúng cấu trúc nhưng hạng tự do của nhị thức lệch 1 đơn vị theo chiều ngược lại với R219','Đúng=$x+2$ → nhầm ra $x+1$','tinh','{T108020301}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
