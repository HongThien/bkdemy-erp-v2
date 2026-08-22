-- ============================================================================
-- HS đọc MÔN của lớp mình — cần cho Tự luyện (chọn dạng theo đúng môn), nhưng
-- `hoc_sinh_lop`/`lop` staff-only (verify: HS0004 SELECT hoc_sinh_lop → 0 dòng, không lỗi
-- — đúng bẫy CLAUDE.md §2.1). Trước giờ app chỉ suy `mon` GIÁN TIẾP từ `bai_test` HS đang
-- có (tests[0]?.mon) — HS cấp 1 KHÔNG có bai_test nào (không ET/BTVN/giáo trình online),
-- suy kiểu đó ra rỗng. Cần đường ĐỌC THẲNG.
-- ============================================================================
create or replace function public.hs_mon_cua_toi()
returns text[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(distinct l.mon), '{}'::text[])
  from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
  where hl.hoc_sinh_id = public.my_hoc_sinh_id() and hl.trang_thai = 'dang_hoc'
$$;
grant execute on function public.hs_mon_cua_toi() to authenticated;
