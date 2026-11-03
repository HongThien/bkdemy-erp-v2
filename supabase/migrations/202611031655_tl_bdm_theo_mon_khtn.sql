-- ============================================================================
-- 202611031655 — tl_bdm_theo_mon_khtn
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 03/11 "Cần có luồng làm ET, giáo trình theo bản đồ mới cho KHTN giống với Toán". Chốt: CHẠY SONG SONG
--   (lá cũ KHTN vẫn mở, mastery/bổ trợ/app HS KHTN giữ bản đồ cũ — đo đi theo CÂU nên ET mới vẫn chấm/đo bình thường) ·
--   build luồng trước, LT/VD dạng bài KHTN bổ sung sau.
-- CÁCH (CLAUDE.md §1.6 — dispatch môn→bảng qua 1 registry, không chép bộ hàm thứ 2):
--   · Registry = 5 view tl_bdm_*_v gộp dai_bdm_* (mon 'Toán') + khtn_bdm_* (mon 'KHTN'), security_invoker (RLS bảng gốc giữ nguyên).
--     Mã gốc 2 môn không trùng (NNB/NDB… vs KNB/KDB…) ⇒ tra theo id qua view ra đúng 1 dòng.
--   · _tl_bdm_cau_vi_tri(khối, môn) MỚI: 'Toán' gọi nguyên bản 1 tham số (không đổi một chữ) · 'KHTN' = câu đã gán dạng bài
--     (khtn_bdm_gan_cau) + câu chưa phân của nhóm (dạng cũ = nhóm.ma_cu, chỉ khi dạng cũ ứng đúng 1 nhóm — y luật mot_nhom Toán).
--   · Các hàm builder/ET thay dai_bdm_* → view, vị trí câu theo môn của nhóm / dạng bài. fn_tl_bdm_cay_chon: p_nhanh 'khtn' ⇒ KHTN.
--   · dat_buoi chặn nhóm KHÁC MÔN với giáo trình. et_ma_de thêm kho khtn_cau_hoi + khtn_cau_form_tn.
-- KHÔNG đổi chữ ký hàm nào (không overload gây PostgREST mơ hồ, không drop). Chuyển giáo trình cũ (fn_tl_bdm_chuyen_luu_tru) giữ Toán.
-- MẤT GÌ (Luật xoá): Không mất gì — thêm view + hàm, thay thân hàm (đầu ra Toán kiểm trước/sau bằng băm, scripts/_test_tl_bdm_khtn.mjs).
-- ============================================================================

create or replace view tl_bdm_chu_de_v with (security_invoker = true) as
  select 'Toán'::text as mon, c.id, c.khoi, c.ten, c.thu_tu, c.nhanh from dai_bdm_chu_de c
  union all
  select 'KHTN'::text, c.id, c.khoi, c.ten, c.thu_tu, 'khtn'::text from khtn_bdm_chu_de c;

create or replace view tl_bdm_chuyen_de_v with (security_invoker = true) as
  select 'Toán'::text as mon, c.id, c.ten from dai_bdm_chuyen_de c
  union all
  select 'KHTN'::text, c.id, c.ten from khtn_bdm_chuyen_de c;

create or replace view tl_bdm_o_v with (security_invoker = true) as
  select 'Toán'::text as mon, o.chu_de_id, o.chuyen_de_id, o.thu_tu from dai_bdm_o o
  union all
  select 'KHTN'::text, o.chu_de_id, o.chuyen_de_id, o.thu_tu from khtn_bdm_o o;

create or replace view tl_bdm_nhom_v with (security_invoker = true) as
  select 'Toán'::text as mon, n.id, n.chu_de_id, n.chuyen_de_id, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.thu_tu from dai_bdm_nhom n
  union all
  select 'KHTN'::text, n.id, n.chu_de_id, n.chuyen_de_id, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.thu_tu from khtn_bdm_nhom n;

create or replace view tl_bdm_dang_bai_v with (security_invoker = true) as
  select 'Toán'::text as mon, d.id, d.nhom_id, d.ten, d.mo_ta, d.ly_thuyet, d.ly_thuyet_file_url, d.vi_du, d.vi_du_file_url, d.thu_tu from dai_bdm_dang_bai d
  union all
  select 'KHTN'::text, d.id, d.nhom_id, d.ten, d.mo_ta, d.ly_thuyet, d.ly_thuyet_file_url, d.vi_du, d.vi_du_file_url, d.thu_tu from khtn_bdm_dang_bai d;

