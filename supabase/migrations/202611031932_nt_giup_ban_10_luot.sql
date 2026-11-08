-- NÔNG TRẠI — GIÚP BẠN 10 LƯỢT/NGÀY (Thùy 03/11 tối: "tạm thời cộng exp đi. 1 ngày tối đa được cộng 10 lần thôi nhé, ko vô hạn đâu").
-- Trước: 5 lượt × 4 EXP. Giờ: 10 lượt × 4 EXP = tối đa 40 EXP/ngày (≈ 2 ô ruộng của mình tưới đủ); xu vẫn qua trần 20 xu/tháng.
-- Điểm Friendship (thân thiết) Thùy nhắc: CHƯA làm — "tính sau".
-- _nt_luot_con đọc 'giup' từ đây ⇒ fn_nt_ban_giup tự chặn ở lượt thứ 11. Game: LUAT.giup = 10 (js/data.js) cho khớp.
create or replace function public._nt_luat() returns jsonb
language sql immutable as $$
  select '{"tuoiThem":0.8,"bonThem":0.25,"sauTiLe":0.25,"sauTru":0.2,"tromToiDa":0.2,"tromMoiLan":1,"trom":3,"giup":10,"choDuoi":[0,0.2,0.4,0.6],"tcMoc":[20,50,100],"mua0Ngay":60,"mua0Bonus":[0,0],"expGiup":4}'::jsonb
$$;
