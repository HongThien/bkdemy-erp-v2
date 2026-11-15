-- ============================================================================
-- 202611152146 — policy_initplan_bang_moi_sau_02_11
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   12 bảng tạo SAU mig 202611021935 (hoặc sót) có policy gọi la_thanh_vien() TRẦN ⇒ hàm security definer chạy lại cho TỪNG DÒNG
--   (~0,5–1 ms/dòng: bảng 1.000 dòng = ~0,5–1 s mỗi lượt đọc thẳng). Bọc (select …) ⇒ Postgres tính một lần mỗi câu lệnh (InitPlan).
--   Thấy khi soạn SQL cho bảng thong_bao_hs (15/11). Ngữ nghĩa giữ nguyên tuyệt đối: la_thanh_vien() không nhận cột của dòng.
--   Phần bảng do `postgres` sở hữu nằm ở file 202611152145 (Thùy chạy ở SQL Editor).
--   lock_timeout 3 s: ALTER POLICY cần khoá bảng trong tích tắc; bảng đang bận thì dừng cả lượt (chạy lại sau), không để người dùng chờ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — ALTER POLICY giữ tên, lệnh, role; chỉ đổi cách viết biểu thức sang dạng tương đương.
-- ============================================================================
set local lock_timeout = '3s';

alter policy btvn_ai_cau_member_read      on public.btvn_ai_cau       using ((select public.la_thanh_vien()));
alter policy btvn_ai_lan_member_read      on public.btvn_ai_lan       using ((select public.la_thanh_vien()));
alter policy btvn_ai_yeu_cau_member_read  on public.btvn_ai_yeu_cau   using ((select public.la_thanh_vien()));
alter policy bu_dv_cu_member_read         on public.bu_dv_cu_20261114 using ((select public.la_thanh_vien()));
alter policy claude_phien_bot_doc         on public.claude_phien_bot  using ((select public.la_thanh_vien()));
alter policy dht_hoan_member_all          on public.dht_hoan          using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
alter policy giai_thuong_xs_khoi_member_all      on public.giai_thuong_xs_khoi     using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
alter policy giai_thuong_xs_khoi_log_member_read on public.giai_thuong_xs_khoi_log using ((select public.la_thanh_vien()));
alter policy hs_anh_chan_dung_member_all  on public.hoc_sinh_anh_chan_dung using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
alter policy hs_kho_anh_member_all        on public.hoc_sinh_kho_anh       using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
alter policy nt_thu_hoi_phan_member_select on public.nt_thu_hoi_phan  using ((select public.la_thanh_vien()));
alter policy viec_phu_trach_snap_doc      on public.viec_phu_trach_snap using ((select public.la_thanh_vien()));
