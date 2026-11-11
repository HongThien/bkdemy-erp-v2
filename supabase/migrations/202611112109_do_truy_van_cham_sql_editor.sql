-- ============================================================================
-- do_truy_van_cham — CHẠY Ở SUPABASE SQL EDITOR (claude_build / claude_ro không vào được schema extensions).
-- Thùy 11/11: "canceling statement due to statement timeout" gặp cực nhiều ⇒ rà tổng thể mọi màn.
-- Mở cho Claude ĐỌC thống kê truy vấn chậm (pg_stat_statements) qua 1 hàm duy nhất — CHỈ ĐỌC, không đổi gì,
-- không lộ tham số (pg_stat_statements đã thay giá trị bằng $1, $2…). Người dùng app (anon/authenticated) không gọi được.
-- Chạy xong: Claude gọi thử rồi `node scripts/migrate.mjs --ghi-so <file này>`.
-- ============================================================================
create or replace function public.fn_do_truy_van_cham(p_toi_thieu_ms numeric default 2000, p_gioi_han int default 200)
returns table(vai text, so_lan bigint, tb_ms numeric, max_ms numeric, tong_giay numeric, truy_van text)
language sql stable security definer set search_path = public, extensions as $$
  select r.rolname::text, s.calls, round(s.mean_exec_time::numeric), round(s.max_exec_time::numeric),
         round((s.total_exec_time / 1000)::numeric), left(regexp_replace(s.query, '\s+', ' ', 'g'), 400)
    from extensions.pg_stat_statements s
    join pg_roles r on r.oid = s.userid
   where r.rolname in ('authenticated', 'anon', 'authenticator', 'service_role')
     and s.max_exec_time >= p_toi_thieu_ms
   order by s.max_exec_time desc
   limit p_gioi_han
$$;
revoke execute on function public.fn_do_truy_van_cham(numeric, int) from public, anon, authenticated;
grant execute on function public.fn_do_truy_van_cham(numeric, int) to claude_ro, claude_build;

-- Thử ngay: 20 truy vấn chậm nhất từ app
select * from public.fn_do_truy_van_cham(2000, 20);
