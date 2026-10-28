-- ============================================================================
-- 202610261822 — dtv_thap_dau_truong_ban_do_moi   (áp: `node scripts/migrate.mjs --only 202610261822_dtv_thap_dau_truong_ban_do_moi.sql`)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 26/10 "Tháp với đấu trường cũng chuyển đi" — game Đấu trường / Chinh phục BK (tháp) / trận bot / Giải của Toán K6–12
--   đang chọn chủ đề + câu theo BẢN ĐỒ CŨ (dai_ban_do.ma_chu_de T1…, câu dai_cau_hoi) trong khi mastery / phiêu lưu đã sang BẢN ĐỒ MỚI.
--   Nay: khối nào mà registry `_kho_ds_nhanh_khoi(mon, khoi)` có nhánh 'bdm' (Toán K6–12 khi công tắc `mastery_ban_do_moi` bật) ⇒
--     · chủ đề = chủ đề bản đồ mới (NCD…, tên + thứ tự `thu_tu_chu_de`, nhánh Đại → HGT như bản đồ mới) + "Hình học" (HINH_HOC) như phiêu lưu
--       — danh sách dạng lấy qua `_kho_ban_do_dong` (CÙNG registry phiêu lưu dùng), không gõ tên bảng;
--     · câu = MCQ đạt chuẩn `_kho_dk_mcq_sql(cautbl)` của các dạng bài trong chủ đề (Đại/HGT qua view `bdm_cau_hoi`, Hình qua `hinh_hoc_cau_hoi`),
--       giữ luật "chỉ dạng lớp đã học" `_hs_dang_da_hoc` (giờ trả mã NDB), số câu tối thiểu như cũ (khối ≥30 · chủ đề ≥8 · tháp ≥5 · trận ≥3).
--   Cấp 1 (3/4/4T/5/5T), KHTN, Tiếng Anh, và Toán khi công tắc TẮT ⇒ chạy NGUYÊN đường cũ (thân cũ giữ nguyên trong nhánh else).
--   Chấm / phát câu (`fn_dtv_cham`, `fn_dtv_cham_tran`, `fn_dtv_de_lay`) dò câu theo nhánh của KHỐI đề (`_dtv_kho_cau_tim`), rồi lùi về
--   các nhánh cũ ⇒ đề sinh trước khi chuyển (mã câu dai_cau_hoi) vẫn chấm được.
--   Bảng xếp hạng tháp chủ đề khoá bằng `nhom = khoi|chu_de` ⇒ chủ đề NCD tự thành bảng MỚI; dòng cũ (`7|T10701`, 1 lượt) giữ nguyên,
--   vẫn đọc được bằng fn_dtv_thap_bxh_mon(p_nhom = mã cũ). Tháp tổng (`nhom = khoi`) không đổi khoá ⇒ lịch sử liền mạch.
-- Hiệu năng: view bdm_cau_hoi quét 1 LƯỢT cho cả tập dạng (lọc từng dạng = 14 s); CTE gọi hàm đắt để `materialized`.
-- MẤT GÌ: không xoá / drop / thu hẹp gì. Thêm 3 hàm nội bộ (_dtv_ban_do_moi, _dtv_kho_dang_moi, _dtv_kho_cau_moi, _dtv_kho_cau_tim);
--   thay thân 7 hàm (create or replace giữ nguyên chữ ký + quyền).
-- ============================================================================

-- Khối này của môn chạy game theo bản đồ mới? (đọc REGISTRY nhánh — không `if mon = 'Toán'`)
create or replace function public._dtv_ban_do_moi(p_mon text, p_khoi text)
returns boolean language sql stable set search_path to 'public' as $f$
  select 'bdm' = any(public._kho_ds_nhanh_khoi(p_mon, p_khoi))
$f$;

