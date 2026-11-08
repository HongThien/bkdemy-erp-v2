-- ============================================================================
-- 202610291712 — khtn_ban_do_moi_ham
-- ----------------------------------------------------------------------------
-- VÌ SAO: bước 2 của "bản đồ mới KHTN" (Thùy 29/10, mig 202610291707): màn soạn Bản đồ mới (BanDoMoi.tsx) mở được cho KHTN.
--   Client dispatch theo môn qua 1 registry (dai_bdm_* / fn_bdm_* ⇄ khtn_bdm_* / fn_khtn_bdm_*); đây là bản KHTN của các hàm
--   màn đó gọi — cùng tham số, cùng khuôn trả về với bản Toán. Khác Toán:
--   · không có "bản đồ cũ đối ứng" (KHTN chuyển 1–1 xong ở bước 1) ⇒ dang_cu = [], gán cụm không dùng;
--   · câu "chưa phân" = câu còn sống có dạng cũ (dang_chinh) = nhóm.ma_cu và CHƯA có dòng khtn_bdm_gan_cau (§1.5: không dòng = chưa đo/chưa xếp);
--   · gán / chuyển câu: câu gốc kéo theo bản sao (parent_ma_cau), như Toán; dạng bài phải cùng khối với câu.
--
-- MẤT GÌ (Luật xoá): Không mất gì — chỉ thêm hàm mới (đọc/ghi bảng khtn_bdm_*; xoá trong hàm = thao tác soạn bản đồ người dùng bấm, như Toán).
-- ============================================================================

-- ── số câu gán / chưa phân (dùng chung cho cây) ──
create or replace function _khtn_bdm_khoi_cua_nhom(p_nhom text) returns text language sql stable as $$
  select cd.khoi from khtn_bdm_nhom n join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where n.id = p_nhom
$$;

-- ── CÂY (khuôn = fn_bdm_cay) ──
create or replace function fn_khtn_bdm_cay(p_khoi text, p_nhanh text default null) returns jsonb
language sql stable as $function$
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
$function$;

-- ── XOÁ trọn gói (DB chặn khi bên dưới có câu đã gán) ──
create or replace function _khtn_bdm_xoa_cac_nhom(p_nhom text[]) returns jsonb language plpgsql as $$
declare v_db integer; v_cau integer; v_n integer;
begin
  select count(*) into v_cau from khtn_bdm_gan_cau g join khtn_bdm_dang_bai d on d.id = g.dang_bai_id where d.nhom_id = any (p_nhom);
  if v_cau > 0 then raise exception 'Bên trong có % câu đã được gán vào dạng bài — gỡ gán hoặc chuyển dạng bài đi trước rồi mới xoá', v_cau; end if;
  delete from khtn_bdm_nhom_tien_de where nhom_id = any (p_nhom) or tien_de_nhom_id = any (p_nhom);
  delete from khtn_bdm_dang_bai where nhom_id = any (p_nhom);
  get diagnostics v_db = row_count;
  delete from khtn_bdm_nhom where id = any (p_nhom);
  get diagnostics v_n = row_count;
  return jsonb_build_object('nhom', v_n, 'dang_bai', v_db);
end $$;
create or replace function fn_khtn_bdm_xoa_nhom(p_id text) returns jsonb language plpgsql as $$
begin
  if not exists (select 1 from khtn_bdm_nhom where id = p_id) then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  return _khtn_bdm_xoa_cac_nhom(array[p_id]);
end $$;
create or replace function fn_khtn_bdm_xoa_o(p_chu_de text, p_chuyen_de text) returns jsonb language plpgsql as $$
declare v jsonb; v_xoa_cd boolean := false;
begin
  if not exists (select 1 from khtn_bdm_o where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de) then
    raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de, p_chu_de;
  end if;
  v := _khtn_bdm_xoa_cac_nhom(array(select id from khtn_bdm_nhom where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de));
  delete from khtn_bdm_o where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de;
  if not exists (select 1 from khtn_bdm_o where chuyen_de_id = p_chuyen_de) then delete from khtn_bdm_chuyen_de where id = p_chuyen_de; v_xoa_cd := true; end if;
  return v || jsonb_build_object('xoa_khoi_danh_muc', v_xoa_cd);
