-- Style "Lo-fi chill" cho app HS — Thùy 09/10: "giao diện mới: lofi chill … cho học sinh thích kiểu học 1 mình"; 12/10: "dựng code đi".
-- Đơn hình: design/DON-HANG-STYLE-LOFI.md · code: src/screens/hocsinh/skin/styles/lofi.ts.
--
-- Nới CHECK hs_giao_dien.skin thêm 'lofi'. Thiếu bước này ⇒ em chọn Lo-fi chill bấm Lưu là DB chặn ("violates check constraint")
-- (CLAUDE.md §2.1). GIỮ mọi giá trị đang có: còn em đang lưu toi_gian / dau_truong / y2k / soft / rpg / khoi.
-- Tìm ràng buộc theo NỘI DUNG (check có cột skin) rồi bỏ — không đoán tên (khuôn mig 202610030147).

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
  check (skin in ('toi_gian', 'dau_truong', 'y2k', 'soft', 'rpg', 'khoi', 'lofi'));
