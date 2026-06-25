-- 0051 — Tuyển sinh: nhập thông tin HS ĐẦY ĐỦ ngay từ lead (đằng nào convert cũng cần) + lưu ý.
-- ghi_chu đã có (0048). Thêm các cột khớp hoc_sinh để convert copy thẳng.
alter table ung_vien
  add column if not exists ngay_sinh  date,
  add column if not exists gioi_tinh  text,
  add column if not exists dia_chi    text,
  add column if not exists truong_hoc text,
  add column if not exists email_ph   text;
