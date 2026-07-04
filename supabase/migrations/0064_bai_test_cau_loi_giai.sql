-- 0064 — bai_test_cau snapshot thêm LỜI GIẢI (để reveal "đáp án chi tiết" sau khi HS xác nhận câu).
-- Thùy: chọn đáp án → bấm Xác nhận → hiện đáp án + lời giải chi tiết của câu đó.
-- ⚠ HS đọc được cột này (bai_test_cau_hs_read). BTVN reveal-ngay → OK. ET (nộp-1-lần)
--   PHẢI chấm qua RPC + view ẩn key/lời giải (nợ slice ET), đừng để HS đọc trước khi nộp.
alter table bai_test_cau add column if not exists loi_giai   text;
alter table bai_test_cau add column if not exists anh_dap_an text;
