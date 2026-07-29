-- Report PH: kết luận ngoài phần chữ (ket_luan) còn có MỨC (thanh trạng thái 5 bậc):
--   vuot_bac | tien_bo | on_dinh | di_xuong | can_ho_tro
alter table bao_cao_ph add column if not exists ket_luan_muc text;
