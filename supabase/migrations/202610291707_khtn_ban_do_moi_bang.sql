-- ============================================================================
-- 202610291707 — khtn_ban_do_moi_bang
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 29/10 "Chuyển bản đồ 4 tầng của KHTN sang thành bản đồ mới giống như Toán. Các tầng tương ứng" — chốt:
--   chủ đề→chủ đề · chuyên đề→chuyên đề · DẠNG cũ→NHÓM BÀI · CỤM cũ→DẠNG BÀI; câu không cụm để "chưa phân" trong nhóm (không
--   đoán, §1.5); đợt này chỉ dựng bản đồ + xếp câu — mastery/ET/giáo trình/bổ trợ/app HS KHTN vẫn chạy bản đồ cũ tới khi bật.
--   BẢNG RIÊNG khtn_bdm_* (y khuôn dai_bdm_* của Toán), KHÔNG nhét vào dai_bdm_*: 67 hàm Toán đọc dai_bdm_* chỉ lọc theo khối ⇒
--   chủ đề KHTN K7–9 sẽ lọt vào bản đồ / mastery / giáo trình Toán cùng khối; và §1.6 "mỗi môn bảng riêng, dispatch 1 registry".
--   Mã gốc riêng (KCD chủ đề · KCH chuyên đề · KNB nhóm · KDB dạng bài) — không trùng NCD/NCH/NNB/NDB của Toán (nhiều chỗ coi
--   'NDB%' là Toán). Cột ma_cu = mã đối tượng ở bản đồ cũ đã sinh ra nó (truy vết; NULL = tạo mới trên bản đồ mới, không áp dụng).
--   Trigger y Toán: tự đánh thu_tu, bump updated_at (cả nhóm khi dạng bài đổi), ghi lịch sử mọi đổi state (khtn_bdm_log, §4),
--   tiền đề chỉ nối nhóm cùng chuyên đề + chặn vòng.
--
-- MẤT GÌ (Luật xoá): Không mất gì — chỉ thêm bảng / hàm / trigger mới.
-- ============================================================================

create sequence if not exists khtn_bdm_chu_de_seq;
create sequence if not exists khtn_bdm_chuyen_de_seq;
create sequence if not exists khtn_bdm_nhom_seq;
create sequence if not exists khtn_bdm_dang_bai_seq;

