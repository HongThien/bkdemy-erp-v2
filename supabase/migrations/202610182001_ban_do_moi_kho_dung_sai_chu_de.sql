-- ============================================================================
-- KHO ĐÚNG/SAI CẤP CHỦ ĐỀ — Thùy 18/10: "Đúng sai gồm 4 mệnh đề ứng với 4 dạng nên không đưa vào kho dạng,
-- mà đưa vào kho của chủ đề — vì nó không thuộc chuyên đề nào".
--   dai_bdm_kho_ds / hgt_bdm_kho_ds (ma_cau PK → câu GỐC Đ/S, chu_de_id) = câu thuộc chủ đề nào.
--   Trigger _bdm_cam_dung_sai: câu Đ/S KHÔNG được vào gan_cau / de_xuat / cau_thieu_dang / cau_chua_khop (cấp câu).
--   _bdm_cau_giai bỏ loại dung_sai ⇒ mọi số đếm dạng bài / nhóm / ô / tiến độ nguồn không còn cộng Đ/S.
--   fn_bdm_kho_cau thêm p_loai 'dung_sai' (id = chủ đề); fn_bdm_cay trả 'so_ds' mỗi chủ đề.
--   Dạng của TỪNG Ý vẫn ở dai_cau_menh_de.dang_chinh (bản đồ cũ) — gán dạng bài mới theo ý là việc sau.
-- KHÔNG xoá dòng gán/đề xuất cũ của Đ/S (chờ CEO gật): chúng nằm im, các hàm đọc đã bỏ qua.
-- ============================================================================

create table if not exists public.dai_bdm_kho_ds (
  ma_cau    text primary key references public.dai_cau_hoi(ma_cau),
  chu_de_id text not null references public.dai_bdm_chu_de(id),
  nguon     text not null default 'ai' check (nguon in ('nguoi', 'ai')),
  actor     uuid default public.jwt_uid(),
  at        timestamptz not null default now()
);
create index if not exists dai_bdm_kho_ds_cd_idx on public.dai_bdm_kho_ds (chu_de_id);
create table if not exists public.hgt_bdm_kho_ds (
  ma_cau    text primary key references public.hgt_cau_hoi(ma_cau),
  chu_de_id text not null references public.dai_bdm_chu_de(id),
  nguon     text not null default 'ai' check (nguon in ('nguoi', 'ai')),
  actor     uuid default public.jwt_uid(),
  at        timestamptz not null default now()
);
create index if not exists hgt_bdm_kho_ds_cd_idx on public.hgt_bdm_kho_ds (chu_de_id);
do $b$
declare x text;
begin
  foreach x in array array['dai_bdm_kho_ds', 'hgt_bdm_kho_ds'] loop
    execute format('alter table public.%I enable row level security', x);
    execute format('revoke all on public.%I from public, anon', x);
    execute format('grant select, insert, update, delete on public.%I to authenticated', x);
    execute format('drop policy if exists %I on public.%I', x || '_member_all', x);
    execute format('create policy %I on public.%I for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien())', x || '_member_all', x);
    execute format('drop trigger if exists trg_%s_log on public.%I', x, x);
    execute format('create trigger trg_%s_log after insert or update or delete on public.%I for each row execute function public._bdm_ghi_log()', x, x);
  end loop;
end $b$;

-- Chặn câu Đ/S vào kho dạng ở cấp câu (rào ở DB, không dựa vào script nhớ lọc).
create or replace function public._bdm_cam_dung_sai() returns trigger
language plpgsql as $f$
declare v boolean;
begin
  if tg_table_name like 'hgt\_%' then
    select exists (select 1 from public.hgt_cau_hoi where ma_cau = new.ma_cau and loai_cau = 'dung_sai') into v;
  else
    select exists (select 1 from public.dai_cau_hoi where ma_cau = new.ma_cau and loai_cau = 'dung_sai') into v;
  end if;
  if v then
    raise exception 'Câu Đúng/Sai % không vào kho dạng bài (4 ý ứng 4 dạng) — dùng kho Đúng/Sai của chủ đề', new.ma_cau;
  end if;
  return new;
