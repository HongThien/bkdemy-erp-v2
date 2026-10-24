-- ============================================================================
-- 202610241205 — mcq_rule_dau_hieu_chia_het_2_5
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Sinh câu trắc nghiệm (form TN) cho dạng bài bản đồ mới NDB00372 "Nhận biết số chia hết cho 2, chia hết cho 5"
--   (câu kho dạng cũ T106030201, 10 câu tự luận đã duyệt, đáp số = 2 danh sách số). Dạng đang 0 câu MCQ ⇒ bổ trợ
--   (chỉ dùng MCQ) không ra bài được. Kho rule chưa có lỗi nào về DẤU HIỆU chia hết cho 2/5 ⇒ thêm 4 lỗi thật của HS
--   lớp 6 (nhiễu sinh bằng máy từ chính dãy số đề cho — scripts/lib/mini-dang.mjs DẠNG 58 `nhanBietChiaHet25`).
--   Kiểm trước khi đặt mã (spec-mcq-quy-trinh-sinh §0, so theo SỐ):
--   select max((regexp_replace(ma,'[^0-9]','','g'))::int) from dai_mcq_rule where ma like 'R%'  → 370 (24/10 12:05).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không — chỉ INSERT 4 dòng rule mới.
-- ============================================================================
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R371', 'Chia hết cho 5: chỉ lấy số tận cùng 5', 'Nhớ dấu hiệu chia hết cho 5 thiếu: chỉ lấy số có chữ số tận cùng là 5, bỏ sót các số tận cùng là 0', 'Đúng: 135; 110; 25 → nhầm: 135; 25', 'khai_niem', '{T106030201}', false),
('R372', 'Số tận cùng 0 chỉ xếp vào một nhóm', 'Số tận cùng 0 chia hết cho CẢ 2 và 5 nhưng chỉ xếp nó vào nhóm chia hết cho 5, bỏ khỏi nhóm chia hết cho 2', 'Đúng (chia hết cho 2): 48; 72; 110; 164 → nhầm: 48; 72; 164', 'khai_niem', '{T106030201}', false),
('R373', 'Xét chữ số đầu thay vì chữ số tận cùng', 'Dấu hiệu chia hết cho 2 xét nhầm chữ số hàng cao nhất (chữ số đầu tiên) chẵn thay vì chữ số tận cùng chẵn', '25 có chữ số đầu 2 chẵn ⇒ nhầm là chia hết cho 2', 'khai_niem', '{T106030201}', false),
('R374', 'Đảo hai dấu hiệu chia hết cho 2 và cho 5', 'Nhớ lẫn hai dấu hiệu nên xếp nhóm số chia hết cho 2 sang nhóm chia hết cho 5 và ngược lại', 'Chia hết cho 2: 135; 110; 25 · chia hết cho 5: 48; 72; 110; 164', 'khai_niem', '{T106030201}', false);
