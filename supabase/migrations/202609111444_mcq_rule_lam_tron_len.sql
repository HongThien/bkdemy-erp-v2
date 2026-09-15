-- MCQ FORM — thêm R48+R49 cho dạng Làm tròn STP: kiểu đề "đến chữ số thập phân thứ N" chỉ có R42+R43 (2 rule)
-- là KHÔNG đủ 3 distractor — đo thật (mig 202609111439 mới áp): 25/30 câu kiểu này chỉ ra 2 distractor.
-- R43 ("luôn về 0") và R48 ("luôn làm tròn lên") LUÔN có đúng 1 cái TRÙNG đáp án đúng tuỳ chữ số kế tiếp ≥5 hay
-- <5 — chỉ 1 trong 2 dùng được mỗi câu. Cần thêm trục ĐỘC LẬP thứ ba (lệch VỊ TRÍ ngược hướng R42) mới đủ 3.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R48','Luôn làm tròn lên','Cứ làm tròn LÊN (như hàm ceil) bất kể chữ số kế tiếp là gì, không so sánh với 5','Làm tròn 64,73286 đến chữ số thứ hai → 64,74 (đúng: 64,73, vì chữ số thứ ba là 2<5)','khai_niem','{0770201102}',false),
('R49','Đếm thừa 1 chữ số khi làm tròn','Làm tròn "đến chữ số thập phân thứ N" nhưng đếm thừa 1, ra chữ số thứ N+1 (chiều ngược R42)','Làm tròn 73,46821 đến chữ số thứ hai → 73,468 (đúng: 73,47, chữ số thứ hai)','khai_niem','{0770201102}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
