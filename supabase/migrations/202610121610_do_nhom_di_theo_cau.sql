-- Thùy 12/10: "Các dạng trong app học sinh lúc báo bổ trợ yếu đang ko đồng bộ với bản đồ hiện tại."
-- Gốc (đo 12/10): mọi chỗ tính "dạng yếu" đọc MÃ DẠNG CHÉP trên dòng đo (gami_session_problems / bai_test_cau / bt_grades), không đọc
-- dạng HIỆN TẠI của câu. Câu đổi dạng, dạng bị gộp/xoá ở bản đồ ⇒ số đo nằm lại ở mã cũ: 15 mã chết còn 327 ô chấm + 852 câu bài online
-- (9 mã lớp 6/7/11 đã gộp 1-1 sang dạng khác); app HS hiện "dạng yếu" không tên / không có trong bản đồ, còn dạng nhận thì thiếu số đo.
-- Sửa = bật luật CEO đã chốt 08/10 (spec-ban-do-4-tang.md §10 "câu đang thuộc dạng nào thì tính về dạng đó") — MỘT hàm _do_nhom_cua_o:
--   1. Ô có câu, câu còn trong kho, dạng hiện tại của câu là dạng thật (không "Chưa phân dạng", không xoá mềm) ⇒ tính về dạng hiện tại của câu.
--   2. Còn lại ⇒ mã chép; mã chép đã xoá mềm thì theo chuỗi gop_vao tới dạng còn sống; mã chép đã XOÁ CỨNG (trước 10/10) mà log gộp câu
--      (kho_doi_dang_log) chỉ ra ĐÚNG MỘT dạng nhận còn sống ⇒ tính về dạng đó. Không rõ ⇒ giữ mã chép (không đoán).
-- KHÔNG sửa dữ liệu đo (chỉ đổi cách đọc) ⇒ bỏ được bằng cách trả hàm về bản cũ. Phạm vi: nhánh Đại (dai_*); HGT/KHTN/Hình/Anh giữ mã chép.
-- Nối vào (dựng từ bản ĐANG CHẠY): fn_mastery_cells · hs_dang_evals (+ ẩn dạng không còn trong bản đồ) · fn_btyeu_dang_yeu_2_cua_so ·
-- fn_btyeu_de_xuat_dang_moi · fn_hs_bu_dang · _btyeu_dong_bo_dang_ban_do (thêm xoá MỀM dai_ban_do.xoa_at — mig 202610101928 ra sau bản đồng bộ 10/10).
-- CHƯA nối (việc của phiên bản đồ P1): _bxh_gia_tri · fn_hs_xep_hang_ti_le_dat (BXH tỉ lệ đạt đếm theo mã chép).

create index if not exists kho_doi_dang_log_dang_cu on public.kho_doi_dang_log (dang_cu) where loai = 'cau';

create or replace function public._kho_dang_da_xoa_mem(p_ma_dang text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from dai_ban_do b where b.ma_dang = p_ma_dang and b.xoa_at is not null)
$$;

create or replace function public._do_nhom_cua_o(p_ma_cau text, p_ma_dang_chep text) returns text
language plpgsql stable security definer set search_path = public as $$
declare v text; v_xoa timestamptz; v_gop text; i int := 0;
begin
  if p_ma_cau is not null then
    select b.ma_dang into v from dai_cau_hoi c join dai_ban_do b on b.ma_dang = c.dang_chinh
     where c.ma_cau = p_ma_cau and c.xoa_at is null and b.xoa_at is null and not public._kho_la_dang_cho(b.ma_dang);
    if v is not null then return v; end if;
  end if;
  if p_ma_dang_chep is null then return null; end if;
  v := p_ma_dang_chep;
  loop
    select b.xoa_at, b.gop_vao into v_xoa, v_gop from dai_ban_do b where b.ma_dang = v;
    exit when not found;                                           -- mã không (còn) ở bản đồ Đại
    if v_xoa is null then return v; end if;                        -- dạng còn sống
    if v_gop is null or i >= 8 then return p_ma_dang_chep; end if; -- bỏ hẳn, không có dạng nhận
    v := v_gop; i := i + 1;
  end loop;
  if i > 0 then return p_ma_dang_chep; end if;
  -- mã chép không có dòng bản đồ Đại: nhánh khác (giữ nguyên) hoặc đã xoá cứng ⇒ log gộp câu chỉ đúng MỘT dạng nhận còn sống thì theo
  select case when count(distinct l.dang_moi) = 1 then min(l.dang_moi) end into v_gop
    from kho_doi_dang_log l where l.dang_cu = p_ma_dang_chep and l.loai = 'cau' and l.dang_moi is not null;
  if v_gop is not null and not public._kho_la_dang_cho(v_gop)
     and exists (select 1 from dai_ban_do b where b.ma_dang = v_gop and b.xoa_at is null) then return v_gop; end if;
  return p_ma_dang_chep;
