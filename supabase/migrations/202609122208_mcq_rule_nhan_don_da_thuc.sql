-- MCQ FORM — 4 rule cho "Nhân đơn thức với đa thức" (T108010302, khối 8, 50 câu). Đáp số là 1 ĐA THỨC
-- (đơn thức phân phối vào từng hạng tử trong ngoặc) — TEXT_DANG, tái dùng chuanHoaDaThuc/hienThiDaThuc.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R139','Chỉ nhân hạng tử đầu, quên phân phối hết','Chỉ nhân đơn thức với hạng tử ĐẦU TIÊN trong ngoặc, quên phân phối với các hạng tử còn lại','$2x^2y(4x^2+6xy)$ đúng=$8x^4y+12x^3y^2$ → nhầm ra $8x^4y$ (quên nhân với $6xy$)','khai_niem','{T108010302}',false),
('R140','Quên đổi dấu ở các hạng tử sau','Đơn thức nhân có dấu ÂM — chỉ nhân đúng dấu ở hạng tử ĐẦU, các hạng tử sau coi như đơn thức luôn dương','$(-5x)(3x^3+7x^2-x)$ đúng=$-15x^4-35x^3+5x^2$ → nhầm ra $-15x^4+35x^3-5x^2$','tinh','{T108010302}',false),
('R141','Nhân số mũ biến chung thay vì cộng','Biến xuất hiện ở CẢ đơn thức và hạng tử trong ngoặc — NHÂN số mũ của biến đó thay vì CỘNG','$x^2\cdot(x^3+y)$ đúng có hạng $x^5$ → nhầm ra $x^6$ (nhân 2·3=6 thay vì cộng 2+3=5)','khai_niem','{T108010302}',false),
('R142','Nhân đơn-đa thức: lệch 1 đơn vị ở hệ số bậc cao nhất','Rule dự phòng — tính đúng cấu trúc nhưng hệ số hạng tử bậc cao nhất lệch 1 đơn vị','Đúng=$-15x^4-35x^3+5x^2$ → nhầm hệ số hạng bậc cao nhất thành $-14$','tinh','{T108010302}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
