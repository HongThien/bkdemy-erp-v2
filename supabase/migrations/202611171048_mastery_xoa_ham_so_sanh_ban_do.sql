-- 17/11/2026 · Thùy "Xoá cả A–F" — mục F: gỡ màn so sánh mastery bản đồ cũ ↔ mới (nút 🔀 Mastery ở Bản đồ mới, chỉ admin; src/screens/kho/MasteryBdmCongTac.tsx đã xoá cùng commit).
-- Công cụ một lần để bật bản đồ mới (27/10), đã bật hẳn. Công tắc mastery_ban_do_moi GIỮ (cấp 1 còn bản đồ cũ); đổi công tắc từ nay qua fn_he_thong_cong_tac_dat ở SQL.
drop function public.fn_mastery_bdm_so_sanh(uuid);
