-- 0091 — MT (kỳ thi lớn) đổi mô hình: KHÔNG còn buổi_hoc(loai='mt') riêng — MT giờ là 1 TAB/phase của
-- buổi_hoc(loai='thuong'), CÙNG mô hình ET (Thùy 07-08: "Chấm MT phải hiện trong buổi học giống như
-- chấm ET"). ET có cột đóng riêng `et_dong_at` tách khỏi `ingame_dong_at` → MT cũng cần cột riêng
-- `mt_dong_at`, KHÔNG dùng chung ingame_dong_at nữa (buổi thường có ingame THẬT, dùng chung sẽ đụng độ).
alter table buoi_hoc add column if not exists mt_dong_at timestamptz;
