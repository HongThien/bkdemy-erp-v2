-- MCQ FORM — 2 rule lỗi cho dạng "x ở SỐ MŨ" (vd 3^x=27) trong 077022022203 "Tìm x liên quan Căn bậc hai" —
-- 6 câu dạng (A^x - c)(√(x²+d) - e) = 0 trước đây bị bỏ ("số mũ lạ", parser không hiểu x làm số mũ). Đọc lời giải
-- chi tiết (loi_giai, 09/09→11/09) rồi đề xuất — CEO chốt qua chat 11/09, đúng quy trình HANDOFF ②.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R36','Quên phép luỹ thừa (số mũ ẩn)','Giải a^x=k nhưng quên hẳn phép luỹ thừa, lấy luôn k làm nghiệm x','$3^x=27\Rightarrow x=27$ (đúng: $x=3$)','khai_niem','{077022022203}',false),
('R37','Coi luỹ thừa là nhân (số mũ ẩn)','Giải a^x=k bằng cách coi a^x là a·x (phép nhân), suy ra x=k:a','$3^x=27\Rightarrow x=27:3=9$ (đúng: $x=3$)','khai_niem','{077022022203}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
