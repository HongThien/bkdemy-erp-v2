-- ============================================================================
-- tu_luyen_chi_dang_da_hoc — CHỈ HIỆN / CHỈ LUYỆN DẠNG LỚP ĐÃ HỌC (Thùy 14/10)
-- ----------------------------------------------------------------------------
-- Thùy: "Khối 4T: sao học sinh chưa học phân số mà bài trên app lại có phân số? Chỉ được hiện những cái học sinh đã học."
-- NGUYÊN NHÂN (đo 14/10): tu_luyen_chu_de_ds_dang liệt kê MỌI dạng của khối (4T: 80 dạng) mà không hỏi lớp đã dạy tới đâu. 8 em 4T tự chọn
--   chủ đề phân số ⇒ 704 câu đo "tu_luyen"; vì cấp 1 tính đo tự luyện vào mastery nên Luyện dạng yếu / Thử thách cũng bốc phân số. 0 câu phân số đến từ ET/BTVN.
-- ĐỊNH NGHĨA "LỚP ĐÃ HỌC" (_hs_dang_da_hoc): dạng có SỐ ĐO DO LỚP DẠY (ET · MT · BTVN · đề thi · bổ trợ · retest · giáo trình — KHÔNG tự luyện, thử thách,
--   học từ đầu, bù) của ≥ 2 em cùng lớp (lớp ≤ 2 em: ≥ 1) HOẶC chính em đã có số đo lớp dạy cho dạng đó. Nhóm đo theo _do_nhom_cua_o như mastery.
--   Lớp CHƯA có số đo lớp dạy nào ⇒ không lọc (chưa biết học tới đâu — lớp mới/lớp thử).
-- ÁP DỤNG: (1) danh sách "Học theo chủ đề"  (2) tu_luyen_chu_de_sinh loại tu_luyen — server CHẶN  (3) _tu_luyen_chon_dang ⇒ Luyện dạng yếu + Thử thách.
-- KHÔNG ĐỤNG: Học từ đầu (htd_*: em chủ động học mới) và bù (bu_*: từ dạng yếu đã đo) — hai luồng này vẫn như cũ.
-- MẤT GÌ: không xoá gì. Thân 5 hàm được create or replace (chỉ THÊM đoạn lọc/chặn); thêm 2 hàm trợ giúp. Số đo cũ của em giữ nguyên (chỉ không còn được chọn).
-- ============================================================================
create or replace function public._hs_dang_da_hoc(p_hs uuid, p_mon text) returns text[]
language plpgsql stable security definer set search_path = public as $$
declare v_lop uuid; v_hs uuid[]; v_n integer; v_res text[];
begin
  v_lop := public._hs_lop_tu_luyen(p_hs, p_mon);
  if v_lop is null then return '{}'::text[]; end if;
  select coalesce(array_agg(distinct hl.hoc_sinh_id), '{}'::uuid[]) into v_hs from hoc_sinh_lop hl where hl.lop_id = v_lop and hl.trang_thai = 'dang_hoc';
  if not (p_hs = any(v_hs)) then v_hs := v_hs || p_hs; end if;
  v_n := cardinality(v_hs);
  with ev as (
    select g.hoc_sinh_id, sp.ma_cau, sp.ma_dang
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
     where g.hoc_sinh_id = any(v_hs) and sp.ma_dang is not null and sp.phase in ('et', 'mt', 'btvn')
    union all
    select bl.hoc_sinh_id, btc.ma_cau, btc.ma_dang
      from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt on bt.id = bl.bai_test_id
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
     where bl.hoc_sinh_id = any(v_hs) and blc.verdict is not null and btc.ma_dang is not null
       and bt.loai in ('et', 'btvn', 'giao_trinh', 'de_thi', 'bo_tro', 'bo_tro_test', 'retest')
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
    union all
    select tl.hoc_sinh_id, btg.ma_cau, btg.ma_dang
      from bt_grades btg join tai_lieu tl on tl.id = btg.tai_lieu_id
     where tl.hoc_sinh_id = any(v_hs) and btg.ma_dang is not null
  ), nh as (
    select distinct e.hoc_sinh_id,
           coalesce(public._do_nhom_cua_o(nullif(coalesce(e.ma_cau, ''), ''), nullif(coalesce(e.ma_dang, ''), '')), e.ma_dang) as ma_dang
      from ev e
  )
  select coalesce(array_agg(x.ma_dang), '{}'::text[]) into v_res
    from (select n.ma_dang from nh n where n.ma_dang is not null group by n.ma_dang
           having count(distinct n.hoc_sinh_id) >= least(2, v_n) or bool_or(n.hoc_sinh_id = p_hs)) x;
  return v_res;
end $$;
revoke all on function public._hs_dang_da_hoc(uuid, text) from public;
revoke execute on function public._hs_dang_da_hoc(uuid, text) from anon, authenticated;

create or replace function public._dang_da_hoc_ok(p_hs uuid, p_mon text, p_ma_dang text) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare v text[];
begin
  v := public._hs_dang_da_hoc(p_hs, p_mon);
  return cardinality(v) = 0 or p_ma_dang = any(v);
