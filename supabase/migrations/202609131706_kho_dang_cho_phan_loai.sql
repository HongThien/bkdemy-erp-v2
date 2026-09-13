-- ============================================================================
-- 202609131706 — kho_dang_cho_phan_loai
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 13/09): khi nhập kho từ PDF, câu KHÔNG khớp dạng nào trong bản đồ
--   bị bỏ ngoài (chỉ ghi DEVLOG) ⇒ CEO không check được ở app. Cần 1 filter
--   "Chưa phân dạng" trong màn Duyệt để người quyết dạng (AI gợi ý → người confirm, §5).
--
-- Cách: 1 DẠNG CHỜ (sentinel) mỗi khối trong mỗi bản đồ (dai/hgt/khtn):
--   ma_dang = <prefix><khoi>000000  (T312000000 · T14T000000 · K07000000)
--   ma_chu_de/ma_chuyen_de = <prefix><khoi>00 / <prefix><khoi>0000, tên "Chưa phân dạng".
--   Mã kết thúc '000000' KHÔNG bao giờ trùng dạng thật (chủ đề/chuyên đề/dạng thật ≥ 01).
--   - Câu nhập kho không có dạng ⇒ dang_chinh = dạng chờ, da_duyet=false ⇒ ngoài kho chuẩn.
--   - Bộ lọc Duyệt: thêm 'chua_dang'; 5 bộ lọc cũ LOẠI câu dạng chờ (không lẫn vào "Câu mới").
--     Câu ĐS: mệnh đề dạng chờ vẫn vào bảng con (FK hợp lệ) — UI tô vàng như "chưa gán dạng";
--     fn_kho_hang_duyet_ds đếm so_thieu_dang gồm cả dạng chờ.
--   - Trigger BEFORE INSERT/UPDATE trên <mon>_cau_hoi + <mon>_cau_menh_de: CHẶN da_duyet=true
--     khi dang_chinh là dạng chờ ⇒ không RPC nào duyệt lọt (không phải sửa từng RPC).
--   - App ẩn dạng chờ khỏi cây bản đồ / picker (api.ts: not like '%000000').
--
-- MẤT GÌ: KHÔNG mất dữ liệu. Thêm N dòng bản đồ (1/khối), thay body 3 function, thêm 1 trigger fn + 5 trigger.
-- ============================================================================

-- ── 0. Helper ────────────────────────────────────────────────────────────────
create or replace function public._kho_la_dang_cho(p_ma_dang text) returns boolean
language sql immutable as $$ select p_ma_dang is not null and right(p_ma_dang, 6) = '000000' $$;
comment on function public._kho_la_dang_cho(text) is 'true nếu ma_dang là DẠNG CHỜ "Chưa phân dạng" (kết thúc 000000). Câu/mệnh đề dạng chờ không duyệt được.';

-- p_tbl = prefix bảng ('dai'|'hgt'|'khtn') — cùng khoá với fn_kho_tbl() trả về.
create or replace function public._kho_dang_cho(p_tbl text, p_khoi text) returns text
language sql immutable as $$
  select case p_tbl when 'dai' then 'T1' when 'hgt' then 'T3' when 'khtn' then 'K' end
         || lpad(p_khoi, 2, '0') || '000000'
$$;

-- ── 1. Seed dạng chờ cho mọi khối đang có trong từng bản đồ ──────────────────
do $$
declare t text;
begin
  foreach t in array array['dai', 'hgt', 'khtn'] loop
    execute format($q$
      insert into %1$I (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
      select public._kho_dang_cho(%2$L, k.khoi), k.khoi,
             left(public._kho_dang_cho(%2$L, k.khoi), length(public._kho_dang_cho(%2$L, k.khoi)) - 4), 'Chưa phân dạng',
             left(public._kho_dang_cho(%2$L, k.khoi), length(public._kho_dang_cho(%2$L, k.khoi)) - 2), 'Chưa phân dạng',
             'Chưa phân dạng', 1, 'C',
             'DẠNG CHỜ: câu nhập kho chưa xác định được dạng. Không duyệt được cho tới khi chọn dạng thật (màn Duyệt › Chưa phân dạng).'
        from (select distinct khoi from %1$I where not public._kho_la_dang_cho(ma_dang)) k
      on conflict (ma_dang) do nothing
    $q$, t || '_ban_do', t);
  end loop;
end $$;

-- ── 2. Bộ lọc Duyệt: 'chua_dang' riêng; bộ lọc cũ loại dạng chờ ───────────────
create or replace function _kho_loc_duyet_sql(p_loc text) returns text
language sql immutable as $$
  select case p_loc
    when 'cau_moi'    then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and not c.da_duyet and c.created_at >= public._kho_ngay_bat()$s$
    when 'moi'        then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and not c.da_duyet and c.nguon_giai = 'ai' and c.giai_method = 'claude_code'$s$
    when 'nghi'       then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and c.kiem_may = 'nghi'$s$
    when 'khong_kiem' then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and c.kiem_may = 'khong_kiem_duoc'$s$
    when 'ton_dong'   then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and not c.da_duyet and c.nguon_giai = 'ai' and c.giai_method is null$s$
    when 'chua_dang'  then $s$c.loai_cau <> 'dung_sai' and public._kho_la_dang_cho(c.dang_chinh) and not c.da_duyet$s$
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
    foreach v_loc in array array['cau_moi', 'moi', 'nghi', 'khong_kiem', 'ton_dong', 'chua_dang', 'dung_sai'] loop
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

-- ── 3. Chặn duyệt khi còn dạng chờ (trigger — mọi đường ghi đều qua đây) ──────
create or replace function public._trg_chan_duyet_dang_cho() returns trigger
language plpgsql as $$
begin
  if new.da_duyet and public._kho_la_dang_cho(new.dang_chinh) then
    raise exception 'Chưa phân dạng: % đang ở dạng chờ % — chọn dạng thật trước khi duyệt', tg_table_name, new.dang_chinh
      using errcode = 'check_violation';
  end if;
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi', 'hgt_cau_hoi', 'khtn_cau_hoi', 'dai_cau_menh_de', 'hgt_cau_menh_de'] loop
    execute format('drop trigger if exists trg_chan_duyet_dang_cho on %I', t);
    execute format('create trigger trg_chan_duyet_dang_cho before insert or update of da_duyet, dang_chinh on %I for each row execute function public._trg_chan_duyet_dang_cho()', t);
  end loop;
end $$;

-- ── 4. fn_kho_hang_duyet_ds: so_thieu_dang đếm cả mệnh đề dạng chờ ───────────
-- (body copy từ mig 202609122218, chỉ đổi biểu thức so_thieu)
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
             count(*) filter (where md.id is null or public._kho_la_dang_cho(md.dang_chinh))::int as so_thieu
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
