-- ============================================================================
-- xoa_nguon_pham_vi_cu — Thùy 29/10 gật xoá (danh sách đã trình đủ): 3 nguồn phạm vi khối CŨ, đã thay bằng phan_cong_quan_ly_khoi
-- (spec-truong-khoi.md §2.4). Đã kiểm 29/10: không hàm / view / policy / FK nào đọc; client chỉ còn chú thích.
--   gay_quyen_khoi        (5 dòng — quyền gậy theo khối nhập tay 16/10)
--   vi_tri.khoi_quan_ly   (9 ghế có giá trị — khối ghi trên ghế trưởng/phó khối)
--   phan_cong_khoi        (12 dòng — phân công khối cũ tháng 8)
-- ============================================================================
do $$ begin
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
              where n.nspname = 'public' and (p.prosrc ~ 'gay_quyen_khoi' or p.prosrc ~ '\mphan_cong_khoi\M' or p.prosrc ~ '\.khoi_quan_ly\M')) then
    raise exception 'Còn hàm đọc nguồn cũ — dừng.';
  end if;
  if exists (select 1 from pg_policy pl where pg_get_expr(pl.polqual, pl.polrelid) ~ 'khoi_quan_ly|gay_quyen_khoi|phan_cong_khoi[^_]') then
    raise exception 'Còn policy đọc nguồn cũ — dừng.';
  end if;
end $$;

drop table gay_quyen_khoi;
drop table phan_cong_khoi;
alter table vi_tri drop column khoi_quan_ly;
