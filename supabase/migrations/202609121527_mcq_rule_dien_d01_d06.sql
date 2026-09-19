-- ============================================================================
-- 202609121527 — Rule lỗi riêng của ĐIỀN Ô (Đại), tiền tố D: D01–D06 — khuôn GTLN/GTNN (077022220401), CEO duyệt mẫu 12/09
-- ----------------------------------------------------------------------------
-- VÌ SAO tiền tố D thay vì R tiếp theo: cùng ngày 12/09, luồng form-tn (khối 8-9) chiếm đúng mã R tôi vừa đặt 2 lần trong
--   1 giờ (R89–R99 rồi R125–R129) — mã R cấp bằng max(ma)+1 giữa 2 luồng song song không thể an toàn, và "rule tồn tại
--   trong DB" khiến verify/trigger nuốt sai nghĩa. Tách không gian mã: R = form TN 4 đáp án (mcq-auto), D = Điền Ô (mcq-dien).
--   (R100–R104 của Điền Ô toán thực tế đã seed 202609121423 thì giữ nguyên.)
-- D01/D02/D03/D06 = ô kiểu QUAN HỆ (HS chọn chiều bất đẳng thức + vế phải) — CEO 12/09: "dòng nào đảo dấu đều có thể thử",
--   giữ phương án "quên dấu bằng". D04/D05 = ô giá trị x ở dấu bằng (phương trình E=0 quá đơn giản, rule số học chỉ ra 1–2 đường sai).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('D01','Không đảo chiều bất đẳng thức','Nhân 2 vế với số âm (hoặc lấy C − A, lấy nghịch đảo) mà giữ nguyên chiều','$\sqrt{2x-1}\ge0\Rightarrow-\sqrt{2x-1}\ge0$','khai_niem','{077022220401}',false),
('D02','Sai dấu hằng số khi kết luận GTLN/GTNN','Kết luận $A\ge c$ mà đổi dấu $c$ (viết $A\ge-c$)','$A\ge-2025$ thay vì $A\ge2025$','khai_niem','{077022220401}',false),
('D03','Quên dấu bằng, viết bất đẳng thức nghiêm ngặt','Viết $<$ / $>$ thay vì $\le$ / $\ge$ nên mất trường hợp dấu bằng xảy ra','$-\sqrt{2x-1}<0$','khai_niem','{077022220401}',false),
('D04','"= 0" thì ghi luôn x = 0','Thấy $|…|=0$ hoặc $(…)^2=0$ là kết luận $x=0$, không giải biểu thức bên trong','$|x-4|=0\Rightarrow x=0$','khai_niem','{077022220401}',false),
('D05','Chuyển vế đúng, quên chia cho hệ số của x','$ax+b=0\Rightarrow x=-b$ (quên chia cho $a$)','$2x-1=0\Rightarrow x=1$','tinh','{077022220401}',false),
('D06','Vừa không đảo chiều vừa bỏ dấu bằng','Viết $>$ ở chỗ đúng phải là $\le$ (kết hợp D01 + D03)','$-\sqrt{2x-1}>0$','khai_niem','{077022220401}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
