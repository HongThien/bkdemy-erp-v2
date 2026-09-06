-- 202609041905 — fn_kho_dem_cau_chua_giai nhận DANH SÁCH NHÁNH thay vì 1 môn/null (Thùy 04/09: "Sao KHTN cứ
-- lẫn vào Toán. KHTN là MÔN. Ai phụ trách môn nào mới thấy môn đó"). Màn Duyệt lời giải giờ scope theo MÔN
-- (Toán = nhánh toan+hgt+hinh · KHTN = khtn) như KhoScreen — dropdown khối đếm theo đúng tập nhánh của môn
-- đang chọn, KHÔNG cộng chéo môn. Bản cũ (p_mon text: null = gộp cả 4 nhánh) chính là chỗ lẫn → bỏ.
-- MẤT GÌ (Luật xoá): drop signature cũ fn_kho_dem_cau_chua_giai(text) (client duy nhất gọi = màn này, sửa cùng lúc).
drop function if exists public.fn_kho_dem_cau_chua_giai(text);
create or replace function public.fn_kho_dem_cau_chua_giai(p_nhanh text[])
returns table (khoi text, so_cau bigint, so_cho_giai bigint)
language plpgsql stable as $$
declare m text; t text; sql text := '';
begin
  if p_nhanh is null or cardinality(p_nhanh) = 0 then return; end if;
  foreach m in array p_nhanh loop
    if m = 'hinh' then
      sql := sql || case when sql = '' then '' else ' union all ' end ||
        ' select h.khoi, 1::bigint as so_cau, (h.yeu_cau_id is not null)::int::bigint as so_cho_giai from public.v_hinh_chua_giai h ';
      continue;
    end if;
    t := public.fn_kho_tbl(m);
    if t is null then raise exception 'fn_kho_dem_cau_chua_giai: nhánh không hợp lệ %', m; end if;
    sql := sql || case when sql = '' then '' else ' union all ' end || format($q$
      select b.khoi, 1::bigint as so_cau, (y.id is not null)::int::bigint as so_cho_giai
      from %1$I c
      join %2$I b on b.ma_dang = c.dang_chinh
      left join %3$I y on y.ma_cau = c.ma_cau and y.xu_ly_at is null
      where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null
    $q$, t || '_cau_hoi', t || '_ban_do', t || '_cau_hoi_yeu_cau_giai');
  end loop;
  return query execute 'select u.khoi, sum(u.so_cau)::bigint, sum(u.so_cho_giai)::bigint from (' || sql || ') u group by u.khoi';
end $$;
grant execute on function public.fn_kho_dem_cau_chua_giai(text[]) to authenticated;
