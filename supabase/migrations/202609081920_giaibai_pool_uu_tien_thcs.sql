-- Ưu tiên THCS khi tự nạp pool giải bài (Thùy 08/09: "Ưu tiên khối THCS trước đi").
-- fn_giaibai_pool: giữ nguyên chữ ký/kiểu trả về; chỉ đổi ORDER BY — bài khối 6–9 lên trước, phần còn lại giữ
-- thứ tự cũ (nhanh, nhom_ma, ma). Thứ tự nằm ở SQL (CLAUDE.md §2.0), auto-nap-hang-doi.mjs không đổi.
-- `khoi` là text ('4','5','8','9','10','11','12'…) nên so theo tập chữ, KHÔNG cast int (giá trị lạ sẽ nổ).
create or replace function public.fn_giaibai_pool(p_nhanh text[], p_khoi text, p_limit integer default 500, p_che_do text default 'giai')
returns setof public.v_giaibai_bai
language plpgsql stable as $$
begin
  if p_che_do = 'hoan_thien' then
    return query select * from public.v_giaibai_hoan_thien
      where nhanh = any(p_nhanh) and (p_khoi is null or khoi = p_khoi) and yc_id is null
      order by (khoi in ('6','7','8','9')) desc, nhanh, nhom_ma, ma limit p_limit;
  else
    return query select * from public.v_giaibai_bai
      where nhanh = any(p_nhanh) and (p_khoi is null or khoi = p_khoi) and yc_id is null
      order by (khoi in ('6','7','8','9')) desc, nhanh, nhom_ma, ma limit p_limit;
  end if;
end $$;
