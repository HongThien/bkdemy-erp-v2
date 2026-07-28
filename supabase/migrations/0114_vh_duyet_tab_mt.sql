-- ============================================================================
-- 0114 — viec_van_hanh_duyet.tab: nhận thêm 'mt'.
-- ----------------------------------------------------------------------------
-- CÙNG LOẠI LỖI với 0113 (prep_phong.luot thiếu 'toi'): code mở rộng tập giá trị,
-- constraint ở DB đứng yên. TASK_TABS (vanhanh.ts) = danhgia/ingame/et/btvn/MT,
-- check ở DB chỉ có 4 cái đầu → hễ ai duyệt task "chấm MT" là dính
-- "new row for relation viec_van_hanh_duyet violates check constraint".
-- Bảng đang 0 dòng nên vá trước khi nổ, không mất gì.
-- 'diemdanh' CỐ Ý không thêm: TASK_TABS không sinh tab này (điểm danh không qua
-- luồng duyệt) — thêm vào = nới constraint cho đường code không tồn tại.
-- ============================================================================

alter table viec_van_hanh_duyet drop constraint if exists viec_van_hanh_duyet_tab_check;
alter table viec_van_hanh_duyet add constraint viec_van_hanh_duyet_tab_check
  check (tab in ('danhgia', 'ingame', 'et', 'btvn', 'mt'));
