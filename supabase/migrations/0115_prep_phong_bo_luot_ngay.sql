-- ============================================================================
-- 0115 — prep_phong: bỏ hẳn lượt 'ngay' (dọn tàn dư thiết kế cũ).
-- ----------------------------------------------------------------------------
-- 0113 nới CHECK để nhận 'toi' nhưng GIỮ 'ngay' cho 20 dòng lịch sử. Thùy chốt
-- 07-21: xoá luôn, vì KHÔNG CÓ ĐƯỜNG MIGRATE TRUNG THỰC — 'ngay' nghĩa là "1 lượt
-- cho CẢ NGÀY" (một lần dọn phục vụ nhiều ca liên tiếp), không tương ứng ca nào,
-- và trong dòng không có trường nào ghi ca. Map sang sang/chieu/toi = bịa dữ liệu
-- (§1.5: thà bỏ trống còn hơn đánh sai). Giai đoạn còn test nên data không cần giữ.
--
-- ĐÃ MẤT (chạy tay trên prod 07-21, Thùy duyệt sau khi xem danh sách):
--   20 dòng luot='ngay', ngày 06/07-17/07 — 17 đã đóng · 19 có ảnh · 6 leader chốt.
--   19 file ảnh trong bucket kho-anh/ops/ KHÔNG xoá theo → thành mồ côi (chấp nhận).
-- Trên DB mới toanh thì DELETE này là no-op, ALTER vẫn cho ra đúng state cuối.
-- ============================================================================

delete from prep_phong where luot = 'ngay';

alter table prep_phong drop constraint if exists prep_phong_luot_check;
alter table prep_phong add constraint prep_phong_luot_check
  check (luot in ('sang', 'chieu', 'toi'));
