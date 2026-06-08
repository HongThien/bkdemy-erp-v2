-- ============================================================================
-- Migration 0006 — BẬT RLS toàn bộ bảng + policy "chỉ user ĐĂNG NHẬP toàn quyền"
-- ----------------------------------------------------------------------------
-- Trước: RLS OFF + grant anon → ai có anon key (trong bundle) cũng đọc/ghi DB.
-- Giờ deploy public nên KHOÁ: bật RLS, chỉ role `authenticated` (có phiên đăng
-- nhập Supabase Auth) mới qua policy. `anon` (không đăng nhập) → bị chặn sạch.
-- App đăng nhập xong, supabase-js tự gắn JWT → role authenticated → vào được.
-- ============================================================================

do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists auth_all on public.%I', t);
    execute format('create policy auth_all on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;
