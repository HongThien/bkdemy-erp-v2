-- Style 3 "Khối vuông" (cảm hứng Minecraft) cho app HS — Thùy 03/10: "thêm làm lựa chọn, dựng ngay".
-- Đơn hình: design/DON-HANG-STYLE-KHOI.md · kế hoạch: spec-giao-dien-hs.md §10 · code: src/screens/hocsinh/skin/styles/khoi.ts.
--
-- Nới CHECK hs_giao_dien.skin thêm 'khoi'. Thiếu bước này ⇒ em chọn Khối vuông bấm Lưu là DB chặn ("violates check constraint")
-- (CLAUDE.md §2.1). GIỮ mọi giá trị cũ: còn em đang lưu toi_gian / dau_truong / y2k / soft.
-- Ràng buộc gốc khai inline ở mig 202609281346 (Postgres tự đặt tên) ⇒ tìm theo NỘI DUNG (check có cột skin) rồi bỏ, không đoán tên.

do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    where c.conrelid = 'public.hs_giao_dien'::regclass and c.contype = 'c'
      and pg_get_constraintdef(c.oid) ilike '%skin%'
  loop
    execute format('alter table public.hs_giao_dien drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.hs_giao_dien
  add constraint hs_giao_dien_skin_check
  check (skin in ('toi_gian', 'dau_truong', 'y2k', 'soft', 'rpg', 'khoi'));