-- Dạng của các khối (chỉ khối chạy bản đồ mới) + thứ tự chủ đề: nhánh (theo registry) → thu_tu_chu_de bản đồ mới → mã.
create or replace function public._dtv_kho_dang_moi(p_mon text, p_khois text[])
returns table(khoi text, nhanh text, cautbl text, ma_dang text, ten_dang text, muc_do smallint, ma_chu_de text, ten_chu_de text, stt_cd integer)
language plpgsql stable set search_path to 'public' as $f$
#variable_conflict use_column
declare v_k text; v_nh text[];
begin
  foreach v_k in array coalesce(p_khois, '{}'::text[]) loop
    continue when not public._dtv_ban_do_moi(p_mon, v_k);
    v_nh := public._kho_ds_nhanh_khoi(p_mon, v_k);
    return query
      with d as materialized (select * from public._kho_ban_do_dong(p_mon, v_k)),
      x as (select d.ma_chu_de, min(array_position(v_nh, d.nhanh)) nh, min(b.thu_tu_chu_de) tcd
              from d left join bdm_ban_do b on d.nhanh = 'bdm' and b.ma_dang = d.ma_dang group by d.ma_chu_de)
      select v_k, d.nhanh, d.cautbl, d.ma_dang, d.ten_dang, d.muc_do, d.ma_chu_de, d.ten_chu_de,
             (dense_rank() over (order by x.nh, x.tcd nulls last, d.ma_chu_de))::int
        from d join x on x.ma_chu_de = d.ma_chu_de;
  end loop;
end $f$;

-- Câu MCQ đạt chuẩn của các dạng trên (lọc chủ đề + dạng lớp đã học). 1 lượt quét / bảng câu.
--   p_noi_dung = true ⇒ kèm đề/ảnh/lời giải/4 đáp án/đáp án đúng (form_tn đã duyệt ưu tiên) và CHỈ giữ câu đủ 4 đáp án hợp lệ (như c2 bản cũ);
--   false ⇒ chỉ mã (để đếm), cột nội dung không áp dụng.
create or replace function public._dtv_kho_cau_moi(p_mon text, p_khois text[], p_chu_de text, p_hoc text[], p_noi_dung boolean)
returns table(cautbl text, ma_cau text, ma_dang text, de text, anh text, giai text, opts jsonb, dung integer)
language plpgsql stable set search_path to 'public' as $f$
declare r record; v_form text;
begin
  for r in
    select d.cautbl, array_agg(distinct d.ma_dang) dangs
      from public._dtv_kho_dang_moi(p_mon, p_khois) d
     where (p_chu_de is null or d.ma_chu_de = p_chu_de) and (p_hoc is null or d.ma_dang = any(p_hoc))
     group by d.cautbl
  loop
    if not coalesce(p_noi_dung, false) then
      return query execute format($q$
        select %1$L::text, c.ma_cau::text, c.dang_chinh::text, null::text, null::text, null::text, null::jsonb, null::integer
          from %1$I c where c.xoa_at is null and c.dang_chinh = any($1) and %2$s
      $q$, r.cautbl, public._kho_dk_mcq_sql(r.cautbl)) using r.dangs;
    else
      v_form := public._kho_form_tn_cua(r.cautbl);
      return query execute format($q$
        with c0 as materialized (
          select c.ma_cau, c.dang_chinh, c.noi_dung, c.anh_de, c.loi_giai, c.lua_chon, c.dap_an, %3$s as form_lc
            from %1$I c where c.xoa_at is null and c.dang_chinh = any($1) and %2$s
        ), c1 as (
          select c0.*,
            case when form_lc is not null then (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(form_lc) with ordinality t(e, o))
                 else lua_chon end as o4,
            case when form_lc is not null then (select (o - 1)::int from jsonb_array_elements(form_lc) with ordinality t(e, o) where (e->>'dung')::boolean limit 1)
                 else ascii(upper(trim(dap_an))) - 65 end as d4
          from c0
        )
        select %1$L::text, ma_cau::text, dang_chinh::text, noi_dung::text, anh_de::text, loi_giai::text, o4::jsonb, d4::integer
          from c1 where jsonb_typeof(o4) = 'array' and jsonb_array_length(o4) = 4 and d4 between 0 and 3
      $q$, r.cautbl, public._kho_dk_mcq_sql(r.cautbl),
        case when v_form is null then 'null::jsonb'
             else format('(select f.lua_chon from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null limit 1)', v_form) end)
      using r.dangs;
    end if;
  end loop;
end $f$;

