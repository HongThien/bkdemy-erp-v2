-- ============================================================================
-- 202609131719 — Rule Điền Ô D38–D40 (max ma trước khi seed = D37) — khuôn "an+b ⋮ cn+d" (T106030401)
-- ----------------------------------------------------------------------------
-- CEO 13/09: "Thêm 1 chỗ có thể làm được là chỗ 4 chia hết cho x-1 thì x-1 thuộc ước của 4. có thể làm câu hỏi ở
-- đấy 'x-1 thuộc ước của 4'" ⇒ thêm vị trí 'menh_de_uoc' (mệnh đề "denomExpr ∈ U(r)"), tách RIÊNG khỏi 'tap_uoc'
-- (chỉ đục tập số {...}). Nhờ có ô này, 1 câu r=1 (Ư(1)={1}, trước đó bị bỏ vì tap_uoc/tap_n thiếu distractor)
-- nay đủ ô trở lại — 139/139 câu.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('D38','Dùng biến gốc, quên biểu thức mẫu','Viết "x ∈ Ư(r)" thay vì "x−1 ∈ Ư(r)" — quên biểu thức mẫu số (chưa trừ/cộng hằng số)','$x\in U(4)$ thay vì $x-1\in U(4)$','khai_niem','{T106030401}',false),
('D39','Đảo vai trò trong quan hệ chia hết','Nhầm cái nào thuộc ước của cái nào — viết "r ∈ Ư(mẫu)" thay vì "mẫu ∈ Ư(r)"','$4\in U(x-1)$ thay vì $x-1\in U(4)$','khai_niem','{T106030401}',false),
('D40','Nhầm Ước (U) thành Bội (B)','Viết "∈ B(r)" (Bội) thay vì "∈ U(r)" (Ước)','$x-1\in B(4)$ thay vì $x-1\in U(4)$','khai_niem','{T106030401}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