-- Môn của 1 nhóm (registry)
create or replace function _tl_bdm_mon_nhom(p_nhom text) returns text
language sql stable as $$
  select n.mon from tl_bdm_nhom_v n where n.id = p_nhom
$$;

-- Vị trí câu (dạng bài · nhóm) theo MÔN. Toán = nguyên bản 1 tham số.
create or replace function _tl_bdm_cau_vi_tri(p_khoi text, p_mon text)
 returns table(ma_cau text, la_goc boolean, cum text, loai_cau text, dang_bai_id text, nhom_id text)
 language plpgsql stable security definer set search_path to 'public'
as $function$
#variable_conflict use_column
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được kho.' using errcode = '42501'; end if;
  if p_mon = 'Toán' then
    return query select * from _tl_bdm_cau_vi_tri(p_khoi);
    return;
  end if;
  if p_mon = 'KHTN' then
    return query
    with nh as materialized (
      select n.id, n.ma_cu from khtn_bdm_nhom n join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi
    ),
    mot_nhom as (   -- câu chưa phân ⇒ nhóm qua dạng cũ, chỉ khi dạng cũ ứng ĐÚNG 1 nhóm (như Toán)
      select nh.ma_cu, min(nh.id) as nhom from nh where nh.ma_cu is not null group by nh.ma_cu having count(*) = 1
    )
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.ma_cum, c.parent_ma_cau, c.ma_cau), c.loai_cau, g.dang_bai_id, db.nhom_id
      from khtn_bdm_gan_cau g
      join khtn_bdm_dang_bai db on db.id = g.dang_bai_id
      join nh on nh.id = db.nhom_id
      join khtn_cau_hoi c on c.ma_cau = g.ma_cau
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
    union all
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.ma_cum, c.parent_ma_cau, c.ma_cau), c.loai_cau, null::text, mn.nhom
      from khtn_cau_hoi c
      join mot_nhom mn on mn.ma_cu = c.dang_chinh
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = c.ma_cau);
    return;
  end if;
  raise exception 'Môn % chưa có bản đồ mới cho giáo trình / ET.', p_mon using errcode = 'P0001';
end $function$;

-- Cây chọn: p_nhanh 'toan' / 'hgt' (Toán) · 'khtn' (KHTN). Số nhóm = row_number theo thu_tu như _bdm_so_nhom.
CREATE OR REPLACE FUNCTION public.fn_tl_bdm_cay_chon(p_khoi text, p_nhanh text DEFAULT 'toan'::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with m as materialized (select case when p_nhanh = 'khtn' then 'KHTN' else 'Toán' end as mon),
  v as materialized (select * from _tl_bdm_cau_vi_tri(p_khoi, (select m.mon from m))),
  dem_db as materialized (select v.dang_bai_id, count(*) as n from v where v.dang_bai_id is not null group by 1),
  dem_cp as materialized (select v.nhom_id, count(*) as n from v where v.dang_bai_id is null and v.nhom_id is not null group by 1)
  select jsonb_build_object('chu_de', coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', cd.id, 'ten', cd.ten,
      'chuyen_de', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ch.id, 'ten', ch.ten, 'so', o.so,
          'nhom', coalesce((
            select jsonb_agg(jsonb_build_object(
              'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'so', n.so,
              'co_ly_thuyet', (btrim(coalesce(n.ly_thuyet, '')) <> '' or n.ly_thuyet_file_url is not null),
              'so_cau_chua_phan', coalesce((select x.n from dem_cp x where x.nhom_id = n.id), 0),
              'dang_bai', coalesce((
                select jsonb_agg(jsonb_build_object(
                  'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'so', d.so,
                  'co_ly_thuyet', (btrim(coalesce(d.ly_thuyet, '')) <> '' or d.ly_thuyet_file_url is not null),
                  'co_vi_du', (btrim(coalesce(d.vi_du, '')) <> '' or d.vi_du_file_url is not null),
                  'so_cau', coalesce((select x.n from dem_db x where x.dang_bai_id = d.id), 0)
                ) order by d.so)
                from (select d0.*, row_number() over (order by d0.thu_tu, d0.id) as so
                        from tl_bdm_dang_bai_v d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
            ) order by n.so)
            from (select n0.*, (row_number() over (order by n0.thu_tu, n0.id))::integer as so
                    from tl_bdm_nhom_v n0 where n0.chu_de_id = cd.id and n0.chuyen_de_id = ch.id) n), '[]'::jsonb)
        ) order by o.so)
        from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) as so
                from tl_bdm_o_v o0 where o0.chu_de_id = cd.id) o
        join tl_bdm_chuyen_de_v ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
    ) order by cd.thu_tu, cd.id)
    from tl_bdm_chu_de_v cd where cd.mon = (select m.mon from m) and cd.khoi = p_khoi and cd.nhanh = p_nhanh), '[]'::jsonb))
