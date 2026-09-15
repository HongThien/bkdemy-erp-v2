-- MCQ FORM — 6 rule cho "Phân tích đa thức thành nhân tử — rút nhân tử chung" (T108030101, khối 8, 147 câu,
-- 116/147 làm được — phần còn lại là kho chưa rút hết GCD (đáp số kho dừng ở mức "chưa tối giản" khi có cụm
-- ngoặc chung) hoặc cấu trúc nhóm hạng tử phức tạp hơn phạm vi rút-nhân-tử-chung đơn giản). Đáp số kho là 1
-- BIỂU THỨC TÍCH (hệ số·biến·(ngoặc)) — TEXT_DANG, canon riêng `chuanHoaRutNhanTuChung` (phân biệt "chưa rút
-- hết" khỏi "rút đúng", khác hẳn canon kiểu khai-triển-so-giá-trị của các dạng "khai triển/rút gọn" trước đó).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R274','Rút nhân tử chung: quên rút hệ số chung','Rút đúng phần biến/cụm ngoặc chung nhưng quên rút hệ số (ước chung lớn nhất) của các hạng tử','$8x-20$ đúng=$4(2x-5)$ → nhầm ra $1(8x-20)$ (không rút hệ số)','khai_niem','{T108030101}',false),
('R275','Rút nhân tử chung: rút chưa lớn nhất','Rút được 1 ước của hệ số chung nhưng CHƯA phải ước chung lớn nhất','$18x^4y^2-24x^2y^2$ đúng=$6x^2y^2(3x^2-4)$ → nhầm ra $2x^2y^2(9x^2-12)$ (chỉ rút ước 2, không phải 6)','khai_niem','{T108030101}',false),
('R276','Rút nhân tử chung: quên rút 1 biến chung','Rút đúng hệ số nhưng quên rút 1 biến chung, để sót biến đó lại trong ngoặc','$18x^4y^2-24x^2y^2$ đúng=$6x^2y^2(3x^2-4)$ → nhầm ra $6y^2(3x^4-4x^2)$ (quên rút biến x)','khai_niem','{T108030101}',false),
('R277','Rút nhân tử chung: nhầm dấu 1 hạng tử trong ngoặc','Rút đúng nhân tử chung nhưng nhầm dấu 1 hạng tử trong phần còn lại của ngoặc','$6x-15$ đúng=$3(2x-5)$ → nhầm ra $3(2x+5)$','khai_niem','{T108030101}',false),
('R278','Rút nhân tử chung: lệch 1 đơn vị hệ số trong ngoặc','Rule dự phòng — rút đúng cấu trúc nhưng hệ số hạng tử bậc cao nhất trong ngoặc lệch 1 đơn vị','$6x-15$ đúng=$3(2x-5)$ → nhầm ra $3(3x-5)$','tinh','{T108030101}',true),
('R280','Rút nhân tử chung: lệch 1 đơn vị hệ số trong ngoặc, chiều ngược lại','Rule cứu — cứu ca không có hệ số/biến chung để rút (R274-276 vô hiệu do đã rút hết ngay từ dạng đề, chỉ còn R277)','$2x(x-2)+3(x-2)$ đúng=$(x-2)(2x+3)$ → nhầm ra $(x-2)(x+3)$','tinh','{T108030101}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
