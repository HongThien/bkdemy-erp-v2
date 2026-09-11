-- MCQ FORM — POOL 3 (khối 6, số tự nhiên, whitelist kho-quet-dapso.mjs). Đo thật: dạng "Nhân, chia Số tự nhiên"
-- (T106020301, câu chỉ 1 phép tính trần "32·7"/"255:7", không âm không lồng) fail 100% vì R10 cần số âm mới
-- fire, R20 chỉ áp lúc tìm x — chỉ còn 2 rule dự phòng (R24 sót thừa số, R05 lệch 1 đơn vị), không đủ 3.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R52','Nhầm phép tính','Nhầm phép nhân thành phép cộng, hoặc phép chia thành phép nhân — lỗi kinh điển ở HS yếu với câu chỉ 1 phép tính trần','$32\cdot7$ tính thành $32+7=39$ (đúng: 224); $255:5$ tính thành $255\cdot5=1275$ (đúng: 51)','khai_niem','{T106020301,T106020302}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
