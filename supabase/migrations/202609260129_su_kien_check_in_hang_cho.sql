-- ============================================================================
-- 202609260129 — HỆ THỐNG SỰ KIỆN (spec-su-kien.md): check-in · vòng quay · hàng chờ
--                phòng iPad · xu sự kiện · quầy quà. Chạy thật Trung thu 26/09.
-- ----------------------------------------------------------------------------
-- VÌ SAO (đọc SQL là biết làm gì):
--   · Dữ liệu VẬN HÀNH, không phải học tập ⇒ KHÔNG nhãn môn (§1.6).
--   · Xu sự kiện = tiền RIÊNG (sổ `sk_xu`), KHÔNG đụng ví `qlht_xu_ledger`.
--   · Luật "không quay 2 lần / không cộng xu đúp / 1 HS chỉ 1 chỗ chờ" chặn bằng
--     UNIQUE PARTIAL INDEX ở DB — 2 điện thoại quản trò bấm đua nhau cũng không thủng.
--   · Mọi ghi đi qua RPC `fn_sk_*` (security definer + kiểm la_thanh_vien()); bảng
--     chỉ cho SELECT. Random vòng quay ở Postgres — TV chỉ diễn hoạt ảnh.
--   · `sk_dang_ky` đổi trạng thái ⇒ TRIGGER tự ghi `sk_dang_ky_log` (§4).
--   · Tổng quát cho các sự kiện sau: tỉ lệ vòng quay / số người mỗi lượt nằm trong
--     `sk_su_kien.cau_hinh`, phòng là dòng `sk_phong` — không code cứng Trung thu.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất gì. Toàn bảng/hàm mới, không đụng bảng đang có.
-- ============================================================================

