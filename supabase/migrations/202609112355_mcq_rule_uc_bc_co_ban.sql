-- MCQ FORM — 4 rule cho "Tìm BC(a;b)" (T106040201, 15 câu). T106040101 "Tìm UC(a;b)" tái dùng NGUYÊN rule
-- R73-R76 (Ước cơ bản, DẠNG 7/T106030101) vì UC(a;b) = Ước của ƯCLN(a;b) — cùng cơ chế; mở rộng ap_dung của
-- R73-R76 thêm T106040101 (upsert, không sửa lại migration đã áp 202609112352). BC(a;b) đáp số kho ghi dạng
-- "0;L;2L;...." (tập VÔ HẠN) nên cần 4 rule riêng phù hợp hình thức này.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R73','Nhầm Ước thành Bội (hoặc ngược lại)','Tính theo khái niệm ngược — HS nhầm lẫn Ước và Bội với nhau, áp cùng điều kiện khoảng cho khái niệm sai','Ư(18) và a>4 nhầm ra B(18) và a>4 → chỉ còn {18}','khai_niem','{T106030101,T106040101}',false),
('R74','Nhầm biên đóng/mở của khoảng','Đề cho khoảng mở (< , >) nhưng tính như khoảng đóng (≤, ≥) hoặc ngược lại — lấy thừa/thiếu 1 số ở biên nếu biên đó đúng là ước/bội thật','x∈B(27) và x<100 → nhầm lấy cả 100 nếu 100 là bội của 27 (ở đây không, nên câu khác mới lộ)','tinh','{T106030101,T106040101}',false),
('R75','Bỏ sót phần tử lớn nhất','Liệt kê tập ước/bội đúng nhưng thiếu phần tử lớn nhất — quên chưa xét hết','Ư(18),a>4 đúng {6;9;18} → liệt kê thiếu 18, ra {6;9}','tinh','{T106030101,T106040101}',false),
('R76','Lẫn nhầm 1 số liền kề không phải ước/bội thật','Giữ nguyên tập đúng, thêm nhầm 1 số liền kề (lớn hơn phần tử cuối 1 đơn vị) tưởng nhầm cũng là ước/bội','Ư(18) đúng {6;9;18} → thêm nhầm 19 (18+1, không chia hết 18) vào danh sách','khai_niem','{T106030101,T106040101}',true),
('R77','Nhầm BCNN thành ƯCLN','Tính ngược khái niệm khi tìm Bội chung — liệt kê bội của ƯCLN thay vì BCNN','BC(4;6) nhầm ra 0;2;4;.... (đúng: 0;12;24;....)','khai_niem','{T106040201}',false),
('R78','Chỉ liệt kê bội của 1 trong 2 số','Quên điều kiện phải chia hết cho CẢ HAI số, chỉ liệt kê bội của 1 số trong đề','BC(4;6) nhầm ra 0;4;8;.... (chỉ bội của 4, đúng: 0;12;24;....)','tinh','{T106040201}',false),
('R79','Quên số 0, bắt đầu liệt kê từ chính BCNN','B(a) theo định nghĩa luôn bắt đầu từ 0 nhưng HS quên, bắt đầu liệt kê từ chính giá trị BCNN','BC(4;6) nhầm ra 12;24;36;.... (thiếu số 0 ở đầu)','tinh','{T106040201}',false),
('R80','Nhân trực tiếp 2 số làm BCNN','Coi BCNN = tích 2 số, không rút gọn theo ước chung, rồi liệt kê bội vô hạn của tích đó','BC(4;6) nhầm ra 0;24;48;.... (24=4×6, đúng BCNN=12)','tinh','{T106040201}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
