-- ============================================================================
-- lop_8s0_khoi_8t
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 15/10 — "8S0 là lớp bình thường nhưng thuộc khối 8T" (đang ghi khối 8). Sai khối làm lớp rơi vào khối 8
--   (bản tin bot tag Phó khối 8, Chấm MT về Phó khối 8, bản đồ/tự luyện theo cây khối 8 thường).
--   Sau khi đổi: khối 8T chưa có Trưởng/Phó trên sơ đồ ⇒ Chấm MT về GV lớp; bản đồ phiêu lưu / tự luyện của lớp đọc cây 8T.
--   hoc_sinh.khoi (lớp học phổ thông của em = 8) KHÔNG đổi.
-- MẤT GÌ (Luật xoá): không xoá gì. Đổi 1 ô lop.khoi '8' → '8T' (lớp a8bf1240-dff3-4b75-9975-c3825b9f7447).
-- ============================================================================
update lop set khoi = '8T', updated_at = now() where id = 'a8bf1240-dff3-4b75-9975-c3825b9f7447' and ten_lop = '8S0' and khoi = '8';
