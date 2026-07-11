-- 0093 — BT (tài liệu bổ trợ, gán theo HỌC SINH, KHÔNG theo lớp).
-- Thùy chốt: BT là 1 loại tài liệu riêng (loai='bo_tro') soạn RIÊNG cho 1 học sinh cụ thể (câu chọn
-- theo dạng yếu của chính HS đó, xem getMasteryHS), KHÔNG gắn lớp như ET/MT/Giáo trình. Vẫn dùng
-- chung bảng tai_lieu + tai_lieu_phan/tai_lieu_cau (tái dùng cỗ máy phần/câu/in PDF có sẵn) — chỉ
-- tách RIÊNG màn hình (BT không hiện trong Kho tài liệu chung, dễ tìm hơn khi danh sách dài).
alter table tai_lieu add column if not exists hoc_sinh_id uuid references hoc_sinh(id);
