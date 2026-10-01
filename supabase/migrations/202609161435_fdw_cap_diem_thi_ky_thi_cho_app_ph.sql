-- ============================================================================
-- 202609161435 — CẤP quyền đọc FDW `fdw_bkdemy_web` cho `diem_thi` + `ky_thi`.
--
-- BỐI CẢNH: 202609012300 GỠ 2 bảng này khi thu 10 bảng "không hộ nào import"; đúng
-- lúc đó không ai nạp. 16/09 nối app PH lên MT (`ky_thi.loai='mt_sat_hach'`) — app
-- PH mig 0028 sẽ import 2 bảng này qua `erp_server` để dựng `diem_mt_view`.
-- Cấp = HAI CỔNG y hệt 202608031000: GRANT SELECT + policy `fdw_bkdemy_web_read`.
--
-- BÀI HỌC (đã cắn 202609012300 → 202609041045): giữ policy tường minh cho role
-- FDW ngay khi cấp, đừng để đợi lần sau chẩn "permission denied ... [42501]".
-- ============================================================================

do $$
declare
  cap text[] := array['diem_thi', 'ky_thi'];
  t text;
begin
  if not exists (select 1 from pg_roles where rolname = 'fdw_bkdemy_web') then
    raise notice 'Không có role fdw_bkdemy_web — bỏ qua.';
    return;
  end if;

  foreach t in array cap loop
    execute format('grant select on public.%I to fdw_bkdemy_web', t);
    execute format('drop policy if exists fdw_bkdemy_web_read on public.%I', t);
    execute format('create policy fdw_bkdemy_web_read on public.%I for select to fdw_bkdemy_web using (true)', t);
    raise notice 'cấp SELECT + policy fdw_bkdemy_web_read trên %', t;
  end loop;
end $$;

-- Chốt: 2 bảng phải đủ GRANT (cổng 1) và policy (cổng 2) — thiếu 1 cổng là vẫn hở.
do $$
declare
  cap text[] := array['diem_thi', 'ky_thi'];
  thieu_grant text;
  thieu_policy text;
begin
  if not exists (select 1 from pg_roles where rolname = 'fdw_bkdemy_web') then return; end if;

  select string_agg(t, ', ') into thieu_grant
  from unnest(cap) t
  where not has_table_privilege('fdw_bkdemy_web', format('public.%I', t)::regclass, 'SELECT');
  if thieu_grant is not null then
    raise exception 'Thiếu GRANT SELECT cho fdw_bkdemy_web trên: %', thieu_grant;
  end if;

  select string_agg(t, ', ') into thieu_policy
  from unnest(cap) t
  where not exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = t
      and p.policyname = 'fdw_bkdemy_web_read'
  );
  if thieu_policy is not null then
    raise exception 'Thiếu policy fdw_bkdemy_web_read trên: %', thieu_policy;
  end if;
end $$;
