-- MCQ FORM — mở rộng "sinh nhiễu từ đáp số kho" (R343-346) sang khối 12 (12/14 dạng, loại T112040102 đáp số
-- là biểu thức hàm số và T112020305 đáp số Đúng/Sai — không khớp khuôn số). TÁI DÙNG NGUYÊN
-- `sinhNhieuDapSoThucTe`, chỉ mở rộng thêm 2 khuôn nhỏ: nhãn biến đứng trước giá trị ("x=1", "a=25; b=1/4")
-- và bộ số bọc trong ngoặc ("(3; 8/3; -8/3)") — không rule mới.
update dai_mcq_rule set ap_dung = ap_dung || '{T112030103,T112070311,T112070308,T112030102,T112050203,T112030101,T112070307,T112010403,T112040201,T112040202,T112050106,T112010303}'::text[]
where ma in ('R343', 'R344', 'R345', 'R346') and not ('T112030103' = any(ap_dung));
