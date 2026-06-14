-- 0027 — thêm trạng thái 'tot_nghiep' cho học sinh (khối 12 lên = ra trường, KHÁC 'nghi' bỏ giữa chừng).
alter table hoc_sinh drop constraint if exists hoc_sinh_trang_thai_check;
alter table hoc_sinh add constraint hoc_sinh_trang_thai_check
  check (trang_thai in ('dang_hoc','bao_luu','nghi','tot_nghiep'));
