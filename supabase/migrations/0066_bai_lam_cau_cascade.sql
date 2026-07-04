-- 0066 — bai_lam_cau.bai_test_cau_id ON DELETE CASCADE.
-- Bug: xoá bai_test → cascade bai_test_cau, nhưng bai_lam_cau→bai_test_cau là RESTRICT
--   → nếu HS đã làm (có bai_lam_cau) thì xoá test FAIL. Xoá test = huỷ instance → bỏ luôn bài làm.
-- (FK bai_lam_cau→bai_lam đã cascade sẵn; chỉ cần sửa cái này.)
alter table bai_lam_cau drop constraint bai_lam_cau_bai_test_cau_id_fkey;
alter table bai_lam_cau add constraint bai_lam_cau_bai_test_cau_id_fkey
  foreign key (bai_test_cau_id) references bai_test_cau(id) on delete cascade;
