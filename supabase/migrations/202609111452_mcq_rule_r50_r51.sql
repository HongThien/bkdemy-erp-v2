-- MCQ FORM — R50 (STP tuần hoàn/Làm tròn) + R51 (So sánh tìm x,y): đo thật cho thấy R38/R39/R40 không đủ với
-- câu dạng đơn giản nhất "0,(D)" (phần nguyên = 0, không có phần không lặp — cả 3 rule đều vô hiệu vì điều
-- kiện áp dụng không thoả), và R45/R46/R47 không đủ với dạng "tìm x,y nguyên" (R45 chỉ áp khi mẫu x≠mẫu y,
-- nhóm câu đó lại bị parseHuuTi loại từ trước vì x=y trùng giá trị — R45 gần như không có đất dùng thật).
-- R04 (đã có sẵn trong catalog, "lấy dấu kết quả sai") ĐƯỢC TÁI DÙNG cho STP tuần hoàn — không cần insert mới.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R50','Sai mẫu — quên trừ 1','Đổi STP tuần hoàn ra phân số nhưng mẫu dùng 10^q (luỹ thừa trơn) thay vì 10^q−1 (dãy số 9)','$0,(6)=\dfrac{6}{10}=\dfrac{3}{5}$ (đúng: mẫu phải là 9, ra $\dfrac{2}{3}$)','khai_niem','{07702011103,0770201102}',false),
('R51','Lấy thẳng 2 số ở 2 đầu','Tìm x,y nguyên trong A<x/d<y/d<B nhưng lấy thẳng A,B (quy đổi cùng đơn vị) làm x,y, không tìm số nguyên NẰM GIỮA','$\dfrac{-8}{15}<\dfrac x{15}<\dfrac y{15}<\dfrac{-1}{3}$ → x=-8,y=-5 (đúng: x=-7,y=-6, 2 số NẰM GIỮA 2 cận)','khai_niem','{T107010103}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
