-- ============================================================================
-- 202611131807 — btvn_buoi_truoc_theo_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202611131755 tính "buổi trước / buổi trước nữa" theo thứ tự buổi TRONG CÙNG giáo trình gốc. Đo DB thật 13/11:
--   giáo trình bản đồ mới làm THEO LỚP và rất ngắn — 39 giáo trình Đại, trung vị 2 buổi, nhiều cái 1 buổi; 11/39 lớp dùng ≥ 2
--   giáo trình gốc trong 3 tuần (mỗi tuần mở một giáo trình mới) ⇒ buổi 1 của giáo trình mới KHÔNG có buổi trước, phần luyện lại
--   trống đúng ở chỗ cần nhất.
-- LUẬT MỚI — buổi trước của buổi N (lấy đủ 2, theo thứ tự):
--   ① các buổi CÓ NHÓM đứng trước nó trong chính giáo trình (gần nhất trước);
--   ② còn thiếu ⇒ các buổi lớp của giáo trình ĐÃ ĐƯỢC GÁN gần đây nhất từ giáo trình KHÁC (giáo trình buổi bản đồ mới, không
--      phải Hình, ngày gần nhất trước) — giáo trình không gắn lớp thì chỉ có ①.
--   Phần luyện lại vì thế có thể trỏ `lui_buoi` sang mốc buổi của giáo trình khác (FK tai_lieu_phan, on delete set null).
--   Câu luyện lại không được trùng: mọi câu của giáo trình này · mọi câu của buổi được luyện lại · mọi phần luyện lại (ở BẤT KỲ
--   giáo trình nào) của cùng buổi đó.
-- MẤT GÌ (Luật xoá): KHÔNG mất gì. Thêm 1 hàm, thay thân 5 hàm của mig 202611131755 (giữ chữ ký).
-- ============================================================================

-- ── 1. Hai buổi trước của một buổi ──────────────────────────────────────────────
create or replace function public._tl_bdm_buoi_truoc(p_tai_lieu uuid, p_buoi uuid)
returns table(bac integer, buoi uuid, tieu_de text, ngay date)
language sql stable security definer set search_path to 'public' as $$
  with x as (
    select p.id, p.thu_tu from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'buoi'
  ),
  trong as (
    select y.id, y.tieu_de, null::date as ngay, 0 as nguon, row_number() over (order by y.thu_tu desc, y.id desc) as o
      from tai_lieu_phan y cross join x
     where y.tai_lieu_id = p_tai_lieu and y.loai_phan = 'buoi' and (y.thu_tu, y.id) < (x.thu_tu, x.id)
       and exists (select 1 from tai_lieu_phan n where n.cha_id = y.id and n.loai_phan = 'nhom')
  ),
  ngoai as (
    select g.id, g.tieu_de, g.ngay, 1 as nguon, row_number() over (order by g.ngay desc, g.id desc) as o
      from (
        select b.id, b.tieu_de, max(d.ngay) as ngay
          from tai_lieu t
          join tai_lieu d on d.lop_id = t.lop_id and d.loai = 'giao_trinh_buoi' and d.ban_do = 'moi' and d.hoc_sinh_id is null
                         and coalesce(d.nhanh, '') <> 'hinh' and d.nguon_id is not null and d.nguon_id <> p_tai_lieu
          join tai_lieu_phan b on b.id = case when d.nguon_buoi ~ '^[0-9a-fA-F-]{36}$' then d.nguon_buoi::uuid end
                              and b.loai_phan = 'buoi'
         where t.id = p_tai_lieu and t.lop_id is not null and exists (select 1 from x)
           and exists (select 1 from tai_lieu_phan n where n.cha_id = b.id and n.loai_phan = 'nhom')
         group by b.id, b.tieu_de
      ) g
  )
  select (row_number() over (order by z.nguon, z.o))::int, z.id, z.tieu_de, z.ngay
    from (select * from trong union all select * from ngoai) z
   order by z.nguon, z.o
   limit 2
$$;

create or replace function public._tl_bdm_lui_bac(p_tai_lieu uuid, p_buoi uuid, p_lui_buoi uuid)
returns integer language sql stable security definer set search_path to 'public' as $$
  select t.bac from public._tl_bdm_buoi_truoc(p_tai_lieu, p_buoi) t where t.buoi = p_lui_buoi