end $$;
create or replace function fn_khtn_bdm_xoa_chu_de(p_id text) returns jsonb language plpgsql as $$
declare v jsonb; v_o integer; v_cds text[];
begin
  if not exists (select 1 from khtn_bdm_chu_de where id = p_id) then raise exception 'Không tìm thấy chủ đề %', p_id; end if;
  v := _khtn_bdm_xoa_cac_nhom(array(select id from khtn_bdm_nhom where chu_de_id = p_id));
  v_cds := array(select chuyen_de_id from khtn_bdm_o where chu_de_id = p_id);
  delete from khtn_bdm_o where chu_de_id = p_id;
  get diagnostics v_o = row_count;
  delete from khtn_bdm_chuyen_de ch where ch.id = any (v_cds) and not exists (select 1 from khtn_bdm_o o where o.chuyen_de_id = ch.id);
  delete from khtn_bdm_chu_de where id = p_id;
  return v || jsonb_build_object('chuyen_de', v_o);
end $$;

-- ── SẮP XẾP / CHUYỂN / NÂNG / HẠ / GỘP ──
create or replace function fn_khtn_bdm_sap_xep(p_loai text, p_ids text[]) returns void language plpgsql as $$
begin
  if p_loai = 'chu_de' then
    update khtn_bdm_chu_de t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  elsif p_loai = 'o' then
    update khtn_bdm_o t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.chu_de_id || '|' || t.chuyen_de_id = x.id;
  elsif p_loai = 'nhom' then
    update khtn_bdm_nhom t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  elsif p_loai = 'dang_bai' then
    update khtn_bdm_dang_bai t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  else
    raise exception 'fn_khtn_bdm_sap_xep: loại "%" không hợp lệ', p_loai;
  end if;
end $$;
create or replace function fn_khtn_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[]) returns void language plpgsql as $$
declare n khtn_bdm_nhom; so_mui integer;
begin
  select * into n from khtn_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if (n.chu_de_id, n.chuyen_de_id) is distinct from (p_chu_de_id, p_chuyen_de_id) then
    select count(*) into so_mui from khtn_bdm_nhom_tien_de where nhom_id = p_id or tien_de_nhom_id = p_id;
    if so_mui > 0 then raise exception 'Nhóm «%» còn % mũi tên tiền đề — gỡ mũi tên trước khi chuyển sang chuyên đề khác', n.ten, so_mui; end if;
  end if;
  update khtn_bdm_nhom set chu_de_id = p_chu_de_id, chuyen_de_id = p_chuyen_de_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from khtn_bdm_nhom where chu_de_id = p_chu_de_id and chuyen_de_id = p_chuyen_de_id and id <> p_id)
   where id = p_id;
  if p_thu_tu_dich is not null then perform fn_khtn_bdm_sap_xep('nhom', p_thu_tu_dich); end if;
end $$;
create or replace function fn_khtn_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[]) returns void language plpgsql as $$
begin
  update khtn_bdm_dang_bai set nhom_id = p_nhom_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from khtn_bdm_dang_bai where nhom_id = p_nhom_id and id <> p_id)
   where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if p_thu_tu_dich is not null then perform fn_khtn_bdm_sap_xep('dang_bai', p_thu_tu_dich); end if;
end $$;
create or replace function fn_khtn_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text) returns void language plpgsql as $$
begin
  if p_chu_de_cu = p_chu_de_moi then return; end if;
  if exists (select 1 from khtn_bdm_o where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id) then
    update khtn_bdm_nhom set chu_de_id = p_chu_de_moi,
           thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from khtn_bdm_nhom where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    delete from khtn_bdm_o where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
  else
    update khtn_bdm_o set chu_de_id = p_chu_de_moi, thu_tu = (select coalesce(max(thu_tu), 0) + 1 from khtn_bdm_o where chu_de_id = p_chu_de_moi)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    if not found then raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de_id, p_chu_de_cu; end if;
  end if;
