-- MCQ FORM — 4 rule cho "Phân tích ĐTTNT — nhẩm nghiệm" (T108030105, khối 8, đa thức bậc ba, 43/62 câu —
-- phần còn lại kho sai đáp số thật sự (đã tự xác minh bằng cách khai triển lại đối chiếu đề gốc) hoặc cấu
-- trúc khác 4 hạng, để sau). Đáp số kho là TÍCH 3 NHÂN TỬ ⇒ TÁI DÙNG canon `chuanHoaRutNhanTuChung`.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R293','Nhẩm nghiệm: nhầm dấu nghiệm nhẩm được','Nhẩm đúng độ lớn nghiệm nhưng nhầm dấu khi viết nhân tử bậc nhất','$x^3-3x^2-4x+12$ đúng=$(x-2)(x+2)(x-3)$ → nhầm ra $(x+2)(x+2)(x-3)$','khai_niem','{T108030105}',false),
('R294','Nhẩm nghiệm: nhầm dấu khi ghép nhóm ở tam thức bậc hai','Nhẩm nghiệm đúng, chia đa thức đúng nhưng nhầm dấu khi ghép 2 nhóm ở bước phân tích tam thức bậc hai còn lại','Đúng cấu trúc nhưng sai dấu ở bước phân tích tam thức bậc hai','khai_niem','{T108030105}',false),
('R295','Nhẩm nghiệm: lệch 1 đơn vị hệ số ở nhân tử bậc hai','Rule dự phòng — đúng cấu trúc nhưng hệ số hạng tử bậc cao nhất ở nhân tử bậc hai còn lại lệch 1 đơn vị','Đúng cấu trúc nhưng lệch 1 đơn vị hệ số','tinh','{T108030105}',false),
('R296','Nhẩm nghiệm: lệch 1 đơn vị hệ số ở nhân tử bậc hai, chiều ngược lại','Rule cứu, chiều ngược lại R295','Đúng cấu trúc nhưng lệch 1 đơn vị hệ số theo chiều ngược lại','tinh','{T108030105}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
