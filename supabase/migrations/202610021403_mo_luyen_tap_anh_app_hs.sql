-- ============================================================================
-- MỞ LUYỆN TẬP TIẾNG ANH TRÊN APP HỌC SINH (Thùy 02/10: "Mở chức năng luyện tập tiếng anh trên app học sinh đi.")
--
-- 1. HS CHỈ nhận câu trong KHO CHUẨN — MỌI môn (Thùy 02/10 chọn "Mọi môn"): `_kho_dk_online_hs_sql` = `_kho_dk_mcq_sql`
--    (cùng điều kiện bổ trợ). Đo trước khi đổi: Toán Đại bớt 2.814 câu (292 câu máy nghi), HGT bớt 256, KHTN 0, Anh 247 (câu nghi đáp án).
-- 2. `_kho_co_mon` mở 'Tiếng Anh' — Ở MIGRATION RIÊNG 202610021404, áp sau khi deploy app HS mới.
-- 3. Gỡ 7 chỗ "không phải KHTN thì là Toán" (spec-anh-kho.md §4) trên đường luyện tập: môn 1 nhánh đi qua REGISTRY
--    (`_kho_ban_do_tbl/_kho_cau_tbl`), chỉ Toán (3 nhánh) giữ nhánh riêng như cũ:
--    `_kho_ds_nhanh` · `tu_luyen_chu_de_ds_dang` · `hs_dang_evals` · `htd_lo_trinh` · `htd_co_mo` (thêm chặn `_kho_co_mon`)
--    · `fn_ban_do_phieu_luu` (môn chưa có bảng cụm ⇒ không cụm, trước đây lỗi `anh_cum_bai` không tồn tại)
--    · `tu_luyen_dien_sinh` (chỉ môn có nhánh hình học — trước đây KHTN cũng ra bài hình Toán).
-- 4. NGỮ LIỆU vào bài làm: `bai_test_cau.ngu_lieu` (jsonb; NULL = câu không có ngữ liệu — "không áp dụng", §1.5) — `_kho_snapshot_cau`
--    chụp đoạn văn / thông báo / ảnh biển báo kèm câu (HS không đọc được bảng `<môn>_ngu_lieu`). Bảng ngữ liệu suy từ bảng câu
--    (`<x>_cau_hoi` → `<x>_ngu_lieu`), chỉ dùng khi bảng có thật.
-- Còn "KHTN else Toán" NGOÀI đường luyện tập (để sau, không chặn mở): `_de_thi_kho` · `fn_giaibai_mon` · `_troly_ten_dang`.
-- ============================================================================

alter table public.bai_test_cau add column if not exists ngu_lieu jsonb;
comment on column public.bai_test_cau.ngu_lieu is
  'Ngữ liệu chụp kèm câu lúc sinh bài: {ma, loai, tieu_de, noi_dung, anh, am_thanh, thu_tu}. NULL = câu không có ngữ liệu (không áp dụng).';


