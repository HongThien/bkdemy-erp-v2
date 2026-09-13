-- MCQ FORM — 4 rule cho "Phân tích ĐTTNT — tách hạng tử, TỔNG QUÁT" (T108030104, khối 8): mở rộng DẠNG 40
-- (tam thức bậc hai hệ số=1) cho Ax²+Bx+C với A≠1 và/hoặc đẳng cấp 2 biến Ax²+Bxy+Cy² qua AC-method + nhóm
-- hạng tử (tái dùng máy nhóm của DẠNG 39). T108030104 dùng CHUNG dang_chinh cho cả 2 sub-shape (A=1,1 biến
-- qua R285-288 có sẵn; A≠1/2 biến qua R289-292 mới) — nối thêm T108030104 vào ap_dung của R285-288.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R289','Tách hạng tử tổng quát: nhầm dấu khi ghép 2 nhóm','Tách và rút nhân tử chung đúng ở mỗi nhóm nhưng nhầm dấu khi ghép 2 nhóm lại','$x^2-4x-12$ đúng=$(x+2)(x-6)$ → nhầm ghép sai dấu khi kết hợp 2 nhóm','khai_niem','{T108030104}',false),
('R290','Tách hạng tử tổng quát: quên rút thêm ở phần còn lại','Tách và nhóm đúng nhưng dừng lại, quên rút thêm 1 lớp nhân tử chung nữa ở phần còn lại','Đúng cấu trúc nhưng dừng sớm 1 bước','khai_niem','{T108030104}',false),
('R291','Tách hạng tử tổng quát: lệch 1 đơn vị trong ngoặc còn lại','Rule dự phòng — đúng cấu trúc nhưng hệ số hạng tử bậc cao nhất ở ngoặc còn lại lệch 1 đơn vị','Đúng cấu trúc nhưng lệch 1 đơn vị hệ số','tinh','{T108030104}',false),
('R292','Tách hạng tử tổng quát: lệch 1 đơn vị trong ngoặc còn lại, chiều ngược lại','Rule cứu, chiều ngược lại R291','Đúng cấu trúc nhưng lệch 1 đơn vị hệ số theo chiều ngược lại','tinh','{T108030104}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;

update dai_mcq_rule set ap_dung = ap_dung || '{T108030104}'::text[]
where ma in ('R285', 'R286', 'R287', 'R288') and not ('T108030104' = any(ap_dung));
