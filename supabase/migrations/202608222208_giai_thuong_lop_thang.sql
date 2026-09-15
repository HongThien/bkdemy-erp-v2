-- ============================================================================
-- 202608222208 — giai_thuong_lop_thang
-- ----------------------------------------------------------------------------
-- VÌ SAO: "Hoàn thành lớp" là trạng thái khoá sửa ở MỨC LỚP×THÁNG, độc lập với
-- số dòng đã duyệt trong giai_thuong (GV có thể hoàn thành dù chưa đủ 6 slot —
-- xem mockup docs/mockup-trao-giai.html, hộp thoại xác nhận khi thiếu slot).
-- Không suy ra được từ đếm dòng nên cần bảng riêng. Đã chạy tay qua SQL Editor
-- trước migration này tồn tại — file này ghi lại đúng SQL đó, apply bằng
-- --baseline (không chạy lại).
--
-- MẤT GÌ: không xoá gì, chỉ tạo bảng mới.
-- ============================================================================

create table giai_thuong_lop_thang (
  lop_id uuid not null references lop(id),
  thang date not null,
  hoan_thanh_at timestamptz,           -- NULL = đang làm, NOT NULL = đã "Hoàn thành lớp" (khoá sửa)
  hoan_thanh_boi uuid references nhan_su(id),
  primary key (lop_id, thang)
);
