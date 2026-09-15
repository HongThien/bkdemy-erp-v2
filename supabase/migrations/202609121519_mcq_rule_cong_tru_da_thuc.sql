-- MCQ FORM — 4 rule cho "Cộng trừ đa thức nhiều biến" (T108010202, khối 8, 51 câu). Đáp số là 1 ĐA THỨC
-- nhiều hạng tử (khác DẠNG 11/12 chỉ có 1 đơn thức) — TEXT_DANG với canon = re-parse từng hạng tử rồi format
-- lại theo thứ tự CỐ ĐỊNH (chuanHoaDaThuc/hienThiDaThuc), không phụ thuộc thứ tự kho ghi.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R126','Quên đổi dấu khi phá ngoặc trừ','Sai khái niệm căn bản — khi trừ 1 đa thức, chỉ đổi dấu hạng tử ĐẦU TIÊN của đa thức bị trừ, các hạng tử sau giữ nguyên dấu (quên phân phối dấu trừ)','$A-B$ với $B=2x-3y+1$ → đúng phải trừ cả 3 hạng tử ($-2x+3y-1$), nhầm chỉ đổi dấu hạng tử đầu ($-2x-3y-1$)','khai_niem','{T108010202}',false),
('R127','Đảo ngược toàn bộ phép tính','Đổi hết dấu cộng thành trừ và ngược lại trong toàn bộ phép tính, ra kết quả ngược dấu hoàn toàn so với đúng','Đề: $A-B$ → nhầm tính thành $B-A$ (kết quả ngược dấu toàn bộ so với đúng)','tinh','{T108010202}',false),
('R128','Chỉ lấy đa thức đầu, quên đa thức còn lại','Chỉ rút gọn đa thức ĐẦU TIÊN trong phép tính rồi lấy làm đáp số luôn, quên thực hiện phép cộng/trừ với các đa thức còn lại','Đề: Tính $A+B$ → nhầm chỉ ghi lại $A$ (đã rút gọn) làm đáp số, quên cộng $B$','khai_niem','{T108010202}',false),
('R129','Cộng trừ đa thức: lệch 1 đơn vị ở hệ số bậc cao nhất','Rule dự phòng — tính đúng cấu trúc nhưng hệ số của hạng tử bậc cao nhất lệch 1 đơn vị','Đúng=$2x^3y+3xy^2-11y^2-5y+46$ → nhầm hệ số hạng bậc cao nhất thành 3 ($3x^3y+...$)','tinh','{T108010202}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
