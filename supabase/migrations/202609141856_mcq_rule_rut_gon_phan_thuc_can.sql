-- MCQ FORM — 4 rule cho "Rút gọn phân thức chứa căn" (T109030203, khối 9, 39/40 câu — 1 câu có thêm 1 tầng
-- chia ngoài, ngoài phạm vi). Hàm mới `rutGonPhanThucCan` — TÁI DÙNG NGUYÊN engine LCD của DẠNG 53 (đặt
-- $t=\sqrt x$), cộng dồn thành 1 phân thức rồi phân tích lại tử để khử nhân tử chung với mẫu.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R351','Rút gọn phân thức chứa căn: nhầm dấu ở tử số','Cộng dồn và rút gọn đúng cấu trúc nhưng nhầm dấu toàn bộ tử số','Đúng $\dfrac{\sqrt{x}-1}{\sqrt{x}+1}$ → nhầm $\dfrac{1-\sqrt{x}}{\sqrt{x}+1}$','khai_niem','{T109030203}',false),
('R352','Rút gọn phân thức chứa căn: lệch 1 đơn vị ở hằng số trong tử','Đúng cấu trúc nhưng hằng số trong tử lệch 1 đơn vị','Đúng $\dfrac{\sqrt{x}-1}{\sqrt{x}+1}$ → nhầm $\dfrac{\sqrt{x}}{\sqrt{x}+1}$','tinh','{T109030203}',false),
('R353','Rút gọn phân thức chứa căn: lệch 1 đơn vị ở hằng số trong tử, chiều ngược lại','Rule dự phòng — đúng cấu trúc nhưng hằng số trong tử lệch 1 đơn vị theo chiều ngược lại với R352','Đúng $\dfrac{\sqrt{x}-1}{\sqrt{x}+1}$ → nhầm $\dfrac{\sqrt{x}-2}{\sqrt{x}+1}$','tinh','{T109030203}',true),
('R354','Rút gọn phân thức chứa căn: quên rút gọn hết / lệch hằng số trong mẫu','Cộng dồn đúng nhưng QUÊN khử nhân tử chung giữa tử và mẫu (để nguyên dạng trước khi rút gọn); nếu không có gì để quên rút gọn thì lệch 1 đơn vị hằng số trong mẫu','Đúng $\dfrac{\sqrt{x}-1}{\sqrt{x}+1}$ → nhầm để nguyên dạng chưa rút gọn','khai_niem','{T109030203}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
