-- ============================================================================
-- 202609012300 — GỠ 10 BẢNG DƯ khỏi role FDW `fdw_bkdemy_web` (CEO chốt 01/09).
--
-- BỐI CẢNH: mig 202608151030 siết role này còn 4 bảng (lúc đó chỉ có bkdemy-web dùng),
-- rồi 202608151600 "hoàn tác thu hẹp" mở lại — file hoàn tác KHÔNG có trong repo nên
-- 01/09 nhìn vào tưởng lỗ hổng. Đo lại mới đúng: **app PH (`bkdemy-ph-app`) mới là hộ
-- dùng chính**, nó khai báo 21 foreign table sang ERP (danh tính, buổi, báo cáo, hoá đơn,
-- tài liệu, đáp án, 4 view trả BTVN); bkdemy-web chỉ dùng 4 bảng như cũ. ⇒ mở lại là ĐÚNG
-- nghiệp vụ, không phải sự cố. Nguồn đo: `limit to (...)` + `create foreign table` trong
-- `bkdemy-ph-app/migrations/*.sql` và `bkdemy-web/supabase-ph-migrations/*.sql`.
--
-- CÒN LẠI ĐÚNG PHẦN DƯ: 10 bảng KHÔNG hộ nào import — điểm/bài làm/kho câu/lịch. Gỡ.
--
-- MẤT GÌ (Luật xoá) — CHỈ MẤT QUYỀN ĐỌC, KHÔNG mất 1 dòng dữ liệu nào:
--   bai_lam · bai_lam_cau · bt_grades · dai_ban_do · diem_thi · gami_grades ·
--   gami_session_problems · hoc_sinh_lop · ky_thi · thoi_khoa_bieu
--   (mỗi bảng: revoke GRANT + drop policy `fdw_bkdemy_web*` — HAI cổng độc lập, gỡ 1 cổng
--    là hở, bài học 15/08.)
-- GIỮ NGUYÊN: 24 object app PH + web đang import THẬT + `v_btvn_dap_an` (view thứ 5 của
--   luồng trả bài — PH mới import 4/5, chừa sẵn cho bước trả đáp án).
-- ĐẢO LẠI ĐƯỢC: cấp lại grant + tạo lại policy `for select using (true)`.
-- ============================================================================

do $$
declare
  du text[] := array['bai_lam', 'bai_lam_cau', 'bt_grades', 'dai_ban_do', 'diem_thi',
                     'gami_grades', 'gami_session_problems', 'hoc_sinh_lop', 'ky_thi',
                     'thoi_khoa_bieu'];
  t record;
begin
  if not exists (select 1 from pg_roles where rolname = 'fdw_bkdemy_web') then
    raise notice 'Không có role fdw_bkdemy_web — bỏ qua.';
    return;
  end if;

  -- ① Gỡ POLICY (cổng RLS)
  for t in
    select tablename, policyname from pg_policies
    where schemaname = 'public' and policyname like 'fdw_bkdemy_web%' and tablename = any(du)
  loop
    execute format('drop policy %I on public.%I', t.policyname, t.tablename);
    raise notice 'gỡ policy % trên %', t.policyname, t.tablename;
  end loop;

  -- ② Thu hồi GRANT (cổng quyền bảng)
  for t in
    select table_name from information_schema.role_table_grants
    where grantee = 'fdw_bkdemy_web' and table_schema = 'public' and table_name = any(du)
    group by table_name
  loop
    execute format('revoke all on public.%I from fdw_bkdemy_web', t.table_name);
    raise notice 'thu hồi GRANT trên %', t.table_name;
  end loop;
end $$;

-- ③ Chốt lại: 25 object PHẢI còn nguyên quyền đọc — không được sứt trong lúc dọn.
do $$
declare
  giu text[] := array[
    -- app PH (bkdemy-ph-app) import
    'phu_huynh', 'hoc_sinh', 'lop', 'buoi_hoc', 'buoi_hoc_hs', 'buoi_danh_gia', 'bao_cao_ph',
    'bai_test', 'bai_test_cau', 'btvn_ket_qua', 'tai_lieu', 'tai_lieu_phan', 'tai_lieu_cau',
    'dai_cau_hoi', 'hoa_don', 'hoa_don_dong', 'hoc_sinh_he_so',
    'v_btvn_nop_ph', 'v_btvn_tra_anh', 'v_btvn_tra_cau', 'v_btvn_tra_ket_qua', 'v_btvn_dap_an',
    -- bkdemy-web (view erp_fdw_live_gv_gia)
    'muc_hoc_phi', 'nhan_su', 'phan_cong_lop'];
  thieu text;
begin
  if not exists (select 1 from pg_roles where rolname = 'fdw_bkdemy_web') then return; end if;
  select string_agg(x, ', ') into thieu from unnest(giu) x
  where not exists (
    select 1 from information_schema.role_table_grants
    where grantee = 'fdw_bkdemy_web' and table_schema = 'public' and table_name = x);
  if thieu is not null then
    raise exception 'SỨT quyền đọc của hộ đang dùng: % — dừng, không commit.', thieu;
  end if;
end $$;
