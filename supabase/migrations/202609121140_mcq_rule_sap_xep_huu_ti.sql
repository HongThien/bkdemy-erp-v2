-- MCQ FORM — 4 rule cho "Sắp xếp số hữu tỉ theo thứ tự tăng dần" (T107010103, khối 7, sub-shape 6 câu). Đáp số
-- là CHUỖI bất đẳng thức giữ nguyên văn (không rút gọn) — dùng TEXT_DANG (mini-dang.mjs `sapXepSoHuuTi`), tách
-- khỏi sub-shape "tìm x,y nguyên" đã có sẵn của cùng dạng (R45/R46/R47/R51, vẫn đi SPECIAL_DANG như cũ — 2
-- sub-shape phân biệt bằng đáp số kho có ký tự "<" hay không, xem mcq-sinh.mjs `laHinhThucText`).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R85','So sánh nhầm 2 số âm (quên đổi dấu)','Khi so sánh 2 số hữu tỉ âm, HS lấy trực tiếp tử số/giá trị tuyệt đối để so sánh mà quên đổi chiều do cả 2 đều âm — đảo nhầm thứ tự 2 số âm trong dãy','$-2/3 < -1/2$ đúng nhưng nhầm ra $-1/2 < -2/3$ (lấy 1<2 trực tiếp)','khai_niem','{T107010103}',false),
('R86','So sánh nhầm 2 số dương (quy đồng sai)','Quy đồng mẫu số sai khi so sánh 2 số hữu tỉ dương, dẫn đến đảo nhầm thứ tự 2 số dương trong dãy','$1/5 < 3/4$ đúng nhưng nhầm ra $3/4 < 1/5$','tinh','{T107010103}',false),
('R87','Sắp xếp giảm dần thay vì tăng dần','Đọc nhầm đề, sắp xếp theo thứ tự GIẢM DẦN thay vì TĂNG DẦN như yêu cầu — đảo ngược toàn bộ thứ tự','Đúng: $-2/3<-1/2<0<1/5<3/4$ → nhầm: $3/4<1/5<0<-1/2<-2/3$','khai_niem','{T107010103}',false),
('R88','Đặt số 0 sai vị trí','Quên xét dấu âm/dương của các số hữu tỉ khác, đặt nhầm số 0 lên đầu dãy thay vì đúng vị trí giữa các số âm và dương','Đúng: $-2/3<-1/2<0<1/5<3/4$ → nhầm: $0<-2/3<-1/2<1/5<3/4$','khai_niem','{T107010103}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
