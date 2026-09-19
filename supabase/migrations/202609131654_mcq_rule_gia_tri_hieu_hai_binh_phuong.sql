-- MCQ FORM — 8 rule cho "Tính giá trị biểu thức ứng dụng hiệu hai bình phương" (T108020402, khối 8, 17 câu,
-- trộn 2 sub-shape: (a) nhân nhanh 2 số kiểu 79.81 bằng mẹo (m-d)(m+d), (b) thế giá trị vào x²-C). Đáp số là
-- 1 GIÁ TRỊ HỮU TỈ — SPECIAL_DANG, tái dùng canonOf/parseHuuTi chung như DẠNG 31.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R234','Nhân nhanh hiệu 2 bình phương: quên trừ bình phương khoảng cách','Dùng mẹo (m-d)(m+d)=m²-d² nhưng quên trừ d², chỉ lấy bình phương số ở giữa','$79.81$ đúng=$6399$ ($80^2-1^2$) → nhầm ra $6400$ (chỉ lấy $80^2$)','khai_niem','{T108020402}',false),
('R235','Nhân nhanh hiệu 2 bình phương: nhầm dấu cộng thay vì trừ','Nhầm công thức $m^2-d^2$ thành $m^2+d^2$','$79.81$ đúng=$6399$ → nhầm ra $6401$ ($6400+1$)','khai_niem','{T108020402}',false),
('R236','Nhân nhanh hiệu 2 bình phương: lệch 1 đơn vị','Rule dự phòng — tính đúng cấu trúc nhưng kết quả cuối lệch 1 đơn vị','Đúng=$6399$ → nhầm ra $6400$','tinh','{T108020402}',true),
('R237','Nhân nhanh hiệu 2 bình phương: lệch 1 đơn vị chiều ngược lại','Tính đúng cấu trúc nhưng kết quả cuối lệch 1 đơn vị theo chiều ngược lại với R236','Đúng=$6399$ → nhầm ra $6398$','tinh','{T108020402}',false),
('R238','Tính giá trị hiệu 2 bình phương: sai dấu kết quả','Thế đúng nhưng tính sai dấu kết quả cuối cùng','$x^2-4$ tại $x=102$ đúng=$10400$ → nhầm ra $-10400$','tinh','{T108020402}',false),
('R239','Tính giá trị hiệu 2 bình phương: lệch 1 đơn vị','Rule dự phòng — thế đúng cấu trúc nhưng kết quả lệch 1 đơn vị','Đúng=$10400$ → nhầm ra $10401$','tinh','{T108020402}',true),
('R240','Tính giá trị hiệu 2 bình phương: lệch 1 đơn vị chiều ngược lại','Thế đúng cấu trúc nhưng kết quả lệch 1 đơn vị theo chiều ngược lại với R239','Đúng=$10400$ → nhầm ra $10399$','tinh','{T108020402}',false),
('R241','Tính giá trị hiệu 2 bình phương: quên trừ hạng tử hằng số','Chỉ tính bình phương của giá trị thế, quên trừ hạng tử hằng số C trong biểu thức x²-C','$x^2-4$ tại $x=102$ đúng=$10400$ → nhầm ra $10404$ (chỉ tính $102^2$)','khai_niem','{T108020402}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
