-- ============================================================================
-- 202609201632 — lop_hs_theo_thang
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 20/09 — "Minh Hiếu và Khánh An chuyển 5T2→5T1, chốt xu tháng 8 báo
--   sai". Tra thật: xu tháng 8 CHỐT ĐÚNG (lệch=0) — bug ở chỗ khác: previewChotXu
--   (xu.ts) lấy LỚP HIỆN TẠI (hoc_sinh_lop where trang_thai='dang_hoc') để hiển
--   thị/lọc cho MỌI tháng, kể cả tháng đã qua. Khi cả lớp 5T2 gộp về 5T1 (giữa
--   09/2026), xem lại tháng 8 thì 2 em hiện cột Lớp = "5T1" (lớp mới, sai — tháng 8
--   các em học ở 5T2), và "5T2" biến mất khỏi ô lọc lớp luôn (không ai còn
--   dang_hoc ở đó) — không cách nào lọc lại đúng roster 5T2 tháng 8 qua UI.
--   Fix: hàm mới resolve LỚP-TẠI-THÁNG-ĐÓ từ lịch sử `hoc_sinh_lop` (ngay_vao/
--   ngay_roi overlap với tháng p_ym), không phụ thuộc trạng thái hiện tại. Nếu
--   1 tháng có ≥2 lớp overlap (chuyển lớp giữa tháng) → lấy lớp có ngay_vao MỚI
--   NHẤT (lớp cuối cùng em học trong tháng đó — hợp lý nhất để "chốt xu cho lớp
--   nào" khi buổi cuối tháng mới là buổi tính điều chỉnh `exp_btvn_thang`).
--
-- MẤT GÌ: không mất gì. Không drop/delete. Chỉ tạo 1 function mới.
-- ============================================================================

create or replace function public.fn_lop_hs_thang(p_ym text)
returns table (hoc_sinh_id uuid, mon text, khoi text, ten_lop text)
language sql stable as $$
  with cua_so as (
    select ((p_ym || '-01')::date) as tu, ((p_ym || '-01')::date + interval '1 month')::date as den
  ), ung_vien as (
    select hl.hoc_sinh_id, lp.mon, lp.khoi, lp.ten_lop,
           row_number() over (partition by hl.hoc_sinh_id, lp.mon order by hl.ngay_vao desc) as rn
    from public.hoc_sinh_lop hl
    join public.lop lp on lp.id = hl.lop_id
    cross join cua_so w
    where hl.ngay_vao < w.den and (hl.ngay_roi is null or hl.ngay_roi >= w.tu)
  )
  select hoc_sinh_id, mon, khoi, ten_lop from ung_vien where rn = 1
$$;
grant execute on function public.fn_lop_hs_thang(text) to authenticated;
