-- BUILDER GIÁO TRÌNH THEO BẢN ĐỒ MỚI — bước 1: cột + hàm DB (spec-builder-ban-do-moi.md, CEO chốt 17/10)
--
-- Luật đã chốt:
--   · Danh tính dữ liệu = CÂU. Giáo trình lưu câu là chính; id nhóm/dạng bài (NNB…/NDB…) chỉ dựng khung buổi + in (A0).
--   · Buổi = các NHÓM; mỗi nhóm = tập DẠNG BÀI được chọn (chọn cả nhóm hoặc dạng bài lẻ từ nhiều nhóm — cùng 1 kiểu dữ liệu) (A1).
--   · Bài luyện theo dạng bài; BTVN theo nhóm, rải đều qua các dạng bài đã chọn (A2). Không còn chuyên đề trong bản in (A3).
--   · Giáo trình cũ giữ nguyên; bản chuyển sang khuôn mới = bản lưu trữ (luu_tru_tu) — hàm chuyển làm ở bước 5 (A4).
--
-- Cấu trúc phần (tai_lieu_phan) của giáo trình ban_do='moi' — cha bằng KHOÁ (cha_id), không bằng vị trí:
--   buoi ─┬─ nhom (ref_ma = NNB…) ─┬─ dang_bai (ref_ma = NDB…)  · câu luyện
--         │                        ├─ nhom_chua_phan            · câu luyện chưa có dạng bài (chọn tay / bản chuyển đổi)
--         │                        └─ btvn_nhom                 · câu BTVN
--         └─ chua_khop                                          · (chỉ bản chuyển đổi) câu không ra được nhóm
-- loai_phan KHÔNG có CHECK (đã kiểm pg_constraint) ⇒ giá trị mới không cần nới.
-- Mọi phép chọn/xếp hạng câu ở DB (CLAUDE.md §2.0) — builder cũ xếp hạng ở client, builder mới thì không.

-- ── 1. Cột ───────────────────────────────────────────────────────────────────────────
alter table tai_lieu
  add column if not exists ban_do text not null default 'cu',
  add column if not exists luu_tru_tu uuid references tai_lieu(id);   -- có = bản lưu trữ chuyển từ giáo trình cũ này; NULL = không áp dụng
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'tai_lieu_ban_do_check') then
    alter table tai_lieu add constraint tai_lieu_ban_do_check check (ban_do in ('cu', 'moi'));
  end if;
end $$;
comment on column tai_lieu.ban_do is 'Bản đồ kiến thức tài liệu bám: cu = dai_ban_do (builder cũ) · moi = dai_bdm_* (builder mới, spec-builder-ban-do-moi.md)';
comment on column tai_lieu.luu_tru_tu is 'Bản lưu trữ chuyển từ giáo trình cũ (id gốc). NULL = không áp dụng';

alter table tai_lieu_phan
  add column if not exists cha_id uuid references tai_lieu_phan(id) on delete cascade,  -- NULL = không áp dụng (phần kiểu cũ, mốc buổi)
  add column if not exists hien_vi_du boolean not null default true;                    -- dạng bài: in ví dụ hay không
create index if not exists tai_lieu_phan_cha_idx on tai_lieu_phan(cha_id);
-- Đếm số lần dùng câu (gợi ý "ít dùng nhất") — trước đây quét 74k dòng không index.
create index if not exists tai_lieu_cau_ma_cau_idx on tai_lieu_cau(ma_cau);

