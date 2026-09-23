-- ============================================================================
-- 202609221753 — mastery_cells_test_cuoi_ca_botro_yeu
-- ----------------------------------------------------------------------------
-- Thùy 22/09: "câu test mới tính vào mastery. Câu luyện tập ko tính vào mastery
-- cũng ko dùng làm gì cả. Chỉ để học sinh luyện thôi." — case đạt/chưa đạt vẫn
-- làm retest tầng 2 như bình thường, KHÔNG đổi.
--
-- Đã đọc source fn_mastery_cells (hàm mastery DUY NHẤT toàn hệ thống) trước khi
-- sửa: mọi bai_test.loai của bổ trợ yếu (bo_tro=luyện, bo_tro_test=test cuối ca,
-- retest) hiện đều rơi vào nhánh else → src='btvn' → mặc định (p_include_btvn=
-- false) KHÔNG cái nào tính vào mastery, kể cả test cuối ca. Chỉ thêm 1 nhánh
-- CASE mới cho bo_tro_test → src='et' (tính mặc định, giống ET). bo_tro (luyện)
-- và retest GIỮ NGUYÊN 'btvn' (retest là cơ chế case-scoped riêng cho dat/hoàn
-- thành đợt — không phải mastery chung, Thùy không nhắc cần đổi).
--
-- MẤT GÌ (Luật xoá): không — CREATE OR REPLACE 1 hàm, chỉ thêm 1 dòng CASE,
-- không đổi tham số/cột trả về, không đụng mf/rk/ngưỡng 0.8-0.5.
-- ============================================================================

create or replace function public.fn_mastery_cells(
  p_hs uuid[], p_include_btvn boolean default false, p_since timestamp with time zone default null::timestamp with time zone,
  p_window integer default 5, p_tin_cao integer default 5, p_tin_tb integer default 3
)
returns table(hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
language sql stable as $function$
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
$function$;

grant execute on function public.fn_mastery_cells(uuid[], boolean, timestamp with time zone, integer, integer, integer) to authenticated;
