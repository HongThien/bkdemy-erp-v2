-- MCQ FORM — 4 rule cho "Giải phương trình quy về phương trình bậc hai dạng tích" (T109020402, khối 9,
-- 48/48 câu). Chuyển vế + khai triển đầy đủ rồi tìm nghiệm hữu tỉ (hàm mới `giaiPtQuyVeTich`) — đáp số kho
-- có thể là 1 nghiệm (bậc thực sự chỉ 1 sau khi gộp, hoặc nghiệm kép) hoặc 2 nghiệm phân biệt.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R314','Giải PT quy về bậc hai dạng tích: nhầm dấu nghiệm thứ nhất','Khai triển và tìm nghiệm đúng cách nhưng nhầm dấu ở nghiệm thứ nhất (theo thứ tự tăng dần)','$(x+2)(x-10)=-36$ đúng nghiệm kép $x=4$ → nhầm $x=-4$','khai_niem','{T109020402}',false),
('R315','Giải PT quy về bậc hai dạng tích: nhầm dấu nghiệm thứ hai','Khai triển và tìm nghiệm đúng cách nhưng nhầm dấu ở nghiệm thứ hai (chỉ áp dụng câu có 2 nghiệm phân biệt)','Đúng $x=2$ hoặc $x=-6$ → nhầm $x=2$ hoặc $x=6$','khai_niem','{T109020402}',false),
('R316','Giải PT quy về bậc hai dạng tích: lệch 1 đơn vị ở nghiệm cuối','Rule dự phòng — đúng cấu trúc nhưng nghiệm cuối (lớn hơn) lệch 1 đơn vị','Đúng $x=3$ → nhầm $x=4$','tinh','{T109020402}',true),
('R317','Giải PT quy về bậc hai dạng tích: lệch 1 đơn vị ở nghiệm cuối, chiều ngược lại','Đúng cấu trúc nhưng nghiệm cuối lệch 1 đơn vị theo chiều ngược lại với R316','Đúng $x=3$ → nhầm $x=2$','tinh','{T109020402}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
