-- ============================================================================
-- 202609281044 — tra_sua_nhan_5
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 28/09): tỉ lệ trà sữa gốc (Nhất 0,1% · Nhì 0,05% · Giải 3 0,01%) ⇒ cả trung tâm ~1 ly / 2 tháng, HS gần như
--   không bao giờ thấy ai trúng. Thùy: "nhân 5 tỉ lệ trà sữa lên là đẹp" ⇒ Nhất 0,5% · Nhì 0,25% · Giải 3 0,05%.
--   Chỉ đổi DỮ LIỆU bảng game_lop_qua_dac_biet (mig 202609281021) — hàm rút không đổi.
-- MẤT GÌ (Luật xoá): KHÔNG. Update 3 dòng số; giá trị cũ ghi ở trên.
-- ============================================================================
update game_lop_qua_dac_biet set ti_le_pt = case giai when 1 then 0.5 when 2 then 0.25 when 3 then 0.05 end
 where qua = 'tra_sua';
