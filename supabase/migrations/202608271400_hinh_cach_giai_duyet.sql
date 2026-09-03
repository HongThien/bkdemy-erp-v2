-- 202608271400 — Hình: nhãn duyệt cho hinh_cach_giai (bài toán gốc), y hệt hinh_baitoan_bien_the
-- (202608271000) — để màn "Duyệt lời giải AI" gộp được cả 2 tầng (biến thể + bài toán gốc) trong
-- CÙNG 1 màn, không phải đi từng bài qua Sơ đồ gốc (Thùy đã chốt rõ: không đi từng bài).
alter table hinh_cach_giai add column if not exists nguon_giai text not null default 'nguoi';
alter table hinh_cach_giai add column if not exists da_duyet boolean not null default false;
alter table hinh_cach_giai add column if not exists duyet_boi uuid references nhan_su(id);
alter table hinh_cach_giai add column if not exists duyet_at timestamp with time zone;