end $$;
create or replace function fn_khtn_bdm_gop_chuyen_de(p_tu text, p_vao text) returns void language plpgsql as $$
declare r record;
begin
  if p_tu = p_vao then raise exception 'Không thể gộp chuyên đề vào chính nó'; end if;
  if not exists (select 1 from khtn_bdm_chuyen_de where id = p_vao) then raise exception 'Không tìm thấy chuyên đề đích %', p_vao; end if;
  for r in select chu_de_id from khtn_bdm_o where chuyen_de_id = p_tu loop
    if exists (select 1 from khtn_bdm_o where chu_de_id = r.chu_de_id and chuyen_de_id = p_vao) then
      update khtn_bdm_nhom set chuyen_de_id = p_vao,
             thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from khtn_bdm_nhom where chu_de_id = r.chu_de_id and chuyen_de_id = p_vao)
       where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
      delete from khtn_bdm_o where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
    else
      update khtn_bdm_o set chuyen_de_id = p_vao where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;   -- ON UPDATE CASCADE kéo nhóm theo
    end if;
  end loop;
  update khtn_bdm_chuyen_de v set mo_ta = t.mo_ta from khtn_bdm_chuyen_de t where v.id = p_vao and t.id = p_tu and btrim(v.mo_ta) = '';
  delete from khtn_bdm_chuyen_de where id = p_tu;
end $$;
create or replace function fn_khtn_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text) returns text language plpgsql as $$
declare d khtn_bdm_dang_bai; v_nhom text; v_lt text;
begin
  select * into d from khtn_bdm_dang_bai where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if exists (select 1 from khtn_bdm_gan_cau where dang_bai_id = p_id) then
    raise exception 'Dạng bài «%» đang có câu được gán — chuyển hoặc gỡ gán trước rồi mới nâng', d.ten;
  end if;
  v_lt := case when btrim(d.vi_du) = '' then d.ly_thuyet when btrim(d.ly_thuyet) = '' then d.vi_du
               else d.ly_thuyet || chr(10) || chr(10) || '**Ví dụ**' || chr(10) || chr(10) || d.vi_du end;
  insert into khtn_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file)
  values (p_chu_de_id, p_chuyen_de_id, d.ten, d.mo_ta, v_lt, coalesce(d.ly_thuyet_file_url, d.vi_du_file_url), coalesce(d.ly_thuyet_ten_file, d.vi_du_ten_file))
  returning id into v_nhom;
  delete from khtn_bdm_dang_bai where id = p_id;
  return v_nhom;
end $$;
create or replace function fn_khtn_bdm_ha_nhom(p_id text, p_nhom_dich text) returns text language plpgsql as $$
declare n khtn_bdm_nhom; v_db text; v_tt integer;
begin
  if p_id = p_nhom_dich then raise exception 'Không thể hạ nhóm vào chính nó'; end if;
  select * into n from khtn_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if not exists (select 1 from khtn_bdm_nhom where id = p_nhom_dich) then raise exception 'Không tìm thấy nhóm đích %', p_nhom_dich; end if;
  if exists (select 1 from khtn_cau_hoi q where q.dang_chinh = n.ma_cu and q.xoa_at is null and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = q.ma_cau)) then
    raise exception 'Nhóm «%» còn câu chưa phân — xếp các câu đó vào dạng bài trước rồi mới hạ nhóm', n.ten;
  end if;
  select coalesce(max(thu_tu), 0) into v_tt from khtn_bdm_dang_bai where nhom_id = p_nhom_dich;
  insert into khtn_bdm_dang_bai (nhom_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, thu_tu)
  values (p_nhom_dich, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.ly_thuyet_ten_file, v_tt + 1)
  returning id into v_db;
  update khtn_bdm_dang_bai d set nhom_id = p_nhom_dich, thu_tu = v_tt + 1 + x.i
    from (select c.id, row_number() over (order by c.thu_tu, c.id) i from khtn_bdm_dang_bai c where c.nhom_id = p_id) x
   where d.id = x.id;
  delete from khtn_bdm_nhom_tien_de where nhom_id = p_id or tien_de_nhom_id = p_id;
  delete from khtn_bdm_nhom where id = p_id;
  return v_db;
end $$;

-- ── KHÔNG có bản đồ cũ đối ứng ở KHTN ──
create or replace function fn_khtn_bdm_dang_cu(p_khoi text) returns jsonb language sql stable as $$ select '[]'::jsonb $$;
create or replace function fn_khtn_bdm_gan_cum(p_ma_cum text, p_dang_bai text) returns void language plpgsql as $$
begin raise exception 'KHTN không còn cụm — cụm cũ đã thành dạng bài (bản đồ mới 29/10).'; end $$;

