-- VÁ mig 202611181302: fn_dbht_bang là hàm SECURITY INVOKER (chạy theo quyền người gọi) ⇒ hàm phụ _btk_trang_thai_hs nó gọi phải cho
-- người đã đăng nhập EXECUTE — khoá lại làm bảng Dashboard học tập báo "permission denied for function _btk_trang_thai_hs" (lộ khi thử qua app 18/11).
-- Hàm phụ cũng là invoker: chỉ đọc bo_tro_de_xuat · bo_tro_yeu · buoi_hoc_hs · buoi_hoc theo RLS của người gọi (đúng các bảng CTE cũ đã đọc), không mở thêm gì.
-- Lý do KHÔNG grant anon: chỉ nhân sự đã đăng nhập mở Dashboard. Hai hàm còn lại (_btk_lich_su_hs · _btk_bao_dong_tuan) chỉ fn_btk_ds (definer) gọi ⇒ giữ khoá.
grant execute on function public._btk_trang_thai_hs(uuid, text) to authenticated;
