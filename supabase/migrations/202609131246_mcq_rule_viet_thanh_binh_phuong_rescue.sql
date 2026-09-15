-- MCQ FORM — rule cứu R186 cho T108020102. Khi √A=1 (rất phổ biến, nhóm x^2±...) VÀ hạng tự do là 0 hoặc 1
-- (√C = chính nó), cả R182 (quên căn hệ số) lẫn R184 (quên căn hạng tự do) đều TRÙNG đáp án đúng — thêm
-- rule lệch hệ số biến (không phụ thuộc căn bậc hai) làm lưới an toàn.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R186','Lệch 1 đơn vị hệ số biến','Tìm đúng cấu trúc và hạng tự do nhưng hệ số của biến trong nhị thức lệch 1 đơn vị','Đúng=$x+1$ → nhầm ra $2x+1$','tinh','{T108020102}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
