-- MCQ FORM — "Tìm x ứng dụng hằng đẳng thức" (T108020602, khối 8, 40 câu) TÁI DÙNG NGUYÊN `timXQuaRutGon` +
-- rule R168-R171 đã viết cho T108010503 (DẠNG 22) — test tay 40/40 câu thật khớp 100%. Thêm 1 rule cứu MỚI
-- R263 (lệch nghiệm x trừ 1, chiều ngược lại R171) vì 2/40 câu có hệ số x=1 khiến R169/R170 trùng đáp số
-- đúng (giống lỗ hổng "hệ số=1" đã gặp nhiều lần trong phiên này) — thêm R263 cứu được 1/2, còn 1 câu
-- (T108020602010, hằng số=0 nên MỌI rule nhân/chia hệ số đều trùng 0) chấp nhận bỏ qua (§1.5).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R263','Tìm x ứng dụng hằng đẳng thức: lệch nghiệm x trừ 1 đơn vị','Rule cứu — đúng cấu trúc nhưng nghiệm x lệch 1 đơn vị theo chiều ngược lại với R171 (dùng khi hệ số x = 1 khiến R169/R170 trùng đáp số đúng)','Đúng $x=-1$ → nhầm ra $x=-2$','tinh','{T108020602}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;

update dai_mcq_rule set ap_dung = ap_dung || '{T108020602}'::text[]
where ma in ('R168', 'R169', 'R170', 'R171') and not ('T108020602' = any(ap_dung));
