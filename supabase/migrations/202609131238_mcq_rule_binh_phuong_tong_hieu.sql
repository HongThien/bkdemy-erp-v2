-- MCQ FORM — 4 rule cho "Khai triển hằng đẳng thức bình phương tổng/hiệu" (T108020101, khối 8, 63 câu).
-- Đáp số là 1 ĐA THỨC — TEXT_DANG, tái dùng chuanHoaDaThuc/hienThiDaThuc.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R178','Quên hạng tử giữa','Lỗi kinh điển của hằng đẳng thức — quên mất hạng tử giữa (2ab) khi bình phương một tổng/hiệu','$(x+1)^2$ đúng=$x^2+2x+1$ → nhầm ra $x^2+1$ (quên hạng $2x$)','khai_niem','{T108020101}',false),
('R179','Nhầm dấu hạng tử giữa','Bình phương ĐÚNG cấu trúc nhưng nhầm dấu của hạng tử giữa (cộng thành trừ hoặc ngược lại)','$(2x-1)^2$ đúng=$4x^2-4x+1$ → nhầm ra $4x^2+4x+1$','khai_niem','{T108020101}',false),
('R180','Nhân đôi thay vì bình phương','Hiểu nhầm "bình phương" thành "nhân đôi" — tính $2(a+b)$ thay vì $(a+b)^2$','$(x+1)^2$ đúng=$x^2+2x+1$ → nhầm ra $2x+2$','khai_niem','{T108020101}',false),
('R181','Bình phương tổng/hiệu: lệch 1 đơn vị ở hệ số bậc cao nhất','Rule dự phòng — khai triển đúng cấu trúc nhưng hệ số hạng tử bậc cao nhất lệch 1 đơn vị','Đúng=$x^2+2x+1$ → nhầm hệ số hạng bậc cao nhất thành $2$','tinh','{T108020101}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
