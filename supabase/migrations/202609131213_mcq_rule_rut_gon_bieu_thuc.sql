-- MCQ FORM — 4 rule cho "Rút gọn biểu thức 1 biến" (T108010501, khối 8, 33 câu — tổng các tích đa thức).
-- Đáp số là 1 ĐA THỨC — TEXT_DANG, tái dùng chuanHoaDaThuc/hienThiDaThuc.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R164','Quên đổi dấu khi trừ cụm đã nhân','Trừ cả 1 cụm tích 2 đa thức đã nhân — chỉ đổi dấu hạng tử ĐẦU của kết quả, các hạng tử sau coi như dương','$A - (x^2-x+1)(x-1)$: đúng phải đổi dấu CẢ 3 hạng của tích, nhầm chỉ đổi dấu hạng đầu','tinh','{T108010501}',false),
('R165','Chỉ nhân hạng tử đầu, quên phân phối hết','Trong mỗi cặp ngoặc nhân với nhau, chỉ nhân với hạng tử ĐẦU của ngoặc thứ hai, quên phân phối hết','$(x^2+2x+3)(x-1)$ đúng=$x^3+x^2+x-3$ → nhầm chỉ nhân với $x$, bỏ mất phần nhân với $-1$','khai_niem','{T108010501}',false),
('R166','Nhân số mũ biến chung thay vì cộng','Biến xuất hiện ở CẢ 2 hạng tử được nhân với nhau — NHÂN số mũ của biến đó thay vì CỘNG','$x^2\cdot x$ trong tích → đúng ra $x^3$, nhầm ra $x^2$ (nhân 2·1=2 thay vì cộng 2+1=3)','khai_niem','{T108010501}',false),
('R167','Rút gọn biểu thức: lệch 1 đơn vị ở hệ số bậc cao nhất','Rule dự phòng — tính đúng cấu trúc nhưng hệ số hạng tử bậc cao nhất lệch 1 đơn vị','Đúng=$6x^2-x$ → nhầm hệ số hạng bậc cao nhất thành $7$','tinh','{T108010501}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
