-- MCQ FORM — 5 rule cho "Giải bất phương trình bậc nhất một ẩn" (T109020201, 34/34 câu) và
-- "Giải BPT bậc nhất quy về từ biểu thức phức tạp hơn" (T109020202, 28/28 câu, khối 9). Đáp số kho
-- là "x [op] value" — canon riêng `chuanHoaBatDangThuc` chuẩn hoá cả toán tử lẫn giá trị biên.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R305','Giải BPT bậc nhất: quên đổi chiều khi chia/nhân cho số âm','Giải đúng ra giá trị biên nhưng quên đổi chiều bất đẳng thức khi chia/nhân 2 vế cho hệ số x âm','$-2x+4\ge 10$ đúng $x\le -3$ → nhầm $x\ge -3$','khai_niem','{T109020201,T109020202}',false),
('R306','Giải BPT bậc nhất: lệch 1 đơn vị ở giá trị biên','Rule dự phòng — đúng chiều bất đẳng thức nhưng giá trị biên lệch 1 đơn vị','Đúng $x\ge 3$ → nhầm $x\ge 4$','tinh','{T109020201,T109020202}',true),
('R307','Giải BPT bậc nhất: lệch 1 đơn vị ở giá trị biên, chiều ngược lại','Đúng chiều bất đẳng thức nhưng giá trị biên lệch 1 đơn vị theo chiều ngược lại với R306','Đúng $x\ge 3$ → nhầm $x\ge 2$','tinh','{T109020201,T109020202}',false),
('R308','Giải BPT bậc nhất: tính sai dấu giá trị biên','Giải đúng cấu trúc nhưng đổi dấu sai giá trị biên (lấy đối số của đáp số đúng)','Đúng $x\ge 3$ → nhầm $x\ge -3$','tinh','{T109020201,T109020202}',false),
('R309','Giải BPT bậc nhất: quên chia hệ số của x, coi hệ số x luôn bằng 1','Chuyển vế đúng nhưng quên chia hệ số x khi tìm giá trị biên, coi hệ số x luôn bằng 1','$2x+4\ge 10$ đúng $x\ge 3$ → nhầm $x\ge 6$','khai_niem','{T109020201,T109020202}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
