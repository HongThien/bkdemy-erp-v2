-- ============================================================================
-- 202609131200 — Rule Điền Ô D33–D37 — khuôn "dãy luỹ thừa" T106020601, THIẾT KẾ LẠI sau góp ý CEO vòng 2 (13/09)
-- ----------------------------------------------------------------------------
-- CEO: "chỗ 4^m=4^31 dễ quá — bỏ. Để ô trống ở chỗ tính 4C=..., 3C=..., 3C+1=...". Bỏ hẳn ô 'tim_m' (D32 hết dùng,
-- giữ nguyên không xoá — §2 CLAUDE.md không sửa/xoá seed đã áp). D29-D31 (khuôn 'he_so' bản trước) cũng hết dùng vì
-- thiết kế lại không còn nhánh "trùng lặp phải đục hệ số thay" (đục LẦN XUẤT HIỆN SỚM NHẤT nên hết ràng buộc đó).
-- 3 ô/câu mới: 'nhan_he_so' (số mũ sau khi nhân hệ số, D27+D33+D34) · 'hieu_2_day' (kết quả cộng/trừ 2 dãy, D26-D28,
-- ĐÃ SEED) · 'cong_1' (chỉ 11 câu "Tìm m", bước cộng 1 vào 2 vế TRƯỚC khi kết luận m, D35-D37).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('D33','Cộng thừa 1 lần bước nhảy vào số mũ (khi mới nhân hệ số)','Chưa trừ 2 dãy mà đã cộng thừa 1 lần bước nhảy vào số mũ của hạng tử cuối','$4^{32}$ thay vì $4^{31}$ ở bước vừa nhân hệ số','tinh','{T106020601}',false),
('D34','Cộng thừa 2 lần bước nhảy vào số mũ','Nhầm cộng 2 lần bước nhảy thay vì 1 lần khi nhân hệ số','$4^{33}$ thay vì $4^{31}$','tinh','{T106020601}',true),
('D35','Quên cộng 1 vào vế phải, giữ nguyên như dòng trước','Cộng 1 vào vế trái (VAR) mà quên cộng 1 vào vế phải, chép nguyên kết quả trừ 2 dãy trước đó','$3C+1=4^{31}-1$ thay vì $4^{31}$','khai_niem','{T106020601}',false),
('D36','Cộng nhầm 1 vào số mũ thay vì cả biểu thức','Hiểu nhầm "+1" là cộng vào số mũ chứ không phải cộng vào cả 2 vế phương trình','$4^{32}$ thay vì $4^{31}$','khai_niem','{T106020601}',false),
('D37','Sai dấu khi cộng 1 vào 2 vế','Đổi dấu cả biểu thức khi cộng 1 vào 2 vế','$-4^{31}$ thay vì $4^{31}$','tinh','{T106020601}',true)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
