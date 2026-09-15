-- MCQ FORM — "Giải bất phương trình quy về bất phương trình bậc nhất — dạng phân thức" (T109020203, khối 9,
-- 18/18 câu). Tên dạng gây hiểu nhầm là "mẫu chứa biến" — khảo sát thực tế cho thấy mẫu số LUÔN là HẰNG SỐ
-- (hệ số phân số, vd "(x-1)/(-3)"), TÁI DÙNG NGUYÊN `giaiBptBacNhat` sau khi sửa `parseHangTuBieuThuc` hỗ trợ
-- "\dfrac{tử NHIỀU HẠNG}{mẫu số}" (trước đó chỉ hỗ trợ tử là 1 đơn thức) — không rule mới.
update dai_mcq_rule set ap_dung = ap_dung || '{T109020203}'::text[]
where ma in ('R305', 'R306', 'R307', 'R308', 'R309') and not ('T109020203' = any(ap_dung));
