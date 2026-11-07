-- ============================================================================
-- NÔNG TRẠI — NGÂN SÁCH EXP THÁNG (Thùy 07/11: "vấn đề là tỉ trọng exp, không phải trần ngày hay trần tháng ·
-- khoá trần bị vô lý, phải thiết kế để học sinh chỉ có thể kiếm tối đa 20 xu").
-- Em chơi giỏi nhất, đủ 12 ô, ngày nào cũng chăm chỉ làm ra ≈ 2.000 EXP/tháng (= 20 xu); trần 20 xu (fn_nt_xu_dong_bo) chỉ còn là
-- lưới an toàn. Chia: cây + máy chế biến ≈ 1.500 · gà/bò ≈ 200 · giúp bạn/hái trộm ≈ 300. Tỉ lệ 100 EXP = 1 xu GIỮ NGUYÊN.
-- Số đo trước khi chỉnh (03→07/11): em chăm ~330 EXP/ngày; nguồn lớn nhất là BÁN PHÂN BÓN (mua 3 điểm học tập, bán 5 EXP, không giới hạn —
-- 1 em mua 605 bao, bón 5) ⇒ game (bản theo tài khoản) chặn bán phân bón; không có gì ở server cần chặn (server không giữ kho).
-- Ở đây: bản sao goc/gia của cây (nt_cay — dùng tính sản lượng ô của bạn khi hái trộm/giúp) + thưởng giúp bạn 4 → 1 EXP/lượt.
-- Đổi cùng game repo BKGame/NongTrai js/data.js (RUONG, LUAT.expGiup) — đổi 1 bên phải đổi cả bên kia.
-- ============================================================================

update public.nt_cay c set goc = v.goc, gia = v.gia
from (values
  ('lua_mi', 1.5, 1), ('ca_rot', 1.6, 1), ('ngo', 1.7, 2), ('khoai_tay', 3.5, 1), ('ca_chua', 1.8, 2), ('bi_ngo', 1.85, 3),
  ('hoa_huong_duong', 1.4, 4), ('dau_tay', 2.9, 2), ('ot', 1.7, 1), ('dua_hau', 1, 6), ('dau_nanh', 1.7, 1), ('lua_nuoc', 1.75, 2), ('mia', 1.9, 3)
) as v(id, goc, gia)
where c.id = v.id;

do $$ begin
  if (select count(*) from public.nt_cay) <> 13 or exists (select 1 from public.nt_cay where id not in
      ('lua_mi','ca_rot','ngo','khoai_tay','ca_chua','bi_ngo','hoa_huong_duong','dau_tay','ot','dua_hau','dau_nanh','lua_nuoc','mia')) then
    raise exception 'nt_cay có cây chưa có trong ngân sách 07/11 — thêm vào danh sách trên rồi áp lại';
  end if;
end $$;

create or replace function public._nt_luat() returns jsonb
language sql immutable as $$
  select '{"tuoiThem":0.8,"bonThem":0.25,"sauTiLe":0.25,"sauTru":0.2,"tromToiDa":0.2,"tromMoiLan":1,"trom":3,"giup":10,"choDuoi":[0,0.2,0.4,0.6],"tcMoc":[20,50,100],"mua0Ngay":60,"mua0Bonus":[0,0],"expGiup":1}'::jsonb
$$;
