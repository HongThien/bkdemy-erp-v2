-- ════════════════════════════════════════════════════════════════════════════
-- BẢN ĐỒ MỚI (NHÁP) — ĐỐI ỨNG dạng cũ → bản mới + GÁN CÂU vào dạng bài · spec-ban-do-4-tang.md §9.2 (CEO 08/10)
--
-- LUẬT CHUẨN (CEO 08/10): MỌI câu phải thuộc 1 dạng bài (tầng 4).
-- Dạng cũ (dai_ban_do, = tầng 3 cũ) được CEO gắn vào bản mới theo 3 trường hợp:
--   ① gắn vào DẠNG BÀI  ⇒ mọi câu tự về dạng bài đó (không phải chỉnh)
--   ② gắn vào NHÓM BÀI  ⇒ câu phải được gán vào 1 dạng bài dưới nhóm đó
--   ③ gắn vào CHUYÊN ĐỀ (ô chủ đề × chuyên đề) ⇒ câu phải được gán vào 1 dạng bài dưới nó
-- 1 dạng cũ gắn ĐƯỢC nhiều chỗ (CEO: "có thể"); chỉ khi gắn ĐÚNG 1 chỗ và chỗ đó là dạng bài thì câu mới tự rơi.
-- Gán câu: theo CỤM CŨ cả cụm (dai_bdm_doi_ung_cum) hoặc từng CÂU GỐC (dai_bdm_gan_cau) — bản sao đi theo gốc.
-- Đa số câu do AI (Claude) gán, học thuật duyệt (bảng đề xuất AI làm ở B3 — cắm vào cùng chỗ này).
--
-- Câu thuộc dạng bài nào = _bdm_cau_giai (1 nguồn duy nhất), ưu tiên: gán câu (chính nó → gốc) > gán cụm cũ > đối ứng ①.
-- Không ra dạng bài nào ⇒ "chưa gán dạng bài" — đếm trên từng box (fn_bdm_cay). Câu đã xoá (xoa_at) không tính.
-- ════════════════════════════════════════════════════════════════════════════

create table dai_bdm_doi_ung (
  id              bigserial primary key,
  ma_dang_cu      text not null references dai_ban_do(ma_dang),
  -- đúng 1 loại đích; cột của loại khác = NULL vì KHÔNG ÁP DỤNG (§1.5)
  dich_dang_bai   text references dai_bdm_dang_bai(id),
  dich_nhom       text references dai_bdm_nhom(id),
  dich_chu_de     text,
  dich_chuyen_de  text,
  created_at      timestamptz not null default now(),
  foreign key (dich_chu_de, dich_chuyen_de) references dai_bdm_o (chu_de_id, chuyen_de_id) on update cascade,
  check (num_nonnulls(dich_dang_bai, dich_nhom, dich_chu_de) = 1),
  check ((dich_chu_de is null) = (dich_chuyen_de is null))
);
create unique index dai_bdm_doi_ung_uniq on dai_bdm_doi_ung
  (ma_dang_cu, coalesce(dich_dang_bai, dich_nhom, dich_chu_de || '|' || dich_chuyen_de));
create index dai_bdm_doi_ung_db_idx on dai_bdm_doi_ung (dich_dang_bai);
create index dai_bdm_doi_ung_nhom_idx on dai_bdm_doi_ung (dich_nhom);
create index dai_bdm_doi_ung_o_idx on dai_bdm_doi_ung (dich_chu_de, dich_chuyen_de);

create table dai_bdm_doi_ung_cum (
  ma_cum_cu    text primary key references dai_cum_bai(ma_cum),
  dang_bai_id  text not null references dai_bdm_dang_bai(id),
  actor        uuid default public.jwt_uid(),
  at           timestamptz not null default now()
);
create index dai_bdm_doi_ung_cum_db_idx on dai_bdm_doi_ung_cum (dang_bai_id);

create table dai_bdm_gan_cau (
  ma_cau       text primary key references dai_cau_hoi(ma_cau),   -- câu GỐC (bản sao đi theo)
  dang_bai_id  text not null references dai_bdm_dang_bai(id),
  nguon        text not null check (nguon in ('nguoi', 'ai')),     -- 'ai' = đề xuất AI đã được người nhận
  actor        uuid default public.jwt_uid(),
  at           timestamptz not null default now()
);
create index dai_bdm_gan_cau_db_idx on dai_bdm_gan_cau (dang_bai_id);

