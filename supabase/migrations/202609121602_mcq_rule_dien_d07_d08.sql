-- ============================================================================
-- 202609121602 — Rule Điền Ô D07–D11 (tên file ghi d07_d08 lúc tạo, sau đó CEO thêm yêu cầu nên gộp tới D11 — không đổi tên
--   file vì migrate.mjs khoá theo tên) — khuôn GTLN/GTNN, CEO duyệt mẫu lần 2 (12/09 16:00)
-- ----------------------------------------------------------------------------
-- CEO 12/09: (1) "dòng đầu tiên quan trọng, cái dòng |2x−3| ≥ 0 ấy, cần 1 câu chỗ này" ⇒ ô0 đục cả bất đẳng thức đầu, 4 mệnh đề
--   trọn vẹn: đúng · > 0 (D03) · ≤ 0 (D07) · bỏ vỏ |…|/√/(…)², "2x−3 ≥ 0" (D08).
-- (2) "cả mấy dòng biến đổi nữa: 2|x−4| ≥ 0 → 2|x−4|+17 ≥ 17 cũng đáng làm câu; A ≥ 17 thì bỏ" ⇒ mỗi dòng biến đổi 1 ô,
--   phương án sai: đảo bừa khi không được đảo (D10) · sai dấu hằng số vế phải (D09) · nhân k vào vế phải 0 (D11).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('D07','Nhầm chiều tính chất không âm','Viết $|…|\le0$, $\sqrt{…}\le0$, $(…)^2\le0$ thay vì $\ge0$','$|2x-3|\le0$','khai_niem','{077022220401}',false),
('D08','Bỏ vỏ |…| / √ / (…)², coi bên trong ≥ 0','Nhầm điều kiện xác định / biểu thức bên trong với tính chất không âm của cả cụm','$|2x-3|\ge0$ viết thành $2x-3\ge0$','khai_niem','{077022220401}',false),
('D09','Sai dấu hằng số khi cộng vào 2 vế','Cộng $c$ vào 2 vế nhưng vế phải viết $0-c$ (hoặc ngược lại)','$2|x-4|+17\ge0-17$','tinh','{077022220401}',false),
('D10','Đảo chiều khi cộng hằng / nhân số dương','Không được đảo chiều mà đảo (cộng hằng số hoặc nhân với số dương giữ nguyên chiều)','$2|x-4|+17\le0+17$','khai_niem','{077022220401}',false),
('D11','Nhân k vào vế phải 0 thành k','Nhân 2 vế với $k>0$, vế phải $0$ viết thành $k$','$2|x-4|\ge2$','tinh','{077022220401}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
