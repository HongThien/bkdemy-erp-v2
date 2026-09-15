-- MCQ FORM — 4 rule cho "Nhận biết Số nguyên tố / Hợp số" (T106030301, khối 6). Đáp số dạng này là TẬP HỢP SỐ
-- (vd "2; 5; 23; 41; 47"), không phải 1 giá trị hay 1 biểu thức — dùng nhánh TEXT_DANG riêng (khác hẳn
-- chuanHoaFactorText của T106030302). Thùy chốt 11/09: vẫn 4 đáp án, 3 sai = danh sách gần đúng (giữ tất cả số
-- đúng, chỉ lẫn nhầm 1 số) — 2 rule Thùy nêu (nhầm 0/1, lẫn số khác nhóm) + CTO đề xuất thêm bỏ sót/đổi chỗ.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R57','Nhầm 0 hoặc 1 vào danh sách','0 và 1 không phải số nguyên tố cũng không phải hợp số, nhưng HS hay nhầm 1 là "số nguyên tố nhỏ nhất" hoặc xếp 0/1 vào hợp số','Đề có $1; 5; 23$ (nguyên tố) → chọn nhầm $1; 5; 23$ (thêm số 1)','khai_niem','{T106030301}',false),
('R58','Lẫn 1 số thuộc nhóm ngược lại vào danh sách','Giữ nguyên tất cả số đúng, thêm nhầm 1 số thuộc nhóm còn lại (hiểu sai bản chất 1 số cụ thể là nguyên tố hay hợp số)','Đề có $2;5;15;23$ (nguyên tố: 2,5,23) → chọn nhầm $2;5;15;23$ (lẫn 15 là hợp số vào)','khai_niem','{T106030301}',false),
('R59','Bỏ sót 1 số đúng trong danh sách','Liệt kê thiếu 1 số thật sự thuộc nhóm được hỏi — quên chưa xét hết dãy số, thường sót số ở cuối','Đề có $2;5;23;41;47$ đúng đều là nguyên tố → chọn thiếu $2;5;23;41$ (bỏ sót 47)','tinh','{T106030301}',false),
('R60','Đổi chỗ 1 số đúng bằng 1 số sai','Vừa bỏ sót 1 số đúng, vừa lẫn 1 số sai khác vào — kết hợp 2 lỗi cùng lúc','Đề có $2;5;15;23$ (nguyên tố: 2,5,23) → chọn nhầm $5;15;23$ (bỏ 2, lẫn 15)','tinh','{T106030301}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
