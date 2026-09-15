-- ============================================================================
-- 202609122218 — kho_duyet_dung_sai_rieng
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   CEO 12/09: "khi duyệt, Đúng-Sai là 1 LOẠI RIÊNG". Câu ĐS có N mệnh đề, mỗi
--   mệnh đề 1 dạng (bảng con <mon>_cau_menh_de, mig 202609121432). Duyệt câu ĐS
--   = duyệt TỪNG mệnh đề (dạng đúng? Đ/S đúng?) rồi mới duyệt câu cha. Hàng duyệt
--   hợp nhất (fn_kho_hang_duyet) chỉ có 1 dạng/1 đáp số/thẻ — không tả được ĐS.
--
--   Làm gì:
--   1. Bộ lọc cũ (cau_moi/moi/nghi/khong_kiem/ton_dong) LOẠI câu ĐS ra; thêm bộ
--      lọc mới 'dung_sai' (câu ĐS chưa duyệt). fn_kho_dem_hang_duyet đếm thêm
--      'dung_sai' — chỉ với nhánh CÓ bảng con (dai/hgt; khtn hold).
--   2. Trigger sync jsonb→bảng con đổi từ DELETE+INSERT sang UPSERT GIỮ da_duyet
--      khi nội dung mệnh đề không đổi (bản cũ xoá sạch ⇒ mất chữ ký duyệt mỗi khi
--      jsonb bị chạm). Có cờ phiên kho.skip_sync_menh_de để RPC ghi cả 2 bên mà
--      không bị trigger đè.
--   3. RPC mới: fn_kho_hang_duyet_ds (list câu ĐS + mệnh đề ghép jsonb↔bảng con,
--      mệnh đề thiếu bảng con = "chưa gán dạng") · fn_kho_duyet_menh_de (sửa + ký
--      1 mệnh đề, ghi cả bảng con + jsonb cha) · fn_kho_duyet_cau_ds (duyệt câu cha
--      khi MỌI mệnh đề đã duyệt; tuỳ chọn duyệt hết mệnh đề trước — cho batch).
--
-- MẤT GÌ: KHÔNG mất dữ liệu. Chỉ thay body 3 function + thêm 3 function.
--   Hành vi đổi: câu ĐS KHÔNG còn hiện ở 5 bộ lọc cũ của màn Duyệt (chuyển sang
--   tab Đúng/Sai). fn_kho_duyet_cau (RPC cũ) vẫn duyệt được câu ĐS nếu gọi thẳng.
-- ============================================================================

-- ── 1. Bộ lọc: ĐS là loại riêng ─────────────────────────────────────────────
create or replace function _kho_loc_duyet_sql(p_loc text) returns text
language sql immutable as $$
  select case p_loc
    when 'cau_moi'    then $s$c.loai_cau <> 'dung_sai' and not c.da_duyet and c.created_at >= public._kho_ngay_bat()$s$
    when 'moi'        then $s$c.loai_cau <> 'dung_sai' and not c.da_duyet and c.nguon_giai = 'ai' and c.giai_method = 'claude_code'$s$
    when 'nghi'       then $s$c.loai_cau <> 'dung_sai' and c.kiem_may = 'nghi'$s$
    when 'khong_kiem' then $s$c.loai_cau <> 'dung_sai' and c.kiem_may = 'khong_kiem_duoc'$s$
    when 'ton_dong'   then $s$c.loai_cau <> 'dung_sai' and not c.da_duyet and c.nguon_giai = 'ai' and c.giai_method is null$s$
    when 'dung_sai'   then $s$c.loai_cau = 'dung_sai' and not c.da_duyet$s$
  end
$$;

