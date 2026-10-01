-- ============================================================================
-- 202610011120 — App HS: chọn môn ĐÚNG NGHĨA (Toán · KHTN · Tiếng Anh) + chặn kho Toán rò sang môn khác
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 01/10: "HS học KHTN + Toán vào app chỉ thấy KHTN… phải chọn môn, chuyển môn là chuyển tính năng học tập"):
--   (1) Registry kho `_kho_cau_tbl/_kho_ban_do_tbl/_kho_lt_tbl` và `hs_dang_evals` rẽ nhánh `KHTN` / `else` ⇒ MỌI môn
--       không phải KHTN rơi về kho TOÁN. App chọn môn theo chữ cái (bản cũ `hs_mon_cua_toi`, 'Tiếng Anh' < 'Toán') ⇒
--       em học Toán + Tiếng Anh làm tự luyện CÂU TOÁN gắn nhãn `mon='Tiếng Anh'`. Đo 01/10: 68 bài tự luyện 'Tiếng Anh'
--       (5 em, từ 21/08) + 2 bài 'Văn' (1 em), 851 dòng `tu_luyen_dang_lan` — toàn mã dạng T…. Chọn Tiếng Anh ở thanh
--       chọn môn (28/09) thì Tự luyện/Thông tin học tập hiện dạng Toán. (Sửa dữ liệu cũ = việc riêng, chờ Thùy.)
--   ⇒ `_kho_co_mon(mon)` = 1 dòng registry "môn nào CÓ kho câu trên app". Hàm HS đọc kho trả RỖNG, hàm sinh bài BÁO LỖI
--      rõ khi môn chưa có kho — §1.5 "thà bỏ trống còn hơn đánh sai". Thêm môn có kho = sửa hàm này + `_kho_*_tbl`.
--      KHÔNG sửa `_kho_*_tbl` (22 hàm gọi, gồm luồng staff bổ trợ — đổi fallback ở đó là việc riêng, đo riêng).
--   (2) `hs_mon_hoc_cua_toi` = `hs_lop_mon_cua_toi` + cờ `co_kho` ⇒ app biết ô nào của môn đang chọn chưa mở.
--       Hàm cũ GIỮ NGUYÊN (bản PWA cũ còn chạy tới ~30 phút sau deploy vẫn gọi).
--   (3) Lịch sử làm bài + BXH tự luyện đang gộp MỌI môn ⇒ thêm bản có `p_mon` (overload, bản cũ giữ cho app cũ).
--   Thân các hàm ở phần (4) lấy từ `pg_get_functiondef` bản đang chạy (scripts/_gen_mig_chan_ro_mon.mjs), chỉ chèn
--   1 dòng chặn ngay sau `begin` — không chép file migration cũ.
--
-- MẤT GÌ (Luật xoá): Không mất gì — thêm 4 hàm, sửa 9 hàm bằng create or replace (giữ nguyên chữ ký, ACL, thân cũ).
--   Hành vi đổi DUY NHẤT: gọi với môn không có kho (Tiếng Anh/Văn) — trước ra dữ liệu Toán, giờ ra rỗng / báo lỗi.
-- ============================================================================

-- (1) Registry: môn có kho câu hỏi trên app (đối xứng §1.6 — mọi chỗ hỏi "môn này có kho không" đi qua đây)
create or replace function public._kho_co_mon(p_mon text)
returns boolean language sql immutable as $$
  select p_mon in ('Toán', 'KHTN')
$$;
revoke all on function public._kho_co_mon(text) from public;
revoke execute on function public._kho_co_mon(text) from anon;

-- (2) Danh sách môn em đang học, kèm lớp + cờ có kho. Thứ tự = môn vào học trước đứng trước (dòng đầu = môn mặc định).
create or replace function public.hs_mon_hoc_cua_toi()
returns table (mon text, ten_lop text, co_kho boolean)
language sql stable security definer set search_path = public as $$
  select l.mon, string_agg(l.ten_lop, ', ' order by hl.ngay_vao, l.ten_lop) as ten_lop, public._kho_co_mon(l.mon) as co_kho
  from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
  where hl.hoc_sinh_id = public.my_hoc_sinh_id() and hl.trang_thai = 'dang_hoc'
  group by l.mon
  order by min(hl.ngay_vao), l.mon
$$;
revoke all on function public.hs_mon_hoc_cua_toi() from public;
revoke execute on function public.hs_mon_hoc_cua_toi() from anon;
grant execute on function public.hs_mon_hoc_cua_toi() to authenticated;

