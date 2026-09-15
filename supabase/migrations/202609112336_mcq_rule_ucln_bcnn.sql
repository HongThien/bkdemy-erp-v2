-- MCQ FORM — 8 rule cho nhóm ƯCLN/BCNN khối 6 (T106040102 Tìm ƯCLN, T106040202 Tìm BCNN, T106040104 Tìm n qua
-- ƯCLN (lớn nhất / n<C / C<n<D), T106040204 Tìm n qua BCNN (nhỏ nhất khác 0 / D<n<E)). R62-R65 áp cho câu đáp số
-- là 1 GIÁ TRỊ; R66-R69 áp cho câu đáp số là TẬP ước/bội thoả điều kiện khoảng (2 dạng sau trộn cả 2 kiểu đề).
-- Tự quyết theo quy trình nới 11/09 (dạng rõ ràng, tái dùng cơ chế đã có ở DẠNG 4/5) — đọc lời giải kho trước,
-- rule suy trực tiếp từ lỗi khái niệm/tính toán thật của phương pháp phân tích thừa số nguyên tố.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R62','Nhầm ƯCLN thành BCNN (hoặc ngược lại)','Tính ngược khái niệm — HS nhầm lẫn 2 khái niệm với nhau, tính ra kết quả của cái còn lại','ƯCLN(20;30) nhầm ra BCNN(20;30)=60 (đúng: 10)','khai_niem','{T106040102,T106040202,T106040104,T106040204}',false),
('R63','Sai quy tắc số mũ ở thừa số chung','Tìm ƯCLN lấy số mũ LỚN NHẤT thay vì nhỏ nhất (hoặc BCNN lấy số mũ NHỎ NHẤT thay vì lớn nhất) ở các thừa số nguyên tố chung','ƯCLN(24;36): $24=2^3\cdot3, 36=2^2\cdot3^2$ → nhầm lấy $2^3\cdot3^2=72$ (đúng: $2^2\cdot3=12$)','tinh','{T106040102,T106040202,T106040104,T106040204}',false),
('R64','Bỏ sót 1 thừa số khi nhân lại','Phân tích ra thừa số nguyên tố đúng nhưng khi nhân lại để ra kết quả thì bỏ quên 1 thừa số','ƯCLN=$2^2\cdot3\cdot5$ nhân lại thiếu 5, ra $2^2\cdot3=12$ (đúng: 60)','tinh','{T106040102,T106040202,T106040104,T106040204}',false),
('R65','Nhân trực tiếp các số, không rút gọn (chỉ BCNN)','Coi BCNN = tích các số với nhau, quên rút gọn theo ước chung — chỉ đúng khi 2 số nguyên tố cùng nhau','BCNN(6;8) nhầm ra 6×8=48 (đúng: 24)','tinh','{T106040202,T106040204}',false),
('R66','Sai ƯCLN/BCNN gốc rồi liệt kê lại theo khoảng','Nhầm ƯCLN/BCNN thành BCNN/ƯCLN (như R62) rồi mới liệt kê ước/bội thoả điều kiện khoảng của đề — kết quả sai từ gốc','n<15, đúng n∈ƯC(36;48)={1;2;3;4;6;12} → nhầm tính theo BCNN=144 rồi liệt kê bội trong khoảng','khai_niem','{T106040104,T106040204}',false),
('R67','Nhầm khoảng mở thành đóng','Đề cho n<C (hoặc C<n<D) là khoảng MỞ (không tính biên) nhưng HS tính như khoảng ĐÓNG, lấy thêm số đúng bằng biên nếu biên đó là ước/bội thật','2<n<10, ƯC(45;60)=U(15)={1;3;5;15} → nhầm lấy cả biên nếu biên trùng ước, thêm nhầm 1 số','tinh','{T106040104,T106040204}',false),
('R68','Bỏ sót 1 phần tử đúng trong danh sách','Liệt kê tập ước/bội thoả khoảng nhưng thiếu 1 số thật sự thuộc tập — thường sót số lớn nhất','n<15, đúng {1;2;3;4;6;12} → liệt kê thiếu 12, ra {1;2;3;4;6}','tinh','{T106040104,T106040204}',false),
('R69','Quên điều kiện/chỉ xét 1 phần','ƯCLN: tìm đúng ƯC nhưng quên lọc theo điều kiện khoảng, liệt kê hết. BCNN (≥3 số): quên 1 điều kiện chia hết, chỉ tính BCNN của các số còn lại','n:4,n:6,n:8 và 40<n<100 → quên điều kiện chia hết cho 8, chỉ xét BCNN(4;6)=12 trong khoảng','khai_niem','{T106040104,T106040204}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
