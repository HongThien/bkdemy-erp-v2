-- ============================================================================
-- 202609281052 — tra_sua_gap_doi
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 28/09): sau khi ×5 (mig 202609281044: 0,5 / 0,25 / 0,05 %) ≈ 3,5 ly/tháng toàn trung tâm (300 buổi, lớp 10 bạn)
--   — Thùy: "gấp đôi phát nữa, jackpot thì phải khó" ⇒ Nhất 1% · Nhì 0,5% · Giải 3 0,1% ≈ 7 ly/tháng, mỗi lớp ~1,5 năm 1 lần.
--   Chỉ đổi DỮ LIỆU bảng game_lop_qua_dac_biet — hàm rút không đổi.
-- MẤT GÌ (Luật xoá): KHÔNG. Update 3 dòng số; giá trị cũ ghi ở trên.
-- ============================================================================
update game_lop_qua_dac_biet set ti_le_pt = case giai when 1 then 1 when 2 then 0.5 when 3 then 0.1 end
 where qua = 'tra_sua';