-- (3a) BXH tự luyện theo khối — CỦA 1 MÔN (bản 1 tham số giữ nguyên cho app cũ)
create or replace function public.hs_xep_hang_tu_luyen(p_khoi text, p_mon text)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x order by x.so_cau_dung desc, x.ho_ten asc), '[]'::jsonb) from (
    select h.ma_hs, h.ho_ten,
           count(*) filter (where blc.verdict = 'correct')::int as so_cau_dung,
           (h.id = public.my_hoc_sinh_id()) as la_toi
    from hoc_sinh h
    join bai_test bt on bt.hoc_sinh_id = h.id and bt.loai = 'tu_luyen' and bt.mon = p_mon
    join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = h.id
    join bai_lam_cau blc on blc.bai_lam_id = bl.id
    where h.khoi = p_khoi and h.trang_thai = 'dang_hoc'
    group by h.id, h.ma_hs, h.ho_ten
  ) x
$$;
revoke all on function public.hs_xep_hang_tu_luyen(text, text) from public;
revoke execute on function public.hs_xep_hang_tu_luyen(text, text) from anon;
grant execute on function public.hs_xep_hang_tu_luyen(text, text) to authenticated;

-- (3b) Lịch sử làm bài trên app — CỦA 1 MÔN (bản cũ giữ nguyên). Không default ở tham số nào ⇒ không lẫn overload.
create or replace function public.fn_hs_lich_su_lam_bai(p_so_ngay integer, p_mon text)
returns table (ngay date, so_cau integer, so_dung integer, so_sai integer, thoi_gian_giay integer)
language sql stable security definer set search_path = public as $$
  with cua_so as (
    select (now() at time zone 'Asia/Ho_Chi_Minh')::date as ngay_den,
           ((now() at time zone 'Asia/Ho_Chi_Minh')::date - (p_so_ngay - 1)) as ngay_tu
  ),
  moi as (
    select (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date as ngay, blc.cham_at, blc.verdict
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    where bl.hoc_sinh_id = public.my_hoc_sinh_id() and blc.verdict is not null and bt.mon = p_mon
      and (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date between (select ngay_tu from cua_so) and (select ngay_den from cua_so)
  )
  select m.ngay,
         count(*)::int as so_cau,
         count(*) filter (where m.verdict = 'correct')::int as so_dung,
         count(*) filter (where m.verdict <> 'correct')::int as so_sai,
         case when count(*) < 2 then 0 else greatest(0, extract(epoch from (max(m.cham_at) - min(m.cham_at)))::int) end as thoi_gian_giay
  from moi m
  group by m.ngay
  order by m.ngay desc
$$;
revoke all on function public.fn_hs_lich_su_lam_bai(integer, text) from public;
revoke execute on function public.fn_hs_lich_su_lam_bai(integer, text) from anon;
grant execute on function public.fn_hs_lich_su_lam_bai(integer, text) to authenticated;

-- (4) Chặn rò môn ở các hàm HS đọc/sinh từ kho
-- hs_dang_evals(p_mon text, p_nhanh text) — thân lấy từ bản đang chạy, chỉ thêm 1 dòng chặn ngay sau begin
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
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt', bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join khtn_ban_do bd on bd.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = v_hs and tl.mon = 'KHTN'
    ) x;
  else
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
  end if;
  return v_out;
end $function$;

-- tu_luyen_chu_de_ds_dang(p_mon text) — thân lấy từ bản đang chạy, chỉ thêm 1 dòng chặn ngay sau begin
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

  if p_mon = 'KHTN' then
    v_dk := public._kho_dk_online_hs_sql('khtn_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'ten_chuyen_de', bd.ten_chuyen_de,
        'tong_cau', c.tong_cau
      )), '[]'::jsonb)
      from khtn_ban_do bd
      join lateral (select count(*) as tong_cau from khtn_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.khoi = $1 and c.tong_cau > 0
    $q$, v_dk) into v_part using v_khoi;
    v_out := v_part;
  else
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

-- htd_lo_trinh(p_mon text) — thân lấy từ bản đang chạy, chỉ thêm 1 dòng chặn ngay sau begin
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

  if p_mon = 'KHTN' then
    v_dk := public._kho_dk_online_hs_sql('khtn_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'muc_do', bd.muc_do,
        'tong_cau', c.tong_cau
      ) order by coalesce(bd.muc_do, 3), bd.ma_dang), '[]'::jsonb)
      from khtn_ban_do bd
      join lateral (select count(*) as tong_cau from khtn_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from khtn_ban_do where ma_dang = any($1))
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_part;
  else
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

