-- Hàm nội bộ (tên _): chỉ hàm secdef khác gọi, client không gọi được (check:kien-truc K1).
revoke execute on function public._phien_gioi_han_anh_ngay() from public, anon, authenticated;
