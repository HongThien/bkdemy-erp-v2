-- Đợt 3 bước 4 (spec-kien-truc.md §4: "ghi phần khác biệt, cấm xoá hết chèn lại") — tin Thế giới BK. Thùy gật 14/11.
-- Trước: mỗi 5 phút xoá cả 516 dòng rồi chèn lại 516 dòng (+ 3 index, có GIN) dù KHÔNG tin nào đổi
--        ⇒ ~370 nghìn lượt chèn + xoá, 830 lượt autovacuum cộng dồn trên một bảng 516 dòng.
-- Sau:  chỉ xoá dòng không còn / đã đổi, chỉ chèn dòng mới / đã đổi. Lượt bình thường = 0 dòng ghi.
-- Nội dung bảng sau mỗi lượt Y HỆT cách cũ (= _the_gioi_tin_tinh). Chữ ký, giá trị trả (số tin) không đổi. Không đổi bảng, không đổi hàm đọc.
-- (Người đọc không bao giờ thấy bảng trống ở cách cũ — xoá + chèn cùng một transaction; lợi ích ở đây là bớt ghi, không phải sửa sai số.)

create or replace function public._the_gioi_tin_lam_moi()
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_tu timestamptz := now() - interval '31 days'; v_n int;
begin
  with moi as materialized (
    select * from public._the_gioi_tin_tinh(v_tu)
  ), xoa as (   -- dòng không còn trong bản mới, hoặc còn khoá nhưng nội dung đã đổi
    delete from the_gioi_tin_luu l
     where not exists (select 1 from moi m where m.khoa = l.khoa
             and (m.tang, m.nhom, m.kieu, m.hoc_sinh_id, m.thanh_vien, m.lop_id, m.mon, m.at, m.chi_tiet)
                 is not distinct from (l.tang, l.nhom, l.kieu, l.hoc_sinh_id, l.thanh_vien, l.lop_id, l.mon, l.at, l.chi_tiet))
  ), ghi as (   -- dòng mới, hoặc dòng vừa bị xoá ở trên vì nội dung đổi
    insert into the_gioi_tin_luu (khoa, tang, nhom, kieu, hoc_sinh_id, thanh_vien, lop_id, mon, at, chi_tiet)
    select m.khoa, m.tang, m.nhom, m.kieu, m.hoc_sinh_id, m.thanh_vien, m.lop_id, m.mon, m.at, m.chi_tiet from moi m
     where not exists (select 1 from the_gioi_tin_luu l where l.khoa = m.khoa
             and (m.tang, m.nhom, m.kieu, m.hoc_sinh_id, m.thanh_vien, m.lop_id, m.mon, m.at, m.chi_tiet)
                 is not distinct from (l.tang, l.nhom, l.kieu, l.hoc_sinh_id, l.thanh_vien, l.lop_id, l.mon, l.at, l.chi_tiet))
  )
  select count(*) into v_n from moi;
  insert into the_gioi_tin_luu_moc (id, tu, tinh_luc) values (1, v_tu, now())
    on conflict (id) do update set tu = excluded.tu, tinh_luc = excluded.tinh_luc;
  return v_n;
end $function$;
