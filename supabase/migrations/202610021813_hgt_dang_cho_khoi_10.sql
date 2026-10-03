-- ============================================================================
-- hgt_dang_cho_khoi_10
-- ----------------------------------------------------------------------------
-- Nhập 53 đề giữa kì lớp 10 (Noctorium, CEO 02/10 "làm nốt, output như 11, 12"): câu VÉC TƠ khối 10 vào kho Hình giải tích.
-- Bản đồ `hgt_ban_do` khối 10 mới có 4 dạng véc tơ (khái niệm · tổng hiệu · độ dài · thực tế); câu thuộc bài 9, 11 (tích với một số,
-- tích vô hướng) và câu Đúng/Sai trộn ý chưa có dạng ⇒ cần DẠNG CHỜ khối 10 của kho này (đã có cho khối 6, 9, 12 — cùng khuôn).
-- Mã = _kho_dang_cho('hgt', '10') = T310000000.
-- MẤT GÌ: không. Thêm 1 dòng bản đồ.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================
insert into public.hgt_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
select 'T310000000', '10', 'T31000', 'Chưa phân dạng', 'T3100000', 'Chưa phân dạng', 'Chưa phân dạng', b.muc_do, b.bac_toi_thieu, b.mo_ta_ngan
  from public.hgt_ban_do b where b.ma_dang = 'T312000000'
on conflict (ma_dang) do nothing;
