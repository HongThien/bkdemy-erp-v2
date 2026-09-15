-- MCQ FORM — 4 rule cho "Phương trình quy về bậc nhất/tích — mẫu số chứa biến" (T109020103 16/16 câu,
-- T109020403 21/21 câu, khối 9). Hàm mới `giaiPtPhanThucBacNhat` — engine LCD tổng quát: phân tích mẫu số
-- thành tích nhị thức tuyến tính (bậc 2 dùng định lý nghiệm hữu tỉ), quy đồng, giải, lọc nghiệm ngoại lai
-- (ĐKXĐ) — nếu mọi nghiệm đều bị loại → "Vô nghiệm" (đáp số kho có định dạng này thật, không phải lỗi).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R347','PT phân thức mẫu chứa biến: nhầm dấu nghiệm/báo nhầm giá trị bị cấm','Nhầm dấu nghiệm thứ nhất (nếu có nghiệm), hoặc quên kiểm tra ĐKXĐ nên báo nhầm 1 giá trị bị cấm làm đáp số (nếu đáp số đúng là Vô nghiệm)','Đúng $x=-15;10$ → nhầm $x=15;10$. Hoặc đúng Vô nghiệm → nhầm báo $x=-2$ (giá trị làm mẫu bằng 0)','khai_niem','{T109020103,T109020403}',false),
('R348','PT phân thức mẫu chứa biến: nhầm dấu/lệch nghiệm thứ hai','Nhầm dấu nghiệm thứ hai (nếu có 2 nghiệm), lệch 1 đơn vị (nếu chỉ 1 nghiệm), hoặc báo nhầm giá trị bị cấm còn lại (nếu Vô nghiệm)','Đúng $x=-15;10$ → nhầm $x=-15;-10$','khai_niem','{T109020103,T109020403}',false),
('R349','PT phân thức mẫu chứa biến: lệch 1 đơn vị ở nghiệm cuối','Rule dự phòng — đúng cấu trúc nhưng nghiệm cuối (hoặc giá trị bị cấm dùng làm nhiễu) lệch 1 đơn vị','Đúng $x=10$ → nhầm $x=11$','tinh','{T109020103,T109020403}',true),
('R350','PT phân thức mẫu chứa biến: lệch giá trị ở nghiệm cuối, chiều ngược lại','Rule cứu — đúng cấu trúc nhưng nghiệm cuối lệch giá trị theo chiều ngược lại với R349','Đúng $x=10$ → nhầm $x=9$','tinh','{T109020103,T109020403}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
