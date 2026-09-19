-- MCQ FORM — 5 rule cho "Hoàn thiện biểu thức bình phương tổng/hiệu" (T108020103, khối 8, 84 câu). Đáp số
-- kho ghi 2 phần "C; nhị thức" — TEXT_DANG, canon chuẩn hoá riêng từng phần rồi ghép lại.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R187','Quên bình phương B','Tìm đúng B nhưng QUÊN bình phương, điền số hạng còn thiếu bằng B thay vì B²','$4x^2+12x+9=(2x+3)^2$ đúng, B=3 → nhầm điền $3$ thay vì $9$','khai_niem','{T108020103}',false),
('R188','Nhầm dấu hạng tự do','Tìm đúng cả C và cấu trúc nhưng nhầm dấu của hạng tự do trong nhị thức','Đúng nhị thức $2x+3$ → nhầm ra $2x-3$','khai_niem','{T108020103}',false),
('R189','Quên nhân đôi căn A','Khi tìm B từ hệ số hạng giữa, quên nhân đôi căn bậc hai của hệ số bậc 2 — coi $2B$ bằng thẳng hệ số giữa','$4x^2+12x+...$ đúng B=3 (từ $2\cdot2\cdot B=12$) → nhầm B=6 (từ $2B=12$, quên nhân với √4=2)','khai_niem','{T108020103}',false),
('R190','Hoàn thiện bình phương: lệch 1 đơn vị hạng tự do','Rule dự phòng — tìm đúng cấu trúc nhưng hạng tự do cần điền lệch 1 đơn vị','Đúng=9 → nhầm ra 10','tinh','{T108020103}',true),
('R191','Hoàn thiện bình phương: lệch 1 đơn vị hệ số biến','Tìm đúng hạng tự do và cấu trúc nhưng hệ số của biến trong nhị thức lệch 1 đơn vị','Đúng nhị thức $x+1$ → nhầm ra $2x+1$','tinh','{T108020103}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
