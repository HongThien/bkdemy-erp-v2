-- ============================================================================
-- 202610231535 — mastery_bo_dem_2_lan_cau_app
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/10 "đo rồi sửa luôn". Câu ET / BTVN làm trên app có HAI dòng: bai_lam_cau (gốc) + gami_grades.bai_lam_cau_id
--   (bản sao do fn_et_online_dong_bo / fn_btvn_online_dong_bo đẩy vào lưới chấm buổi). _mastery_cells_core và hs_dang_evals
--   cộng cả hai ⇒ mỗi câu app tính 2 lần (đo 23/10: 9.753 cặp — ET 980 luôn tính, BTVN 8.773 khi p_include_btvn).
--   GIỮ BẢN CHẤM BUỔI (gami), bỏ bản bai_lam_cau: TA sửa tay ở lưới chấm buổi (66 cặp đang lệch kết quả, đa số là người sửa
--   SAU máy chấm), và ma_cau ở lưới = mã GỐC (mã đề 2/3 quy về) — đúng quy ước fn_et_online_dong_bo.
--   _dbht_cau (Dashboard học tập, mig 202610231524) đổi theo cho cùng một luật, ngày của bản sao vẫn = ngày nộp trên app.
--   Không đụng: fn_mastery_cells_hinh (nhánh bai_lam chỉ lấy bo_tro*/retest, không có bản sao), _hs_dang_da_hoc (đếm distinct),
--   fn_thanh_tuu_thang (2 chỉ số riêng).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá dữ liệu. Thay THÂN 3 hàm (chữ ký giữ nguyên) — kết quả mastery các ô có câu app đổi (bỏ phần đếm trùng).
-- ============================================================================

CREATE OR REPLACE FUNCTION public._mastery_cells_core(p_bdm boolean, p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5, p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
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
      and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id) -- 23/10: câu app đã có BẢN SAO trong bảng chấm buổi ⇒ lấy bản chấm buổi
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
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
    select d.kc, d.kd,
           case when public._btyeu_la_hinh_mh(d.kd) then null
                when p_bdm then public._do_o_bdm(nullif(d.kc, ''), nullif(d.kd, ''))   -- BẢN ĐỒ MỚI (K6–12; cấp 1 + Hình giữ cũ bên trong)
                else public._do_nhom_cua_o(nullif(d.kc, ''), nullif(d.kd, '')) end as nhom -- 14/10: bài mô hình đo ở fn_mastery_cells_hinh
    from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from mf) d
  ),
  mg as (
    select mf.hoc_sinh_id, cap.nhom as ma_dang, mf.value, mf.t, mf.src
    from mf join cap on cap.kc = coalesce(mf.ma_cau, '') and cap.kd = coalesce(mf.ma_dang, '') and cap.nhom is not null
  ),
  rk as (
    select mf.*,
           case mf.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by mf.hoc_sinh_id, mf.ma_dang
                              order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn,
           -- ⭐ HÌNH–HỌC (CEO 14/10): bài tập hình làm được ít hơn Đại nhiều ⇒ thang đo 3 bài thay vì 5.
           -- Độ tin scale cùng tỉ lệ (3/2 thay 5/3) — cùng bộ số với Hình–Luyện (fn_mastery_cells_hinh, 21/08).
           -- "Là Hình–Học" = dạng nằm trong hinh_hoc_bai (KP = bài học). Đại / Hình giải tích giữ nguyên tham số.
           case when hh.ma_bai is not null then least(p_window, 3)  else p_window  end as cs,
           case when hh.ma_bai is not null then least(p_tin_cao, 3) else p_tin_cao end as tc,
           case when hh.ma_bai is not null then least(p_tin_tb, 2)  else p_tin_tb  end as tt
    from mg mf
    left join hinh_hoc_bai hh on hh.ma_bai = mf.ma_dang
  )
  select hoc_sinh_id, ma_dang,
         sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) as score,
         count(*) as n,
         case when sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end
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
        and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id) -- 23/10: câu app đã có BẢN SAO trong bảng chấm buổi ⇒ lấy bản chấm buổi
        and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
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
        and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id) -- 23/10: câu app đã có BẢN SAO trong bảng chấm buổi ⇒ lấy bản chấm buổi
        and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
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

