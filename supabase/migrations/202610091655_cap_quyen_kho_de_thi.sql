-- ============================================================================
-- Cấp quyền lá mới "Kho đề thi" (khodethi) — Thùy 09/10: "Đề thi cần có riêng 1 lá, tên là Kho đề thi, ở dưới Kho tài liệu."
-- Trước đây Kho đề thi là tab trong lá Nhập kho (nhapkho) ⇒ ai đang vào được Nhập kho thì vào được đề thi.
-- Tách lá thì phải cấp lá mới cho đúng những vai trò đó, cùng mức chỉ-xem, để không ai mất màn đang dùng.
-- Admin (la_admin) thấy mọi lá, không cần dòng.
--
-- MẤT GÌ: không xoá/thu hẹp gì — chỉ THÊM dòng vai_tro_chuc_nang. Chạy lại vô hại (on conflict do nothing).
-- ============================================================================

insert into public.vai_tro_chuc_nang (vai_tro_id, chuc_nang, chi_xem)
select vai_tro_id, 'khodethi', chi_xem
from public.vai_tro_chuc_nang
where chuc_nang = 'nhapkho'
on conflict (vai_tro_id, chuc_nang) do nothing;
