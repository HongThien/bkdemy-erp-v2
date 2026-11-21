-- ============================================================================
-- VÌ SAO (Thùy 21/11 "Ừ, mở lại"): ca sau giờ 11B1 ngày 15/11 (ca b4489569…, TA Nguyễn Ngọc Duy nghỉ) — 6 em ĐÃ CÓ MẶT, test đã in, chưa nhập Đ/C/S;
--   reset thứ Hai 16/11 (tự động) huỷ cả 6 buổi + huỷ ca + đóng 6 case 'nhe_xong/bo'. Mở lại để GV lớp nhập Đ/C/S (mig 202611211643 đã cho GV nhập + reset không huỷ buổi có mặt).
-- LÀM: chỉ đúng ca + các buổi còn nguyên dấu reset ("Hết tuần — reset thứ Hai 16/11 (tự động)") và em còn diem_danh='co_mat', chưa có bài làm:
--   · buoi_hoc → 'mo', xoá ly_do_huy · ca_bo_tro_nhe → 'mo', xoá ly_do_huy · case 'nhe_xong/bo' do reset đóng → 'nhe_mo' (xoá ket_qua/hoan_thanh_at/ghi_chu_dong/dong_boi),
--     để khi nộp Đ/C/S trigger _trg_btnhe_dong_case đóng đúng 'day_xong'. Dạng (bo_tro_yeu_dang.dong_at) KHÔNG đụng — đóng từ 13/11, không phải do reset.
--   Idempotent: điều kiện where giữ đúng trạng thái đã kiểm 21/11 ⇒ chạy lại không đè gì.
-- MẤT GÌ (Luật xoá): không xoá dòng nào. Mất duy nhất: dấu "huỷ do reset" trên 6 buổi / 1 ca / 6 case (ghi ở đây + DEVLOG).
-- ============================================================================
update buoi_hoc b set trang_thai = 'mo', ly_do_huy = null, updated_at = now()
 where b.ca_bo_tro_nhe_id = 'b4489569-eb8e-46da-b89d-e8f5dae1b4db' and b.loai = 'bo_tro_nhe' and b.trang_thai = 'huy'
   and b.ly_do_huy = 'Hết tuần — reset thứ Hai 16/11 (tự động)' and b.danh_gia_xong_at is null
   and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id and hh.diem_danh = 'co_mat')
   and not exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id where bt.buoi_hoc_id = b.id);

update ca_bo_tro_nhe set trang_thai = 'mo', ly_do_huy = null
 where id = 'b4489569-eb8e-46da-b89d-e8f5dae1b4db' and trang_thai = 'huy' and ly_do_huy = 'Hết tuần — reset thứ Hai 16/11 (tự động)'
   and exists (select 1 from buoi_hoc b where b.ca_bo_tro_nhe_id = ca_bo_tro_nhe.id and b.trang_thai = 'mo');

update bo_tro_yeu y set trang_thai = 'nhe_mo', hoan_thanh_at = null, ket_qua = null, dong_boi = null, ghi_chu_dong = null
 where y.trang_thai = 'nhe_xong' and y.ket_qua = 'bo' and y.ghi_chu_dong = 'Hết tuần — reset thứ Hai 16/11 (tự động)'
   and exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                where hh.bo_tro_yeu_id = y.id and b.ca_bo_tro_nhe_id = 'b4489569-eb8e-46da-b89d-e8f5dae1b4db' and b.trang_thai = 'mo');
