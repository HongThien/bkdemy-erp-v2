-- ============================================================================
-- BÀI CỦA LỚP MẤT PHIẾU GỐC ⇒ TỰ ĐÓNG, KHÔNG HIỆN Ở APP HỌC SINH NỮA (Thùy 12/11: "file gán lỗi như BTVN 10A1 vừa xong thì hệ thống
-- tự xoá đi đừng hiển thị nữa").
-- Ca thật 10A1: phiếu BTVN 3 câu gắn nhầm ngày 12/11 ⇒ app đẻ bai_test e5e40250 ⇒ 5 em làm ⇒ TA xoá phiếu, gắn lại sang 08/11 ⇒ app đẻ
-- bai_test mới 835ed05b. FK bai_test.nguon_tai_lieu_id là ON DELETE SET NULL nên bài cũ mất phiếu nhưng vẫn trang_thai='mo' ⇒ em thấy
-- 2 bài giống hệt. Phía ERP (lưới chấm, getBTVNByBuoi) đã đi theo phiếu mới, bài mồ côi không còn ai quản.
-- Luật: bài CỦA LỚP (hoc_sinh_id null) loại có danh sách ở app HS (giao_trinh · et · btvn · de_thi) mà phiếu gốc bị xoá ⇒ đóng (dong_at).
-- KHÔNG xoá dòng: bai_lam / bai_lam_cau của em giữ nguyên (đo lường không đổi — không hàm DB nào lọc bai_test theo trang_thai).
-- (1) trigger: lúc FK set null (xoá phiếu) ⇒ đóng ngay. (2) dọn tồn: 21 bài mồ côi đang mở (đếm 12/11 17:46).
-- ============================================================================

create or replace function public._bai_test_mat_phieu_dong() returns trigger
language plpgsql as $$
begin
  if old.nguon_tai_lieu_id is not null and new.nguon_tai_lieu_id is null
     and new.hoc_sinh_id is null and new.loai in ('giao_trinh', 'et', 'btvn', 'de_thi') and new.trang_thai = 'mo' then
    new.trang_thai := 'dong';
    new.dong_at := coalesce(new.dong_at, now());
  end if;
  return new;
end $$;
revoke all on function public._bai_test_mat_phieu_dong() from public, anon;

drop trigger if exists trg_bai_test_mat_phieu_dong on public.bai_test;
create trigger trg_bai_test_mat_phieu_dong before update of nguon_tai_lieu_id on public.bai_test
  for each row execute function public._bai_test_mat_phieu_dong();

-- (2) dọn tồn: bài lớp đang mở, không có phiếu gốc
do $$
declare n int;
begin
  update public.bai_test set trang_thai = 'dong', dong_at = coalesce(dong_at, now())
  where trang_thai = 'mo' and nguon_tai_lieu_id is null and hoc_sinh_id is null
    and loai in ('giao_trinh', 'et', 'btvn', 'de_thi');
  get diagnostics n = row_count;
  raise notice 'Đã đóng % bài mồ côi', n;
  if n > 30 then raise exception 'Đóng % bài — nhiều hơn 21 đã đếm, dừng để xem lại', n; end if;
end $$;