-- ── GÁN câu (gốc kéo theo bản sao) — dạng bài phải cùng khối với câu ──
create or replace function _khtn_bdm_gan(p_ma_cau text, p_dang_bai text, p_nguon text) returns integer language plpgsql set search_path to 'public' as $$
declare v_khoi text; v_khoi_db text; v integer;
begin
  select b.khoi into v_khoi from khtn_cau_hoi c join khtn_ban_do b on b.ma_dang = c.dang_chinh where c.ma_cau = p_ma_cau and c.xoa_at is null;
  if v_khoi is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  select cd.khoi into v_khoi_db from khtn_bdm_dang_bai d join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where d.id = p_dang_bai;
  if v_khoi_db is null then raise exception 'Không tìm thấy dạng bài % ở bản đồ mới KHTN', p_dang_bai; end if;
  if v_khoi_db <> v_khoi then raise exception 'Dạng bài % thuộc khối %, câu % thuộc khối %', p_dang_bai, v_khoi_db, p_ma_cau, v_khoi; end if;
  insert into khtn_bdm_gan_cau as g (ma_cau, dang_bai_id, nguon)
  select c.ma_cau, p_dang_bai, p_nguon from khtn_cau_hoi c where c.xoa_at is null and (c.ma_cau = p_ma_cau or c.parent_ma_cau = p_ma_cau)
  on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = excluded.nguon, actor = public.jwt_uid(), at = now()
   where (g.dang_bai_id, g.nguon) is distinct from (excluded.dang_bai_id, excluded.nguon);
  get diagnostics v = row_count;
  return v;
end $$;
create or replace function fn_khtn_bdm_gan_cau(p_ma_caus text[], p_dang_bai text, p_nguon text default 'nguoi') returns integer language plpgsql as $$
declare m text; v integer := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_nguon not in ('nguoi', 'ai') then raise exception 'p_nguon phải là nguoi hoặc ai'; end if;
  foreach m in array coalesce(p_ma_caus, '{}') loop v := v + _khtn_bdm_gan(m, p_dang_bai, p_nguon); end loop;
  return v;
end $$;
create or replace function fn_khtn_bdm_cau_chuyen_dang(p_ma_cau text, p_dang_bai text, p_ca_ban_sao boolean default true) returns jsonb language plpgsql set search_path to 'public' as $$
declare v jsonb; v_n integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_ca_ban_sao then v_n := _khtn_bdm_gan(p_ma_cau, p_dang_bai, 'nguoi');
  else
    perform 1 from khtn_bdm_dang_bai where id = p_dang_bai;
    if not found then raise exception 'Không tìm thấy dạng bài %', p_dang_bai; end if;
    insert into khtn_bdm_gan_cau as g (ma_cau, dang_bai_id, nguon) values (p_ma_cau, p_dang_bai, 'nguoi')
    on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'nguoi', actor = public.jwt_uid(), at = now();
    v_n := 1;
  end if;
  select jsonb_build_object('id', d.id, 'ten', d.ten, 'nhom', n.ten, 'chu_de', cd.ten, 'so_cau', v_n) into v
    from khtn_bdm_dang_bai d join khtn_bdm_nhom n on n.id = d.nhom_id join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where d.id = p_dang_bai;
  return v;
end $$;
create or replace function fn_khtn_bdm_cau_xoa(p_ma_cau text, p_ca_ban_sao boolean default false) returns integer language plpgsql set search_path to 'public' as $$
declare v integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  update khtn_cau_hoi set xoa_at = now() where xoa_at is null and (ma_cau = p_ma_cau or (p_ca_ban_sao and parent_ma_cau = p_ma_cau));   -- kho rác
  get diagnostics v = row_count;
  if v = 0 then raise exception 'Không thấy câu % ở kho KHTN (hoặc đã vào kho rác)', p_ma_cau; end if;
  return v;
end $$;