end $$;
grant execute on function public._do_nhom_cua_o(text, text) to authenticated, service_role;
grant execute on function public._kho_dang_da_xoa_mem(text) to authenticated, service_role;

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
           sp.phase as src, sp.ma_cau
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
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end, btc.ma_cau
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
           btg.graded_at, 'bt', btg.ma_cau
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
  -- 12/10 ĐO ĐI THEO CÂU (spec-ban-do-4-tang §10): dạng của một lượt đo = _do_nhom_cua_o(câu, mã chép) — tính 1 lần cho mỗi cặp
  cap as (
    select d.kc, d.kd, public._do_nhom_cua_o(nullif(d.kc, ''), nullif(d.kd, '')) as nhom
    from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from mf) d
  ),
  mg as (
    select mf.hoc_sinh_id, cap.nhom as ma_dang, mf.value, mf.t, mf.src
    from mf join cap on cap.kc = coalesce(mf.ma_cau, '') and cap.kd = coalesce(mf.ma_dang, '')
  ),
  rk as (
    select mf.*,
           case mf.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by mf.hoc_sinh_id, mf.ma_dang
                              order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn
    from mg mf
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

CREATE OR REPLACE FUNCTION public.hs_dang_evals(p_mon text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_out jsonb;
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if; -- mig 202610011120: môn chưa có kho ⇒ rỗng, KHÔNG rơi về kho Toán
  if v_hs is null then return '[]'::jsonb; end if;
  if p_mon = 'Toán' then
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select r.md as ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src,
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang) as ten_dang,
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end) as ten_chuyen_de,
             coalesce(bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do) as muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      cross join lateral (select public._do_nhom_cua_o(p.ma_cau, p.ma_dang) as md) r -- 12/10: đo đi theo câu
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = r.md and bd_dai.xoa_at is null
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = r.md
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = r.md
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'Toán' or l.mon is null)
        and (bd_dai.ma_dang is not null or bd_hgt.ma_dang is not null or bd_hh.ma_bai is not null) -- 12/10: dạng không còn trong bản đồ ⇒ không hiện cho em

      union all
      select r.md, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do)
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      cross join lateral (select public._do_nhom_cua_o(bc.ma_cau, bc.ma_dang) as md) r
      join bai_test bt on bt.id = bl.bai_test_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = r.md and bd_dai.xoa_at is null
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = r.md
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = r.md
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'Toán'
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
        and bt.loai <> 'htd_luyen'
        and (bd_dai.ma_dang is not null or bd_hgt.ma_dang is not null or bd_hh.ma_bai is not null) -- 12/10: dạng không còn trong bản đồ ⇒ không hiện cho em

      union all
      select r.md, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt',
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do)
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      cross join lateral (select public._do_nhom_cua_o(bg.ma_cau, bg.ma_dang) as md) r
      left join dai_ban_do bd_dai on bd_dai.ma_dang = r.md and bd_dai.xoa_at is null
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = r.md
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = r.md
      where tl.hoc_sinh_id = v_hs and tl.mon = 'Toán'
        and (bd_dai.ma_dang is not null or bd_hgt.ma_dang is not null or bd_hh.ma_bai is not null) -- 12/10: dạng không còn trong bản đồ ⇒ không hiện cho em
    ) x;
  else
    -- môn 1 nhánh (KHTN, Tiếng Anh…): bảng bản đồ qua REGISTRY, môn là tham số (CLAUDE §1.6)
    execute format($q$
      select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src, bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join %1$I bd on bd.ma_dang = p.ma_dang
      where g.hoc_sinh_id = $1 and p.phase in ('et','mt','btvn') and (l.mon = $2 or (l.mon is null and bd.ma_dang is not null))   -- buổi không gắn lớp: chỉ nhận dạng của CHÍNH môn này (§1.6); trước đây dạng Toán lọt sang KHTN/Anh

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join %1$I bd on bd.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = $1 and blc.verdict is not null and bt.mon = $2
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt', bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join %1$I bd on bd.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = $1 and tl.mon = $2
    ) x
    $q$, public._kho_ban_do_tbl(p_mon, null)) into v_out using v_hs, p_mon;
  end if;
  return v_out;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_dang_yeu_2_cua_so(p_hs uuid, p_mon text)
 RETURNS TABLE(ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not public.la_thanh_vien() or v_bd is null then return; end if;
  return query execute format($q$
    select m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells(array[$1]::uuid[], true) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
    where m.muc = 'yeu'
      -- 12/10: "có đo gần đây" tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — phân giải 1 lần cho mỗi cặp câu–mã chép
      and m.ma_dang in (select public._do_nhom_cua_o(d.ma_cau, d.ma_dang)
                        from (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                              left join buoi_hoc b on b.id = g.buoi_hoc_id
                              where g.hoc_sinh_id = $1 and p.ma_dang is not null and coalesce(b.ngay, g.graded_at::date) >= $2) d)
    order by (m.n >= 3) desc, m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_btyeu_de_xuat_dang_moi(p_mon text DEFAULT NULL::text, p_case uuid DEFAULT NULL::uuid, p_thuc_hien boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text; v_mon text; v_n integer := 0; v_out jsonb := '[]'::jsonb; r record;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('them', 0, 'chi_tiet', '[]'::jsonb); end if;
  if p_thuc_hien and p_case is null then raise exception 'Thêm dạng phải chỉ rõ case.'; end if;
  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = 'dang_xu' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case) loop
    v_bd := public._kho_ban_do_tbl(v_mon);
    for r in execute format($q$
      with cs as (select y.id as case_id, y.hoc_sinh_id, y.created_at from bo_tro_yeu y where y.mon = $1 and y.trang_thai = 'dang_xu' and ($2::uuid is null or y.id = $2)),
      m as (select c.hoc_sinh_id, c.ma_dang, c.score, c.n from public.fn_mastery_cells((select array_agg(hoc_sinh_id) from cs), true) c
            where c.muc = 'yeu'),
      -- 12/10: dạng CÓ ĐO sau khi mở case, tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — 1 lần cho mỗi cặp câu–mã chép của từng case
      gan as materialized (
        select cs.case_id, public._do_nhom_cua_o(d.ma_cau, d.ma_dang) as md
        from cs cross join lateral (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                                    where g.hoc_sinh_id = cs.hoc_sinh_id and p.ma_dang is not null and g.graded_at > cs.created_at) d)
      select cs.case_id, cs.hoc_sinh_id, m.ma_dang, bd.ten_dang, m.score, m.n
      from cs join m on m.hoc_sinh_id = cs.hoc_sinh_id
      join lateral (select public._kho_ten_dang($1, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
      where not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = cs.case_id and d.ma_dang = m.ma_dang)
        and exists (select 1 from gan where gan.case_id = cs.case_id and gan.md = m.ma_dang)
      order by cs.case_id, (m.n >= 3) desc, m.score
    $q$, v_bd) using v_mon, p_case loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
  end loop;
  return jsonb_build_object('them', v_n, 'chi_tiet', v_out);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_hs_bu_dang(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid := public.my_hoc_sinh_id(); r record; v_out jsonb; v_kq jsonb := '[]'::jsonb; x jsonb; v_tbl text; v_co boolean;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select b.id as bu, b.ngay, hh.bu_cho_buoi_id as me, bm.ngay as ngay_me, l.mon, l.ten_lop into r
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = v_hs
    left join buoi_hoc bm on bm.id = hh.bu_cho_buoi_id left join lop l on l.id = bm.lop_id
    where b.id = p_buoi and b.loai = 'bu' limit 1;
  if r.bu is null then raise exception 'Không thấy buổi bù của em.'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(r.mon, x.ma_dang), x.ma_dang)) order by x.thu_tu), '[]'::jsonb)
    into v_out
    from (select public._do_nhom_cua_o(p.ma_cau, p.ma_dang) as ma_dang, min(case p.phase when 'ingame' then 0 when 'et' then 1000 else 2000 end + p.problem_no) as thu_tu
          from gami_session_problems p
          where p.ma_dang is not null and not p.hidden
            and ((p.buoi_hoc_id = r.me and p.hoc_sinh_id is null and p.phase in ('ingame', 'et', 'btvn'))
              or (p.buoi_hoc_id = r.bu and p.hoc_sinh_id = v_hs))
          group by 1) x;
  -- Thùy 03/10: bù 100% MCQ ⇒ báo dạng nào CÓ câu trắc nghiệm (cùng điều kiện duy nhất _kho_dk_mcq_sql) — dạng không có thì app ghi rõ 'học trên giấy'.
  for x in select * from jsonb_array_elements(v_out) loop
    v_tbl := public._kho_cau_tbl(r.mon, public._kho_nhanh_cua_dang(r.mon, x->>'ma_dang'));
    execute format('select exists (select 1 from %I c where c.dang_chinh = $1 and c.xoa_at is null and (%s or (c.kho_chuan and c.loai_cau = ''tra_loi_ngan'' and c.dap_an is not null)))', v_tbl, public._kho_dk_mcq_sql(v_tbl)) into v_co using x->>'ma_dang'; -- Thùy 10/10: MCQ hoặc trả lời ngắn
    v_kq := v_kq || (x || jsonb_build_object('co_mcq', coalesce(v_co, false)));
  end loop;
  return jsonb_build_object('mon', r.mon, 'ten_lop', r.ten_lop, 'ngay_me', r.ngay_me, 'ngay_bu', r.ngay, 'dangs', v_kq);
