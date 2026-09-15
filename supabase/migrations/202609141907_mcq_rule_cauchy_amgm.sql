-- MCQ FORM — cụm "GTLN-GTNN ứng dụng Cauchy/AM-GM" (khối 9, 4 dạng, 104/104 câu). Khảo sát cho thấy đề CHỈ
-- dùng công thức đóng cố định (2 số: 2√(AB); 3 số: 3∛(...); tích x²(K-x): 4K³/27), không cần thuật toán
-- "tách hạng tử tìm tỉ lệ" tổng quát — hàm mới `gtnnAmGm2So`/`gtnnAmGm2SoNguyen`/`gtnnAmGm3So`/`gtlnAmGm3SoTich`.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R359','Cauchy/AM-GM: quên nhân hệ số ngoài căn/hằng số khi kết luận','Tính đúng biểu thức trung gian nhưng quên nhân hệ số kết luận GTLN/GTNN (2 cho AM-GM 2 số, 3 cho AM-GM 3 số, 4 cho dạng tích x²(K-x))','$A=x+\dfrac{4}{x}$ đúng GTNN$=4$ (=2√4) → nhầm chỉ ghi $2$ (=√4)','khai_niem','{T109080103,T109080104,T109080105,T109080107}',false),
('R360','Cauchy/AM-GM: quên chia đôi hệ số khi tách hạng tử / gấp đôi kết quả / quên chia 27','Quên chia đôi hệ số khi tách 1 hạng làm 2 phần bằng nhau (AM-GM 3 số dạng phân thức), hoặc quên chia 27 (dạng tích x²(K-x))','$A=x^2+\dfrac{16}{x}$ đúng GTNN$=12$ → nhầm tính theo $\sqrt[3]{16^2}$ thay vì $\sqrt[3]{16^2/4}$','khai_niem','{T109080103,T109080104}',false),
('R361','Cauchy/AM-GM: lệch 1 đơn vị / thử sai giá trị x nguyên','Rule dự phòng — đúng cấu trúc nhưng GTLN/GTNN lệch 1 đơn vị (với x nguyên: thử nhầm 1 giá trị x khác xa điểm tối ưu)','Đúng GTNN$=12$ → nhầm $13$','tinh','{T109080103,T109080104,T109080105,T109080107}',true),
('R362','Cauchy/AM-GM: lệch giá trị, chiều ngược lại','Đúng cấu trúc nhưng GTLN/GTNN lệch giá trị theo chiều ngược lại với R361 (âm/nhỏ hơn 1 thì đổi hướng +2 để tránh giá trị vô lý)','Đúng GTNN$=12$ → nhầm $11$','tinh','{T109080103,T109080104,T109080105}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
