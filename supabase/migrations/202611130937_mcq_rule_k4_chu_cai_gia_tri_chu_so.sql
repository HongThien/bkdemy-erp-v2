-- Lớp 4 (MCQ vòng 2): rule cho tính chất giao hoán/kết hợp điền chữ (NDB01767/01768) và giá trị chữ số (NDB01759). Mã R490–R494. Chỉ INSERT.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong, active) values
 ('R490', 'Điền chữ: điền số thay cho chữ', 'Chỗ cần điền là một chữ (biến) nhưng điền một số có sẵn trong biểu thức.', 'a + 5 = 5 + … → điền 5', 'khai_niem', array['NDB01767', 'NDB01768']::text[], false, true),
 ('R491', 'Điền chữ: điền chữ không có trong biểu thức', 'Điền một chữ lạ, không xuất hiện ở vế còn lại, do không đối chiếu hai vế.', 'a + 5 = 5 + … → điền k', 'khai_niem', array['NDB01767', 'NDB01768']::text[], false, true),
 ('R492', 'Điền chữ: điền cả cụm thay vì một chữ', 'Điền cả một biểu thức/cụm (chữ kèm số) vào chỗ chỉ cần một chữ.', 'a + 5 = 5 + … → điền a + 5', 'khai_niem', array['NDB01767', 'NDB01768']::text[], false, true),
 ('R493', 'Điền chữ: lặp lại chữ đã đứng ngoài ngoặc', 'Với a + b + c = a + (… + c), điền lại chữ a đứng ngoài ngoặc thay vì chữ b.', 'a + b + 7 = a + (… + 7) → điền a', 'khai_niem', array['NDB01768']::text[], false, true),
 ('R494', 'Giá trị chữ số: chỉ viết chữ số, quên nhân với giá trị hàng', 'Trả lời bằng chính chữ số (hoặc giá trị lệch bậc) thay vì chữ số nhân với giá trị của hàng.', 'Giá trị của chữ số 6 trong 68 192 453 → 6', 'khai_niem', array['NDB01759']::text[], false, true)
on conflict (ma) do nothing;
