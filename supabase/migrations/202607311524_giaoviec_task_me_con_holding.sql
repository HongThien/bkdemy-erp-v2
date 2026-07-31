-- ============================================================================
-- 202607311524 — GIAO VIỆC: task MẸ/CON + trạng thái HOLDING, bỏ HẠNG MỤC
-- ----------------------------------------------------------------------------
-- VÌ SAO: CEO chốt lại UX 07-31 (2): Weekly Planning = bảng task 2 tầng (task mẹ
--   to → tách task con cho từng người). "Hạng mục/burn-up" chỉ là 1 ca nhỏ — thay
--   bằng task mẹ/con cho tổng quát. Triage idea: Backlog · Holding · Hủy.
--
-- MẤT GÌ (Luật xoá — CEO chỉ đạo thay hạng mục bằng task mẹ/con; 3 bảng RỖNG 07-31):
--   · Bảng `hang_muc` (0 dòng) + cột `viec.hang_muc_id`, `y_tuong.hang_muc_id`.
--   Burn-up/so_lat_da_ra là DERIVE ở TS (xoá ở data layer, không phải DB).
-- THÊM: `viec.task_me_id` (self-FK, cây 2 tầng), `viec.nguoi_lam_id` NULLABLE
--   (task mẹ có thể chưa/không gán 1 người — con mới là đơn vị 1-người); y_tuong
--   thêm trạng thái 'holding'.
-- ============================================================================

-- ── 1) Bỏ HẠNG MỤC (rỗng, CEO chỉ đạo thay bằng task mẹ/con) ─────────────────
alter table viec    drop column if exists hang_muc_id;
alter table y_tuong drop column if exists hang_muc_id;
drop table if exists hang_muc cascade;

-- ── 2) y_tuong: thêm trạng thái 'holding' (Backlog · Holding · Hủy) ──────────
alter table y_tuong drop constraint if exists y_tuong_trang_thai_check;
alter table y_tuong add constraint y_tuong_trang_thai_check
  check (trang_thai in ('moi','backlog','holding','da_trien_khai','ngu_dong','tu_choi'));

-- ── 3) viec: cây 2 tầng task mẹ/con + nguoi_lam_id nullable ──────────────────
alter table viec add column if not exists task_me_id uuid references viec(id);
alter table viec alter column nguoi_lam_id drop not null;
create index if not exists idx_viec_task_me on viec(task_me_id);

-- Ghi chú bất biến (đọc lại khi tính hiệu suất):
--   · task MẸ = viec có ≥1 con (task_me_id trỏ về nó). Tiến độ/khối lượng mẹ = DERIVE từ con.
--   · task CON hoặc task LẺ (không con) = đơn vị 1-NGƯỜI → nguoi_lam_id BẮT BUỘC (app gác).
--   · Hiệu suất CHỈ cộng task LEAF (không có con) để không đếm 2 lần.