end $function$;

CREATE OR REPLACE FUNCTION public._btyeu_dong_bo_dang_ban_do()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; v_moi text; v_doi int := 0; v_dong int := 0;
begin
  for r in select d.id, d.bo_tro_yeu_id, d.ma_dang, y.mon
           from bo_tro_yeu_dang d join bo_tro_yeu y on y.id = d.bo_tro_yeu_id
           where y.trang_thai = 'dang_xu' and d.dong_at is null and (public._kho_ten_dang(y.mon, d.ma_dang) is null or public._kho_dang_da_xoa_mem(d.ma_dang))
  loop
    v_moi := nullif(public._do_nhom_cua_o(null, r.ma_dang), r.ma_dang); -- 12/10: gop_vao trước, rồi log gộp câu (một luật)
    if v_moi is not null and (public._kho_ten_dang(r.mon, v_moi) is null or public._kho_dang_da_xoa_mem(v_moi)) then v_moi := null; end if;
    if v_moi is not null and not exists (select 1 from bo_tro_yeu_dang x where x.bo_tro_yeu_id = r.bo_tro_yeu_id and x.ma_dang = v_moi) then
      update bo_tro_yeu_dang set ma_dang = v_moi where id = r.id; v_doi := v_doi + 1;
    else
      update bo_tro_yeu_dang set dong_at = now() where id = r.id; v_dong := v_dong + 1;
    end if;
  end loop;
  return jsonb_build_object('doi_ma', v_doi, 'dong', v_dong);
end $function$;

drop trigger if exists trg_dai_ban_do_xoa_mem_dong_bo_btyeu on public.dai_ban_do;
create trigger trg_dai_ban_do_xoa_mem_dong_bo_btyeu after update of xoa_at, gop_vao on public.dai_ban_do for each statement execute function public._trg_btyeu_dong_bo_dang_ban_do();

-- Case đang mở còn dạng đã xoá mềm (đo 12/10: 0 dòng) ⇒ đồng bộ ngay; số lệch lớn bất thường thì dừng.
do $$
declare v jsonb;
begin
  v := public._btyeu_dong_bo_dang_ban_do();
  if (v->>'doi_ma')::int + (v->>'dong')::int > 5 then raise exception 'Số dòng lệch khác lúc đo (0): %', v; end if;
  raise notice 'Đồng bộ dạng case yếu: %', v;
end $$;
