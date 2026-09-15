-- MCQ FORM — 4 rule cho "Tìm x để P (phân thức 1 tầng theo √x) thoả mãn đẳng thức" (T109030301, khối 9,
-- 36/36 câu). Hàm mới `timXPhanThucCanBac2` — đặt $t=\sqrt x$, quy về phương trình bậc ≤2 theo $t$, giải
-- bằng định lý nghiệm hữu tỉ, lọc $t\ge0$ và loại nghiệm ngoại lai (mẫu=0), suy $x=t^2$.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R339','Tìm x qua phân thức căn: nhầm dấu nghiệm thứ nhất','Giải đúng cách nhưng nhầm dấu ở nghiệm x thứ nhất (theo thứ tự tăng dần)','Đúng $x=16$ hoặc $x=144$ → nhầm $x=-16$','khai_niem','{T109030301}',false),
('R340','Tìm x qua phân thức căn: nhầm dấu/lệch nghiệm thứ hai','Nhầm dấu nghiệm thứ hai (nếu có 2 nghiệm) hoặc lệch 1 đơn vị (nếu chỉ có 1 nghiệm)','Đúng $x=16$ hoặc $x=144$ → nhầm $x=-144$','khai_niem','{T109030301}',false),
('R341','Tìm x qua phân thức căn: lệch 1 đơn vị ở nghiệm cuối','Rule dự phòng — đúng cấu trúc nhưng nghiệm cuối (lớn hơn) lệch 1 đơn vị','Đúng $x=144$ → nhầm $x=145$','tinh','{T109030301}',true),
('R342','Tìm x qua phân thức căn: lệch 1 đơn vị ở nghiệm cuối, chiều ngược lại','Đúng cấu trúc nhưng nghiệm cuối lệch 1 đơn vị theo chiều ngược lại với R341','Đúng $x=144$ → nhầm $x=143$','tinh','{T109030301}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
