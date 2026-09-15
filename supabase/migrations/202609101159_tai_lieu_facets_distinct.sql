-- ============================================================================
-- 202609101159 — tai_lieu_facets_distinct
-- ----------------------------------------------------------------------------
-- VÌ SAO: Kho tài liệu (KhoTaiLieuScreen) đổi sang tải "20 mới nhất" thay vì full-scan (Thùy 09-10:
-- "kho lớn dần tải cực lâu"). Nhưng tab lọc Loại/Môn ở đầu màn PHẢI thấy MỌI giá trị đang tồn tại
-- (kể cả giá trị chỉ xuất hiện ở tài liệu cũ, ngoài trang 20 dòng mới nhất) — không thì tab tự rụng
-- dần theo trang tải, trông như loại tài liệu đó "biến mất". DISTINCT là phép tổng hợp (§2.0 CLAUDE.md)
-- → phải chạy Ở POSTGRES, không kéo hết cột về client rồi new Set() (bảng vài chục nghìn dòng vẫn phải
-- quét, chỉ đỡ được phần TRUYỀN payload — không đỡ được phần QUÉT, mà quét mới là phần chậm).
-- Không SECURITY DEFINER: tai_lieu đang RLS `to authenticated` không lọc theo môn (scoping môn hiện là
-- tầng ứng dụng, xem useMonScope) — hàm chạy invoker rights bám ĐÚNG RLS hiện có, không mở rộng quyền.
--
-- MẤT GÌ: không xoá gì — hàm mới, không đụng bảng/cột nào.
-- ============================================================================

create or replace function public.fn_tai_lieu_facets()
returns table(loai text, mon text)
language sql
stable
as $$
  select distinct loai, mon from public.tai_lieu
$$;

revoke all on function public.fn_tai_lieu_facets() from public;
grant execute on function public.fn_tai_lieu_facets() to authenticated;
