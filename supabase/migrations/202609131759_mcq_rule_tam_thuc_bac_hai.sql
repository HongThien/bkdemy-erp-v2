-- MCQ FORM — 4 rule cho "Phân tích ĐTTNT — tam thức bậc hai x²+Bx+C" (T108030103, khối 8, CHỈ sub-shape hệ
-- số bậc 2 = 1, 32/166 câu — phần lớn còn lại cần nhóm hạng tử 2 biến hoặc đặt ẩn phụ, khác kỹ thuật, để
-- sau). Đáp số cùng khuôn tích 2 nhân tử như T108030101/102 ⇒ TÁI DÙNG canon `chuanHoaRutNhanTuChung`.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R285','Tam thức bậc hai: nhầm dấu 1 nghiệm','Tìm đúng độ lớn 2 nghiệm nhưng nhầm dấu của 1 nghiệm','$x^2-6x+8$ đúng=$(x-2)(x-4)$ → nhầm ra $(x-2)(x+4)$','khai_niem','{T108030103}',false),
('R286','Tam thức bậc hai: nhầm dấu cả 2 nghiệm','Tìm đúng độ lớn 2 nghiệm nhưng nhầm dấu cả 2 nghiệm','$x^2-6x+8$ đúng=$(x-2)(x-4)$ → nhầm ra $(x+2)(x+4)$','khai_niem','{T108030103}',false),
('R287','Tam thức bậc hai: lệch 1 đơn vị ở 1 nghiệm','Rule dự phòng — đúng cấu trúc nhưng 1 nghiệm lệch 1 đơn vị','$x^2-6x+8$ đúng=$(x-2)(x-4)$ → nhầm ra $(x-3)(x-4)$','tinh','{T108030103}',true),
('R288','Tam thức bậc hai: lệch 1 đơn vị ở 1 nghiệm, chiều ngược lại','Đúng cấu trúc nhưng 1 nghiệm lệch 1 đơn vị theo chiều ngược lại với R287','$x^2-6x+8$ đúng=$(x-2)(x-4)$ → nhầm ra $(x-1)(x-4)$','tinh','{T108030103}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
