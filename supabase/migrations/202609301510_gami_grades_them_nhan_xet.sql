-- Thêm cột `nhan_xet` (nhận xét lời văn của GV) cho gami_grades.
-- Dùng cho luồng CHẤM CHI TIẾT MT (per-HS-per-câu, Kết quả học tập › Điểm thi › Chấm chi tiết):
-- điểm/DCS/lỗi đã có sẵn, thêm chỗ để GV viết nhận xét cho từng câu (ngoài mã lỗi `loi` là chọn cứng).
-- Chấm ET/BTVN không viết nhận xét ở đây (đã có buoi_danh_gia.nhan_xet cho cả buổi) — cột nullable,
-- không ảnh hưởng row cũ.
alter table gami_grades add column if not exists nhan_xet text;
