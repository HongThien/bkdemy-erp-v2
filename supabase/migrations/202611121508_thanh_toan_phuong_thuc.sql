-- Thu học phí: ghi rõ HÌNH THỨC mỗi lần thu — Tiền mặt / Chuyển khoản (Thùy 12/11:
-- "có phụ huynh CK, có phụ huynh nộp tiền mặt").
--
-- Cột thanh_toan.phuong_thuc đã có từ trước nhưng app chưa từng ghi ⇒ 790 dòng cũ đều NULL.
-- Dòng cũ KHÔNG đoán lại (§1.5 thà bỏ trống còn hơn đánh sai) — màn hiện "chưa ghi hình thức".
-- Dòng MỚI bắt buộc có 1 trong 2 giá trị: CHECK ... NOT VALID ⇒ Postgres không soát dòng cũ,
-- nhưng mọi INSERT/UPDATE từ giờ phải thoả. (App không UPDATE thanh_toan — chỉ insert/xoá.)

alter table thanh_toan
  add constraint thanh_toan_phuong_thuc_chk
  check (phuong_thuc is not null and phuong_thuc in ('tien_mat', 'chuyen_khoan')) not valid;

comment on column thanh_toan.phuong_thuc is
  'Hình thức thu: tien_mat | chuyen_khoan. NULL chỉ ở dòng cũ trước 12/11/2026 (chưa ghi nhận).';
