-- MCQ FORM — rule cứu (rescue) R125 cho "Phép cộng trừ đơn thức đồng dạng" (T108010201, khối 8).
-- Sau khi sửa lỗi hienThiDonThuc(0,...) => "0" thì tỉ lệ "chỉ tìm được 2 distractor" tăng cao ở 2 nhóm:
-- (a) câu "Thu gọn đa thức" có >=3 hạng tử — R122 (đảo ngược) chỉ áp dụng cho đúng 2 hạng tử, không có tác dụng;
-- (b) câu có đáp số DƯƠNG — R123 (bỏ dấu âm) chỉ áp dụng khi đáp số ÂM.
-- R125 là cơ chế THẬT SỰ khác (không phải dự phòng): học sinh chỉ chép lại hạng tử đầu tiên, quên
-- cộng/trừ các hạng tử còn lại — áp dụng được mọi số hạng >=2, không phụ thuộc dấu đáp số.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R125','Chỉ lấy hạng tử đầu tiên','Quên cộng/trừ các hạng tử còn lại — chỉ chép lại hạng tử đầu tiên làm đáp số','Thu gọn $5xy^2-9xy^2+6xy^2$ đúng=$2xy^2$ → nhầm ra $5xy^2$ (chỉ lấy hạng tử đầu)','khai_niem','{T108010201}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
