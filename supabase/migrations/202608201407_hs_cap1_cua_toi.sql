-- ============================================================================
-- HS đọc CẤP của mình (cấp 1 hay không) — cần cho màn chính app HS: cấp 1 chỉ có Tự luyện
-- trên điện thoại (không ET/BTVN/Bài tập trên lớp), phải ẨN 3 ô đó thay vì để "Sắp có".
-- `hoc_sinh` staff-only, HS tự đọc dòng CỦA MÌNH cũng 0 dòng (verify: HS0004 SELECT hoc_sinh
-- → 0 dòng, không lỗi — đúng bẫy CLAUDE.md §2.1). Cần đường ĐỌC THẲNG qua RPC.
-- Danh sách khối = ĐÚNG bảng CAP1_KHOI đã dùng ở mastery.ts (Thùy 18-20/08) — KHÔNG bịa lại,
-- đây là biên giới HS-facing duy nhất cần fact này nên không đáng tách bảng dùng chung 2 phía.
-- ============================================================================
create or replace function public.hs_cap1_cua_toi()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(khoi in ('3', '4', '4T', '5', '5T'), false)
  from hoc_sinh where id = public.my_hoc_sinh_id()
$$;
grant execute on function public.hs_cap1_cua_toi() to authenticated;
