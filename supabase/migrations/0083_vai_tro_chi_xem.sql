-- ============================================================================
-- Migration 0083 — RBAC: THÊM MỨC "Chỉ xem / Được sửa" cho role×màn (07-06)
-- ----------------------------------------------------------------------------
-- Trước: vai_tro_chuc_nang chỉ nhị phân (có dòng = có quyền vào màn, full CRUD).
-- Nay: thêm cột chi_xem — TRUE = chỉ xem (đọc), FALSE = được sửa (mặc định, giữ
--   hành vi cũ cho data có sẵn). 1 người giữ NHIỀU ghế/role cho cùng 1 màn →
--   "được sửa" THẮNG "chỉ xem" (permissive wins, khớp luật UNION quyền đã có).
-- Enforce ở seam (src/lib/supabase.ts chặn insert/update/upsert/delete khi màn
--   đang mở = chỉ-xem), KHÔNG enforce ở DB/RLS — vẫn lớp ① feature-access (UI),
--   không phải RLS cứng.
-- ============================================================================

alter table vai_tro_chuc_nang add column if not exists chi_xem boolean not null default false;

-- return type đổi (thêm chi_xem text[]) → phải DROP rồi tạo lại, CREATE OR REPLACE không đổi được return type.
drop function if exists public.my_quyen();

create or replace function public.my_quyen()
returns table(la_admin boolean, chuc_nang text[], chi_xem text[])
language sql stable security definer set search_path = public as $$
  with me as (
    select coalesce(
      (select nhan_su_id from tai_khoan where id = public.jwt_uid()),
      (select id from nhan_su where email is not null and lower(email) = public.jwt_email() and public.jwt_email() <> '')
    ) as ns_id
  ),
  grants as (
    select vc.chuc_nang, vc.chi_xem
    from me
    join vi_tri v             on v.nhan_su_id = me.ns_id
    join vai_tro_chuc_nang vc on vc.vai_tro_id = v.vai_tro_id
  ),
  agg as (
    select chuc_nang, bool_and(chi_xem) as chi_xem_all
    from grants
    group by chuc_nang
  )
  select
    coalesce((select n.la_admin_he_thong from nhan_su n, me where n.id = me.ns_id), false),
    coalesce((select array_agg(distinct chuc_nang) from agg), '{}'::text[]),
    coalesce((select array_agg(chuc_nang) from agg where chi_xem_all), '{}'::text[]);
$$;
revoke all on function public.my_quyen() from public;
grant  execute on function public.my_quyen() to authenticated;
