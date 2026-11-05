-- Mở lại ca bù của Ding Phạm Hoàng An (HS0707, 3A1) ngày 05/11 17:00–18:00, TA Hồ Mai Nhật An (Thùy 05/11: "Mở lại ca của Hoàng An đi đã rồi fix sau").
-- TA bấm nhầm "Xác nhận ET" ⇒ fn_dong_phase đặt buổi bù 'hoan_tat' dù chưa hoàn thành đánh giá ⇒ ca biến khỏi ô "Bổ trợ bù" (fn_bu_ca_cua_toi chỉ lấy trang_thai='mo').
-- Chỉ đưa trạng thái về 'mo'; KHÔNG đụng et_dong_at (TA tự bấm "Mở lại" ET nếu cần). Điều kiện chặn: đúng buổi này, đang hoan_tat mà đánh giá chưa xong.
update buoi_hoc set trang_thai = 'mo', updated_at = now()
where id = '98e634dc-218f-42be-947a-dae0f0d37a77' and loai = 'bu' and trang_thai = 'hoan_tat' and danh_gia_xong_at is null;
