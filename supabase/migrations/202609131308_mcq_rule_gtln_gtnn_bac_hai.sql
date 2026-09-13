-- MCQ FORM — 4 rule cho "GTLN-GTNN của biểu thức bậc hai" (T108020105, khối 8, 48 câu). Đáp số là 1 GIÁ
-- TRỊ HỮU TỈ — SPECIAL_DANG, tái dùng cơ chế tách bình phương của DẠNG 27 (đáp số = hằng số q).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R204','Quên trừ lại phần thừa','Coi GTLN/GTNN bằng thẳng hằng số gốc C, quên trừ lại phần bù $Ap^2$ khi tách bình phương','$3x^2-4x+5$ đúng GTNN=$11/3$ → nhầm ra $5$ (hằng số gốc)','khai_niem','{T108020105}',false),
('R205','Nhầm dấu phần bù','Cộng thay vì trừ phần bù $Ap^2$ khi tính GTLN/GTNN','Đúng=$11/3$ → nhầm ra $19/3$ (cộng thay vì trừ $Ap^2$)','khai_niem','{T108020105}',false),
('R206','Quên chia 2 khi tìm p','Tìm $p$ quên chia 2 (coi $p=B/A$), dẫn tới tính sai GTLN/GTNN theo $p$ sai','Đúng=$11/3$ → nhầm ra $-1/3$','khai_niem','{T108020105}',false),
('R207','GTLN-GTNN bậc 2: lệch 1 đơn vị','Rule dự phòng — tính đúng cách nhưng GTLN/GTNN lệch 1 đơn vị','Đúng=$11/3$ → nhầm ra $14/3$','tinh','{T108020105}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
