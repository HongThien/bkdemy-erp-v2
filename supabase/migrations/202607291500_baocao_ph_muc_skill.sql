-- Report PH: 2 skill bar theo THANG 5 (GV tự chọn, không suy động).
-- muc_kien_thuc / muc_thai_do ∈ 1..5 (null = chưa chọn).
alter table bao_cao_ph add column if not exists muc_kien_thuc smallint;
alter table bao_cao_ph add column if not exists muc_thai_do smallint;
