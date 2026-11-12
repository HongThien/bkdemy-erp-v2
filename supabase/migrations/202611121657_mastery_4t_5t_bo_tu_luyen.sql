-- MASTERY KHỐI 4T · 5T KHÔNG TÍNH TỰ LUYỆN (Thùy 12/11: "mastery khối 4T 5T trên ERP của giáo viên thì không tính tự luyện của học sinh").
-- Một chỗ duy nhất quyết "khối nào tính tự luyện": cờ cap1 trong _mastery_luot_do_quy (trước: 3 · 4 · 4T · 5 · 5T). Nay: 3 · 4 · 5.
-- ⇒ 4T · 5T đi như K6–12: chỉ ET · MT (+ BTVN · bổ trợ khi gọi kèm), tự luyện không vào mastery. Áp cho mọi chỗ đọc mastery
--   (một công thức — ERP, bổ trợ, app HS), không có bản thứ hai riêng cho màn giáo viên.
-- Bảng chụp: đánh bẩn HS khối 4T · 5T để lượt làm mới tính lại theo luật mới (đọc vẫn đúng ngay: em bẩn tính trực tiếp).
-- Sửa thẳng trên định nghĩa ĐANG CHẠY; đoạn cần thay không đúng nguyên văn ⇒ dừng.
-- MẤT GÌ: không. Không xoá dòng nào.
do $mig$
declare d text; n text;
begin
  select pg_get_functiondef('public._mastery_luot_do_quy(boolean, boolean, uuid[], boolean, timestamptz, timestamptz)'::regprocedure) into d;
  n := replace(d, $a$(khoi in ('3', '4', '4T', '5', '5T')) as cap1$a$,
                  $a$(khoi in ('3', '4', '5')) /* 12/11 Thùy: 4T · 5T không tính tự luyện */ as cap1$a$);
  if n = d then raise exception '_mastery_luot_do_quy đã đổi so với lúc viết mig (không thấy danh sách khối cấp 1)'; end if;
  execute n;
end $mig$;

select public._mastery_danh_dau_ban(array(select h.id from hoc_sinh h where h.khoi in ('4T', '5T')));
