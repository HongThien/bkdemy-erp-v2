-- MCQ FORM — 4 rule cho "Chia đa thức cho đơn thức" (T108010402, khối 8, 33 câu). Đáp số là 1 ĐA THỨC —
-- TEXT_DANG, tái dùng chuanHoaDaThuc/hienThiDaThuc của DẠNG 13/15.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R151','Chỉ chia hạng tử đầu, quên chia hết','Chỉ chia hạng tử ĐẦU TIÊN của đa thức cho đơn thức, các hạng tử sau giữ nguyên (quên chia hết)','$(10x^5y^3-15x^3y^2+5x^4y^4):x^3y$ đúng có hạng $10x^2y^2$ → nhầm hạng sau vẫn giữ nguyên $-15x^3y^2$, $5x^4y^4$ chưa chia','khai_niem','{T108010402}',false),
('R152','Cộng số mũ thay vì trừ','Khi chia từng hạng tử của đa thức cho đơn thức — CỘNG số mũ của biến chung thay vì TRỪ','$x^5y^3:x^3y$ đúng=$x^2y^2$ → nhầm ra $x^8y^4$ (cộng 5+3=8, 3+1=4 thay vì trừ)','khai_niem','{T108010402}',false),
('R153','Quên chia hệ số từng hạng tử','Trừ đúng số mũ của biến nhưng QUÊN chia hệ số, giữ nguyên hệ số của từng hạng tử đa thức','$(2x^2yz+4xyz^2-5xy^2z^2):3xyz$ đúng có hạng $\dfrac{2}{3}x$ → nhầm ra $2x$ (giữ nguyên hệ số 2)','khai_niem','{T108010402}',false),
('R154','Chia đa-đơn thức: lệch 1 đơn vị ở hệ số bậc cao nhất','Rule dự phòng — tính đúng cấu trúc nhưng hệ số hạng tử bậc cao nhất lệch 1 đơn vị','Đúng có hạng cao nhất hệ số 10 → nhầm thành 11','tinh','{T108010402}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
