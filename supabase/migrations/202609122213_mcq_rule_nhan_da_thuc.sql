-- MCQ FORM — 4 rule cho "Nhân đa thức với đa thức" (T108010303, khối 8, 43 câu). Đáp số là 1 ĐA THỨC —
-- TEXT_DANG, tái dùng chuanHoaDaThuc/hienThiDaThuc của DẠNG 13/15.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R143','Chỉ nhân hạng tử đầu các đa thức sau','Chỉ nhân với hạng tử ĐẦU TIÊN của các đa thức sau, quên phân phối hết các hạng tử còn lại','$(x+2)(x+3)$ đúng=$x^2+5x+6$ → nhầm ra $x^2+2x$ (chỉ nhân với $x$ của đa thức 2, quên nhân với $3$)','khai_niem','{T108010303}',false),
('R144','Quên đổi dấu các đa thức sau','Coi mọi hạng tử của các đa thức SAU đa thức thứ nhất đều DƯƠNG, quên đổi dấu hạng tử âm khi nhân','$(x+2)(x-3)$ đúng=$x^2-x-6$ → nhầm ra $x^2+5x+6$ (coi $-3$ thành $+3$)','tinh','{T108010303}',false),
('R145','Nhân số mũ biến chung thay vì cộng','Biến xuất hiện ở CẢ 2 hạng tử được nhân với nhau — NHÂN số mũ của biến đó thay vì CỘNG','$x^2\cdot x^3$ trong tích → đúng ra $x^5$, nhầm ra $x^6$ (nhân 2·3=6 thay vì cộng 2+3=5)','khai_niem','{T108010303}',false),
('R146','Nhân đa-đa thức: lệch 1 đơn vị ở hệ số bậc cao nhất','Rule dự phòng — tính đúng cấu trúc nhưng hệ số hạng tử bậc cao nhất lệch 1 đơn vị','Đúng=$x^2+5x+6$ → nhầm hệ số hạng bậc cao nhất thành $2$','tinh','{T108010303}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
