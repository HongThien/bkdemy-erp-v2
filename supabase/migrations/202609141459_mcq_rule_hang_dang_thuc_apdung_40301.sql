-- MCQ FORM — "Hằng đẳng thức" (T108040301, khối 8, ôn tập tổng hợp, 3 câu) TÁI DÙNG NGUYÊN VẸN hàm
-- `vietThanhTichHieuBinhPhuong` + rule R225-R233 đã viết cho T108020401 (DẠNG 32) — test tay 3/3 câu thật
-- khớp 100%, không cần code/rule mới. Chỉ cập nhật `ap_dung` để phản ánh đúng dạng nào đang dùng mỗi rule.
update dai_mcq_rule set ap_dung = ap_dung || '{T108040301}'::text[]
where ma in ('R225', 'R226', 'R227', 'R228', 'R229', 'R230', 'R231', 'R232', 'R233') and not ('T108040301' = any(ap_dung));