$$;

-- ── 2. Khung BTVN của cả giáo trình ─────────────────────────────────────────────
-- { "tru":  [câu ô luyện lại không được chọn: mọi câu của giáo trình + của các buổi được luyện lại + phần luyện lại khác của các buổi đó],
--   "buoi": { "<buổi>": { "lui": [{bac, buoi, tieu_de, ngay (có = buổi của giáo trình khác, ngày lớp học), nhom:[{nhom, ten, dang_bai, phan_id, caus}]}],
--                         "le":  [{phan_id, nhom, ten, caus}] } } }
create or replace function public.fn_tl_bdm_btvn_khung(p_tai_lieu uuid)
returns jsonb language sql stable security definer set search_path to 'public' as $$
  with b as (
    select p.id, p.thu_tu from tai_lieu_phan p where p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'buoi' and la_thanh_vien()
  ),
  cap as materialized (
    select x.id as buoi, t.buoi as lui, t.tieu_de, t.bac, t.ngay
      from b x cross join lateral public._tl_bdm_buoi_truoc(p_tai_lieu, x.id) t
  ),
  lp as (
    select p.id, p.cha_id as buoi, p.lui_buoi, p.ref_ma as nhom, p.thu_tu,
           coalesce((select array_agg(tc.ma_cau order by tc.thu_tu, tc.id) from tai_lieu_cau tc where tc.phan_id = p.id), '{}') as caus
      from tai_lieu_phan p
     where p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'ontap_nhom' and p.lui_bac is not null
  ),
  ngoai as (select distinct c.lui from cap c where c.ngay is not null),
  o as (
    select c.buoi, c.bac, jsonb_build_object(
             'bac', c.bac, 'buoi', c.lui, 'tieu_de', c.tieu_de, 'ngay', c.ngay,
             'nhom', coalesce((
               select jsonb_agg(jsonb_build_object(
                        'nhom', n.ref_ma, 'ten', nv.ten,
                        'dang_bai', coalesce((select jsonb_agg(d.ref_ma order by d.thu_tu, d.id) from tai_lieu_phan d
                                               where d.cha_id = n.id and d.loai_phan = 'dang_bai'), '[]'::jsonb),
                        'phan_id', s.id, 'caus', coalesce(to_jsonb(s.caus), '[]'::jsonb)) order by n.thu_tu, n.id)
                 from tai_lieu_phan n
                 left join tl_bdm_nhom_v nv on nv.id = n.ref_ma
                 left join lateral (select k.id, k.caus from lp k
                                     where k.buoi = c.buoi and k.lui_buoi = c.lui and k.nhom = n.ref_ma
                                     order by k.thu_tu, k.id limit 1) s on true
                where n.cha_id = c.lui and n.loai_phan = 'nhom'), '[]'::jsonb)) as j
      from cap c
  )
  select jsonb_build_object(
    'tru', coalesce((
      select to_jsonb(array_agg(distinct z.ma_cau)) from (
        select tc.ma_cau from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id
         where p.tai_lieu_id = p_tai_lieu and la_thanh_vien()
        union all
        select unnest(public._tl_bdm_cau_da_dung(g.lui)) from ngoai g
        union all
        select tc.ma_cau from ngoai g
          join tai_lieu_phan k on k.lui_buoi = g.lui and k.loai_phan = 'ontap_nhom' and k.lui_bac is not null
          join tai_lieu_cau tc on tc.phan_id = k.id
      ) z), '[]'::jsonb),
    'buoi', (select coalesce(jsonb_object_agg(x.id, jsonb_build_object(
           'lui', coalesce((select jsonb_agg(o.j order by o.bac) from o where o.buoi = x.id), '[]'::jsonb),
           'le', coalesce((
             select jsonb_agg(jsonb_build_object('phan_id', k.id, 'nhom', k.nhom, 'ten', nv.ten, 'caus', to_jsonb(k.caus)) order by k.thu_tu, k.id)
               from lp k left join tl_bdm_nhom_v nv on nv.id = k.nhom
              where k.buoi = x.id
                and not exists (select 1 from cap c join tai_lieu_phan n on n.cha_id = c.lui and n.loai_phan = 'nhom' and n.ref_ma = k.nhom
                                 where c.buoi = x.id and c.lui = k.lui_buoi)), '[]'::jsonb))), '{}'::jsonb)
    from b x))