end $$;
revoke all on function public._dang_da_hoc_ok(uuid, text, text) from public;
revoke execute on function public._dang_da_hoc_ok(uuid, text, text) from anon, authenticated;

CREATE OR REPLACE FUNCTION public._tu_luyen_chon_dang(p_hs uuid, p_mon text, p_so integer DEFAULT 10)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  v_dangs text[]; v_hoc text[]; v_all text[]; v_yeu text[]; v_out jsonb := '[]'::jsonb; i int;
begin
  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  -- mọi dạng của môn (bản đồ gốc + nhánh hình) — cùng cách fn_nhiem_vu_hoan_thanh lấy danh sách dạng (§1.6)
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I union select ma_dang from %I) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt'), public._kho_ban_do_tbl(p_mon, 'hinh_hoc')) into v_dangs;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): Luyện dạng yếu + Thử thách không chọn dạng lớp chưa dạy (kể cả dạng em tự luyện trước đó).
  v_hoc := public._hs_dang_da_hoc(p_hs, p_mon);
  if cardinality(v_hoc) > 0 then v_dangs := array(select x from unnest(v_dangs) x where x = any(v_hoc)); end if;
  select array_agg(m.ma_dang order by m.score asc, m.ma_dang) into v_all
    from public.fn_mastery_cells(array[p_hs], true, null, 5, 5, 3) m
   where m.hoc_sinh_id = p_hs and m.ma_dang = any(v_dangs) and m.score is not null
     -- trần ngày dạng dễ (Thùy 09/10): dạng dễ đã đủ số câu hôm nay thì không chọn nữa
     and coalesce(public._luyen_con_cho_dang(p_hs, p_mon, m.ma_dang), 1) > 0;
  if v_all is null or cardinality(v_all) = 0 then return '[]'::jsonb; end if;   -- chưa có số đo nào ⇒ không có gì để luyện
  v_yeu := v_all[1 : greatest(1, ceil(cardinality(v_all) / 2.0)::int)];
  for i in 1..p_so loop
    v_out := v_out || to_jsonb(case when random() < 0.6 then v_yeu[1 + floor(random() * cardinality(v_yeu))::int]
                                    else v_all[1 + floor(random() * cardinality(v_all))::int] end);
  end loop;
  return v_out;
