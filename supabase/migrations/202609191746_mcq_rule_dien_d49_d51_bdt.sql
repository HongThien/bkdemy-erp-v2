-- ============================================================================
-- 202609191746 — Rule Điền Ô D49–D51 (max ma trước khi seed = D48) — khuôn "chứng minh bất đẳng thức dãy phân số"
-- khối 7 nâng cao T107010504/505/506/507 (scripts/lib/dien-khuon-bdt.mjs)
-- ----------------------------------------------------------------------------
-- Khuôn đục CÚ PHÁP dòng so sánh giữa chứng minh (không mô hình hoá thuật toán chặn — mỗi câu tự chọn cách chia
-- nhóm riêng, không theo 1 công thức chung như hiệu tích/ancnd). 3 đường sai áp lên CHÍNH cụm văn bản đã đục:
-- đảo chiều bất đẳng thức · đếm nhầm số lượng số hạng trong nhóm/ngoặc · sai dấu cộng/trừ khi khai triển.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('D49','Đảo chiều bất đẳng thức','Đổi > thành < (hoặc ngược lại) ở bước so sánh/chặn giữa chứng minh, giữ nguyên phần còn lại','$>\dfrac14$ thay vì $<\dfrac14$','khai_niem','{T107010504,T107010505,T107010506,T107010507}',false),
('D50','Đếm nhầm số lượng số hạng trong nhóm','Hệ số nhân ngoài (hoặc chỉ số cuối) của 1 nhóm ngoặc bị lệch 1 đơn vị do đếm sai số hạng trong nhóm đó','$9.\dfrac1{40}$ thay vì $10.\dfrac1{40}$','tinh','{T107010504,T107010505,T107010506,T107010507}',false),
('D51','Sai dấu cộng/trừ khi khai triển','Đảo dấu +/- khi khai triển biểu thức ở vế đang so sánh','$\dfrac13+\dfrac14$ thay vì $\dfrac13-\dfrac14$','khai_niem','{T107010504,T107010505,T107010506,T107010507}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
