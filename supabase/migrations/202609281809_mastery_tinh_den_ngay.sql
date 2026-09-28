-- ============================================================================
-- 202609281809 — mastery_tinh_den_ngay
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Nhiệm vụ T4 "lấp 1 lỗ" và huy hiệu Hephaestus (spec-huy-hieu-build.md §5) cần mastery TÍNH ĐẾN MỘT THỜI ĐIỂM trong quá khứ
--   (yếu đầu tháng → đạt cuối tuần). fn_mastery_cells chỉ có p_since. Thêm p_den (loại lần đo có t ≥ p_den) ở CUỐI danh sách
--   tham số, DEFAULT NULL ⇒ mọi lời gọi hiện có (theo vị trí hoặc theo tên) cho kết quả y hệt. KHÔNG chép công thức sang hàm thứ 2.
--   Postgres không cho create or replace thêm tham số ⇒ drop + create, cấp lại đúng quyền cũ (PUBLIC + authenticated có execute).
--   Thân hàm lấy từ bản ĐANG CHẠY (pg_get_functiondef 28/09), chỉ chèn 3 điều kiện p_den.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   drop function fn_mastery_cells(uuid[], boolean, timestamptz, integer, integer, integer) — tạo lại NGAY trong cùng transaction
--   với thân y hệt + tham số mới. Không mất dữ liệu.
-- ============================================================================
drop function public.fn_mastery_cells(uuid[], boolean, timestamptz, integer, integer, integer);
CREATE OR REPLACE FUNCTION public.fn_mastery_cells(p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5, p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
 LANGUAGE sql
 STABLE
AS $function$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '4T', '5', '5T')) as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    -- gami_grades: t = NGÀY BUỔI (mọi gsp gắn buổi theo schema, join left để phòng thủ)
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)
    union all
    -- bai_lam_cau online: t = ngày buổi của bai_test (nếu có), fallback cham_at
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'bo_tro_test' then 'et' -- Thùy 22/09: test cuối ca bổ trợ yếu tính mastery như ET
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
      and (p_den is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) < p_den)
    union all
    -- bt_grades: bổ trợ không gắn buổi, giữ graded_at
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt'
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
      and (p_den is null or btg.graded_at < p_den)
  ),
  mf as (
    select m.* from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  rk as (
    select mf.*,
           case mf.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by mf.hoc_sinh_id, mf.ma_dang
                              order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn
    from mf
  )
  select hoc_sinh_id, ma_dang,
         sum(value * w) filter (where rn <= p_window) / nullif(sum(w) filter (where rn <= p_window), 0) as score,
         count(*) as n,
         case when sum(value * w) filter (where rn <= p_window) / nullif(sum(w) filter (where rn <= p_window), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= p_window) / nullif(sum(w) filter (where rn <= p_window), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= p_tin_cao then 'cao' when count(*) >= p_tin_tb then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, ma_dang
$function$
;
grant execute on function public.fn_mastery_cells(uuid[], boolean, timestamptz, integer, integer, integer, timestamptz) to public, authenticated;
