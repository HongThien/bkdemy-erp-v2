-- ============================================================================
-- 202609101516 — gop_dang_phan_tich_da_thuc_nhan_tu
-- ----------------------------------------------------------------------------
-- VÌ SAO: chủ đề "Phân tích đa thức thành nhân tử" (khối 8, dai_ban_do) đang
-- bị tách thành 6 chuyên đề nhỏ theo từng phương pháp (T1080301..T1080306),
-- trong đó lẫn cả dạng "Tìm x". CEO (Thùy) chốt 10/09: gộp 8 dạng thuần phân
-- tích nhân tử về lại 1 chuyên đề T1080301 "Phân tích đa thức thành nhân tử";
-- gộp 3 dạng "tìm x" về T1080306, đổi tên thành "Tìm x ứng dụng phân tích đa
-- thức thành nhân tử". Không đụng T1080503 (chuyên đề "Toán Chuyên" — không
-- phải dạng tìm x, ngoài phạm vi yêu cầu).
--
-- MẤT GÌ: KHÔNG xóa dòng nào. Chỉ UPDATE ma_chuyen_de/ten_chuyen_de trên 7
-- dòng dai_ban_do. 4 chuyên đề T1080302/303/304/305 sau khi gộp sẽ còn 0 dạng
-- trỏ tới — 4 bài lý thuyết riêng (dai_chuyen_de_ly_thuyet) của chúng vẫn NẰM
-- NGUYÊN trong DB (không xóa, tham chiếu text không FK — theo luật chống mất
-- dữ liệu CLAUDE.md §2), nhưng để khỏi mất nội dung giảng dạy khỏi app, đã nối
-- (append) cả 4 bài đó vào cuối bài lý thuyết của T1080301 trước khi gộp dạng.
-- ============================================================================

-- 1) Nối lý thuyết 4 chuyên đề sắp bị gộp vào lý thuyết của T1080301 (giữ
--    nguyên nội dung gốc từng bài, chỉ nối thêm — không sửa/xóa bài nào).
update dai_chuyen_de_ly_thuyet t
set noi_dung = t.noi_dung
    || E'\n\n---\n\n' || (select noi_dung from dai_chuyen_de_ly_thuyet where ma_chuyen_de = 'T1080302')
    || E'\n\n---\n\n' || (select noi_dung from dai_chuyen_de_ly_thuyet where ma_chuyen_de = 'T1080303')
    || E'\n\n---\n\n' || (select noi_dung from dai_chuyen_de_ly_thuyet where ma_chuyen_de = 'T1080304')
    || E'\n\n---\n\n' || (select noi_dung from dai_chuyen_de_ly_thuyet where ma_chuyen_de = 'T1080305'),
    cap_nhat_at = now()
where t.ma_chuyen_de = 'T1080301';

-- 2) Gộp 4 dạng thuần phân tích nhân tử (đang ở T1080302/303/304/305) về
--    T1080301 "Phân tích đa thức thành nhân tử".
update dai_ban_do
set ma_chuyen_de = 'T1080301',
    ten_chuyen_de = 'Phân tích đa thức thành nhân tử'
where ma_dang in ('T108030201', 'T108030301', 'T108030401', 'T108030501');

-- 3) Gộp 2 dạng "Tìm x" (đang ở T1080301, T1080303) về T1080306, đổi tên
--    chuyên đề T1080306 thành "Tìm x ứng dụng phân tích đa thức thành nhân tử".
update dai_ban_do
set ma_chuyen_de = 'T1080306',
    ten_chuyen_de = 'Tìm x ứng dụng phân tích đa thức thành nhân tử'
where ma_dang in ('T108030102', 'T108030302', 'T108030601');
