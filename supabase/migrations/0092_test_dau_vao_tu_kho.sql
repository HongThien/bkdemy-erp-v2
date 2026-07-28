-- 0092 — Test đầu vào: đề lấy từ Kho tài liệu (đảo quyết định 0090 "KHÔNG tái dùng tai_lieu").
-- Thùy chốt: đề test đầu vào = CHỌN 1 tài liệu CÓ SẴN trong Kho (thường MT, không giới hạn loai) —
-- tự load đủ cấu trúc câu, thay vì gõ tay từng câu. de_test = con trỏ mỏng "đề đang dùng của
-- khối×môn" → tai_lieu_id; đổi đề = tạo dòng de_test mới trỏ tài liệu khác + tắt active dòng cũ
-- (giữ lịch sử §4). Gán vào ca_test vẫn SNAPSHOT đầy đủ câu vào ca_test_cau (§A.2 anti-live-ref,
-- mirror bai_test_cau) — đổi đề đang dùng sau này không hỏng bài đã chấm.
-- de_test/de_test_cau CHƯA có dữ liệu thật (Thùy xác nhận 07-xx) → an toàn đổi schema thẳng.

alter table de_test add column if not exists tai_lieu_id uuid references tai_lieu(id);

-- Câu giờ sống trong Kho (tai_lieu_cau/dai_cau_hoi/khtn_cau_hoi) — de_test_cau (câu gõ tay) hết cần.
drop table if exists de_test_cau cascade;

-- ca_test_cau: từ flat (nhan/dap_an gõ tay) → SNAPSHOT ĐẦY ĐỦ câu thật (mirror bai_test_cau).
alter table ca_test_cau drop column if exists de_test_cau_id;
alter table ca_test_cau drop column if exists nhan;
alter table ca_test_cau add column if not exists ma_cau     text;
alter table ca_test_cau add column if not exists loai_cau   text;
alter table ca_test_cau add column if not exists noi_dung   text;
alter table ca_test_cau add column if not exists lua_chon   jsonb;
alter table ca_test_cau add column if not exists menh_de    jsonb;
alter table ca_test_cau add column if not exists loi_giai   text;
alter table ca_test_cau add column if not exists anh_de     text;
alter table ca_test_cau add column if not exists anh_dap_an text;
-- dap_an (text) / ma_dang / diem_toi_da / thu_tu: GIỮ NGUYÊN cột cũ, ý nghĩa không đổi.

-- Luôn đúng 1 đề "đang dùng" / khối×môn (đúng ý "luôn có 1 đề test đầu vào").
create unique index if not exists uq_de_test_active_khoi_mon on de_test(khoi, mon) where active;

-- Bảng trống thật (chưa ai tạo đề) → set NOT NULL thẳng, không cần path tương thích ngược.
alter table de_test alter column tai_lieu_id set not null;