end $f$;
do $b$
declare x text;
begin
  foreach x in array array['dai_bdm_gan_cau', 'dai_bdm_de_xuat', 'dai_bdm_cau_thieu_dang', 'dai_bdm_cau_chua_khop',
                           'hgt_bdm_gan_cau', 'hgt_bdm_de_xuat', 'hgt_bdm_cau_thieu_dang'] loop
    execute format('drop trigger if exists trg_%s_cam_ds on public.%I', x, x);
    execute format('create trigger trg_%s_cam_ds before insert on public.%I for each row execute function public._bdm_cam_dung_sai()', x, x);
  end loop;
end $b$;

-- Đưa câu Đ/S GỐC đang nằm trong bản đồ mới sang kho Đ/S của chủ đề (làm TRƯỚC khi đổi _bdm_cau_giai).
-- Thứ tự tin: đã gán > đề xuất > thiếu dạng > chưa khớp > đối ứng bản đồ cũ.
insert into public.dai_bdm_kho_ds (ma_cau, chu_de_id, nguon)
select distinct on (x.ma_cau) x.ma_cau, x.chu_de_id, 'ai'
  from (
    select g.ma_cau, n.chu_de_id, 1 as pri from public.dai_bdm_gan_cau g
      join public.dai_bdm_dang_bai d on d.id = g.dang_bai_id join public.dai_bdm_nhom n on n.id = d.nhom_id
    union all
    select e.ma_cau, n.chu_de_id, 2 from public.dai_bdm_de_xuat e
      join public.dai_bdm_dang_bai d on d.id = e.dang_bai_id join public.dai_bdm_nhom n on n.id = d.nhom_id
    union all
    select ma_cau, chu_de_id, 3 from public.dai_bdm_cau_thieu_dang where chu_de_id is not null
    union all
    select ma_cau, chu_de_id, 4 from public.dai_bdm_cau_chua_khop
    union all
    select cg.ma_cau, n.chu_de_id, 5 from public._bdm_cau_giai(array(select ma_dang from public.dai_ban_do)) cg
      join public.dai_bdm_dang_bai d on d.id = cg.dang_bai_id join public.dai_bdm_nhom n on n.id = d.nhom_id
     where cg.la_goc
  ) x
  join public.dai_cau_hoi c on c.ma_cau = x.ma_cau and c.loai_cau = 'dung_sai' and c.xoa_at is null and c.parent_ma_cau is null
 order by x.ma_cau, x.pri
on conflict (ma_cau) do nothing;

insert into public.hgt_bdm_kho_ds (ma_cau, chu_de_id, nguon)
select distinct on (x.ma_cau) x.ma_cau, x.chu_de_id, 'ai'
  from (
    select g.ma_cau, n.chu_de_id, 1 as pri from public.hgt_bdm_gan_cau g
      join public.dai_bdm_dang_bai d on d.id = g.dang_bai_id join public.dai_bdm_nhom n on n.id = d.nhom_id
    union all
    select e.ma_cau, n.chu_de_id, 2 from public.hgt_bdm_de_xuat e
      join public.dai_bdm_dang_bai d on d.id = e.dang_bai_id join public.dai_bdm_nhom n on n.id = d.nhom_id
    union all
    select ma_cau, chu_de_id, 3 from public.hgt_bdm_cau_thieu_dang where chu_de_id is not null
  ) x
  join public.hgt_cau_hoi c on c.ma_cau = x.ma_cau and c.loai_cau = 'dung_sai' and c.xoa_at is null and c.parent_ma_cau is null
 order by x.ma_cau, x.pri
on conflict (ma_cau) do nothing;

CREATE OR REPLACE FUNCTION public._bdm_cau_giai(p_dang_cu text[])
 RETURNS TABLE(ma_cau text, goc text, la_goc boolean, ma_dang_cu text, ma_cum_cu text, dang_bai_id text, nguon text)
 LANGUAGE sql
 STABLE
