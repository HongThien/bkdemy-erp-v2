-- ============================================================================
-- 202609121500 — Màn "Thông tin học tập" HS: 3 box (dạng yếu · lịch sử làm bài · BXH)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 12/09):
--  (1) HS đang thấy MÃ dạng thay TÊN dạng → sửa hs_dang_evals để COALESCE tên từ CẢ 2 bảng ban_do
--     của môn Toán (dai_ban_do + hgt_ban_do). Bản cũ chỉ join 1 bảng theo p_nhanh nên câu Hình bị
--     INNER JOIN loại (câu Hình có ma_dang chỉ tồn tại ở hgt_ban_do). ma_dang KHÔNG unique xuyên
--     môn (KHTN vs Toán 17 mã trùng) — chống nhầm bằng scope theo p_mon: KHTN → chỉ join khtn_ban_do,
--     Toán → LEFT JOIN cả dai+hgt (nhưng bt.mon = p_mon ở nhánh bai_lam_cau đã lọc, gami_grades
--     nhánh thì dùng buoi_hoc.lop → lop.mon = p_mon).
--  (2) Box "Lịch sử làm bài": fn_hs_lich_su_lam_bai(p_ngay_tu, p_ngay_den) — group theo ngày VN,
--     mỗi ngày trả so_cau/so_dung/so_sai/thoi_gian_giay. Thời gian in-app đo bằng MAX(cham_at) -
--     MIN(cham_at) trong bai_lam_cau (thời điểm câu đầu tiên được chấm → câu cuối được chấm) —
--     KHÔNG dùng bat_dau_at của bai_lam vì HS có thể mở bài rồi không làm gì trong 3h → khớp yêu
--     cầu CEO "từ lúc điền dữ liệu đầu tiên của db đến dữ liệu cuối cùng".
--  (3) Box "BXH tỉ lệ đạt dạng bài": fn_hs_xep_hang_ti_le_dat(p_mon, p_khoi). Định nghĩa "dạng đạt"
--     = số câu ĐÚNG / tổng câu >= 75% và tổng câu >= 3. Tỉ lệ = số dạng đạt / số dạng đã đo (ma_dang
--     riêng). Rank theo tỉ lệ giảm dần. HS chưa đo dạng nào → tỉ lệ = null (vẫn có trong bảng, xếp cuối).
--
-- §2.0: MỌI tính toán ở DB, client CHỈ gọi rpc + render.
-- MẤT GÌ: không mất data — chỉ sửa RPC + tạo mới. Không drop/delete.
-- ============================================================================

-- ── (1) SỬA hs_dang_evals — COALESCE tên từ cả 2 bảng ban_do của môn Toán ────────────────────────
-- 3 nhánh (gami_grades / bai_lam_cau / bt_grades). Với môn Toán: LEFT JOIN dai_ban_do + hgt_ban_do,
-- COALESCE. Với KHTN: chỉ join khtn_ban_do (bảng riêng, ma_dang tách domain).
create or replace function public.hs_dang_evals(p_mon text, p_nhanh text default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_out jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  if p_mon = 'KHTN' then
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src, bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join khtn_ban_do bd on bd.ma_dang = p.ma_dang
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'KHTN' or l.mon is null)

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join khtn_ban_do bd on bd.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'KHTN'
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt', bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join khtn_ban_do bd on bd.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = v_hs and tl.mon = 'KHTN'
    ) x;
  else
    -- Mặc định Toán: LEFT JOIN cả dai_ban_do + hgt_ban_do, COALESCE tên
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src,
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang) as ten_dang,
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de) as ten_chuyen_de,
             coalesce(bd_dai.muc_do, bd_hgt.muc_do) as muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = p.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = p.ma_dang
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'Toán' or l.mon is null)

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do)
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = bc.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'Toán'
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt',
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do)
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = bg.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = v_hs and tl.mon = 'Toán'
    ) x;
  end if;
  return v_out;
end $$;
grant execute on function public.hs_dang_evals(text, text) to authenticated;

