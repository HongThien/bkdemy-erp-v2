-- MCQ FORM — 16 rule cho nhóm ĐƠN THỨC CƠ BẢN khối 8 (T108010101 Nhận biết đơn thức/đa thức, T108010102 Tìm
-- bậc, T108010103 Tìm hệ số, T108010104 Đơn thức đồng dạng). Đây là 4 dạng ĐẦU TIÊN của khối 8 — đại số đa
-- thức khác hẳn số học khối 6-7, nhưng 4 dạng này đáp số vẫn là 1 GIÁ TRỊ đơn (số lượng/bậc/hệ số) nên vẫn đi
-- được khuôn SPECIAL_DANG cũ, KHÔNG cần engine đa thức tổng quát. Rule suy trực tiếp từ khái niệm đơn
-- thức/bậc/hệ số/đồng dạng — đọc lời giải kho trước khi thiết kế (đúng quy trình spec-mcq-quy-trinh-sinh.md).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R89','Bỏ sót 1 biến khi cộng số mũ','Tính bậc đơn thức bằng cách cộng số mũ các biến nhưng bỏ sót 1 biến (thường biến có số mũ nhỏ nhất)','x^2yz bậc đúng=4 (2+1+1) → nhầm bỏ sót y hoặc z, ra 3','tinh','{T108010102}',false),
('R90','Quên nhân số mũ ngoài luỹ thừa (…)^n','Đơn thức có dạng x^a.(biểu thức)^n — quên nhân số mũ TRONG ngoặc với n, chỉ cộng thẳng bậc trong ngoặc như n=1','x^5.(3yz^2)^3 bậc đúng=5+3+6=14 → nhầm chỉ cộng x^5.yz^2 = 5+1+2=8','khai_niem','{T108010102}',false),
('R91','Lấy tích số mũ thay vì tổng','Nhầm quy tắc tính bậc — lấy TÍCH các số mũ của từng biến thay vì lấy TỔNG','x^2y^3 bậc đúng=5 (2+3) → nhầm nhân 2×3=6','khai_niem','{T108010102}',false),
('R92','Bỏ dấu âm của hệ số','Đơn thức có hệ số âm nhưng khi trả lời bỏ mất dấu trừ','-x^2y hệ số đúng=-1 → nhầm ra 1','tinh','{T108010103}',false),
('R93','Quên luỹ thừa hệ số trong ngoặc','Đơn thức dạng a.(k.biến)^n — quên luỹ thừa hệ số k trong ngoặc lên bậc n, chỉ nhân 1 lần','-x^2.(3yz^2)^3 hệ số đúng=-27 (3^3) → nhầm chỉ nhân 1 lần ra -3','tinh','{T108010103}',false),
('R94','Quên nhân hệ số ngoài','Đơn thức dạng a.(k.biến)^n — quên nhân hệ số a ở ngoài, chỉ lấy hệ số trong ngoặc đã luỹ thừa','-x^2.(3yz^2)^3 hệ số đúng=-27 → nhầm quên nhân -1 ở ngoài, ra 27','tinh','{T108010103}',false),
('R95','Đếm nhầm gồm cả đa thức','Đếm số đơn thức trong danh sách nhưng tính nhầm luôn cả các đa thức (biểu thức có +/- nhiều hạng tử) vào','Danh sách có 4 đơn thức + 2 đa thức → nhầm đếm cả 6','khai_niem','{T108010101}',false),
('R96','Đếm thiếu 1 đơn thức thật','Bỏ sót 1 đơn thức viết dưới dạng phức tạp (có dấu chấm nhân, phân số) tưởng nhầm không phải đơn thức','Đúng có 4 đơn thức → đếm thiếu 1, ra 3','tinh','{T108010101}',false),
('R97','Không tính hằng số là đơn thức','Sai khái niệm — nghĩ đơn thức phải có biến, không tính 1 số đơn thuần (không biến) là đơn thức','Danh sách có 1 hằng số "5" cũng là đơn thức → nhầm bỏ nó ra khỏi đếm','khai_niem','{T108010101}',false),
('R98','Đồng dạng: đếm nhầm thêm 1','Đếm số đơn thức đồng dạng nhưng tính nhầm thêm 1 đơn thức khác phần biến (nhìn thoáng qua giống)','Đúng có 3 đồng dạng → đếm nhầm thành 4','tinh','{T108010104}',false),
('R99','Đồng dạng: đếm thiếu 1','Bỏ sót 1 đơn thức đồng dạng thật (có hệ số âm hoặc phân số dễ nhầm)','Đúng có 3 đồng dạng → đếm thiếu, ra 2','tinh','{T108010104}',false),
('R100','Đồng dạng: nhầm phải cùng hệ số','Sai khái niệm — nghĩ 2 đơn thức đồng dạng phải có CÙNG HỆ SỐ, không chỉ cùng phần biến','3x^2y đồng dạng với 5x^2y (khác hệ số, đúng vẫn đồng dạng) → nhầm cho là không đồng dạng','khai_niem','{T108010104}',false),
('R101','Bậc đơn thức: cộng thừa 1','Rule dự phòng — tính bậc lệch thừa 1 đơn vị so với đúng','Bậc đúng=4 → nhầm ra 5','tinh','{T108010102}',true),
('R102','Hệ số đơn thức: lệch 1 đơn vị','Rule dự phòng — tính hệ số lệch 1 đơn vị so với đúng','Hệ số đúng=-1 → nhầm ra 0','tinh','{T108010103}',true),
('R103','Đếm đơn thức: đếm thừa 2','Rule dự phòng — đếm số đơn thức lệch thừa 2 đơn vị so với đúng','Đúng=4 → nhầm ra 6','tinh','{T108010101}',true),
('R104','Đồng dạng: đếm mọi đơn thức hợp lệ','Rule dự phòng — đếm mọi đơn thức hợp lệ trong danh sách (không lọc theo phần biến giống hệt A)','Danh sách 5 đơn thức hợp lệ, chỉ 3 đồng dạng → nhầm đếm cả 5','khai_niem','{T108010104}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
