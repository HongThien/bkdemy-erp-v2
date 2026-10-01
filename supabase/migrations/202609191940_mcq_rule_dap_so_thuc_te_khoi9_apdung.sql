-- MCQ FORM — quét lại khối 9 (19/09) tìm dạng còn thiếu MCQ: mở rộng "sinh nhiễu từ đáp số kho" (R343-346)
-- sang 5 dạng T109010203/020204/080106/080502 (100% khớp) + T109110201 (3/8, phần còn lại là văn bản/word
-- problem đơn vị khác, bỏ theo §1.5). TÁI DÙNG NGUYÊN `sinhNhieuDapSoThucTe`, không rule mới.
update dai_mcq_rule set ap_dung = ap_dung || '{T109010203,T109020204,T109080106,T109080502,T109110201}'::text[]
where ma in ('R343', 'R344', 'R345', 'R346') and not ('T109010203' = any(ap_dung));
