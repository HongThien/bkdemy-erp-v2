-- 15/10: TA Quang Tùng báo "Danh sách việc: permission denied for function _khoi_van_hanh" — không hiện việc BTVN.
-- Mig 202610151151 revoke EXECUTE của _khoi_van_hanh khỏi authenticated, nhưng fn_viec_buoi_thuong (SECURITY INVOKER,
-- app TA gọi trực tiếp) gọi nó ⇒ MỌI người đăng nhập gọi fn_viec_buoi_thuong đều bị chặn. Cấp lại đúng 1 hàm này
-- (trả danh sách nhan_su_id vận hành khối — cùng thông tin fn_khoi_quan_ly_ds đã mở cho thành viên). _khoi_quan_ly vẫn đóng
-- (chỉ được gọi bên trong _khoi_van_hanh là SECURITY DEFINER). Không cấp cho anon.
grant execute on function public._khoi_van_hanh(text, text) to authenticated;
