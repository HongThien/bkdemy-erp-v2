-- ============================================================================
-- 202609171500 — fn_mastery_cells / fn_mastery_cells_hinh: neo `t` theo NGÀY BUỔI
-- ----------------------------------------------------------------------------
-- VÌ SAO: 202608300739 & 202608300747 cũ dùng `g.graded_at as t` cho window "5/3 lần
--   gần nhất". GV/TA chấm trễ (buổi 10/08 chấm BTVN ngày 23/08 — case 7B1 Hiệu tích
--   17/09/2026) → dòng cũ nhảy lên đầu window, đè cả điểm mastery lẫn thứ tự lịch sử.
--   §1.5 "thà bỏ trống còn hơn đánh sai" + §1 "mastery suy động từ mọi lần đo" mà thứ
--   tự đo bị nhiễu ngày chấm ⇒ điểm không suy đúng.
--
-- FIX: `t` = NGÀY BUỔI khi problem gắn buổi (mọi gami_session_problems + mọi bai_test
--   ET/MT/BTVN đều gắn buổi), fallback graded_at/cham_at cho nguồn không gắn buổi
--   (bt_grades bổ trợ, bai_lam_cau loai 'tu_luyen' đôi khi không có buổi). Đổi cả
--   sort window (order by t desc) VÀ filter p_since — cùng semantic "buổi diễn ra khi".
--   Timezone: buoi_hoc.ngay là DATE local VN → cast qua 'Asia/Ho_Chi_Minh' về timestamptz.
--
-- MẤT GÌ (Luật xoá): không — CREATE OR REPLACE, thay công thức trong function. Điểm
--   mastery của HS có dạng đã đo lệch chấm sẽ ĐỔI NHẸ (~1-2 lần đo bị đảo thứ tự trong
--   window). Đúng semantic hơn — không phải regression.
-- ============================================================================

create or replace function public.fn_mastery_cells(
  p_hs uuid[], p_include_btvn boolean default false, p_since timestamptz default null,
  p_window integer default 5, p_tin_cao integer default 5, p_tin_tb integer default 3)
returns table (hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
language sql stable as $$
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
    union all
    -- bai_lam_cau online: t = ngày buổi của bai_test (nếu có), fallback cham_at
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
    union all
    -- bt_grades: bổ trợ không gắn buổi, giữ graded_at
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt'
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
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
$$;

-- Mastery HÌNH: cùng nguyên tắc, window 3.
create or replace function public.fn_mastery_cells_hinh(
  p_hs uuid[], p_include_btvn boolean default false, p_since timestamptz default null)
returns table (hoc_sinh_id uuid, hinh_baitoan_id uuid, score numeric, n bigint, muc text, tin text)
language sql stable as $$
  with m as (
    select g.hoc_sinh_id, sp.hinh_baitoan_id,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.hinh_baitoan_id is not null
      and (sp.phase in ('et', 'mt') or (p_include_btvn and sp.phase = 'btvn'))
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
  ),
  rk as (
    select m.*, case m.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by m.hoc_sinh_id, m.hinh_baitoan_id
                              order by m.t desc, m.src, m.value desc) as rn
    from m
  )
  select hoc_sinh_id, hinh_baitoan_id,
         sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0),
         count(*),
         case when sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= 3) / nullif(sum(w) filter (where rn <= 3), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= 3 then 'cao' when count(*) >= 2 then 'tb' else 'thap' end
  from rk group by hoc_sinh_id, hinh_baitoan_id
$$;