-- Tìm 1 câu (để phát / chấm): dò theo nhánh của KHỐI đề rồi lùi về các nhánh cũ của môn (đề sinh trước khi chuyển bản đồ vẫn chấm được).
--   Bản cũ `_dtv_kho_cau_mot` chỉ nhìn dai_cau_hoi ⇒ câu HGT / Hình của đề bản đồ mới sẽ báo "Câu không còn trong kho".
create or replace function public._dtv_kho_cau_tim(p_mon text, p_khoi text, p_ma_cau text)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $f$
declare v_nh text; v_cau text; v_bd text; v_form text; v_kq jsonb; v_da text[] := '{}'::text[];
begin
  if not public._kho_co_mon(p_mon) then return null; end if;
  foreach v_nh in array public._kho_ds_nhanh_khoi(p_mon, coalesce(p_khoi, '')) || public._kho_ds_nhanh(p_mon) loop
    v_cau := public._kho_cau_tbl(p_mon, v_nh);
    continue when v_cau = any(v_da);
    v_da := v_da || v_cau;
    v_bd := public._kho_ban_do_tbl(p_mon, v_nh); v_form := public._kho_form_tn_cua(v_cau);
    execute format($q$
      with c0 as (
        select c.ma_cau, c.noi_dung, c.anh_de, c.loi_giai, c.lua_chon, c.dap_an, %4$s as ten_dang, b.muc_do, %3$s as form_lc
        from %1$I c join %2$I b on b.%5$I = c.dang_chinh
        where c.ma_cau = $1 and c.xoa_at is null
        limit 1
      )
      select jsonb_build_object('ma_cau', ma_cau, 'de', noi_dung, 'anh', anh_de, 'giai', loi_giai, 'dang', ten_dang, 'muc', muc_do,
        'opts', case when form_lc is not null then (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(form_lc) with ordinality t(e, o)) else lua_chon end,
        'dung', case when form_lc is not null then (select (o - 1)::int from jsonb_array_elements(form_lc) with ordinality t(e, o) where (e->>'dung')::boolean limit 1)
                     else ascii(upper(trim(dap_an))) - 65 end)
      from c0$q$, v_cau, v_bd,
      case when v_form is null then 'null::jsonb'
           else format('(select f.lua_chon from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null limit 1)', v_form) end,
      -- Hình học (hinh_hoc_bai): khoá = ma_bai, tên = ten_dang hoặc ten_bai — cùng quy ước `_kho_ban_do_dong`
      case when v_bd = 'hinh_hoc_bai' then $e$coalesce(nullif(btrim(b.ten_dang), ''), b.ten_bai)$e$ else 'b.ten_dang' end,
      case when v_bd = 'hinh_hoc_bai' then 'ma_bai' else 'ma_dang' end)
      using p_ma_cau into v_kq;
    if v_kq is not null then return v_kq; end if;
  end loop;
  return null;
end $f$;

revoke execute on function public._dtv_ban_do_moi(text, text) from public, anon, authenticated;
revoke execute on function public._dtv_kho_dang_moi(text, text[]) from public, anon, authenticated;
revoke execute on function public._dtv_kho_cau_moi(text, text[], text, text[], boolean) from public, anon, authenticated;
revoke execute on function public._dtv_kho_cau_tim(text, text, text) from public, anon, authenticated;

-- bản 2 tham số giữ chữ ký (không còn ai gọi trong fn_dtv_*), dò như cũ + các nhánh khác của môn
create or replace function public._dtv_kho_cau_mot(p_mon text, p_ma_cau text)
returns jsonb language sql stable security definer set search_path to 'public' as $f$
  select public._dtv_kho_cau_tim(p_mon, null, p_ma_cau)
$f$;

-- ── KHỐI ────────────────────────────────────────────────────────────────────
create or replace function public.fn_dtv_kho_khoi(p_mon text)
 returns jsonb language plpgsql stable security definer set search_path to 'public' as $function$
