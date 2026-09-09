-- 202608281100 — Tách "duyệt câu trong kho" (backlog cũ, từ tính năng Clone) khỏi
-- "duyệt lời giải MỚI vừa sinh qua luồng giải-bài-chưa-có-đáp-án" (Thùy 28/08).
-- nguon_giai='ai' dùng chung cho cả 2 nên không tách được — thêm giai_method (mirror clone_method):
-- NULL = câu cũ (tồn đọng, không rõ nguồn) · 'claude_code' = MỚI, do đúng luồng giải-bài hôm nay ghi.
alter table dai_cau_hoi add column if not exists giai_method text;
alter table khtn_cau_hoi add column if not exists giai_method text;
alter table hgt_cau_hoi add column if not exists giai_method text;
alter table hinh_baitoan_bien_the add column if not exists giai_method text;
alter table hinh_cach_giai add column if not exists giai_method text;