CREATE OR REPLACE FUNCTION public._kho_dk_online_hs_sql(p_cautbl text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  -- Thùy 02/10: HS CHỈ nhận câu trong KHO CHUẨN, mọi môn ⇒ đúng điều kiện chọn câu bổ trợ (một nguồn duy nhất).
  select public._kho_dk_mcq_sql(p_cautbl)
$function$;

CREATE OR REPLACE FUNCTION public._kho_ds_nhanh(p_mon text)
 RETURNS text[]
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case when not public._kho_co_mon(p_mon) then '{}'::text[]
              when p_mon = 'Toán' then array[null::text, 'hinh_gt', 'hinh_hoc']
              else array[null::text] end   -- môn 1 nhánh (KHTN, Tiếng Anh…) — trước đây mọi môn ≠ KHTN nhận 3 nhánh của Toán
$function$;

CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_ds_dang(p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_khoi text;
  v_dk text;
  v_part jsonb;
  v_out jsonb := '[]'::jsonb;
  v_cutoff timestamptz := public._tu_luyen_dau_cua_so_truoc();
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if; -- mig 202610011120: môn chưa có kho ⇒ rỗng, KHÔNG rơi về kho Toán
  if v_hs is null then return '[]'::jsonb; end if;
  select l.khoi into v_khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_khoi is null then return '[]'::jsonb; end if;

  if p_mon = 'Toán' then
    v_dk := public._kho_dk_online_hs_sql('dai_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from dai_ban_do bd
      join lateral (select count(*) as tong_cau from dai_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, v_dk) into v_part using v_khoi;
    v_out := v_out || v_part;

    v_dk := public._kho_dk_online_hs_sql('hgt_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from hgt_ban_do bd
      join lateral (select count(*) as tong_cau from hgt_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, v_dk) into v_part using v_khoi;
    v_out := v_out || v_part;
  else
    -- môn 1 nhánh (KHTN, Tiếng Anh…): bảng lấy qua REGISTRY, không gõ tên bảng (CLAUDE §1.6)
    v_dk := public._kho_dk_online_hs_sql(public._kho_cau_tbl(p_mon, null));
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from %1$I bd
      join lateral (select count(*) as tong_cau from %2$I c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %3$s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, public._kho_ban_do_tbl(p_mon, null), public._kho_cau_tbl(p_mon, null), v_dk) into v_part using v_khoi;
    v_out := v_part;
  end if;

  -- Gắn da_luyen (coverage — vẫn hiện, chỉ KHÔNG còn dùng làm "%") từ sổ tu_luyen_dang_lan.
  select coalesce(jsonb_agg(
    x || jsonb_build_object('da_luyen', least(coalesce(tl.da_luyen, 0), (x->>'tong_cau')::int))
    order by x->>'ten_chuyen_de', x->>'ten_dang'
  ), '[]'::jsonb)
  into v_out
  from jsonb_array_elements(v_out) x
  left join (
    select ma_dang, count(distinct ma_cau) as da_luyen
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon
    group by ma_dang
  ) tl on tl.ma_dang = x->>'ma_dang';

  -- % = MASTERY thật (fn_mastery_cells, KHÔNG bịa công thức riêng — §2.0). Gọi 2 lần:
  --   (a) không giới hạn thời gian → SCORE thật (WINDOW=5 chuẩn, không bị cắt cụt).
  --   (b) p_since = đầu cửa sổ trước → CHỈ để biết dạng có hoạt động GẦN ĐÂY không.
  --   Dạng KHÔNG có ở (b) ⇒ "chưa đánh giá được" (pct=null), dù (a) có thể vẫn ra số
  --   từ dữ liệu CŨ — không hiện số đó ra màn (không chính xác cho ngữ cảnh "luyện gì bây giờ").
  return (
    with full_score as (
      select ma_dang, score, muc from public.fn_mastery_cells(array[v_hs], true, null, 5, 5, 3)
    ),
    recent as (
      select distinct ma_dang from public.fn_mastery_cells(array[v_hs], true, v_cutoff, 5, 5, 3)
    ),
    lst as (
      select x, fs.score, fs.muc, (r.ma_dang is not null) as gan_day
      from jsonb_array_elements(v_out) x
      left join full_score fs on fs.ma_dang = x->>'ma_dang'
      left join recent r on r.ma_dang = x->>'ma_dang'
    )
    select coalesce(jsonb_agg(
      x || jsonb_build_object(
        'pct', case when gan_day and score is not null then round(score * 100) else null end,
        'muc', case when gan_day then muc else null end
      )
      -- Yếu nhất lên đầu; "chưa đánh giá được" (pct null) xuống CUỐI (không phải yếu, là KHÔNG RÕ).
      order by (case when gan_day and score is not null then 0 else 1 end), score asc, x->>'ten_dang'
    ), '[]'::jsonb)
    from lst
  );
end $function$;

CREATE OR REPLACE FUNCTION public.htd_lo_trinh(p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_dang_can text[];
  v_dk text;
  v_part jsonb;
  v_out jsonb := '[]'::jsonb;
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if; -- mig 202610011120: môn chưa có kho ⇒ rỗng, KHÔNG rơi về kho Toán
  if v_hs is null then return '[]'::jsonb; end if;
  select coalesce(array_agg(distinct bdd.ma_dang), '{}') into v_dang_can
    from bo_tro_duoi bd join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
    where bd.hoc_sinh_id = v_hs and bd.trang_thai = 'can_duoi';
  if array_length(v_dang_can, 1) is null then return '[]'::jsonb; end if;

  if p_mon = 'Toán' then
    v_dk := public._kho_dk_online_hs_sql('dai_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', c.tong_cau
      ) order by coalesce(bd.muc_do, 3), bd.ma_dang), '[]'::jsonb)
      from dai_ban_do bd
      join lateral (select count(*) as tong_cau from dai_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from dai_ban_do where ma_dang = any($1))
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_out || v_part;

    v_dk := public._kho_dk_online_hs_sql('hgt_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', c.tong_cau
      ) order by coalesce(bd.muc_do, 3), bd.ma_dang), '[]'::jsonb)
      from hgt_ban_do bd
      join lateral (select count(*) as tong_cau from hgt_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from hgt_ban_do where ma_dang = any($1))
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_out || v_part;
  else
    -- môn 1 nhánh (KHTN, Tiếng Anh…): bảng lấy qua REGISTRY, không gõ tên bảng (CLAUDE §1.6)
    v_dk := public._kho_dk_online_hs_sql(public._kho_cau_tbl(p_mon, null));
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', c.tong_cau
      ) order by coalesce(bd.muc_do, 3), bd.ma_dang), '[]'::jsonb)
      from %1$I bd
      join lateral (select count(*) as tong_cau from %2$I c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %3$s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from %1$I where ma_dang = any($1))
    $q$, public._kho_ban_do_tbl(p_mon, null), public._kho_cau_tbl(p_mon, null), v_dk) into v_part using v_dang_can;
    v_out := v_part;
  end if;

  -- Tuần tự mở/khoá THEO ĐỘ KHÓ trước (1→2→3…), trong cùng độ khó theo ma_dang —
  -- KHỚP đúng thứ tự hiển thị cuối bên dưới, không thì "mở" lệch với "nhìn thấy".
  with base as (
    select x, (htd.test_nop_at is not null) as xong, (htd.doc_ly_thuyet_at is not null) as doc_lt
    from jsonb_array_elements(v_out) x
    left join hoc_tu_dau_dang htd
      on htd.hoc_sinh_id = v_hs and htd.mon = p_mon and htd.ma_dang = x->>'ma_dang'
  ), tuan_tu as (
    select x, xong, doc_lt,
           lag(xong) over (partition by x->>'ma_chuyen_de' order by coalesce((x->>'muc_do')::int, 3), x->>'ma_dang') as xong_truoc
    from base
  )
  select coalesce(jsonb_agg(
    x || jsonb_build_object('doc_ly_thuyet', doc_lt, 'xong', xong, 'mo', coalesce(xong_truoc, true))
    order by x->>'ma_chu_de', x->>'ma_chuyen_de', coalesce((x->>'muc_do')::int, 3), x->>'ma_dang'
  ), '[]'::jsonb)
  into v_out
  from tuan_tu;

  return v_out;
