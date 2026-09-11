-- MCQ FORM — 4 rule lỗi cho dạng TÍCH CÁC BIỂU THỨC = 0 (spec-mcq-form.md, dạng 077022022203 "Tìm x liên quan
-- Căn bậc hai"). CEO chốt 09/09 SAU KHI đọc lời giải chi tiết (loi_giai) của 3 câu mẫu + bàn cùng CTO — quy trình
-- ghi ở HANDOFF.md ②: đọc lời giải → liệt kê điểm rẽ sai → đề xuất → CEO chốt → mới code (xem DEVLOG 09/09).
--
-- R21 (đã có, "chỉ lấy nghiệm dương") KHÔNG áp được cho dạng này — pool luôn kèm "x≥0" (do có √x) nên "chỉ lấy
-- dương" chính là quy trình ĐÚNG, không phải lỗi. R32 là hình ảnh NGƯỢC LẠI: quên áp x≥0, giữ dư nghiệm âm.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R32','Quên áp miền x≥0','Giải tích=0 ra cả 2 nghiệm ± của thừa số bậc 2 nhưng quên lọc theo điều kiện x≥0 của đề, giữ luôn nghiệm âm không hợp miền','$(2\sqrt{x}-1)(4x^2-9)=0$ với $x\ge0$: đúng ra $x=\dfrac14$ hoặc $x=\dfrac32$, HS ghi thêm cả $x=-\dfrac32$','khai_niem','{077022022203}',false),
('R33','Giải nhầm thừa số vô nghiệm','Không nhận ra 1 thừa số dạng (…)²+hằng dương không bao giờ = 0, cứ chuyển vế bình thường rồi bỏ qua dấu âm khi khai căn, ra nghiệm ảo','$(9\sqrt{x}-4)(x^2+4)=0$: $x^2+4=0$ vô lí, HS vẫn "giải" ra $x=\pm2$ rồi cộng vào tập nghiệm','khai_niem','{077022022203}',false),
('R34','Quên khai căn khi giải bình phương','Giải $(\ldots)^2=k$ nhưng quên khai căn, lấy luôn $k$ làm nghiệm','$x^2=4\Rightarrow x=4$ (đúng: $x=\pm2$)','khai_niem','{077022022203,T107010404}',false),
('R35','Quên bình phương khi giải căn','Giải $\sqrt{\ldots}=k$ nhưng quên bình phương 2 vế, lấy luôn $k$ làm nghiệm','$\sqrt{x}=2\Rightarrow x=2$ (đúng: $x=4$)','khai_niem','{077022022203}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
