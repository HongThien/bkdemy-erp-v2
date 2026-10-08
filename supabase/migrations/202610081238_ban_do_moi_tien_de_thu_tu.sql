-- ════════════════════════════════════════════════════════════════════════════
-- BẢN ĐỒ MỚI (NHÁP) — tiền đề NHÓM BÀI + số thứ tự 3 tầng · spec-ban-do-4-tang.md §9.0 (CEO 08/10)
--
-- CEO 08/10: màn soạn = sơ đồ thứ tự học. Mỗi màn 1 chủ đề; chuyên đề là box; nhóm bài rẽ nhánh từ chuyên đề,
-- nhóm học trước ở TRÊN, học sau ở DƯỚI (mũi tên); nhóm độc lập = nhánh khác. Dạng bài là card trong box nhóm.
-- Đợt này tiền đề nhóm CHỈ trong cùng 1 chuyên đề (chéo chuyên đề làm sau). Chuyên đề có thứ tự thẳng.
--
-- SỐ THỨ TỰ (hệ tự đánh, CEO 08/10):
--   · chuyên đề: trái → phải trên thanh chuyên đề = dai_bdm_o.thu_tu (riêng từng chủ đề)
--   · dạng bài : trên → dưới trong box nhóm   = dai_bdm_dang_bai.thu_tu
--   · nhóm bài : sắp theo tiền đề — luôn lấy nhóm đã đủ tiền đề; ưu tiên đi TIẾP nhánh vừa học (con của nhóm vừa
--                xếp), hết nhánh thì sang nhóm khác theo thu_tu (trái → phải). ⇒ đi hết nhánh trái rồi mới sang phải.
--                thu_tu của nhóm = vị trí ngang CEO kéo; số hiển thị (so) và tầng (tang) TÍNH ở DB.
-- ════════════════════════════════════════════════════════════════════════════

create table dai_bdm_nhom_tien_de (
  nhom_id         text not null references dai_bdm_nhom(id) on delete cascade,   -- nhóm HỌC SAU
  tien_de_nhom_id text not null references dai_bdm_nhom(id) on delete cascade,   -- nhóm HỌC TRƯỚC
  created_at      timestamptz not null default now(),
  primary key (nhom_id, tien_de_nhom_id),
  check (nhom_id <> tien_de_nhom_id)
);
create index dai_bdm_nhom_tien_de_td_idx on dai_bdm_nhom_tien_de (tien_de_nhom_id);

-- Kiểm khi nối: cùng 1 ô (chủ đề × chuyên đề) + không tạo vòng tròn
create or replace function _bdm_tien_de_kiem() returns trigger language plpgsql as $$
declare
  a dai_bdm_nhom;
  b dai_bdm_nhom;
begin
  select * into a from dai_bdm_nhom where id = new.nhom_id;
  select * into b from dai_bdm_nhom where id = new.tien_de_nhom_id;
  if (a.chu_de_id, a.chuyen_de_id) is distinct from (b.chu_de_id, b.chuyen_de_id) then
    raise exception 'Đợt này tiền đề chỉ nối các nhóm bài trong cùng một chuyên đề («%» và «%» khác chuyên đề)', a.ten, b.ten;
  end if;
  -- vòng: b (trực tiếp/gián tiếp) đã phải học sau a ⇒ nối a sau b thành vòng
  if exists (
    with recursive t(id) as (
      select tien_de_nhom_id from dai_bdm_nhom_tien_de where nhom_id = new.tien_de_nhom_id
      union
      select e.tien_de_nhom_id from dai_bdm_nhom_tien_de e join t on e.nhom_id = t.id
    ) select 1 from t where t.id = new.nhom_id
  ) then
    raise exception 'Tạo vòng tròn: «%» đang phải học sau «%»', b.ten, a.ten;
  end if;
  return new;
end $$;
create trigger trg_bdm_tien_de_kiem before insert or update on dai_bdm_nhom_tien_de
  for each row execute function _bdm_tien_de_kiem();

