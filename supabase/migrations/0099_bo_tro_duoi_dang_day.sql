-- 0099 — bo_tro_duoi_dang: TRẠNG THÁI ĐÃ DẠY per dạng (Thùy 07-13: "phía đánh giá của người dạy
-- bổ trợ phải xác nhận đã dạy dạng nào — như thế mới xác định được lúc nào kết thúc được bổ trợ,
-- xem cần gia hạn hay thu ngắn đợt không").
-- GV tick trong BuoiDuoiDetail → ghi buổi nào dạy + lúc nào (theo convention *_dong_at của codebase:
-- NULL = chưa dạy; có giá trị = đã dạy, kèm bằng chứng buổi). Bỏ tick = clear cả 2 cột.
alter table bo_tro_duoi_dang add column if not exists day_buoi_id uuid references buoi_hoc(id) on delete set null;
alter table bo_tro_duoi_dang add column if not exists day_at timestamptz;
