-- MCQ FORM — 4 rule cho "Tính giá trị biểu thức áp dụng rút gọn" (T108010504, khối 8, 57 câu). Đáp số là 1
-- GIÁ TRỊ HỮU TỈ — SPECIAL_DANG, tái dùng bộ rút gọn đa biến của DẠNG 21 rồi thế số.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R172','Chỉ nhân hạng tử đầu, quên phân phối hết','Khi rút gọn biểu thức, trong mỗi cặp ngoặc chỉ nhân với hạng tử ĐẦU của ngoặc thứ hai, quên phân phối hết','Rút gọn sai trước khi thế số, dẫn tới kết quả sai hoàn toàn dù thế đúng giá trị','khai_niem','{T108010504}',false),
('R173','Quên đổi dấu khi trừ cụm đã nhân','Trừ cả 1 cụm tích 2 đa thức đã nhân — chỉ đổi dấu hạng tử ĐẦU, các hạng tử sau coi như dương','Tương tự R126/R164 nhưng áp dụng trước bước thế số','tinh','{T108010504}',false),
('R174','Hoán đổi nhầm giá trị thế 2 biến','Rút gọn ĐÚNG nhưng khi thế số, hoán đổi nhầm giá trị của 2 biến cho nhau','$x=1,y=10$ đúng ⇒ thế $x=10,y=1$ (đảo ngược 2 giá trị)','khai_niem','{T108010504}',false),
('R175','Tính giá trị rút gọn: lệch kết quả 1 đơn vị','Rule dự phòng — rút gọn và thế số đúng nhưng kết quả cuối lệch 1 đơn vị','Đúng=-9 → nhầm ra -8','tinh','{T108010504}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