end $function$;

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
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src,
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang) as ten_dang,
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end) as ten_chuyen_de,
             coalesce(bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do) as muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = p.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = p.ma_dang
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = p.ma_dang
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'Toán' or l.mon is null)

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do)
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = bc.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = bc.ma_dang
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = bc.ma_dang
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'Toán'
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt',
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang, bd_hh.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de, bd_hh.ten_chuyen_de, case when bd_hh.ma_bai is not null then 'Hình học' end),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do, bd_hh.muc_do)
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = bg.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = bg.ma_dang
      left join hinh_hoc_bai bd_hh on bd_hh.ma_bai = bg.ma_dang
      where tl.hoc_sinh_id = v_hs and tl.mon = 'Toán'
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

CREATE OR REPLACE FUNCTION public.htd_co_mo(p_mon text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v boolean;
begin
  if not public._kho_co_mon(p_mon) then return false; end if;  -- môn chưa có kho ⇒ không rơi về kho Toán
  if p_mon = 'Toán' then
    select exists (
      select 1 from bo_tro_duoi bd
      join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
      where bd.hoc_sinh_id = public.my_hoc_sinh_id() and bd.trang_thai = 'can_duoi'
        and exists (select 1 from dai_ban_do b where b.ma_dang = bdd.ma_dang
                    union all select 1 from hgt_ban_do b where b.ma_dang = bdd.ma_dang)
    ) into v;
  else
    -- môn 1 nhánh (KHTN, Tiếng Anh…): bảng bản đồ qua REGISTRY (CLAUDE §1.6)
    execute format($q$
      select exists (
        select 1 from bo_tro_duoi bd
        join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
        where bd.hoc_sinh_id = public.my_hoc_sinh_id() and bd.trang_thai = 'can_duoi'
          and exists (select 1 from %I b where b.ma_dang = bdd.ma_dang))
    $q$, public._kho_ban_do_tbl(p_mon, null)) into v;
  end if;
  return coalesce(v, false);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_ban_do_phieu_luu(p_mon text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid; v_khoi text;
  v_bo jsonb := public._phieu_luu_bo();
  v_nq int; v_nb int; v_nbi int;
  v_dong jsonb := '[]';
  v_part jsonb;
  r record;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select l.id, l.khoi into v_lop, v_khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon order by hl.ngay_vao desc limit 1;
  if v_khoi is null or not public._kho_co_mon(p_mon) then
    return jsonb_build_object('mon', p_mon, 'khoi', v_khoi, 'luc_dia', '[]'::jsonb);
  end if;
  v_nq := jsonb_array_length(v_bo->'quai'); v_nb := jsonb_array_length(v_bo->'boss'); v_nbi := jsonb_array_length(v_bo->'biome');

  -- số câu làm được trên app + cụm, theo từng bảng câu của nhánh (1 truy vấn / nhánh)
  for r in select distinct d.cautbl from public._kho_ban_do_dong(p_mon, v_khoi) d loop
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object('ma_dang', d.ma_dang, 'so_cau', coalesce(c.n, 0), 'cum', coalesce(k.cum, '[]'::jsonb))), '[]'::jsonb)
      from public._kho_ban_do_dong($1, $2) d
      left join lateral (select count(*) n from %1$I c where c.dang_chinh = d.ma_dang and c.xoa_at is null and %2$s) c on true
      left join lateral (%3$s) k on true
      where d.cautbl = %4$L
    $q$, r.cautbl, public._kho_dk_online_hs_sql(r.cautbl),
      -- môn chưa có bảng cụm (Tiếng Anh) ⇒ không cụm (mỗi màn 1 quái mang tên dạng); trước đây lỗi "relation anh_cum_bai does not exist"
      case when to_regclass('public.' || public._kho_cum_tbl(r.cautbl)) is null then 'select null::jsonb as cum'
           else format('select jsonb_agg(jsonb_build_object(''ma'', k.ma_cum, ''ten'', k.ten) order by k.thu_tu, k.ma_cum) cum from %I k where k.ma_dang = d.ma_dang',
                       public._kho_cum_tbl(r.cautbl)) end,
      r.cautbl)
    into v_part using p_mon, v_khoi;
    v_dong := v_dong || v_part;
  end loop;

  return (
    with x as (select (e->>'ma_dang') ma_dang, (e->>'so_cau')::int so_cau, e->'cum' cum from jsonb_array_elements(v_dong) e),
    m as (select ma_dang, score, muc from public.fn_mastery_cells(array[v_hs], true, null, 5, 5, 3)),
    -- Chỉ màn VÀO ĐƯỢC (có câu trên app) hoặc em ĐÃ CÓ SỐ ĐO (vd chỉ làm trên giấy) — bỏ dạng trống/dữ liệu thử.
    -- Mỗi khu vực 1 BOSS: màn khó nhất (mức độ cao nhất, hoà thì mã sau) — quái cuối của màn đó là boss.
    d as (
      select d0.*, array_position(public._kho_ds_nhanh(p_mon), d0.nhanh) as nh_stt,
        row_number() over (partition by d0.ma_chu_de, d0.ma_chuyen_de order by d0.muc_do desc nulls last, d0.ma_dang desc) = 1 as man_boss
      from public._kho_ban_do_dong(p_mon, v_khoi) d0
      where exists (select 1 from x where x.ma_dang = d0.ma_dang and x.so_cau > 0)
         or exists (select 1 from m where m.ma_dang = d0.ma_dang)
    ),
    day as (
      select distinct t.ma_dang from bai_test bt join bai_test_cau t on t.bai_test_id = bt.id
      where bt.lop_id = v_lop and bt.loai in ('giao_trinh', 'et', 'btvn', 'de_thi') and t.ma_dang is not null
    ),
    -- thứ tự lục địa: nhánh (Đại → Hình GT → Hình học / nhánh gốc môn khác) rồi mã chủ đề
    cd as (select ma_chu_de, row_number() over (order by nh, ma_chu_de) - 1 as stt
           from (select ma_chu_de, min(nh_stt) nh from d group by ma_chu_de) z),
    man as (
      select d.ma_chu_de, d.ten_chu_de, d.ma_chuyen_de, d.ten_chuyen_de, d.ma_dang,
        jsonb_build_object(
          'ma_dang', d.ma_dang, 'ten', d.ten_dang, 'muc_do', d.muc_do, 'nhanh', d.nhanh,
          'so_cau', coalesce(x.so_cau, 0),
          'trang_thai', case when m.ma_dang is null then 'chua_do' when m.muc = 'dat' then 'dat' else 'yeu' end,
          'muc', m.muc,
          'mastery', round(m.score, 2),
          'da_day', (day.ma_dang is not null or m.ma_dang is not null),
          'la_man_boss', d.man_boss,
          'quai', (
            select jsonb_agg(jsonb_build_object('ma', q.ma, 'ten', q.ten,
                     'loai_quai', case when q.boss then v_bo->'boss'->>(abs(hashtext(q.ma)) % v_nb)
                                       else v_bo->'quai'->>(abs(hashtext(q.ma)) % v_nq) end,
                     'la_boss', q.boss) order by q.i)
            from (
              select k.i, k.v->>'ma' as ma, coalesce(k.v->>'ten', d.ten_dang) as ten,
                     d.man_boss and k.i = count(*) over () as boss
              from jsonb_array_elements(case when jsonb_array_length(coalesce(x.cum, '[]')) = 0
                     then jsonb_build_array(jsonb_build_object('ma', d.ma_dang, 'ten', d.ten_dang)) else x.cum end) with ordinality k(v, i)
            ) q)
        ) as j
      from d left join x on x.ma_dang = d.ma_dang left join m on m.ma_dang = d.ma_dang left join day on day.ma_dang = d.ma_dang
    ),
    kv as (
      select ma_chu_de, ten_chu_de, ma_chuyen_de,
        jsonb_build_object('ma', ma_chuyen_de, 'ten', min(ten_chuyen_de),
          'man', jsonb_agg(j || jsonb_build_object('thu_tu', 0) order by ma_dang)) as j
      from man group by ma_chu_de, ten_chu_de, ma_chuyen_de
    ),
    ld as (
      select kv.ma_chu_de, jsonb_build_object('ma', kv.ma_chu_de, 'ten', min(kv.ten_chu_de), 'thu_tu', min(cd.stt) + 1,
          'biome', v_bo->'biome'->>(min(cd.stt)::int % v_nbi),
          'khu_vuc', jsonb_agg(kv.j order by kv.ma_chuyen_de)) as j
      from kv join cd on cd.ma_chu_de = kv.ma_chu_de group by kv.ma_chu_de
    )
    select jsonb_build_object('mon', p_mon, 'khoi', v_khoi,
      'luc_dia', coalesce((select jsonb_agg(
          -- đánh số thứ tự khu vực / màn trong từng tầng (hợp đồng có thu_tu ở mọi tầng)
          ld.j || jsonb_build_object('khu_vuc', (
            select jsonb_agg(k.v || jsonb_build_object('thu_tu', k.i,
                     'man', (select jsonb_agg(mm.v || jsonb_build_object('thu_tu', mm.i) order by mm.i)
                             from jsonb_array_elements(k.v->'man') with ordinality mm(v, i)))
                   order by k.i)
            from jsonb_array_elements(ld.j->'khu_vuc') with ordinality k(v, i)))
          order by (ld.j->>'thu_tu')::int) from ld), '[]'::jsonb))
  );
