-- ════════════════════════════════════════════════════════════════════════════
-- BẢN ĐỒ MỚI — DẠNG BÀI (tầng 4) có CẢ lý thuyết LẪN ví dụ, 2 ô riêng (CEO 08/10)
-- + fn_bdm_cay trả co_ly_thuyet cho dạng bài · nâng/hạ tầng giữ đủ nội dung (không mất ô nào)
-- ════════════════════════════════════════════════════════════════════════════
alter table dai_bdm_dang_bai
  add column ly_thuyet          text not null default '',
  add column ly_thuyet_file_url text,      -- NULL = không có đính kèm (không áp dụng)
  add column ly_thuyet_ten_file text;

-- NÂNG dạng bài → nhóm: lý thuyết dạng bài → lý thuyết nhóm; ví dụ (nếu có) NỐI vào cuối lý thuyết nhóm
-- (nhóm không có ô ví dụ — nối để không mất nội dung, CEO tự chỉnh lại).
create or replace function fn_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text)
returns text language plpgsql as $$
declare
  d dai_bdm_dang_bai;
  v_nhom text;
  v_lt text;
begin
  select * into d from dai_bdm_dang_bai where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if exists (select 1 from dai_bdm_gan_cau where dang_bai_id = p_id) or exists (select 1 from dai_bdm_doi_ung_cum where dang_bai_id = p_id) then
    raise exception 'Dạng bài «%» đang có câu/cụm được gán — chuyển hoặc gỡ gán trước rồi mới nâng', d.ten;
  end if;
  v_lt := case
    when btrim(d.vi_du) = '' then d.ly_thuyet
    when btrim(d.ly_thuyet) = '' then d.vi_du
    else d.ly_thuyet || chr(10) || chr(10) || '**Ví dụ**' || chr(10) || chr(10) || d.vi_du end;
  insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file)
  values (p_chu_de_id, p_chuyen_de_id, d.ten, d.mo_ta, v_lt,
          coalesce(d.ly_thuyet_file_url, d.vi_du_file_url), coalesce(d.ly_thuyet_ten_file, d.vi_du_ten_file))
  returning id into v_nhom;
  update dai_bdm_doi_ung set dich_dang_bai = null, dich_nhom = v_nhom where dich_dang_bai = p_id;
  delete from dai_bdm_dang_bai where id = p_id;
  return v_nhom;
end $$;

-- HẠ nhóm → dạng bài: lý thuyết nhóm → LÝ THUYẾT dạng bài (trước đây vào ví dụ vì tầng 4 chưa có ô lý thuyết)
create or replace function fn_bdm_ha_nhom(p_id text, p_nhom_dich text)
returns text language plpgsql as $$
declare
  n dai_bdm_nhom;
  v_db text;
begin
  if p_id = p_nhom_dich then raise exception 'Không thể hạ nhóm vào chính nó'; end if;
  select * into n from dai_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if exists (select 1 from dai_bdm_dang_bai where nhom_id = p_id) then
    raise exception 'Nhóm «%» còn dạng bài bên trong — chuyển các dạng bài đi trước rồi mới hạ', n.ten;
  end if;
  if exists (select 1 from dai_bdm_nhom_tien_de where nhom_id = p_id or tien_de_nhom_id = p_id) then
    raise exception 'Nhóm «%» còn mũi tên tiền đề — gỡ mũi tên trước rồi mới hạ', n.ten;
  end if;
  insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file)
  values (p_nhom_dich, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.ly_thuyet_ten_file)
  returning id into v_db;
  update dai_bdm_doi_ung set dich_nhom = null, dich_dang_bai = v_db where dich_nhom = p_id;
  delete from dai_bdm_nhom where id = p_id;
  return v_db;
end $$;

-- Cây — thêm co_ly_thuyet cho dạng bài (phần còn lại y hệt mig 202610081354)
create or replace function fn_bdm_cay(p_khoi text) returns jsonb
language sql stable as $$
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
  dem_db as materialized (select cg.dang_bai_id, count(*) as n from cg where cg.dang_bai_id is not null group by 1),
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
        'id', cd.id, 'ten', cd.ten, 'thu_tu', cd.thu_tu,
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
      from dai_bdm_chu_de cd where cd.khoi = p_khoi), '[]'::jsonb),
    'chuyen_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ch.id, 'ten', ch.ten,
        'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
        'khoi', (select coalesce(jsonb_agg(distinct cd.khoi), '[]'::jsonb)
                   from dai_bdm_o o join dai_bdm_chu_de cd on cd.id = o.chu_de_id where o.chuyen_de_id = ch.id)
      ) order by ch.ten)
      from dai_bdm_chuyen_de ch), '[]'::jsonb),
    'so_chu_de_theo_khoi', coalesce((
      select jsonb_object_agg(khoi, n) from (select khoi, count(*) n from dai_bdm_chu_de group by khoi) x), '{}'::jsonb),
    'tong', jsonb_build_object(
      'dang_cu', (select cardinality(ds) from dc),
      'dang_cu_chua_gan', (select count(*) from chua_gan_khoi where chua_gan),
      'cau_dang_cu_chua_gan', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu where k.chua_gan),
      'cau', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu),
      'cau_chua_gan', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu where cg.dang_bai_id is null)
    )
  )
$$;
