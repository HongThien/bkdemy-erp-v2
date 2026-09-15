-- ============================================================================
-- 202609101721 — gop_chuyen_de_ptmp_hgt_12
-- ----------------------------------------------------------------------------
-- VÌ SAO: bản đồ kiến thức Hình giải tích khối 12 (hgt_ban_do), chuyên đề
-- "Phương trình Mặt phẳng" (T3120101) — CEO (Thùy) chốt 10/09:
--   1) T312010109 (vuông góc MP cho trước), T312010108 (MP trung trực),
--      T312010104 (song song MP cho trước) là biến thể của cùng 1 kỹ năng
--      "viết phương trình mặt phẳng" — gộp cả 3 vào dạng T312010102.
--   2) T312010105 (khoảng cách điểm-mặt phẳng) thực ra thuộc chuyên đề
--      T3120105 "Khoảng cách trong không gian Oxyz" — chuyển sang đó.
--   3) T312010106 (vị trí tương đối 2 mặt phẳng) thuộc chuyên đề T3120107
--      "Vị trí tương đối" (đã có sẵn) — chuyển sang đó.
--
-- MẤT GÌ (Luật xoá — đã xin phép CEO 10/09 qua chat trước khi chạy):
--   - XÓA 3 dòng hgt_ban_do: T312010109, T312010108, T312010104 (dạng không
--     còn tồn tại độc lập sau khi gộp). Trước khi xóa đã re-point HẾT nơi
--     tham chiếu (25 câu hgt_cau_hoi, 8 lượt đo gami_session_problems, 31 câu
--     trong đề bai_test_cau) sang T312010102 — không dữ liệu đo lường nào bị
--     mất, chỉ đổi mã dạng.
--   - XÓA 2 dòng hgt_dang_ly_thuyet (T312010109, T312010108) — nội dung ĐÃ
--     được nối (append) vào lý thuyết của T312010102 trước khi xóa, không mất
--     nội dung giảng dạy. T312010104 không có lý thuyết riêng.
--   - T312010105, T312010106: KHÔNG xóa gì, chỉ đổi ma_chuyen_de/ten_chuyen_de.
-- ============================================================================

-- 1) Nối lý thuyết T312010109, T312010108 vào lý thuyết T312010102 (giữ
--    nguyên nội dung gốc, chỉ nối thêm).
update hgt_dang_ly_thuyet t
set noi_dung = t.noi_dung
    || E'\n\n---\n\n' || (select noi_dung from hgt_dang_ly_thuyet where ma_dang = 'T312010109')
    || E'\n\n---\n\n' || (select noi_dung from hgt_dang_ly_thuyet where ma_dang = 'T312010108'),
    cap_nhat_at = now()
where t.ma_dang = 'T312010102';

-- 2) Re-point mọi tham chiếu tới 3 dạng sắp gộp, sang T312010102.
update hgt_cau_hoi
set dang_chinh = 'T312010102'
where dang_chinh in ('T312010109', 'T312010108', 'T312010104');

update gami_session_problems
set ma_dang = 'T312010102'
where ma_dang in ('T312010109', 'T312010108', 'T312010104');

update bai_test_cau
set ma_dang = 'T312010102'
where ma_dang in ('T312010109', 'T312010108', 'T312010104');

-- 3) Xóa lý thuyết riêng (đã nối vào bước 1) và xóa 3 dòng dạng đã gộp.
delete from hgt_dang_ly_thuyet
where ma_dang in ('T312010109', 'T312010108');

delete from hgt_ban_do
where ma_dang in ('T312010109', 'T312010108', 'T312010104');

-- 4) Chuyển T312010105 sang chuyên đề "Khoảng cách trong không gian Oxyz".
update hgt_ban_do
set ma_chuyen_de = 'T3120105',
    ten_chuyen_de = 'Khoảng cách trong không gian Oxyz'
where ma_dang = 'T312010105';

-- 5) Chuyển T312010106 sang chuyên đề "Vị trí tương đối".
update hgt_ban_do
set ma_chuyen_de = 'T3120107',
    ten_chuyen_de = 'Vị trí tương đối'
where ma_dang = 'T312010106';
