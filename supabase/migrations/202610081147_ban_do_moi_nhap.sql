-- ════════════════════════════════════════════════════════════════════════════
-- BẢN ĐỒ MỚI (NHÁP) — nhánh Đại · spec-ban-do-4-tang.md §4.2 (CEO chốt 08/10)
--
-- CEO soạn bản đồ 4 tầng mới TRÊN ERP: chia tầng · lý thuyết (tầng 3) · ví dụ (tầng 4) · mô tả (tầng 3–4).
-- Sau đó Claude khớp câu cũ → dạng bài mới, học thuật duyệt, rồi mới CHUYỂN (bước riêng, dừng nhân sự).
--
-- ⭐ Bản nháp KHÔNG đụng bản đồ đang chạy: không hàm nào đang sống đọc các bảng dai_bdm_*.
--   Lúc chuyển, nhóm nháp sẽ nhận lại mã nhóm cũ tương ứng (dai_ban_do.ma_dang) — không phải ở đây.
-- ⭐ Mã nháp cố định từ lúc sinh (CEO Q4): kéo đi đâu cũng không đổi. Chỉ con trỏ cha đổi.
-- ⭐ Chuyên đề DÙNG CHUNG (không khối); khối nằm ở chủ đề; nhóm nằm ở đúng 1 ô (chủ đề × chuyên đề).
-- ════════════════════════════════════════════════════════════════════════════

create sequence if not exists dai_bdm_chu_de_seq;
create sequence if not exists dai_bdm_chuyen_de_seq;
create sequence if not exists dai_bdm_nhom_seq;
create sequence if not exists dai_bdm_dang_bai_seq;

