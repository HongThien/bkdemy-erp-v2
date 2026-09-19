-- MCQ FORM — sửa R120 thành rule CHÍNH THỨC (du_phong=false). Migration 202609121445 đánh nhầm du_phong=true,
-- nhưng R103 (cùng dạng T108010101) ĐÃ là du_phong=true từ trước — 2 rule dự phòng cùng dạng gây FAIL verify
-- "quá 1 rule dự phòng" khi cả 2 cùng được chọn cho 1 câu. R120 là cơ chế rõ ràng (lọc theo hình thức viết),
-- không phải "cứu vãn khi thiếu" — đúng ra không nên đánh dự phòng ngay từ đầu.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R120','Chỉ tính đơn thức viết đơn giản','Sai khái niệm — chỉ tính là đơn thức những biểu thức viết ĐƠN GIẢN (không dấu chấm nhân, không phân số, không căn), bỏ qua đơn thức viết phức tạp dù về bản chất vẫn là đơn thức','$-2x^4y$ và $5$ (đơn giản) được tính, $\dfrac{1}{5}xy^2$ và $x.\dfrac{3}{-7}y^6$ (phức tạp) bị bỏ qua dù cũng là đơn thức','khai_niem','{T108010101}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
