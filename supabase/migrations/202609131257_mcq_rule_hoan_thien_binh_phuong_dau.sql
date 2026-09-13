-- MCQ FORM — 4 rule cho sub-shape THỨ BA của T108020103: "$.....+20x+25=(...)^2$" (thiếu hạng ĐẦU, bậc 2).
-- 42/84 câu — sub-shape LỚN NHẤT trong 3 sub-shape trộn lẫn của dạng này.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R196','Hoàn thiện bình phương (đầu): quên bình phương √A','Tìm đúng √A nhưng QUÊN bình phương, điền hạng tử bậc 2 bằng √A thay vì A','$.....+20x+25=(2x+5)^2$ đúng hạng đầu=$4x^2$ → nhầm điền $2x^2$ (quên bình phương √A=2)','khai_niem','{T108020103}',false),
('R197','Hoàn thiện bình phương (đầu): nhầm dấu hạng tự do','Tìm đúng hạng tử bậc 2 nhưng nhầm dấu của hạng tự do trong nhị thức','Đúng nhị thức $2x+5$ → nhầm ra $2x-5$','khai_niem','{T108020103}',false),
('R198','Hoàn thiện bình phương (đầu): quên nhân đôi căn C','Khi tìm √A từ hệ số hạng giữa, quên chia cho 2 — coi √A = B/√C thay vì B/(2√C)','$.....+20x+25=(2x+5)^2$ đúng √A=2 (từ $20/(2\cdot5)$) → nhầm √A=4 (từ $20/5$, quên chia 2)','khai_niem','{T108020103}',false),
('R199','Hoàn thiện bình phương (đầu): lệch 1 đơn vị','Rule dự phòng — tìm đúng cấu trúc nhưng hạng tử bậc 2 cần điền lệch 1 đơn vị','Đúng=$4x^2$ → nhầm ra $5x^2$','tinh','{T108020103}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
