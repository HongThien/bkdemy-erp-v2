-- Lớp 5 (MCQ batch 12/11): rule bổ sung vì bộ R395–R397 cho làm tròn LUÔN trùng đáp án đúng/trùng nhau khi chữ số sau hàng
-- làm tròn gần 9 (vd 39 986 → hàng nghìn), và NDB02072 chỉ có 2 rule (cần ≥3). Chỉ INSERT, không đụng rule cũ.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong, active) values
 ('R421', 'Làm tròn: tăng chữ số hàng làm tròn nhưng giữ nguyên các chữ số sau', 'Xét đúng chữ số quyết định (làm tròn lên) nhưng chỉ cộng 1 vào chữ số ở hàng làm tròn, KHÔNG thay các chữ số phía sau bằng 0.', '39 986 làm tròn đến hàng nghìn → 40 986', 'khai_niem', array['NDB02075']::text[], false, true),
 ('R422', 'Làm tròn: làm tròn đến hàng liền kề lớn hơn', 'Làm tròn đúng quy tắc nhưng tới hàng liền kề LỚN hơn hàng được yêu cầu (hàng chục nghìn thay vì hàng nghìn...).', '47 983 làm tròn đến hàng nghìn → 50 000 (hàng chục nghìn)', 'khai_niem', array['NDB02075']::text[], false, true),
 ('R423', 'Hàng và lớp: đúng hàng, nhầm tên lớp', 'Gọi đúng tên hàng nhưng nói lớp chứa nó sai (lớp liền kề: lớp triệu ↔ lớp nghìn ↔ lớp đơn vị).', 'Chữ số 5 ở hàng trăm nghìn, lớp nghìn → trả lời hàng trăm nghìn, lớp triệu', 'khai_niem', array['NDB02072']::text[], false, true)
on conflict (ma) do nothing;
