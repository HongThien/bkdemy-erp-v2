-- MCQ FORM — 2 rule CỨU (rescue) cho T108010504. R172/R173/R174 phụ thuộc CẤU TRÚC cụ thể của từng câu
-- (có cặp ngoặc ≥2 hạng, có trừ 1 cụm tích, có 2 giá trị thế KHÁC NHAU) — 18/57 câu (32%) không đủ 3 rule
-- vì biểu thức rút gọn đối xứng (hoán đổi biến vô hại) hoặc kho THIẾT KẾ để hạng tử chéo tự triệt tiêu
-- (đúng những câu đó cũng khiến "chỉ nhân hạng đầu" TRÙNG NGẪU NHIÊN với đáp án đúng). Thêm 2 rule số học
-- LUÔN khả dụng bất kể cấu trúc đại số, để đảm bảo đủ ≥3 distractor cho MỌI câu.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R176','Tính giá trị rút gọn: lệch kết quả 1 đơn vị chiều ngược lại','Rút gọn và thế số đúng nhưng kết quả cuối lệch 1 đơn vị theo chiều ngược lại với R175 — KHÔNG đánh dự phòng (du_phong=false) vì cần dùng ĐỒNG THỜI với R175 cho các câu cấu trúc đối xứng thiếu distractor','Đúng=-9 → nhầm ra -10','tinh','{T108010504}',false),
('R177','Sai dấu kết quả cuối cùng','Rút gọn và thế số đúng nhưng tính SAI DẤU kết quả cuối (ngược dấu hoàn toàn)','Đúng=-9 → nhầm ra 9','tinh','{T108010504}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