create or replace function fn_kho_dem_hang_duyet(p_nhanh text[])
returns table(loc text, khoi text, so_cau bigint)
language plpgsql stable security definer set search_path = public as $$
declare v_mon text; t text; v_loc text; v_sql text := '';
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  foreach v_mon in array p_nhanh loop
    t := public.fn_kho_tbl(v_mon);
    if t is null then continue; end if;   -- 'hinh' không có bảng câu dạng
    foreach v_loc in array array['cau_moi', 'moi', 'nghi', 'khong_kiem', 'ton_dong', 'dung_sai'] loop
      -- 'dung_sai' chỉ đếm ở nhánh có bảng con mệnh đề (dai/hgt). KHTN hold (memory doi-xung-cap-mon-vs-nhanh).
      if v_loc = 'dung_sai' and to_regclass(t || '_cau_menh_de') is null then continue; end if;
      v_sql := v_sql || case when v_sql = '' then '' else ' union all ' end
        || format($q$select %L::text loc, b.khoi, count(*) n from %I c join %I b on b.ma_dang = c.dang_chinh where c.xoa_at is null and %s group by b.khoi$q$,
                  v_loc, t || '_cau_hoi', t || '_ban_do', public._kho_loc_duyet_sql(v_loc));
    end loop;
  end loop;
  if v_sql = '' then return; end if;
  return query execute 'select d.loc, d.khoi, sum(d.n)::bigint from (' || v_sql || ') d group by grouping sets ((d.loc, d.khoi), (d.loc)) order by 1, 2 nulls first';
end $$;

-- ── 2. Trigger sync: UPSERT giữ chữ ký duyệt + cờ skip ──────────────────────
-- Cờ phiên: RPC ghi CẢ bảng con và jsonb cha trong 1 tx ⇒ set_config('kho.skip_sync_menh_de','1',true)
-- để trigger không đè lại. Ngoài RPC (code app cũ INSERT jsonb) cờ không có ⇒ sync như thường.
create or replace function _sync_cau_menh_de(
  p_bang_con text, p_ban_do text, p_ma_cau text, p_menh_de jsonb
) returns void language plpgsql as $$
declare v_n int;
begin
  if current_setting('kho.skip_sync_menh_de', true) = '1' then return; end if;
  if p_menh_de is null or jsonb_typeof(p_menh_de) <> 'array' then
    execute format('delete from %I where ma_cau_cha = $1', p_bang_con) using p_ma_cau;
    return;
  end if;
  v_n := jsonb_array_length(p_menh_de);
  -- Mệnh đề jsonb đã bỏ (thu_tu vượt độ dài) ⇒ xoá dòng con.
  execute format('delete from %I where ma_cau_cha = $1 and thu_tu > $2', p_bang_con) using p_ma_cau, v_n;
  -- UPSERT theo khoá tự nhiên (ma_cau_cha, thu_tu). Chỉ mệnh đề có ma_dang hợp lệ mới ghi;
  -- mệnh đề ma_dang không hợp lệ: dòng con cũ (nếu người đã gán dạng ở màn Duyệt) GIỮ NGUYÊN.
  -- Đổi nội dung/dạng/Đ-S ⇒ reset chữ ký duyệt (người phải xem lại); không đổi ⇒ giữ.
  execute format($f$
    insert into %1$I (ma_cau_cha, thu_tu, dang_chinh, dang_ai_de_xuat, noi_dung, dung, loi_giai)
    select $1, t.ord::int, t.elem->>'ma_dang', t.elem->>'ma_dang', t.elem->>'noi_dung',
           coalesce(t.elem->>'dap_an','S') = 'D', t.elem->>'loi_giai'
      from jsonb_array_elements($2) with ordinality as t(elem, ord)
     where t.elem->>'ma_dang' is not null and t.elem->>'noi_dung' is not null
       and (t.elem->>'ma_dang') in (select ma_dang from %2$I)
    on conflict (ma_cau_cha, thu_tu) do update set
      dang_chinh = excluded.dang_chinh,
      noi_dung   = excluded.noi_dung,
      dung       = excluded.dung,
      loi_giai   = excluded.loi_giai,
      da_duyet   = case when %1$I.dang_chinh = excluded.dang_chinh and %1$I.noi_dung = excluded.noi_dung
                             and %1$I.dung = excluded.dung then %1$I.da_duyet else false end,
      duyet_boi  = case when %1$I.dang_chinh = excluded.dang_chinh and %1$I.noi_dung = excluded.noi_dung
                             and %1$I.dung = excluded.dung then %1$I.duyet_boi else null end,
      duyet_at   = case when %1$I.dang_chinh = excluded.dang_chinh and %1$I.noi_dung = excluded.noi_dung
                             and %1$I.dung = excluded.dung then %1$I.duyet_at else null end,
      xoa_at     = null
  $f$, p_bang_con, p_ban_do)
  using p_ma_cau, p_menh_de;
