-- MCQ FORM — 4 rule cho "Phân tích đa thức thành nhân tử — nhóm hạng tử" (T108030102, khối 8, 110 câu,
-- CHỈ sub-shape "4 hạng tử, nhóm 2 đầu + 2 cuối theo đúng thứ tự viết sẵn", 87/110 câu — phần còn lại kho
-- chưa rút hết hệ số hoặc cần hằng đẳng thức lập phương trong 1 nhóm, để sau). Đáp số kho cùng khuôn
-- "hệ số·(ngoặc)(ngoặc)[(ngoặc)]" như T108030101 ⇒ TÁI DÙNG canon `chuanHoaRutNhanTuChung`.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R281','Nhóm hạng tử: nhầm dấu khi ghép 2 nhóm','Rút đúng nhân tử chung ở mỗi nhóm nhưng nhầm dấu khi ghép 2 nhóm lại (coi 2 cụm cùng/khác dấu sai)','$x^2-xy+x-y$ đúng=$(x-y)(x+1)$ → nhầm ghép sai dấu khi kết hợp 2 nhóm','khai_niem','{T108030102}',false),
('R282','Nhóm hạng tử: quên phân tích/rút thêm ở phần còn lại','Nhóm và rút nhân tử chung đúng nhưng dừng lại, quên phân tích/rút thêm 1 lớp nữa ở phần còn lại','$x^3+x^2y-x^2z-xyz$ đúng=$x(x+y)(x-z)$ → nhầm dừng ở $(x+y)(x^2-xz)$','khai_niem','{T108030102}',false),
('R283','Nhóm hạng tử: lệch 1 đơn vị / hiểu nhầm hiệu 2 bình phương thành bình phương','Đúng cấu trúc nhưng hệ số hạng tử bậc cao nhất ở phần còn lại lệch 1 đơn vị (hoặc nếu phần còn lại là hiệu 2 bình phương thì viết nhầm 2 nhân tử cùng dấu)','$6x-15$-kiểu: đúng=$3(2x-5)$ → nhầm ra $3(3x-5)$','tinh','{T108030102}',false),
('R284','Nhóm hạng tử: lệch 1 đơn vị / hiểu nhầm hiệu 2 bình phương thành bình phương, chiều ngược lại','Rule cứu, chiều ngược lại R283 — cứu ca hệ số=1 khiến các rule khác trùng đáp số đúng','Đúng=$3(2x-5)$ → nhầm ra $3(x-5)$','tinh','{T108030102}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
