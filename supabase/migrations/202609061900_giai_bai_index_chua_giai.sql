-- 202609061900 — giai_bai_index_chua_giai
--
-- VÌ SAO — chuẩn bị cho auto-scan toàn kho chạy định kỳ (5-10 phút/lần, Thùy 06/09): quét "câu chưa có
-- lời giải" (v_giaibai_bai) dùng đúng điều kiện `xoa_at is null and loi_giai is null and anh_dap_an is
-- null and dap_an is null`. KHÔNG lọc theo thời gian (rủi ro bỏ sót vĩnh viễn câu lỡ trượt qua cửa sổ
-- thời gian mà chưa kịp giải — CLAUDE.md §2 "hỏng ÂM THẦM"). Thay vào đó: partial index đúng điều kiện
-- này khiến chi phí quét luôn tỉ lệ với SỐ CÂU CÒN THIẾU tại thời điểm quét, không phải tổng kích thước
-- bảng — vậy dù kho lớn dần, một khi backlog được giải hết thì quét gần như miễn phí, mà không bỏ sót
-- câu nào (đúng khẩn than của Thùy "sau này chỉ cần quét câu mới" nhưng không có nhược điểm bỏ sót).
-- Hình (hinh_baitoan/hinh_cach_giai) dùng kiểu NOT EXISTS phức tạp hơn (không phải 1 cột đơn) — số bài
-- Hình còn nhỏ (regex đo 06/09: pool Giải 8 bài Hình), chưa cần tối ưu; để sau nếu thực tế thấy chậm.
-- MẤT GÌ (Luật xoá): không — chỉ thêm 3 index, không đổi dữ liệu/hành vi truy vấn hiện có.

create index if not exists dai_cau_hoi_chua_giai_idx on dai_cau_hoi (ma_cau)
  where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null;

create index if not exists khtn_cau_hoi_chua_giai_idx on khtn_cau_hoi (ma_cau)
  where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null;

create index if not exists hgt_cau_hoi_chua_giai_idx on hgt_cau_hoi (ma_cau)
  where xoa_at is null and loi_giai is null and anh_dap_an is null and dap_an is null;
