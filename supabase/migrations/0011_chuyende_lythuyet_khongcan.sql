-- 0011 — Lý thuyết chuyên đề: cờ "không cần" (must-exist vs không-áp-dụng).
-- Row có noi_dung/file = CÓ · khong_can=true = KHÔNG CẦN · không có row = CHƯA (cần bổ sung).
alter table dai_chuyen_de_ly_thuyet add column if not exists khong_can boolean not null default false;
