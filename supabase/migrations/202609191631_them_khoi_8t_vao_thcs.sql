-- ============================================================================
-- 202609191631 — them_khoi_8t_vao_thcs
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 19/09/2026): thêm khối '8T' — khối RIÊNG, vai trò như '4T'/'5T' ở
-- mọi nơi (client: KHOI_OPTIONS), và LÀ KHỐI THCS. Quét pg_proc/pg_views/
-- pg_constraint trên DB live (scripts/_q_khoi_thcs_scan.mjs) ⇒ đúng 2 hàm ghi
-- cứng danh sách THCS `('6','7','8','9')`, thiếu '8T' thì:
--   • hs_cap2_cua_toi()  — HS khối 8T bị coi KHÔNG phải cấp 2 ⇒ mất các tính
--     năng app HS mở theo cấp 2 (vd May mắn).
--   • fn_giaibai_pool()  — bài khối 8T không được ưu tiên THCS khi xếp hàng giải.
-- Danh sách cấp 1 `('3','4','4T','5','5T')` (hs_cap1_cua_toi, fn_mastery_cells)
-- ĐÚNG là không chứa '8T' — không đụng. Mã bản đồ 'T18T…' đã hợp lệ sẵn với
-- regex `(\d{2}|\dT)` của fn_dai_ma_hop_le (202609180055) — không cần nới.
-- Không có CHECK nào trên cột khoi chặn '8T'.
--
-- Thân hàm lấy NGUYÊN VĂN từ pg_get_functiondef DB live 19/09, chỉ đổi đúng
-- danh sách khối. Chữ ký giữ nguyên ⇒ create or replace, ACL/owner không đổi.
--
-- MẤT GÌ: KHÔNG xoá gì.
-- ============================================================================

create or replace function public.hs_cap2_cua_toi()
 returns boolean
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(khoi in ('6', '7', '8', '8T', '9'), false)
  from hoc_sinh where id = public.my_hoc_sinh_id()
$function$;

create or replace function public.fn_giaibai_pool(p_nhanh text[], p_khoi text, p_limit integer default 500, p_che_do text default 'giai'::text, p_bo_khoi text[] default null::text[], p_bo_claude_da_bo boolean default false)
 returns setof v_giaibai_bai
 language plpgsql
 stable
as $function$
begin
  if p_che_do = 'hoan_thien' then
    return query select v.* from public.v_giaibai_hoan_thien v
      where v.nhanh = any(p_nhanh) and (p_khoi is null or v.khoi = p_khoi) and v.yc_id is null
        and (p_bo_khoi is null or v.khoi is null or v.khoi <> all(p_bo_khoi))
        and (not p_bo_claude_da_bo or not exists (
          select 1 from public.v_giaibai_nhan n
          where n.nhanh = v.nhanh and n.key = v.key and n.xu_ly_at is not null and n.ghi_chu ilike '%Claude bỏ%'))
      order by (v.khoi in ('6','7','8','8T','9')) desc, v.nhanh, v.nhom_ma, v.ma limit p_limit;
  else
    return query select v.* from public.v_giaibai_bai v
      where v.nhanh = any(p_nhanh) and (p_khoi is null or v.khoi = p_khoi) and v.yc_id is null
        and (p_bo_khoi is null or v.khoi is null or v.khoi <> all(p_bo_khoi))
        and (not p_bo_claude_da_bo or not exists (
          select 1 from public.v_giaibai_nhan n
          where n.nhanh = v.nhanh and n.key = v.key and n.xu_ly_at is not null and n.ghi_chu ilike '%Claude bỏ%'))
      order by (v.khoi in ('6','7','8','8T','9')) desc, v.nhanh, v.nhom_ma, v.ma limit p_limit;
  end if;
end $function$;