$function$;

CREATE OR REPLACE FUNCTION public._tl_bdm_khoi_nhom(p_nhom text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select cd.khoi from tl_bdm_nhom_v n join tl_bdm_chu_de_v cd on cd.id = n.chu_de_id where n.id = p_nhom
$function$;

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_cau(p_nhom text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with v as materialized (select * from _tl_bdm_cau_vi_tri(_tl_bdm_khoi_nhom(p_nhom), _tl_bdm_mon_nhom(p_nhom)) x where x.nhom_id = p_nhom),
  u as materialized (select * from _tl_bdm_so_lan_dung(array(select v.ma_cau from v)))
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma_cau', v.ma_cau, 'dang_bai_id', v.dang_bai_id, 'loai_cau', v.loai_cau, 'la_goc', v.la_goc, 'cum', v.cum,
           'so_lan_dung', coalesce(u.n, 0))
         order by db.thu_tu nulls last, db.id, coalesce(u.n, 0), v.ma_cau), '[]'::jsonb)
    from v
    left join u on u.ma_cau = v.ma_cau
    left join tl_bdm_dang_bai_v db on db.id = v.dang_bai_id
$function$;

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_goi_y(p_nhom text, p_dang_bai text[], p_so jsonb, p_tru text[] DEFAULT '{}'::text[])
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v_out text[];
  v_tong int := coalesce((p_so->>'_tong')::int, 0);
