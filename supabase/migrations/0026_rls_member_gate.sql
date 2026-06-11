-- ============================================================================
-- Migration 0026 — RLS MEMBER GATE (Thùy chốt 06-11: "làm 1 luôn")
-- ----------------------------------------------------------------------------
-- Trước: mọi bảng policy auth_all = "cứ authenticated là vào" → người lạ tự
-- signUp (cổng công khai của Supabase) là đọc được DB.
-- Sau:  chỉ THÀNH VIÊN mới vào — thành viên = tài khoản có dòng tai_khoan gắn
--        nhân sự, HOẶC email đăng nhập trùng email 1 nhân sự (đường bootstrap,
--        không cần backfill auth.users vốn không đọc được bằng claude_build).
-- Người lạ tự đăng ký → tài khoản RỖNG, mọi bảng từ chối.
-- ⚠ KHÔNG dùng auth.uid()/auth.jwt() — claude_build bị cấm schema auth; đọc
--   thẳng JWT claims qua current_setting('request.jwt.claims') (chính là thứ
--   auth.uid() đọc bên dưới).
-- ============================================================================

-- uid + email của người gọi, từ JWT claims (NULL nếu không có JWT)
create or replace function public.jwt_uid() returns uuid
language sql stable as $$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'sub')::uuid;
$$;
create or replace function public.jwt_email() returns text
language sql stable as $$
  select lower(coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'email', ''));
$$;
grant execute on function public.jwt_uid(), public.jwt_email() to authenticated;

-- Thành viên hợp lệ? (security definer = chạy quyền owner → bypass RLS bên
-- trong, tránh đệ quy policy tai_khoan → hàm → tai_khoan)
create or replace function public.la_thanh_vien() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from tai_khoan where id = jwt_uid() and nhan_su_id is not null)
      or exists(select 1 from nhan_su where email is not null and lower(email) = jwt_email() and jwt_email() <> '');
$$;
revoke all on function public.la_thanh_vien() from public;
grant execute on function public.la_thanh_vien() to authenticated;

-- Tự link tài khoản ↔ nhân sự theo email trùng (đúng 1 ứng viên mới link —
-- 0 hay ≥2 thì thôi, thà bỏ trống còn hơn gán sai). App gọi rpc lúc mở hồ sơ.
create or replace function public.self_link_account() returns uuid
language plpgsql security definer set search_path = public as $$
declare nsid uuid; em text; n int;
begin
  if jwt_uid() is null then return null; end if;
  select nhan_su_id into nsid from tai_khoan where id = jwt_uid();
  if nsid is not null then return nsid; end if;
  em := jwt_email();
  if em = '' then return null; end if;
  select count(*) into n from nhan_su where email is not null and lower(email) = em;
  if n <> 1 then return null; end if;
  select id into nsid from nhan_su where email is not null and lower(email) = em;
  insert into tai_khoan (id, nhan_su_id, email) values (jwt_uid(), nsid, em)
    on conflict (id) do update set nhan_su_id = excluded.nhan_su_id;
  return nsid;
end $$;
revoke all on function public.self_link_account() from public;
grant execute on function public.self_link_account() to authenticated;

-- Thay TOÀN BỘ policy cũ trên public → gate thành viên.
do $$
declare t text; pol record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    for pol in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on %I', pol.policyname, t);
    end loop;
    execute format('create policy %I_member_all on %I for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien())', t, t);
  end loop;
end $$;

-- tai_khoan: ai cũng xem được DÒNG CỦA MÌNH (để app biết trạng thái link, kể cả khi chưa là thành viên)
create policy tai_khoan_self_select on tai_khoan for select to authenticated using (id = public.jwt_uid());
