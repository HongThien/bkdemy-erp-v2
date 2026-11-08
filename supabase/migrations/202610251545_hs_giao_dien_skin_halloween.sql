-- ============================================================================
-- 202610251545 — hs_giao_dien_skin_halloween
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Style "Halloween" cho app HS (Thùy 24/10 chốt tên + chỉ chế độ tối; 25/10: "dựng code với bộ hình hiện tại").
--   Đơn hình: design/DON-HANG-STYLE-HALLOWEEN.md · code: src/screens/hocsinh/skin/styles/halloween.ts.
--   Nới CHECK hs_giao_dien.skin thêm 'halloween'. Thiếu bước này ⇒ em chọn Halloween bấm Lưu là DB chặn ("violates check constraint")
--   — và chỉ nhánh giá trị mới chết nên lỗi ẩn rất lâu (CLAUDE.md §2.1).
--   GIỮ mọi giá trị đang có: toi_gian / dau_truong / y2k / soft / rpg / khoi / lofi / dang_yeu — lấy từ schema.md (sinh 13/10 sau mig 202610131141)
--   + soát mọi migration đụng hs_giao_dien tới 25/10 (không có mig nào nới thêm). Máy soạn KHÔNG có chuỗi DB ⇒ chưa đối chiếu được DB thật:
--   trước khi áp, chạy `select pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.hs_giao_dien'::regclass and contype = 'c';`
--   — có giá trị nào NGOÀI danh sách dưới thì thêm vào rồi mới áp.
--   Tìm ràng buộc theo NỘI DUNG (check có cột skin) rồi bỏ — không đoán tên (khuôn mig 202610030147). Chạy lại vô hại.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất dữ liệu. Chỉ bỏ ràng buộc CHECK cũ trên cột skin rồi tạo lại ràng buộc RỘNG hơn (thêm 'halloween') trong cùng 1 transaction.
-- ============================================================================

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
  check (skin in ('toi_gian', 'dau_truong', 'y2k', 'soft', 'rpg', 'khoi', 'lofi', 'dang_yeu', 'halloween'));
