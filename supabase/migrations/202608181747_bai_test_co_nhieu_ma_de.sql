-- ============================================================================
-- Thùy chốt: "Nếu có nhiều mã đề thì không cần phải đảo thứ tự câu nữa."
--
-- Lý do: xáo THỨ TỰ câu (seededPermByDang) là biện pháp chống-liếc-bài khi mọi HS
-- CÙNG nội dung câu. Test đã có 3 mã đề khác NỘI DUNG rồi thì xáo thêm thứ tự là
-- thừa — HS cạnh nhau đã không so được câu 1-với-câu-1 vì nội dung khác nhau.
--
-- `bai_test.co_nhieu_ma_de` ghi lại NGAY LÚC PHÁT HÀNH (không suy động lại lúc HS
-- mở bài — snapshot 1 chiều, đúng nguyên tắc spec-test-online). App đọc cờ này để
-- quyết định xáo hay giữ nguyên thứ tự `thu_tu`.
-- ============================================================================

alter table bai_test add column if not exists co_nhieu_ma_de boolean not null default false;
comment on column bai_test.co_nhieu_ma_de is
  'true = ET đã phát hành đủ 3 mã đề (bien_the 1/2/3) — app KHÔNG xáo thứ tự câu nữa, chỉ mã đề tự phân biệt HS.';
