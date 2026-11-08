-- ============================================================================
-- 202611051457 — hsta_gay_tru_50
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 — "1 gậy đang trừ quá ít dẫn đến hiệu suất quá cao. Bây giờ 1 gậy trừ 50% kết quả của
--   task đó thay vì 15%." Điểm task (fn_hsta_task) = 100 − trừ tiến độ (gậy Chậm deadline, theo phút trễ)
--   − số gậy khác × _hsta_tru_moi_gay(), sàn 0. Chỉ đổi hằng số 15 → 50 ⇒ 2 gậy chất lượng = 0 điểm task.
--   Gậy Chậm deadline vẫn theo thang −10/−20/−30/−40 (_hsta_tru_tien_do) — chưa đổi.
--   hsta_chot đang rỗng (05/11) ⇒ không có tháng nào đã chốt bị lệch; tháng 10 & 11 tính lại theo mức mới.
--
-- MẤT GÌ (Luật xoá): không có.
-- ============================================================================

create or replace function public._hsta_tru_moi_gay() returns integer language sql immutable as $$ select 50 $$;
