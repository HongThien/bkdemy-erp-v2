-- ============================================================================
-- 202609041045 — CẤP LẠI quyền đọc FDW `fdw_bkdemy_web` cho 5 bảng app PH ĐANG import THẬT.
--
-- BỐI CẢNH: 202609012300 gỡ 10 bảng "không hộ nào import", đo bằng grep `limit to (...)`
-- trong `bkdemy-ph-app/migrations`. Đo THIẾU: 5/10 bảng đó vào project bkdemy-ph theo đường
-- khác — foreign table `erp_live.gami_grades / gami_session_problems / dai_ban_do` (mig 0006,
-- 0009 dùng thẳng, không có chữ `limit to`) và `public.erp_hoc_sinh_lop / erp_thoi_khoa_bieu`
-- (bkdemy-web tạo, app PH mượn lại ở `enroll_live`).
--
-- HẬU QUẢ từ 01/09 (đo thật trên DB bkdemy-ph 04/09 bằng pg_depend + SELECT thử):
--   et_lop_view            ← gami_grades, gami_session_problems      ⇒ tab "Cả lớp" + % Test cuối giờ chết
--   mastery_measures_view  ← dai_ban_do, gami_grades, gami_session_problems ⇒ Thành thạo / Kết quả trống
--   enroll_live            ← erp_hoc_sinh_lop (= hoc_sinh_lop)       ⇒ môn + lớp của con trống
--   v_lop_tuyen_sinh (web) ← erp_hoc_sinh_lop, erp_thoi_khoa_bieu
-- Lỗi thật: `permission denied for table gami_session_problems` (remote SQL qua postgres_fdw).
-- App PH nuốt lỗi → hiện "Chưa có kết quả test cuối giờ" dù ERP có đủ dữ liệu (thấy khi
-- "Xem app phụ huynh" từ ERP → Buổi học gần nhất → Cả lớp).
--
-- GIỮ NGUYÊN ĐÃ GỠ (đúng là dư, không view nào đọc): bai_lam · bai_lam_cau · bt_grades · diem_thi · ky_thi.
-- BÀI HỌC: "ai đang import" phải đo bằng pg_depend/information_schema.foreign_tables TRÊN DB
-- bkdemy-ph, không grep repo — foreign table tạo tay hoặc mượn của hộ khác không nằm trong `limit to`.
-- Cách cấp = y hệt 202608031000 (grant SELECT + policy `fdw_bkdemy_web_read` — HAI cổng độc lập).
-- ============================================================================

do $$
declare
  cap text[] := array['gami_grades', 'gami_session_problems', 'dai_ban_do', 'hoc_sinh_lop', 'thoi_khoa_bieu'];
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
    raise notice 'cấp lại SELECT + policy fdw_bkdemy_web_read trên %', t;
  end loop;
end $$;

-- Chốt: cả 5 bảng phải có GRANT (cổng 1) và policy (cổng 2) — thiếu 1 cổng là vẫn hở.
do $$
declare
  cap text[] := array['gami_grades', 'gami_session_problems', 'dai_ban_do', 'hoc_sinh_lop', 'thoi_khoa_bieu'];
  thieu_grant text;
  thieu_policy text;
begin
  if not exists (select 1 from pg_roles where rolname = 'fdw_bkdemy_web') then return; end if;
  select string_agg(x, ', ') into thieu_grant from unnest(cap) x
  where not exists (
    select 1 from information_schema.role_table_grants
    where grantee = 'fdw_bkdemy_web' and table_schema = 'public' and table_name = x and privilege_type = 'SELECT');
  select string_agg(x, ', ') into thieu_policy from unnest(cap) x
  where exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
                where n.nspname = 'public' and c.relname = x and c.relrowsecurity)
    and not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = x and policyname = 'fdw_bkdemy_web_read');
  if thieu_grant is not null or thieu_policy is not null then
    raise exception 'Chưa cấp đủ — thiếu GRANT: % · thiếu policy: %', coalesce(thieu_grant, '-'), coalesce(thieu_policy, '-');
  end if;
end $$;
