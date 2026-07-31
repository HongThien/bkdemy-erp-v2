-- ============================================================================
-- 202607311557 — Backlog: giá trị & cỡ theo thang FIBONACCI (1·2·3·5·8)
-- ----------------------------------------------------------------------------
-- VÌ SAO: CEO chốt 07-31 — thang 5 mức Fibonacci (1,2,3,5,8) thay vì 1–3, để
--   phân biệt độ chênh rõ hơn (chuẩn story-point). Nới CHECK (1–3 là tập con nên
--   dữ liệu cũ vẫn hợp lệ — KHÔNG mất gì).
-- MẤT GÌ: không. Chỉ NỚI CHECK (superset), không thu hẹp.
-- ============================================================================

alter table y_tuong drop constraint if exists y_tuong_gia_tri_check;
alter table y_tuong drop constraint if exists y_tuong_co_check;
alter table y_tuong add constraint y_tuong_gia_tri_check check (gia_tri in (1,2,3,5,8));
alter table y_tuong add constraint y_tuong_co_check     check (co in (1,2,3,5,8));
