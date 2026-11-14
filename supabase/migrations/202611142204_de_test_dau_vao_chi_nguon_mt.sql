-- Test đầu vào CHỈ lấy đề MT của BK (Thùy 14/11) — rào ở DB.
-- Màn "Tạo đề test đầu vào" đã chỉ liệt kê MT (src/lib/detest.ts LOAI_DE_TEST = ['mt']); migration này
-- chặn nốt đường ghi thẳng: tài liệu loai='de_test_dau_vao' phải có nguon_id trỏ 1 tài liệu loai='mt'.
-- Không được sinh từ Đề thi / đề cương học kì / loại khác, cũng không được sinh không nguồn.
--
-- Ngoại lệ DUY NHẤT: nguon_id đang có → NULL trên dòng đã là đề test (khoá ngoại tai_lieu_nguon_id_fkey
-- ON DELETE SET NULL chạy khi đề MT gốc bị xoá) — đề test đã sinh là bản copy, vẫn dùng tiếp được.
-- Dữ liệu hiện có (kiểm 14/11): 29 đề test, cả 29 có nguồn là MT ⇒ không dòng nào vi phạm.

create or replace function _de_test_chi_nguon_mt() returns trigger
language plpgsql as $$
declare
  v_loai text;
begin
  if new.loai is distinct from 'de_test_dau_vao' then
    return new;
  end if;

  if new.nguon_id is null then
    if tg_op = 'UPDATE' and old.loai = 'de_test_dau_vao' and old.nguon_id is not null then
      return new; -- đề MT gốc bị xoá ⇒ khoá ngoại tự đặt NULL
    end if;
    raise exception 'Đề test đầu vào phải sinh từ một đề MT (thiếu nguồn).'
      using errcode = 'check_violation';
  end if;

  select loai into v_loai from tai_lieu where id = new.nguon_id;
  if v_loai is distinct from 'mt' then
    raise exception 'Đề test đầu vào chỉ lấy đề MT của BK — nguồn đang chọn là loại "%".', coalesce(v_loai, 'không tìm thấy')
      using errcode = 'check_violation';
  end if;

  return new;
end $$;

drop trigger if exists trg_de_test_chi_nguon_mt on tai_lieu;
create trigger trg_de_test_chi_nguon_mt
  before insert or update of loai, nguon_id on tai_lieu
  for each row execute function _de_test_chi_nguon_mt();
