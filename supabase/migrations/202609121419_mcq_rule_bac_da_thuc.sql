-- MCQ FORM — thêm R105-R108 cho sub-shape "Bậc của đa thức $...$" của T108010102 (22/54 câu, phát hiện khi
-- chạy thật: dạng này TRỘN 2 sub-shape — "bậc đơn thức A(x)=..." (R89-91 đã có) và "bậc đa thức" (đa thức
-- nhiều hạng tử, một số câu có hạng tử TRIỆT TIÊU cần gộp trước khi lấy bậc lớn nhất).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R105','Quên gộp hạng tử đồng dạng trước khi tìm bậc','Đa thức chưa thu gọn có hạng tử triệt tiêu nhau (cùng phần biến, hệ số đối nhau) nhưng HS không gộp, lấy bậc lớn nhất trên các hạng tử GỐC (kể cả hạng tử sẽ mất đi)','$t^6-2t^3+5-3t^4+1-t^6$ thu gọn còn $-3t^4-2t^3+6$, bậc đúng=4 → nhầm lấy bậc của t^6 (đã triệt tiêu), ra 6','khai_niem','{T108010102}',false),
('R106','Cộng bậc các hạng tử thay vì lấy lớn nhất','Nhầm khái niệm bậc đa thức — cộng dồn bậc của TẤT CẢ hạng tử thay vì lấy bậc LỚN NHẤT','Đa thức có 2 hạng tử bậc 4 và 3 → nhầm cộng ra 7 thay vì lấy 4','khai_niem','{T108010102}',false),
('R107','Đếm số hạng tử thay vì lấy bậc','Nhầm khái niệm — trả lời SỐ HẠNG TỬ của đa thức (sau khi thu gọn) thay vì BẬC của đa thức','Đa thức thu gọn còn 3 hạng tử, bậc đúng=4 → nhầm trả lời 3','khai_niem','{T108010102}',false),
('R108','Bậc đa thức lệch 1 đơn vị','Rule dự phòng — tính bậc đa thức lệch 1 đơn vị so với đúng','Bậc đúng=4 → nhầm ra 3','tinh','{T108010102}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
