-- 202611231710 — _phien_kiem_khoa chỉ gọi từ hàm security definer (owner) ⇒ thu EXECUTE của authenticated (cổng K1: hàm nội bộ không cho client gọi).
revoke execute on function public._phien_kiem_khoa() from authenticated;
