-- Điểm MT (BK sát hạch) = ĐIỂM CƠ BẢN + ĐIỂM NÂNG CAO (GV nhập thẳng 2 số, hệ cộng).
-- Trần: tổng ≥ 10 → lưu diem = 9.75. "Full điểm" (tick) → 10. `diem` (thang-10) = kết quả đã áp trần.
-- Lưu tách thành phần để MỞ LẠI sửa được (thi trường vẫn chỉ dùng `diem`, 3 cột này null).
alter table diem_thi add column if not exists diem_co_ban   numeric;   -- điểm phần cơ bản
alter table diem_thi add column if not exists diem_nang_cao numeric;   -- điểm phần nâng cao
alter table diem_thi add column if not exists full_diem      boolean not null default false; -- tick = 10 trọn vẹn
