-- ============================================================================
-- 202610241206 — hs_so_tay_theo_ban_do_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 24/10 "chuyển hiển thị app học sinh theo bản đồ mới" (công tắc mastery đã bật). Sổ tay lý thuyết HS vẫn đọc bản đồ cũ.
--   Bản đồ mới phủ lý thuyết tốt hơn hẳn ở K6–11 (vd K6: 164/165 dạng bài có LT, bản đồ cũ 34/49). Em K6–12 (khi khối có nhánh
--   'bdm' theo công tắc — _kho_ds_nhanh_khoi) ⇒ tab Đại = dạng bài nhánh 'toan', tab Hình GT = dạng bài nhánh 'hgt' của bản đồ mới
--   (2 view lọc bdm_ban_do); mở 1 dạng NDB: client truyền nhánh 'bdm' cho hs_sotay_dang
--   (hàm đó thuộc owner postgres — tạo qua SQL Editor — role migrate không thay được; registry _kho_ban_do_tbl(mon,'bdm') đã hiểu). Cấp 1, Hình học, môn khác: như cũ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm 2 view + 1 hàm, thay thân 2 hàm sổ tay (cây, tìm) (công tắc tắt: y hệt).
-- ============================================================================
create or replace view bdm_ban_do_toan as select * from bdm_ban_do where nhanh_bdm = 'toan';
create or replace view bdm_ban_do_hgt as select * from bdm_ban_do where nhanh_bdm = 'hgt';
grant select on bdm_ban_do_toan, bdm_ban_do_hgt to authenticated;

-- Bảng sổ tay cho (môn, nhánh sổ tay, khối em): khối có nhánh 'bdm' (công tắc bật, K6–12) ⇒ bản đồ mới tách theo nhánh
create or replace function _sotay_bang(p_mon text, p_nhanh text, p_khoi_hs text, out bd text, out lt text)
language sql stable as $$
  select case when p_khoi_hs is not null and 'bdm' = any(public._kho_ds_nhanh_khoi(p_mon, p_khoi_hs)) and coalesce(p_nhanh, '') in ('', 'hinh_gt')
              then case when p_nhanh is null then 'bdm_ban_do_toan' else 'bdm_ban_do_hgt' end
              else public._kho_ban_do_tbl(p_mon, p_nhanh) end,
         case when p_khoi_hs is not null and 'bdm' = any(public._kho_ds_nhanh_khoi(p_mon, p_khoi_hs)) and coalesce(p_nhanh, '') in ('', 'hinh_gt')
              then public._kho_lt_tbl(p_mon, 'bdm')
              else public._kho_lt_tbl(p_mon, p_nhanh) end
$$;

