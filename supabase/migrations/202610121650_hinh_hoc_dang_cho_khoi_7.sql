-- ============================================================================
-- 202610121650 — hinh_hoc_dang_cho_khoi_7
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 10–12/10: bộ đề giữa kì 1 + đề cương Toán 7 (KNTT) theo dây chuyền khối 6/8 (kho-rules/dai/k7.md).
--   Câu HÌNH của lớp 7 (góc, đường thẳng song song, tam giác) là hình phẳng THCS ⇒ vào kho Hình học `hinh_hoc_cau_hoi`
--   (Thùy 09/10: "HGT là lượng giác, hình phẳng là Hình học"; 10/10: "Hình 7 sẽ đưa vào phần Hình - Luyện, t chưa build xong,
--   m cứ để tạm trên DB"), nằm ở DẠNG CHỜ, CEO xếp vào bài sau (giải ≠ gán dạng).
--   Kho Hình học: dạng = bài ⇒ cần một bài chờ `HH07000000`, đúng quy ước `_kho_dang_cho('hinh_hoc','7')`
--   (cùng mẫu mig 202610100831 cho khối 8, 202610021414 cho khối 11).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không. Thêm 1 dòng `hinh_hoc_bai`.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

-- (ma_dang / ten_dang của hinh_hoc_bai là cột SINH từ ma_bai / ten_bai — không chèn tay)
insert into public.hinh_hoc_bai (ma_bai, khoi, ten_bai, thu_tu, da_duyet)
values ('HH07000000', '7', 'Chưa phân dạng — Hình học 7', 0, false)
on conflict (ma_bai) do nothing;