end $function$;

CREATE OR REPLACE FUNCTION public.tu_luyen_dien_sinh(p_mon text DEFAULT 'Toán'::text, p_n integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid := public.my_hoc_sinh_id(); v_lop uuid; v_khoi text; v_bt uuid; v_thu_tu int := 0; r record;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  -- bài chứng minh (điền ô) lấy từ hinh_form_dien = nhánh HÌNH HỌC ⇒ môn không có nhánh này không được sinh (trước đây KHTN ra bài hình Toán)
  if not coalesce('hinh_hoc' = any(public._kho_ds_nhanh(p_mon)), false) then raise exception 'Môn % chưa có bài chứng minh trên app.', p_mon; end if;
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  select l.khoi into v_khoi from lop l where l.id = v_lop;
  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo') returning id into v_bt;
  for r in
    select f.*, d.ma, d.de, d.gia_thiet, d.anh, d.khoi
    from hinh_form_dien f join lateral (select * from fn_dien_form_cho_duyet(null, true) x where x.id = f.id) d on true
    where f.da_duyet and f.xoa_at is null and (v_khoi is null or d.khoi = v_khoi)
      and f.id not in (select btc.form_dien_id from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id
                       where bt.hoc_sinh_id = v_hs and btc.form_dien_id is not null order by bt.created_at desc limit 30)
    order by random() limit greatest(1, least(p_n, 6))
  loop
    v_thu_tu := v_thu_tu + 1;
    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, anh_de, dap_an_key, diem, form_dien_id, dien, o_rule)
    values (v_bt, v_thu_tu, 1, r.ma, 'dien_o',
      r.de || case when r.gia_thiet is not null then E'\n' || r.gia_thiet else '' end, r.anh,
      (select jsonb_agg(o->>'dap_an' order by i) from jsonb_array_elements(r.o) with ordinality t(o, i)), 1, r.id,
      jsonb_build_object('buoc', public._dien_buoc_hs(r.buoc, r.o), 'o', public._dien_hs_view(r.o)),
      (select jsonb_agg((select jsonb_agg(case when (p->>'dung')::boolean then null else to_jsonb(p->>'loi') end order by j)
                         from jsonb_array_elements(o->'phuong_an') with ordinality q(p, j)) order by i)
         from jsonb_array_elements(r.o) with ordinality t(o, i)));
  end loop;
  if v_thu_tu = 0 then
    -- rollback bài rỗng: raise huỷ cả insert bai_test
    raise exception 'Chưa có bài chứng minh nào để luyện — thầy cô đang duyệt, quay lại sau nhé.';
  end if;
  update bai_test set so_cau = v_thu_tu where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', v_thu_tu);
