-- ============================================================================
-- 202611010017 — bdm_5t_sang_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 31/10: "MT của khối 5T làm theo bản đồ mới" → hỏi lại phạm vi → "toàn bộ". Bật theo khối như 4T (mig 202610262053)
--   và 4 (mig 202610281827): bỏ '5T' khỏi danh sách giữ bản đồ cũ ⇒ registry nhánh (bdm), bộ chọn dạng, MT/ET/giáo trình
--   (fn_kho_dung_ban_do_cu: lá ET/Giáo trình cũ thôi mở cho 5T), quy dạng mastery của khối 5T theo bản đồ mới.
--   Danh sách CẤP 1 của luật đo (client CAP1_KHOI, _mastery_lan_do, fn_tong_quan_hs, bổ trợ cấp 1…) là chính sách khác, KHÔNG đổi.
--   Đánh giá cuối cấp giữ RIÊNG 1 danh sách "khối dùng bản đồ cũ" (_dgcc_tham_so, mig 202610231549, gõ cứng '5T') ⇒ thôi giữ
--   riêng, đọc _bdm_khoi_giu_cu (một nơi quyết) — để lần bật khối sau không phải nhớ sửa 2 chỗ.
--   Quay lại = thêm '5T' vào lại _bdm_khoi_giu_cu (đánh giá cuối cấp tự theo).
--   ⚠ Câu 5T CHƯA xếp vào dạng bài bản đồ mới: không chọn được trong MT/ET bản đồ mới, và lượt đo của câu đó không quy được
--   dạng bài (mastery/dashboard bỏ trống ô, §1.5) cho tới khi câu được xếp.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ thay thân 2 hàm (bớt 1 khối trong danh sách; danh sách đánh giá cuối cấp đọc từ hàm chung).
-- ============================================================================

-- Khối nào còn GIỮ bản đồ cũ — MỘT nơi duy nhất. Bật thêm khối = bỏ khỏi danh sách.
create or replace function _bdm_khoi_giu_cu(p_khoi text) returns boolean
language sql immutable as $$ select coalesce(p_khoi, '') in ('3', '5') $$;

-- Đánh giá cuối cấp: khối dùng bản đồ cũ = các khối cuối cấp còn trong _bdm_khoi_giu_cu (không giữ danh sách riêng nữa).
-- Giữ nguyên chữ ký + cột (nguong_nhe/nguong_ro không còn ai đọc từ mig 202610231729, vẫn trả để không vỡ chữ ký).
create or replace function _dgcc_tham_so()
returns table(tu_ngay date, khoi text[], khoi_ban_do_cu text[], nguong_nhe numeric, nguong_ro numeric)
language sql immutable as $$
  select date '2026-06-15', array['5T', '9', '12'],
         array(select k from unnest(array['5T', '9', '12']) k where public._bdm_khoi_giu_cu(k)),
         3::numeric, 10::numeric
$$;
