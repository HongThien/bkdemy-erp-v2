-- Kế thừa giả thiết: thêm KIỂU "tự phát biểu" (thay thế) bên cạnh "cộng thêm".
-- Bối cảnh: mô hình con KHÔNG phải lúc nào cũng = giả thiết bố + text thêm. Có ca con là ĐẶC BIỆT HOÁ
-- được ĐỊNH DANH (vd "hình bình hành" là con của "hình thang"): "cho hình bình hành ABCD" đã BAO cả
-- "cho hình thang ABCD" — không thể viết cộng dồn "ABCD là hình thang; ABCD là hình bình hành".
--   => giả thiết con TỰ PHÁT BIỂU nguyên câu, THAY cách gọi của bố. QUAN HỆ cha-con (DAG) KHÔNG đổi —
--      chỉ đổi cách RENDER text; kế thừa cách giải / bao đóng tiền đề vẫn chạy nguyên qua cạnh cha.
-- gt_thay_the = false (mặc định): CỘNG THÊM   — full = giả thiết bố + gia_thiet_them (hành vi cũ).
-- gt_thay_the = true            : TỰ PHÁT BIỂU — full = gia_thiet của chính node; derive DỪNG leo ở đây.
alter table hinh_mo_hinh
  add column if not exists gt_thay_the boolean not null default false;

comment on column hinh_mo_hinh.gt_thay_the is
  'Kiểu kế thừa giả thiết. false=cộng thêm (full=bố+gia_thiet_them); true=tự phát biểu, thay cách gọi bố (full=gia_thiet của node). Quan hệ cha-con KHÔNG đổi, chỉ đổi render text.';
