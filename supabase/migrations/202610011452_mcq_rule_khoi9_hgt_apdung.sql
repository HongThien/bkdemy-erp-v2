-- MCQ FORM — khối 9 Hình giải tích (HGT), 6 dạng khớp sinhNhieuDapSoThucTe (khảo sát 01/10): T309010103
-- (100%), T309010105 (100%), T309010402 (86%), T309010301 (73%), T309010401 (62%), T309010102 (24%, phần
-- còn lại là đáp số lẫn căn thức, bỏ tự nhiên). CHỈ UPDATE ap_dung nối vào R343-346 có sẵn (bảng hgt_mcq_rule
-- riêng, KHÔNG rule mới).
update hgt_mcq_rule set ap_dung = ap_dung || '{T309010103,T309010105,T309010402,T309010301,T309010401,T309010102}'::text[]
where ma in ('R343', 'R344', 'R345', 'R346') and not ('T309010103' = any(ap_dung));