begin
  with v as materialized (
    select x.* from _tl_bdm_cau_vi_tri(_tl_bdm_khoi_nhom(p_nhom), _tl_bdm_mon_nhom(p_nhom)) x
     where x.nhom_id = p_nhom
       and (p_dang_bai is null or x.dang_bai_id = any (p_dang_bai)
            or (x.dang_bai_id is null and array_position(p_dang_bai, null) is not null))   -- NULL trong danh sách = câu chưa phân
       and not (x.ma_cau = any (coalesce(p_tru, '{}')))
  ),
  t as materialized (select * from _tl_bdm_so_lan_dung(array(select v.ma_cau from v))),
  u as (
    select v.*, coalesce(t.n, 0) as dung, coalesce(db.thu_tu, 2147483647) as db_tt, coalesce(v.dang_bai_id, '') as dbk
      from v
      left join t on t.ma_cau = v.ma_cau
      left join tl_bdm_dang_bai_v db on db.id = v.dang_bai_id
  ),
  r1 as (
    select u.*,
           row_number() over (partition by loai_cau, dbk, cum order by dung, (not la_goc), ma_cau) as rn_cum,
           min(dung)    over (partition by loai_cau, dbk, cum) as cum_min
      from u
  ),
  r2 as (select r1.*, row_number() over (partition by loai_cau, dbk order by rn_cum, cum_min, cum) as r_db from r1),
  r3 as (select r2.*, row_number() over (partition by loai_cau order by r_db, db_tt, dbk) as r_loai,
                      row_number() over (partition by dbk order by r_db, dung, ma_cau) as r_dbk
           from r2),
  chon as (
    select r3.* from r3
     where r3.r_loai <= coalesce((p_so->>r3.loai_cau)::int, 0)
  ),
  them as (
    select r3.* from r3
     where not exists (select 1 from chon c where c.ma_cau = r3.ma_cau)
     order by r3.r_dbk, r3.db_tt, r3.dbk
     limit greatest(v_tong - (select count(*) from chon), 0)
  ),
  tat as (select * from chon union all select * from them)
  select coalesce(array_agg(ma_cau order by db_tt, dbk,
                  case loai_cau when 'trac_nghiem' then 1 when 'tra_loi_ngan' then 2 when 'tu_luan' then 3 else 4 end, r_loai), '{}')
    into v_out from tat;
  return v_out;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_dat_buoi(p_tai_lieu uuid, p_buoi uuid, p_chon jsonb, p_so_luyen jsonb DEFAULT '{"_tong": 2, "tu_luan": 1, "trac_nghiem": 1}'::jsonb, p_so_luyen_nhom jsonb DEFAULT '{"_tong": 6, "tu_luan": 1, "trac_nghiem": 3, "tra_loi_ngan": 2}'::jsonb, p_so_btvn jsonb DEFAULT '{"_tong": 4, "tu_luan": 1, "trac_nghiem": 2, "tra_loi_ngan": 1}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  r record; d record;
  v_nhom text; v_ds text[]; v_ds_bd text[];
  v_pn uuid; v_pd uuid;
  v_used text[];
  v_cau text[];
  v_moi boolean;
  v_lay_cp boolean;   -- BTVN/luyện được lấy câu chưa phân dạng bài của nhóm
  v_seq uuid[] := '{}'; v_btvn uuid[] := '{}';
  v_all uuid[]; v_i int; v_j int;
  v_mon text;
begin
  perform _tl_bdm_kiem_buoi(p_tai_lieu, p_buoi);
  select t.mon into v_mon from tai_lieu t where t.id = p_tai_lieu;
  if jsonb_typeof(p_chon) is distinct from 'array' then raise exception 'p_chon phải là mảng.'; end if;

  -- Kiểm đầu vào: nhóm có thật, không trùng; dạng bài thuộc đúng nhóm, không trùng.
  if (select count(*) from jsonb_array_elements(p_chon) e) <> (select count(distinct e->>'nhom') from jsonb_array_elements(p_chon) e) then
    raise exception 'Một nhóm bị chọn 2 lần.' using errcode = 'P0001';
  end if;
  for r in select e->>'nhom' as nhom, coalesce(array(select jsonb_array_elements_text(e->'dang_bai')), '{}') as ds
             from jsonb_array_elements(p_chon) e loop
    if not exists (select 1 from tl_bdm_nhom_v n where n.id = r.nhom and n.mon = v_mon) then
      raise exception 'Nhóm % không có trên bản đồ môn %.', r.nhom, v_mon using errcode = 'P0001';
    end if;
    if cardinality(r.ds) <> (select count(distinct x) from unnest(r.ds) x) then
      raise exception 'Một dạng bài bị chọn 2 lần trong nhóm %.', r.nhom using errcode = 'P0001';
    end if;
    if exists (select 1 from unnest(r.ds) x where not exists (select 1 from tl_bdm_dang_bai_v db where db.id = x and db.nhom_id = r.nhom)) then
      raise exception 'Có dạng bài không thuộc nhóm %.', r.nhom using errcode = 'P0001';
    end if;
  end loop;

  -- Bỏ nhóm không còn chọn (cascade cha_id xoá phần con, cascade phan_id xoá câu).
  delete from tai_lieu_phan p
   where p.cha_id = p_buoi and p.loai_phan = 'nhom'
     and not (p.ref_ma = any (array(select e->>'nhom' from jsonb_array_elements(p_chon) e)));

  for r in select e->>'nhom' as nhom, coalesce(array(select jsonb_array_elements_text(e->'dang_bai')), '{}') as ds, o
             from jsonb_array_elements(p_chon) with ordinality as x(e, o) order by o loop
    v_nhom := r.nhom; v_ds := r.ds;
    select p.id into v_pn from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'nhom' and p.ref_ma = v_nhom;
    v_moi := v_pn is null;
    if v_moi then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
      values (p_tai_lieu, 999999, 'nhom', v_nhom, p_buoi) returning id into v_pn;
    end if;
    v_seq := v_seq || v_pn;

    -- Bỏ dạng bài không còn chọn.
    delete from tai_lieu_phan p where p.cha_id = v_pn and p.loai_phan = 'dang_bai' and not (p.ref_ma = any (v_ds));

    -- Dạng bài: giữ cái đã có, tạo + gợi ý cái mới.
    for d in select x as db, o from unnest(v_ds) with ordinality as y(x, o) order by o loop
      select p.id into v_pd from tai_lieu_phan p where p.cha_id = v_pn and p.loai_phan = 'dang_bai' and p.ref_ma = d.db;
      if v_pd is null then
        insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
        values (p_tai_lieu, 999999, 'dang_bai', d.db, v_pn) returning id into v_pd;
        v_used := _tl_bdm_cau_da_dung(p_buoi);
        perform _tl_bdm_ghi_cau(v_pd, fn_tl_bdm_goi_y(v_nhom, array[d.db], p_so_luyen, v_used));
      end if;
      v_seq := v_seq || v_pd;
      v_pd := null;
    end loop;

    v_ds_bd := array(select db.id from tl_bdm_dang_bai_v db where db.nhom_id = v_nhom);
    -- Câu chưa phân được dùng khi: nhóm chưa có dạng bài · buổi chọn TRỌN nhóm · hoặc dạng bài đã chọn không ra câu luyện nào.
    v_lay_cp := cardinality(v_ds_bd) = 0 or v_ds @> v_ds_bd;
    -- Nhóm mới mà phần luyện theo dạng bài TRỐNG (nhóm chưa có dạng bài, hoặc dạng bài đã chọn chưa có câu) ⇒ câu luyện theo cả nhóm.
    if v_moi and not exists (select 1 from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id
                              where p.cha_id = v_pn and p.loai_phan = 'dang_bai') then
      v_used := _tl_bdm_cau_da_dung(p_buoi);
      v_cau := fn_tl_bdm_goi_y(v_nhom, case when cardinality(v_ds_bd) = 0 then null else v_ds || array[null::text] end, p_so_luyen_nhom, v_used);
      if cardinality(v_ds_bd) = 0 or cardinality(v_cau) > 0 then
        insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
        values (p_tai_lieu, 999999, 'nhom_chua_phan', v_nhom, v_pn) returning id into v_pd;
        perform _tl_bdm_ghi_cau(v_pd, v_cau);
        v_lay_cp := true;
      end if;
      v_pd := null;
    end if;
    -- chưa phân đứng sau các dạng bài
    v_seq := v_seq || array(select p.id from tai_lieu_phan p where p.cha_id = v_pn and p.loai_phan = 'nhom_chua_phan' order by p.thu_tu, p.id);

    -- BTVN của nhóm: chỉ tự gợi ý khi nhóm mới thêm (nhóm cũ giữ câu GV đã chỉnh).
    if v_moi then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
      values (p_tai_lieu, 999999, 'btvn_nhom', v_nhom, v_pn) returning id into v_pd;
      v_used := _tl_bdm_cau_da_dung(p_buoi);
      perform _tl_bdm_ghi_cau(v_pd, fn_tl_bdm_goi_y(v_nhom,
        case when cardinality(v_ds_bd) = 0 then null when v_lay_cp then v_ds || array[null::text] else v_ds end, p_so_btvn, v_used));
      v_pd := null;
    end if;
    v_btvn := v_btvn || array(select p.id from tai_lieu_phan p where p.cha_id = v_pn and p.loai_phan = 'btvn_nhom' order by p.thu_tu, p.id);
    v_pn := null;
  end loop;

  -- Phần khác của buổi (chua_khop, con lạ) giữ nguyên, xếp sau phần luyện, trước BTVN.
  v_seq := p_buoi || v_seq
        || array(select p.id from _tl_bdm_phan_cua_buoi(p_buoi) p
                  where not (p.id = any (v_seq)) and not (p.id = any (v_btvn)) order by p.thu_tu, p.id)
        || v_btvn;

  -- Thay đúng đoạn của buổi này trong thứ tự cả tài liệu (các buổi khác giữ nguyên chỗ).
  v_all := array(select p.id from tai_lieu_phan p where p.tai_lieu_id = p_tai_lieu order by p.thu_tu, p.id);
  v_i := array_position(v_all, p_buoi);
  v_j := v_i + 1;
  while v_j <= cardinality(v_all)
        and not exists (select 1 from tai_lieu_phan p where p.id = v_all[v_j] and p.loai_phan = 'buoi') loop
    v_j := v_j + 1;
  end loop;
  v_all := coalesce(v_all[1:v_i - 1], '{}')
        || v_seq
        || array(select x from unnest(coalesce(v_all[v_i:v_j - 1], '{}')) x where not (x = any (v_seq)))   -- phần rời không thuộc khung (giữ, không mất)
        || coalesce(v_all[v_j:], '{}');
  update tai_lieu_phan p set thu_tu = x.o - 1
    from unnest(v_all) with ordinality as x(id, o)
   where p.id = x.id and p.thu_tu is distinct from (x.o - 1)::int;

  update tai_lieu set updated_at = now() where id = p_tai_lieu;   -- đổi nội dung con ⇒ bump cha (CLAUDE.md §2)
  return fn_tl_bdm_noi_dung(p_tai_lieu, p_buoi);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_noi_dung(p_tai_lieu uuid, p_buoi uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with ph as materialized (select p.* from tai_lieu_phan p where p.tai_lieu_id = p_tai_lieu),
  cau as materialized (
    select tc.phan_id, array_agg(tc.ma_cau order by tc.thu_tu, tc.id) as ds
      from tai_lieu_cau tc where tc.phan_id in (select ph.id from ph) group by 1
  ),
  khoi_cau as (select c.phan_id, jsonb_build_object('phan_id', c.phan_id, 'caus', to_jsonb(c.ds)) as j from cau c)
  select jsonb_build_object(
    'tai_lieu', (select jsonb_build_object('id', t.id, 'ten', t.ten, 'khoi', t.khoi, 'mon', t.mon, 'nhanh', t.nhanh,
                                           'ban_do', t.ban_do, 'luu_tru_tu', t.luu_tru_tu, 'cau_hinh', t.cau_hinh, 'updated_at', t.updated_at)
                   from tai_lieu t where t.id = p_tai_lieu),
    'buoi', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'tieu_de', b.tieu_de, 'thu_tu', b.thu_tu,
        'nhom', coalesce((
          select jsonb_agg(jsonb_build_object(
            'phan_id', pn.id, 'id', pn.ref_ma, 'stt', pn.stt, 'hien_lt', pn.hien_lt,
            'ten', n.ten, 'mo_ta', n.mo_ta, 'con_tren_ban_do', n.id is not null,
            'ly_thuyet', n.ly_thuyet, 'ly_thuyet_file_url', n.ly_thuyet_file_url,
            'dang_bai', coalesce((
              select jsonb_agg(jsonb_build_object(
                'phan_id', pd.id, 'id', pd.ref_ma, 'stt', pd.stt, 'hien_lt', pd.hien_lt, 'hien_vi_du', pd.hien_vi_du,
                'ten', d.ten, 'mo_ta', d.mo_ta, 'con_tren_ban_do', d.id is not null,
                'ly_thuyet', d.ly_thuyet, 'ly_thuyet_file_url', d.ly_thuyet_file_url,
                'vi_du', d.vi_du, 'vi_du_file_url', d.vi_du_file_url,
                'caus', coalesce(to_jsonb((select c.ds from cau c where c.phan_id = pd.id)), '[]'::jsonb)
              ) order by pd.stt)
              from (select p.*, row_number() over (order by p.thu_tu, p.id) as stt
                      from ph p where p.cha_id = pn.id and p.loai_phan = 'dang_bai') pd
              left join tl_bdm_dang_bai_v d on d.id = pd.ref_ma), '[]'::jsonb),
            'chua_phan', (select coalesce(k.j, jsonb_build_object('phan_id', p.id, 'caus', '[]'::jsonb))
                            from ph p left join khoi_cau k on k.phan_id = p.id
                           where p.cha_id = pn.id and p.loai_phan = 'nhom_chua_phan' order by p.thu_tu, p.id limit 1),
            'btvn', (select coalesce(k.j, jsonb_build_object('phan_id', p.id, 'caus', '[]'::jsonb))
                       from ph p left join khoi_cau k on k.phan_id = p.id
                      where p.cha_id = pn.id and p.loai_phan = 'btvn_nhom' order by p.thu_tu, p.id limit 1)
          ) order by pn.stt)
          from (select p.*, row_number() over (order by p.thu_tu, p.id) as stt
                  from ph p where p.cha_id = b.id and p.loai_phan = 'nhom') pn
          left join tl_bdm_nhom_v n on n.id = pn.ref_ma), '[]'::jsonb),
        'chua_khop', (select coalesce(k.j, jsonb_build_object('phan_id', p.id, 'caus', '[]'::jsonb))
                        from ph p left join khoi_cau k on k.phan_id = p.id
                       where p.cha_id = b.id and p.loai_phan = 'chua_khop' order by p.thu_tu, p.id limit 1),
        'on_tap', coalesce((
          select jsonb_agg(jsonb_build_object('phan_id', p.id, 'id', p.ref_ma, 'ten', n.ten,
                   'caus', coalesce(to_jsonb((select c.ds from cau c where c.phan_id = p.id)), '[]'::jsonb)) order by p.thu_tu, p.id)
            from ph p left join tl_bdm_nhom_v n on n.id = p.ref_ma
           where p.cha_id = b.id and p.loai_phan = 'ontap_nhom'), '[]'::jsonb)
      ) order by b.thu_tu, b.id)
      from ph b where b.loai_phan = 'buoi' and (p_buoi is null or b.id = p_buoi)), '[]'::jsonb)
  )
