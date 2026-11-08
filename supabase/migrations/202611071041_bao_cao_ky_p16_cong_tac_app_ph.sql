-- ============================================================================
-- bao_cao_ky_p16_cong_tac_app_ph
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 07/11 "tạm thu hồi công bố trên app PH để t check — làm tính năng xong là ok rồi, hiện tại thu hồi đã".
--   KHÔNG mở lại từng báo cáo (mất trạng thái công bố của 196 em, snapshot phải chụp lại). Thêm CÔNG TẮC THEO KÌ: ky_hoc.mo_ph —
--   app PH (role fdw_bkdemy_web) chỉ đọc được báo cáo ĐÃ CÔNG BỐ của kì ĐANG MỞ cho PH. Mặc định TẮT ⇒ áp xong là mọi kì ẩn khỏi app PH.
--   Bật/tắt: admin trên ERP (RLS ky_hoc_sua chỉ admin); mỗi lần đổi ghi vết (trigger ky_hoc_mo_ph_log).
--   _bc_ky_mo_ph = security definer để policy của role FDW đọc được ky_hoc mà không cấp thêm quyền bảng.
-- MẤT GÌ (Luật xoá): không — thêm cột/bảng log/hàm, thay 1 policy (điều kiện chặt hơn).
-- ============================================================================
alter table public.ky_hoc add column mo_ph boolean not null default false;

create table public.ky_hoc_mo_ph_log (
  id bigserial primary key, ky_id uuid not null, mo_ph boolean not null,
  actor uuid default public.jwt_uid(), at timestamptz not null default now()
);
alter table public.ky_hoc_mo_ph_log enable row level security;
create policy ky_hoc_mo_ph_log_doc on public.ky_hoc_mo_ph_log for select to authenticated using ((select public.la_thanh_vien()));
grant select on public.ky_hoc_mo_ph_log to authenticated;
create or replace function public._ky_hoc_mo_ph_log() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.mo_ph is distinct from old.mo_ph then
    insert into ky_hoc_mo_ph_log (ky_id, mo_ph) values (new.id, new.mo_ph);
  end if;
  return null;
end $$;
create trigger trg_ky_hoc_mo_ph_log after insert or update of mo_ph on public.ky_hoc for each row execute function public._ky_hoc_mo_ph_log();

create or replace function public._bc_ky_mo_ph(p_ky uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select k.mo_ph from ky_hoc k where k.id = p_ky), false)
$$;
revoke execute on function public._bc_ky_mo_ph(uuid) from public, anon;
grant execute on function public._bc_ky_mo_ph(uuid) to fdw_bkdemy_web, authenticated, service_role;

drop policy if exists fdw_bkdemy_web_read on public.bao_cao_ph_ky;
create policy fdw_bkdemy_web_read on public.bao_cao_ph_ky for select to fdw_bkdemy_web
  using (cong_bo_at is not null and public._bc_ky_mo_ph(ky_id));
