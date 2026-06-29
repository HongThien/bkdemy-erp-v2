-- 0057 — CHIỀU MÔN cho SƠ ĐỒ TỔ CHỨC: ghế chuyên môn (GV/TA/Học thuật) thuộc 1 môn → mỗi môn 1 CÂY ĐỘC LẬP.
-- Thùy chốt: mỗi môn cây riêng (Trưởng môn Toán / KHTN là gốc riêng). null = ghế LIÊN-MÔN (Ops/Media/Marketing dùng chung).
-- Quyền (lớp ①) vẫn từ ROLE bám ghế (vi_tri.vai_tro_id); mon chỉ tách cây + quản lý theo môn (span-of-control trong môn).
alter table vi_tri add column if not exists mon text;  -- giá trị ∈ MON_LIST cho ghế chuyên môn; null = liên-môn
