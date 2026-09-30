-- Điểm HS ĐẠT ĐƯỢC cho 1 câu MT (khác `points` — points là điểm Elo derive từ Đ/C/S; diem_dat là điểm
-- người chấm cho, VD câu 1đ thì HS được 0.75đ nếu C mà GV cho ¾). Dropdown 0.25 → điểm tối đa của câu
-- (điểm tối đa lưu ở tai_lieu.cau_hinh.diemByCau[ma_cau], client tự bound).
-- Auto điền theo Đ/C/S nếu chưa có (Đ=full, C=½, S=0), user chỉnh được. NULL với phase khác 'mt'.
alter table gami_grades add column if not exists diem_dat numeric;
