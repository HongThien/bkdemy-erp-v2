-- Mở FDW cho app PH đọc hệ số effective (hoc_sinh_he_so) → báo trước "giảm X% từ tháng sau".
-- Mirror đúng cách hoa_don_dong đã mở: grant SELECT + policy read cho role fdw_bkdemy_web (RLS member-gate
-- chặn role FDW vì không phải thành viên, nên cần policy riêng qual=true chỉ cho SELECT).
grant select on hoc_sinh_he_so to fdw_bkdemy_web;
drop policy if exists fdw_bkdemy_web_read on hoc_sinh_he_so;
create policy fdw_bkdemy_web_read on hoc_sinh_he_so for select to fdw_bkdemy_web using (true);
