-- ============================================================================
-- 202611041707 — bao_cao_ky_fdw_app_ph
-- ----------------------------------------------------------------------------
-- VÌ SAO: Báo cáo học kì (spec-bao-cao-ky.md A8) — app PH (repo bkdemy-ph-app, DB bkdemy-ph) đọc qua postgres_fdw bằng role
--   fdw_bkdemy_web, y khuôn report tháng (bao_cao_ph). Cấp đủ 2 cổng (GRANT SELECT + policy, vì bảng bật RLS — thiếu policy thì
--   FDW đọc ra 0 dòng im lặng). Policy chỉ cho dòng ĐÃ CÔNG BỐ: bản nháp / phần GV đang nhập không bao giờ rời ERP.
--   App PH chỉ cần snapshot (tự đủ) ⇒ KHÔNG mở ky_hoc / log.
--
-- MẤT GÌ (Luật xoá): không — chỉ cấp thêm quyền đọc.
-- ============================================================================
grant select on public.bao_cao_ph_ky to fdw_bkdemy_web;
drop policy if exists fdw_bkdemy_web_read on public.bao_cao_ph_ky;
create policy fdw_bkdemy_web_read on public.bao_cao_ph_ky for select to fdw_bkdemy_web using (cong_bo_at is not null);
