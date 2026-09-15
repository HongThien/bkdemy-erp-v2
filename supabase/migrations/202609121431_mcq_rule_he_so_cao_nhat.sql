-- MCQ FORM — thêm R112-R115 cho sub-shape thứ 3 "Xác định hệ số cao nhất của đa thức" của T108010103 (đa
-- thức có thể CHƯA khai triển dạng "hệ_số.(nhị thức)+...", phải phân phối rồi gộp hạng tử đồng dạng trước
-- khi tìm hạng tử bậc cao nhất). Phát hiện khi chạy thật — dạng này thực ra trộn 3 sub-shape, không phải 2.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R112','Quên khai triển (phân phối) trước khi tìm hệ số cao nhất','Đa thức chưa khai triển dạng hệ_số.(nhị thức)+... nhưng HS không nhân phân phối, lấy hệ số của hạng tử có bậc cao nhất TÍNH TRƯỚC KHI phân phối (bỏ hẳn phần trong ngoặc)','$2x^2.(3x^2-1)+4x$ khai triển đúng=$6x^4-2x^2+4x$, hệ số cao nhất=6 → nhầm lấy hệ số 2 (của 2x^2, chưa nhân vào ngoặc)','khai_niem','{T108010103}',false),
('R113','Nhầm lấy hạng tử bậc thấp nhất','Nhầm khái niệm "cao nhất" — lấy hệ số của hạng tử có bậc THẤP NHẤT (hằng số hoặc bậc 1) thay vì cao nhất','$5-3x+2x^2-6x^4$ hệ số cao nhất đúng=-6 (của -6x^4) → nhầm lấy hệ số của hằng số 5','khai_niem','{T108010103}',false),
('R114','Nhầm dấu khi phân phối','Khi nhân phân phối vào trong ngoặc, quên đổi dấu đúng với hạng tử âm trong ngoặc','$2x^2.(3x^2-1)$ nhân đúng $-1$ ra $-2x^2$ → nhầm giữ dấu dương ra $+2x^2$ (chỉ ảnh hưởng khi hạng tử này lại là bậc cao nhất)','tinh','{T108010103}',false),
('R115','Hệ số cao nhất lệch 1 đơn vị','Rule dự phòng — tính hệ số cao nhất lệch 1 đơn vị so với đúng','Đúng=6 → nhầm ra 7','tinh','{T108010103}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
