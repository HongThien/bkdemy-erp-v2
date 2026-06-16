-- Chấm ET: mỗi grade (HS × câu) có thể gắn các mã LỖI (E01..E06) khi kết quả C/S.
-- jsonb mảng mã lỗi; [] = đã chấm nhưng không lỗi (anti-NULL: dòng grade chỉ sinh khi chấm thật).
alter table gami_grades add column if not exists loi jsonb not null default '[]'::jsonb;
