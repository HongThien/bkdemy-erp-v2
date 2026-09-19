-- ============================================================================
-- 202609132220 — Rule Điền Ô D41–D48 (max ma trước khi seed = D40) — khuôn "dãy phân số hiệu tích" T107010501
-- ----------------------------------------------------------------------------
-- Thùy chốt làm 2 khuôn CHÍNH trước (scripts/lib/dien-khuon-hieutich.mjs): A "Tính tổng đơn giản" (mẫu k(k+1)
-- liên tiếp) · B "Tìm x" (tổng = giá trị cho trước, mẫu k(k+step) cách đều). Lõi chung: 1/(k(k+S)) tách thành
-- hiệu 2 phân số rồi triệt giữa. 2 vị trí đo: 'tach_day' (bước tách) · 'rut_gon' (kết quả sau khi triệt giữa).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('D41','Sai dấu khi tách phân số','Tách $\dfrac1{k(k+1)}$ thành hiệu 2 phân số nhưng đảo dấu cộng/trừ so với đúng','$\dfrac12+\dfrac13$ thay vì $\dfrac12-\dfrac13$','khai_niem','{T107010501}',false),
('D42','Lệch mẫu số cuối đi 1 bước','Số hạng cuối của dãy lấy sai 1 đơn vị so với đề','$\dfrac1{99}$ thay vì $\dfrac1{100}$','tinh','{T107010501}',false),
('D43','Lệch mẫu số cuối đi 2 bước','Số hạng cuối của dãy lấy sai 2 đơn vị so với đề','$\dfrac1{101}$ thay vì $\dfrac1{100}$','tinh','{T107010501}',true),
('D44','Quên rút gọn phần triệt giữa đúng chỗ','Lấy nhầm mẫu số hạng ĐẦU sau khi triệt giữa (dùng hạng tử thứ 2 thay vì thứ 1)','$\dfrac13-\dfrac1{100}$ thay vì $\dfrac12-\dfrac1{100}$','khai_niem','{T107010501}',false),
('D45','Sai dấu ở kết quả sau khi triệt giữa','Đổi dấu cộng/trừ ở kết quả cuối cùng sau khi các số hạng giữa đã triệt nhau','$\dfrac12+\dfrac1{100}$ thay vì $\dfrac12-\dfrac1{100}$','khai_niem','{T107010501}',false),
('D46','Lệch bước nhảy ở mẫu cuối đi 1 đơn vị (thiếu)','Dạng "tìm x": mẫu số cuối x+bước nhảy lấy thiếu 1 đơn vị bước nhảy','$x+1$ thay vì $x+2$','tinh','{T107010501}',false),
('D47','Lệch bước nhảy ở mẫu cuối, sai dấu','Dạng "tìm x": dùng $x-$bước nhảy thay vì $x+$bước nhảy','$x-2$ thay vì $x+2$','khai_niem','{T107010501}',false),
('D48','Lệch bước nhảy ở mẫu cuối đi 1 đơn vị (thừa)','Dạng "tìm x": mẫu số cuối x+bước nhảy lấy thừa 1 đơn vị bước nhảy','$x+3$ thay vì $x+2$','tinh','{T107010501}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
