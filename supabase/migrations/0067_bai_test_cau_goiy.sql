-- 0067 — bai_test_cau snapshot DẠNG + LÝ THUYẾT dạng (nút "Gợi ý" cho HS xem lý thuyết).
-- HS KHÔNG đọc được kho (dai_dang_ly_thuyet member-gate) → phải snapshot vào bai_test (self-contained).
alter table bai_test_cau add column if not exists ma_dang   text;  -- dạng của câu (dang_chinh) — truy vết + gợi ý
alter table bai_test_cau add column if not exists ly_thuyet text;  -- snapshot lý thuyết dạng (null = dạng chưa có LT → ẩn nút)