end $function$;

CREATE OR REPLACE FUNCTION public._kho_snapshot_cau(p_bt_id uuid, p_cautbl text, p_lttbl text, p_ma_cau text, p_thu_tu integer, p_ma_cum text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_row record; v_ly_thuyet text; v_ftbl text; v_form_id uuid; v_form_lc jsonb; v_form_da text; v_nltbl text; v_nl jsonb;
begin
  execute format($q$select * from %1$I where ma_cau = $1$q$, p_cautbl) into v_row using p_ma_cau;
  if v_row.ma_cau is null then raise exception 'Câu % không có trong %', p_ma_cau, p_cautbl; end if;
  execute format($q$select noi_dung from %1$I where ma_dang = $1$q$, p_lttbl) into v_ly_thuyet using v_row.dang_chinh;
  -- NGỮ LIỆU (đoạn văn / thông báo / biển báo) dùng chung cho nhiều câu: chụp kèm câu — HS không đọc được bảng ngữ liệu.
  v_nltbl := replace(p_cautbl, '_cau_hoi', '_ngu_lieu');
  if to_regclass('public.' || v_nltbl) is not null and to_jsonb(v_row) ->> 'ngu_lieu' is not null then
    execute format($q$select jsonb_build_object('ma', ma_ngu_lieu, 'loai', loai, 'tieu_de', tieu_de, 'noi_dung', noi_dung,
                                                'anh', anh, 'am_thanh', am_thanh, 'thu_tu', $2)
                      from %1$I where ma_ngu_lieu = $1$q$, v_nltbl)
      into v_nl using to_jsonb(v_row) ->> 'ngu_lieu', (to_jsonb(v_row) ->> 'thu_tu_trong_ngu_lieu')::int;
  end if;

  v_ftbl := public._kho_form_tn_cua(p_cautbl);
  if v_ftbl is not null then
    execute format($q$select id, lua_chon, dap_an from %1$I where ma_cau = $1 and da_duyet and xoa_at is null$q$, v_ftbl)
      into v_form_id, v_form_lc, v_form_da using p_ma_cau;
  end if;

  if v_form_id is not null then
    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
      menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum, form_tn_id, form_tn_hgt_id, lua_chon_rule, ngu_lieu)
    values (
      p_bt_id, p_thu_tu, 1, v_row.ma_cau, 'trac_nghiem', v_row.noi_dung,
      (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(v_form_lc) with ordinality t(e, o)),
      null, to_jsonb(v_form_da),
      v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
      coalesce(p_ma_cum, v_row.ma_cum),
      case when v_ftbl = 'dai_cau_form_tn' then v_form_id end,
      case when v_ftbl = 'hgt_cau_form_tn' then v_form_id end,
      (select array_agg(case when (e->>'dung')::boolean then null else e->>'rule' end order by o)
         from jsonb_array_elements(v_form_lc) with ordinality t(e, o)),
      v_nl
    );
    return;
  end if;

  insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
    menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum, ngu_lieu)
  values (
    p_bt_id, p_thu_tu, 1, v_row.ma_cau, v_row.loai_cau, v_row.noi_dung, v_row.lua_chon, v_row.menh_de,
    case v_row.loai_cau
      when 'trac_nghiem' then to_jsonb(upper(trim(v_row.dap_an)))
      when 'tra_loi_ngan' then to_jsonb(trim(v_row.dap_an))
      when 'dung_sai' then (select jsonb_agg(case when upper(left(trim(m->>'dap_an'), 1)) = 'S' then 'S' else 'D' end)
                             from jsonb_array_elements(coalesce(v_row.menh_de, '[]'::jsonb)) m)
      else to_jsonb(v_row.dap_an)
    end,
    v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
    coalesce(p_ma_cum, v_row.ma_cum), v_nl
  );
end $function$;
