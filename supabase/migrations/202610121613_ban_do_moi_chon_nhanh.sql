-- ============================================================================
-- BẢN ĐỒ MỚI: CHỌN NHÁNH Đại · Hình giải tích · Hình (Thùy 12/10: "Bản đồ mới chưa cho chọn phần
-- Đại - Hình giải tích - Hình"). Toán = 3 nhánh kho (KHO_MON trong api.ts): 'toan' (Đại) · 'hgt' · 'hinh'.
--
-- Cấu trúc 4 tầng (chủ đề · chuyên đề · nhóm · dạng bài) dùng chung 5 bảng nháp dai_bdm_* — tên "dai_"
-- là lịch sử; mỗi chủ đề / chuyên đề giờ thuộc đúng 1 nhánh (cột nhanh). Nhóm + dạng bài đi theo chủ đề nên
-- tự thuộc nhánh. CHỈ phần đụng CÂU còn riêng Đại (gán câu, đối ứng dạng cũ, rổ chưa khớp → dai_cau_hoi /
-- dai_ban_do); nhánh hgt/hinh làm bảng gán câu riêng ở đợt sau (§1.6: câu mỗi nhánh 1 bảng).
--
-- Chỉ cộng: 2 cột (mặc định 'toan' ⇒ mọi dòng hiện có là Đại) + 1 trigger chặn ô nối chủ đề ↔ chuyên đề
-- khác nhánh + fn_bdm_cay thêm p_nhanh (mặc định 'toan' ⇒ client cũ chạy y nguyên).
-- ============================================================================
alter table public.dai_bdm_chu_de
  add column if not exists nhanh text not null default 'toan' check (nhanh in ('toan', 'hgt', 'hinh'));
alter table public.dai_bdm_chuyen_de
  add column if not exists nhanh text not null default 'toan' check (nhanh in ('toan', 'hgt', 'hinh'));

create or replace function public._bdm_o_cung_nhanh() returns trigger
 language plpgsql
as $f$
declare a text; b text;
begin
  select nhanh into a from public.dai_bdm_chu_de where id = new.chu_de_id;
  select nhanh into b from public.dai_bdm_chuyen_de where id = new.chuyen_de_id;
  if a is distinct from b then
    raise exception 'Chủ đề (nhánh %) và chuyên đề (nhánh %) khác nhánh — không nối được', a, b;
  end if;
  return new;
end $f$;

drop trigger if exists trg_bdm_o_cung_nhanh on public.dai_bdm_o;
create trigger trg_bdm_o_cung_nhanh before insert or update of chu_de_id, chuyen_de_id on public.dai_bdm_o
  for each row execute function public._bdm_o_cung_nhanh();

drop function if exists public.fn_bdm_cay(text);

CREATE FUNCTION public.fn_bdm_cay(p_khoi text, p_nhanh text DEFAULT 'toan'::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with dc as materialized (
    select coalesce(array_agg(b.ma_dang), '{}') as ds from dai_ban_do b where b.khoi = p_khoi and p_nhanh = 'toan'
  ),
  cg as materialized (
    select * from _bdm_cau_giai((select array(select unnest(ds) union select unnest(case when p_nhanh = 'toan' then _bdm_dang_cu_cua_khoi(p_khoi) else '{}'::text[] end)) from dc))
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
      from dai_ban_do b where b.khoi = p_khoi and p_nhanh = 'toan')
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
      from dai_bdm_chu_de cd where cd.khoi = p_khoi and cd.nhanh = p_nhanh), '[]'::jsonb),
    'chuyen_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ch.id, 'ten', ch.ten,
        'so_chu_de', coalesce((select n from so_cd where so_cd.chuyen_de_id = ch.id), 0),
        'khoi', (select coalesce(jsonb_agg(distinct cd.khoi), '[]'::jsonb)
                   from dai_bdm_o o join dai_bdm_chu_de cd on cd.id = o.chu_de_id where o.chuyen_de_id = ch.id)
      ) order by ch.ten)
      from dai_bdm_chuyen_de ch where ch.nhanh = p_nhanh), '[]'::jsonb),
    'so_chu_de_theo_khoi', coalesce((
      select jsonb_object_agg(khoi, n) from (select khoi, count(*) n from dai_bdm_chu_de where nhanh = p_nhanh group by khoi) x), '{}'::jsonb),
    'tong', jsonb_build_object(
      'dang_cu', (select cardinality(ds) from dc),
      'dang_cu_chua_gan', (select count(*) from chua_gan_khoi where chua_gan),
      'cau_dang_cu_chua_gan', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu where k.chua_gan),
      'cau', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu),
      'cau_chua_gan', (select count(*) from cg join chua_gan_khoi k on k.ma_dang = cg.ma_dang_cu where cg.dang_bai_id is null)
    )
  )
$function$
;

revoke all on function public.fn_bdm_cay(text, text) from public, anon;
grant execute on function public.fn_bdm_cay(text, text) to authenticated;
