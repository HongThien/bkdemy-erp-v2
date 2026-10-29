-- Xoá 4 dòng CỘNG TAY TRÙNG (bấm 2 lần) trong sổ xu — Thùy 29/10: "các trường hợp cộng dưới 10s là cộng trùng - m tự xóa nhé".
-- Tiêu chí: 2 dòng cong_tay liền nhau của cùng HS, CÙNG số xu, cùng người ghi, cùng lý do, cách nhau < 10 giây ⇒ xoá dòng SAU, giữ dòng trước.
-- Dò 29/10 (scripts/soat-xu-bat-thuong.sql + lag theo HS): đúng 4 cặp; không có cặp < 10 s nào khác điều kiện.
-- Ghi lại nguyên dòng bị xoá (sổ không có trigger log, không bảng nào FK vào sổ):
--   id dòng xoá                           | amount | created_at (UTC)              | dòng giữ lại (cùng HS, cùng người ghi)
--   9d02ca1a-7a3b-485d-a412-919eac426bf8   | 10     | 2026-09-13 01:41:45.675632+00 | ed4c6ee3-3b91-46dc-abba-7fb23ab4762a (6,1 s trước)
--   df61e8e4-8900-43e9-ae95-44a206aa1f4e   | 10     | 2026-09-14 11:43:19.791246+00 | 92049e03-0983-4be8-8cd1-25676b588127 (3,4 s trước)
--   1dc1e1d3-d0a4-4936-919c-bf152080576a   | 20     | 2026-09-20 11:07:44.018158+00 | d6d5a87a-a988-4d5e-a64a-1a3150bd69e2 (4,0 s trước)
--   27e18adf-f6b3-418c-9937-2d84839391a8   | 100    | 2026-10-27 10:44:20.227777+00 | f3da11bd-5cc7-423c-a18b-93b04b3c051c (5,5 s trước)
--   (cả 4 dòng ly_do NULL, loai 'cong_tay')
-- Tổng bớt 140 xu. 1 HS về số dư âm (−59) vì đã đổi quà bằng số xu trùng — ví được âm theo luật 06/10.
do $$
declare n int;
begin
  delete from public.qlht_xu_ledger
  where loai = 'cong_tay' and (id, amount) in (
    ('9d02ca1a-7a3b-485d-a412-919eac426bf8'::uuid, 10),
    ('df61e8e4-8900-43e9-ae95-44a206aa1f4e'::uuid, 10),
    ('1dc1e1d3-d0a4-4936-919c-bf152080576a'::uuid, 20),
    ('27e18adf-f6b3-418c-9937-2d84839391a8'::uuid, 100));
  get diagnostics n = row_count;
  if n <> 4 then raise exception 'Chỉ khớp % / 4 dòng — dừng, không xoá gì', n; end if;
end $$;
