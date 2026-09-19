-- MCQ FORM — 4 rule cho sub-shape THỨ HAI của T108020103: "$9x^2-.....+25=(...)^2$" (thiếu HẠNG TỬ GIỮA,
-- dấu +/- đã cho sẵn trong đề). 63/84 câu của dạng này thuộc sub-shape này (nhiều hơn sub-shape đầu 21 câu).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R192','Hoàn thiện bình phương (giữa): quên nhân 2','Khi tìm hạng tử giữa, quên nhân với 2 — chỉ tính √A·√C thay vì 2·√A·√C','$9x^2+.....+25=(3x+5)^2$ đúng hạng giữa=30x → nhầm ra 15x (thiếu nhân 2)','khai_niem','{T108020103}',false),
('R193','Hoàn thiện bình phương (giữa): nhầm dấu hạng tự do','Tìm đúng hạng tử giữa nhưng nhầm dấu của hạng tự do trong nhị thức','Đúng nhị thức $3x-5$ → nhầm ra $3x+5$','khai_niem','{T108020103}',false),
('R194','Hoàn thiện bình phương (giữa): quên căn A','Khi tìm hạng tử giữa, quên lấy căn bậc hai của hệ số bậc 2, dùng thẳng hệ số A','$9x^2+.....+25$ đúng hạng giữa=30x (2·3·5) → nhầm ra 90x (2·9·5, dùng thẳng A=9 thay vì √A=3)','khai_niem','{T108020103}',false),
('R195','Hoàn thiện bình phương (giữa): lệch 1 đơn vị','Rule dự phòng — tìm đúng cấu trúc nhưng hạng tử giữa cần điền lệch 1 đơn vị','Đúng=30x → nhầm ra 31x','tinh','{T108020103}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