-- Nhóm đổi ô (chuyển / dồn) mà còn mũi tên nối sang nhóm ở ô khác ⇒ chặn. DEFERRED: chuyển cả ô bằng
-- ON UPDATE CASCADE đi từng dòng, chỉ xét trạng thái CUỐI transaction.
create or replace function _bdm_tien_de_cung_o() returns trigger language plpgsql as $$
begin
  if exists (
    select 1 from dai_bdm_nhom_tien_de e
      join dai_bdm_nhom x on x.id = e.nhom_id
      join dai_bdm_nhom y on y.id = e.tien_de_nhom_id
     where (e.nhom_id = new.id or e.tien_de_nhom_id = new.id)
       and (x.chu_de_id, x.chuyen_de_id) is distinct from (y.chu_de_id, y.chuyen_de_id)
  ) then
    raise exception 'Nhóm «%» còn mũi tên tiền đề nối với nhóm ở chuyên đề khác — gỡ mũi tên trước', new.ten;
  end if;
  return null;
end $$;
create constraint trigger trg_bdm_nhom_tien_de_cung_o after update of chu_de_id, chuyen_de_id on dai_bdm_nhom
  deferrable initially deferred for each row execute function _bdm_tien_de_cung_o();

-- Nhật ký: khoá cho bảng cạnh (không có id)
create or replace function _bdm_ghi_log() returns trigger language plpgsql security definer set search_path = public as $$
declare
  r_cu  jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) end;
  r_moi jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) end;
  r     jsonb := coalesce(r_moi, r_cu);
begin
  if tg_op = 'UPDATE' and (r_cu - 'updated_at') = (r_moi - 'updated_at') then return null; end if;
  insert into dai_bdm_log (bang, khoa, hanh_dong, cu, moi)
  values (tg_table_name,
          coalesce(r ->> 'id',
                   (r ->> 'chu_de_id') || '|' || (r ->> 'chuyen_de_id'),
                   (r ->> 'nhom_id') || '>' || (r ->> 'tien_de_nhom_id')),
          case tg_op when 'INSERT' then 'them' when 'UPDATE' then 'sua' else 'xoa' end,
          r_cu, r_moi);
  return null;
end $$;
create trigger trg_bdm_nhom_tien_de_log after insert or update or delete on dai_bdm_nhom_tien_de
  for each row execute function _bdm_ghi_log();

alter table dai_bdm_nhom_tien_de enable row level security;
create policy dai_bdm_nhom_tien_de_member_all on dai_bdm_nhom_tien_de for all to authenticated
  using (la_thanh_vien()) with check (la_thanh_vien());

-- ════════════════════════════════════════════════════════════════════════════
-- Số thứ tự + tầng của các nhóm trong 1 ô (xem luật ở đầu file)
-- ════════════════════════════════════════════════════════════════════════════
create or replace function _bdm_so_nhom(p_chu_de text, p_chuyen_de text)
returns table (id text, so integer, tang integer)
language plpgsql stable as $$
declare
  con    text[];                -- chưa xếp, theo thu_tu (trái → phải)
  san    text[];                -- đủ tiền đề, theo thu_tu
  da     text[] := '{}';         -- đã xếp, theo thứ tự xếp
  tg     jsonb := '{}'::jsonb;   -- tầng đã tính
  chon   text;
  x      text;
  i      integer;
  k      integer := 0;
