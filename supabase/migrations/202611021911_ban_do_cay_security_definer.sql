-- ============================================================================
-- 202611021911_ban_do_cay_security_definer
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 02/11 "click vào bản đồ: Không tải được bản đồ mới: canceling statement due to statement timeout". Đo bằng phiên app thật
--   (role authenticated, trần 8s): fn_bdm_cay K8 7,5s · K11 7,6s · K10 5,0s · fn_khtn_bdm_cay K7 9,2s (quá trần) — cùng hàm chạy bằng
--   quyền chủ bảng chỉ 0,2–1,9s. Chênh = RLS: policy la_thanh_vien() (security definer, không inline được) chạy lại cho TỪNG DÒNG của mọi
--   bảng hàm cây đọc (dai_cau_hoi, hgt_cau_hoi, khtn_cau_hoi, bảng gán câu…). Sửa: 2 hàm cây chạy security definer + kiểm nhân sự MỘT lần
--   (where la_thanh_vien() ở câu select cuối ⇒ người ngoài nhận NULL) — như fn_bdm_kho_cau. Thân hàm lấy NGUYÊN từ DB, chỉ đổi phần quyền.
--
-- MẤT GÌ (Luật xoá): Không mất gì — chỉ đổi thuộc tính quyền + thêm điều kiện nhân sự cho 2 hàm đọc.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_bdm_cay(p_khoi text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with dc as materialized (
    select coalesce(array_agg(b.ma_dang), '{}') as ds from dai_ban_do b where b.khoi = p_khoi
  ),
  cg as materialized (
    select * from _bdm_cau_giai((select array(select unnest(ds) union select unnest(_bdm_dang_cu_cua_khoi(p_khoi))) from dc))
  ),
  du as materialized (
    select d.*, b.ten_dang from dai_bdm_doi_ung d join dai_ban_do b on b.ma_dang = d.ma_dang_cu
  ),
  -- bảng tra đếm (1 lần cho cả khối)
  dem_db as materialized (
    select x.dang_bai_id, count(*) as n from (
      select cg.dang_bai_id from cg where cg.dang_bai_id is not null
      union all   -- kho HGT (mig 202610181900): câu gốc đã gán + bản sao đi theo gốc
      select g.dang_bai_id from hgt_bdm_gan_cau g join hgt_cau_hoi h on h.ma_cau = g.ma_cau and h.xoa_at is null and h.loai_cau <> 'dung_sai'
      union all
      select g.dang_bai_id from hgt_bdm_gan_cau g join hgt_cau_hoi h on h.parent_ma_cau = g.ma_cau and h.xoa_at is null and h.loai_cau <> 'dung_sai'
    ) x group by 1),
  cg0 as materialized (select cg.ma_dang_cu, count(*) as n from cg where cg.dang_bai_id is null group by 1),
  dem_nhom as materialized (
    select du.dich_nhom, sum(cg0.n)::bigint as n from du join cg0 on cg0.ma_dang_cu = du.ma_dang_cu
     where du.dich_nhom is not null group by 1),
  dem_o as materialized (
    select du.dich_chu_de, du.dich_chuyen_de, sum(cg0.n)::bigint as n from du join cg0 on cg0.ma_dang_cu = du.ma_dang_cu
     where du.dich_chu_de is not null group by 1, 2),
  cu_db as materialized (
    select du.dich_dang_bai as k, jsonb_agg(jsonb_build_object('ma', du.ma_dang_cu, 'ten', du.ten_dang) order by du.ma_dang_cu) as ds
      from du where du.dich_dang_bai is not null group by 1),
  cu_nhom as materialized (
    select du.dich_nhom as k, jsonb_agg(jsonb_build_object('ma', du.ma_dang_cu, 'ten', du.ten_dang) order by du.ma_dang_cu) as ds
      from du where du.dich_nhom is not null group by 1),
  cu_o as materialized (
    select du.dich_chu_de as cd, du.dich_chuyen_de as ch, jsonb_agg(jsonb_build_object('ma', du.ma_dang_cu, 'ten', du.ten_dang) order by du.ma_dang_cu) as ds
      from du where du.dich_chu_de is not null group by 1, 2),
  so_cd as materialized (select o.chuyen_de_id, count(*) as n from dai_bdm_o o group by 1),
  td as materialized (select e.nhom_id, jsonb_agg(e.tien_de_nhom_id order by e.tien_de_nhom_id) as ds from dai_bdm_nhom_tien_de e group by 1),
  chua_gan_khoi as materialized (
    select not exists (select 1 from dai_bdm_doi_ung d where d.ma_dang_cu = b.ma_dang) as chua_gan, b.ma_dang
      from dai_ban_do b where b.khoi = p_khoi)
  select jsonb_build_object(
    'chu_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cd.id, 'ten', cd.ten, 'thu_tu', cd.thu_tu, 'nhanh', cd.nhanh,
        'so_ds', (select count(*) from dai_bdm_kho_ds k join dai_cau_hoi q on q.ma_cau = k.ma_cau and q.xoa_at is null where k.chu_de_id = cd.id)
               + (select count(*) from hgt_bdm_kho_ds k join hgt_cau_hoi q on q.ma_cau = k.ma_cau and q.xoa_at is null where k.chu_de_id = cd.id),
        'o', coalesce((
          select jsonb_agg(jsonb_build_object(
            'chuyen_de_id', ch.id, 'ten', ch.ten, 'mo_ta', ch.mo_ta, 'thu_tu', o.thu_tu, 'so', o.so,
            'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
            'cung_co_o', coalesce((
              select jsonb_agg(jsonb_build_object('chu_de_id', c2.id, 'ten', c2.ten, 'khoi', c2.khoi) order by c2.khoi, c2.thu_tu)
                from dai_bdm_o o3 join dai_bdm_chu_de c2 on c2.id = o3.chu_de_id
               where o3.chuyen_de_id = ch.id and o3.chu_de_id <> cd.id), '[]'::jsonb),
            'dang_cu', coalesce((select ds from cu_o where cu_o.cd = cd.id and cu_o.ch = ch.id), '[]'::jsonb),
            'chua_gan', coalesce((select n from dem_o where dem_o.dich_chu_de = cd.id and dem_o.dich_chuyen_de = ch.id), 0),
            'nhom', coalesce((
              select jsonb_agg(jsonb_build_object(
                'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'thu_tu', n.thu_tu, 'so', s.so, 'tang', s.tang,
                'co_ly_thuyet', (btrim(n.ly_thuyet) <> '' or n.ly_thuyet_file_url is not null),
                'tien_de', coalesce((select ds from td where td.nhom_id = n.id), '[]'::jsonb),
                'dang_cu', coalesce((select ds from cu_nhom where cu_nhom.k = n.id), '[]'::jsonb),
                'chua_gan', coalesce((select dn.n from dem_nhom dn where dn.dich_nhom = n.id), 0),
                'dang_bai', coalesce((
                  select jsonb_agg(jsonb_build_object(
                    'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'thu_tu', d.thu_tu, 'so', d.so,
                    'co_ly_thuyet', (btrim(d.ly_thuyet) <> '' or d.ly_thuyet_file_url is not null),
                    'co_vi_du', (btrim(d.vi_du) <> '' or d.vi_du_file_url is not null),
                    'so_cau', coalesce((select dd.n from dem_db dd where dd.dang_bai_id = d.id), 0),
                    'dang_cu', coalesce((select ds from cu_db where cu_db.k = d.id), '[]'::jsonb)
                  ) order by d.so)
                  from (select d0.*, row_number() over (order by d0.thu_tu, d0.id) so
                          from dai_bdm_dang_bai d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
              ) order by s.so)
              from dai_bdm_nhom n join _bdm_so_nhom(cd.id, ch.id) s on s.id = n.id), '[]'::jsonb)
          ) order by o.so)
          from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) so
                  from dai_bdm_o o0 where o0.chu_de_id = cd.id) o
          join dai_bdm_chuyen_de ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
      ) order by cd.thu_tu, cd.id)
      from dai_bdm_chu_de cd where cd.khoi = p_khoi and (p_nhanh is null or cd.nhanh = p_nhanh)), '[]'::jsonb),
    'chuyen_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ch.id, 'ten', ch.ten,
        'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
        'khoi', (select coalesce(jsonb_agg(distinct cd.khoi), '[]'::jsonb)
                   from dai_bdm_o o join dai_bdm_chu_de cd on cd.id = o.chu_de_id where o.chuyen_de_id = ch.id)
      ) order by ch.ten)
      from dai_bdm_chuyen_de ch), '[]'::jsonb),
    'so_chu_de_theo_khoi', coalesce((
      select jsonb_object_agg(khoi, n) from (select khoi, count(*) n from dai_bdm_chu_de where p_nhanh is null or nhanh = p_nhanh group by khoi) x), '{}'::jsonb),
    'tong', jsonb_build_object(
      'dang_cu', (select cardinality(ds) from dc),
      'dang_cu_chua_gan', (select count(*) from chua_gan_khoi where chua_gan),
      'cau_dang_cu_chua_gan', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu where k.chua_gan),
      'cau', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu),
      'cau_chua_gan', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu where cg.dang_bai_id is null)
    )
  )
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$;

