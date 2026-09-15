-- MCQ FORM — 4 rule cho "Hệ phương trình đối xứng dạng Tổng-Tích" (T109010401, khối 9, 4/4 câu). Hàm mới
-- `giaiHePtTongTich` — đặt S=x+y, P=xy, giải hệ quy về phương trình bậc 2 theo S (định lý nghiệm hữu tỉ),
-- suy P rồi giải tiếp Viète ra x,y — hệ đối xứng nên đáp số kho luôn liệt kê CẢ 2 hoán vị (x;y) và (y;x).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R355','Hệ PT tổng-tích: quên 1 hoán vị nghiệm','Tìm đúng 1 cặp nghiệm nhưng quên rằng hệ đối xứng luôn có cả hoán vị (y;x), chỉ báo 1 trong 2 cặp','Đúng $(2,3),(3,2)$ → nhầm chỉ báo $(2,3)$','khai_niem','{T109010401}',false),
('R356','Hệ PT tổng-tích: lệch 1 đơn vị ở giá trị x mọi cặp','Rule dự phòng — đúng cấu trúc nhưng giá trị x ở mọi cặp lệch 1 đơn vị','Đúng $(2,3),(3,2)$ → nhầm $(3,3),(4,2)$','tinh','{T109010401}',true),
('R357','Hệ PT tổng-tích: lệch 1 đơn vị ở giá trị y mọi cặp','Đúng cấu trúc nhưng giá trị y ở mọi cặp lệch 1 đơn vị','Đúng $(2,3),(3,2)$ → nhầm $(2,4),(3,3)$','tinh','{T109010401}',false),
('R358','Hệ PT tổng-tích: lệch 1 đơn vị ở giá trị x mọi cặp, chiều ngược lại','Đúng cấu trúc nhưng giá trị x ở mọi cặp lệch 1 đơn vị theo chiều ngược lại với R356','Đúng $(2,3),(3,2)$ → nhầm $(1,3),(2,2)$','tinh','{T109010401}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
