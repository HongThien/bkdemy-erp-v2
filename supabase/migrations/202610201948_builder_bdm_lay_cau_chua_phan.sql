-- Builder bản đồ mới: dùng câu "CHƯA PHÂN dạng bài" của nhóm khi nhóm ĐÃ có dạng bài (20/10, chạy thử toàn bản đồ trước khi GV dùng).
-- Lỗi gặp: 9 nhóm (K9 "Các mô hình toán thực tế nâng cao" ×8, K12 "Thể tích … thiết diện") CÓ dạng bài nhưng dạng bài 0 câu,
--   còn 6–20 câu của nhóm nằm ở "chưa phân" ⇒ đặt cả nhóm vào buổi: phần luyện TRỐNG, BTVN TRỐNG (trước đây câu chưa phân chỉ
--   được lấy khi nhóm KHÔNG có dạng bài nào).
-- Luật mới (CTO quyết, R2):
--   · fn_tl_bdm_goi_y: phần tử NULL trong p_dang_bai = "câu chưa phân dạng bài của nhóm" (array_position so IS NOT DISTINCT).
--   · Phần luyện: nhóm mới mà các dạng bài đã chọn KHÔNG ra câu luyện nào ⇒ thêm mục nhom_chua_phan (câu của dạng bài đã chọn
--     + câu chưa phân), như nhóm chưa chia dạng bài.
--   · BTVN nhóm: lấy thêm câu chưa phân khi buổi chọn TRỌN nhóm (mọi dạng bài) hoặc đã phải thêm mục chưa phân. Chọn lẻ vài
--     dạng bài thì KHÔNG lấy (câu chưa phân có thể thuộc dạng chưa dạy).

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
    select x.* from _tl_bdm_cau_vi_tri(_tl_bdm_khoi_nhom(p_nhom)) x
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
      left join dai_bdm_dang_bai db on db.id = v.dang_bai_id
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
begin
  perform _tl_bdm_kiem_buoi(p_tai_lieu, p_buoi);
  if jsonb_typeof(p_chon) is distinct from 'array' then raise exception 'p_chon phải là mảng.'; end if;

  -- Kiểm đầu vào: nhóm có thật, không trùng; dạng bài thuộc đúng nhóm, không trùng.
  if (select count(*) from jsonb_array_elements(p_chon) e) <> (select count(distinct e->>'nhom') from jsonb_array_elements(p_chon) e) then
    raise exception 'Một nhóm bị chọn 2 lần.' using errcode = 'P0001';
  end if;
  for r in select e->>'nhom' as nhom, coalesce(array(select jsonb_array_elements_text(e->'dang_bai')), '{}') as ds
             from jsonb_array_elements(p_chon) e loop
    if not exists (select 1 from dai_bdm_nhom n where n.id = r.nhom) then
      raise exception 'Nhóm % không có trên bản đồ.', r.nhom using errcode = 'P0001';
    end if;
    if cardinality(r.ds) <> (select count(distinct x) from unnest(r.ds) x) then
      raise exception 'Một dạng bài bị chọn 2 lần trong nhóm %.', r.nhom using errcode = 'P0001';
    end if;
    if exists (select 1 from unnest(r.ds) x where not exists (select 1 from dai_bdm_dang_bai db where db.id = x and db.nhom_id = r.nhom)) then
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

    v_ds_bd := array(select db.id from dai_bdm_dang_bai db where db.nhom_id = v_nhom);
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
