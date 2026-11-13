-- Lớp 5 (MCQ lô 5): NDB02075 số chẵn/lẻ liền trước-sau, chẵn/lẻ nhỏ nhất-lớn nhất có k chữ số. Mã R425–R428 (dành cho luồng lớp 5). Chỉ INSERT.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong, active) values
 ('R425', 'Chẵn/lẻ liền kề: lấy số liền kề (±1) thay vì cách 2 đơn vị', 'Tìm số chẵn (lẻ) liền trước/liền sau nhưng chỉ cộng/trừ 1 nên ra số khác tính chẵn lẻ.', 'Số chẵn liền trước của 240 520 → 240 519', 'khai_niem', array['NDB02075']::text[], false, true),
 ('R426', 'Liền trước/liền sau: nhầm chiều', 'Đổi nhầm "liền trước" thành "liền sau" (cộng thay vì trừ) hoặc ngược lại.', 'Số chẵn liền trước của 240 520 → 240 522', 'khai_niem', array['NDB02075']::text[], false, true),
 ('R427', 'Chẵn/lẻ nhỏ nhất–lớn nhất: nhầm tính chẵn lẻ của chữ số cuối', 'Chọn đúng cỡ số nhưng đặt chữ số tận cùng sai tính chẵn/lẻ (chẵn lớn nhất 3 chữ số → 999).', 'Số chẵn lớn nhất có 3 chữ số → 999', 'khai_niem', array['NDB02075']::text[], false, true),
 ('R428', 'Số nhỏ nhất–lớn nhất có k chữ số: nhầm số chữ số', 'Lấy số có k−1 hoặc k+1 chữ số thay vì k chữ số.', 'Số chẵn lớn nhất có 3 chữ số → 98 hoặc 9 998', 'khai_niem', array['NDB02075']::text[], false, true)
on conflict (ma) do nothing;
