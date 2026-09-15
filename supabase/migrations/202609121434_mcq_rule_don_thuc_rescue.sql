-- MCQ FORM — thêm R116/R118/R119 (rule dự phòng) cho T108010103. Chạy thật 3 sub-shape (hệ số/phần biến/hệ
-- số cao nhất) chỉ 41/66 (62%) — nhiều câu KHÔNG có (…)^n trong đề nên các rule "quên luỹ thừa/quên phân
-- phối" (R93/94/109/112/114) không áp dụng được, chỉ còn 2 rule < 3 cần thiết. Thêm 3 rule không phụ thuộc
-- việc đề có ngoặc hay không.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R116','Nhầm số mũ biến đầu tiên là hệ số','Sai khái niệm hoàn toàn — lấy SỐ MŨ của biến đầu tiên trong đơn thức làm hệ số, thay vì hệ số thật','$-x^2.y$ hệ số đúng=-1 → nhầm lấy số mũ 2 của x làm hệ số','khai_niem','{T108010103}',false),
('R118','Hoán đổi nhầm số mũ giữa 2 biến','Tính đúng các số mũ nhưng gán nhầm — hoán đổi số mũ của 2 biến cho nhau khi viết phần biến','$x^3y^2$ → nhầm viết thành $x^2y^3$','tinh','{T108010103}',false),
('R119','Lấy hệ số hạng tử đầu tiên viết trong đề','Tìm hệ số cao nhất nhưng không sắp xếp theo bậc, cứ lấy hệ số của hạng tử ĐẦU TIÊN như đề viết','$5-3x+2x^2-6x^4$ hệ số cao nhất đúng=-6 (của $-6x^4$) → nhầm lấy hệ số 5 (hạng tử đầu tiên)','khai_niem','{T108010103}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
