-- MCQ FORM — 4 rule cho "Tính giá trị biểu thức áp dụng tổng-hiệu hai lập phương" (T108020502, khối 8, 17
-- câu, biểu thức luôn là 1 TÍCH cho sẵn dạng (A∓B)(A²±AB+B²), chỉ cần thế giá trị). Đáp số là 1 GIÁ TRỊ HỮU
-- TỈ — SPECIAL_DANG, tái dùng đúng bộ rule "thế giá trị vào biểu thức rút gọn" của DẠNG 23.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R259','Tính giá trị ứng dụng lập phương: chỉ nhân hạng đầu','Chỉ nhân với hạng tử đầu của nhân tử thứ hai, quên phân phối hết trước khi thế giá trị','$(x+3)(x^2-3x+9)$ tại $x=10$ đúng=$1027$ → nhầm ra $1300$ (chỉ nhân $x \times x^2=x^3$ rồi thế)','khai_niem','{T108020502}',false),
('R260','Tính giá trị ứng dụng lập phương: hoán đổi nhầm giá trị thế 2 biến','Rút gọn/nhân đúng nhưng hoán đổi nhầm giá trị thế của 2 biến cho nhau','$(x-2y)(x^2+2xy+4y^2)$ tại $x=5,y=1{,}5$ đúng=$98$ → nhầm ra kết quả khi thế $x=1{,}5,y=5$','tinh','{T108020502}',false),
('R261','Tính giá trị ứng dụng lập phương: lệch 1 đơn vị','Rule dự phòng — thế đúng cấu trúc nhưng kết quả cuối lệch 1 đơn vị','Đúng=$1027$ → nhầm ra $1028$','tinh','{T108020502}',true),
('R262','Tính giá trị ứng dụng lập phương: sai dấu kết quả','Thế đúng nhưng tính sai dấu kết quả cuối cùng','Đúng=$1027$ → nhầm ra $-1027$','tinh','{T108020502}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
