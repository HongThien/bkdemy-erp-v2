-- MCQ FORM — 6 rule cho "Bình phương của các biểu thức đặc biệt" (T108020701, khối 8) — CHỈ sub-shape 2
-- BIẾN (17/49 câu: "Cho $a+b=S$; $ab=P$. Tính $a^2+b^2$" hoặc $a^3+b^3$, luôn giải bằng đúng 1 hằng đẳng
-- thức cố định). CEO chốt 13/09: các sub-shape 3 biến (ép a=b=c, hoặc Newton power-sum qua e1,e2,e3) phức
-- tạp hơn hẳn, cần suy luận riêng từng câu — để lại làm sau, KHÔNG ép vào cùng engine này.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R264','Tổng bình/lập phương 2 biến: quên trừ hạng chéo','Chỉ tính $(a+b)^n$ mà quên trừ hạng chéo ($2ab$ hoặc $3ab(a+b)$)','$a+b=2,ab=1$, $a^2+b^2$ đúng=$2$ → nhầm ra $4$ (chỉ tính $(a+b)^2$)','khai_niem','{T108020701}',false),
('R265','Tổng bình/lập phương 2 biến: nhầm dấu','Nhầm dấu, cộng hạng chéo thay vì trừ','$a+b=2,ab=1$, $a^2+b^2$ đúng=$2$ → nhầm ra $6$ ($4+2\times1$)','khai_niem','{T108020701}',false),
('R266','Tổng bình/lập phương 2 biến: quên hệ số nhân của hạng chéo','Trừ đúng chiều nhưng quên hệ số nhân (2 hoặc 3) của hạng chéo','$a+b=2,ab=1$, $a^2+b^2$ đúng=$2$ → nhầm ra $3$ ($4-1$, quên nhân 2)','khai_niem','{T108020701}',false),
('R267','Tổng bình/lập phương 2 biến: lệch 1 đơn vị','Rule dự phòng — tính đúng cấu trúc nhưng kết quả lệch 1 đơn vị','Đúng=$2$ → nhầm ra $3$','tinh','{T108020701}',true),
('R268','Tổng bình/lập phương 2 biến: lệch 1 đơn vị chiều ngược lại','Rule cứu — cứu ca $a+b=0$ khiến R264/R265/R266 đều trùng đáp số đúng (mọi hạng có nhân tử $a+b$ triệt tiêu)','Đúng=$0$ → nhầm ra $-1$','tinh','{T108020701}',false),
('R269','Tổng bình/lập phương 2 biến: nhầm sang công thức bậc kia','Rule cứu — nhầm dùng công thức $a^2+b^2$ khi đề hỏi $a^3+b^3$ (hoặc ngược lại), độc lập với nhân tử $a+b$ nên cứu tiếp ca $a+b=0$','$a+b=0,ab=-4$, $a^3+b^3$ đúng=$0$ → nhầm ra $8$ (dùng công thức $a^2+b^2=S^2-2P$)','khai_niem','{T108020701}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