CREATE OR REPLACE FUNCTION public.hs_sotay_cay_hs(p_mon text DEFAULT 'Toán'::text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_bd text := public._kho_ban_do_tbl(p_mon, p_nhanh);
  v_lt text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_khoi_hs text := public._sotay_khoi_hs(p_mon);
  v_max integer := public._khoi_so(v_khoi_hs);
  v_khoi text;
  v_cay jsonb;
  v_khoi_list jsonb;
  v_co bigint := 0;
  v_thieu bigint := 0;
begin
  if not (public.my_hoc_sinh_id() is not null or public.la_thanh_vien()) then
    raise exception 'Không có quyền đọc sổ tay.';
  end if;
  select b.bd, b.lt into v_bd, v_lt from public._sotay_bang(p_mon, p_nhanh, v_khoi_hs) b;  -- 24/10: bản đồ mới theo công tắc

  execute format($q$
    select coalesce(jsonb_agg(k order by public._khoi_so(k) desc, k desc), '[]'::jsonb) from (
      select distinct bd.khoi k from %1$I bd join %2$I lt on lt.ma_dang = bd.ma_dang
      where btrim(coalesce(lt.noi_dung, '')) <> '' and not public._kho_la_dang_cho(bd.ma_dang)
        and ($1::int is null or public._khoi_so(bd.khoi) <= $1::int)
    ) x
  $q$, v_bd, v_lt) into v_khoi_list using v_max;

  -- Danh sách đã xếp lớp ↓ ⇒ phần tử đầu = lớp cao nhất ≤ lớp em.
  v_khoi := case when v_khoi_hs is not null and v_khoi_list ? v_khoi_hs then v_khoi_hs else v_khoi_list ->> 0 end;

  if v_khoi is not null then
    execute format($q$
      select count(*) filter (where btrim(coalesce(lt.noi_dung, '')) <> ''),
             count(*) filter (where lt.ma_dang is null or btrim(coalesce(lt.noi_dung, '')) = '')
      from %1$I bd left join %2$I lt on lt.ma_dang = bd.ma_dang
      where bd.khoi = $1 and not public._kho_la_dang_cho(bd.ma_dang)
    $q$, v_bd, v_lt) into v_co, v_thieu using v_khoi;

    execute format($q$
      with d as (
        select bd.ma_dang, bd.ten_dang, bd.muc_do, bd.mo_ta_ngan,
               bd.ma_chu_de, bd.ten_chu_de, bd.ma_chuyen_de, bd.ten_chuyen_de
        from %1$I bd join %2$I lt on lt.ma_dang = bd.ma_dang
        where bd.khoi = $1 and btrim(coalesce(lt.noi_dung, '')) <> ''
          and not public._kho_la_dang_cho(bd.ma_dang)
      ), cde as (
        select ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, count(*) so_dang,
               jsonb_agg(jsonb_build_object(
                 'ma_dang', ma_dang, 'ten_dang', ten_dang, 'muc_do', muc_do,
                 'nhom', case when muc_do is null then null when muc_do <= 2 then 'co_ban' when muc_do = 3 then 'trung_binh' else 'nang_cao' end,
                 'mo_ta_ngan', mo_ta_ngan
               ) order by ma_dang) dangs
        from d group by 1, 2, 3, 4
      ), cd as (
        select ma_chu_de, ten_chu_de, sum(so_dang) so_dang,
               jsonb_agg(jsonb_build_object(
                 'ma', ma_chuyen_de, 'ten', ten_chuyen_de, 'so_dang', so_dang, 'dangs', dangs
               ) order by ma_chuyen_de) con
        from cde group by 1, 2
      )
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma', ma_chu_de, 'ten', ten_chu_de, 'so_dang', so_dang, 'con', con
      ) order by ma_chu_de), '[]'::jsonb) from cd
    $q$, v_bd, v_lt) into v_cay using v_khoi;
  end if;

  return jsonb_build_object(
    'mon', p_mon, 'nhanh', p_nhanh,
    'khoi', v_khoi, 'khoi_hs', v_khoi_hs, 'khoi_list', v_khoi_list,
    'so_dang', v_co, 'thieu_ly_thuyet', v_thieu,
    'cay', coalesce(v_cay, '[]'::jsonb));
end $function$;

CREATE OR REPLACE FUNCTION public.hs_sotay_tim_lt(p_tu_khoa text, p_mon text DEFAULT 'Toán'::text, p_limit integer DEFAULT 20)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_q      text := public.fn_bo_dau(btrim(coalesce(p_tu_khoa, '')));
  v_toks   text[];
  v_pats   text[] := '{}';
  v_n      integer;
  v_i      integer;
  v_max    integer := public._khoi_so(public._sotay_khoi_hs(p_mon));
  v_limit  integer := greatest(1, least(coalesce(p_limit, 20), 50));
  v_nhanh  text;
  v_bd     text;
  v_lt     text;
  v_da     text[] := '{}';
  v_phan   jsonb;
  v_gom    jsonb := '[]'::jsonb;
