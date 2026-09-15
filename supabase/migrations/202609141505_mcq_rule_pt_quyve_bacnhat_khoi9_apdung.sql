-- MCQ FORM — "Phương trình quy về phương trình bậc nhất một ẩn - Dạng đa thức" (T109020102, khối 9, 17/18
-- câu) TÁI DÙNG NGUYÊN VẸN `timXQuaRutGon` + rule R168-R171/R263 — test tay khớp, 1 câu residual dungX=0
-- (hangSo=0 khiến mọi rule nhân/chia hệ số trùng 0, chỉ còn R171/R263) chấp nhận bỏ theo §1.5.
update dai_mcq_rule set ap_dung = ap_dung || '{T109020102}'::text[]
where ma in ('R168', 'R169', 'R170', 'R171', 'R263') and not ('T109020102' = any(ap_dung));
