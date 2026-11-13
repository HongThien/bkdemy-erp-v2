-- ĐỢT 0c-1 (13/11/2026) — CỔNG NHÂN SỰ: chỉ qua tài khoản đã nối + nhân sự đang làm. Chỉ đổi định nghĩa 6 hàm cổng, không đổi dữ liệu.
-- Trước: la_thanh_vien / co_quyen_ghi / co_chuc_nang / chi_me_id / my_quyen khớp thêm theo EMAIL trong token (không cần dòng tai_khoan) và không lọc trạng thái
--   ⇒ (1) đăng ký tài khoản bằng email của một nhân sự chưa có tài khoản là thành nhân sự; (2) nhân sự đã nghỉ vẫn đọc/ghi như cũ.
-- Sau: một nguồn duy nhất current_nhan_su_id() = tai_khoan(uid) nối nhan_su đang làm; 5 hàm kia dựa vào nó (spec-kien-truc.md K15).
set local lock_timeout = '5s';

do $g$
begin
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'current_nhan_su_id()'::regprocedure) is distinct from '380a23832b49cd8b92487be6e55837fa' then raise exception 'dot 0c: % da doi tu luc sinh migration — sinh lai', 'current_nhan_su_id'; end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'la_thanh_vien()'::regprocedure) is distinct from 'b9e17c17b9a8c963d18fc2735fd2ba34' then raise exception 'dot 0c: % da doi tu luc sinh migration — sinh lai', 'la_thanh_vien'; end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'chi_me_id()'::regprocedure) is distinct from '16d1727addcdcb0259c3e0ab7a1a781a' then raise exception 'dot 0c: % da doi tu luc sinh migration — sinh lai', 'chi_me_id'; end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'co_chuc_nang(text)'::regprocedure) is distinct from '4af1413957981c8cd1e07e0b6af1ac1c' then raise exception 'dot 0c: % da doi tu luc sinh migration — sinh lai', 'co_chuc_nang'; end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'co_quyen_ghi(text)'::regprocedure) is distinct from 'e2fc1d1bb022b1b0a2069776673fcfa9' then raise exception 'dot 0c: % da doi tu luc sinh migration — sinh lai', 'co_quyen_ghi'; end if;
  if (select md5(p.prosrc) from pg_proc p where p.oid = 'my_quyen()'::regprocedure) is distinct from 'fa118b476ad824f3359c808f65849db0' then raise exception 'dot 0c: % da doi tu luc sinh migration — sinh lai', 'my_quyen'; end if;
end
$g$;

CREATE OR REPLACE FUNCTION public.current_nhan_su_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- [dot 0c 13/11] NGUON DUY NHAT cua "toi la nhan su nao": tai khoan da noi + nhan su dang lam. Bo nhanh khop email.
  select tk.nhan_su_id from public.tai_khoan tk join public.nhan_su ns on ns.id = tk.nhan_su_id
   where tk.id = public.jwt_uid() and ns.trang_thai = 'dang_lam'
$function$;

CREATE OR REPLACE FUNCTION public.la_thanh_vien()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- [dot 0c 13/11] nhan su = tai khoan da noi + dang lam (bo nhanh khop email; nhan su nghi het quyen)
  select public.current_nhan_su_id() is not null
$function$;

CREATE OR REPLACE FUNCTION public.chi_me_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- [dot 0c 13/11]
  select public.current_nhan_su_id()
$function$;

CREATE OR REPLACE FUNCTION public.co_chuc_nang(p_chuc_nang text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with me as (
    select public.current_nhan_su_id() as ns_id
  )
  select
    -- Founder / admin hệ thống bỏ qua mọi cổng (giữ nguyên hành vi hiện tại).
    coalesce((select n.la_admin_he_thong from nhan_su n, me where n.id = me.ns_id), false)
    or exists (
      select 1 from me
      join vi_tri v             on v.nhan_su_id = me.ns_id
      join vai_tro_chuc_nang vc on vc.vai_tro_id = v.vai_tro_id
      where vc.chuc_nang = p_chuc_nang
    );
$function$;

CREATE OR REPLACE FUNCTION public.co_quyen_ghi(p_chuc_nang text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with me as (
    select public.current_nhan_su_id() as ns_id
  )
  select
    coalesce((select n.la_admin_he_thong from nhan_su n, me where n.id = me.ns_id), false)
    or exists (
      select 1 from me
      join vi_tri v             on v.nhan_su_id = me.ns_id
      join vai_tro_chuc_nang vc on vc.vai_tro_id = v.vai_tro_id
      where vc.chuc_nang = p_chuc_nang and coalesce(vc.chi_xem, false) = false
    );
$function$;

CREATE OR REPLACE FUNCTION public.my_quyen()
 RETURNS TABLE(la_admin boolean, chuc_nang text[], chi_xem text[])
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with me as (
    select public.current_nhan_su_id() as ns_id
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
$function$;

-- Tự nối tài khoản theo email: không client nào gọi; để mở thì người lạ đăng ký bằng email nhân sự rồi tự nối được.
revoke execute on function public.self_link_account() from public, anon, authenticated;
