-- MCQ FORM — cụm "Biểu thức chứa căn thức" (khối 9): 12 rule mới cho 4 dạng dùng engine số vô tỉ mới
-- (mini-dang.mjs DẠNG 50: SurdVal c₁√k₁+c₂√k₂, hữu tỉ hoá mẫu bằng liên hợp, căn lồng √(a+b√c)).
-- T109030201 "Tìm ĐKXĐ của Căn thức" (60/60 câu, hàm timDkxdCanThuc) — R327-330.
-- T109030204 "Tìm x ứng dụng Rút gọn Căn thức" (17/17 câu, hàm timXPtCanThucTuyenTinh) — R331-334.
-- T109030101/102/202 (120+130+65=315 câu, hàm tinhGiaTriCanThuc/tinhGiaTriCanThucTheoX, DÙNG CHUNG rule vì
-- cùng 1 bộ nhiễu TỔNG QUÁT trên kết quả cuối — không tách được 1 công thức sai riêng cho từng sub-shape) — R335-338.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R327','ĐKXĐ căn thức: nhầm biên chặt/lỏng','Tìm đúng giá trị biên nhưng nhầm dấu ≥ với > (hoặc ngược lại) ở điều kiện đầu','Đúng $x\ge1$ → nhầm $x>1$','khai_niem','{T109030201}',false),
('R328','ĐKXĐ căn thức: quên điều kiện mẫu số khác 0','Tìm đúng điều kiện căn có nghĩa nhưng quên thêm điều kiện mẫu số khác 0 (nếu có)','Đúng $x\ge1$ và $x\ne2$ → nhầm chỉ $x\ge1$','khai_niem','{T109030201}',false),
('R329','ĐKXĐ căn thức: lệch 1 đơn vị ở điều kiện đầu','Rule dự phòng — đúng cấu trúc nhưng giá trị biên đầu lệch 1 đơn vị','Đúng $x\ge1$ → nhầm $x\ge2$','tinh','{T109030201}',true),
('R330','ĐKXĐ căn thức: lệch giá trị ở điều kiện thứ hai/chiều ngược','Đúng cấu trúc nhưng giá trị biên thứ hai (hoặc điều kiện đầu chiều ngược nếu không có điều kiện 2) lệch 1 đơn vị','Đúng $x\ne2$ → nhầm $x\ne3$','tinh','{T109030201}',false),
('R331','Tìm x ứng dụng căn thức: quên bình phương','Giải đúng ra $t=\sqrt{x-A}$ nhưng quên bình phương để suy ra x, lấy nhầm giá trị của t làm đáp số','Đúng $x=41$ ($t=6$) → nhầm đáp số $6$','khai_niem','{T109030204}',false),
('R332','Tìm x ứng dụng căn thức: nhầm dấu A khi cộng lại','Tính đúng $t$ nhưng nhầm dấu khi cộng lại A, tính $x=t^2-A$ thay vì $x=t^2+A$','Đúng $x=t^2+A=41$ → nhầm $x=t^2-A=29$','khai_niem','{T109030204}',false),
('R333','Tìm x ứng dụng căn thức: lệch 1 đơn vị','Rule dự phòng — đúng cấu trúc nhưng x lệch 1 đơn vị','Đúng $x=41$ → nhầm $x=42$','tinh','{T109030204}',true),
('R334','Tìm x ứng dụng căn thức: lệch 1 đơn vị, chiều ngược lại','Rule cứu — đúng cấu trúc nhưng x lệch 1 đơn vị theo chiều ngược lại với R333','Đúng $x=41$ → nhầm $x=40$','tinh','{T109030204}',false),
('R335','Biểu thức chứa căn: nhầm dấu toàn bộ kết quả','Tính đúng các bước nhưng nhầm dấu ở 1 bước trung gian, dẫn tới nhầm dấu TOÀN BỘ kết quả cuối','Đúng $3\sqrt2$ → nhầm $-3\sqrt2$','khai_niem','{T109030101,T109030102,T109030202}',false),
('R336','Biểu thức chứa căn: lệch 1 đơn vị ở hạng thứ nhất','Đúng cấu trúc nhưng hạng thứ nhất của kết quả lệch 1 đơn vị hệ số','Đúng $3\sqrt2$ → nhầm $4\sqrt2$','tinh','{T109030101,T109030102,T109030202}',false),
('R337','Biểu thức chứa căn: lệch 1 đơn vị ở hạng thứ nhất, chiều ngược lại','Rule dự phòng — đúng cấu trúc nhưng hạng thứ nhất lệch 1 đơn vị theo chiều ngược lại với R336','Đúng $3\sqrt2$ → nhầm $2\sqrt2$','tinh','{T109030101,T109030102,T109030202}',true),
('R338','Biểu thức chứa căn: lệch giá trị ở hạng còn lại','Đúng cấu trúc nhưng hạng còn lại (thứ hai, hoặc hạng duy nhất nếu kết quả chỉ 1 hạng) lệch giá trị so với đúng','Đúng $1-2\sqrt2$ → nhầm $2-2\sqrt2$','tinh','{T109030101,T109030102,T109030202}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