begin
  select array_agg(n.id order by n.thu_tu, n.id) into con
    from dai_bdm_nhom n where n.chu_de_id = p_chu_de and n.chuyen_de_id = p_chuyen_de;
  while con is not null and cardinality(con) > 0 loop
    san := '{}'; chon := null;
    foreach x in array con loop
      if not exists (select 1 from dai_bdm_nhom_tien_de e where e.nhom_id = x and not (e.tien_de_nhom_id = any (da))) then
        san := san || x;
      end if;
    end loop;
    -- Đi theo chiều sâu: con (đủ tiền đề) của nhóm xếp GẦN NHẤT còn con sẵn sàng — quay lui dần lên;
    -- hết cả cây mới sang nhóm khác theo thu_tu.
    i := cardinality(da);
    while chon is null and i >= 1 loop
      foreach x in array san loop
        if exists (select 1 from dai_bdm_nhom_tien_de e where e.nhom_id = x and e.tien_de_nhom_id = da[i]) then
          chon := x; exit;
        end if;
      end loop;
      i := i - 1;
    end loop;
    chon := coalesce(chon, san[1], con[1]); -- con[1]: phòng thủ, trigger đã chặn vòng nên không xảy ra
    k := k + 1;
    tg := tg || jsonb_build_object(chon, coalesce((
            select max((tg ->> e.tien_de_nhom_id)::int) + 1 from dai_bdm_nhom_tien_de e where e.nhom_id = chon), 0));
    id := chon; so := k; tang := (tg ->> chon)::int;
    return next;
    da := da || chon; con := array_remove(con, chon);
  end loop;
end $$;

-- Cây 1 khối — thêm: số thứ tự 3 tầng, tầng của nhóm, danh sách tiền đề
create or replace function fn_bdm_cay(p_khoi text) returns jsonb
language sql stable as $$
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
            'nhom', coalesce((
              select jsonb_agg(jsonb_build_object(
                'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'thu_tu', n.thu_tu, 'so', s.so, 'tang', s.tang,
                'co_ly_thuyet', (btrim(n.ly_thuyet) <> '' or n.ly_thuyet_file_url is not null),
                'tien_de', coalesce((select jsonb_agg(e.tien_de_nhom_id order by e.tien_de_nhom_id)
                                       from dai_bdm_nhom_tien_de e where e.nhom_id = n.id), '[]'::jsonb),
                'dang_bai', coalesce((
                  select jsonb_agg(jsonb_build_object(
                    'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'thu_tu', d.thu_tu, 'so', d.so,
                    'co_vi_du', (btrim(d.vi_du) <> '' or d.vi_du_file_url is not null)
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
      select jsonb_object_agg(khoi, n) from (select khoi, count(*) n from dai_bdm_chu_de group by khoi) x), '{}'::jsonb)
  )
$$;

-- Chuyển nhóm sang ô khác: còn mũi tên ⇒ báo rõ (constraint trigger cũng chặn, nhưng câu báo ở đây dễ hiểu hơn)
create or replace function fn_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[])
returns void language plpgsql as $$
declare
  n dai_bdm_nhom;
  so_mui integer;
begin
  select * into n from dai_bdm_nhom where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if (n.chu_de_id, n.chuyen_de_id) is distinct from (p_chu_de_id, p_chuyen_de_id) then
    select count(*) into so_mui from dai_bdm_nhom_tien_de where nhom_id = p_id or tien_de_nhom_id = p_id;
    if so_mui > 0 then
      raise exception 'Nhóm «%» còn % mũi tên tiền đề — gỡ mũi tên trước khi chuyển sang chuyên đề khác', n.ten, so_mui;
    end if;
  end if;
  update dai_bdm_nhom set chu_de_id = p_chu_de_id, chuyen_de_id = p_chuyen_de_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from dai_bdm_nhom
                    where chu_de_id = p_chu_de_id and chuyen_de_id = p_chuyen_de_id and id <> p_id)
   where id = p_id;
  if p_thu_tu_dich is not null then perform fn_bdm_sap_xep('nhom', p_thu_tu_dich); end if;
end $$;

-- Hạ nhóm: còn dạng bài con HOẶC còn mũi tên ⇒ chặn (không tự quyết thay người)
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
  delete from dai_bdm_nhom where id = p_id;
  return v_db;
end $$;

revoke execute on function _bdm_so_nhom(text, text) from public, anon;
grant execute on function _bdm_so_nhom(text, text) to authenticated;