declare v_cau text := _kho_cau_tbl(p_mon); v_bd text := _kho_ban_do_tbl(p_mon); v_kq jsonb; v_moi text[]; v_kq_moi jsonb;
begin
  if not _kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  -- khối chạy bản đồ mới (registry) — tập khối ứng viên lấy từ bản đồ gốc của môn
  execute format('select coalesce(array_agg(distinct b.khoi), ''{}''::text[]) from %I b where b.khoi is not null', v_bd) into v_moi;
  v_moi := array(select k from unnest(v_moi) k where public._dtv_ban_do_moi(p_mon, k));
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object('khoi', khoi, 'so_cau', n)), '[]'::jsonb)
    from (select b.khoi, count(*) n from %1$I c join %2$I b on b.ma_dang = c.dang_chinh
          where c.xoa_at is null and %3$s and not (b.khoi = any($1)) group by b.khoi having count(*) >= 30) t$q$, v_cau, v_bd, _kho_dk_mcq_sql(v_cau))
    using v_moi into v_kq;
  if cardinality(v_moi) > 0 then
    select coalesce(jsonb_agg(jsonb_build_object('khoi', khoi, 'so_cau', n)), '[]'::jsonb) into v_kq_moi
      from (select d.khoi, count(*) n
              from (select * from public._dtv_kho_cau_moi(p_mon, v_moi, null, null, false)) c
              join (select * from public._dtv_kho_dang_moi(p_mon, v_moi)) d on d.cautbl = c.cautbl and d.ma_dang = c.ma_dang
             group by d.khoi having count(*) >= 30) t;
    v_kq := v_kq || v_kq_moi;
  end if;
  return (select coalesce(jsonb_agg(e order by nullif(regexp_replace(e->>'khoi', '\D', '', 'g'), '')::int, e->>'khoi'), '[]'::jsonb) from jsonb_array_elements(v_kq) e);
end $function$;

-- ── CHỦ ĐỀ ──────────────────────────────────────────────────────────────────
create or replace function public.fn_dtv_kho_chu_de(p_mon text, p_khoi text)
 returns jsonb language plpgsql stable security definer set search_path to 'public' as $function$
declare v_cau text := _kho_cau_tbl(p_mon); v_bd text := _kho_ban_do_tbl(p_mon); v_kq jsonb;
  v_hs uuid := public.my_hoc_sinh_id(); v_hoc text[];
begin
  if not _kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): học sinh đăng nhập chỉ thấy chủ đề đủ câu TRONG PHẦN LỚP ĐÃ HỌC (khách/anon: như cũ)
  v_hoc := case when v_hs is null then null else nullif(public._hs_dang_da_hoc(v_hs, p_mon), '{}'::text[]) end;
  if public._dtv_ban_do_moi(p_mon, p_khoi) then
    -- BẢN ĐỒ MỚI (Thùy 26/10): chủ đề NCD… + Hình học, thứ tự như bản đồ mới
    return (
      with d as materialized (select * from public._dtv_kho_dang_moi(p_mon, array[p_khoi])),
      c as materialized (select * from public._dtv_kho_cau_moi(p_mon, array[p_khoi], null, v_hoc, false))
      select coalesce(jsonb_agg(jsonb_build_object('ma', ma_chu_de, 'ten', ten_chu_de, 'so_cau', n) order by stt, ma_chu_de), '[]'::jsonb)
      from (select d.ma_chu_de, min(d.ten_chu_de) ten_chu_de, min(d.stt_cd) stt, count(*) n
              from c join d on d.cautbl = c.cautbl and d.ma_dang = c.ma_dang
             group by d.ma_chu_de having count(*) >= 8) t);
  end if;
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object('ma', ma_chu_de, 'ten', ten_chu_de, 'so_cau', n) order by ma_chu_de), '[]'::jsonb)
    from (select b.ma_chu_de, min(b.ten_chu_de) ten_chu_de, count(*) n from %1$I c join %2$I b on b.ma_dang = c.dang_chinh
          where c.xoa_at is null and b.khoi = $1 and ($2::text[] is null or c.dang_chinh = any($2)) and %3$s group by b.ma_chu_de having count(*) >= 8) t$q$, v_cau, v_bd, _kho_dk_mcq_sql(v_cau))
    using p_khoi, v_hoc into v_kq;
  return v_kq;
end $function$;

