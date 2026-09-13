-- MCQ FORM — 4 rule cho sub-shape "$a^3+b^3+K^3=3Kab$, $a\ne b$ ⇒ $a+b=-K$, Tính $M=a+b+C$" của
-- T108020702 (khối 8, 6/15 câu — 9 câu còn lại là Chứng minh hoặc đáp số hằng số 3 không tham số, để trống
-- theo §1.5, không có tham số biến thiên để sinh nhiễu có ý nghĩa).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R270','a³+b³+K³=3Kab: quên đổi dấu a+b=K','Nhân tử hoá đúng nhưng quên đổi dấu, dùng $a+b=K$ thay vì $a+b=-K$','$a^3+b^3+27=9ab,a\ne b$: đúng $a+b=-3$, $M=a+b+14=11$ → nhầm $a+b=3 \Rightarrow M=17$','khai_niem','{T108020702}',false),
('R271','a³+b³+K³=3Kab: nhầm dấu hằng số cộng thêm','Tính đúng $a+b=-K$ nhưng nhầm dấu hằng số cộng thêm khi tính M','Đúng $M=-3+14=11$ → nhầm $M=-3-14=-17$','khai_niem','{T108020702}',false),
('R272','a³+b³+K³=3Kab: quên cộng hằng số','Tính đúng $a+b=-K$ nhưng quên cộng hằng số, chỉ trả $a+b$','Đúng $M=11$ → nhầm ra $-3$ (chỉ lấy $a+b$)','khai_niem','{T108020702}',false),
('R273','a³+b³+K³=3Kab: lệch 1 đơn vị','Rule dự phòng — tính đúng cấu trúc nhưng kết quả lệch 1 đơn vị','Đúng $M=11$ → nhầm $M=12$','tinh','{T108020702}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
