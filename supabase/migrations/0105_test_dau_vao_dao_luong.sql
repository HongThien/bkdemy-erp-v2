-- 0105 — Test đầu vào: đảo luồng theo BKDEMY_TESTDAUVAO_SPEC_ADDENDUM.md (Thùy 07-19, PLAN.md duyệt).
--
-- 1) Bỏ hẳn `de_test` (con trỏ "đề đang dùng của khối×môn") — model mới: Ops chọn thẳng 1 tài liệu MT
--    từ Kho ngay lúc điểm danh (dropdown lọc theo mon + khối của ứng viên, KHÔNG qua lớp trung gian
--    "active/khối×môn" nữa — đổi được bất kỳ lúc nào tại phòng). `ca_test.de_test_id` đổi thành trỏ
--    THẲNG `tai_lieu_id`. Đã xác nhận với Thùy: de_test hiện chỉ có 2 dòng, ca_test 4 dòng — TẤT CẢ
--    de_test_id đang NULL (chưa ai gán thật) → không có dữ liệu thật bị mất khi drop.
alter table ca_test add column if not exists tai_lieu_id uuid references tai_lieu(id);
alter table ca_test drop column if exists de_test_id;
drop table if exists de_test;

-- 2) Task mới "Scan bài đã chấm" (Ops, độc lập với Chấm) — cột file scan-đã-chấm, KHÁC bai_url (bài
--    chưa chấm, ghi ở Điểm danh). Không cần cờ *_xong_at riêng — có giá trị = xong (anti-NULL).
alter table ca_test add column if not exists bai_da_cham_url text;