-- ── 1) Bảng ─────────────────────────────────────────────────────────────────
create table if not exists sk_su_kien (
  id         uuid primary key default gen_random_uuid(),
  ten        text not null,
  ngay       date not null,
  trang_thai text not null default 'mo' check (trang_thai in ('mo', 'dong')),
  cau_hinh   jsonb not null default '{"vong_quay":[{"xu":15,"ti_le":25},{"xu":20,"ti_le":50},{"xu":25,"ti_le":25}],"toi_da_luot":6,"so_van":3}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table sk_su_kien is 'Sự kiện (Trung thu…). cau_hinh: vong_quay [{xu,ti_le}], toi_da_luot (người/lượt), so_van (ván/lượt). spec-su-kien.md';

create table if not exists sk_phong (
  id         uuid primary key default gen_random_uuid(),
  su_kien_id uuid not null references sk_su_kien(id),
  ten        text not null,
  hang_doi   boolean not null default true,
  ma_hub     text,                               -- room code iPad hub (games-site) — NULL = phòng không có hub
  thu_tu     smallint not null default 1
);

create table if not exists sk_nguoi_choi (
  id          uuid primary key default gen_random_uuid(),
  su_kien_id  uuid not null references sk_su_kien(id),
  so          integer not null,                  -- số thứ tự trong sự kiện (phân biệt trùng tên — "Lan số 37")
  hoc_sinh_id uuid references hoc_sinh(id),      -- NULL = HS ngoài BK ("không áp dụng", §1.5)
  ten         text not null,
  created_at  timestamptz not null default now(),
  nguoi_ghi   uuid default public.jwt_uid(),
  unique (su_kien_id, so),
  unique (su_kien_id, hoc_sinh_id)
);

create table if not exists sk_checkin (
  nguoi_choi_id uuid primary key references sk_nguoi_choi(id),
  at            timestamptz not null default now(),
  nguoi_ghi     uuid default public.jwt_uid()
);
comment on table sk_checkin is 'Dòng tồn tại = HS BK đã check-in (chỉ HS BK).';

create table if not exists sk_luot (
  id          uuid primary key default gen_random_uuid(),
  phong_id    uuid not null references sk_phong(id),
  game        text not null,
  trang_thai  text not null default 'dang_choi' check (trang_thai in ('dang_choi', 'xong', 'huy')),
  bat_dau_at  timestamptz not null default now(),
  ket_thuc_at timestamptz,                       -- chỉ có khi xong/huỷ (đang chơi = chưa áp dụng)
  nguoi_ghi   uuid default public.jwt_uid()
);
create unique index if not exists sk_luot_1_dang_choi on sk_luot (phong_id) where trang_thai = 'dang_choi';

create table if not exists sk_xu (
  id            uuid primary key default gen_random_uuid(),
  nguoi_choi_id uuid not null references sk_nguoi_choi(id),
  so_xu         integer not null check (so_xu <> 0),
  nguon         text not null check (nguon in ('vong_quay', 'game', 'doi_qua', 'dieu_chinh')),
  luot_id       uuid references sk_luot(id),
  ghi_chu       text,
  at            timestamptz not null default now(),
  nguoi_ghi     uuid default public.jwt_uid()
);
comment on table sk_xu is 'Sổ cái xu SỰ KIỆN (append-only, ± ). Không liên quan ví BK. Dòng vong_quay = chính kết quả quay.';
create unique index if not exists sk_xu_1_vong_quay on sk_xu (nguoi_choi_id) where nguon = 'vong_quay';
create unique index if not exists sk_xu_1_game_luot on sk_xu (luot_id, nguoi_choi_id) where nguon = 'game';
create index if not exists sk_xu_nguoi_idx on sk_xu (nguoi_choi_id);

create table if not exists sk_dang_ky (
  id             uuid primary key default gen_random_uuid(),
  phong_id       uuid not null references sk_phong(id),
  nguoi_choi_id  uuid not null references sk_nguoi_choi(id),
  trang_thai     text not null default 'cho' check (trang_thai in ('cho', 'co_mat', 'dang_choi', 'xong', 'bo', 'huy')),
  so_lan_bo_qua  smallint not null default 0,
  luot_id        uuid references sk_luot(id),     -- chỉ khi đã vào lượt
  slot           smallint,                        -- chỉ khi đã vào lượt
  created_at     timestamptz not null default now(),  -- = THỨ TỰ HÀNG (bỏ qua lần 1 không đổi vị trí)
  updated_at     timestamptz not null default now()
);
create unique index if not exists sk_dang_ky_1_cho on sk_dang_ky (nguoi_choi_id) where trang_thai in ('cho', 'co_mat', 'dang_choi');
create index if not exists sk_dang_ky_phong_idx on sk_dang_ky (phong_id, trang_thai, created_at);

create table if not exists sk_dang_ky_log (
  id         uuid primary key default gen_random_uuid(),
  dang_ky_id uuid not null,
  cu         jsonb,
  moi        jsonb not null,
  actor      uuid,
  ts         timestamptz not null default now()
);

create or replace function public._sk_dang_ky_log() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and old.trang_thai = new.trang_thai and old.so_lan_bo_qua = new.so_lan_bo_qua
     and old.slot is not distinct from new.slot then
    return new;
  end if;
  insert into sk_dang_ky_log (dang_ky_id, cu, moi, actor)
  values (new.id,
          case when tg_op = 'UPDATE' then jsonb_build_object('trang_thai', old.trang_thai, 'so_lan_bo_qua', old.so_lan_bo_qua, 'slot', old.slot) end,
          jsonb_build_object('trang_thai', new.trang_thai, 'so_lan_bo_qua', new.so_lan_bo_qua, 'slot', new.slot),
          public.jwt_uid());
  return new;
end $$;
drop trigger if exists sk_dang_ky_log_trg on sk_dang_ky;
create trigger sk_dang_ky_log_trg after insert or update on sk_dang_ky
  for each row execute function public._sk_dang_ky_log();

-- ── 2) RLS: thành viên đọc; ghi CHỈ qua RPC ──────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['sk_su_kien','sk_phong','sk_nguoi_choi','sk_checkin','sk_luot','sk_xu','sk_dang_ky','sk_dang_ky_log'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_member_doc', t);
    execute format('create policy %I on %I for select to authenticated using (public.la_thanh_vien())', t || '_member_doc', t);
    execute format('grant select on %I to authenticated', t);
    if exists (select 1 from pg_roles where rolname = 'claude_ro') then
      execute format('drop policy if exists claude_ro_select on %I', t);
      execute format('create policy claude_ro_select on %I for select to claude_ro using (true)', t);
    end if;
  end loop;
end $$;

-- ── 3) Hàm nội bộ ───────────────────────────────────────────────────────────
create or replace function public._sk_chan() returns void language plpgsql stable security definer set search_path = public as $$
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự BK mới thao tác được.'; end if;
end $$;

create or replace function public._sk_so_du(p_nguoi uuid) returns integer language sql stable security definer set search_path = public as $$
  select coalesce(sum(so_xu), 0)::int from sk_xu where nguoi_choi_id = p_nguoi
