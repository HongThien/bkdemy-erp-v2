-- 17/11/2026 · Thùy "Xoá cả A–F" — mục B · C · D · E (spec-mastery.md). Luật xoá: Thùy đã gật danh sách chính xác ngày 17/11.
-- B: bảng mastery_ban (5 dòng từ 10/11; cơ chế đánh dấu bẩn đã chuyển sang mastery_ban_log, không hàm / trigger / màn nào đọc ghi).
-- C: hàm _dy_so_nhom — không hàm / màn nào gọi.   D: hàm fn_mastery_nhom — không hàm / màn nào gọi.
-- E: bỏ đường lùi "mastery theo CÂU": _mastery_cells_core luôn theo LẦN · xoá _mastery_cells_cau · _mastery_theo_lan_bat() thành hằng true
--    (các nhánh "công tắc tắt" còn trong vài hàm cũ thành không bao giờ chạy) · xoá dòng công tắc mastery_theo_lan (log lịch sử công tắc giữ nguyên).
do $$ begin
  if md5(pg_get_functiondef('public._mastery_cells_core'::regproc)) <> 'daa9ddd1074a40e10927d45d6d2c7569' then raise exception 'Hàm _mastery_cells_core đã bị đổi sau lúc sinh — sinh lại'; end if;
  if md5(pg_get_functiondef('public._mastery_cells_cau'::regproc)) <> '63570c1e70e4d4243b3f4f394d369d38' then raise exception 'Hàm _mastery_cells_cau đã bị đổi sau lúc sinh — sinh lại'; end if;
  if md5(pg_get_functiondef('public._mastery_theo_lan_bat'::regproc)) <> '4630c0796f40461c316eadd66dbf8dea' then raise exception 'Hàm _mastery_theo_lan_bat đã bị đổi sau lúc sinh — sinh lại'; end if;
  if md5(pg_get_functiondef('public._dy_so_nhom'::regproc)) <> 'e89212c42166ec11198105d075e002ca' then raise exception 'Hàm _dy_so_nhom đã bị đổi sau lúc sinh — sinh lại'; end if;
  if md5(pg_get_functiondef('public.fn_mastery_nhom'::regproc)) <> '4095b507e5ed893b177ad95561289f0d' then raise exception 'Hàm fn_mastery_nhom đã bị đổi sau lúc sinh — sinh lại'; end if;
end $$;

-- E
CREATE OR REPLACE FUNCTION public._mastery_theo_lan_bat()
 RETURNS boolean
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  /* 17/11 Thùy: mastery LUÔN theo LẦN — đường lùi theo câu + công tắc mastery_theo_lan đã xoá. Hằng giữ cho các hàm cũ còn gọi. */
  select true
$function$;

CREATE OR REPLACE FUNCTION public._mastery_cells_core(p_bdm boolean, p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5, p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
 LANGUAGE plpgsql
 STABLE
AS $function$
begin
  -- 17/11: luôn theo LẦN (nhánh theo câu _mastery_cells_cau đã xoá)
  return query select * from public._mastery_lan_core(p_bdm, p_hs, p_include_btvn, p_since, p_den, 'dang', p_window, p_tin_cao, p_tin_tb);
end
$function$;

drop function public._mastery_cells_cau(boolean, uuid[], boolean, timestamptz, integer, integer, integer, timestamptz);
delete from he_thong_cong_tac where ma = 'mastery_theo_lan';

-- B · C · D
drop table public.mastery_ban;
drop function public._dy_so_nhom(jsonb);
drop function public.fn_mastery_nhom(uuid[], boolean, timestamptz, integer, integer, integer, timestamptz);
