-- ============================================================================
-- Migration 0033 — Cờ Founder chuyển TỪ tai_khoan → NHÂN SỰ (06-15)
-- ----------------------------------------------------------------------------
-- Lý do: la_admin_he_thong ở tai_khoan (=auth uid) KHÔNG bootstrap được cho người
--   chưa từng login (chưa có dòng tai_khoan). Hệ member-gate (0026) vốn nhận diện
--   theo EMAIL khớp nhân sự, không bắt buộc tai_khoan. Founder là thuộc tính của
--   NGƯỜI → đưa cờ về nhan_su, set được bằng ma_ns ngay, my_quyen() resolve theo
--   tai_khoan HOẶC email (giống la_thanh_vien). Drop cột cũ ở tai_khoan (xóa luôn
--   giá trị set nhầm cho Trang).
-- ============================================================================

alter table nhan_su   add  column if not exists la_admin_he_thong boolean not null default false;
alter table tai_khoan drop column if exists     la_admin_he_thong;

-- my_quyen: resolve nhan_su qua tai_khoan HOẶC email → admin đọc từ nhan_su, chuc_nang từ ghế
create or replace function public.my_quyen()
returns table(la_admin boolean, chuc_nang text[])
language sql stable security definer set search_path = public as $$
  with me as (
    select coalesce(
      (select nhan_su_id from tai_khoan where id = public.jwt_uid()),
      (select id from nhan_su where email is not null and lower(email) = public.jwt_email() and public.jwt_email() <> '')
    ) as ns_id
  )
  select
    coalesce((select n.la_admin_he_thong from nhan_su n, me where n.id = me.ns_id), false),
    coalesce((
      select array_agg(distinct vc.chuc_nang)
      from me
      join vi_tri v             on v.nhan_su_id = me.ns_id
      join vai_tro_chuc_nang vc on vc.vai_tro_id = v.vai_tro_id
    ), '{}'::text[]);
$$;
revoke all on function public.my_quyen() from public;
grant  execute on function public.my_quyen() to authenticated;
