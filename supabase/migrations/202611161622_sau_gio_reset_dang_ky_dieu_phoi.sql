-- ============================================================================
-- 202611161622 — sau_gio_reset_dang_ky_dieu_phoi
-- VÌ SAO (Thùy 16/11: "Cái cron này của m là đã đọc kiến trúc đấy chưa"): mig 202611161617 kèm file *_cron_sql_editor tạo 2 job cron RIÊNG cho reset
--   sau giờ — sai spec-kien-truc.md K4 / §4 / §12 mẫu 12 ("mỗi việc một cron riêng"). Đúng khuôn: MỘT job cron là bộ điều phối _tinh_san_chay;
--   việc chạy theo lịch = một dòng tinh_san_dang_ky. File cron riêng KHÔNG chạy (đã đổi thành ghi chú).
--   Lịch: giờ chạy 0 (giờ VN), chu kỳ 1200 phút ⇒ mỗi ngày một lượt lúc 0h. _btnhe_reset_tuan chạy lại được nhiều lần: thứ Hai huỷ phần chưa thực hiện
--   của tuần cũ; các ngày khác không còn gì để huỷ (lưới an toàn nếu lượt thứ Hai trượt). Ngoài 17–22 h (K22). Ngân sách 30 s.
-- MẤT GÌ (Luật xoá): không — thêm 1 dòng danh mục.
-- ============================================================================
insert into tinh_san_dang_ky (ma, ten, lenh, chu_ky_phut, gio_chay, uu_tien, ngan_sach_giay, bat, ghi_chu)
values ('sau_gio_reset_tuan', 'Bổ trợ sau giờ: reset thứ Hai (huỷ phần chưa thực hiện của tuần cũ)', 'public._btnhe_reset_tuan(30)',
        1200, array[0], 15, 30, true, 'Thùy 16/11 · idempotent · chỉ bổ trợ sau giờ (bo_tro_nhe), không đụng ca khối')
on conflict (ma) do update set lenh = excluded.lenh, chu_ky_phut = excluded.chu_ky_phut, gio_chay = excluded.gio_chay,
  uu_tien = excluded.uu_tien, ngan_sach_giay = excluded.ngan_sach_giay, bat = excluded.bat, ghi_chu = excluded.ghi_chu;
