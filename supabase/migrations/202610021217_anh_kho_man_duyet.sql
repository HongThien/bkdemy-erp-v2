-- ============================================================================
-- 202610021217 — anh_kho_man_duyet
-- ----------------------------------------------------------------------------
-- VÌ SAO: để GV Anh xem bản đồ + duyệt câu chờ duyệt ở màn Kho (CEO 02/10: "câu chưa chắc để chờ duyệt như Toán").
--   ① count_cau_by_dang chỉ nhận danh sách bảng cố định ⇒ bản đồ Anh báo "Lỗi" ⇒ thêm anh_cau_hoi.
--   ② fn_kho_hang_duyet luôn LEFT JOIN <tiền tố>_cum_bai ⇒ môn Anh không có bảng cụm ⇒ lỗi "relation does not exist".
--      Sửa: chỉ join khi bảng cụm tồn tại (to_regclass); không có ⇒ ten_cum = null. Toán/KHTN/HGT giữ y hành vi
--      (bảng cụm của họ đều có). Chữ ký hàm KHÔNG đổi (TS không phải sửa).
--   fn_kho_duyet_cau / fn_kho_tu_choi_cau: bản đang chạy đã nhận lua_chon và không đụng bảng cụm khi ma_cum null ⇒ KHÔNG sửa.
--   Hàm dựng từ bản đang chạy (pg_get_functiondef 02/10), chỉ vá đúng dòng nêu trên.
--
-- MẤT GÌ: không mất dữ liệu.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.count_cau_by_dang(p_tbl text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare result jsonb;
begin
  if not la_thanh_vien() then raise exception 'not a member'; end if;
  if p_tbl not in ('dai_cau_hoi', 'khtn_cau_hoi', 'hgt_cau_hoi', 'anh_cau_hoi') then raise exception 'invalid table %', p_tbl; end if;
  execute format(
    'select coalesce(jsonb_object_agg(dang_chinh, n), ''{}''::jsonb)
       from (select dang_chinh, count(*) n from %I where xoa_at is null group by dang_chinh) t',
    p_tbl
  ) into result;
  return result;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_kho_hang_duyet(p_mon text, p_loc text, p_khoi text DEFAULT NULL::text, p_limit integer DEFAULT 300)
 RETURNS TABLE(ma_cau text, dang_chinh text, ten_dang text, ten_chuyen_de text, khoi text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text, nguon text, nguon_giai text, giai_method text, created_at timestamp with time zone, ma_cum text, ten_cum text, da_duyet boolean, kho_chuan boolean, kiem_may text, kiem_may_boi text, kiem_may_ghi text, kiem_may_at timestamp with time zone, dang_ai_de_xuat text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare t text := public.fn_kho_tbl(p_mon); v_dk text := public._kho_loc_duyet_sql(p_loc);
        v_co_cum boolean;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_hang_duyet: môn không hợp lệ %', p_mon; end if;
  if v_dk is null then raise exception 'fn_kho_hang_duyet: bộ lọc không hợp lệ %', p_loc; end if;
  v_co_cum := to_regclass('public.' || t || '_cum_bai') is not null;   -- môn Anh chưa có bảng cụm
  return query execute format($q$
    select c.ma_cau, c.dang_chinh, b.ten_dang, b.ten_chuyen_de, b.khoi, c.loai_cau,
           c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai, c.anh_de, c.anh_dap_an,
           c.nguon, c.nguon_giai, c.giai_method, c.created_at,
           c.ma_cum, %5$s, c.da_duyet, c.kho_chuan,
           c.kiem_may, c.kiem_may_boi, c.kiem_may_ghi, c.kiem_may_at, c.dang_ai_de_xuat
    from %1$I c
    join %2$I b on b.ma_dang = c.dang_chinh
    %3$s
    where c.xoa_at is null and %4$s and ($1::text is null or b.khoi = $1)
    order by b.khoi, c.dang_chinh, c.ma_cau
    limit $2
  $q$, t || '_cau_hoi', t || '_ban_do',
       case when v_co_cum then format('left join %I m on m.ma_cum = c.ma_cum', t || '_cum_bai') else '' end,
       v_dk,
       case when v_co_cum then 'm.ten' else 'null::text' end) using p_khoi, p_limit;
end $function$;
