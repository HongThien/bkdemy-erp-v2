-- ============================================================================
-- 202609080955 — kho_dem_hang_duyet_fix
-- ----------------------------------------------------------------------------
-- VÌ SAO: fn_kho_dem_hang_duyet (mig 202609080938) khai `stable` nhưng dùng temp table ⇒ Postgres từ chối
--   "CREATE TABLE is not allowed in a non-volatile function" ngay lần gọi đầu (bắt được khi test RPC bằng JWT giả lập,
--   trước khi lên màn). Viết lại KHÔNG temp table: ghép 1 câu SQL động `union all` cho từng (nhánh × bộ lọc) rồi
--   grouping sets — vẫn stable, 1 round-trip. Lịch sử migration bất biến ⇒ file MỚI, không sửa 0938.
-- MẤT GÌ: không (create or replace function).
-- ============================================================================
create or replace function public.fn_kho_dem_hang_duyet(p_nhanh text[])
returns table (loc text, khoi text, so_cau bigint)
language plpgsql stable security definer set search_path = public as $$
declare v_mon text; t text; v_loc text; v_sql text := '';
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  foreach v_mon in array p_nhanh loop
    t := public.fn_kho_tbl(v_mon);
    if t is null then continue; end if;   -- 'hinh' không có bảng câu dạng
    foreach v_loc in array array['cau_moi', 'moi', 'nghi', 'khong_kiem', 'ton_dong'] loop
      v_sql := v_sql || case when v_sql = '' then '' else ' union all ' end
        || format($q$select %L::text loc, b.khoi, count(*) n from %I c join %I b on b.ma_dang = c.dang_chinh where c.xoa_at is null and %s group by b.khoi$q$,
                  v_loc, t || '_cau_hoi', t || '_ban_do', public._kho_loc_duyet_sql(v_loc));
    end loop;
  end loop;
  if v_sql = '' then return; end if;
  return query execute 'select d.loc, d.khoi, sum(d.n)::bigint from (' || v_sql || ') d group by grouping sets ((d.loc, d.khoi), (d.loc)) order by 1, 2 nulls first';
end $$;
grant execute on function public.fn_kho_dem_hang_duyet(text[]) to authenticated;