CREATE OR REPLACE FUNCTION public.fn_khtn_bdm_cay(p_khoi text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with dem_db as materialized (
    select g.dang_bai_id, count(*) n from khtn_bdm_gan_cau g join khtn_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null group by 1
  ),
  chua as materialized (   -- câu còn sống chưa phân, theo nhóm (dạng cũ = nhóm.ma_cu)
    select n.id nhom_id, n.chu_de_id, n.chuyen_de_id, count(*) n
      from khtn_cau_hoi q join khtn_bdm_nhom n on n.ma_cu = q.dang_chinh
     where q.xoa_at is null and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = q.ma_cau)
     group by 1, 2, 3
  ),
  so_cd as materialized (select o.chuyen_de_id, count(*) n from khtn_bdm_o o group by 1),
  td as materialized (select e.nhom_id, jsonb_agg(e.tien_de_nhom_id order by e.tien_de_nhom_id) ds from khtn_bdm_nhom_tien_de e group by 1),
  cho as materialized (   -- câu ở dạng chờ / dạng cũ không còn nhóm (chưa khớp) của khối
    select count(*) n from khtn_cau_hoi q join khtn_ban_do b on b.ma_dang = q.dang_chinh
     where b.khoi = p_khoi and q.xoa_at is null and not exists (select 1 from khtn_bdm_nhom n where n.ma_cu = q.dang_chinh)
  )
  select jsonb_build_object(
    'chu_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cd.id, 'ten', cd.ten, 'thu_tu', cd.thu_tu, 'nhanh', 'khtn', 'so_ds', 0,
        'o', coalesce((
          select jsonb_agg(jsonb_build_object(
            'chuyen_de_id', ch.id, 'ten', ch.ten, 'mo_ta', ch.mo_ta, 'thu_tu', o.thu_tu, 'so', o.so,
            'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
            'cung_co_o', coalesce((
              select jsonb_agg(jsonb_build_object('chu_de_id', c2.id, 'ten', c2.ten, 'khoi', c2.khoi) order by c2.khoi, c2.thu_tu)
                from khtn_bdm_o o3 join khtn_bdm_chu_de c2 on c2.id = o3.chu_de_id
               where o3.chuyen_de_id = ch.id and o3.chu_de_id <> cd.id), '[]'::jsonb),
            'dang_cu', '[]'::jsonb,
            'chua_gan', coalesce((select sum(x.n) from chua x where x.chu_de_id = cd.id and x.chuyen_de_id = ch.id), 0),
            'nhom', coalesce((
              select jsonb_agg(jsonb_build_object(
                'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'thu_tu', n.thu_tu, 'so', n.so, 'tang', 0,
                'co_ly_thuyet', (btrim(n.ly_thuyet) <> '' or n.ly_thuyet_file_url is not null),
                'tien_de', coalesce((select ds from td where td.nhom_id = n.id), '[]'::jsonb),
                'dang_cu', '[]'::jsonb,
                'chua_gan', coalesce((select x.n from chua x where x.nhom_id = n.id), 0),
                'dang_bai', coalesce((
                  select jsonb_agg(jsonb_build_object(
                    'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'thu_tu', d.thu_tu, 'so', d.so,
                    'co_ly_thuyet', (btrim(d.ly_thuyet) <> '' or d.ly_thuyet_file_url is not null),
                    'co_vi_du', (btrim(d.vi_du) <> '' or d.vi_du_file_url is not null),
                    'so_cau', coalesce((select dd.n from dem_db dd where dd.dang_bai_id = d.id), 0),
                    'dang_cu', '[]'::jsonb
                  ) order by d.so)
                  from (select d0.*, row_number() over (order by d0.thu_tu, d0.id) so from khtn_bdm_dang_bai d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
              ) order by n.so)
              from (select n0.*, row_number() over (order by n0.thu_tu, n0.id) so
                      from khtn_bdm_nhom n0 where n0.chu_de_id = cd.id and n0.chuyen_de_id = ch.id) n), '[]'::jsonb)
          ) order by o.so)
          from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) so from khtn_bdm_o o0 where o0.chu_de_id = cd.id) o
          join khtn_bdm_chuyen_de ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
      ) order by cd.thu_tu, cd.id)
      from khtn_bdm_chu_de cd where cd.khoi = p_khoi), '[]'::jsonb),
    'chuyen_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ch.id, 'ten', ch.ten,
        'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
        'khoi', (select coalesce(jsonb_agg(distinct cd.khoi), '[]'::jsonb) from khtn_bdm_o o join khtn_bdm_chu_de cd on cd.id = o.chu_de_id where o.chuyen_de_id = ch.id)
      ) order by ch.ten)
      from khtn_bdm_chuyen_de ch), '[]'::jsonb),
    'so_chu_de_theo_khoi', coalesce((select jsonb_object_agg(khoi, n) from (select khoi, count(*) n from khtn_bdm_chu_de group by khoi) x), '{}'::jsonb),
    'tong', jsonb_build_object('dang_cu', 0, 'dang_cu_chua_gan', 0, 'cau_dang_cu_chua_gan', 0,
      'cau', (select count(*) from khtn_cau_hoi q join khtn_ban_do b on b.ma_dang = q.dang_chinh where b.khoi = p_khoi and q.xoa_at is null),
      'cau_chua_gan', (select coalesce(sum(x.n), 0) from chua x join khtn_bdm_chu_de cd on cd.id = x.chu_de_id where cd.khoi = p_khoi),
      'cau_chua_khop', (select n from cho))
  )
  where public.la_thanh_vien()   -- kiểm nhân sự 1 lần (thay RLS chạy từng dòng)
$function$;

revoke execute on function fn_bdm_cay(text, text), fn_khtn_bdm_cay(text, text) from public, anon;
grant execute on function fn_bdm_cay(text, text), fn_khtn_bdm_cay(text, text) to authenticated;
