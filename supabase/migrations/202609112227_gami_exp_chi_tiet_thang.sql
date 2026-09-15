-- ============================================================================
-- 202609112227 — gami_exp_chi_tiet_thang
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 11/09 — màn "Điểm số (Elo/EXP) → hồ sơ HS" hiện "Dòng EXP" GỘP TOÀN BỘ lịch sử
--   (mọi tháng cộng dồn) cạnh "Lịch sử Elo" (đúng là xem lâu dài). Nhưng EXP là LƯƠNG THÁNG — mỗi
--   tháng tính riêng để ra xu (fn_gami_exp_xu_thang, ChotXuScreen), nên xem lẫn nhiều tháng vào 1
--   danh sách là sai bản chất, phải CẮT theo tháng như màn Chốt xu.
--   Hàm mới trả DÒNG CHI TIẾT (không gộp) của 1 HS trong 1 tháng — cùng luật xác định "thuộc
--   tháng nào" với fn_gami_exp_xu_thang (note-keyed cho nguồn có note=p_ym; attend_floor theo
--   cửa sổ created_at giờ VN) để khớp đúng con số đã dùng tính xu, không lệch.
--
-- MẤT GÌ: không mất gì. Không drop/delete. Chỉ tạo 1 function mới.
-- ============================================================================

create or replace function public.fn_gami_exp_chi_tiet_thang(
  p_hoc_sinh_id uuid, p_ym text
) returns table (
  source text, mon text, amount integer, created_at timestamptz, ngay date, lop text
) language sql stable as $$
  with cua_so as (
    select ((p_ym || '-01')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh' as tu,
           (((p_ym || '-01')::date + interval '1 month')::timestamp) at time zone 'Asia/Ho_Chi_Minh' as den
  )
  select l.source, l.mon, l.amount, l.created_at, b.ngay, lp.ten_lop
  from public.gami_exp_ledger l
  cross join cua_so w
  left join public.buoi_hoc b on b.id = l.ref_buoi_hoc_id
  left join public.lop lp on lp.id = b.lop_id
  where l.hoc_sinh_id = p_hoc_sinh_id
    and (
      (l.source in ('exp_thang', 'exp_et', 'exp_btvn', 'exp_btvn_thang') and l.note = p_ym)
      or (l.source = 'attend_floor' and l.created_at >= w.tu and l.created_at < w.den)
    )
  order by l.created_at desc
$$;
grant execute on function public.fn_gami_exp_chi_tiet_thang(uuid, text) to authenticated;
