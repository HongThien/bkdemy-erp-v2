-- ============================================================================
-- 0113 — prep_phong.luot: nhận thêm 'toi'.
-- ----------------------------------------------------------------------------
-- 0086 viết theo thiết kế CŨ (T2-T6 gộp 1 lượt 'ngay', T7/CN 'sang'/'chieu').
-- Thùy chốt 07-19: 3 ca CỐ ĐỊNH sang/chiều/tối MỌI ngày (CA_TRUC_DEF, opsvanhanh.ts).
-- Code sửa theo, constraint thì không → Ops tick chuẩn bị phòng ca TỐI bị DB chặn
-- ("new row for relation prep_phong violates check constraint"). Sáng/Chiều vẫn chạy
-- nên lỗi ẩn lâu. Đây là drift schema, không phải bug logic.
-- GIỮ 'ngay' — 20 dòng lịch sử theo thiết kế cũ vẫn còn, không xoá; UI hiện không
-- sinh 'ngay' nữa nên giá trị này chỉ để đọc lại quá khứ.
-- (Đã áp tay trên DB prod 07-21; file này để migrate-from-scratch không lệch lại.)
-- ============================================================================

alter table prep_phong drop constraint if exists prep_phong_luot_check;
alter table prep_phong add constraint prep_phong_luot_check
  check (luot in ('ngay', 'sang', 'chieu', 'toi'));
