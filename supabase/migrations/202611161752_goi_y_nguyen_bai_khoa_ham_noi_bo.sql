-- Hàm phụ _tl_hh_goi_y_nguyen_bai (mig 202611161750) chỉ để fn_tl_hh_goi_y / fn_tl_hh_dat_bai (security definer) gọi nội bộ:
-- đổi sang SECURITY INVOKER (chạy bằng quyền chủ hàm gọi nó, không tự mở quyền) và thu EXECUTE của người đăng nhập (cổng check:kien-truc K1 + K14).
alter function public._tl_hh_goi_y_nguyen_bai(text, integer, text[]) security invoker;
revoke execute on function public._tl_hh_goi_y_nguyen_bai(text, integer, text[]) from public, anon, authenticated;
