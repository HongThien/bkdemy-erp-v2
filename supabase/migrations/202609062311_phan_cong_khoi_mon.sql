-- ============================================================================
-- 202609062311 — phan_cong_khoi_mon
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO chốt 06/09): trưởng khối chuyển từ (khối) sang (khối × MÔN).
--   Lý do trực tiếp: MT sắp gán cho trưởng khối (thay TA lớp — mig kế). MT là dữ
--   liệu HỌC TẬP ⇒ phải có nhãn môn (CLAUDE.md §1.6) — 12 dòng hiện có đều là
--   người Toán, trong khi khối 7/8/9 có lớp KHTN/Văn/Anh và đã có 4 MT KHTN;
--   không có `mon` thì trưởng khối Toán nhận MT KHTN. CEO: "theo môn nhé, KHTN
--   sẽ có trưởng khối riêng".
--   Backfill 'Toán' cho 12 dòng cũ = đúng sự thật (đã kiểm nhan_su_mon: 12/12
--   chỉ có Toán), không phải đoán.
--
-- MẤT GÌ (Luật xoá): DROP unique (nhan_su_id, khoi) — thay bằng unique
--   (nhan_su_id, khoi, mon). Không mất dòng nào.
-- ============================================================================

alter table public.phan_cong_khoi add column if not exists mon text;
update public.phan_cong_khoi set mon = 'Toán' where mon is null;
alter table public.phan_cong_khoi alter column mon set not null;

alter table public.phan_cong_khoi drop constraint if exists phan_cong_khoi_nhan_su_id_khoi_key;
alter table public.phan_cong_khoi drop constraint if exists phan_cong_khoi_nhan_su_id_khoi_mon_key;
alter table public.phan_cong_khoi add constraint phan_cong_khoi_nhan_su_id_khoi_mon_key unique (nhan_su_id, khoi, mon);
create index if not exists idx_phan_cong_khoi_khoi_mon on public.phan_cong_khoi(khoi, mon);

comment on table public.phan_cong_khoi is
  'Trưởng khối theo (khối × môn). Quyền: rà soát + sửa ET/MT/BTVN mọi lớp cùng khối+môn; nhận task Chấm MT (mig 202609062312). 1 người nhiều (khối, môn); 1 (khối, môn) nhiều người.';
