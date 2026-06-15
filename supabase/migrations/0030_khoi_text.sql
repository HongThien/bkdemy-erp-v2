-- 0030 — khối là TEXT (4T/5T là KHỐI riêng, không phải hệ). Thống nhất vocab với Kho {3,4,4T,5,5T,6..12}.
-- Trước: lop.khoi/hoc_sinh.khoi smallint → không chứa nổi '4T' → import ép về 4/5 (SAI). Quy tắc tên:
--   '4T1'→khối '4T', '5T2'→'5T' (chỉ 4T/5T có T); '4A1'→'4' (A là hệ); '8S1'→'8'; '12B1'→'12'.
alter table lop      alter column khoi type text using khoi::text;
alter table hoc_sinh alter column khoi type text using khoi::text;

-- re-derive khối LỚP từ tên (lên-lớp đã +1 nên tên đã đúng năm nay)
update lop set khoi = case
  when ten_lop ~ '^(4T|5T)' then substring(ten_lop from '^[0-9]+T')
  else substring(ten_lop from '^[0-9]+') end
where ten_lop ~ '^[0-9]';

-- re-derive khối HỌC SINH từ lớp TOÁN đang học (T là tăng-cường Toán; BK Toán-centric)
update hoc_sinh h set khoi = sub.khoi
from (
  select distinct on (hl.hoc_sinh_id) hl.hoc_sinh_id, l.khoi
  from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
  where l.mon = 'Toán' and hl.trang_thai = 'dang_hoc'
  order by hl.hoc_sinh_id, l.khoi
) sub
where sub.hoc_sinh_id = h.id;