$$;

-- Cấp số thứ tự kế tiếp: khoá dòng sự kiện để 2 laptop không cấp trùng số.
create or replace function public._sk_cap_so(p_su_kien uuid) returns integer language plpgsql security definer set search_path = public as $$
declare n int;
begin
  perform 1 from sk_su_kien where id = p_su_kien for update;
  if not found then raise exception 'Không tìm thấy sự kiện.'; end if;
  select coalesce(max(so), 0) + 1 into n from sk_nguoi_choi where su_kien_id = p_su_kien;
  return n;
end $$;

-- ── 4) RPC ──────────────────────────────────────────────────────────────────

-- Người chơi (dòng sk_nguoi_choi) cho 1 HS BK — tạo nếu chưa có. Idempotent.
create or replace function public.fn_sk_nguoi_choi_bk(p_su_kien uuid, p_hoc_sinh uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid; v_ten text;
begin
  perform public._sk_chan();
  select id into v from sk_nguoi_choi where su_kien_id = p_su_kien and hoc_sinh_id = p_hoc_sinh;
  if v is not null then return v; end if;
  select ho_ten into v_ten from hoc_sinh where id = p_hoc_sinh;
  if v_ten is null then raise exception 'Không tìm thấy học sinh.'; end if;
  insert into sk_nguoi_choi (su_kien_id, so, hoc_sinh_id, ten)
  values (p_su_kien, public._sk_cap_so(p_su_kien), p_hoc_sinh, v_ten)
  on conflict (su_kien_id, hoc_sinh_id) do nothing
  returning id into v;
  if v is null then select id into v from sk_nguoi_choi where su_kien_id = p_su_kien and hoc_sinh_id = p_hoc_sinh; end if;
  return v;
end $$;

create or replace function public.fn_sk_checkin(p_su_kien uuid, p_hoc_sinh uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public.fn_sk_nguoi_choi_bk(p_su_kien, p_hoc_sinh);
  insert into sk_checkin (nguoi_choi_id) values (v) on conflict do nothing;
  return v;
end $$;

create or replace function public.fn_sk_them_khach(p_su_kien uuid, p_ten text)
returns table (id uuid, so int)
language plpgsql security definer set search_path = public as $$
declare v_ten text := btrim(coalesce(p_ten, ''));
begin
  perform public._sk_chan();
  if v_ten = '' then raise exception 'Nhập tên bạn.'; end if;
  return query
    insert into sk_nguoi_choi as n (su_kien_id, so, hoc_sinh_id, ten)
    values (p_su_kien, public._sk_cap_so(p_su_kien), null, v_ten)
    returning n.id, n.so;
end $$;

-- Tìm theo tên (không dấu) hoặc số: HS BK đang học (kể cả chưa là người chơi) + khách đã có số.
create or replace function public.fn_sk_tim(p_su_kien uuid, p_q text)
returns table (
  nguoi_choi_id uuid, hoc_sinh_id uuid, ten text, so int, lop text, la_khach boolean,
  da_checkin boolean, xu_quay int, so_du int, dang_ky_id uuid, dang_ky_trang_thai text, phong_ten text
)
language plpgsql stable security definer set search_path = public as $$
declare q text := public.fn_bo_dau(btrim(coalesce(p_q, ''))); v_so int;
begin
  perform public._sk_chan();
  if q = '' then return; end if;
  if ltrim(q, '#') ~ '^[0-9]+$' then v_so := ltrim(q, '#')::int; end if;
  return query
  with ung as (
    -- HS BK đang học khớp tên
    select h.id as hs_id, h.ho_ten as ten_goc, nc.id as nc_id, nc.so as nc_so
    from hoc_sinh h
    left join sk_nguoi_choi nc on nc.su_kien_id = p_su_kien and nc.hoc_sinh_id = h.id
    where v_so is null and h.trang_thai = 'dang_hoc' and public.fn_bo_dau(h.ho_ten) like '%' || q || '%'
    union all
    -- người chơi của sự kiện khớp số / khách khớp tên (HS BK đã có ở nhánh trên)
    select nc.hoc_sinh_id, nc.ten, nc.id, nc.so
    from sk_nguoi_choi nc
    where nc.su_kien_id = p_su_kien
      and ((v_so is not null and nc.so = v_so)
           or (v_so is null and nc.hoc_sinh_id is null and public.fn_bo_dau(nc.ten) like '%' || q || '%'))
  )
  select u.nc_id, u.hs_id, u.ten_goc, u.nc_so,
         (select string_agg(distinct l.ten_lop, ', ') from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
           where hl.hoc_sinh_id = u.hs_id and hl.trang_thai = 'dang_hoc'),
         u.hs_id is null,
         exists (select 1 from sk_checkin c where c.nguoi_choi_id = u.nc_id),
         (select x.so_xu from sk_xu x where x.nguoi_choi_id = u.nc_id and x.nguon = 'vong_quay'),
         case when u.nc_id is null then 0 else public._sk_so_du(u.nc_id) end,
         dk.id, dk.trang_thai, p.ten
  from ung u
  left join sk_dang_ky dk on dk.nguoi_choi_id = u.nc_id and dk.trang_thai in ('cho', 'co_mat', 'dang_choi')
  left join sk_phong p on p.id = dk.phong_id
  order by (public.fn_bo_dau(u.ten_goc) like q || '%') desc, u.ten_goc
  limit 30;
end $$;

-- Vòng quay: random có trọng số theo cau_hinh. Idempotent — đã quay thì trả lại kết quả cũ.
create or replace function public.fn_sk_quay(p_nguoi uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare nc record; v_cfg jsonb; v_tong numeric; v_r numeric; v_acc numeric := 0; seg jsonb; v_xu int; v_cu int;
begin
  perform public._sk_chan();
  select * into nc from sk_nguoi_choi where id = p_nguoi for update;
  if not found then raise exception 'Không tìm thấy người chơi.'; end if;
  if nc.hoc_sinh_id is null then raise exception 'Vòng quay chỉ dành cho học sinh BK.'; end if;
  if not exists (select 1 from sk_checkin where nguoi_choi_id = p_nguoi) then raise exception 'Bạn chưa check-in.'; end if;
  select so_xu into v_cu from sk_xu where nguoi_choi_id = p_nguoi and nguon = 'vong_quay';
  if v_cu is not null then return jsonb_build_object('xu', v_cu, 'da_quay', true); end if;

  select cau_hinh->'vong_quay' into v_cfg from sk_su_kien where id = nc.su_kien_id;
  select sum((e->>'ti_le')::numeric) into v_tong from jsonb_array_elements(v_cfg) e;
  if v_tong is null or v_tong <= 0 then raise exception 'Sự kiện chưa cấu hình vòng quay.'; end if;
  v_r := random() * v_tong;
  for seg in select e from jsonb_array_elements(v_cfg) e loop
    v_acc := v_acc + (seg->>'ti_le')::numeric;
    v_xu := (seg->>'xu')::int;
    exit when v_r < v_acc;
  end loop;
  insert into sk_xu (nguoi_choi_id, so_xu, nguon, ghi_chu) values (p_nguoi, v_xu, 'vong_quay', 'Vòng quay check-in');
  return jsonb_build_object('xu', v_xu, 'da_quay', false);
end $$;

-- Mấy lượt quay mới nhất — TV vòng quay poll/nghe realtime rồi diễn.
create or replace function public.fn_sk_quay_gan_day(p_su_kien uuid, p_limit int default 10)
returns table (id uuid, ten text, so int, xu int, at timestamptz)
language sql stable security definer set search_path = public as $$
  select x.id, nc.ten, nc.so, x.so_xu, x.at
  from sk_xu x join sk_nguoi_choi nc on nc.id = x.nguoi_choi_id
  where nc.su_kien_id = p_su_kien and x.nguon = 'vong_quay' and public.la_thanh_vien()
  order by x.at desc
  limit least(greatest(p_limit, 1), 50)
$$;

create or replace function public.fn_sk_dang_ky(p_phong uuid, p_nguoi uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid; v_ph record; v_cu text;
begin
  perform public._sk_chan();
  select * into v_ph from sk_phong where id = p_phong;
  if not found then raise exception 'Không tìm thấy phòng.'; end if;
  if not v_ph.hang_doi then raise exception 'Phòng % không dùng hàng chờ.', v_ph.ten; end if;
  if not exists (select 1 from sk_nguoi_choi where id = p_nguoi and su_kien_id = v_ph.su_kien_id) then
    raise exception 'Người chơi không thuộc sự kiện này.';
  end if;
  select p.ten into v_cu from sk_dang_ky d join sk_phong p on p.id = d.phong_id
   where d.nguoi_choi_id = p_nguoi and d.trang_thai in ('cho', 'co_mat', 'dang_choi');
  if v_cu is not null then raise exception 'Bạn này đang có chỗ ở hàng % rồi — chơi xong mới đăng ký lại được.', v_cu; end if;
  begin
    insert into sk_dang_ky (phong_id, nguoi_choi_id) values (p_phong, p_nguoi) returning id into v;
  exception when unique_violation then
    raise exception 'Bạn này vừa được đăng ký ở máy khác.';
  end;
  return v;
end $$;

-- Quản trò đánh dấu: co_mat | bo_qua | tra_ve (co_mat→cho) | huy. Trả về dòng sau khi đổi.
create or replace function public.fn_sk_danh_dau(p_dang_ky uuid, p_hanh_dong text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare d record; v_max int; v_n int;
begin
  perform public._sk_chan();
  select * into d from sk_dang_ky where id = p_dang_ky;
  if not found then raise exception 'Không tìm thấy lượt đăng ký.'; end if;
  -- khoá PHÒNG trước: 2 điện thoại cùng bấm "có mặt" không vượt quá số người/lượt
  perform 1 from sk_phong where id = d.phong_id for update;
  select * into d from sk_dang_ky where id = p_dang_ky for update;

  if p_hanh_dong = 'co_mat' then
    if d.trang_thai <> 'cho' then raise exception 'Bạn này không còn ở hàng chờ.'; end if;
    select coalesce((s.cau_hinh->>'toi_da_luot')::int, 6) into v_max
      from sk_phong p join sk_su_kien s on s.id = p.su_kien_id where p.id = d.phong_id;
    select count(*) into v_n from sk_dang_ky where phong_id = d.phong_id and trang_thai = 'co_mat';
    if v_n >= v_max then raise exception 'Lượt kế đã đủ % bạn.', v_max; end if;
    update sk_dang_ky set trang_thai = 'co_mat', updated_at = now() where id = p_dang_ky;
  elsif p_hanh_dong = 'bo_qua' then
    if d.trang_thai not in ('cho', 'co_mat') then raise exception 'Bạn này không còn ở hàng chờ.'; end if;
    update sk_dang_ky
       set so_lan_bo_qua = so_lan_bo_qua + 1,
           trang_thai = case when so_lan_bo_qua + 1 >= 2 then 'bo' else 'cho' end,
           updated_at = now()
     where id = p_dang_ky;
  elsif p_hanh_dong = 'tra_ve' then
    if d.trang_thai <> 'co_mat' then raise exception 'Chỉ đưa lại hàng chờ được bạn đang ở lượt kế.'; end if;
    update sk_dang_ky set trang_thai = 'cho', updated_at = now() where id = p_dang_ky;
  elsif p_hanh_dong = 'huy' then
    if d.trang_thai not in ('cho', 'co_mat') then raise exception 'Chỉ huỷ được bạn đang chờ.'; end if;
    update sk_dang_ky set trang_thai = 'huy', updated_at = now() where id = p_dang_ky;
  else
    raise exception 'Hành động không hợp lệ: %', p_hanh_dong;
  end if;
  select * into d from sk_dang_ky where id = p_dang_ky;
  return to_jsonb(d);
end $$;

-- Bắt đầu lượt: gán slot 1..n cho các bạn "có mặt" theo thứ tự hàng.
create or replace function public.fn_sk_bat_dau(p_phong uuid, p_game text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_luot uuid; v_n int;
begin
  perform public._sk_chan();
  perform 1 from sk_phong where id = p_phong for update;
  if not found then raise exception 'Không tìm thấy phòng.'; end if;
  if exists (select 1 from sk_luot where phong_id = p_phong and trang_thai = 'dang_choi') then
    raise exception 'Phòng đang có lượt chơi — kết thúc lượt đó trước.';
  end if;
  select count(*) into v_n from sk_dang_ky where phong_id = p_phong and trang_thai = 'co_mat';
  if v_n = 0 then raise exception 'Chưa có bạn nào "có mặt" cho lượt này.'; end if;
  insert into sk_luot (phong_id, game) values (p_phong, coalesce(nullif(btrim(p_game), ''), 'khac')) returning id into v_luot;
  update sk_dang_ky d set trang_thai = 'dang_choi', luot_id = v_luot, slot = x.slot, updated_at = now()
  from (select id, row_number() over (order by created_at) as slot
          from sk_dang_ky where phong_id = p_phong and trang_thai = 'co_mat') x
  where d.id = x.id;
  return (select jsonb_build_object('luot_id', v_luot, 'nguoi',
            coalesce(jsonb_agg(jsonb_build_object('slot', d.slot, 'ten', nc.ten, 'so', nc.so, 'dang_ky_id', d.id) order by d.slot), '[]'::jsonb))
          from sk_dang_ky d join sk_nguoi_choi nc on nc.id = d.nguoi_choi_id where d.luot_id = v_luot);
end $$;

-- Kết thúc lượt: p_ket_qua = [{slot, xu}] (tổng xu các ván). Cộng xu + trả HS về rảnh. 1 transaction.
create or replace function public.fn_sk_ket_thuc(p_luot uuid, p_ket_qua jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare l record; d record; v_xu int; v_tong int := 0;
begin
  perform public._sk_chan();
  select * into l from sk_luot where id = p_luot for update;
  if not found then raise exception 'Không tìm thấy lượt.'; end if;
  if l.trang_thai <> 'dang_choi' then raise exception 'Lượt này đã kết thúc rồi.'; end if;
  for d in select * from sk_dang_ky where luot_id = p_luot and trang_thai = 'dang_choi' loop
    select coalesce(max((e->>'xu')::int), 0) into v_xu
      from jsonb_array_elements(coalesce(p_ket_qua, '[]'::jsonb)) e where (e->>'slot')::int = d.slot;
    if v_xu < 0 or v_xu > 100 then raise exception 'Xu slot % không hợp lệ: %', d.slot, v_xu; end if;
    if v_xu > 0 then
      insert into sk_xu (nguoi_choi_id, so_xu, nguon, luot_id, ghi_chu)
      values (d.nguoi_choi_id, v_xu, 'game', p_luot, l.game || ' · slot ' || d.slot)
      on conflict do nothing;
      v_tong := v_tong + v_xu;
    end if;
    update sk_dang_ky set trang_thai = 'xong', updated_at = now() where id = d.id;
  end loop;
  update sk_luot set trang_thai = 'xong', ket_thuc_at = now() where id = p_luot;
  return jsonb_build_object('tong_xu', v_tong);
end $$;

-- Huỷ lượt (bấm nhầm / iPad lỗi): các bạn quay lại "lượt kế", không ai được xu.
create or replace function public.fn_sk_huy_luot(p_luot uuid) returns void
language plpgsql security definer set search_path = public as $$
declare l record;
begin
  perform public._sk_chan();
  select * into l from sk_luot where id = p_luot for update;
  if not found or l.trang_thai <> 'dang_choi' then raise exception 'Lượt không còn đang chơi.'; end if;
  update sk_dang_ky set trang_thai = 'co_mat', luot_id = null, slot = null, updated_at = now()
   where luot_id = p_luot and trang_thai = 'dang_choi';
  update sk_luot set trang_thai = 'huy', ket_thuc_at = now() where id = p_luot;
end $$;

create or replace function public.fn_sk_doi_qua(p_nguoi uuid, p_xu int, p_ghi_chu text) returns int
language plpgsql security definer set search_path = public as $$
declare v_du int;
begin
  perform public._sk_chan();
  if p_xu is null or p_xu <= 0 then raise exception 'Số xu đổi phải > 0.'; end if;
  perform 1 from sk_nguoi_choi where id = p_nguoi for update;
  if not found then raise exception 'Không tìm thấy người chơi.'; end if;
  v_du := public._sk_so_du(p_nguoi);
  if v_du < p_xu then raise exception 'Không đủ xu: còn %, cần %.', v_du, p_xu; end if;
  insert into sk_xu (nguoi_choi_id, so_xu, nguon, ghi_chu) values (p_nguoi, -p_xu, 'doi_qua', nullif(btrim(coalesce(p_ghi_chu, '')), ''));
  return v_du - p_xu;
end $$;

-- Điều chỉnh tay (cộng bù / trừ sai sót). Có ghi chú bắt buộc — vết nằm ngay trong sổ.
create or replace function public.fn_sk_dieu_chinh(p_nguoi uuid, p_xu int, p_ghi_chu text) returns int
language plpgsql security definer set search_path = public as $$
declare v_du int;
begin
  perform public._sk_chan();
  if p_xu is null or p_xu = 0 then raise exception 'Số xu điều chỉnh phải khác 0.'; end if;
  if btrim(coalesce(p_ghi_chu, '')) = '' then raise exception 'Ghi lý do điều chỉnh.'; end if;
  perform 1 from sk_nguoi_choi where id = p_nguoi for update;
  if not found then raise exception 'Không tìm thấy người chơi.'; end if;
  v_du := public._sk_so_du(p_nguoi);
  if v_du + p_xu < 0 then raise exception 'Số dư không được âm (còn %).', v_du; end if;
  insert into sk_xu (nguoi_choi_id, so_xu, nguon, ghi_chu) values (p_nguoi, p_xu, 'dieu_chinh', btrim(p_ghi_chu));
  return v_du + p_xu;
end $$;

create or replace function public.fn_sk_lich_su_xu(p_nguoi uuid)
returns table (id uuid, so_xu int, nguon text, ghi_chu text, at timestamptz)
language sql stable security definer set search_path = public as $$
  select x.id, x.so_xu, x.nguon, x.ghi_chu, x.at from sk_xu x
  where x.nguoi_choi_id = p_nguoi and public.la_thanh_vien()
  order by x.at desc limit 100
$$;

-- Tổng quan: số liệu sự kiện + theo phòng (lượt đang chơi · lượt kế · hàng chờ theo thứ tự).
create or replace function public.fn_sk_tong_quan(p_su_kien uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sk_chan();
  return (
    select jsonb_build_object(
      'su_kien', to_jsonb(s),
      'tong_nguoi', (select count(*) from sk_nguoi_choi where su_kien_id = s.id),
      'tong_khach', (select count(*) from sk_nguoi_choi where su_kien_id = s.id and hoc_sinh_id is null),
      'tong_checkin', (select count(*) from sk_checkin c join sk_nguoi_choi n on n.id = c.nguoi_choi_id where n.su_kien_id = s.id),
      'tong_quay', (select count(*) from sk_xu x join sk_nguoi_choi n on n.id = x.nguoi_choi_id where n.su_kien_id = s.id and x.nguon = 'vong_quay'),
      'xu_phat', (select coalesce(sum(x.so_xu), 0) from sk_xu x join sk_nguoi_choi n on n.id = x.nguoi_choi_id where n.su_kien_id = s.id and x.so_xu > 0),
      'xu_doi', (select coalesce(-sum(x.so_xu), 0) from sk_xu x join sk_nguoi_choi n on n.id = x.nguoi_choi_id where n.su_kien_id = s.id and x.nguon = 'doi_qua'),
      'phong', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', p.id, 'ten', p.ten, 'hang_doi', p.hang_doi, 'ma_hub', p.ma_hub,
          'luot', (select jsonb_build_object('id', l.id, 'game', l.game, 'bat_dau_at', l.bat_dau_at,
                     'nguoi', coalesce((select jsonb_agg(jsonb_build_object('dang_ky_id', d.id, 'slot', d.slot, 'ten', n.ten, 'so', n.so) order by d.slot)
                                 from sk_dang_ky d join sk_nguoi_choi n on n.id = d.nguoi_choi_id
                                 where d.luot_id = l.id and d.trang_thai = 'dang_choi'), '[]'::jsonb))
                   from sk_luot l where l.phong_id = p.id and l.trang_thai = 'dang_choi'),
          'co_mat', coalesce((select jsonb_agg(jsonb_build_object('dang_ky_id', d.id, 'ten', n.ten, 'so', n.so, 'la_khach', n.hoc_sinh_id is null, 'so_lan_bo_qua', d.so_lan_bo_qua) order by d.created_at)
                     from sk_dang_ky d join sk_nguoi_choi n on n.id = d.nguoi_choi_id
                     where d.phong_id = p.id and d.trang_thai = 'co_mat'), '[]'::jsonb),
          'cho', coalesce((select jsonb_agg(jsonb_build_object('dang_ky_id', d.id, 'ten', n.ten, 'so', n.so, 'la_khach', n.hoc_sinh_id is null, 'so_lan_bo_qua', d.so_lan_bo_qua) order by d.created_at)
                     from sk_dang_ky d join sk_nguoi_choi n on n.id = d.nguoi_choi_id
                     where d.phong_id = p.id and d.trang_thai = 'cho'), '[]'::jsonb),
          'so_luot_xong', (select count(*) from sk_luot l where l.phong_id = p.id and l.trang_thai = 'xong')
        ) order by p.thu_tu, p.ten)
        from sk_phong p where p.su_kien_id = s.id), '[]'::jsonb)
    )
    from sk_su_kien s where s.id = p_su_kien
  );
end $$;

-- Cài đặt phòng (thêm/sửa). p_id NULL = thêm mới.
create or replace function public.fn_sk_luu_phong(p_su_kien uuid, p_id uuid, p_ten text, p_ma_hub text, p_hang_doi boolean, p_thu_tu int)
returns uuid language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  perform public._sk_chan();
  if btrim(coalesce(p_ten, '')) = '' then raise exception 'Nhập tên phòng.'; end if;
  if p_id is null then
    insert into sk_phong (su_kien_id, ten, ma_hub, hang_doi, thu_tu)
    values (p_su_kien, btrim(p_ten), nullif(btrim(coalesce(p_ma_hub, '')), ''), coalesce(p_hang_doi, true), coalesce(p_thu_tu, 1))
    returning id into v;
  else
    update sk_phong set ten = btrim(p_ten), ma_hub = nullif(btrim(coalesce(p_ma_hub, '')), ''),
           hang_doi = coalesce(p_hang_doi, hang_doi), thu_tu = coalesce(p_thu_tu, thu_tu)
     where id = p_id and su_kien_id = p_su_kien returning id into v;
  end if;
  return v;
end $$;

-- Cài đặt sự kiện (tạo mới / sửa tên, ngày, cấu hình, đóng/mở). p_id NULL = tạo mới.
create or replace function public.fn_sk_luu_su_kien(p_id uuid, p_ten text, p_ngay date, p_cau_hinh jsonb, p_trang_thai text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  perform public._sk_chan();
  if btrim(coalesce(p_ten, '')) = '' then raise exception 'Nhập tên sự kiện.'; end if;
  if p_cau_hinh is not null and jsonb_typeof(p_cau_hinh->'vong_quay') is distinct from 'array' then
    raise exception 'cau_hinh.vong_quay phải là danh sách [{xu, ti_le}].';
  end if;
  if p_id is null then
    insert into sk_su_kien (ten, ngay, cau_hinh, trang_thai)
    values (btrim(p_ten), coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date),
            coalesce(p_cau_hinh, '{"vong_quay":[{"xu":15,"ti_le":25},{"xu":20,"ti_le":50},{"xu":25,"ti_le":25}],"toi_da_luot":6,"so_van":3}'::jsonb),
            coalesce(p_trang_thai, 'mo'))
    returning id into v;
  else
    update sk_su_kien set ten = btrim(p_ten), ngay = coalesce(p_ngay, ngay), cau_hinh = coalesce(p_cau_hinh, cau_hinh),
           trang_thai = coalesce(p_trang_thai, trang_thai)
     where id = p_id returning id into v;
  end if;
  return v;
end $$;

-- ── 5) Quyền hàm: chỉ authenticated (anon không gọi được — bài học mig 202609182334) ──
do $$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public' and (p.proname like 'fn\_sk\_%' or p.proname like '\_sk\_%') loop
    execute format('revoke all on function %s from public', f.sig);
    begin execute format('revoke all on function %s from anon', f.sig); exception when others then null; end;
    execute format('grant execute on function %s to authenticated', f.sig);
  end loop;
end $$;

-- ── 6) Realtime ─────────────────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['sk_dang_ky','sk_luot','sk_xu','sk_checkin','sk_nguoi_choi'] loop
    begin
      if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
        execute format('alter publication supabase_realtime add table public.%I', t);
      end if;
    exception when insufficient_privilege then
      raise warning 'Không đủ quyền thêm % vào supabase_realtime — chạy tay: alter publication supabase_realtime add table public.%;', t, t;
    end;
  end loop;
end $$;

-- ── 7) Seed: Trung thu 26/09 + phòng iPad (room hub BK01) ────────────────────
do $$
declare v uuid;
begin
  if not exists (select 1 from sk_su_kien where ten = 'Trung thu 2026') then
    insert into sk_su_kien (ten, ngay) values ('Trung thu 2026', date '2026-09-26') returning id into v;
    insert into sk_phong (su_kien_id, ten, hang_doi, ma_hub, thu_tu) values (v, 'Phòng iPad', true, 'BK01', 1);
  end if;
end $$;
