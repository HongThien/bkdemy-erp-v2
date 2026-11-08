-- ============================================================================
-- tong_quan_hs_quyen_registry_mon
-- ----------------------------------------------------------------------------
-- VÌ SAO: kiểm Report PH bằng phiên đăng nhập thật (03/11) ⇒ "permission denied for function _kho_ds_nhanh". `_tq_dang_info`
--   (invoker, đã cấp authenticated) gọi `_kho_ds_nhanh` ngay dòng khai báo, mà registry này + `_kho_co_mon` chỉ claude_build
--   được execute ⇒ fn_tong_quan_hs gãy cho MỌI người dùng app: khối Tổng quan của Report PH (Toán + KHTN), ảnh gửi PH, Tổng quan
--   Kết quả học tập, trợ lý tra cứu. Lúc dựng (mig 202610261821) chỉ kiểm bằng script chạy role chủ hàm nên không lộ. Cùng gốc với
--   lỗi lá Giáo trình 28/10 (mig 202610281800 vá bằng definer ở hàm gọi) — lần này cấp thẳng cho 2 hàm registry: cả hai chỉ trả HẰNG
--   (danh sách nhánh / môn có kho theo tên môn), không đọc bảng nào ⇒ không lộ dữ liệu; vá luôn mọi hàm invoker khác gọi chúng
--   (`_kho_ds_nhanh_khoi`, `_bdm_dang_bai_cua_mon`).
--
-- MẤT GÌ (Luật xoá): không — chỉ cấp thêm quyền execute.
-- ============================================================================

grant execute on function public._kho_co_mon(text) to authenticated, service_role;
grant execute on function public._kho_ds_nhanh(text) to authenticated, service_role;
