-- MCQ FORM — 9 rule cho "Viết đa thức thành tích / ứng dụng hiệu hai bình phương" (T108020401, khối 8,
-- 61 câu, trộn 2 sub-shape: (a) phân tích Ax²-C, (b) khai triển tích cho sẵn). Đáp số là 1 BIỂU THỨC
-- (tích 2 nhân tử hoặc đa thức khai triển) — TEXT_DANG, dùng chuanHoaTachBinhPhuong (canon tổng quát).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R225','Hiệu 2 bình phương: hiểu nhầm thành bình phương','Viết 2 nhân tử CÙNG dấu thay vì khác dấu — nhầm hiệu hai bình phương thành bình phương của tổng','$9x^2-16$ đúng=$(3x+4)(3x-4)$ → nhầm ra $(3x+4)(3x+4)$','khai_niem','{T108020401}',false),
('R226','Hiệu 2 bình phương: quên căn hệ số A','Không lấy căn bậc hai của hệ số bậc 2, dùng thẳng hệ số A làm hệ số biến trong nhân tử','$9x^2-16$ đúng=$(3x+4)(3x-4)$ → nhầm ra $(9x+4)(9x-4)$ (dùng thẳng A=9 thay vì √A=3)','khai_niem','{T108020401}',false),
('R227','Hiệu 2 bình phương: quên căn hằng số C','Không lấy căn bậc hai của hằng số, dùng thẳng |C| làm hạng tự do trong nhân tử','$9x^2-16$ đúng=$(3x+4)(3x-4)$ → nhầm ra $(3x+16)(3x-16)$ (dùng thẳng |C|=16 thay vì √|C|=4)','khai_niem','{T108020401}',false),
('R228','Hiệu 2 bình phương: lệch 1 đơn vị hạng tự do','Rule dự phòng — phân tích đúng cấu trúc nhưng hạng tự do trong nhân tử lệch 1 đơn vị','Đúng=$(3x+4)(3x-4)$ → nhầm ra $(3x+5)(3x-5)$','tinh','{T108020401}',true),
('R233','Hiệu 2 bình phương: lệch 1 đơn vị hệ số biến','Rule cứu ứng cho trường hợp hệ số A=1 (√A=1 nên R228 vẫn phân biệt được nhưng cần thêm nhiễu độc lập) — phân tích đúng nhưng hệ số của biến trong 1 nhân tử lệch 1 đơn vị','$x^2-1$ đúng=$(x+1)(x-1)$ → nhầm ra $(2x+1)(x-1)$','tinh','{T108020401}',false),
('R229','Khai triển hiệu 2 bình phương: chỉ nhân hạng đầu','Chỉ nhân hạng tử đầu của các nhân tử với nhau, quên phân phối hết các hạng tử còn lại','$(3x+2)(2-3x)$ đúng=$4-9x^2$ → nhầm ra kết quả chỉ từ tích hạng đầu','khai_niem','{T108020401}',false),
('R230','Khai triển hiệu 2 bình phương: nhân số mũ thay vì cộng','Khi nhân 2 luỹ thừa cùng biến, NHÂN số mũ với nhau thay vì cộng số mũ','$x \\cdot x = x^2$ đúng → nhầm ra $x \\cdot x = x^1=x$ (nhân số mũ 1×1)','tinh','{T108020401}',false),
('R231','Khai triển hiệu 2 bình phương: nhầm dấu trừ thành cộng','Nhầm dấu trừ thành cộng ở 1 hạng tử trong 1 nhân tử trước khi nhân phân phối','$(2-3x)$ đọc nhầm thành $(2+3x)$ rồi mới nhân phân phối','khai_niem','{T108020401}',false),
('R232','Khai triển hiệu 2 bình phương: lệch 1 đơn vị hệ số bậc cao nhất','Rule dự phòng — khai triển đúng cấu trúc nhưng hệ số bậc cao nhất của kết quả lệch 1 đơn vị','Đúng=$4-9x^2$ → nhầm ra $4-8x^2$','tinh','{T108020401}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
