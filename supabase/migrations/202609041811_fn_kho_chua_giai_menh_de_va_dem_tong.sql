-- 202609041811 — Bổ sung ngay sau 202609041808 (viết migration MỚI, không sửa file đã áp):
--  · fn_kho_cau_chua_giai: trả thêm `menh_de` (câu Đúng/Sai không có mệnh đề thì người giải không hiểu đề).
--  · fn_kho_dem_cau_chua_giai: p_mon NULL = gộp cả 3 môn (dropdown khối ở màn Duyệt là chung 3 môn,
--    cộng ở SQL chứ không cộng 3 kết quả ở client — §2.0).
-- MẤT GÌ (Luật xoá): không — drop/create lại function cùng tên (đổi kiểu trả về nên phải drop trước).

drop function if exists public.fn_kho_cau_chua_giai(text, text, int);
create or replace function public.fn_kho_cau_chua_giai(p_mon text, p_khoi text, p_limit int default 500)
returns table (
  ma_cau text, dang_chinh text, ten_dang text, ten_chuyen_de text, khoi text, loai_cau text,
  noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, anh_de text, nguon text, created_at timestamptz,
  yeu_cau_id uuid, yeu_cau_at timestamptz, yeu_cau_ghi_chu text
)
language plpgsql stable as $$
declare t text := public.fn_kho_tbl(p_mon);
begin
  if t is null then raise exception 'fn_kho_cau_chua_giai: môn không hợp lệ %', p_mon; end if;
  return query execute format($q$
    select c.ma_cau, c.dang_chinh, b.ten_dang, b.ten_chuyen_de, b.khoi, c.loai_cau,
           c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.anh_de, c.nguon, c.created_at,
           y.id, y.created_at, y.ghi_chu
    from %1$I c
    join %2$I b on b.ma_dang = c.dang_chinh
    left join %3$I y on y.ma_cau = c.ma_cau and y.xu_ly_at is null
    where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and b.khoi = $1
    order by c.dang_chinh, c.ma_cau
    limit $2
  $q$, t || '_cau_hoi', t || '_ban_do', t || '_cau_hoi_yeu_cau_giai') using p_khoi, p_limit;
end $$;
grant execute on function public.fn_kho_cau_chua_giai(text, text, int) to authenticated;

drop function if exists public.fn_kho_dem_cau_chua_giai(text);
create or replace function public.fn_kho_dem_cau_chua_giai(p_mon text default null)
returns table (khoi text, so_cau bigint, so_cho_giai bigint)
language plpgsql stable as $$
declare m text; t text; sql text := '';
begin
  if p_mon is not null and public.fn_kho_tbl(p_mon) is null then
    raise exception 'fn_kho_dem_cau_chua_giai: môn không hợp lệ %', p_mon;
  end if;
  foreach m in array (case when p_mon is null then array['toan','khtn','hgt'] else array[p_mon] end) loop
    t := public.fn_kho_tbl(m);
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
grant execute on function public.fn_kho_dem_cau_chua_giai(text) to authenticated;