create or replace function _dbht_cau(p_hs uuid[], p_tu date, p_mon text)
returns table(hoc_sinh_id uuid, ngay date, t timestamptz, kenh text, luot text, thu_tu integer, ma_cau text,
              gia_tri numeric, dang_bai_id text, nhom_id text, chuyen_de_id text)
language sql stable set search_path to 'public' as $$
  with m as (
    -- chấm tay theo buổi (giấy / trên lớp): ET · MT · BTVN giấy
    select g.hoc_sinh_id, coalesce((nop.t at time zone 'Asia/Ho_Chi_Minh')::date, bh.ngay) as ngay,
           coalesce(nop.t, (bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as kenh, sp.phase || ':' || sp.buoi_hoc_id as luot, sp.problem_no as thu_tu, sp.ma_cau, sp.ma_dang,
           case when g.diem_dat is not null and sp.diem_toi_da > 0 then least(g.diem_dat / sp.diem_toi_da, 1)
                else case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end as gia_tri
      from gami_grades g
      join gami_session_problems sp on sp.id = g.problem_id
      join buoi_hoc bh on bh.id = sp.buoi_hoc_id
      join lop l on l.id = bh.lop_id and l.mon = p_mon
      left join lateral (select coalesce(bl0.nop_at, b0.cham_at) as t from bai_lam_cau b0 join bai_lam bl0 on bl0.id = b0.bai_lam_id
                          where b0.id = g.bai_lam_cau_id) nop on true
     where g.hoc_sinh_id = any(p_hs) and sp.phase in ('et', 'mt', 'btvn')
       and (p_tu is null or bh.ngay >= p_tu - 60)   -- bản sao câu app: ngày = ngày nộp (có thể sau buổi) ⇒ lọc đúng ở dưới
    union all
    -- làm trên app
    select bl.hoc_sinh_id, x.ngay, x.t,
           case when bt.loai in ('et', 'de_thi') then 'et' when bt.loai in ('btvn', 'giao_trinh') then 'btvn' else bt.loai end,
           'bl:' || bl.id, btc.thu_tu, btc.ma_cau, btc.ma_dang,
           case when blc.diem is not null and btc.diem > 0 then least(blc.diem / btc.diem, 1)
                else case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test bt on bt.id = bl.bai_test_id and bt.mon = p_mon
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
      cross join lateral (select coalesce(bl.nop_at, blc.cham_at) as t,
                                 (coalesce(bl.nop_at, blc.cham_at) at time zone 'Asia/Ho_Chi_Minh')::date as ngay) x
     where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
       and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
       and bt.loai in ('et', 'de_thi', 'btvn', 'giao_trinh', 'bo_tro_test', 'retest', 'bu_test', 'htd_test')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
       and (p_tu is null or x.ngay >= p_tu)
  ),
  cap as (
    select d.kc, d.kd, public._do_o_bdm(nullif(d.kc, ''), nullif(d.kd, '')) as o
      from (select distinct coalesce(ma_cau, '') kc, coalesce(ma_dang, '') kd from m
             where ma_cau is not null or ma_dang is not null) d
     where not public._btyeu_la_hinh_mh(nullif(d.kd, ''))
  )
  select m.hoc_sinh_id, m.ngay, m.t, m.kenh, m.luot, m.thu_tu, m.ma_cau, m.gia_tri, db.id, n.id, n.chuyen_de_id
    from m
    join cap on cap.kc = coalesce(m.ma_cau, '') and cap.kd = coalesce(m.ma_dang, '')
    join dai_bdm_dang_bai db on db.id = cap.o
    join dai_bdm_nhom n on n.id = db.nhom_id
   where p_tu is null or m.ngay >= p_tu
$$;
