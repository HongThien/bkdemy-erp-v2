-- 0065 — HS đọc được dòng LỚP mình đang học (để hiện tên lớp trong list BTVN online).
-- lop có member_all (0026) = chỉ staff; HS (không phải la_thanh_vien) bị chặn → thêm policy HS-scoped.
create policy lop_hs_read on lop for select to authenticated
  using (public.hs_o_lop(id));