-- ── Câu CHƯA PHÂN của 1 nhóm (hoặc cả ô) — khuôn = fn_bdm_cau_chua_gan ──
create or replace function fn_khtn_bdm_cau_chua_gan(p_nhom text, p_chu_de text, p_chuyen_de text, p_limit integer default 200, p_offset integer default 0) returns jsonb
language sql stable as $$
  with cg as materialized (
    select q.ma_cau, coalesce(q.parent_ma_cau, q.ma_cau) goc
      from khtn_cau_hoi q join khtn_bdm_nhom n on n.ma_cu = q.dang_chinh
     where q.xoa_at is null
       and ((p_nhom is not null and n.id = p_nhom) or (p_nhom is null and n.chu_de_id = p_chu_de and n.chuyen_de_id = p_chuyen_de))
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = q.ma_cau)
  ),
  goc as materialized (select cg.goc, count(*) - 1 so_ban_sao from cg group by cg.goc)
  select jsonb_build_object(
    'tong_cau', (select count(*) from cg),
    'tong_goc', (select count(*) from goc),
    'cum', '[]'::jsonb,
    'cau', coalesce((
      select jsonb_agg(jsonb_build_object('ma_cau', c.ma_cau, 'noi_dung', c.noi_dung, 'loai_cau', c.loai_cau, 'anh_de', c.anh_de,
                                          'ma_cum', null, 'ma_dang_cu', c.dang_chinh, 'so_ban_sao', g.so_ban_sao)
             order by c.dang_chinh, c.ma_cau)
        from (select * from goc order by goc limit p_limit offset p_offset) g join khtn_cau_hoi c on c.ma_cau = g.goc), '[]'::jsonb)
  )
$$;

-- ── KHO câu của dạng bài / nhóm — khuôn = fn_bdm_kho_cau (KHTN chỉ có dang_bai · nhom) ──
create or replace function fn_khtn_bdm_kho_cau(p_loai text, p_id text, p_loc text default 'tat_ca', p_limit integer default 40, p_offset integer default 0)
returns table(tong bigint, ma_cau text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text,
              da_duyet boolean, kho_chuan boolean, kiem_may text, nguon text, la_goc boolean, nguon_gan text, dang_bai_id text, dang_bai text, ly_do text)
language plpgsql stable security definer set search_path to 'public' as $function$
declare v_ids text[];
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loc not in ('tat_ca', 'da_duyet', 'chua_duyet', 'kho_chuan') then raise exception 'fn_khtn_bdm_kho_cau: bộ lọc không hợp lệ %', p_loc; end if;
  if p_loai = 'dang_bai' then v_ids := array[p_id];
  elsif p_loai = 'nhom' then v_ids := array(select d.id from khtn_bdm_dang_bai d where d.nhom_id = p_id);
  else return;   -- KHTN chưa có rổ chưa khớp / đề xuất / thiếu dạng / Đúng-Sai ở bản đồ mới
  end if;
  return query
    select count(*) over () as tong, c.ma_cau, c.loai_cau, c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai,
           c.anh_de, c.anh_dap_an, c.da_duyet, c.kho_chuan, c.kiem_may, c.nguon, c.parent_ma_cau is null,
           'gan_cau:' || g.nguon, g.dang_bai_id, db.ten, null::text
      from khtn_bdm_gan_cau g
      join khtn_cau_hoi c on c.ma_cau = g.ma_cau and c.xoa_at is null
      join khtn_bdm_dang_bai db on db.id = g.dang_bai_id
     where g.dang_bai_id = any (v_ids)
       and (p_loc = 'tat_ca' or (p_loc = 'da_duyet' and c.da_duyet) or (p_loc = 'chua_duyet' and not c.da_duyet) or (p_loc = 'kho_chuan' and c.kho_chuan))
     order by db.thu_tu, coalesce(c.parent_ma_cau, c.ma_cau), (c.parent_ma_cau is not null), c.ma_cau
     limit p_limit offset p_offset;
end $function$;

do $$
declare f text;
begin
  for f in select p.oid::regprocedure::text from pg_proc p where p.proname ~ '^_?(fn_)?khtn_bdm_' and p.pronamespace = 'public'::regnamespace loop
    execute format('revoke execute on function %s from public, anon', f);
    if f like 'fn_%' then execute format('grant execute on function %s to authenticated', f); end if;
  end loop;
end $$;
grant execute on function _khtn_bdm_gan(text, text, text), _khtn_bdm_xoa_cac_nhom(text[]), _khtn_bdm_khoi_cua_nhom(text) to authenticated;
