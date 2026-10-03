-- MCQ FORM — khối 9 Đại: dạng mới T109030305 (100% khớp sinhNhieuDapSoThucTe, khảo sát 01/10). CHỈ UPDATE
-- ap_dung nối vào R343-346 có sẵn, không rule mới. (T109030302/303/304 ĐÃ wire từ trước 20/09 — chỉ khớp
-- thêm câu sau khi mở rộng hỗ trợ set trần "{...}" trong mini-dang.mjs, không cần ap_dung mới cho chúng.)
update dai_mcq_rule set ap_dung = ap_dung || '{T109030305}'::text[]
where ma in ('R343', 'R344', 'R345', 'R346') and not ('T109030305' = any(ap_dung));
