-- ============================================================================
-- 202610100831 — hinh_hoc_dang_cho_khoi_8
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 10/10: giải chi tiết bộ đề giữa kì 1 Toán 8 (40 đề) theo dây chuyền của khối 6 (kho-rules/dai/k6.md → k8.md §10).
--   Câu HÌNH của đề lớp 8 (tứ giác, hình bình hành…) là hình phẳng THCS ⇒ vào KHO HÌNH HỌC `hinh_hoc_cau_hoi`
--   (Thùy 09/10: "HGT là lượng giác, hình phẳng là Hình học"), nằm ở DẠNG CHỜ, CEO xếp vào bài sau (giải ≠ gán dạng).
--   Kho Hình học: dạng = bài ⇒ cần một bài chờ `HH08000000`, đúng quy ước `_kho_dang_cho('hinh_hoc','8')` (mig 202610021414
--   đã làm cho khối 11). Trigger chặn duyệt câu dạng chờ trên `hinh_hoc_cau_hoi` đã có từ mig đó.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không. Thêm 1 dòng `hinh_hoc_bai`.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

-- (ma_dang / ten_dang của hinh_hoc_bai là cột SINH từ ma_bai / ten_bai — không chèn tay)
insert into public.hinh_hoc_bai (ma_bai, khoi, ten_bai, thu_tu, da_duyet)
values ('HH08000000', '8', 'Chưa phân dạng — Hình học 8', 0, false)
on conflict (ma_bai) do nothing;
