-- ============================================================================
-- 202610031141 — SỔ TAY: bỏ lọc theo khối, thay bằng luật "chỉ thấy lớp ≤ lớp em đang học" (Thùy 03/10)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 03/10 — "Bỏ filter theo lớp. Search hiện ra toàn bộ kiến thức trong bản đồ kho. Chỉ hiện các lớp
--   NHỎ HƠN BẰNG lớp đang học (lớp 9 thấy 9 8 7 6… nhưng không thấy 10)". Kết quả ghi rõ lớp mấy.
--   Thay hành vi 20/09 (mig 202609201150: chip khối LỌC CỨNG kết quả tìm) — quyết định mới đè quyết định cũ.
--
-- LUẬT (1 nơi): `_sotay_khoi_toi_da(mon)` = lớp em đang học MÔN đó (lớp môn qua `_hs_lop_tu_luyen`, không có thì
--   `hoc_sinh.khoi` — cùng cách `hs_sotay_muc_cay` đã dùng). Nhân sự (không phải HS) ⇒ null = không giới hạn.
--   So bằng SỐ (`_khoi_so`): '4T' → 4, '10' > '9' (so chữ thì '10' < '9' — sai). Luật chạy Ở DB, client không gửi khối.
--
-- LÀM GÌ:
--   · `hs_sotay_tim_lt` (MỚI) — tìm lý thuyết dạng trên MỌI nhánh của môn (Toán: Đại + Hình GT) một lần, kèm `nhanh`
--     của từng dòng để app mở đúng bảng. Thay `hs_sotay_tim` (cũ, 1 nhánh, chip khối) — hàm cũ GIỮ NGUYÊN, chỉ thôi gọi.
--   · `hs_sotay_cay_hs` (MỚI) — cây dạng bài của lớp em (bỏ chip khối); lớp em chưa có nội dung ⇒ lớp CAO NHẤT ≤ lớp em
--     có nội dung (bản cũ rơi về khối đầu danh sách chữ = '10' ⇒ em lớp 6 có thể bị mở cây lớp 10).
--   · `hs_sotay_tim_ct` + `hs_sotay_muc_cay` — create or replace (thân lấy từ bản đang chạy = mig 202610031125):
--     áp cùng luật ≤; `p_khoi` của HS bị bỏ qua (giữ chữ ký để client cũ không vỡ).
--   Thứ tự kết quả: điểm khớp ↓ rồi LỚP ↓ (lớp em lên trước, lớp dưới sau).
--   Hàm cũ `hs_sotay_cay`/`hs_sotay_tim` thuộc owner postgres ⇒ migrate (claude_build) không replace được ⇒ viết hàm mới.
--   `_sotay_duoc_doc`/`_sotay_nhom` (owner postgres, revoke public) KHÔNG gọi được từ hàm claude_build ⇒ viết thẳng điều kiện.
--   Chuỗi `format()` chỉ chứa `%1$I`/`%2$I`; mọi mẫu LIKE/regex truyền qua USING (bài học 20/09, mig 202609201056).
--
-- MẤT GÌ: không. Thêm 4 hàm, replace 2 hàm (giữ chữ ký). Không đụng bảng/dòng nào.
-- ============================================================================

create or replace function public._khoi_so(p_khoi text)
returns integer language sql immutable as $$
  select nullif(regexp_replace(coalesce(p_khoi, ''), '[^0-9]', '', 'g'), '')::integer
$$;

-- Lớp (text) em đang học MÔN này. null = không phải HS (nhân sự xem) ⇒ không giới hạn.
create or replace function public._sotay_khoi_hs(p_mon text)
returns text language sql stable security definer set search_path = public as $$
  select coalesce((select l.khoi from lop l where l.id = public._hs_lop_tu_luyen(h.id, p_mon)), h.khoi)
  from hoc_sinh h where h.id = public.my_hoc_sinh_id()
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- hs_sotay_tim_lt — tìm LÝ THUYẾT DẠNG trên mọi nhánh của môn, lớp ≤ lớp em.
-- Cùng luật khớp với hs_sotay_tim (mig 202609201203): bỏ dấu, AND từng tiếng, tiếng cuối là tiền tố, các tiếng
-- trước trọn từ, input chỉ giữ [a-z0-9]. Thang điểm giữ nguyên 100/60/40/20/12/4.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.hs_sotay_tim_lt(p_tu_khoa text, p_mon text default 'Toán', p_limit integer default 20)
returns jsonb language plpgsql stable security definer set search_path = public as $$
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
    v_bd := public._kho_ban_do_tbl(p_mon, v_nhanh);
    v_lt := public._kho_lt_tbl(p_mon, v_nhanh);
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
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- hs_sotay_cay_hs — cây Chủ đề → Chuyên đề → Dạng của LỚP EM (không còn chip khối). Thân theo hs_sotay_cay (bản đang chạy),
-- chỉ đổi cách chọn khối: lớp em nếu có nội dung, không thì lớp cao nhất ≤ lớp em có nội dung, không có lớp nào ⇒ cây rỗng.
-- Nhân sự (không phải HS): lớp cao nhất có nội dung. `khoi_list` chỉ còn các lớp ≤ lớp em.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.hs_sotay_cay_hs(p_mon text default 'Toán', p_nhanh text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
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
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- hs_sotay_tim_ct — thân từ bản đang chạy (mig 202610031125); đổi: bỏ lọc `p_khoi`, thêm luật lớp ≤ lớp em, xếp lớp ↓.
-- ════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.hs_sotay_tim_ct(p_tu_khoa text, p_mon text DEFAULT 'Toán'::text, p_khoi text DEFAULT NULL::text, p_limit integer DEFAULT 20)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_q     text := public.fn_bo_dau(btrim(coalesce(p_tu_khoa, '')));
  v_toks  text[];
  v_pats  text[] := '{}';
  v_n     integer;
  v_i     integer;
  v_max   integer := public._khoi_so(public._sotay_khoi_hs(p_mon));   -- p_khoi: giữ chữ ký, KHÔNG còn dùng (mig 202610031141)
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 50));
  v_out   jsonb;
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

  with d as (
    select c.ma, c.ten, c.khoi, c.thu_tu,
           cd.thu_tu as thu_tu_cd,
           public.fn_bo_dau(c.ten) as t_ten,
           public.fn_bo_dau(array_to_string(c.ten_khac, ' | ')) as t_khac,
           public.fn_bo_dau(c.ten || ' ' || array_to_string(c.ten_khac, ' ') || ' ' || cd.ten) as hay,
           c.ten_khac
    from sotay_cong_thuc c
    join sotay_ct_chu_de cd on cd.mon = c.mon and cd.khoi = c.khoi and cd.ma = c.chu_de
    where c.trang_thai = 'da_duyet' and c.xoa_at is null
      and c.mon = p_mon and (v_max is null or public._khoi_so(c.khoi) <= v_max)
  ), m as (
    select d.*,
      (case when d.t_ten = v_q then 100
            when exists (select 1 from unnest(d.ten_khac) k where public.fn_bo_dau(k) = v_q) then 90
            when d.t_ten like v_q || '%' then 60
            when d.t_khac like '%' || v_q || '%' then 50
            when d.t_ten like '%' || v_q || '%' then 40
            else 10 end) as diem
    from d where d.hay ~ all(v_pats)
  )
  select coalesce(jsonb_agg(public._sotay_muc_json(ma) order by diem desc, public._khoi_so(khoi) desc, thu_tu_cd, thu_tu), '[]'::jsonb)
  into v_out
  from (select * from m order by diem desc, public._khoi_so(khoi) desc, thu_tu_cd, thu_tu limit v_limit) z;

  return v_out;
