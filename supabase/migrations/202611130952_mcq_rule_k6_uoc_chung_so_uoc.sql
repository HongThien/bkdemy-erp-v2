-- Lớp 6 (MCQ vòng cuối): NDB00404 bài toán chia nhóm bằng ƯCLN, NDB01622 đếm số ước. Mã R510–R516 (luồng lớp 6). Chỉ INSERT.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong, active) values
 ('R510', 'ƯCLN: lấy ước chung chưa lớn nhất (bỏ thừa số nguyên tố nhỏ nhất)', 'Tìm được các ước chung nhưng dừng ở một ước chung nhỏ hơn ƯCLN (bỏ sót thừa số nguyên tố nhỏ nhất của ƯCLN) nên chia được nhiều nhóm hơn, mỗi nhóm ít phần tử hơn.', 'ƯCLN(18,24,30)=6 → chọn 3 nhóm', 'khai_niem', array['NDB00404']::text[], false, true),
 ('R511', 'ƯCLN: lấy ước chung chưa lớn nhất (bỏ thừa số nguyên tố lớn nhất)', 'Phân tích đúng nhưng chỉ nhân một phần các thừa số nguyên tố chung (bỏ thừa số lớn nhất).', 'ƯCLN(56,70)=14 → chọn 2 nhóm', 'khai_niem', array['NDB00404']::text[], false, true),
 ('R512', 'ƯCLN: chọn ước chung nhỏ nhất (1)', 'Nhầm "nhiều nhất" thành chia đơn giản nhất: lấy ước chung là 1, mỗi nhóm giữ nguyên toàn bộ số lượng.', 'Chia được 1 nhóm, mỗi nhóm có đủ mọi phần tử', 'khai_niem', array['NDB00404']::text[], false, true),
 ('R514', 'Số ước: lấy tích các số mũ (quên cộng 1)', 'Phân tích ra thừa số nguyên tố a^m·b^n nhưng đếm ước bằng m·n thay vì (m+1)(n+1).', '2^2·5 có 2·1 = 2 ước (đúng 6)', 'khai_niem', array['NDB01622']::text[], false, true),
 ('R515', 'Số ước: lấy tổng các số mũ cộng 1', 'Đếm số ước bằng m+n+1 thay vì (m+1)(n+1).', '2^2·5 có 2+1+1 = 4 ước (đúng 6)', 'khai_niem', array['NDB01622']::text[], false, true),
 ('R516', 'Số ước: bỏ sót ước 1 hoặc chính số đó', 'Đếm đúng các ước nhưng không tính ước 1 và/hoặc chính số đó.', '2^2·5 có 6−2 = 4 ước hoặc 6−1 = 5', 'khai_niem', array['NDB01622']::text[], false, true)
on conflict (ma) do nothing;