$$;

-- ── 3. Đặt câu cho MỘT ô luyện lại; danh sách rỗng = bỏ ô ───────────────────────
create or replace function public.fn_tl_bdm_dat_cau_lui(p_tai_lieu uuid, p_buoi uuid, p_lui_buoi uuid, p_nhom text, p_ma_caus text[])
returns void language plpgsql security definer set search_path to 'public' as $$
declare
  v_bac int; v_phan uuid; v_idx int; v_trung text[]; v_caus text[] := coalesce(p_ma_caus, '{}');
begin
  perform _tl_bdm_kiem_buoi(p_tai_lieu, p_buoi);
  select p.id into v_phan from tai_lieu_phan p
   where p.cha_id = p_buoi and p.loai_phan = 'ontap_nhom' and p.lui_bac is not null and p.lui_buoi = p_lui_buoi and p.ref_ma = p_nhom
   order by p.thu_tu, p.id limit 1;

  if cardinality(v_caus) = 0 then
    if v_phan is not null then
      delete from tai_lieu_phan where id = v_phan;   -- GV bỏ hết câu của ô ⇒ ô không còn (câu theo cascade phan_id)
      update tai_lieu set updated_at = now() where id = p_tai_lieu;
    end if;
    return;
  end if;

  v_bac := public._tl_bdm_lui_bac(p_tai_lieu, p_buoi, p_lui_buoi);
  if v_bac is null then raise exception 'Buổi được luyện lại phải là một trong hai buổi liền trước.' using errcode = 'P0001'; end if;
  select z.rn into v_idx from (
    select n.ref_ma, (row_number() over (order by n.thu_tu, n.id))::int as rn
      from tai_lieu_phan n where n.cha_id = p_lui_buoi and n.loai_phan = 'nhom') z
   where z.ref_ma = p_nhom limit 1;
  if v_idx is null then raise exception 'Nhóm này không thuộc buổi được luyện lại.' using errcode = 'P0001'; end if;

  if cardinality(v_caus) <> (select count(distinct x) from unnest(v_caus) x) then
    raise exception 'Danh sách có câu lặp.' using errcode = 'P0001';
  end if;
  v_trung := array(select x from unnest(v_caus) x where x = any (_tl_bdm_cau_da_dung(p_buoi, v_phan)));
  if cardinality(v_trung) > 0 then
    raise exception 'Câu đã dùng ở phần khác trong buổi: %', array_to_string(v_trung, ', ') using errcode = 'P0001';
  end if;
  v_trung := array(select x from unnest(v_caus) x where x = any (_tl_bdm_cau_da_dung(p_lui_buoi)));
  if cardinality(v_trung) > 0 then
    raise exception 'Câu đã có trong bài của chính buổi đó (học sinh đã làm): %', array_to_string(v_trung, ', ') using errcode = 'P0001';
  end if;
  v_trung := array(select x from unnest(v_caus) x where exists (
    select 1 from tai_lieu_phan k join tai_lieu_cau tc on tc.phan_id = k.id
     where k.id is distinct from v_phan and tc.ma_cau = x
       and (k.tai_lieu_id = p_tai_lieu
            or (k.loai_phan = 'ontap_nhom' and k.lui_bac is not null and k.lui_buoi = p_lui_buoi))));
  if cardinality(v_trung) > 0 then
    raise exception 'Câu đã có ở chỗ khác trong giáo trình hoặc đã dùng để luyện lại buổi đó (học sinh sẽ gặp 2 lần): %', array_to_string(v_trung, ', ') using errcode = 'P0001';
  end if;

  if v_phan is null then
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id, lui_bac, lui_buoi)
    values (p_tai_lieu, 900000 + v_bac * 1000 + v_idx, 'ontap_nhom', p_nhom, p_buoi, v_bac, p_lui_buoi) returning id into v_phan;
  else
    update tai_lieu_phan set lui_bac = v_bac where id = v_phan and lui_bac is distinct from v_bac;
  end if;
  perform _tl_bdm_ghi_cau(v_phan, v_caus);
  update tai_lieu set updated_at = now() where id = p_tai_lieu;
end $$;

