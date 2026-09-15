-- MCQ FORM — thêm R72 cho sub-shape "n<C"/"C<n<D" của T106040104/204. Chạy thật T106040104 chỉ 17/44 (39%) —
-- R66 (sai ƯCLN/BCNN gốc) hầu như không fire vì BCNN(a;b) thường LỚN HƠN NHIỀU khoảng hẹp của đề (n<15…) nên
-- không có bội nào lọt vào khoảng; R67 (nhầm biên) chỉ fire khi biên TRÙNG đúng 1 ước/bội thật (hiếm). Chỉ còn
-- R68+R69 = 2 < 3 cần thiết cho hầu hết câu. Thêm R72: nhầm bài toán "liệt kê cả tập" thành "tìm 1 số duy nhất"
-- (lớn nhất/nhỏ nhất) — hợp lý vì 2 sub-shape này SONG SONG tồn tại trong CÙNG dạng, HS dễ lẫn.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R72','Nhầm sang tìm 1 số duy nhất','Đề yêu cầu liệt kê CẢ TẬP số thoả điều kiện khoảng nhưng HS nhầm sang kiểu bài "tìm n lớn nhất/nhỏ nhất" (dạng con song song trong cùng chủ đề), chỉ chọn 1 số','n biết 36⋮n, 48⋮n, n<15 → đúng {1;2;3;4;6;12}, nhầm chỉ chọn 12','khai_niem','{T106040104,T106040204}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