-- ── Tầng 1: Chủ đề (mang KHỐI) ──
create table dai_bdm_chu_de (
  id         text primary key default 'NCD' || lpad(nextval('dai_bdm_chu_de_seq')::text, 5, '0'),
  khoi       text not null,
  ten        text not null check (btrim(ten) <> ''),
  thu_tu     integer not null,                 -- trigger tự điền cuối danh sách khi INSERT không truyền
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dai_bdm_chu_de_khoi_idx on dai_bdm_chu_de (khoi, thu_tu);

-- ── Tầng 2: Chuyên đề (DÙNG CHUNG nhiều chủ đề, không khối) ──
create table dai_bdm_chuyen_de (
  id         text primary key default 'NCH' || lpad(nextval('dai_bdm_chuyen_de_seq')::text, 5, '0'),
  ten        text not null check (btrim(ten) <> ''),
  mo_ta      text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Ô: chuyên đề có mặt trong chủ đề ──
create table dai_bdm_o (
  chu_de_id    text not null references dai_bdm_chu_de(id),
  chuyen_de_id text not null references dai_bdm_chuyen_de(id),
  thu_tu       integer not null,
  created_at   timestamptz not null default now(),
  primary key (chu_de_id, chuyen_de_id)
);
create index dai_bdm_o_chuyen_de_idx on dai_bdm_o (chuyen_de_id);

-- ── Tầng 3: Nhóm bài (= KP; lý thuyết chung) ──
create table dai_bdm_nhom (
  id                 text primary key default 'NNB' || lpad(nextval('dai_bdm_nhom_seq')::text, 5, '0'),
  chu_de_id          text not null,
  chuyen_de_id       text not null,
  ten                text not null check (btrim(ten) <> ''),
  mo_ta              text not null default '',   -- dấu hiệu nhận biết — Claude dựa vào để khớp câu
  ly_thuyet          text not null default '',
  ly_thuyet_file_url text,                       -- NULL = không có đính kèm (không áp dụng)
  ly_thuyet_ten_file text,
  thu_tu             integer not null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  foreign key (chu_de_id, chuyen_de_id) references dai_bdm_o (chu_de_id, chuyen_de_id) on update cascade
);
create index dai_bdm_nhom_o_idx on dai_bdm_nhom (chu_de_id, chuyen_de_id, thu_tu);

-- ── Tầng 4: Dạng bài (ví dụ; dùng cho bổ trợ) ──
create table dai_bdm_dang_bai (
  id              text primary key default 'NDB' || lpad(nextval('dai_bdm_dang_bai_seq')::text, 5, '0'),
  nhom_id         text not null references dai_bdm_nhom(id),
  ten             text not null check (btrim(ten) <> ''),
  mo_ta           text not null default '',
  vi_du           text not null default '',
  vi_du_file_url  text,
  vi_du_ten_file  text,
  thu_tu          integer not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index dai_bdm_dang_bai_nhom_idx on dai_bdm_dang_bai (nhom_id, thu_tu);

-- ── Nhật ký: mọi thay đổi ghi vết bằng TRIGGER (CLAUDE §4 — app không tự nhớ ghi log) ──
create table dai_bdm_log (
  id         bigserial primary key,
  bang       text not null,
  khoa       text not null,
  hanh_dong  text not null check (hanh_dong in ('them', 'sua', 'xoa')),
  cu         jsonb,               -- NULL = không áp dụng (dòng mới thêm)
  moi        jsonb,               -- NULL = không áp dụng (dòng đã xoá)
  actor      uuid default public.jwt_uid(),  -- KHÔNG auth.uid(): role migrate không có quyền schema auth
  at         timestamptz not null default now()
);
create index dai_bdm_log_khoa_idx on dai_bdm_log (bang, khoa, at desc);

-- ════════════════════════════════════════════════════════════════════════════
-- TRIGGER
-- ════════════════════════════════════════════════════════════════════════════

-- updated_at
create or replace function _bdm_touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger trg_bdm_chu_de_touch    before update on dai_bdm_chu_de    for each row execute function _bdm_touch();
create trigger trg_bdm_chuyen_de_touch before update on dai_bdm_chuyen_de for each row execute function _bdm_touch();
create trigger trg_bdm_nhom_touch      before update on dai_bdm_nhom      for each row execute function _bdm_touch();
create trigger trg_bdm_dang_bai_touch  before update on dai_bdm_dang_bai  for each row execute function _bdm_touch();

-- thu_tu: INSERT không truyền ⇒ cuối danh sách anh em. (Đổi cha thì RPC chuyển tự đặt thứ tự —
-- KHÔNG làm ở trigger UPDATE, vì chuyển cả ô kéo theo nhóm bằng ON UPDATE CASCADE sẽ bị xáo thứ tự.)
create or replace function _bdm_thu_tu() returns trigger language plpgsql as $$
begin
  if new.thu_tu is not null then return new; end if;
  if tg_table_name = 'dai_bdm_chu_de' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from dai_bdm_chu_de where khoi = new.khoi;
  elsif tg_table_name = 'dai_bdm_o' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from dai_bdm_o where chu_de_id = new.chu_de_id;
  elsif tg_table_name = 'dai_bdm_nhom' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from dai_bdm_nhom
     where chu_de_id = new.chu_de_id and chuyen_de_id = new.chuyen_de_id;
  elsif tg_table_name = 'dai_bdm_dang_bai' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from dai_bdm_dang_bai where nhom_id = new.nhom_id;
  end if;
  return new;
end $$;

create trigger trg_bdm_chu_de_thu_tu   before insert           on dai_bdm_chu_de   for each row execute function _bdm_thu_tu();
create trigger trg_bdm_o_thu_tu        before insert on dai_bdm_o        for each row execute function _bdm_thu_tu();
create trigger trg_bdm_nhom_thu_tu     before insert on dai_bdm_nhom     for each row execute function _bdm_thu_tu();
create trigger trg_bdm_dang_bai_thu_tu before insert on dai_bdm_dang_bai for each row execute function _bdm_thu_tu();

-- Đổi NỘI DUNG con ⇒ bump updated_at của cha (CLAUDE §2)
create or replace function _bdm_bump_nhom() returns trigger language plpgsql as $$
begin
  update dai_bdm_nhom set updated_at = now()
   where id in (case when tg_op <> 'INSERT' then old.nhom_id end, case when tg_op <> 'DELETE' then new.nhom_id end);
  return null;
end $$;
create trigger trg_bdm_dang_bai_bump after insert or update or delete on dai_bdm_dang_bai
  for each row execute function _bdm_bump_nhom();

-- Nhật ký (security definer: ghi được vào dai_bdm_log dù RLS; owner = role migrate)
create or replace function _bdm_ghi_log() returns trigger language plpgsql security definer set search_path = public as $$
declare
  r_cu  jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) end;
  r_moi jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) end;
  r     jsonb := coalesce(r_moi, r_cu);
begin
  -- bỏ qua lần update chỉ chạm updated_at (bump từ con) — không phải thay đổi của người
  if tg_op = 'UPDATE' and (r_cu - 'updated_at') = (r_moi - 'updated_at') then return null; end if;
  insert into dai_bdm_log (bang, khoa, hanh_dong, cu, moi)
  values (tg_table_name,
          coalesce(r ->> 'id', (r ->> 'chu_de_id') || '|' || (r ->> 'chuyen_de_id')),
          case tg_op when 'INSERT' then 'them' when 'UPDATE' then 'sua' else 'xoa' end,
          r_cu, r_moi);
  return null;
end $$;

create trigger trg_bdm_chu_de_log    after insert or update or delete on dai_bdm_chu_de    for each row execute function _bdm_ghi_log();
create trigger trg_bdm_chuyen_de_log after insert or update or delete on dai_bdm_chuyen_de for each row execute function _bdm_ghi_log();
create trigger trg_bdm_o_log         after insert or update or delete on dai_bdm_o         for each row execute function _bdm_ghi_log();
create trigger trg_bdm_nhom_log      after insert or update or delete on dai_bdm_nhom      for each row execute function _bdm_ghi_log();
create trigger trg_bdm_dang_bai_log  after insert or update or delete on dai_bdm_dang_bai  for each row execute function _bdm_ghi_log();

-- ════════════════════════════════════════════════════════════════════════════
-- RLS — thành viên (mẫu dai_ban_do_member_all)
-- ════════════════════════════════════════════════════════════════════════════
alter table dai_bdm_chu_de    enable row level security;
alter table dai_bdm_chuyen_de enable row level security;
alter table dai_bdm_o         enable row level security;
alter table dai_bdm_nhom      enable row level security;
alter table dai_bdm_dang_bai  enable row level security;
alter table dai_bdm_log       enable row level security;

create policy dai_bdm_chu_de_member_all    on dai_bdm_chu_de    for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
create policy dai_bdm_chuyen_de_member_all on dai_bdm_chuyen_de for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
create policy dai_bdm_o_member_all         on dai_bdm_o         for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
create policy dai_bdm_nhom_member_all      on dai_bdm_nhom      for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
create policy dai_bdm_dang_bai_member_all  on dai_bdm_dang_bai  for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
create policy dai_bdm_log_member_select    on dai_bdm_log       for select to authenticated using (la_thanh_vien());

-- ════════════════════════════════════════════════════════════════════════════
-- HÀM
-- ════════════════════════════════════════════════════════════════════════════

-- Cây bản đồ mới của 1 khối (jsonb) + danh mục chuyên đề dùng chung + đếm chủ đề theo khối.
-- Không trả nội dung lý thuyết/ví dụ (nặng) — màn tải riêng khi mở.
create or replace function fn_bdm_cay(p_khoi text) returns jsonb
language sql stable as $$
  select jsonb_build_object(
    'chu_de', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cd.id, 'ten', cd.ten, 'thu_tu', cd.thu_tu,
        'o', coalesce((
          select jsonb_agg(jsonb_build_object(
            'chuyen_de_id', ch.id, 'ten', ch.ten, 'mo_ta', ch.mo_ta, 'thu_tu', o.thu_tu,
            'so_chu_de', (select count(*) from dai_bdm_o o2 where o2.chuyen_de_id = ch.id),
            'nhom', coalesce((
              select jsonb_agg(jsonb_build_object(
                'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'thu_tu', n.thu_tu,
                'co_ly_thuyet', (btrim(n.ly_thuyet) <> '' or n.ly_thuyet_file_url is not null),
                'dang_bai', coalesce((
                  select jsonb_agg(jsonb_build_object(
                    'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'thu_tu', d.thu_tu,
                    'co_vi_du', (btrim(d.vi_du) <> '' or d.vi_du_file_url is not null)
                  ) order by d.thu_tu, d.id)
                  from dai_bdm_dang_bai d where d.nhom_id = n.id), '[]'::jsonb)
              ) order by n.thu_tu, n.id)
              from dai_bdm_nhom n where n.chu_de_id = cd.id and n.chuyen_de_id = ch.id), '[]'::jsonb)
          ) order by o.thu_tu, ch.ten)
          from dai_bdm_o o join dai_bdm_chuyen_de ch on ch.id = o.chuyen_de_id
          where o.chu_de_id = cd.id), '[]'::jsonb)
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

-- Sắp lại thứ tự anh em theo đúng mảng id truyền vào (vị trí trong mảng = thu_tu). Ô: id = 'chu_de|chuyen_de'.
create or replace function fn_bdm_sap_xep(p_loai text, p_ids text[]) returns void
language plpgsql as $$
begin
  if p_loai = 'chu_de' then
    update dai_bdm_chu_de t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  elsif p_loai = 'o' then
    update dai_bdm_o t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i)
     where t.chu_de_id || '|' || t.chuyen_de_id = x.id;
  elsif p_loai = 'nhom' then
    update dai_bdm_nhom t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  elsif p_loai = 'dang_bai' then
    update dai_bdm_dang_bai t set thu_tu = x.i from unnest(p_ids) with ordinality x(id, i) where t.id = x.id;
  else
    raise exception 'fn_bdm_sap_xep: loại "%" không hợp lệ', p_loai;
  end if;
end $$;

-- Chuyển nhóm sang ô khác (ô đích phải có sẵn) + đặt thứ tự trong ô đích — 1 transaction.
create or replace function fn_bdm_chuyen_nhom(p_id text, p_chu_de_id text, p_chuyen_de_id text, p_thu_tu_dich text[])
returns void language plpgsql as $$
begin
  update dai_bdm_nhom set chu_de_id = p_chu_de_id, chuyen_de_id = p_chuyen_de_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from dai_bdm_nhom
                    where chu_de_id = p_chu_de_id and chuyen_de_id = p_chuyen_de_id and id <> p_id)
   where id = p_id;
  if not found then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  if p_thu_tu_dich is not null then perform fn_bdm_sap_xep('nhom', p_thu_tu_dich); end if;
