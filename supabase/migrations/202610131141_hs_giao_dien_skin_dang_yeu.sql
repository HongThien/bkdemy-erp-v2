-- Style "Đáng yêu" (cảm hứng Chiikawa) cho app HS — Thùy 11/10: tên trong app "Đáng yêu", làm song song với Thị trấn; 13/10: "dựng Đáng yêu".
-- Đơn hình: design/DON-HANG-STYLE-NHO-XINH.md · code: src/screens/hocsinh/skin/styles/dangYeu.ts.
--
-- Nới CHECK hs_giao_dien.skin thêm 'dang_yeu'. Thiếu bước này ⇒ em chọn Đáng yêu bấm Lưu là DB chặn ("violates check constraint")
-- (CLAUDE.md §2.1). GIỮ mọi giá trị đang có: toi_gian / dau_truong / y2k / soft / rpg / khoi / lofi (lofi thêm ở mig 202610120117).
-- Tìm ràng buộc theo NỘI DUNG (check có cột skin) rồi bỏ — không đoán tên (khuôn mig 202610030147). Chạy lại vô hại.

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
  check (skin in ('toi_gian', 'dau_truong', 'y2k', 'soft', 'rpg', 'khoi', 'lofi', 'dang_yeu'));
