-- MCQ FORM — 5 rule cho "GTLN-GTNN của biểu thức bậc hai một biến trên 1 đoạn" (T109080102, khối 9, 27/28
-- câu — 1 câu kho tự sai đáp số, bỏ theo §1.5). Hàm mới `gtlnGtnnBacHaiCoDieuKien` — so f(đầu mút trái),
-- f(đầu mút phải), f(đỉnh parabol nếu đỉnh rơi trong đoạn) rồi lấy max/min trên tập đó.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R318','GTLN-GTNN trên đoạn: quên xét đỉnh parabol rơi trong đoạn','Chỉ so sánh giá trị tại 2 đầu mút, quên xét giá trị tại đỉnh parabol khi đỉnh nằm trong đoạn','$A=x^2-4x+2$, $[0;4]$, đỉnh $x=2$ cho GTNN đúng $=-2$ → nhầm chỉ so 2 đầu mút, GTNN$=2$','khai_niem','{T109080102}',false),
('R319','GTLN-GTNN trên đoạn: nhầm dấu phần bù khi tính tại đỉnh','Xét đúng đỉnh rơi trong đoạn nhưng tính giá trị tại đỉnh sai dấu phần bù (cộng thay vì trừ)','Đỉnh đúng cho giá trị $-2$ → nhầm tính ra giá trị dương tương ứng','khai_niem','{T109080102}',false),
('R320','GTLN-GTNN trên đoạn: quên xét đầu mút phải','Chỉ so sánh đầu mút trái và đỉnh (nếu có), quên xét giá trị tại đầu mút phải của đoạn','$[0;4]$ đúng phải xét cả $x=4$ → nhầm chỉ xét $x=0$ và đỉnh','khai_niem','{T109080102}',false),
('R321','GTLN-GTNN trên đoạn: lệch 1 đơn vị ở GTNN','Rule dự phòng — tính đúng cấu trúc nhưng GTNN lệch 1 đơn vị','Đúng GTNN$=-2$ → nhầm $-1$','tinh','{T109080102}',true),
('R322','GTLN-GTNN trên đoạn: lệch 1 đơn vị ở GTLN','Rule cứu — đúng cấu trúc nhưng GTLN lệch 1 đơn vị (dùng khi đoạn đối xứng khiến các rule khác trùng nhau)','Đúng GTLN$=2$ → nhầm $1$','tinh','{T109080102}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
