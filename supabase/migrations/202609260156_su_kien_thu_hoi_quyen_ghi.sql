-- ============================================================================
-- 202609260156 — sk_*: thu hồi quyền GHI ở tầng bảng (vá sau mig 202609260129)
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202609260129 được áp bằng SQL Editor ⇒ bảng thuộc owner `postgres`
--   ⇒ dính `alter default privileges` của Supabase: anon + authenticated được grant
--   TƯỜNG MINH SELECT/INSERT/UPDATE/DELETE (đo thật 26/09 bằng has_table_privilege).
--   RLS vẫn chặn (không có policy ghi nào) nhưng đó là 1 lớp duy nhất — ai lỡ thêm
--   policy `for all` là anon ghi thẳng được vào sổ xu. Thiết kế: ghi CHỈ qua fn_sk_*.
--   Cùng bài học CLAUDE.md §2.1 "AI ÁP đổi cả posture quyền" (mig 202609182334).
-- MẤT GÌ: KHÔNG mất dữ liệu. Chỉ bỏ quyền ghi trực tiếp vào bảng (app không dùng —
--   mọi ghi đi qua RPC security definer) + quyền đọc của anon (RLS vốn đã trả 0 dòng).
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array['sk_su_kien','sk_phong','sk_nguoi_choi','sk_checkin','sk_luot','sk_xu','sk_dang_ky','sk_dang_ky_log'] loop
    execute format('revoke all on public.%I from anon', t);
    execute format('revoke insert, update, delete, truncate, references, trigger on public.%I from authenticated', t);
    execute format('grant select on public.%I to authenticated', t);
  end loop;
end $$;

-- Kiểm tra ngay (SQL Editor hiện bảng kết quả): mọi cột quyền ghi phải = false.
select c.relname,
       has_table_privilege('anon', c.oid, 'SELECT')          as anon_doc,
       has_table_privilege('anon', c.oid, 'INSERT')          as anon_ghi,
       has_table_privilege('authenticated', c.oid, 'INSERT') as nhansu_ghi_thang,
       has_table_privilege('authenticated', c.oid, 'SELECT') as nhansu_doc,
       (select count(*) from public.sk_phong p join public.sk_su_kien s on s.id = p.su_kien_id
         where s.ten = 'Trung thu 2026' and p.ten = 'Phòng iPad' and p.ma_hub = 'BK01') as seed_ok
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname like 'sk\_%' and c.relkind = 'r'
order by 1;
