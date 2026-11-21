-- ============================================================================
-- 202611210829 — bao_sai_thu_quyen_ham_noi_bo
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Cổng check:kien-truc (K1, K7, K14) sau các mig 202611210813–0824 báo TĂNG: các hàm phụ tên "_" (do claude_build tạo) mặc định
--   cho authenticated EXECUTE — client gọi thẳng được dù chỉ là hàm nội bộ. Chúng chỉ được gọi từ BÊN TRONG các hàm security definer
--   (chạy bằng quyền chủ) và từ trigger, nên không ai cần quyền gọi trực tiếp ⇒ thu lại. Thêm index cho 3 khoá ngoại mới (K7).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Thu hẹp quyền gọi trực tiếp của authenticated lên 9 hàm nội bộ (không màn nào gọi: đã grep src/).
-- ============================================================================

revoke execute on function public._kho_lo_mau_quyen(text) from authenticated;
revoke execute on function public._kho_duoc_duyet(text, text, uuid) from authenticated;
revoke execute on function public._kho_mon_label(text) from authenticated;
revoke execute on function public._kho_cua_cau(text) from authenticated;
revoke execute on function public._kho_khoi_cua_cau(text, text) from authenticated;
revoke execute on function public._kho_la_truong_khoi_cua_cau(text, text) from authenticated;
revoke execute on function public._bao_sai_dien_kho() from authenticated;
revoke execute on function public._bao_sai_khau(text) from authenticated;
revoke execute on function public._bao_sai_dong_theo_nhan_xet() from authenticated;

create index if not exists bai_cau_bao_loi_nhan_su_idx on public.bai_cau_bao_loi (nhan_su_id);
create index if not exists kho_lo_mau_tao_boi_idx on public.kho_lo_mau (tao_boi);
create index if not exists kho_lo_mau_duyet_mau_boi_idx on public.kho_lo_mau (duyet_mau_boi);
