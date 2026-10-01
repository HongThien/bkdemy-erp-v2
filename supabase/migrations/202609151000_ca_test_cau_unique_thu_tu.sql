-- ============================================================================
-- ca_test_cau: UNIQUE (ca_test_id, thu_tu) — lưới an toàn cuối chống gấp đôi câu.
-- ----------------------------------------------------------------------------
-- VÌ SAO (15/09): 14/09 phát hiện 2 ca có 2 bộ câu (34→68, 39→78) do gán đề 2 lần song song (client 3 bước rời +
--   StrictMode). Đã chuyển gán đề sang RPC có khoá (mig 202609150910) và CEO đã xoá 2 bộ trùng (15/09). Index này
--   đảm bảo DB TỰ CHẶN nếu còn đường nào khác chèn trùng — lỗi lộ ngay lúc ghi thay vì âm thầm lệch ở khâu chấm.
-- Tiền điều kiện: bảng không còn cặp (ca_test_id, thu_tu) trùng — đã kiểm 15/09 = 0.
-- MẤT GÌ (Luật xoá): không. Chỉ tạo index.
-- ============================================================================
create unique index if not exists ca_test_cau_ca_thu_tu_uniq on public.ca_test_cau (ca_test_id, thu_tu);
