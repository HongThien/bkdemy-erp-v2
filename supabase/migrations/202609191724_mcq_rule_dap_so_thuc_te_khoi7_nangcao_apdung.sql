-- MCQ FORM — mở rộng "sinh nhiễu từ đáp số kho" (R343-346) sang khối 7 Nâng cao (6/10 dạng; loại
-- T107010504/505/506/507 — chứng minh bất đẳng thức/so sánh, đáp số không phải 1 giá trị rời rạc).
-- TÁI DÙNG NGUYÊN `sinhNhieuDapSoThucTe`, chỉ sửa lỗi regex "∈ {...}"/"\in \{...\}" (set notation) bị nuốt
-- nhầm dấu \ đứng trước \} vào group — không rule mới.
update dai_mcq_rule set ap_dung = ap_dung || '{T107010501,T107010502,T107010508,T107010509,T107010511,T107030501}'::text[]
where ma in ('R343', 'R344', 'R345', 'R346') and not ('T107010501' = any(ap_dung));
