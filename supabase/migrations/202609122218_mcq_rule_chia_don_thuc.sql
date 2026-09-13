-- MCQ FORM — 4 rule cho "Chia đơn thức cho đơn thức" (T108010401, khối 8, 49 câu). Đáp số là 1 ĐƠN THỨC —
-- TEXT_DANG, tái dùng chuanHoaDonThucKetQua/hienThiDonThuc của DẠNG 11.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R147','Cộng số mũ thay vì trừ','Sai khái niệm căn bản — khi CHIA 2 đơn thức có cùng biến, CỘNG số mũ của biến đó thay vì TRỪ (nhầm thành phép nhân)','$x^5:x^2$ đúng=$x^3$ → nhầm ra $x^7$ (cộng 5+2=7 thay vì trừ 5-2=3)','khai_niem','{T108010401}',false),
('R148','Quên đổi dấu hệ số khi mẫu âm','Chia cho 1 số ÂM — quên đổi dấu, coi mẫu luôn dương','$24x^7y^5:(-6x^3y^2)$ đúng=$-4x^4y^3$ → nhầm ra $4x^4y^3$ (bỏ dấu âm của mẫu)','tinh','{T108010401}',false),
('R149','Quên chia hệ số, chỉ trừ số mũ','Trừ đúng số mũ của biến nhưng QUÊN chia hệ số, giữ nguyên hệ số của tử','$12x^2yz^2:4xyz$ đúng=$3xz$ → nhầm ra $12xz$ (giữ nguyên hệ số 12 của tử)','khai_niem','{T108010401}',false),
('R150','Chia đơn thức: lệch 1 đơn vị ở hệ số','Rule dự phòng — tính đúng phần biến nhưng hệ số lệch 1 đơn vị so với đúng','Đúng=$3xz$ → nhầm hệ số thành $4$','tinh','{T108010401}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