-- Nhật ký: thêm khoá cho các bảng mới
create or replace function _bdm_ghi_log() returns trigger language plpgsql security definer set search_path = public as $$
declare
  r_cu  jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) end;
  r_moi jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) end;
  r     jsonb := coalesce(r_moi, r_cu);
begin
  if tg_op = 'UPDATE' and (r_cu - 'updated_at') = (r_moi - 'updated_at') then return null; end if;
  insert into dai_bdm_log (bang, khoa, hanh_dong, cu, moi)
  values (tg_table_name,
          coalesce(r ->> 'id', r ->> 'ma_cau', r ->> 'ma_cum_cu',
                   (r ->> 'chu_de_id') || '|' || (r ->> 'chuyen_de_id'),
                   (r ->> 'nhom_id') || '>' || (r ->> 'tien_de_nhom_id')),
          case tg_op when 'INSERT' then 'them' when 'UPDATE' then 'sua' else 'xoa' end,
          r_cu, r_moi);
  return null;
end $$;
create trigger trg_bdm_doi_ung_log     after insert or update or delete on dai_bdm_doi_ung     for each row execute function _bdm_ghi_log();
create trigger trg_bdm_doi_ung_cum_log after insert or update or delete on dai_bdm_doi_ung_cum for each row execute function _bdm_ghi_log();
create trigger trg_bdm_gan_cau_log     after insert or update or delete on dai_bdm_gan_cau     for each row execute function _bdm_ghi_log();

alter table dai_bdm_doi_ung     enable row level security;
alter table dai_bdm_doi_ung_cum enable row level security;
alter table dai_bdm_gan_cau     enable row level security;
create policy dai_bdm_doi_ung_member_all     on dai_bdm_doi_ung     for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
create policy dai_bdm_doi_ung_cum_member_all on dai_bdm_doi_ung_cum for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
create policy dai_bdm_gan_cau_member_all     on dai_bdm_gan_cau     for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());