-- ── BỘ CÂU (tháp / trận bot / trận người) ──────────────────────────────────
create or replace function public.fn_dtv_kho_bo_cau(p_mon text, p_khoi text, p_chu_de text, p_so integer, p_seed text, p_tang_dan boolean DEFAULT false)
 returns jsonb language plpgsql stable security definer set search_path to 'public' as $function$
declare
  v_cau text := _kho_cau_tbl(p_mon); v_bd text := _kho_ban_do_tbl(p_mon); v_form text := _kho_form_tn_cua(_kho_cau_tbl(p_mon));
  v_so integer := least(greatest(coalesce(p_so, 15), 1), 200); v_kq jsonb;
  v_hs uuid := public.my_hoc_sinh_id(); v_hoc text[];
begin
  if not _kho_co_mon(p_mon) then return '[]'::jsonb; end if;
  -- CHỈ DẠNG LỚP ĐÃ HỌC (Thùy 14/10): đề tháp / trận bot của học sinh chỉ bốc câu thuộc phần lớp đã học (khách/anon: như cũ)
  v_hoc := case when v_hs is null then null else nullif(public._hs_dang_da_hoc(v_hs, p_mon), '{}'::text[]) end;
  if public._dtv_ban_do_moi(p_mon, p_khoi) then
    -- BẢN ĐỒ MỚI (Thùy 26/10): câu MCQ của dạng bài trong chủ đề (Đại/HGT qua bdm_cau_hoi, Hình học) — cùng luật trộn / khó dần như bản cũ
    return (
      with d as materialized (select * from public._dtv_kho_dang_moi(p_mon, array[p_khoi])),
      c1 as materialized (select * from public._dtv_kho_cau_moi(p_mon, array[p_khoi], p_chu_de, v_hoc, true)),
      c2 as (
        select c1.*, d.ten_dang, d.muc_do, row_number() over (partition by coalesce(d.muc_do, 3) order by md5(c1.ma_cau || coalesce(p_seed, ''))) r
        from c1 join d on d.cautbl = c1.cautbl and d.ma_dang = c1.ma_dang
      ), t as (
        select c2.*, row_number() over (order by case when coalesce(p_tang_dan, false) then coalesce(muc_do, 3) + (r - 1) / 25.0 end, md5(ma_cau || coalesce(p_seed, ''))) rn
        from c2
      )
      select coalesce(jsonb_agg(jsonb_build_object('ma_cau', ma_cau, 'de', de, 'anh', anh, 'giai', giai, 'dang', ten_dang,
                                                   'muc', muc_do, 'opts', opts, 'dung', dung) order by rn), '[]'::jsonb)
      from t where rn <= v_so);
  end if;
  execute format($q$
    with c0 as (
      select c.ma_cau, c.noi_dung, c.anh_de, c.loi_giai, c.lua_chon, c.dap_an, b.ten_dang, b.muc_do,
             %4$s as form_lc
      from %1$I c join %2$I b on b.ma_dang = c.dang_chinh
      where c.xoa_at is null and b.khoi = $1 and ($2::text is null or b.ma_chu_de = $2) and ($6::text[] is null or c.dang_chinh = any($6)) and %3$s
    ), c1 as (
      select ma_cau, noi_dung, anh_de, loi_giai, ten_dang, muc_do,
        case when form_lc is not null then (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(form_lc) with ordinality t(e, o))
             else lua_chon end as opts,
        case when form_lc is not null then (select (o - 1)::int from jsonb_array_elements(form_lc) with ordinality t(e, o) where (e->>'dung')::boolean limit 1)
             else ascii(upper(trim(dap_an))) - 65 end as dung
      from c0
    )
    -- tháp khó dần TỪ TỪ: khoá = mức độ + (thứ tự trong mức)/25 ⇒ cứ ~25 tầng độ khó trung bình lên 1 bậc, vẫn trộn các mức
    , c2 as (
      select c1.*, row_number() over (partition by coalesce(muc_do, 3) order by md5(ma_cau || $3)) r
      from c1 where jsonb_typeof(opts) = 'array' and jsonb_array_length(opts) = 4 and dung between 0 and 3
    )
    select coalesce(jsonb_agg(jsonb_build_object('ma_cau', ma_cau, 'de', noi_dung, 'anh', anh_de, 'giai', loi_giai, 'dang', ten_dang,
                                                 'muc', muc_do, 'opts', opts, 'dung', dung) order by rn), '[]'::jsonb)
    from (
      select c2.*, row_number() over (order by case when $5 then coalesce(muc_do, 3) + (r - 1) / 25.0 end, md5(ma_cau || $3)) rn
      from c2
      order by case when $5 then coalesce(muc_do, 3) + (r - 1) / 25.0 end, md5(ma_cau || $3)
      limit $4
    ) t$q$,
    v_cau, v_bd, _kho_dk_mcq_sql(v_cau),
    case when v_form is null then 'null::jsonb'
         else format('(select f.lua_chon from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null limit 1)', v_form) end)
    using p_khoi, p_chu_de, coalesce(p_seed, ''), v_so, coalesce(p_tang_dan, false), v_hoc
    into v_kq;
  return v_kq;