-- ── 2. Vị trí của câu trên bản đồ mới (một nguồn, dùng chung) ───────────────────────────
-- Câu KHO CHUẨN, chưa xoá, của khối ⇒ dạng bài (qua _bdm_cau_giai) và nhóm:
--   nhóm = nhóm của dạng bài; chưa có dạng bài mà dạng cũ gắn ĐÚNG 1 chỗ là nhóm (②) ⇒ nhóm đó; còn lại NULL.
-- cum = khoá cụm như client (cumKey): cụm người gán → câu gốc → chính nó.
create or replace function _tl_bdm_cau_vi_tri(p_khoi text)
returns table (ma_cau text, la_goc boolean, cum text, loai_cau text, dang_bai_id text, nhom_id text)
language sql stable as $$
  with cg as materialized (
    select * from _bdm_cau_giai(array(
      select b.ma_dang from dai_ban_do b where b.khoi = p_khoi
      union
      select unnest(_bdm_dang_cu_cua_khoi(p_khoi))))
  ),
  mot_nhom as (
    select d.ma_dang_cu, min(d.dich_nhom) as nhom
      from dai_bdm_doi_ung d
     group by d.ma_dang_cu
    having count(*) = 1 and count(d.dich_nhom) = 1
  )
  select c.ma_cau, c.parent_ma_cau is null, coalesce(cg.ma_cum_cu, c.parent_ma_cau, c.ma_cau), c.loai_cau,
         cg.dang_bai_id, coalesce(db.nhom_id, mn.nhom)
    from cg
    join dai_cau_hoi c on c.ma_cau = cg.ma_cau
    left join dai_bdm_dang_bai db on db.id = cg.dang_bai_id
    left join mot_nhom mn on mn.ma_dang_cu = cg.ma_dang_cu and cg.dang_bai_id is null
   where c.kho_chuan and c.xoa_at is null
$$;

create or replace function _tl_bdm_khoi_nhom(p_nhom text)
returns text language sql stable as $$
  select cd.khoi from dai_bdm_nhom n join dai_bdm_chu_de cd on cd.id = n.chu_de_id where n.id = p_nhom
$$;

-- ── 3. Cây chọn cho bộ chọn của builder ─────────────────────────────────────────────────
-- chủ đề → chuyên đề (chỉ để tìm, không in) → nhóm → dạng bài. so_cau = câu kho chuẩn dùng được.
create or replace function fn_tl_bdm_cay_chon(p_khoi text, p_nhanh text default 'toan')
returns jsonb language sql stable as $$
  with v as materialized (select * from _tl_bdm_cau_vi_tri(p_khoi)),
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
              'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'so', s.so,
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
                        from dai_bdm_dang_bai d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
            ) order by s.so)
            from dai_bdm_nhom n join _bdm_so_nhom(cd.id, ch.id) s on s.id = n.id), '[]'::jsonb)
        ) order by o.so)
        from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) as so
                from dai_bdm_o o0 where o0.chu_de_id = cd.id) o
        join dai_bdm_chuyen_de ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
    ) order by cd.thu_tu, cd.id)
    from dai_bdm_chu_de cd where cd.khoi = p_khoi and cd.nhanh = p_nhanh), '[]'::jsonb))
$$;

-- ── 4. Kho câu của 1 nhóm (cho "✎ Chọn câu") ────────────────────────────────────────────
-- dang_bai_id NULL = câu của nhóm chưa phân dạng bài. so_lan_dung = số lần câu đã nằm trong tài liệu (mọi tài liệu).
create or replace function fn_tl_bdm_cau(p_nhom text)
returns jsonb language sql stable as $$
  with v as materialized (select * from _tl_bdm_cau_vi_tri(_tl_bdm_khoi_nhom(p_nhom)) x where x.nhom_id = p_nhom),
  u as (select tc.ma_cau, count(*) as n from tai_lieu_cau tc where tc.ma_cau in (select v.ma_cau from v) group by 1)
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma_cau', v.ma_cau, 'dang_bai_id', v.dang_bai_id, 'loai_cau', v.loai_cau, 'la_goc', v.la_goc, 'cum', v.cum,
           'so_lan_dung', coalesce(u.n, 0))
         order by db.thu_tu nulls last, db.id, coalesce(u.n, 0), v.ma_cau), '[]'::jsonb)
    from v
    left join u on u.ma_cau = v.ma_cau
    left join dai_bdm_dang_bai db on db.id = v.dang_bai_id
$$;

