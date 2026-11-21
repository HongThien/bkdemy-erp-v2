-- ============================================================================
-- 202611210913 — hinh_hoc_dang_cho_khoi_6
-- ----------------------------------------------------------------------------
-- VÌ SAO: CTO phân xử 15/11 (spec-giai-bai.md › Khối 6 › Phân kho): câu Hình K6 (đề thi, đề cương) vào kho Hình học `hinh_hoc_cau_hoi`,
--   không vào `hgt`. Nợ code §C10 mục 9: cổng `--khoi 6` chưa nhận hinh_hoc + K6 chưa có bài chờ ⇒ ghi.mjs báo
--   "dang_chinh không có trong hinh_hoc_ban_do: HH06000000" (gặp 21/11 khi ghi lô mẫu giữa kì II K6, Ch VIII: điểm – đường thẳng – đoạn thẳng – trung điểm).
--   Kho Hình học: dạng = bài ⇒ cần một bài chờ `HH06000000`, đúng quy ước `_kho_dang_cho('hinh_hoc','6')`
--   (cùng mẫu mig 202610100831 khối 8, 202610121650 khối 7).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không. Thêm 1 dòng `hinh_hoc_bai`.
-- ============================================================================

-- (ma_dang / ten_dang của hinh_hoc_bai là cột SINH từ ma_bai / ten_bai — không chèn tay)
insert into public.hinh_hoc_bai (ma_bai, khoi, ten_bai, thu_tu, da_duyet)
values ('HH06000000', '6', 'Chưa phân dạng — Hình học 6', 0, false)
on conflict (ma_bai) do nothing;
