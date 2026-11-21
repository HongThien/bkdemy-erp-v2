-- ============================================================================
-- VÌ SAO: hàm trigger _trg_btnhe_diem_danh_khoa (mig 202611211613) không cần client gọi — đóng EXECUTE (check:kien-truc K1: hàm nội bộ client gọi được).
-- MẤT GÌ (Luật xoá): không — chỉ thu EXECUTE của hàm trigger; trigger vẫn chạy (quyền EXECUTE chỉ kiểm lúc tạo trigger).
-- ============================================================================
revoke execute on function public._trg_btnhe_diem_danh_khoa() from public, anon, authenticated;