-- ── (2) LỊCH SỬ LÀM BÀI TRÊN APP — group theo ngày VN ───────────────────────────────────────────
-- Nguồn dữ liệu: bai_lam_cau (mọi loại bai_test) + gami_grades (chấm trên lớp). Thùy: "thời gian
-- inapp là bao lâu, đo từ lúc điền dữ liệu đầu tiên của db đến dữ liệu cuối cùng" → dùng MAX-MIN
-- cham_at trong cùng ngày; nếu chỉ 1 câu → thoi_gian_giay = 0 (không có khoảng đo).
-- Trả 30 ngày gần nhất tính từ hôm nay VN.
create or replace function public.fn_hs_lich_su_lam_bai(p_so_ngay integer default 30)
returns table (
  ngay date, so_cau integer, so_dung integer, so_sai integer, thoi_gian_giay integer
) language sql stable security definer set search_path = public as $$
  with me as (select public.my_hoc_sinh_id() as hs),
  cua_so as (
    select (now() at time zone 'Asia/Ho_Chi_Minh')::date as ngay_den,
           ((now() at time zone 'Asia/Ho_Chi_Minh')::date - (p_so_ngay - 1)) as ngay_tu
  ),
  moi as (
    -- Bai_lam_cau (mọi loại bai_test — ET/BTVN/giáo trình/đề thi/tự luyện/bổ trợ)
    select (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date as ngay,
           blc.cham_at, blc.verdict
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    where bl.hoc_sinh_id = (select hs from me) and blc.verdict is not null
      and (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date
          between (select ngay_tu from cua_so) and (select ngay_den from cua_so)
    union all
    -- Gami_grades (chấm bài trên lớp — không phải app HS làm nhưng có thể tính vào lịch sử "đo lường")
    -- Thùy nói "lịch sử làm bài trên APP" → CHỈ bai_lam_cau (nguồn app-facing). Bỏ nhánh này.
    -- Giữ union all để dễ mở lại nếu Thùy muốn gộp; hiện tại where false loại toàn bộ.
    select null::date, null::timestamptz, null::text where false
  )
  select m.ngay,
         count(*)::int as so_cau,
         count(*) filter (where m.verdict = 'correct')::int as so_dung,
         count(*) filter (where m.verdict <> 'correct')::int as so_sai,
         case when count(*) < 2 then 0
              else greatest(0, extract(epoch from (max(m.cham_at) - min(m.cham_at)))::int) end as thoi_gian_giay
  from moi m
  group by m.ngay
  order by m.ngay desc
$$;
grant execute on function public.fn_hs_lich_su_lam_bai(integer) to authenticated;
revoke execute on function public.fn_hs_lich_su_lam_bai(integer) from anon;

-- ── (3) BXH TỈ LỆ ĐẠT DẠNG BÀI theo (môn, khối) ─────────────────────────────────────────────────
-- Dạng đạt = tổng câu >= 3 và tỉ lệ đúng >= 75%. Nguồn câu: bai_lam_cau (loại tự luyện/bt/BTVN/ET
-- đã nộp). HS trong khối chưa đo dạng nào → tỉ lệ = null (vẫn xuất hiện, rank cuối).
create or replace function public.fn_hs_xep_hang_ti_le_dat(p_mon text, p_khoi text)
returns jsonb language sql stable security definer set search_path = public as $$
  with roster as (
    select h.id as hoc_sinh_id, h.ho_ten, h.ma_hs, (h.id = public.my_hoc_sinh_id()) as la_toi
    from hoc_sinh h where h.khoi = p_khoi and h.trang_thai = 'dang_hoc'
  ),
  do_dang as (
    -- Cho MỖI HS × ma_dang: tổng số câu đã đo + số câu đúng
    select bl.hoc_sinh_id, bc.ma_dang,
           count(*) filter (where blc.verdict is not null) as tong_cau,
           count(*) filter (where blc.verdict = 'correct') as so_dung
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test_cau bc on bc.id = blc.bai_test_cau_id
    join bai_test bt on bt.id = bl.bai_test_id
    where bt.mon = p_mon and bl.hoc_sinh_id in (select hoc_sinh_id from roster)
      and bc.ma_dang is not null
      and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
    group by bl.hoc_sinh_id, bc.ma_dang
  ),
  hs_tong as (
    -- Đếm dạng đạt (tong_cau >= 3 và tỉ lệ >= 0.75) + dạng đã đo
    select hoc_sinh_id,
           count(*) filter (where tong_cau >= 3 and so_dung::numeric / tong_cau >= 0.75) as so_dat,
           count(*) as so_dang
    from do_dang group by hoc_sinh_id
  ),
  tinh as (
    select r.hoc_sinh_id, r.ho_ten, r.ma_hs, r.la_toi,
           coalesce(t.so_dat, 0)::int as so_dat,
           coalesce(t.so_dang, 0)::int as so_dang,
           case when coalesce(t.so_dang, 0) = 0 then null::numeric
                else round(t.so_dat::numeric / t.so_dang * 100, 1) end as ti_le
    from roster r left join hs_tong t on t.hoc_sinh_id = r.hoc_sinh_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'ma_hs', ma_hs, 'ho_ten', ho_ten, 'ti_le', ti_le,
    'so_dat', so_dat, 'so_dang', so_dang, 'la_toi', la_toi
  ) order by ti_le desc nulls last, ho_ten asc), '[]'::jsonb)
  from tinh
$$;
grant execute on function public.fn_hs_xep_hang_ti_le_dat(text, text) to authenticated;
revoke execute on function public.fn_hs_xep_hang_ti_le_dat(text, text) from anon;
