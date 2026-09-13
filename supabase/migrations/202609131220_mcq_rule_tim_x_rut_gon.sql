-- MCQ FORM — 4 rule cho "Tìm x ứng dụng rút gọn biểu thức" (T108010503, khối 8, 41 câu). Đáp số là 1 GIÁ TRỊ
-- HỮU TỈ — SPECIAL_DANG (không qua TEXT_DANG), tái dùng nguyên vế trái từ DẠNG 21 rồi giải phương trình bậc nhất.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R168','Quên đổi dấu khi chuyển vế','Chuyển hằng số từ vế trái sang vế phải mà QUÊN đổi dấu','$4x-3=4$ đúng ⇒ $4x=7$ → nhầm $4x=1$ (cộng thay vì trừ khi chuyển vế)','khai_niem','{T108010503}',false),
('R169','Chỉ nhân hạng tử đầu, quên phân phối hết','Khi rút gọn vế trái, trong mỗi cặp ngoặc chỉ nhân với hạng tử ĐẦU của ngoặc thứ hai, quên phân phối hết','Rút gọn sai vế trái trước khi giải x, dẫn tới nghiệm sai hoàn toàn','khai_niem','{T108010503}',false),
('R170','Quên chia hệ số của x','Chuyển vế đúng nhưng QUÊN chia cho hệ số của x, coi hệ số x luôn bằng 1','$4x=7$ đúng ⇒ $x=7/4$ → nhầm $x=7$','khai_niem','{T108010503}',false),
('R171','Tìm x rút gọn: lệch nghiệm 1 đơn vị','Rule dự phòng — tính đúng cách giải nhưng nghiệm x lệch 1 đơn vị so với đúng','Đúng $x=7/4$ → nhầm ra $x=11/4$','tinh','{T108010503}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