-- ── 4. Gợi ý câu cho MỘT ô luyện lại rồi ghi luôn ───────────────────────────────
create or replace function public.fn_tl_bdm_lui_goi_y(p_tai_lieu uuid, p_buoi uuid, p_lui_buoi uuid, p_nhom text, p_so jsonb default null)
returns text[] language plpgsql security definer set search_path to 'public' as $$
declare v_bac int; v_ds text[]; v_tru text[]; v_cau text[]; v_so jsonb;
begin
  perform _tl_bdm_kiem_buoi(p_tai_lieu, p_buoi);
  v_bac := public._tl_bdm_lui_bac(p_tai_lieu, p_buoi, p_lui_buoi);
  if v_bac is null then raise exception 'Buổi được luyện lại phải là một trong hai buổi liền trước.' using errcode = 'P0001'; end if;
  v_ds := array(select d.ref_ma from tai_lieu_phan n join tai_lieu_phan d on d.cha_id = n.id and d.loai_phan = 'dang_bai'
                 where n.cha_id = p_lui_buoi and n.loai_phan = 'nhom' and n.ref_ma = p_nhom order by d.thu_tu, d.id);
  -- né: MỌI câu của giáo trình này (kể cả bộ đang có ở ô này ⇒ ra bộ khác) · mọi câu của buổi được luyện lại (có thể ở giáo trình khác)
  --     · mọi phần luyện lại của cùng buổi đó ở bất kỳ giáo trình nào
  v_tru := coalesce((select array_agg(distinct tc.ma_cau) from tai_lieu_phan k join tai_lieu_cau tc on tc.phan_id = k.id
                      where k.tai_lieu_id = p_tai_lieu), '{}')
        || _tl_bdm_cau_da_dung(p_lui_buoi)
        || coalesce((select array_agg(tc.ma_cau) from tai_lieu_phan k join tai_lieu_cau tc on tc.phan_id = k.id
                      where k.loai_phan = 'ontap_nhom' and k.lui_bac is not null and k.lui_buoi = p_lui_buoi), '{}');
  v_so := coalesce(p_so, case v_bac when 1 then '{"_tong": 3, "trac_nghiem": 1, "tra_loi_ngan": 1, "tu_luan": 1}'::jsonb
                                    else '{"_tong": 2, "trac_nghiem": 1, "tu_luan": 1}'::jsonb end);
  v_cau := fn_tl_bdm_goi_y(p_nhom, case when cardinality(v_ds) = 0 then null else v_ds end, v_so, v_tru);
  if cardinality(coalesce(v_cau, '{}')) = 0 then return '{}'; end if;   -- hết câu khác ⇒ giữ bộ đang có
  perform public.fn_tl_bdm_dat_cau_lui(p_tai_lieu, p_buoi, p_lui_buoi, p_nhom, v_cau);
  return v_cau;
end $$;

-- ── 5. Gợi ý cho MỌI ô luyện lại còn trống của một buổi ─────────────────────────
create or replace function public.fn_tl_bdm_lui_goi_y_buoi(p_tai_lieu uuid, p_buoi uuid)
returns integer language plpgsql security definer set search_path to 'public' as $$
declare r record; v_n int := 0;
begin
  perform _tl_bdm_kiem_buoi(p_tai_lieu, p_buoi);
  for r in
    select t.buoi as lui, n.ref_ma as nhom
      from public._tl_bdm_buoi_truoc(p_tai_lieu, p_buoi) t
      join tai_lieu_phan n on n.cha_id = t.buoi and n.loai_phan = 'nhom'
     where not exists (select 1 from tai_lieu_phan k where k.cha_id = p_buoi and k.loai_phan = 'ontap_nhom' and k.lui_bac is not null
                          and k.lui_buoi = t.buoi and k.ref_ma = n.ref_ma)
     order by t.bac, n.thu_tu, n.id
  loop
    if cardinality(public.fn_tl_bdm_lui_goi_y(p_tai_lieu, p_buoi, r.lui, r.nhom, null)) > 0 then v_n := v_n + 1; end if;
  end loop;
  return v_n;
end $$;

revoke all on function public._tl_bdm_buoi_truoc(uuid, uuid) from public, anon, authenticated;
grant execute on function public._tl_bdm_buoi_truoc(uuid, uuid) to service_role;
