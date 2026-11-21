-- MCQ lớp 6 (mẫu mù 21/11): làm rõ R519 — bản rút gọn của ĐÁP ÁN ĐÚNG nhân ƯCLN ra đúng đáp án nên lộ ở mọi câu.
-- R519 nay chỉ áp lên danh sách đã sai (kèm lỗi thừa cặp có ước chung hoặc thiếu cặp), không bao giờ lên danh sách đúng. Chỉ UPDATE mô tả.
update dai_mcq_rule set
  mo_ta = 'Lập danh sách các cặp (a''; b'') (đã sai thêm: thừa cặp có ước chung hoặc thiếu cặp) rồi ghi luôn làm đáp số, quên nhân lại ƯCLN: a = d·a'', b = d·b''.',
  vi_du = 'ƯCLN = 4, BCNN = 144: ghi (1;36), (36;1), (2;18), (18;2) — quên nhân 4 và còn thừa cặp (2;18)'
where ma = 'R519';