-- tu_luyen_sinh(p_mon text, p_dangs jsonb, p_nhanh text) — thân lấy từ bản đang chạy, chỉ thêm 1 dòng chặn ngay sau begin
CREATE OR REPLACE FUNCTION public.tu_luyen_sinh(p_mon text, p_dangs jsonb, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_them integer := jsonb_array_length(p_dangs);
  v_cautbl text := public._kho_cau_tbl(p_mon, p_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);   -- ⭐ ĐỔI Ở ĐÂY: dùng hàm HS-only (bỏ TLN)
  v_ftbl text := public._kho_form_tn_cua(v_cautbl);
  v_uu_tien text;
  v_thu_tu integer := 0;
  v_ma_dang text;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_ma_cau text;
  v_ok_count integer := 0;
  v_nh text;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  if v_them is null or v_them = 0 then raise exception 'Không có dạng nào để sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  v_uu_tien := case when v_ftbl is null then '' else format('(exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)) desc, ', v_ftbl) end;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for v_ma_dang in select jsonb_array_elements_text(p_dangs) loop
    v_thu_tu := v_thu_tu + 1;
    -- 29/09: client (tuluyen.ts / thu_thach_sinh) KHÔNG truyền p_nhanh mà rút dạng từ MỌI nhánh ⇒ bảng câu theo
    -- nhánh của CHÍNH dạng này (Đại/KHTN: null ⇒ bảng gốc như cũ). Trước đây dạng Hình/HGT tra dai_cau_hoi ⇒ bị bỏ qua.
    if p_nhanh is null then
      v_nh := public._kho_nhanh_cua_dang(p_mon, v_ma_dang);
      v_cautbl := public._kho_cau_tbl(p_mon, v_nh);
      v_lttbl := public._kho_lt_tbl(p_mon, v_nh);
      v_dk := public._kho_dk_online_hs_sql(v_cautbl);
      v_ftbl := public._kho_form_tn_cua(v_cautbl);
      v_uu_tien := case when v_ftbl is null then '' else format('(exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)) desc, ', v_ftbl) end;
    end if;
    select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
      from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = v_ma_dang;
    v_ma_cau := null;
    execute format($q$
      select c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null
        and %2$s
        and c.ma_cau <> all($2)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10
        )
      order by %3$s random() limit 1
    $q$, v_cautbl, v_dk, v_uu_tien)
    into v_ma_cau using v_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null
          and %2$s
          and c.ma_cau <> all($2)
        order by %3$s random() limit 1
      $q$, v_cautbl, v_dk, v_uu_tien)
      into v_ma_cau using v_ma_dang, v_used_batch;
    end if;
    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      continue;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, v_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho các dạng của em — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

-- tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text) — thân lấy từ bản đang chạy, chỉ thêm 1 dòng chặn ngay sau begin
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end); -- suy nhánh từ tiền tố mã dạng (DG/GT/KG)
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..10 loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    -- Tier 1: ưu tiên cụm CHƯA dùng trong lượt này + tránh 9 lần gần nhất của dạng.
    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1 and lan_thu > $6 - 10)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn tránh lặp gần đây.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select ma_cau from tu_luyen_dang_lan
            where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    end if;

    -- Tier 3: kho ít câu — chấp nhận lặp (CEO chốt cùng luật tự luyện tổng hợp), chỉ né trùng NGAY trong lượt này.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch;
    end if;

    -- Dạng hết sạch câu (kho cạn hẳn) → dừng lượt sớm, giữ số câu đã có (không lặp vô ích 10 lần).
    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

-- tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_chi_cau_moi boolean) — thân lấy từ bản đang chạy, chỉ thêm 1 dòng chặn ngay sau begin
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_chi_cau_moi boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end);
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_cutoff timestamptz := public._tu_luyen_dau_cua_so_truoc();
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..10 loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    -- Tier 1: ưu tiên cụm CHƯA dùng trong lượt này + tránh lặp — cửa sổ loại trừ tuỳ chế độ:
    --   p_chi_cau_moi=true  → câu KHÔNG nằm trong 2 cửa sổ gần nhất (tao_at >= v_cutoff).
    --   p_chi_cau_moi=false → như cũ, tránh 9 lần (batch) gần nhất (lan_thu > v_lan_thu-10).
    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1
            and (case when $8 then tao_at >= $7 else lan_thu > $6 - 10 end))
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn giữ cửa sổ loại trừ như Tier 1.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select ma_cau from tu_luyen_dang_lan
            where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1
              and (case when $7 then tao_at >= $6 else lan_thu > $5 - 10 end))
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;
    end if;

    -- Tier 3: kho ít câu, chấp nhận lặp — CHỈ khi KHÔNG bật "chỉ câu mới" (bật thì lặp lại
    -- đúng thứ toggle đang cố tránh — dừng lượt sớm thay vì âm thầm phá nghĩa của toggle).
    if v_ma_cau is null and not p_chi_cau_moi then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch;
    end if;

    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  if v_ok_count = 0 and p_chi_cau_moi then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác (không tạo tu_luyen_dang_lan nên xoá an toàn)
    raise exception 'Em đã luyện hết câu MỚI của dạng này trong 2 kỳ gần nhất — tắt "Chỉ câu mới" để luyện lại các câu cũ nhé.';
  end if;
  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

-- tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_loai text) — thân lấy từ bản đang chạy, chỉ thêm 1 dòng chặn ngay sau begin
CREATE OR REPLACE FUNCTION public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_loai text DEFAULT 'tu_luyen'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := coalesce(public._kho_nhanh_cua_dang(p_mon, p_ma_dang), case when p_ma_dang like 'GT%' then 'hinh_gt' end);
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  v_n integer := 10; -- so cau can sinh: 10 mac dinh (tu_luyen, htd_luyen); htd_test doi theo do kho ben duoi
  v_muc_do smallint;
  v_fallback text[];
  v_c text;
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if p_loai not in ('tu_luyen', 'htd_luyen', 'htd_test') then
    raise exception 'tu_luyen_chu_de_sinh: loai % không hợp lệ', p_loai;
  end if;
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  -- Thùy 21-22/09: số câu bài TEST "Học từ đầu" theo ĐỘ KHÓ CỦA DẠNG (không đụng tu_luyen/htd_luyen).
  if p_loai = 'htd_test' then
    v_muc_do := public._kho_muc_do_dang(p_mon, p_ma_dang);
    v_n := case when coalesce(v_muc_do, 3) >= 4 then 3 else 5 end;
  end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_loai, p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..v_n loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1 and lan_thu > $6 - 10)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select ma_cau from tu_luyen_dang_lan
            where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    end if;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch;
    end if;

    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  -- Thùy 21-22/09: dạng KHÔNG có MCQ (v_ok_count=0) + đang ở Học từ đầu → hiện đề THẬT (bất kỳ loại
  -- câu), KHÔNG chặn cứng nữa. App HS render read-only khi câu không phải trắc nghiệm; TA chấm ĐCS.
  -- Tự luyện thường (p_loai='tu_luyen') KHÔNG rơi vào đây — vẫn báo lỗi như cũ (ngoài phạm vi).
  if v_ok_count = 0 and p_loai in ('htd_luyen', 'htd_test') then
    v_fallback := public._htd_chon_cau_bat_ky(v_cautbl, p_ma_dang, '{}', v_n);
    v_thu_tu := 0;
    foreach v_c in array v_fallback loop
      v_thu_tu := v_thu_tu + 1;
      perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_c, v_thu_tu, null);
      v_ok_count := v_ok_count + 1;
    end loop;
  end if;

  if v_ok_count = 0 then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

-- tu_luyen_dien_sinh(p_mon text, p_n integer) — thân lấy từ bản đang chạy, chỉ thêm 1 dòng chặn ngay sau begin
CREATE OR REPLACE FUNCTION public.tu_luyen_dien_sinh(p_mon text DEFAULT 'Toán'::text, p_n integer DEFAULT 3)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid := public.my_hoc_sinh_id(); v_lop uuid; v_khoi text; v_bt uuid; v_thu_tu int := 0; r record;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
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

-- thu_thach_sinh(p_mon text, p_dangs jsonb) — thân lấy từ bản đang chạy, chỉ thêm 1 dòng chặn ngay sau begin
CREATE OR REPLACE FUNCTION public.thu_thach_sinh(p_mon text, p_dangs jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v jsonb;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if not exists (select 1 from rank_cau_hinh where mon = p_mon and bat) then
    raise exception 'Thử thách chưa mở cho môn %.', p_mon;
  end if;
  v := public.tu_luyen_sinh(p_mon, p_dangs);
  update bai_test set thu_thach = true where id = (v->>'bai_test_id')::uuid;
  return v;
end $function$;