end $$;

-- ── 3a. List câu ĐS chờ duyệt + mệnh đề ghép jsonb ↔ bảng con ──────────────
-- menh_de_hop: mảng theo thứ tự jsonb; mỗi phần tử = { thu_tu, noi_dung, dap_an, ma_dang (jsonb),
--   con: {id, dang_chinh, ten_dang, ten_chuyen_de, noi_dung, dung, loi_giai, da_duyet, duyet_at,
--         dang_ai_de_xuat} | null }.  con = null ⇒ mệnh đề CHƯA có dòng bảng con (ma_dang jsonb
--   không hợp lệ sau renumber) ⇒ UI hiện "chưa gán dạng", bắt người chọn dạng rồi duyệt.
create or replace function fn_kho_hang_duyet_ds(p_mon text, p_khoi text default null, p_limit integer default 300)
returns table(
  ma_cau text, dang_chinh text, ten_dang text, ten_chuyen_de text, khoi text,
  noi_dung text, loi_giai text, anh_de text, anh_dap_an text, nguon text, nguon_giai text, created_at timestamptz,
  ma_cum text, ten_cum text, da_duyet boolean, kho_chuan boolean, dang_ai_de_xuat text, ten_de_goc text,
  so_menh_de int, so_da_duyet int, so_thieu_dang int, menh_de_hop jsonb
)
language plpgsql stable security definer set search_path = public as $$
declare t text := public.fn_kho_tbl(p_mon);
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_hang_duyet_ds: môn không hợp lệ %', p_mon; end if;
  if to_regclass(t || '_cau_menh_de') is null then
    raise exception 'Nhánh % chưa hỗ trợ duyệt Đúng/Sai theo mệnh đề (chưa có bảng %_cau_menh_de)', p_mon, t;
  end if;
  return query execute format($q$
    with cau as (
      select c.*, b.ten_dang, b.ten_chuyen_de, b.khoi as b_khoi, m.ten as ten_cum_
      from %1$I c
      join %2$I b on b.ma_dang = c.dang_chinh
      left join %3$I m on m.ma_cum = c.ma_cum
      where c.xoa_at is null and c.loai_cau = 'dung_sai' and not c.da_duyet
        and ($1::text is null or b.khoi = $1)
      order by b.khoi, c.dang_chinh, c.ma_cau
      limit $2
    ),
    md as (
      select k.ma_cau_cha, k.thu_tu, k.id, k.dang_chinh, bd.ten_dang, bd.ten_chuyen_de,
             k.noi_dung, k.dung, k.loi_giai, k.da_duyet, k.duyet_at, k.dang_ai_de_xuat
      from %4$I k join %2$I bd on bd.ma_dang = k.dang_chinh
      where k.xoa_at is null and k.ma_cau_cha in (select ma_cau from cau)
    ),
    hop as (
      select c.ma_cau,
             jsonb_agg(jsonb_build_object(
               'thu_tu', e.ord, 'noi_dung', e.elem->>'noi_dung', 'dap_an', e.elem->>'dap_an',
               'ma_dang', e.elem->>'ma_dang', 'loi_giai', e.elem->>'loi_giai',
               'con', case when md.id is null then null else jsonb_build_object(
                 'id', md.id, 'dang_chinh', md.dang_chinh, 'ten_dang', md.ten_dang, 'ten_chuyen_de', md.ten_chuyen_de,
                 'noi_dung', md.noi_dung, 'dung', md.dung, 'loi_giai', md.loi_giai,
                 'da_duyet', md.da_duyet, 'duyet_at', md.duyet_at, 'dang_ai_de_xuat', md.dang_ai_de_xuat) end
             ) order by e.ord) as menh_de_hop,
             count(*)::int as so_md,
             count(*) filter (where md.da_duyet)::int as so_duyet,
             count(*) filter (where md.id is null)::int as so_thieu
      from cau c
      cross join lateral jsonb_array_elements(coalesce(c.menh_de, '[]'::jsonb)) with ordinality as e(elem, ord)
      left join md on md.ma_cau_cha = c.ma_cau and md.thu_tu = e.ord
      group by c.ma_cau
    )
    select c.ma_cau, c.dang_chinh, c.ten_dang, c.ten_chuyen_de, c.b_khoi,
           c.noi_dung, c.loi_giai, c.anh_de, c.anh_dap_an, c.nguon, c.nguon_giai, c.created_at,
           c.ma_cum, c.ten_cum_, c.da_duyet, c.kho_chuan, c.dang_ai_de_xuat, c.ten_de_goc,
           coalesce(h.so_md, 0), coalesce(h.so_duyet, 0), coalesce(h.so_thieu, 0), coalesce(h.menh_de_hop, '[]'::jsonb)
    from cau c left join hop h on h.ma_cau = c.ma_cau
    order by c.b_khoi, c.dang_chinh, c.ma_cau
  $q$, t || '_cau_hoi', t || '_ban_do', t || '_cum_bai', t || '_cau_menh_de') using p_khoi, p_limit;