end $function$;

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
  select l.khoi into v_khoi from lop l where l.id = public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228
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

  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10, khối 4T thấy phân số khi lớp chưa dạy): lọc danh sách chủ đề theo _hs_dang_da_hoc.
  --   Lớp chưa có số đo lớp dạy nào (lớp mới/lớp thử) ⇒ không lọc (chưa biết lớp học tới đâu).
  declare v_hoc text[];
  begin
    v_hoc := public._hs_dang_da_hoc(v_hs, p_mon);
    if cardinality(v_hoc) > 0 then
      select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from jsonb_array_elements(v_out) x where x->>'ma_dang' = any(v_hoc);
    end if;
  end;

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
  v_dk text := case when p_loai in ('bu_luyen', 'bu_test') then public._kho_dk_mcq_sql(v_cautbl) else public._kho_dk_online_hs_sql(v_cautbl) end; -- Thùy 03/10: BÙ = 100% MCQ
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  v_cho integer; -- số câu CÒN được luyện dạng này hôm nay (null = không giới hạn) — luyen_gioi_han
  v_n integer := 10; -- so cau can sinh: 10 mac dinh (tu_luyen, htd_luyen); htd_test doi theo do kho ben duoi
  v_muc_do smallint;
  v_fallback text[];
  v_c text;
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  -- Thùy 10/10: bù cũng "MCQ trước, dạng 0 MCQ ⇒ trả lời ngắn có đáp án" (cùng luật _btyeu_chon_cau).
  if p_loai in ('bu_luyen', 'bu_test') then
    declare v_co_mcq boolean;
    begin
      execute format($q$select exists (select 1 from %1$I c where c.dang_chinh = $1 and c.xoa_at is null and %2$s)$q$, v_cautbl, v_dk) into v_co_mcq using p_ma_dang;
      if not v_co_mcq then v_dk := public._kho_dk_tln_sql(); end if;
    end;
  end if;
  if p_loai not in ('tu_luyen', 'htd_luyen', 'htd_test', 'bu_luyen', 'bu_test') then
    raise exception 'tu_luyen_chu_de_sinh: loai % không hợp lệ', p_loai;
  end if;
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): em không luyện được dạng lớp chưa dạy (server chặn, không chỉ ẩn ở màn)
  if p_loai = 'tu_luyen' and not public._dang_da_hoc_ok(v_hs, p_mon, p_ma_dang) then raise exception 'Dạng này lớp em chưa học tới nên chưa luyện được. Em chọn dạng khác nhé!'; end if;

  -- Thùy 21-22/09: số câu bài TEST "Học từ đầu" theo ĐỘ KHÓ CỦA DẠNG (không đụng tu_luyen/htd_luyen).
  if p_loai in ('htd_test', 'bu_test') then
    v_muc_do := public._kho_muc_do_dang(p_mon, p_ma_dang);
    v_n := case when coalesce(v_muc_do, 3) >= 4 then 3 else 5 end;
  end if;

  if p_loai = 'tu_luyen' then v_cho := public._luyen_con_cho_dang(v_hs, p_mon, p_ma_dang); end if;
  if v_cho is not null and v_cho <= 0 then raise exception 'Dạng này em đã luyện đủ % câu hôm nay rồi. Mai quay lại nhé, hoặc luyện dạng khác!', (select tran_cau_ngay from luyen_gioi_han where id = 1); end if;
  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_loai, p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..least(v_n, coalesce(v_cho, v_n)) loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select g.ma_cau from public._hs_cau_lan_gap($4) g)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select g.ma_cau from public._hs_cau_lan_gap($3) g)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    end if;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        left join public._hs_cau_lan_gap($3) g on g.ma_cau = c.ma_cau
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by g.lan_cuoi nulls first, random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs;
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

  if v_ok_count = 0 and p_loai in ('bu_luyen', 'bu_test') then
    delete from bai_test where id = v_bt_id;
    raise exception 'Dạng này chưa có câu trắc nghiệm hay trả lời ngắn trên app — em học dạng này với thầy cô trên giấy nhé.';
  end if;
  if v_ok_count = 0 then
    delete from bai_test where id = v_bt_id; -- dọn bài rỗng, không để lại rác
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

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
  v_cho integer; -- số câu CÒN được luyện dạng này hôm nay (null = không giới hạn) — luyen_gioi_han
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): em không luyện được dạng lớp chưa dạy (server chặn, không chỉ ẩn ở màn)
  if not public._dang_da_hoc_ok(v_hs, p_mon, p_ma_dang) then raise exception 'Dạng này lớp em chưa học tới nên chưa luyện được. Em chọn dạng khác nhé!'; end if;

  v_cho := public._luyen_con_cho_dang(v_hs, p_mon, p_ma_dang);
  if v_cho is not null and v_cho <= 0 then raise exception 'Dạng này em đã luyện đủ % câu hôm nay rồi. Mai quay lại nhé, hoặc luyện dạng khác!', (select tran_cau_ngay from luyen_gioi_han where id = 1); end if;
  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..least(10, coalesce(v_cho, 10)) loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    -- Tier 1: ưu tiên cụm CHƯA dùng trong lượt này + câu em CHƯA GẶP ở bất kỳ bài nào (01/10, spec-v1-app-hs §2).
    -- Tier 2: bỏ ràng buộc cụm, vẫn chỉ câu chưa gặp. Tier 3 (chỉ khi tắt "Chỉ câu mới"): câu gặp LÂU NHẤT trước.
    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select g.ma_cau from public._hs_cau_lan_gap($4) g)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;

    -- Tier 2: hết cụm mới (đã rải hết) — bỏ ràng buộc cụm, vẫn giữ cửa sổ loại trừ như Tier 1.
    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select g.ma_cau from public._hs_cau_lan_gap($3) g)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu, v_cutoff, p_chi_cau_moi;
    end if;

    -- Tier 3: kho ít câu, chấp nhận lặp — CHỈ khi KHÔNG bật "chỉ câu mới" (bật thì lặp lại
    -- đúng thứ toggle đang cố tránh — dừng lượt sớm thay vì âm thầm phá nghĩa của toggle).
    if v_ma_cau is null and not p_chi_cau_moi then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        left join public._hs_cau_lan_gap($3) g on g.ma_cau = c.ma_cau
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by g.lan_cuoi nulls first, random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs;
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
    raise exception 'Em đã làm hết câu MỚI của dạng này — tắt "Chỉ câu mới" để luyện lại các câu cũ nhé.';
  end if;
  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $function$;

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
  v_cho integer; -- số câu CÒN được luyện dạng này hôm nay (null = không giới hạn) — luyen_gioi_han
  i integer;
begin
  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  v_lop := public._hs_lop_tu_luyen(v_hs, p_mon); -- mig 202610030228: lớp đang học của môn, hoặc lớp chung của môn mở cả khối (TSA khối 12)
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): em không luyện được dạng lớp chưa dạy (server chặn, không chỉ ẩn ở màn)
  if not public._dang_da_hoc_ok(v_hs, p_mon, p_ma_dang) then raise exception 'Dạng này lớp em chưa học tới nên chưa luyện được. Em chọn dạng khác nhé!'; end if;

  v_cho := public._luyen_con_cho_dang(v_hs, p_mon, p_ma_dang);
  if v_cho is not null and v_cho <= 0 then raise exception 'Dạng này em đã luyện đủ % câu hôm nay rồi. Mai quay lại nhé, hoặc luyện dạng khác!', (select tran_cau_ngay from luyen_gioi_han where id = 1); end if;
  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..least(10, coalesce(v_cho, 10)) loop
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