$function$;

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_on_tap_ung_vien(p_master uuid, p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_tt int; v_out jsonb;
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được giáo trình.' using errcode = '42501'; end if;
  select p.thu_tu into v_tt from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_master and p.loai_phan = 'buoi';
  if v_tt is null then raise exception 'Không thấy buổi này trong giáo trình.' using errcode = 'P0001'; end if;
  with truoc as (
    select n.ref_ma as nhom, b.tieu_de, b.thu_tu
      from tai_lieu_phan b join tai_lieu_phan n on n.cha_id = b.id and n.loai_phan = 'nhom'
     where b.tai_lieu_id = p_master and b.loai_phan = 'buoi' and b.thu_tu < v_tt
  ),
  nay as (select n.ref_ma from tai_lieu_phan n where n.cha_id = p_buoi and n.loai_phan = 'nhom'),
  gan as (  -- buổi gần nhất có nhóm đó
    select distinct on (t.nhom) t.nhom, t.tieu_de, t.thu_tu from truoc t
     where not exists (select 1 from nay where nay.ref_ma = t.nhom)
     order by t.nhom, t.thu_tu desc
  )
  select coalesce(jsonb_agg(jsonb_build_object('nhom', g.nhom, 'ten', bn.ten, 'buoi', g.tieu_de) order by g.thu_tu, bn.thu_tu, g.nhom), '[]'::jsonb)
    into v_out
    from gan g left join tl_bdm_nhom_v bn on bn.id = g.nhom;
  return v_out;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_et_de_xuat(p_lop uuid, p_ngay date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with gt as (
    select t.id from tai_lieu t
     where t.loai = 'giao_trinh_buoi' and t.ban_do = 'moi' and t.lop_id = p_lop and t.ngay = p_ngay
     order by t.created_at desc limit 1
  )
  select jsonb_build_object(
    'giao_trinh', (select id from gt),
    'dang_bai', coalesce((
      select jsonb_agg(x.j order by x.tt, x.id) from (
        select jsonb_build_object('id', p.ref_ma, 'nhom_id', db.nhom_id, 'ten', db.ten) j, p.thu_tu tt, p.id
          from tai_lieu_phan p join tl_bdm_dang_bai_v db on db.id = p.ref_ma
         where p.tai_lieu_id = (select id from gt) and p.loai_phan = 'dang_bai'
        union all
        -- giáo trình Hình: phần HỌC = bài học (bài học = nhóm = dạng bài)
        select jsonb_build_object('id', p.ref_ma, 'nhom_id', p.ref_ma, 'ten', hb.ten_bai), p.thu_tu, p.id
          from tai_lieu_phan p join hinh_hoc_bai hb on hb.ma_bai = p.ref_ma
         where p.tai_lieu_id = (select id from gt) and p.loai_phan = 'dang'
      ) x), '[]'::jsonb))
$function$;

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_et_ma_de(p_khoi text, p_base jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$   -- volatile: dùng bảng tạm (đọc vị trí câu 1 lần), không ghi gì lâu dài
declare
  b record;
  v_cum text; v_cands text[]; v_picks text[]; v_fresh text; v_dup text;
  v_used text[] := array(select e->>'ma_cau' from jsonb_array_elements(p_base) e);   -- đề 2/3 khác MỌI câu gốc khi còn đủ câu
  v_made jsonb := '{}'; v_form jsonb := '{}';
begin
  create temp table if not exists _et_vt (ma_cau text, cum text, dang_bai_id text, la_goc boolean) on commit drop;
  truncate _et_vt;
  -- chỉ tính vị trí câu của MÔN có dạng bài trong đề (Toán · KHTN — registry tl_bdm_dang_bai_v)
  insert into _et_vt select x.ma_cau, x.cum, x.dang_bai_id, x.la_goc
    from (select distinct v.mon from tl_bdm_dang_bai_v v where v.id in (select e->>'dang_bai' from jsonb_array_elements(p_base) e)) m
    cross join lateral _tl_bdm_cau_vi_tri(p_khoi, m.mon) x
   where x.dang_bai_id in (select e->>'dang_bai' from jsonb_array_elements(p_base) e);
  -- Hình học: dạng bài = bài học (mã HH…), cả bài là 1 "cụm" (không còn cụm Hình học)
  insert into _et_vt select h.ma_cau, h.dang_chinh, h.dang_chinh, h.parent_ma_cau is null
    from hinh_hoc_cau_hoi h
   where h.dang_chinh in (select e->>'dang_bai' from jsonb_array_elements(p_base) e)
     and h.ma_cau in (select x.ma_cau from _tl_hh_cau_chuan(h.dang_chinh) x);
  for b in select e->>'ma_cau' as ma, e->>'dang_bai' as db, coalesce(e->>'form', 'tra_loi_ngan') as form, o
             from jsonb_array_elements(p_base) with ordinality as t(e, o) order by o loop
    select v.cum into v_cum from _et_vt v where v.ma_cau = b.ma;
    v_cum := coalesce(v_cum, b.ma);   -- câu gốc không còn trong kho chuẩn ⇒ cụm = chính nó
    -- ứng viên = cùng dạng bài + cùng cụm + in được cùng form (TN: có phương án / mệnh đề / form TN đã duyệt; form khác: không phải Đ/S)
    v_cands := array(
      select v.ma_cau from _et_vt v
        join lateral (
          select to_jsonb(c.lua_chon) lc, to_jsonb(c.menh_de) md, exists (select 1 from dai_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet) tn
            from dai_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hgt_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet)
            from hgt_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hinh_hoc_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from hinh_hoc_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from khtn_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from khtn_cau_hoi c where c.ma_cau = v.ma_cau
        ) c on true
       where v.dang_bai_id = b.db and v.cum = v_cum
         and case when b.form = 'trac_nghiem'
                  then jsonb_array_length(coalesce(c.lc, '[]'::jsonb)) > 0 or jsonb_array_length(coalesce(c.md, '[]'::jsonb)) > 0 or c.tn
                  else jsonb_array_length(coalesce(c.md, '[]'::jsonb)) = 0 end
       order by (v.ma_cau = b.ma), (not v.la_goc), v.ma_cau);
    v_picks := '{}';
    for i in 1..2 loop
      select x into v_fresh from unnest(v_cands) x where not (x = any (v_used)) limit 1;
      if v_fresh is not null then
        v_used := v_used || v_fresh; v_picks := v_picks || v_fresh;
        v_form := v_form || jsonb_build_object(v_fresh, b.form);
      else
        -- không đủ biến thể cùng cụm + form ⇒ cho trùng TRONG cụm (khác đề 2 nếu được), rồi câu gốc — không nhảy cụm, không để trống
        v_dup := coalesce((select x from unnest(v_cands) x where not (x = any (v_picks)) limit 1), v_cands[1], b.ma);
        v_picks := v_picks || v_dup;
        v_form := v_form || jsonb_build_object(v_dup, b.form);
      end if;
    end loop;
    v_made := v_made || jsonb_build_object(b.ma, to_jsonb(v_picks));
  end loop;
  return jsonb_build_object('etMaDe', v_made, 'etFormByCau', v_form);
end $function$;

-- Vị trí câu của 1 ET đã lưu: chỉ tính môn có câu trong danh sách (Toán: câu không nằm ở kho KHTN).
CREATE OR REPLACE FUNCTION public.fn_tl_bdm_et_vi_tri(p_khoi text, p_ma text[])
 RETURNS TABLE(ma_cau text, dang_bai_id text, nhom_id text)
 LANGUAGE sql
 STABLE
AS $function$
  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi) x
   where x.ma_cau = any (p_ma)
     and exists (select 1 from unnest(p_ma) m where not exists (select 1 from khtn_cau_hoi k where k.ma_cau = m))
  union all
  select x.ma_cau, x.dang_bai_id, x.nhom_id from _tl_bdm_cau_vi_tri(p_khoi, 'KHTN') x
   where x.ma_cau = any (p_ma)
     and exists (select 1 from khtn_cau_hoi k where k.ma_cau = any (p_ma))
$function$;

revoke all on tl_bdm_chu_de_v, tl_bdm_chuyen_de_v, tl_bdm_o_v, tl_bdm_nhom_v, tl_bdm_dang_bai_v from public, anon;
grant select on tl_bdm_chu_de_v, tl_bdm_chuyen_de_v, tl_bdm_o_v, tl_bdm_nhom_v, tl_bdm_dang_bai_v to authenticated;
revoke execute on function _tl_bdm_mon_nhom(text) from public, anon;
revoke execute on function _tl_bdm_cau_vi_tri(text, text) from public, anon;
grant execute on function _tl_bdm_mon_nhom(text) to authenticated;
grant execute on function _tl_bdm_cau_vi_tri(text, text) to authenticated;