AS $function$
  with q as (
    select c.ma_cau, coalesce(c.parent_ma_cau, c.ma_cau) as goc, c.parent_ma_cau is null as la_goc, c.dang_chinh, c.ma_cum
      from dai_cau_hoi c
     where c.xoa_at is null and c.loai_cau <> 'dung_sai' and c.dang_chinh = any (p_dang_cu)
  ),
  mot as (  -- dạng cũ gắn ĐÚNG 1 chỗ và chỗ đó là dạng bài (trường hợp ①)
    select d.ma_dang_cu, min(d.dich_dang_bai) as db
      from dai_bdm_doi_ung d
     where d.ma_dang_cu = any (p_dang_cu)
     group by d.ma_dang_cu
    having count(*) = 1 and count(d.dich_dang_bai) = 1
  )
  select q.ma_cau, q.goc, q.la_goc, q.dang_chinh, coalesce(q.ma_cum, g.ma_cum),
         coalesce(gc.dang_bai_id, gg.dang_bai_id, cu.dang_bai_id, mot.db),
         case when gc.ma_cau is not null or gg.ma_cau is not null then 'gan_cau'
              when cu.ma_cum_cu is not null then 'gan_cum'
              when mot.db is not null then 'doi_ung' end
    from q
    left join dai_cau_hoi g on g.ma_cau = q.goc and q.goc <> q.ma_cau
    left join dai_bdm_gan_cau gc on gc.ma_cau = q.ma_cau
    left join dai_bdm_gan_cau gg on gg.ma_cau = q.goc and q.goc <> q.ma_cau
    left join dai_bdm_doi_ung_cum cu on cu.ma_cum_cu = coalesce(q.ma_cum, g.ma_cum)
    left join mot on mot.ma_dang_cu = q.dang_chinh
$function$
;

CREATE OR REPLACE FUNCTION public.fn_bdm_cay(p_khoi text, p_nhanh text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
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
$function$
;

CREATE OR REPLACE FUNCTION public._bdm_khop_nguon(p_khoi text, p_hang text)
 RETURNS TABLE(ma_cau text, dang_bai_id text, chu_de_id text, ly_do text, chac text)
 LANGUAGE sql
 STABLE
AS $function$
  select * from (
    select dx.ma_cau, dx.dang_bai_id, cd.id as chu_de_id, dx.ly_do, dx.chac
      from dai_bdm_de_xuat dx
      join dai_cau_hoi q on q.ma_cau = dx.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_dang_bai d on d.id = dx.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'de_xuat' and cd.khoi = p_khoi
       and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = dx.ma_cau)
    union all
    select t.ma_cau, null::text, null::text, t.ly_do, null::text
      from dai_bdm_cau_thieu_dang t
      join dai_cau_hoi q on q.ma_cau = t.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_ban_do b on b.ma_dang = q.dang_chinh
     where p_hang = 'thieu' and b.khoi = p_khoi
       and not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = t.ma_cau)
    union all
    select cg.ma_cau, null::text, null::text, ''::text, null::text
      from _bdm_cau_giai((select coalesce(array_agg(ma_dang), '{}') from dai_ban_do where khoi = p_khoi)) cg
      join dai_cau_hoi q on q.ma_cau = cg.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
     where p_hang = 'trong' and cg.la_goc and cg.dang_bai_id is null
       and not exists (select 1 from dai_bdm_de_xuat x where x.ma_cau = cg.ma_cau)
       and not exists (select 1 from dai_bdm_cau_thieu_dang t where t.ma_cau = cg.ma_cau)
    union all
    select g.ma_cau, g.dang_bai_id, cd.id, ''::text, 'cao'::text
      from dai_bdm_gan_cau g
      join dai_cau_hoi q on q.ma_cau = g.ma_cau and q.xoa_at is null and q.loai_cau <> 'dung_sai'
      join dai_bdm_dang_bai d on d.id = g.dang_bai_id
      join dai_bdm_nhom n on n.id = d.nhom_id
      join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where p_hang = 'mau' and g.nguon = 'ai' and cd.khoi = p_khoi
       and not exists (select 1 from dai_bdm_kiem_mau k where k.ma_cau = g.ma_cau)
       and (hashtext(g.ma_cau) & 2147483647) % 10 = 0          -- ~10% cố định theo mã câu (không nhảy giữa các lần mở)
  ) s
  where _bdm_duyet_duoc(p_khoi, s.chu_de_id)
$function$
;