end $$;
grant execute on function public.fn_kho_hang_duyet_ds(text, text, integer) to authenticated;

-- ── 3b. Duyệt 1 mệnh đề (sửa + ký) — ghi bảng con VÀ jsonb cha, 1 tx ───────
-- Khoá tự nhiên (ma_cau, thu_tu). p_sua: { dang_chinh?, noi_dung?, dung?(bool), loi_giai? } — key vắng = giữ.
-- Mệnh đề chưa có dòng con (ma_dang jsonb không hợp lệ) ⇒ BẮT BUỘC p_sua.dang_chinh hợp lệ.
create or replace function fn_kho_duyet_menh_de(p_mon text, p_ma_cau text, p_thu_tu integer, p_nguoi uuid, p_sua jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_ban_do text; v_con text;
  r record; k record; e jsonb; v_ok boolean;
  v_dang text; v_nd text; v_dung boolean; v_lg text; v_id uuid;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_menh_de: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  v_cau := t || '_cau_hoi'; v_ban_do := t || '_ban_do'; v_con := t || '_cau_menh_de';
  if to_regclass(v_con) is null then raise exception 'Nhánh % chưa hỗ trợ duyệt Đúng/Sai theo mệnh đề', p_mon; end if;

  execute format('select * from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  if r.loai_cau <> 'dung_sai' then raise exception 'Câu % không phải Đúng/Sai', p_ma_cau; end if;
  if r.menh_de is null or jsonb_typeof(r.menh_de) <> 'array' or p_thu_tu < 1 or p_thu_tu > jsonb_array_length(r.menh_de) then
    raise exception 'Câu % không có mệnh đề thứ %', p_ma_cau, p_thu_tu;
  end if;
  e := r.menh_de -> (p_thu_tu - 1);

  execute format('select * from %I where ma_cau_cha = $1 and thu_tu = $2', v_con) into k using p_ma_cau, p_thu_tu;

  v_dang := coalesce(nullif(trim(p_sua->>'dang_chinh'), ''), k.dang_chinh, e->>'ma_dang');
  if v_dang is null then raise exception 'Mệnh đề % chưa có dạng — chọn dạng trước khi duyệt', p_thu_tu; end if;
  execute format('select exists (select 1 from %I where ma_dang = $1)', v_ban_do) into v_ok using v_dang;
  if not v_ok then raise exception 'Dạng % không có trong bản đồ % — chọn dạng khác', v_dang, v_ban_do; end if;

  v_nd   := case when p_sua ? 'noi_dung' then nullif(trim(p_sua->>'noi_dung'), '') else coalesce(k.noi_dung, e->>'noi_dung') end;
  if v_nd is null then raise exception 'Nội dung mệnh đề không được trống'; end if;
  v_dung := case when p_sua ? 'dung' then (p_sua->>'dung')::boolean else coalesce(k.dung, coalesce(e->>'dap_an','S') = 'D') end;
  v_lg   := case when p_sua ? 'loi_giai' then nullif(trim(p_sua->>'loi_giai'), '') else coalesce(k.loi_giai, e->>'loi_giai') end;

  -- Ghi cả 2 bên, tắt trigger sync trong tx này.
  perform set_config('kho.skip_sync_menh_de', '1', true);
  execute format($q$
    insert into %I (ma_cau_cha, thu_tu, dang_chinh, dang_ai_de_xuat, noi_dung, dung, loi_giai,
                    da_duyet, duyet_boi, duyet_at, duyet_nguon, kiem_may, kiem_may_at, xoa_at)
    values ($1, $2, $3, $4, $5, $6, $7, true, $8, now(), 'nguoi', 'khop', now(), null)
    on conflict (ma_cau_cha, thu_tu) do update set
      dang_chinh = excluded.dang_chinh, noi_dung = excluded.noi_dung, dung = excluded.dung, loi_giai = excluded.loi_giai,
      da_duyet = true, duyet_boi = excluded.duyet_boi, duyet_at = now(), duyet_nguon = 'nguoi',
      kiem_may = 'khop', kiem_may_at = now(), xoa_at = null
    returning id$q$, v_con)
    into v_id using p_ma_cau, p_thu_tu, v_dang, coalesce(k.dang_ai_de_xuat, e->>'ma_dang'), v_nd, v_dung, v_lg, p_nguoi;

  execute format($q$update %I set menh_de = jsonb_set(menh_de, array[$2::text], $3::jsonb, false) where ma_cau = $1$q$, v_cau)
    using p_ma_cau, (p_thu_tu - 1),
          jsonb_build_object('noi_dung', v_nd, 'dap_an', case when v_dung then 'D' else 'S' end, 'ma_dang', v_dang, 'loi_giai', v_lg);

  return jsonb_build_object('id', v_id, 'thu_tu', p_thu_tu, 'dang_chinh', v_dang, 'noi_dung', v_nd, 'dung', v_dung,
                            'loi_giai', v_lg, 'da_duyet', true, 'duyet_at', now());
end $$;
grant execute on function public.fn_kho_duyet_menh_de(text, text, integer, uuid, jsonb) to authenticated;

-- ── 3c. Duyệt câu cha ĐS — chỉ khi MỌI mệnh đề đã duyệt ─────────────────────
-- p_duyet_het = true ⇒ ký tất mệnh đề theo hiện trạng trước (dùng cho "Duyệt tất cả batch");
--   mệnh đề chưa có dạng hợp lệ ⇒ RAISE, câu không được duyệt (batch bỏ qua câu này).
-- p_sua áp cho câu cha (noi_dung/dang_chinh đại diện/ma_cum/loi_giai) — giao cho fn_kho_duyet_cau.
create or replace function fn_kho_duyet_cau_ds(p_mon text, p_ma_cau text, p_nguoi uuid, p_sua jsonb default '{}'::jsonb, p_duyet_het boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_con text; r record; v_n int; v_ok int; i int; kq jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_cau_ds: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  v_cau := t || '_cau_hoi'; v_con := t || '_cau_menh_de';
  if to_regclass(v_con) is null then raise exception 'Nhánh % chưa hỗ trợ duyệt Đúng/Sai theo mệnh đề', p_mon; end if;

  execute format('select ma_cau, loai_cau, menh_de from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  if r.loai_cau <> 'dung_sai' then raise exception 'Câu % không phải Đúng/Sai', p_ma_cau; end if;
  v_n := coalesce(jsonb_array_length(r.menh_de), 0);
  if v_n < 2 then raise exception 'Câu % có % mệnh đề — câu Đúng/Sai cần ít nhất 2', p_ma_cau, v_n; end if;

  if p_duyet_het then
    for i in 1..v_n loop perform public.fn_kho_duyet_menh_de(p_mon, p_ma_cau, i, p_nguoi, '{}'::jsonb); end loop;
  end if;

  execute format('select count(*) from %I where ma_cau_cha = $1 and xoa_at is null and da_duyet', v_con) into v_ok using p_ma_cau;
  if v_ok < v_n then
    raise exception 'Còn %/% mệnh đề chưa duyệt (hoặc chưa gán dạng) — duyệt từng mệnh đề trước', v_n - v_ok, v_n;
  end if;

  kq := public.fn_kho_duyet_cau(p_mon, p_ma_cau, p_nguoi, p_sua);
  return kq || jsonb_build_object('so_menh_de', v_n);
end $$;
grant execute on function public.fn_kho_duyet_cau_ds(text, text, uuid, jsonb, boolean) to authenticated;
