-- ============================================================================
-- 202609131900 — BTVN: HS nộp KHÔNG giới hạn hạn (Thùy 13/09) — chỉ đánh dấu muộn
-- ----------------------------------------------------------------------------
-- VÌ SAO: Trước đây RLS `bai_lam_hs_insert/update` gọi `bai_test_con_han(bt)` chặn HS ghi sau hạn
--   cho MỌI loại (mig 202608171419). Thùy chốt tạm 13/09: BTVN vẫn nộp được sau deadline — client
--   đánh dấu "⏰ Muộn" khi nop_at > deadline. ET/đề thi/giáo trình GIỮ nguyên (thi 1 lần / phát
--   hành theo buổi — không thể nộp muộn được).
--
-- CÁCH: sửa function `bai_test_con_han` để BTVN bỏ qua check deadline (chỉ chặn khi staff đóng tay
--   `trang_thai='dong'`). Function này được RLS policy dùng qua coalesce(..., false) → sửa 1 chỗ,
--   cả `bai_lam` lẫn `bai_lam_cau` cùng nới.
--
-- MẤT GÌ: không mất data. Thay 1 function (create or replace). Không đụng policy.
-- ============================================================================
create or replace function public.bai_test_con_han(p_bai_test uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select bt.trang_thai = 'mo'
     and (bt.loai = 'btvn'                     -- BTVN không giới hạn hạn (Thùy 13/09, chỉ đánh dấu muộn ở client)
          or bt.deadline is null                -- không có hạn = mở mãi
          or now() <= bt.deadline)              -- còn hạn (áp cho ET/đề thi/giáo trình)
  from bai_test bt where bt.id = p_bai_test
$$;
comment on function public.bai_test_con_han(uuid) is 'Test còn nhận bài? Chưa bị staff đóng tay và (BTVN — Thùy 13/09 / chưa quá deadline).';