end $$;

-- Chuyển dạng bài sang nhóm khác + đặt thứ tự trong nhóm đích.
create or replace function fn_bdm_chuyen_dang_bai(p_id text, p_nhom_id text, p_thu_tu_dich text[])
returns void language plpgsql as $$
begin
  update dai_bdm_dang_bai set nhom_id = p_nhom_id,
         thu_tu = (select coalesce(max(thu_tu), 0) + 1 from dai_bdm_dang_bai where nhom_id = p_nhom_id and id <> p_id)
   where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  if p_thu_tu_dich is not null then perform fn_bdm_sap_xep('dang_bai', p_thu_tu_dich); end if;
end $$;

-- Chuyển cả ô (chuyên đề + các nhóm trong nó) từ chủ đề này sang chủ đề khác.
-- Chủ đề đích đã có chuyên đề này ⇒ dồn nhóm vào ô sẵn có rồi bỏ ô cũ (rỗng).
create or replace function fn_bdm_chuyen_o(p_chu_de_cu text, p_chuyen_de_id text, p_chu_de_moi text)
returns void language plpgsql as $$
begin
  if p_chu_de_cu = p_chu_de_moi then return; end if;
  if exists (select 1 from dai_bdm_o where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id) then
    -- dồn vào ô sẵn có: nhóm chuyển sang xếp SAU các nhóm đang có, giữ thứ tự tương đối
    update dai_bdm_nhom set chu_de_id = p_chu_de_moi,
           thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from dai_bdm_nhom
                               where chu_de_id = p_chu_de_moi and chuyen_de_id = p_chuyen_de_id)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    delete from dai_bdm_o where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
  else
    -- ON UPDATE CASCADE kéo theo các nhóm của ô (giữ nguyên thứ tự trong ô)
    update dai_bdm_o set chu_de_id = p_chu_de_moi,
           thu_tu = (select coalesce(max(thu_tu), 0) + 1 from dai_bdm_o where chu_de_id = p_chu_de_moi)
     where chu_de_id = p_chu_de_cu and chuyen_de_id = p_chuyen_de_id;
    if not found then raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de_id, p_chu_de_cu; end if;
  end if;
