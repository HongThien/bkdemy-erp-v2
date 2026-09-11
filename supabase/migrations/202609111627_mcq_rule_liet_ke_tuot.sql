-- MCQ FORM — thêm R61 cho "Nhận biết Số nguyên tố / Hợp số" (T106030301). Chạy pipeline thật với R57-R60
-- (mig 202609111625) chỉ sinh được 52/60 câu — 8 câu bỏ vì đáp án đúng chỉ có 1 số và đề không có 0/1, nên
-- R57+R59 không áp dụng được, chỉ còn 2 rule (R58, R60) < 3 cần thiết. Thêm rule dự phòng thứ 5 (không phụ
-- thuộc số lượng đáp án đúng) để cứu các câu này.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R61','Liệt kê tuốt cả danh sách, không lọc','HS chép lại toàn bộ dãy số trong đề, không phân loại nguyên tố/hợp số gì cả — quên lọc. Rule dự phòng, cứu các câu đáp án đúng chỉ có 1 số (R57/R59 không áp dụng được)','Đề có $5;10;22;26;34;35;42$ (nguyên tố: 5) → chọn nhầm cả $5;10;22;26;34;35;42$','tinh','{T106030301}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
