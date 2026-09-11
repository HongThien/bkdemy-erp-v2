-- MCQ FORM — 9 rule lỗi mới cho 3 dạng Thùy chốt ưu tiên 11/09 ("khá dễ, làm trước"): Viết STP vô hạn tuần
-- hoàn thành phân số (07702011103), Làm tròn STP (0770201102), So sánh số hữu tỉ — nhánh tìm x,y nguyên
-- (T107010103). Đọc lời giải chi tiết + mẫu thật trong kho trước khi đặt rule (đúng quy trình HANDOFF ②).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
-- Viết STP vô hạn tuần hoàn thành phân số
('R38','Coi tuần hoàn từ đầu','Số thập phân N,ABC(DEF) có phần ABC KHÔNG lặp — HS coi cả ABC lẫn DEF đều lặp, ghép thành 1 chu kì','$0,3(5)$ tính như $0,(35)=\dfrac{35}{99}$ (đúng: $\dfrac{16}{45}$)','khai_niem','{07702011103,0770201102}',false),
('R39','Quên nhân 10^p ở mẫu','Đổi N,ABC(DEF) ra phân số nhưng mẫu chỉ có q chữ số 9, quên nhân thêm 10^p (p = số chữ số ABC)','$0,3(5)=\dfrac{32}{9}$ (đúng: mẫu phải là 90, ra $\dfrac{16}{45}$)','khai_niem','{07702011103,0770201102}',false),
('R40','Quên phần nguyên','Đổi số thập phân tuần hoàn N,(...) ra phân số nhưng quên cộng phần nguyên N, chỉ tính riêng phần lặp','$2,(7)=\dfrac{7}{9}$ (đúng: $\dfrac{25}{9}$, thiếu phần nguyên 2)','khai_niem','{07702011103}',false),
-- Làm tròn STP
('R42','Đếm thiếu 1 chữ số khi làm tròn','Làm tròn "đến chữ số thập phân thứ N" nhưng đếm thiếu 1, ra chữ số thứ N−1','Làm tròn 73,46821 đến chữ số thứ hai → 73,5 (đúng: 73,47, chữ số thứ nhất)','khai_niem','{0770201102}',false),
('R43','Chặt cụt thay vì làm tròn','Bỏ hẳn phần thừa (như hàm floor) thay vì so sánh chữ số kế tiếp với 5 để quyết định làm tròn lên/xuống','Làm tròn 73,46821 đến chữ số thứ hai → 73,46 (đúng: 73,47)','khai_niem','{0770201102}',false),
('R44','Hiểu sai độ chính xác','"Làm tròn với độ chính xác d" là làm tròn đến bước 2d — HS hiểu nhầm là làm tròn đến chính d','Độ chính xác 0,05 → làm tròn đến 0,05 thay vì 0,1 (đúng bước là 2×0,05)','khai_niem','{0770201102}',false),
-- So sánh số hữu tỉ — tìm x,y nguyên trong bất đẳng thức kép
('R45','Quy đồng sai mẫu','Tìm x,y nguyên trong A<x/d1<y/d2<B (d1≠d2) nhưng quy đồng nhầm, dùng mẫu của x cho cả y','$\dfrac12>\dfrac x4>\dfrac y8>\dfrac1{24}$ quy đồng cả về mẫu 4 (đúng phải mẫu chung 24, đổi y qua mẫu 8 riêng)','khai_niem','{T107010103}',false),
('R46','Liệt kê lố lên 1 số','Tìm đúng khoảng nhưng liệt kê lố lên 1 số nguyên so với cặp x,y đúng','Đúng x=-7,y=-6 → liệt kê nhầm x=-6,y=-5','tinh','{T107010103}',false),
('R47','Liệt kê lố xuống 1 số','Tìm đúng khoảng nhưng liệt kê lố xuống 1 số nguyên so với cặp x,y đúng','Đúng x=-7,y=-6 → liệt kê nhầm x=-8,y=-7','tinh','{T107010103}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
