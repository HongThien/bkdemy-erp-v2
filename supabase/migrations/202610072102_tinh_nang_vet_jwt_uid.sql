-- ============================================================================
-- 202610072102 — tinh_nang_vet_jwt_uid
-- VÌ SAO: trigger ghi vết ở 202610072101 gọi auth.uid(), nhưng role chủ hàm (claude_build) KHÔNG có quyền vào schema `auth`
--   ("permission denied for schema auth") ⇒ mọi UPDATE tinh_nang chết. Repo dùng public.jwt_uid() ở mọi chỗ khác — đổi theo.
-- MẤT GÌ: không mất gì — chỉ thay thân 1 hàm.
-- ============================================================================
create or replace function public._tinh_nang_ghi_vet() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_table_name = 'tinh_nang' then
    if tg_op = 'UPDATE' and new.mo_tu is distinct from old.mo_tu then
      insert into tinh_nang_log (ma, cu, moi, nguoi) values (new.ma, jsonb_build_object('mo_tu', old.mo_tu), jsonb_build_object('mo_tu', new.mo_tu), public.jwt_uid());
    end if;
    new.updated_at := now();
    return new;
  else
    if tg_op = 'DELETE' then
      insert into tinh_nang_log (ma, lop_id, cu, moi, nguoi) values (old.ma, old.lop_id, jsonb_build_object('mo', old.mo), null, public.jwt_uid());
      return old;
    elsif tg_op = 'INSERT' then
      insert into tinh_nang_log (ma, lop_id, cu, moi, nguoi) values (new.ma, new.lop_id, null, jsonb_build_object('mo', new.mo), public.jwt_uid());
      return new;
    else
      if new.mo is distinct from old.mo then
        insert into tinh_nang_log (ma, lop_id, cu, moi, nguoi) values (new.ma, new.lop_id, jsonb_build_object('mo', old.mo), jsonb_build_object('mo', new.mo), public.jwt_uid());
      end if;
      new.updated_at := now();
      return new;
    end if;
  end if;
end $$;
