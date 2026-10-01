-- ============================================================================
-- 202609211000 — de_test_sua_xoa_dang_dung
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 21/09 "tất cả các màn hình đều phải có tính năng sửa xoá các card"): màn "Đề test" chỉ sinh được đề mới,
--   không đổi tên / không xoá bản sinh nhầm / không quay về bản cũ. Thực tế đã cắn 15/09: đề K7 bản 14/09 (32 câu) tự
--   thành "đang dùng" đè bản 07/09 (34 câu đang phát cho HS) mà không có nút nào chọn lại.
-- LÀM:
--   • `tai_lieu.test_dang_dung_at timestamptz` — mốc "được đặt làm đề đang dùng" (NULL = không áp dụng: chưa từng đặt
--     tay / tài liệu loại khác). Đề đang dùng của (khối × môn) = bản có coalesce(test_dang_dung_at, created_at) MỚI NHẤT
--     ⇒ sinh đề mới vẫn tự thành đang dùng như cũ, và đặt tay 1 bản cũ thì bản đó thắng.
--   • `fn_de_test_dat_dang_dung(id)` — đặt mốc = now() (chỉ cho loai='de_test_dau_vao').
--   • `fn_de_test_xoa(id)` — xoá ĐỀ do NGƯỜI DÙNG bấm (tính năng app, có confirm): CHẶN khi đã có ca test dùng đề
--     (FK ca_test.tai_lieu_id NO ACTION cũng chặn; hàm đếm trước để báo lỗi dễ hiểu). Đề chưa ai dùng ⇒ xoá tai_lieu,
--     phần + câu cascade theo FK sẵn có.
-- MẤT GÌ (Luật xoá): migration này KHÔNG xoá gì — chỉ thêm 1 cột nullable + 2 function.
-- ============================================================================
alter table public.tai_lieu add column if not exists test_dang_dung_at timestamptz;

create or replace function public.fn_de_test_dat_dang_dung(p_tai_lieu_id uuid) returns void
language plpgsql as $$
begin
  update public.tai_lieu set test_dang_dung_at = now(), updated_at = now()
   where id = p_tai_lieu_id and loai = 'de_test_dau_vao';
  if not found then raise exception 'Không tìm thấy đề test đầu vào (hoặc không có quyền).'; end if;
end $$;

create or replace function public.fn_de_test_xoa(p_tai_lieu_id uuid) returns void
language plpgsql as $$
declare n int;
begin
  if not exists (select 1 from public.tai_lieu where id = p_tai_lieu_id and loai = 'de_test_dau_vao') then
    raise exception 'Không tìm thấy đề test đầu vào (hoặc không có quyền).';
  end if;
  select count(*) into n from public.ca_test where tai_lieu_id = p_tai_lieu_id;
  if n > 0 then
    raise exception 'Đề này đã có % ca test dùng — không xoá được (mất câu để chấm/đối chiếu). Muốn ngừng dùng thì đặt bản khác làm "đang dùng".', n;
  end if;
  delete from public.tai_lieu where id = p_tai_lieu_id;
end $$;
grant execute on function public.fn_de_test_dat_dang_dung(uuid) to authenticated;
grant execute on function public.fn_de_test_xoa(uuid) to authenticated;
