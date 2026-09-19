-- MCQ FORM — 4 rule cho "Viết biểu thức thành bình phương" (T108020102, khối 8, 63 câu — nghịch đảo
-- T108020101). Đáp số là 1 ĐA THỨC (nhị thức) — TEXT_DANG, tái dùng chuanHoaDaThuc/hienThiDaThuc.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R182','Quên căn hệ số bậc 2','Không lấy căn bậc hai của hệ số bậc 2, giữ nguyên hệ số trong nhị thức','$4x^2+20x+25=(2x+5)^2$ đúng → nhầm ra $4x+5$ (giữ nguyên hệ số 4, không lấy căn)','khai_niem','{T108020102}',false),
('R183','Nhầm dấu hạng tự do','Tìm đúng cả 2 số hạng nhưng nhầm dấu của hạng tự do trong nhị thức','$x^2-18x+81=(x-9)^2$ đúng → nhầm ra $x+9$','khai_niem','{T108020102}',false),
('R184','Quên căn hạng tự do','Không lấy căn bậc hai của hạng tự do, giữ nguyên hạng tự do trong nhị thức','$x^2-18x+81=(x-9)^2$ đúng → nhầm ra $x-81$ (giữ nguyên 81, không lấy căn)','khai_niem','{T108020102}',false),
('R185','Viết thành bình phương: lệch 1 đơn vị hạng tự do','Rule dự phòng — tìm đúng cấu trúc nhưng hạng tự do của nhị thức lệch 1 đơn vị','Đúng=$x-9$ → nhầm ra $x-8$','tinh','{T108020102}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
