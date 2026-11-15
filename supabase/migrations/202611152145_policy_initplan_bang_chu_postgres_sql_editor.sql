-- ============================================================================
-- 202611152145 — policy_initplan_bang_chu_postgres_sql_editor  ⚠ CHẠY Ở SQL EDITOR (không qua `npm run migrate`)
-- ----------------------------------------------------------------------------
-- VÌ SAO: các bảng dưới đây do `postgres` sở hữu (tạo tay qua SQL Editor) ⇒ `claude_build` không ALTER được.
--   Policy của chúng gọi hàm kiểm quyền TRẦN (la_thanh_vien() / my_hoc_sinh_id()) ⇒ Postgres gọi lại cho TỪNG DÒNG
--   (thong_bao_hs: 182 dòng mà mỗi lượt đọc ~175 ms — đo 14/11). Bọc (select hàm()) ⇒ tính MỘT lần mỗi câu lệnh.
--   Cùng cách với mig 202611021935 (373 bảng của claude_build); các bảng này tạo sau / tạo tay nên sót.
--   Ngữ nghĩa giữ nguyên tuyệt đối: hàm không nhận cột của dòng.
--   [15/11 22:10] Dòng `alter table public.thong_bao_ph owner to claude_build;` Thùy ĐÃ CHẠY riêng ⇒ bỏ khỏi file này;
--   policy của thong_bao_ph chuyển sang mig 202611152212 (claude_build tự áp). File này còn 18 policy của 16 bảng — CHƯA chạy.
--   Sau khi Thùy chạy: Claude đối chiếu pg_policies rồi ghi sổ bằng `migrate.mjs --ghi-so`.
--   Mỗi dòng chạy riêng được (không phụ thuộc nhau): dòng nào báo "lock timeout" thì chạy lại dòng đó.
-- MẤT GÌ (Luật xoá): không mất gì — ALTER POLICY giữ tên, lệnh, role.
-- ============================================================================
set lock_timeout = '3s';

alter policy thong_bao_hs_hs_select on public.thong_bao_hs using (hoc_sinh_id = (select public.my_hoc_sinh_id()));
alter policy thong_bao_hs_hs_update on public.thong_bao_hs using (hoc_sinh_id = (select public.my_hoc_sinh_id())) with check (hoc_sinh_id = (select public.my_hoc_sinh_id()));
alter policy thong_bao_hs_staff      on public.thong_bao_hs using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));

alter policy giai_thuong_member_all           on public.giai_thuong           using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
alter policy giai_thuong_lop_thang_member_all on public.giai_thuong_lop_thang using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
alter policy hinh_giao_trinh_member_all on public.hinh_giao_trinh using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
alter policy hinh_gt_bai_member_all     on public.hinh_gt_bai     using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
alter policy hinh_gt_buoi_member_all    on public.hinh_gt_buoi    using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));

alter policy sk_checkin_member_doc       on public.sk_checkin       using ((select public.la_thanh_vien()));
alter policy sk_dang_ky_member_doc       on public.sk_dang_ky       using ((select public.la_thanh_vien()));
alter policy sk_dang_ky_log_member_doc   on public.sk_dang_ky_log   using ((select public.la_thanh_vien()));
alter policy sk_luot_member_doc          on public.sk_luot          using ((select public.la_thanh_vien()));
alter policy sk_nguoi_choi_member_doc    on public.sk_nguoi_choi    using ((select public.la_thanh_vien()));
alter policy sk_phan_cong_member_doc     on public.sk_phan_cong     using ((select public.la_thanh_vien()));
alter policy sk_phan_cong_log_member_doc on public.sk_phan_cong_log using ((select public.la_thanh_vien()));
alter policy sk_phong_member_doc         on public.sk_phong         using ((select public.la_thanh_vien()));
alter policy sk_su_kien_member_doc       on public.sk_su_kien       using ((select public.la_thanh_vien()));
alter policy sk_xu_member_doc            on public.sk_xu            using ((select public.la_thanh_vien()));