end $function$;

-- ════════════════════════════════════════════════════════════════════════════
-- hs_sotay_muc_cay — thân từ bản đang chạy (mig 202610031125); đổi cách chọn khối: HS chỉ thấy lớp ≤ lớp em
-- (`p_khoi` của HS bị bỏ qua), lớp em chưa có mục ⇒ lớp cao nhất ≤ lớp em có mục, không có ⇒ rỗng.
-- Nhân sự vẫn chọn được khối qua `p_khoi` (xem trước), mặc định lớp cao nhất có mục.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.hs_sotay_muc_cay(p_mon text, p_khoi text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_khoi_hs text := public._sotay_khoi_hs(p_mon);
  v_max integer := public._khoi_so(v_khoi_hs);
  v_ds text[];
  v_khoi text;
begin
  if not (v_hs is not null or public.la_thanh_vien()) then raise exception 'Không có quyền đọc sổ tay.'; end if;
  select array_agg(k order by public._khoi_so(k) desc, k desc) into v_ds from (
    select distinct c.khoi k from sotay_cong_thuc c
    where c.mon = p_mon and c.trang_thai = 'da_duyet' and c.xoa_at is null
      and (v_max is null or public._khoi_so(c.khoi) <= v_max)) z;
  if v_ds is null then return jsonb_build_object('khoi', null, 'khoi_list', '[]'::jsonb, 'chu_de', '[]'::jsonb); end if;
  v_khoi := case when v_hs is not null then v_khoi_hs else nullif(btrim(coalesce(p_khoi, '')), '') end;
  if v_khoi is null or not (v_khoi = any(v_ds)) then v_khoi := v_ds[1]; end if;
  return jsonb_build_object('khoi', v_khoi, 'khoi_list', to_jsonb(v_ds), 'chu_de', coalesce((
    select jsonb_agg(jsonb_build_object('ma', cd.ma, 'ten', cd.ten, 'nhanh', cd.nhanh,
             'muc', (select jsonb_agg(jsonb_build_object('ma', c.ma, 'ten', c.ten, 'loai', c.loai) order by c.thu_tu, c.ten)
                     from sotay_cong_thuc c
                     where c.mon = cd.mon and c.khoi = cd.khoi and c.chu_de = cd.ma and c.trang_thai = 'da_duyet' and c.xoa_at is null))
           order by cd.thu_tu)
    from sotay_ct_chu_de cd
    where cd.mon = p_mon and cd.khoi = v_khoi
      and exists (select 1 from sotay_cong_thuc c where c.mon = cd.mon and c.khoi = cd.khoi and c.chu_de = cd.ma
                  and c.trang_thai = 'da_duyet' and c.xoa_at is null)), '[]'::jsonb));
end $$;

-- Quyền: owner claude_build vẫn cấp anon qua default privileges ⇒ revoke anon RIÊNG (bài học 18/09).
revoke all on function public._sotay_khoi_hs(text) from public, anon;
revoke all on function public.hs_sotay_tim_lt(text, text, integer) from public, anon;
grant execute on function public.hs_sotay_tim_lt(text, text, integer) to authenticated;
revoke all on function public.hs_sotay_cay_hs(text, text) from public, anon;
grant execute on function public.hs_sotay_cay_hs(text, text) to authenticated;
revoke all on function public.hs_sotay_tim_ct(text, text, text, integer) from public, anon;
grant execute on function public.hs_sotay_tim_ct(text, text, text, integer) to authenticated;
revoke all on function public.hs_sotay_muc_cay(text, text) from public, anon;
grant execute on function public.hs_sotay_muc_cay(text, text) to authenticated;
