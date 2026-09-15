-- 202608271000 — Hình: cho phép AI giải biến thể thiếu lời giải + nhãn duyệt.
-- Mở rộng ĐÚNG khuôn đã dùng cho dai_cau_hoi/khtn_cau_hoi/hgt_cau_hoi (migration bando
-- 202608252045) sang hinh_baitoan_bien_the — để màn "Duyệt lời giải AI" dùng chung logic
-- cho mọi nhánh, không phải viết riêng cho Hình.
-- Phạm vi: CHỈ biến thể (hinh_baitoan_bien_the.loi_giai) — KHÔNG đụng hinh_cach_giai (bài
-- toán gốc chưa có cách giải nào là bài toán khác, khó hơn, để riêng — xem thảo luận 27/08).
alter table hinh_baitoan_bien_the add column if not exists nguon_giai text not null default 'nguoi';
alter table hinh_baitoan_bien_the add column if not exists da_duyet boolean not null default false;
alter table hinh_baitoan_bien_the add column if not exists duyet_boi uuid references nhan_su(id);
alter table hinh_baitoan_bien_the add column if not exists duyet_at timestamp with time zone;