begin
  if not (public.my_hoc_sinh_id() is not null or public.la_thanh_vien()) then
    raise exception 'Không có quyền đọc sổ tay.';
  end if;
  if length(v_q) < 2 then return '[]'::jsonb; end if;

  v_toks := array(
    select regexp_replace(x, '[^a-z0-9]', '', 'g')
    from unnest(regexp_split_to_array(v_q, '\s+')) x
    where regexp_replace(x, '[^a-z0-9]', '', 'g') <> ''
  );
  v_n := coalesce(array_length(v_toks, 1), 0);
  if v_n = 0 then return '[]'::jsonb; end if;
  for v_i in 1 .. v_n loop
    v_pats := v_pats || (case when v_i < v_n then '\m' || v_toks[v_i] || '\M' else '\m' || v_toks[v_i] end);
  end loop;

  -- Các nhánh sổ tay HS dùng (= SOTAY_NHANH ở lib/sotay.ts: Đại = null, Hình GT = 'hinh_gt'). Môn không chia nhánh
  -- (KHTN, Anh, TSA) thì 2 nhánh ra CÙNG bảng ⇒ khử trùng theo tên bảng, không tìm 2 lần.
  foreach v_nhanh in array array[null, 'hinh_gt']::text[] loop
    select b.bd, b.lt into v_bd, v_lt from public._sotay_bang(p_mon, v_nhanh, public._sotay_khoi_hs(p_mon)) b;  -- 24/10: bản đồ mới theo công tắc
    continue when v_bd = any(v_da);
    v_da := v_da || v_bd;
    execute format($q$
      with d as (
        select bd.ma_dang, bd.ten_dang, bd.khoi, bd.muc_do, bd.mo_ta_ngan, bd.ten_chu_de, bd.ten_chuyen_de,
               public.fn_bo_dau(bd.ten_dang) t_dang,
               public.fn_bo_dau(bd.ten_dang) || ' ' || public.fn_bo_dau(bd.ten_chuyen_de) || ' '
                 || public.fn_bo_dau(bd.ten_chu_de) || ' ' || public.fn_bo_dau(coalesce(bd.mo_ta_ngan, '')) hay
        from %1$I bd join %2$I lt on lt.ma_dang = bd.ma_dang
        where btrim(coalesce(lt.noi_dung, '')) <> ''
          and not public._kho_la_dang_cho(bd.ma_dang)
          and ($3::int is null or public._khoi_so(bd.khoi) <= $3::int)
      ), m as (
        select d.*,
          (case when d.t_dang = $1::text then 100
                when d.t_dang like $4::text then 60
                when d.t_dang like $5::text then 40
                when public.fn_bo_dau(d.ten_chuyen_de) like $5::text then 20
                when public.fn_bo_dau(d.ten_chu_de) like $5::text then 12
                else 4 end) diem
        from d where d.hay ~ all($2::text[])
      )
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_dang', ma_dang, 'ten_dang', ten_dang, 'khoi', khoi, 'muc_do', muc_do,
        'nhom', case when muc_do is null then null when muc_do <= 2 then 'co_ban' when muc_do = 3 then 'trung_binh' else 'nang_cao' end,
        'mo_ta_ngan', mo_ta_ngan, 'ten_chu_de', ten_chu_de, 'ten_chuyen_de', ten_chuyen_de,
        'nhanh', $7::text, 'diem', diem)), '[]'::jsonb)
      from (select * from m order by diem desc, public._khoi_so(khoi) desc, ten_dang limit $6::int) z
    $q$, v_bd, v_lt)
    into v_phan
    using v_q, v_pats, v_max, v_q || '%', '%' || v_q || '%', v_limit, v_nhanh;
    v_gom := v_gom || v_phan;
  end loop;

  -- Gộp các nhánh rồi cắt chung: điểm ↓, lớp ↓, tên.
  return coalesce((
    select jsonb_agg(x - 'diem' order by (x->>'diem')::int desc, public._khoi_so(x->>'khoi') desc, x->>'ten_dang')
    from (select x from jsonb_array_elements(v_gom) x
          order by (x->>'diem')::int desc, public._khoi_so(x->>'khoi') desc, x->>'ten_dang' limit v_limit) z
  ), '[]'::jsonb);
end $function$;
