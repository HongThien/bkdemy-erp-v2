-- MCQ FORM — thêm R109-R111 cho sub-shape "Phần biến của đơn thức"/"Tìm phần biến của đơn thức" của
-- T108010103 (phát hiện khi chạy thật: dạng này TRỘN 2 sub-shape "hệ số" (R92-94/102 đã có, đáp số số/phân
-- số) và "phần biến" (đáp số TEXT như "x^3y^2z^6") — nhận diện bằng đáp số kho có chữ cái hay không).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R109','Quên nhân số mũ trong ngoặc với luỹ thừa ngoài (phần biến)','Đơn thức dạng x^a.(biến)^n — khi tìm phần biến, quên nhân số mũ các biến trong ngoặc với n, giữ nguyên như chưa khai triển','x^3.(2yz^3)^2 phần biến đúng=x^3y^2z^6 → nhầm giữ nguyên x^3yz^3 (chưa nhân 2)','khai_niem','{T108010103}',false),
('R110','Bỏ sót 1 biến trong phần biến','Thu gọn đơn thức đúng nhưng khi viết phần biến bỏ sót 1 biến (thường biến có số mũ nhỏ nhất)','Phần biến đúng x^3y^2z^6 → nhầm bỏ sót y, ra x^3z^6','tinh','{T108010103}',false),
('R111','Sai lệch số mũ của 1 biến (phần biến)','Tính phần biến nhưng lệch số mũ của 1 biến (thừa 1 đơn vị)','Phần biến đúng x^3y^2z^6 → nhầm thành x^4y^2z^6','tinh','{T108010103}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
