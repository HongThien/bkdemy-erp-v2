-- ============================================================================
-- 202611031857 — bdm_k3_k5_sang_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 03/11 "chuyển sang dùng bản đồ mới hết đi". Hai khối cuối còn giữ bản đồ cũ là Toán 3 và 5. Bật theo khối
--   như 4T (mig 202610262053) · 4 (202610281827) · 5T (202611010017): bỏ khỏi danh sách giữ bản đồ cũ ⇒ registry nhánh (bdm),
--   bộ chọn dạng, MT/ET/giáo trình (fn_kho_dung_ban_do_cu: lá ET/Giáo trình cũ thôi mở cho Toán 3 · 5), quy dạng mastery,
--   đánh giá cuối cấp (_dgcc_tham_so đọc hàm này) theo bản đồ mới.
--   Đo trước khi bật (03/11): câu sống có dạng bài bản đồ mới — khối 3: 1337/1337 · khối 5: 3572/4327 (kho chuẩn 3488/3744);
--   lượt đo quy được dạng bài — khối 3: 1374/1374 · khối 5: 14899/15092 (193 lượt bỏ trống ô, §1.5, tới khi câu được xếp).
--   Danh sách CẤP 1 của luật đo (_mastery_lan_do_quy, fn_tong_quan_hs, hs_cap1_cua_toi…) là chính sách khác, KHÔNG đổi.
--   Giữ hàm (một nơi quyết): quay lại = trả khối vào danh sách.
--
-- MẤT GÌ (Luật xoá): Không mất gì — chỉ thay thân 1 hàm (danh sách khối giữ bản đồ cũ thành rỗng).
-- ============================================================================
create or replace function _bdm_khoi_giu_cu(p_khoi text) returns boolean
language sql immutable as $$ select false $$;
