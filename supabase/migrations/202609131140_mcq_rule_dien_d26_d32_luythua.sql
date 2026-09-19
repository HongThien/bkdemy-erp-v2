-- ============================================================================
-- 202609131140 — Rule Điền Ô D26–D32 (max ma trước khi seed = D25) — khuôn "dãy luỹ thừa cùng cơ số" (T106020601)
-- ----------------------------------------------------------------------------
-- CEO 13/09: "đặc biệt hay sai dấu biến đổi khi trừ 2 dãy cho nhau" ⇒ 2 vị trí đo (scripts/lib/dien-khuon-luythua.mjs):
--   'hieu_2_day' (kết quả sau khi cộng/trừ 2 dãy, D26–D28) — khuôn con "step≥2" trùng lặp giá trị nên đục 'he_so' thay
--   (D29–D31) · 'tim_m' (chỉ 11 câu có thêm đề bài "Tìm m", D27/D28/D32 dùng lại tinh thần D27/D28).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('D26','Nhầm dấu khi cộng/trừ 2 dãy cho nhau','Dãy cùng dấu phải TRỪ (hoặc dãy đan dấu phải CỘNG) nhưng làm ngược lại, ra sai dấu kết quả','$3B-B=3^{101}+1$ thay vì $3^{101}-1$','khai_niem','{T106020601}',false),
('D27','Quên cộng thêm bước nhảy vào số mũ','Dùng luôn số mũ cuối của đề (chưa nhân thêm hệ số) làm số mũ kết quả','$3^{100}-1$ thay vì $3^{101}-1$ (thiếu +1)','khai_niem','{T106020601}',false),
('D28','Cộng thừa bước nhảy vào số mũ','Cộng nhầm 2 lần bước nhảy (hoặc quá tay) vào số mũ kết quả','$3^{102}-1$ thay vì $3^{101}-1$','tinh','{T106020601}',false),
('D29','Dùng nhầm hệ số (cơ số − 1)','Khuôn bước nhảy ≥2: quên luỹ thừa cơ số lên bước nhảy trước khi trừ 1, dùng thẳng cơ số−1','hệ số $2-1=1$ thay vì $2^2-1=3$','khai_niem','{T106020601}',false),
('D30','Nhầm dấu khi tính hệ số','Tính hệ số bằng cộng thay vì trừ: $(cơ số)^{bước}+1$ thay vì $-1$','hệ số $2^2+1=5$ thay vì $2^2-1=3$','khai_niem','{T106020601}',false),
('D31','Tính hệ số lệch 1 đơn vị','Tính đúng cách nhưng lệch 1 đơn vị ở hệ số','hệ số $4$ thay vì $3$','tinh','{T106020601}',true),
('D32','Tính m lệch 1 đơn vị','Tính đúng cách (cộng 1 vào 2 vế) nhưng ra sai 1 đơn vị ở giá trị m','$m=32$ thay vì $m=31$','tinh','{T106020601}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