create table khtn_bdm_chu_de (
  id         text primary key default ('KCD' || lpad(nextval('khtn_bdm_chu_de_seq')::text, 5, '0')),
  khoi       text not null,
  ten        text not null check (btrim(ten) <> ''),
  thu_tu     integer,
  ma_cu      text unique,                         -- ma_chu_de bản đồ cũ (khtn_ban_do) — NULL = tạo mới
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table khtn_bdm_chuyen_de (
  id         text primary key default ('KCH' || lpad(nextval('khtn_bdm_chuyen_de_seq')::text, 5, '0')),
  ten        text not null check (btrim(ten) <> ''),
  mo_ta      text not null default '',
  ma_cu      text unique,                         -- ma_chuyen_de bản đồ cũ
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table khtn_bdm_o (
  chu_de_id    text not null references khtn_bdm_chu_de(id),
  chuyen_de_id text not null references khtn_bdm_chuyen_de(id),
  thu_tu       integer,
  created_at   timestamptz not null default now(),
  primary key (chu_de_id, chuyen_de_id)
);
create table khtn_bdm_nhom (
  id                 text primary key default ('KNB' || lpad(nextval('khtn_bdm_nhom_seq')::text, 5, '0')),
  chu_de_id          text not null,
  chuyen_de_id       text not null,
  ten                text not null check (btrim(ten) <> ''),
  mo_ta              text not null default '',
  ly_thuyet          text not null default '',
  ly_thuyet_file_url text,
  ly_thuyet_ten_file text,
  thu_tu             integer,
  ma_cu              text unique,                 -- ma_dang bản đồ cũ (dạng cũ = nhóm bài)
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  foreign key (chu_de_id, chuyen_de_id) references khtn_bdm_o(chu_de_id, chuyen_de_id) on update cascade
);
create table khtn_bdm_dang_bai (
  id                 text primary key default ('KDB' || lpad(nextval('khtn_bdm_dang_bai_seq')::text, 5, '0')),
  nhom_id            text not null references khtn_bdm_nhom(id),
  ten                text not null check (btrim(ten) <> ''),
  mo_ta              text not null default '',
  vi_du              text not null default '',
  vi_du_file_url     text,
  vi_du_ten_file     text,
  ly_thuyet          text not null default '',
  ly_thuyet_file_url text,
  ly_thuyet_ten_file text,
  thu_tu             integer,
  muc_do             smallint,
  bac_toi_thieu      text check (bac_toi_thieu in ('S', 'A', 'B', 'C', 'D')),
  ma_cu              text unique,                 -- ma_cum bản đồ cũ (cụm cũ = dạng bài)
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create table khtn_bdm_nhom_tien_de (
  nhom_id         text not null references khtn_bdm_nhom(id),
  tien_de_nhom_id text not null references khtn_bdm_nhom(id),
  created_at      timestamptz not null default now(),
  primary key (nhom_id, tien_de_nhom_id),
  check (nhom_id <> tien_de_nhom_id)
);
-- câu ↔ dạng bài (mỗi câu ≤ 1 dạng bài). Không có dòng = câu chưa phân (nằm ở nhóm suy từ dạng cũ của câu).
create table khtn_bdm_gan_cau (
  ma_cau      text primary key references khtn_cau_hoi(ma_cau),
  dang_bai_id text not null references khtn_bdm_dang_bai(id),
  nguon       text not null check (nguon in ('nguoi', 'ai', 'cum')),
  actor       uuid default jwt_uid(),
  at          timestamptz not null default now()
);
create index khtn_bdm_gan_cau_db_idx on khtn_bdm_gan_cau (dang_bai_id);
create index khtn_bdm_nhom_o_idx on khtn_bdm_nhom (chu_de_id, chuyen_de_id);
create index khtn_bdm_dang_bai_nhom_idx on khtn_bdm_dang_bai (nhom_id);
create table khtn_bdm_log (
  id        bigint generated always as identity primary key,
  bang      text not null,
  khoa      text,
  hanh_dong text not null check (hanh_dong in ('them', 'sua', 'xoa')),
  cu        jsonb,
  moi       jsonb,
  actor     uuid default jwt_uid(),
  at        timestamptz not null default now()
);

-- ── trigger ──
create or replace function _khtn_bdm_thu_tu() returns trigger language plpgsql as $$
begin
  if new.thu_tu is not null then return new; end if;
  if tg_table_name = 'khtn_bdm_chu_de' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from khtn_bdm_chu_de where khoi = new.khoi;
  elsif tg_table_name = 'khtn_bdm_o' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from khtn_bdm_o where chu_de_id = new.chu_de_id;
  elsif tg_table_name = 'khtn_bdm_nhom' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from khtn_bdm_nhom where chu_de_id = new.chu_de_id and chuyen_de_id = new.chuyen_de_id;
  elsif tg_table_name = 'khtn_bdm_dang_bai' then
    select coalesce(max(thu_tu), 0) + 1 into new.thu_tu from khtn_bdm_dang_bai where nhom_id = new.nhom_id;
  end if;
  return new;
end $$;
create or replace function _khtn_bdm_ghi_log() returns trigger language plpgsql security definer set search_path to 'public' as $$
declare
  r_cu  jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) end;
  r_moi jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) end;
  r     jsonb := coalesce(r_moi, r_cu);
begin
  if tg_op = 'UPDATE' and (r_cu - 'updated_at') = (r_moi - 'updated_at') then return null; end if;
  insert into khtn_bdm_log (bang, khoa, hanh_dong, cu, moi)
  values (tg_table_name,
          coalesce(r ->> 'id', r ->> 'ma_cau', (r ->> 'chu_de_id') || '|' || (r ->> 'chuyen_de_id'), (r ->> 'nhom_id') || '>' || (r ->> 'tien_de_nhom_id')),
          case tg_op when 'INSERT' then 'them' when 'UPDATE' then 'sua' else 'xoa' end, r_cu, r_moi);
  return null;
end $$;
create or replace function _khtn_bdm_bump_nhom() returns trigger language plpgsql as $$
begin
  update khtn_bdm_nhom set updated_at = now()
   where id in (case when tg_op <> 'INSERT' then old.nhom_id end, case when tg_op <> 'DELETE' then new.nhom_id end);
  return null;
end $$;
create or replace function _khtn_bdm_tien_de_kiem() returns trigger language plpgsql as $$
declare a khtn_bdm_nhom; b khtn_bdm_nhom;
begin
  select * into a from khtn_bdm_nhom where id = new.nhom_id;
  select * into b from khtn_bdm_nhom where id = new.tien_de_nhom_id;
  if (a.chu_de_id, a.chuyen_de_id) is distinct from (b.chu_de_id, b.chuyen_de_id) then
    raise exception 'Đợt này tiền đề chỉ nối các nhóm bài trong cùng một chuyên đề («%» và «%» khác chuyên đề)', a.ten, b.ten;
  end if;
  if exists (
    with recursive t(id) as (
      select tien_de_nhom_id from khtn_bdm_nhom_tien_de where nhom_id = new.tien_de_nhom_id
      union
      select e.tien_de_nhom_id from khtn_bdm_nhom_tien_de e join t on e.nhom_id = t.id
    ) select 1 from t where t.id = new.nhom_id
  ) then
    raise exception 'Tạo vòng tròn: «%» đang phải học sau «%»', b.ten, a.ten;
  end if;
  return new;
end $$;
create or replace function _khtn_bdm_tien_de_cung_o() returns trigger language plpgsql as $$
begin
  if exists (
    select 1 from khtn_bdm_nhom_tien_de e
      join khtn_bdm_nhom x on x.id = e.nhom_id
      join khtn_bdm_nhom y on y.id = e.tien_de_nhom_id
     where (e.nhom_id = new.id or e.tien_de_nhom_id = new.id)
       and (x.chu_de_id, x.chuyen_de_id) is distinct from (y.chu_de_id, y.chuyen_de_id)
  ) then
    raise exception 'Nhóm «%» còn mũi tên tiền đề nối với nhóm ở chuyên đề khác — gỡ mũi tên trước', new.ten;
  end if;
  return null;
end $$;

create trigger trg_khtn_bdm_chu_de_touch before update on khtn_bdm_chu_de for each row execute function _bdm_touch();
create trigger trg_khtn_bdm_chuyen_de_touch before update on khtn_bdm_chuyen_de for each row execute function _bdm_touch();
create trigger trg_khtn_bdm_nhom_touch before update on khtn_bdm_nhom for each row execute function _bdm_touch();
create trigger trg_khtn_bdm_dang_bai_touch before update on khtn_bdm_dang_bai for each row execute function _bdm_touch();
create trigger trg_khtn_bdm_chu_de_thu_tu before insert on khtn_bdm_chu_de for each row execute function _khtn_bdm_thu_tu();
create trigger trg_khtn_bdm_o_thu_tu before insert on khtn_bdm_o for each row execute function _khtn_bdm_thu_tu();
create trigger trg_khtn_bdm_nhom_thu_tu before insert on khtn_bdm_nhom for each row execute function _khtn_bdm_thu_tu();
create trigger trg_khtn_bdm_dang_bai_thu_tu before insert on khtn_bdm_dang_bai for each row execute function _khtn_bdm_thu_tu();
create trigger trg_khtn_bdm_dang_bai_bump after insert or update or delete on khtn_bdm_dang_bai for each row execute function _khtn_bdm_bump_nhom();
create trigger trg_khtn_bdm_tien_de_kiem before insert or update on khtn_bdm_nhom_tien_de for each row execute function _khtn_bdm_tien_de_kiem();
create constraint trigger trg_khtn_bdm_nhom_tien_de_cung_o after update of chu_de_id, chuyen_de_id on khtn_bdm_nhom
  deferrable initially deferred for each row execute function _khtn_bdm_tien_de_cung_o();
create trigger trg_khtn_bdm_chu_de_log after insert or update or delete on khtn_bdm_chu_de for each row execute function _khtn_bdm_ghi_log();
create trigger trg_khtn_bdm_chuyen_de_log after insert or update or delete on khtn_bdm_chuyen_de for each row execute function _khtn_bdm_ghi_log();
create trigger trg_khtn_bdm_o_log after insert or update or delete on khtn_bdm_o for each row execute function _khtn_bdm_ghi_log();
create trigger trg_khtn_bdm_nhom_log after insert or update or delete on khtn_bdm_nhom for each row execute function _khtn_bdm_ghi_log();
create trigger trg_khtn_bdm_dang_bai_log after insert or update or delete on khtn_bdm_dang_bai for each row execute function _khtn_bdm_ghi_log();
create trigger trg_khtn_bdm_nhom_tien_de_log after insert or update or delete on khtn_bdm_nhom_tien_de for each row execute function _khtn_bdm_ghi_log();
create trigger trg_khtn_bdm_gan_cau_log after insert or update or delete on khtn_bdm_gan_cau for each row execute function _khtn_bdm_ghi_log();

-- ── quyền: như dai_bdm_* (nhân sự đọc/ghi; log chỉ đọc) ──
do $$
declare t text;
begin
  foreach t in array array['khtn_bdm_chu_de', 'khtn_bdm_chuyen_de', 'khtn_bdm_o', 'khtn_bdm_nhom', 'khtn_bdm_dang_bai', 'khtn_bdm_nhom_tien_de', 'khtn_bdm_gan_cau'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I on %I for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien())', t || '_member_all', t);
  end loop;
end $$;
alter table khtn_bdm_log enable row level security;
create policy khtn_bdm_log_member_read on khtn_bdm_log for select to authenticated using (la_thanh_vien());
revoke all on khtn_bdm_log from anon;
revoke execute on function _khtn_bdm_thu_tu(), _khtn_bdm_ghi_log(), _khtn_bdm_bump_nhom(), _khtn_bdm_tien_de_kiem(), _khtn_bdm_tien_de_cung_o() from public, anon;