end $$;

-- NÂNG dạng bài thành nhóm bài (đặt vào ô chỉ định). Ví dụ của dạng bài thành lý thuyết của nhóm mới.
create or replace function fn_bdm_nang_dang_bai(p_id text, p_chu_de_id text, p_chuyen_de_id text)
returns text language plpgsql as $$
declare
  d dai_bdm_dang_bai;
  v_nhom text;
begin
  select * into d from dai_bdm_dang_bai where id = p_id;
  if not found then raise exception 'Không tìm thấy dạng bài %', p_id; end if;
  insert into dai_bdm_nhom (chu_de_id, chuyen_de_id, ten, mo_ta, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file)
  values (p_chu_de_id, p_chuyen_de_id, d.ten, d.mo_ta, d.vi_du, d.vi_du_file_url, d.vi_du_ten_file)
  returning id into v_nhom;
  delete from dai_bdm_dang_bai where id = p_id;
  return v_nhom;
end $$;

-- HẠ nhóm bài thành dạng bài của nhóm khác. Chỉ khi nhóm KHÔNG còn dạng bài con
-- (có con thì người chuyển con đi trước — không tự quyết thay người). Lý thuyết nhóm thành ví dụ.
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
    raise exception 'Nhóm "%" còn dạng bài bên trong — chuyển các dạng bài đi trước rồi mới hạ', n.ten;
  end if;
  insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, vi_du, vi_du_file_url, vi_du_ten_file)
  values (p_nhom_dich, n.ten, n.mo_ta, n.ly_thuyet, n.ly_thuyet_file_url, n.ly_thuyet_ten_file)
  returning id into v_db;
  delete from dai_bdm_nhom where id = p_id;
  return v_db;
end $$;

revoke execute on function fn_bdm_cay(text), fn_bdm_sap_xep(text, text[]),
  fn_bdm_chuyen_nhom(text, text, text, text[]), fn_bdm_chuyen_dang_bai(text, text, text[]),
  fn_bdm_chuyen_o(text, text, text), fn_bdm_nang_dang_bai(text, text, text), fn_bdm_ha_nhom(text, text)
  from public, anon;
grant execute on function fn_bdm_cay(text), fn_bdm_sap_xep(text, text[]),
  fn_bdm_chuyen_nhom(text, text, text, text[]), fn_bdm_chuyen_dang_bai(text, text, text[]),
  fn_bdm_chuyen_o(text, text, text), fn_bdm_nang_dang_bai(text, text, text), fn_bdm_ha_nhom(text, text)
  to authenticated;
