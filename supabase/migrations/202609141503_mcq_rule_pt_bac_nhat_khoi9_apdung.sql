-- MCQ FORM — "Phương trình bậc nhất một ẩn dạng cơ bản" (T109020101, KHỐI 9, dạng ĐẦU TIÊN của khối 9,
-- 51/51 câu) TÁI DÙNG NGUYÊN VẸN `timXQuaRutGon` + rule R168-R171/R263 đã viết cho T108010503/T108020602
-- (khối 8) — test tay 51/51 câu thật khớp 100%, không cần code/rule mới. Chỉ cập nhật `ap_dung`.
update dai_mcq_rule set ap_dung = ap_dung || '{T109020101}'::text[]
where ma in ('R168', 'R169', 'R170', 'R171', 'R263') and not ('T109020101' = any(ap_dung));