end $function$;

-- ── PHÁT / CHẤM: dò câu theo nhánh của khối đề (thân cũ, chỉ đổi lời gọi _dtv_kho_cau_mot → _dtv_kho_cau_tim(d.mon, d.khoi, …)) ──
CREATE OR REPLACE FUNCTION public.fn_dtv_cham(p_uid text, p_de_id uuid, p_thu_tu integer, p_chon integer, p_ms integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  d dtv_de; k jsonb; v_now timestamptz := clock_timestamp(); v_truoc timestamptz; v_troi_ms numeric; v_ms integer; v_dung boolean; v_dung_idx integer;
  v_han_ms numeric; v_opts jsonb; v_het_gio boolean := false; v_chon integer := coalesce(p_chon, -1);
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid for update;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  perform public._dtv_kiem_de_thap(d.che_do);
  if d.ket_thuc_at is not null or d.chet then raise exception 'Lượt này đã kết thúc'; end if;
  if d.bat_dau_at is null then raise exception 'Lượt chưa bắt đầu'; end if;
  if p_thu_tu <> d.so_tra_loi + 1 or p_thu_tu > d.so_cau then raise exception 'Sai thứ tự câu'; end if;
  v_truoc := coalesce(d.cau_cuoi_at, d.bat_dau_at);
  v_troi_ms := extract(epoch from (v_now - v_truoc)) * 1000;

  -- hạn: Sinh tồn = 5 phút gốc − giây phạt (+ 6 giây trễ mạng) · Vô tận = giờ của câu hiện tại (+ 2,5 giây trễ mạng)
  if d.che_do = 'song_con' then
    if extract(epoch from (v_now - d.bat_dau_at)) * 1000 > 300000 - d.phat_ms + 6000 then return jsonb_build_object('het_gio', true); end if;
  else
    v_han_ms := public._dtv_giay_vo_tan(d.so_dung, d.giay_goc) * 1000 + 2500;
    if v_troi_ms > v_han_ms then v_het_gio := true; v_chon := -1; end if;
  end if;

  k := public._dtv_kho_cau_tim(d.mon, d.khoi, d.ma_cau[p_thu_tu]);
  if k is null then raise exception 'Câu không còn trong kho'; end if;
  v_dung_idx := (k->>'dung')::int;
  v_dung := (not v_het_gio) and v_chon = v_dung_idx;
  v_opts := k->'opts';
  v_ms := least(greatest(coalesce(p_ms, 0), 150), greatest(v_troi_ms, 150))::int;   -- thời gian game khai bị kẹp theo thời gian máy chủ thấy

  insert into dtv_cau_log (uid, de_id, mon, che_do, chu_de, thu_tu, ma_cau, cau_id, de, dap_an, tra_loi, dung, ms, nguon_cham)
  values (p_uid, p_de_id, d.mon, d.che_do, d.nhom, p_thu_tu, k->>'ma_cau', k->>'ma_cau', left(k->>'de', 500), left(v_opts->>v_dung_idx, 300),
          case when v_chon between 0 and 3 then left(coalesce(v_opts->>v_chon, ''), 300) else '' end, v_dung, v_ms, 'server');

  update dtv_de set so_tra_loi = so_tra_loi + 1, so_dung = so_dung + case when v_dung then 1 else 0 end, so_sai = so_sai + case when v_dung then 0 else 1 end,
         phat_ms = phat_ms + case when d.che_do = 'song_con' and not v_dung then 3000 else 0 end,
         chet = (d.che_do = 'vo_tan' and not v_dung), cau_cuoi_at = v_now
   where id = p_de_id;
  return jsonb_build_object('dung', v_dung, 'dung_idx', v_dung_idx, 'giai', k->'giai', 'het_gio', v_het_gio,
                            'so_dung', d.so_dung + case when v_dung then 1 else 0 end, 'so_sai', d.so_sai + case when v_dung then 0 else 1 end);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_dtv_cham_tran(p_uid text, p_de_id uuid, p_thu_tu integer, p_chon integer, p_ms integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  d dtv_de; k jsonb; v_now timestamptz := clock_timestamp(); v_troi_ms numeric; v_ms integer; v_dung boolean; v_idx integer; v_chon integer := coalesce(p_chon, -1); v_opts jsonb;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid for update;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  if d.che_do <> 'bot' then raise exception 'Đề này không phải trận đấu'; end if;
  if d.ket_thuc_at is not null then raise exception 'Trận đã kết thúc'; end if;
  if p_thu_tu <> d.so_tra_loi + 1 or p_thu_tu > d.so_cau then raise exception 'Sai thứ tự câu'; end if;
  v_troi_ms := extract(epoch from (v_now - coalesce(d.cau_cuoi_at, d.bat_dau_at))) * 1000;
  if v_chon not between 0 and 3 then
    v_chon := -1;
    if v_troi_ms < 2000 then raise exception 'Chưa hết lượt câu này'; end if;     -- chặn "bỏ qua liên tục để xem đáp án"
  end if;
  k := public._dtv_kho_cau_tim(d.mon, d.khoi, d.ma_cau[p_thu_tu]);
  if k is null then raise exception 'Câu không còn trong kho'; end if;
  v_idx := (k->>'dung')::int; v_opts := k->'opts';
  v_dung := v_chon = v_idx;
  v_ms := least(greatest(coalesce(p_ms, 0), 150), greatest(v_troi_ms, 150))::int;
  insert into dtv_cau_log (uid, de_id, mon, che_do, chu_de, thu_tu, ma_cau, cau_id, de, dap_an, tra_loi, dung, ms, nguon_cham)
  values (p_uid, p_de_id, d.mon, 'bot', coalesce(d.chu_de, 'tron'), p_thu_tu, k->>'ma_cau', k->>'ma_cau', left(k->>'de', 500), left(v_opts->>v_idx, 300),
          case when v_chon >= 0 then left(coalesce(v_opts->>v_chon, ''), 300) else '' end, v_dung, v_ms, 'server');
  update dtv_de set so_tra_loi = so_tra_loi + 1, so_dung = so_dung + case when v_dung then 1 else 0 end, so_sai = so_sai + case when v_dung then 0 else 1 end, cau_cuoi_at = v_now where id = p_de_id;
  return jsonb_build_object('dung', v_dung, 'dung_idx', v_idx, 'giai', k->'giai');
end $function$;

CREATE OR REPLACE FUNCTION public.fn_dtv_de_lay(p_uid text, p_de_id uuid, p_tu integer, p_so integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare d dtv_de; v_kq jsonb := '[]'::jsonb; k integer; c jsonb; v_den integer;
begin
  perform public._dtv_kiem_uid(p_uid);
  select * into d from dtv_de where id = p_de_id and uid = p_uid;
  if not found then raise exception 'Đề không thuộc về em'; end if;
  v_den := least(d.so_cau, p_tu + least(greatest(coalesce(p_so, 20), 1), 40) - 1, d.so_tra_loi + 40);
  for k in greatest(p_tu, 1) .. v_den loop
    c := public._dtv_kho_cau_tim(d.mon, d.khoi, d.ma_cau[k]);
    if c is null then continue; end if;
    v_kq := v_kq || jsonb_build_array(jsonb_build_object('thu_tu', k, 'ma_cau', c->>'ma_cau', 'de', c->'de', 'anh', c->'anh', 'dang', c->'dang', 'muc', c->'muc', 'opts', c->'opts'));
  end loop;
  return v_kq;
end $function$;

