-- MCQ FORM — 4 rule cho "Nhân đơn thức với đơn thức" (T108010301, khối 8, 54 câu). Đáp số là 1 ĐƠN THỨC
-- (2-3 nhân tử nhân với nhau) — TEXT_DANG, tái dùng chuanHoaDonThucKetQua/hienThiDonThuc của DẠNG 11.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R135','Nhân số mũ thay vì cộng','Sai khái niệm căn bản — khi nhân 2 đơn thức có cùng biến, NHÂN số mũ của biến đó thay vì CỘNG','$x^2y\cdot xy^2$ đúng=$x^3y^3$ → nhầm ra $x^2y^2$ (nhân 2·1=2, 1·2=2 thay vì cộng 2+1=3, 1+2=3)','khai_niem','{T108010301}',false),
('R136','Cộng hệ số thay vì nhân','Sai khái niệm căn bản — khi nhân 2 đơn thức, CỘNG hệ số của chúng thay vì NHÂN','$4x\cdot(-3y)$ đúng=$-12xy$ → nhầm ra $1xy$ (4+(-3)=1 thay vì 4×(-3)=-12)','khai_niem','{T108010301}',false),
('R137','Chỉ lấy nhân tử đầu, quên nhân tử còn lại','Chỉ chép lại nhân tử ĐẦU TIÊN (đã rút gọn) làm đáp số, quên nhân với các nhân tử còn lại','Đề: $4x^2yz\cdot(-3xyz^2)$ → nhầm chỉ ghi lại $4x^2yz$, quên nhân với nhân tử thứ 2','khai_niem','{T108010301}',false),
('R138','Nhân đơn thức: lệch 1 đơn vị ở hệ số','Rule dự phòng — tính đúng phần biến nhưng hệ số lệch 1 đơn vị so với đúng','Đúng=$-12x^3y^2z^3$ → nhầm hệ số thành $-11$','tinh','{T108010301}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