-- ── 5. Gợi ý câu (luật cũ của builder, chuyển xuống DB) ─────────────────────────────────
-- Pool = câu của nhóm, thuộc các dạng bài p_dang_bai (NULL = cả nhóm, kể cả chưa phân), trừ p_tru.
-- Mỗi loại câu lấy p_so->>loai câu; khoá "_tong" (nếu có) = lấp cho đủ tổng từ phần còn lại khi loại nào đó thiếu.
-- Thứ tự ưu tiên: rải đều qua DẠNG BÀI → trong dạng bài rải đều qua CỤM → trong cụm ÍT DÙNG nhất, câu GỐC trước.
create or replace function fn_tl_bdm_goi_y(p_nhom text, p_dang_bai text[], p_so jsonb, p_tru text[] default '{}')
returns text[] language plpgsql stable as $$
declare
  v_out text[];
  v_tong int := coalesce((p_so->>'_tong')::int, 0);
begin
  with v as (
    select x.* from _tl_bdm_cau_vi_tri(_tl_bdm_khoi_nhom(p_nhom)) x
     where x.nhom_id = p_nhom
       and (p_dang_bai is null or x.dang_bai_id = any (p_dang_bai))
       and not (x.ma_cau = any (coalesce(p_tru, '{}')))
  ),
  u as (
    select v.*, coalesce(t.n, 0) as dung, coalesce(db.thu_tu, 2147483647) as db_tt, coalesce(v.dang_bai_id, '') as dbk
      from v
      left join (select tc.ma_cau, count(*) as n from tai_lieu_cau tc where tc.ma_cau in (select v.ma_cau from v) group by 1) t on t.ma_cau = v.ma_cau
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
                      row_number() over (partition by dbk order by r_db, dung, ma_cau) as r_dbk   -- vòng qua dạng bài, KHÔNG theo loại (cho _tong)
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
end $$;

-- ── 6. Khung buổi: helper ─────────────────────────────────────────────────────────────────
-- Giáo trình phải là ban_do='moi' và p_buoi là mốc buổi của nó; khoá dòng tài liệu (2 người sửa cùng lúc thì xếp hàng).
create or replace function _tl_bdm_kiem_buoi(p_tai_lieu uuid, p_buoi uuid)
returns void language plpgsql as $$
begin
  perform 1 from tai_lieu t where t.id = p_tai_lieu and t.ban_do = 'moi' and t.luu_tru_tu is null for update;
  if not found then
    raise exception 'Tài liệu không phải giáo trình theo bản đồ mới (hoặc là bản lưu trữ — chỉ xem).' using errcode = 'P0001';
  end if;
  if not exists (select 1 from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'buoi') then
    raise exception 'Không thấy buổi này trong giáo trình.' using errcode = 'P0001';
  end if;
end $$;

-- Mọi phần thuộc 1 buổi (đi theo cha_id: buổi → nhóm → con).
create or replace function _tl_bdm_phan_cua_buoi(p_buoi uuid)
returns setof tai_lieu_phan language sql stable as $$
  with recursive t as (
    select p.* from tai_lieu_phan p where p.cha_id = p_buoi
    union all
    select p.* from tai_lieu_phan p join t on p.cha_id = t.id
  )
  select * from t
$$;

-- Câu đã dùng trong buổi (trừ 1 phần nếu có) — luật cũ: cùng buổi không trùng câu, khác buổi được dùng lại.
create or replace function _tl_bdm_cau_da_dung(p_buoi uuid, p_tru_phan uuid default null)
returns text[] language sql stable as $$
  select coalesce(array_agg(distinct tc.ma_cau), '{}')
    from _tl_bdm_phan_cua_buoi(p_buoi) p
    join tai_lieu_cau tc on tc.phan_id = p.id
   where p.id is distinct from p_tru_phan
$$;

create or replace function _tl_bdm_ghi_cau(p_phan uuid, p_ma_caus text[])
returns void language sql as $$
  delete from tai_lieu_cau where phan_id = p_phan;
  insert into tai_lieu_cau (phan_id, ma_cau, thu_tu)
  select p_phan, m, (o - 1)::int from unnest(coalesce(p_ma_caus, '{}')) with ordinality as x(m, o);
$$;

-- ── 7. Đặt NHÓM + DẠNG BÀI cho 1 buổi (một transaction) ────────────────────────────────────
-- p_chon = [{"nhom":"NNB…","dang_bai":["NDB…",…]}, …] theo THỨ TỰ người chọn.
--   · Nhóm bỏ ⇒ xoá nhóm + mọi phần con + câu. Dạng bài bỏ ⇒ xoá phần dạng bài đó.
--   · Nhóm / dạng bài MỚI ⇒ tạo phần + gợi ý câu (né câu đã có trong buổi). Phần đã có giữ nguyên câu (GV có thể đã sửa tay).
--   · Nhóm mới mà trên bản đồ chưa có dạng bài nào ⇒ câu luyện vào nhom_chua_phan (như builder cũ, theo cả nhóm).
--   · Sắp lại: mốc buổi → [nhóm → dạng bài → chưa phân] theo p_chon → phần khác (chua_khop…) → BTVN từng nhóm.
-- Trả nội dung buổi (fn_tl_bdm_noi_dung) để client vá tại chỗ.
create or replace function fn_tl_bdm_dat_buoi(
  p_tai_lieu uuid, p_buoi uuid, p_chon jsonb,
  p_so_luyen jsonb default '{"trac_nghiem":1,"tu_luan":1,"_tong":2}',
  p_so_luyen_nhom jsonb default '{"trac_nghiem":3,"tra_loi_ngan":2,"tu_luan":1}',
  p_so_btvn jsonb default '{"trac_nghiem":2,"tra_loi_ngan":1,"tu_luan":1}'
) returns jsonb language plpgsql as $$
declare
  r record; d record;
  v_nhom text; v_ds text[]; v_ds_bd text[];
  v_pn uuid; v_pd uuid;
  v_used text[];
  v_cau text[];
  v_moi boolean;
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

    -- Nhóm mới mà bản đồ chưa có dạng bài nào ⇒ câu luyện theo cả nhóm.
    v_ds_bd := array(select db.id from dai_bdm_dang_bai db where db.nhom_id = v_nhom);
    if v_moi and cardinality(v_ds_bd) = 0 then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
      values (p_tai_lieu, 999999, 'nhom_chua_phan', v_nhom, v_pn) returning id into v_pd;
      v_used := _tl_bdm_cau_da_dung(p_buoi);
      perform _tl_bdm_ghi_cau(v_pd, fn_tl_bdm_goi_y(v_nhom, null, p_so_luyen_nhom, v_used));
      v_pd := null;
    end if;
    -- chưa phân đứng sau các dạng bài
    v_seq := v_seq || array(select p.id from tai_lieu_phan p where p.cha_id = v_pn and p.loai_phan = 'nhom_chua_phan' order by p.thu_tu, p.id);

    -- BTVN của nhóm: chỉ tự gợi ý khi nhóm mới thêm (nhóm cũ giữ câu GV đã chỉnh).
    if v_moi then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
      values (p_tai_lieu, 999999, 'btvn_nhom', v_nhom, v_pn) returning id into v_pd;
      v_used := _tl_bdm_cau_da_dung(p_buoi);
      perform _tl_bdm_ghi_cau(v_pd, fn_tl_bdm_goi_y(v_nhom, case when cardinality(v_ds_bd) = 0 then null else v_ds end, p_so_btvn, v_used));
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
end $$;

-- ── 8. Đặt câu cho 1 phần (Chọn câu / Gợi ý lại) — chặn trùng câu trong cùng buổi ─────────────
create or replace function fn_tl_bdm_dat_cau(p_phan uuid, p_ma_caus text[])
returns void language plpgsql as $$
declare
  v_tl uuid; v_loai text; v_buoi uuid; v_trung text[];
begin
  select p.tai_lieu_id, p.loai_phan into v_tl, v_loai from tai_lieu_phan p where p.id = p_phan;
  if v_loai is null or v_loai not in ('dang_bai', 'nhom_chua_phan', 'btvn_nhom', 'chua_khop') then
    raise exception 'Phần này không nhận câu.' using errcode = 'P0001';
  end if;
  -- buổi = tổ tiên loai 'buoi'
  with recursive t as (
    select p.id, p.cha_id, p.loai_phan from tai_lieu_phan p where p.id = p_phan
    union all
    select p.id, p.cha_id, p.loai_phan from tai_lieu_phan p join t on p.id = t.cha_id
  ) select t.id into v_buoi from t where t.loai_phan = 'buoi';
  perform _tl_bdm_kiem_buoi(v_tl, v_buoi);
  if cardinality(coalesce(p_ma_caus, '{}')) <> (select count(distinct x) from unnest(coalesce(p_ma_caus, '{}')) x) then
    raise exception 'Danh sách có câu lặp.' using errcode = 'P0001';
  end if;
  v_trung := array(select x from unnest(coalesce(p_ma_caus, '{}')) x where x = any (_tl_bdm_cau_da_dung(v_buoi, p_phan)));
  if cardinality(v_trung) > 0 then
    raise exception 'Câu đã dùng ở phần khác trong buổi: %', array_to_string(v_trung, ', ') using errcode = 'P0001';
  end if;
  perform _tl_bdm_ghi_cau(p_phan, p_ma_caus);
  update tai_lieu set updated_at = now() where id = v_tl;
end $$;

-- ── 9. Nội dung (builder + in) ────────────────────────────────────────────────────────────
-- p_buoi NULL = cả giáo trình. stt = số HIỂN THỊ (suy theo vị trí trong buổi, không lưu).
-- Nhóm/dạng bài đã bị xoá khỏi bản đồ ⇒ ten = NULL, con_tren_ban_do = false (giáo trình vẫn giữ câu).
-- Câu: chỉ mã theo thứ tự — nội dung câu client nạp theo mã (CRUD đọc), như builder cũ.
create or replace function fn_tl_bdm_noi_dung(p_tai_lieu uuid, p_buoi uuid default null)
returns jsonb language sql stable as $$
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
              left join dai_bdm_dang_bai d on d.id = pd.ref_ma), '[]'::jsonb),
            'chua_phan', (select coalesce(k.j, jsonb_build_object('phan_id', p.id, 'caus', '[]'::jsonb))
                            from ph p left join khoi_cau k on k.phan_id = p.id
                           where p.cha_id = pn.id and p.loai_phan = 'nhom_chua_phan' order by p.thu_tu, p.id limit 1),
            'btvn', (select coalesce(k.j, jsonb_build_object('phan_id', p.id, 'caus', '[]'::jsonb))
                       from ph p left join khoi_cau k on k.phan_id = p.id
                      where p.cha_id = pn.id and p.loai_phan = 'btvn_nhom' order by p.thu_tu, p.id limit 1)
          ) order by pn.stt)
          from (select p.*, row_number() over (order by p.thu_tu, p.id) as stt
                  from ph p where p.cha_id = b.id and p.loai_phan = 'nhom') pn
          left join dai_bdm_nhom n on n.id = pn.ref_ma), '[]'::jsonb),
        'chua_khop', (select coalesce(k.j, jsonb_build_object('phan_id', p.id, 'caus', '[]'::jsonb))
                        from ph p left join khoi_cau k on k.phan_id = p.id
                       where p.cha_id = b.id and p.loai_phan = 'chua_khop' order by p.thu_tu, p.id limit 1)
      ) order by b.thu_tu, b.id)
      from ph b where b.loai_phan = 'buoi' and (p_buoi is null or b.id = p_buoi)), '[]'::jsonb)
  )
$$;

-- ── 10. Quyền gọi (anon không gọi được; helper cũng GRANT — bài học 14/10) ───────────────────
do $$
declare f text;
begin
  foreach f in array array[
    '_tl_bdm_cau_vi_tri(text)', '_tl_bdm_khoi_nhom(text)', '_tl_bdm_kiem_buoi(uuid,uuid)', '_tl_bdm_phan_cua_buoi(uuid)',
    '_tl_bdm_cau_da_dung(uuid,uuid)', '_tl_bdm_ghi_cau(uuid,text[])',
    'fn_tl_bdm_cay_chon(text,text)', 'fn_tl_bdm_cau(text)', 'fn_tl_bdm_goi_y(text,text[],jsonb,text[])',
    'fn_tl_bdm_dat_buoi(uuid,uuid,jsonb,jsonb,jsonb,jsonb)', 'fn_tl_bdm_dat_cau(uuid,text[])', 'fn_tl_bdm_noi_dung(uuid,uuid)'
  ] loop
    execute format('revoke execute on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
