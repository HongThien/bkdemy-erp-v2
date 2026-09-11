-- MCQ FORM — 4 rule cho "Ước/Bội của số tự nhiên" (T106030101, khối 6, 41 câu). Đáp số là TẬP (5 bội đầu / tất
-- cả ước / ước-bội thoả điều kiện khoảng) — dùng chung khuôn chuanHoaTapText đã có ở DẠNG 5/6. Tự quyết theo
-- quy trình nới 11/09 — rule suy trực tiếp từ 2 khái niệm Ước/Bội và điều kiện khoảng của đề (đóng/mở).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R73','Nhầm Ước thành Bội (hoặc ngược lại)','Tính theo khái niệm ngược — HS nhầm lẫn Ước và Bội với nhau, áp cùng điều kiện khoảng cho khái niệm sai','Ư(18) và a>4 nhầm ra B(18) và a>4 → chỉ còn {18}','khai_niem','{T106030101}',false),
('R74','Nhầm biên đóng/mở của khoảng','Đề cho khoảng mở (< , >) nhưng tính như khoảng đóng (≤, ≥) hoặc ngược lại — lấy thừa/thiếu 1 số ở biên nếu biên đó đúng là ước/bội thật','x∈B(27) và x<100 → nhầm lấy cả 100 nếu 100 là bội của 27 (ở đây không, nên câu khác mới lộ)','tinh','{T106030101}',false),
('R75','Bỏ sót phần tử lớn nhất','Liệt kê tập ước/bội đúng nhưng thiếu phần tử lớn nhất — quên chưa xét hết','Ư(18),a>4 đúng {6;9;18} → liệt kê thiếu 18, ra {6;9}','tinh','{T106030101}',false),
('R76','Lẫn nhầm 1 số liền kề không phải ước/bội thật','Giữ nguyên tập đúng, thêm nhầm 1 số liền kề (lớn hơn phần tử cuối 1 đơn vị) tưởng nhầm cũng là ước/bội','Ư(18) đúng {6;9;18} → thêm nhầm 19 (18+1, không chia hết 18) vào danh sách','khai_niem','{T106030101}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
