-- MCQ FORM — thêm R120 (rule dự phòng) cho T108010101 nhánh "đếm đơn thức". Chạy thật phát hiện R95≈R103 và
-- R96≈R97 TRÙNG GIÁ TRỊ ngẫu nhiên với cấu trúc câu lặp lại (6 biểu thức, 4 đơn thức/2 đa thức, 1 hằng số) —
-- 22% câu chỉ còn 2 candidate phân biệt. Thêm 1 cơ chế khác hẳn (lọc theo HÌNH THỨC VIẾT thay vì đếm lệch).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R120','Chỉ tính đơn thức viết đơn giản','Sai khái niệm — chỉ tính là đơn thức những biểu thức viết ĐƠN GIẢN (không dấu chấm nhân, không phân số, không căn), bỏ qua đơn thức viết phức tạp dù về bản chất vẫn là đơn thức','$-2x^4y$ và $5$ (đơn giản) được tính, $\dfrac{1}{5}xy^2$ và $x.\dfrac{3}{-7}y^6$ (phức tạp) bị bỏ qua dù cũng là đơn thức','khai_niem','{T108010101}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