-- ════════════════════════════════════════════════════════════════════════════
-- Câu thuộc dạng bài nào — NGUỒN DUY NHẤT
-- ════════════════════════════════════════════════════════════════════════════
create or replace function _bdm_cau_giai(p_dang_cu text[])
returns table (ma_cau text, goc text, la_goc boolean, ma_dang_cu text, ma_cum_cu text, dang_bai_id text, nguon text)
language sql stable as $$
  with q as (
    select c.ma_cau, coalesce(c.parent_ma_cau, c.ma_cau) as goc, c.parent_ma_cau is null as la_goc, c.dang_chinh, c.ma_cum
      from dai_cau_hoi c
     where c.xoa_at is null and c.dang_chinh = any (p_dang_cu)
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
$$;

-- Dạng cũ đang gắn vào bản mới của 1 khối (đích nằm trong chủ đề của khối đó)
create or replace function _bdm_dang_cu_cua_khoi(p_khoi text) returns text[]
language sql stable as $$
  select coalesce(array_agg(distinct d.ma_dang_cu), '{}')
    from dai_bdm_doi_ung d
    left join dai_bdm_dang_bai db on db.id = d.dich_dang_bai
    left join dai_bdm_nhom n on n.id = coalesce(d.dich_nhom, db.nhom_id)
    join dai_bdm_chu_de cd on cd.id = coalesce(d.dich_chu_de, n.chu_de_id)
   where cd.khoi = p_khoi
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- Cây 1 khối — thêm: số câu mỗi dạng bài · câu CHƯA GÁN trên box nhóm/chuyên đề · dạng cũ gắn vào từng đích ·
-- tổng hợp khối (dạng cũ chưa gắn, câu chưa gán)
-- ════════════════════════════════════════════════════════════════════════════
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
  )
  select jsonb_build_object(
    'chu_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cd.id, 'ten', cd.ten, 'thu_tu', cd.thu_tu,
        'o', coalesce((
          select jsonb_agg(jsonb_build_object(
            'chuyen_de_id', ch.id, 'ten', ch.ten, 'mo_ta', ch.mo_ta, 'thu_tu', o.thu_tu, 'so', o.so,
            'so_chu_de', (select count(*) from dai_bdm_o o2 where o2.chuyen_de_id = ch.id),
            'cung_co_o', coalesce((
              select jsonb_agg(jsonb_build_object('chu_de_id', c2.id, 'ten', c2.ten, 'khoi', c2.khoi) order by c2.khoi, c2.thu_tu)
                from dai_bdm_o o3 join dai_bdm_chu_de c2 on c2.id = o3.chu_de_id
               where o3.chuyen_de_id = ch.id and o3.chu_de_id <> cd.id), '[]'::jsonb),
            'dang_cu', coalesce((select jsonb_agg(jsonb_build_object('ma', du.ma_dang_cu, 'ten', du.ten_dang) order by du.ma_dang_cu)
                                   from du where du.dich_chu_de = cd.id and du.dich_chuyen_de = ch.id), '[]'::jsonb),
            'chua_gan', (select count(*) from cg where cg.dang_bai_id is null
                           and cg.ma_dang_cu in (select du.ma_dang_cu from du where du.dich_chu_de = cd.id and du.dich_chuyen_de = ch.id)),
            'nhom', coalesce((
              select jsonb_agg(jsonb_build_object(
                'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'thu_tu', n.thu_tu, 'so', s.so, 'tang', s.tang,
                'co_ly_thuyet', (btrim(n.ly_thuyet) <> '' or n.ly_thuyet_file_url is not null),
                'tien_de', coalesce((select jsonb_agg(e.tien_de_nhom_id order by e.tien_de_nhom_id)
                                       from dai_bdm_nhom_tien_de e where e.nhom_id = n.id), '[]'::jsonb),
                'dang_cu', coalesce((select jsonb_agg(jsonb_build_object('ma', du.ma_dang_cu, 'ten', du.ten_dang) order by du.ma_dang_cu)
                                       from du where du.dich_nhom = n.id), '[]'::jsonb),
                'chua_gan', (select count(*) from cg where cg.dang_bai_id is null
                               and cg.ma_dang_cu in (select du.ma_dang_cu from du where du.dich_nhom = n.id)),
                'dang_bai', coalesce((
                  select jsonb_agg(jsonb_build_object(
                    'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'thu_tu', d.thu_tu, 'so', d.so,
                    'co_vi_du', (btrim(d.vi_du) <> '' or d.vi_du_file_url is not null),
                    'so_cau', (select count(*) from cg where cg.dang_bai_id = d.id),
                    'dang_cu', coalesce((select jsonb_agg(jsonb_build_object('ma', du.ma_dang_cu, 'ten', du.ten_dang) order by du.ma_dang_cu)
                                           from du where du.dich_dang_bai = d.id), '[]'::jsonb)
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
        'so_chu_de', (select count(*) from dai_bdm_o o where o.chuyen_de_id = ch.id),
        'khoi', (select coalesce(jsonb_agg(distinct cd.khoi), '[]'::jsonb)
                   from dai_bdm_o o join dai_bdm_chu_de cd on cd.id = o.chu_de_id where o.chuyen_de_id = ch.id)
      ) order by ch.ten)
      from dai_bdm_chuyen_de ch), '[]'::jsonb),
    'so_chu_de_theo_khoi', coalesce((
      select jsonb_object_agg(khoi, n) from (select khoi, count(*) n from dai_bdm_chu_de group by khoi) x), '{}'::jsonb),
    -- Tổng hợp khối: dạng cũ CỦA khối (dai_ban_do.khoi) — khối xong khi cả 2 số về 0
    'tong', jsonb_build_object(
      'dang_cu', (select cardinality(ds) from dc),
      'dang_cu_chua_gan', (select count(*) from dai_ban_do b where b.khoi = p_khoi
                             and not exists (select 1 from dai_bdm_doi_ung d where d.ma_dang_cu = b.ma_dang)),
      'cau_dang_cu_chua_gan', (select count(*) from cg join dai_ban_do b on b.ma_dang = cg.ma_dang_cu
                                 where b.khoi = p_khoi and not exists (select 1 from dai_bdm_doi_ung d where d.ma_dang_cu = cg.ma_dang_cu)),
      'cau', (select count(*) from cg join dai_ban_do b on b.ma_dang = cg.ma_dang_cu where b.khoi = p_khoi),
      'cau_chua_gan', (select count(*) from cg join dai_ban_do b on b.ma_dang = cg.ma_dang_cu
                         where b.khoi = p_khoi and cg.dang_bai_id is null)
    )
  )
$$;

-- Danh sách dạng cũ của 1 khối (ngăn "Bản đồ cũ"): tên, chủ đề/chuyên đề cũ, số câu, số cụm, đang gắn vào đâu, số câu chưa gán
create or replace function fn_bdm_dang_cu(p_khoi text) returns jsonb
language sql stable as $$
  with ds as materialized (select coalesce(array_agg(ma_dang), '{}') a from dai_ban_do where khoi = p_khoi),
  cg as materialized (select * from _bdm_cau_giai((select a from ds)))
  select coalesce(jsonb_agg(jsonb_build_object(
    'ma', b.ma_dang, 'ten', b.ten_dang, 'chu_de', b.ten_chu_de, 'chuyen_de', b.ten_chuyen_de,
    'so_cau', (select count(*) from cg where cg.ma_dang_cu = b.ma_dang),
    'so_cum', (select count(*) from dai_cum_bai c where c.ma_dang = b.ma_dang),
    'chua_gan', (select count(*) from cg where cg.ma_dang_cu = b.ma_dang and cg.dang_bai_id is null),
    'dich', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id,
        'loai', case when d.dich_dang_bai is not null then 'dang_bai' when d.dich_nhom is not null then 'nhom' else 'o' end,
        'nhan', case when d.dich_dang_bai is not null then 'Dạng bài · ' || db.ten
                     when d.dich_nhom is not null then 'Nhóm · ' || n.ten
                     else 'Chuyên đề · ' || ch.ten || ' (' || cd.ten || ')' end
      ) order by d.id)
      from dai_bdm_doi_ung d
      left join dai_bdm_dang_bai db on db.id = d.dich_dang_bai
      left join dai_bdm_nhom n on n.id = d.dich_nhom
      left join dai_bdm_chu_de cd on cd.id = d.dich_chu_de
      left join dai_bdm_chuyen_de ch on ch.id = d.dich_chuyen_de
      where d.ma_dang_cu = b.ma_dang), '[]'::jsonb)
  ) order by b.ma_chu_de, b.ma_chuyen_de, b.ma_dang), '[]'::jsonb)
  from dai_ban_do b where b.khoi = p_khoi
$$;

-- Câu GỐC chưa gán dạng bài, của 1 đích (nhóm, hoặc ô chủ đề × chuyên đề) — cho bảng gán câu
create or replace function fn_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer default 200, p_offset integer default 0)
returns jsonb language sql stable as $$
  with dcu as materialized (
    select coalesce(array_agg(d.ma_dang_cu), '{}') a from dai_bdm_doi_ung d
     where (p_nhom is not null and d.dich_nhom = p_nhom)
        or (p_nhom is null and d.dich_chu_de = p_chu_de and d.dich_chuyen_de = p_chuyen_de)
  ),
  cg as materialized (select * from _bdm_cau_giai((select a from dcu))),
  goc as materialized (  -- câu gốc còn chưa gán + số bản sao chưa gán đi theo
    select cg.goc, count(*) - 1 as so_ban_sao from cg where cg.dang_bai_id is null group by cg.goc
  )
  select jsonb_build_object(
    'tong_cau', (select count(*) from cg where cg.dang_bai_id is null),
    'tong_goc', (select count(*) from goc),
    'cum', coalesce((
      select jsonb_agg(jsonb_build_object('ma_cum', x.ma_cum_cu, 'ten', cb.ten, 'thu_tu', cb.thu_tu, 'ma_dang_cu', cb.ma_dang, 'so_cau', x.n) order by cb.ma_dang, cb.thu_tu)
        from (select cg.ma_cum_cu, count(*) n from cg where cg.dang_bai_id is null and cg.ma_cum_cu is not null group by cg.ma_cum_cu) x
        join dai_cum_bai cb on cb.ma_cum = x.ma_cum_cu), '[]'::jsonb),
    'cau', coalesce((
      select jsonb_agg(jsonb_build_object(
        'ma_cau', c.ma_cau, 'noi_dung', c.noi_dung, 'loai_cau', c.loai_cau, 'anh_de', c.anh_de,
        'ma_cum', c.ma_cum, 'ma_dang_cu', c.dang_chinh, 'so_ban_sao', g.so_ban_sao
      ) order by c.dang_chinh, c.ma_cum nulls last, c.ma_cau)
      from (select * from goc order by goc limit p_limit offset p_offset) g
      join dai_cau_hoi c on c.ma_cau = g.goc), '[]'::jsonb)
  )
$$;

-- Gán câu GỐC / cả cụm cũ vào 1 dạng bài (người làm ⇒ nguon 'nguoi'; AI đề xuất được nhận ⇒ 'ai')
create or replace function fn_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text default 'nguoi')
returns integer language plpgsql as $$
declare v integer;
begin
  insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
  select x, p_dang_bai, p_nguon from unnest(p_ma_caus) x
  on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon, actor = public.jwt_uid(), at = now();
  get diagnostics v = row_count;
  return v;
end $$;

create or replace function fn_bdm_gan_cum(p_ma_cum text, p_dang_bai text)
returns void language plpgsql as $$
begin
  insert into dai_bdm_doi_ung_cum (ma_cum_cu, dang_bai_id) values (p_ma_cum, p_dang_bai)
  on conflict (ma_cum_cu) do update set dang_bai_id = excluded.dang_bai_id, actor = public.jwt_uid(), at = now();
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- Giữ đối ứng/gán khi CEO sắp lại bản mới
-- ════════════════════════════════════════════════════════════════════════════
-- Chuyển cả ô: nhánh "dồn vào ô sẵn có" phải mang theo đối ứng trỏ vào ô cũ (nhánh còn lại ON UPDATE CASCADE lo)
create or replace function fn_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text)
returns void language plpgsql as $$
begin
  if p_chu_de_cu = p_chu_de_moi then return; end if;
  if exists (select 1 from dai_bdm_o where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id) then
    update dai_bdm_nhom set chu_de_id = p_chu_de_moi,
           thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from dai_bdm_nhom
                               where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    -- đối ứng trỏ vào ô cũ → ô đích (trùng thì bỏ bản cũ: cùng dạng cũ cùng đích là một)
    delete from dai_bdm_doi_ung d
     where d.dich_chu_de = p_chu_de_cu and d.dich_chuyen_de = p_chuyen_de_id
       and exists (select 1 from dai_bdm_doi_ung e where e.ma_dang_cu = d.ma_dang_cu
                     and e.dich_chu_de = p_chu_de_moi and e.dich_chuyen_de = p_chuyen_de_id);
    update dai_bdm_doi_ung set dich_chu_de = p_chu_de_moi
     where dich_chu_de = p_chu_de_cu and dich_chuyen_de = p_chuyen_de_id;
    delete from dai_bdm_o where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
  else
    update dai_bdm_o set chu_de_id = p_chu_de_moi,
           thu_tu = (select coalesce(max(thu_tu), 0) + 1 from dai_bdm_o where chu_de_id = p_chu_de_moi)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    if not found then raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de_id, p_chu_de_cu; end if;
  end if;
end $$;

-- NÂNG dạng bài → nhóm: dạng cũ đang gắn vào dạng bài chuyển thành gắn vào nhóm mới (① → ②).
-- Dạng bài đã có câu/cụm được gán ⇒ chặn (không tự xoá công gán).
create or replace function fn_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text)
returns text language plpgsql as $$
declare
  d dai_bdm_dang_bai;
  v_nhom text;