CREATE OR REPLACE FUNCTION public.fn_bdm_kho_cau(p_loai text, p_id text, p_loc text DEFAULT 'tat_ca'::text, p_limit integer DEFAULT 40, p_offset integer DEFAULT 0)
 RETURNS TABLE(tong bigint, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text, da_duyet boolean, kho_chuan boolean, kiem_may text, nguon text, la_goc boolean, nguon_gan text, dang_bai_id text, dang_bai text, ly_do text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_khoi text; v_nhanh text; v_chu_de text; v_ids text[];
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loc not in ('tat_ca', 'da_duyet', 'chua_duyet', 'kho_chuan') then
    raise exception 'fn_bdm_kho_cau: bộ lọc không hợp lệ %', p_loc;
  end if;

  if p_loai in ('chua_khop', 'de_xuat', 'thieu_dang', 'dung_sai') then
    select cd.khoi, cd.nhanh, cd.id into v_khoi, v_nhanh, v_chu_de from dai_bdm_chu_de cd where cd.id = p_id;
  elsif p_loai = 'dang_bai' then
    select cd.khoi, cd.nhanh, cd.id, array[d.id] into v_khoi, v_nhanh, v_chu_de, v_ids
      from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_id;
  elsif p_loai = 'nhom' then
    select cd.khoi, cd.nhanh, cd.id, array(select d.id from dai_bdm_dang_bai d where d.nhom_id = n.id) into v_khoi, v_nhanh, v_chu_de, v_ids
      from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id where n.id = p_id;
  else
    raise exception 'fn_bdm_kho_cau: p_loai không hợp lệ %', p_loai;
  end if;
  if v_khoi is null then return; end if;

  -- ── rổ "chưa khớp" (Đại) ──
  if p_loai = 'chua_khop' then
    return query
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
             'chua_khop'::text, null::text, null::text, k.ly_do
        from dai_bdm_cau_chua_khop k
        join dai_cau_hoi c on c.ma_cau = k.ma_cau and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       where k.chu_de_id = v_chu_de
         and not exists (select 1 from dai_bdm_de_xuat e where e.ma_cau = k.ma_cau)
         and not exists (select 1 from dai_bdm_cau_thieu_dang t where t.ma_cau = k.ma_cau)
         and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
       order by c.ma_cau limit p_limit offset p_offset;
    return;
  end if;

  -- ── đề xuất chờ duyệt của chủ đề ──
  if p_loai = 'de_xuat' then
    if v_nhanh = 'hgt' then
      return query
        select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
               c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
               'de_xuat:' || e.chac, db.id, db.ten, e.ly_do
          from hgt_bdm_de_xuat e
          join hgt_cau_hoi c on c.ma_cau = e.ma_cau and c.xoa_at is null and c.loai_cau <> 'dung_sai'
          join dai_bdm_dang_bai db on db.id = e.dang_bai_id
          join dai_bdm_nhom n on n.id = db.nhom_id and n.chu_de_id = v_chu_de
         where p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan)
         order by db.thu_tu, c.ma_cau limit p_limit offset p_offset;
    else
      return query
        select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
               c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
               'de_xuat:' || e.chac, db.id, db.ten, e.ly_do
          from dai_bdm_de_xuat e
          join dai_cau_hoi c on c.ma_cau = e.ma_cau and c.xoa_at is null and c.loai_cau <> 'dung_sai'
          join dai_bdm_dang_bai db on db.id = e.dang_bai_id
          join dai_bdm_nhom n on n.id = db.nhom_id and n.chu_de_id = v_chu_de
         where p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan)
         order by db.thu_tu, c.ma_cau limit p_limit offset p_offset;
    end if;
    return;
  end if;

  -- ── thiếu dạng của chủ đề (AI không xếp được — có thể cần thêm dạng bài) ──
  if p_loai = 'thieu_dang' then
    if v_nhanh = 'hgt' then
      return query
        select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
               c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
               'thieu_dang'::text, null::text, null::text, t.ly_do
          from hgt_bdm_cau_thieu_dang t join hgt_cau_hoi c on c.ma_cau = t.ma_cau and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         where t.chu_de_id = v_chu_de
           and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
         order by t.ly_do, c.ma_cau limit p_limit offset p_offset;
    else
      return query
        select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
               c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
               'thieu_dang'::text, null::text, null::text, t.ly_do
          from dai_bdm_cau_thieu_dang t join dai_cau_hoi c on c.ma_cau = t.ma_cau and c.xoa_at is null and c.loai_cau <> 'dung_sai'
         where t.chu_de_id = v_chu_de
           and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
         order by t.ly_do, c.ma_cau limit p_limit offset p_offset;
    end if;
    return;
  end if;

  -- ── KHO ĐÚNG/SAI cấp chủ đề (Thùy 18/10): câu Đ/S có 4 ý ứng 4 dạng ⇒ không vào kho dạng bài ──
  if p_loai = 'dung_sai' then
    if v_nhanh = 'hgt' then
      return query
        with m as (
          select k.ma_cau as goc, k.ma_cau, true as la_goc from hgt_bdm_kho_ds k where k.chu_de_id = v_chu_de
          union all
          select k.ma_cau, c2.ma_cau, false from hgt_bdm_kho_ds k join hgt_cau_hoi c2 on c2.parent_ma_cau = k.ma_cau and c2.xoa_at is null
           where k.chu_de_id = v_chu_de
        )
        select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
               c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, m.la_goc,
               'dung_sai'::text, null::text, null::text, null::text
          from m join hgt_cau_hoi c on c.ma_cau = m.ma_cau and c.xoa_at is null
         where p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan)
         order by m.goc, m.la_goc desc, c.ma_cau limit p_limit offset p_offset;
    else
      return query
        with m as (
          select k.ma_cau as goc, k.ma_cau, true as la_goc from dai_bdm_kho_ds k where k.chu_de_id = v_chu_de
          union all
          select k.ma_cau, c2.ma_cau, false from dai_bdm_kho_ds k join dai_cau_hoi c2 on c2.parent_ma_cau = k.ma_cau and c2.xoa_at is null
           where k.chu_de_id = v_chu_de
        )
        select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
               c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, m.la_goc,
               'dung_sai'::text, null::text, null::text, null::text
          from m join dai_cau_hoi c on c.ma_cau = m.ma_cau and c.xoa_at is null
         where p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan)
         order by m.goc, m.la_goc desc, c.ma_cau limit p_limit offset p_offset;
    end if;
    return;
  end if;

  -- ── câu của dạng bài / nhóm ──
  if v_nhanh = 'hgt' then
    return query
      with cg as (
        select gc.ma_cau as goc, gc.ma_cau, true as la_goc, gc.dang_bai_id, gc.nguon
          from hgt_bdm_gan_cau gc where gc.dang_bai_id = any (v_ids)
        union all
        select gc.ma_cau, c2.ma_cau, false, gc.dang_bai_id, gc.nguon
          from hgt_bdm_gan_cau gc join hgt_cau_hoi c2 on c2.parent_ma_cau = gc.ma_cau and c2.xoa_at is null
         where gc.dang_bai_id = any (v_ids)
      )
      select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
             c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, cg.la_goc,
             'gan_cau:' || cg.nguon, cg.dang_bai_id, db.ten, null::text
        from cg
        join hgt_cau_hoi c on c.ma_cau = cg.ma_cau and c.xoa_at is null and c.loai_cau <> 'dung_sai'
        join dai_bdm_dang_bai db on db.id = cg.dang_bai_id
       where p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan)
       order by db.thu_tu, cg.goc, cg.la_goc desc, c.ma_cau
       limit p_limit offset p_offset;
    return;
  end if;

  return query
    with cg as (
      select g.* from _bdm_cau_giai(array(select b.ma_dang from dai_ban_do b where b.khoi = v_khoi)) g
       where g.dang_bai_id = any (v_ids)
    )
    select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
           c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, cg.la_goc,
           cg.nguon || coalesce(':' || gc.nguon, ''), cg.dang_bai_id, db.ten, null::text
      from cg
      join dai_cau_hoi c on c.ma_cau = cg.ma_cau
      join dai_bdm_dang_bai db on db.id = cg.dang_bai_id
      left join dai_bdm_gan_cau gc on gc.ma_cau = cg.goc
     where p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet)
        or (p_loc = 'kho_chuan' and c.kho_chuan)
     order by db.thu_tu, cg.goc, cg.la_goc desc, c.ma_cau
     limit p_limit offset p_offset;
end $function$
;
