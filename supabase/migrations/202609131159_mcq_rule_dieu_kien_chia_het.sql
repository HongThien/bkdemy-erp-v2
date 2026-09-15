-- MCQ FORM — 5 rule cho "Tìm m nguyên để đa thức chia hết cho đơn thức" (T108010404, khối 8, 11 câu).
-- Đáp số là 1 SỐ hoặc DANH SÁCH số cách nhau "; " (vd "5" hoặc "5; 6") — TEXT_DANG.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R159','Quên xét hạng tử còn lại','Chỉ xét điều kiện chia hết của hạng tử CÓ CHỨA ẩn m, quên xét hạng tử còn lại cũng phải chia hết','Đúng $m\in\{5;6\}$ → nhầm ra $m\in\{5;6;7\}$ (bỏ sót điều kiện từ hạng tử thứ hai)','khai_niem','{T108010404}',false),
('R160','Tưởng 1 giá trị, lấy cận dưới','Không nhận ra có nhiều giá trị m thoả mãn (khoảng), tưởng chỉ có 1 giá trị và lấy cận dưới của khoảng','Đúng $m\in\{5;6\}$ → nhầm chỉ ra $m=5$','khai_niem','{T108010404}',false),
('R161','Tưởng 1 giá trị, lấy cận trên','Không nhận ra có nhiều giá trị m thoả mãn (khoảng), tưởng chỉ có 1 giá trị và lấy cận trên của khoảng','Đúng $m\in\{5;6\}$ → nhầm chỉ ra $m=6$','khai_niem','{T108010404}',false),
('R162','Điều kiện chia hết: lệch cận dưới 1 đơn vị','Rule dự phòng — tính đúng cận trên nhưng cận dưới của khoảng lệch 1 đơn vị','Đúng $m=5$ → nhầm ra $m\in\{4;5\}$','tinh','{T108010404}',true),
('R163','Lệch cả khoảng lên 1 đơn vị','Tính đúng ĐỘ RỘNG khoảng nhưng cả 2 đầu mút đều lệch lên 1 đơn vị (tính nhầm mốc xuất phát)','Đúng $m=5$ → nhầm ra $m=6$','tinh','{T108010404}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