begin
  select * into d from dai_bdm_dang_bai where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if exists (select 1 from dai_bdm_gan_cau where dang_bai_id = p_id) or exists (select 1 from dai_bdm_doi_ung_cum where dang_bai_id = p_id) then
    raise exception 'Dạng bài «%» đang có câu/cụm được gán — chuyển hoặc gỡ gán trước rồi mới nâng', d.ten;
  end if;
  insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file)
  values (p_chu_de_id, p_chuyen_de_id, d.ten, d.mo_ta, d.vi_du, d.vi_du_file_url, d.vi_du_ten_file)
  returning id into v_nhom;
  update dai_bdm_doi_ung set dich_dang_bai = null, dich_nhom = v_nhom where dich_dang_bai = p_id;
  delete from dai_bdm_dang_bai where id = p_id;
  return v_nhom;
end $$;

-- HẠ nhóm → dạng bài: dạng cũ đang gắn vào nhóm chuyển thành gắn vào dạng bài mới (② → ①).
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
  insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, vi_du, vi_du_file_url, vi_du_ten_file)
  values (p_nhom_dich, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.ly_thuyet_ten_file)
  returning id into v_db;
  update dai_bdm_doi_ung set dich_nhom = null, dich_dang_bai = v_db where dich_nhom = p_id;
  delete from dai_bdm_nhom where id = p_id;
  return v_db;
end $$;

revoke execute on function _bdm_cau_giai(text[]), _bdm_dang_cu_cua_khoi(text), fn_bdm_dang_cu(text),
  fn_bdm_cau_chua_gan(text, text, text, integer, integer), fn_bdm_gan_cau(text[], text, text), fn_bdm_gan_cum(text, text)
  from public, anon;
grant execute on function _bdm_cau_giai(text[]), _bdm_dang_cu_cua_khoi(text), fn_bdm_dang_cu(text),
  fn_bdm_cau_chua_gan(text, text, text, integer, integer), fn_bdm_gan_cau(text[], text, text), fn_bdm_gan_cum(text, text)
  to authenticated;
