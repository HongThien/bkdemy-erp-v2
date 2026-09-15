-- MCQ FORM — 4 rule cho "Phân tích ra thừa số nguyên tố" (T106030302, khối 6). Đáp số dạng này là BIỂU THỨC
-- (vd "2·11²"), không phải 1 giá trị — pipeline `mcq-sinh.mjs`/`mcq-auto.mjs` mở rộng thêm nhánh so TEXT riêng
-- (TEXT_DANG), tách khỏi khuôn Rat/parseHuuTi dùng chung. Thùy chốt 2 rule + CTO đề xuất thêm 2 (11/09).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R53','Nhầm số mũ','Phân tích đúng các thừa số nguyên tố nhưng sai số mũ của 1 thừa số (lệch 1)','$242=2\cdot11^2$ viết nhầm $2\cdot11$ (đúng: $11^2$)','khai_niem','{T106030302}',false),
('R54','Thừa số chưa phải nguyên tố','Gộp 2 thừa số nguyên tố thành 1 hợp số nhưng KHÔNG phân tích tiếp — giá trị vẫn đúng, chỉ sai vì hợp số không phải thừa số nguyên tố','$132=2^2\cdot3\cdot11$ viết thành $12\cdot11$ ($12=2^2\cdot3$ nhưng chưa phân tích tiếp)','khai_niem','{T106030302}',false),
('R55','Bỏ sót 1 thừa số','Phân tích thiếu hẳn 1 thừa số nguyên tố có thật, kết quả sai cả giá trị','$132=2^2\cdot3\cdot11$ viết thiếu thành $2^2\cdot3$ (bỏ sót 11)','khai_niem','{T106030302}',false),
('R56','Nhầm sang số nguyên tố khác','Thay 1 thừa số nguyên tố đúng bằng số nguyên tố kế tiếp — lỗi chia thử sai số','$132=2^2\cdot3\cdot11$ viết nhầm $3^2\cdot3\cdot11$ (nhầm 2 thành 3)','tinh','{T106030302}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
