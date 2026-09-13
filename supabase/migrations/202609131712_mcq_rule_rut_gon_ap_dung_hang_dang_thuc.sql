-- MCQ FORM — "Rút gọn biểu thức ứng dụng hằng đẳng thức" (T108020601, khối 8, 59 câu) TÁI DÙNG NGUYÊN VẸN
-- hàm `rutGonBieuThuc` + rule R164-R167 đã viết cho T108010501 (DẠNG 21) — test tay 59/59 câu thật khớp
-- 100%, không cần code/rule mới. Chỉ cập nhật `ap_dung` để phản ánh đúng dạng nào đang dùng mỗi rule.
update dai_mcq_rule set ap_dung = ap_dung || '{T108020601}'::text[]
where ma in ('R164', 'R165', 'R166', 'R167') and not ('T108020601' = any(ap_dung));
