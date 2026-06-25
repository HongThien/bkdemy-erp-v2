-- 0052 — Tuyển sinh: link PH CŨ tường minh (BK phổ biến PH cho con thứ 2 đi học).
-- Có phu_huynh_id → convert dùng thẳng PH cũ, không tạo trùng. Free-text ho_ten_ph/sdt_ph vẫn giữ cho lead mới.
alter table ung_vien
  add column if not exists phu_huynh_id uuid references phu_huynh(id) on delete set null;
