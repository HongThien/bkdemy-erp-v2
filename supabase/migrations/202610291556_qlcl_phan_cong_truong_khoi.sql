-- ============================================================================
-- qlcl_phan_cong_truong_khoi — Thùy 29/10, spec-truong-khoi.md P1 (gộp phân quyền).
--
-- 1. Team "Quản lý chất lượng" (qlcl) + vai trò "Quản lý chất lượng".
-- 2. Bảng phan_cong_quan_ly_khoi (mon, khoi, vai) = NGUỒN DUY NHẤT "ai quản ô (môn × khối) nào".
--    Một ô đúng 1 Trưởng (+ tối đa 1 Phó) — khoá chính chặn trùng. Đổi người có vết (trigger → _log).
--    Dữ liệu ban đầu = chuyển 1 lần hiện trạng sơ đồ (Trưởng/Phó khối team Trợ giảng) + 8T = Thùy.
--    Từ nay sửa ở màn Phân công (fn_qlcl_phan_cong_luu), KHÔNG suy từ ghế / tên ghế.
-- 3. Chuyển 6 ghế "Trưởng khối …" từ team ta sang team qlcl (tên chung "Trưởng khối", cap thanh_vien).
--    Ghế Phó khối giữ ở team ta, cha vẫn là ghế trưởng khối (giờ khác team — cây đã đi xuyên team).
--    Dương, Đạt còn lớp trợ giảng mà ghế TA duy nhất là ghế trưởng khối ⇒ thêm 1 ghế Trợ giảng thường.
-- 4. Mọi chỗ đọc phạm vi khối đổi sang bảng mới:
--    _khoi_quan_ly (⇒ _khoi_van_hanh · _khoi_nguoi_theo_doi · fn_khoi_cua_toi · fn_khoi_quan_ly_ds) ·
--    fn_gay_pham_vi_khoi (bỏ gay_quyen_khoi) · troly_ca_nhan_khoi.
-- 5. hoi_dap_ds_tai_khoan: bỏ 3 uuid gõ cứng ⇒ người có ghế team core (đúng 3 người hiện tại, không đổi hành vi).
--
-- KHÔNG xoá gì: gay_quyen_khoi, vi_tri.khoi_quan_ly, phan_cong_khoi để nguyên (hết đọc) — xoá sau theo Luật xoá.
-- ============================================================================

-- ── 1. Team + vai trò ────────────────────────────────────────────────────────
insert into team (ma, ten, thu_tu)
select 'qlcl', 'Quản lý chất lượng', 8
where not exists (select 1 from team where ma = 'qlcl');

insert into vai_tro (ten, mo_ta)
select 'Quản lý chất lượng', 'Trưởng khối / team QLCL (spec-truong-khoi.md): màn TA + gậy + bổ trợ. Phạm vi khối = bảng phan_cong_quan_ly_khoi.'
where not exists (select 1 from vai_tro where ten = 'Quản lý chất lượng');

-- = màn của vai Trợ giảng (giữ màn TA cho trưởng khối) + gậy + bổ trợ
insert into vai_tro_chuc_nang (vai_tro_id, chuc_nang, chi_xem)
select (select id from vai_tro where ten = 'Quản lý chất lượng'), x.cn, x.cx
from (values ('buoihoc', false), ('cham_mt', true), ('duyetcham', false), ('ketqua', true), ('lamtailieu', false),
             ('tkb', true), ('tl', false), ('tu_qua', false), ('gay', false), ('botro', false), ('botroyeu', false)) x(cn, cx)
on conflict do nothing;

-- ── 2. Bảng phân công + lịch sử ──────────────────────────────────────────────
create table if not exists phan_cong_quan_ly_khoi (
  mon          text not null,
  khoi         text not null,
  vai          text not null check (vai in ('truong', 'pho')),
  nhan_su_id   uuid not null references nhan_su(id),
  phan_cong_boi uuid references nhan_su(id),
  phan_cong_at timestamptz not null default now(),
  primary key (mon, khoi, vai)
);
comment on table phan_cong_quan_ly_khoi is
  'Ai quản ô (môn × khối) — nguồn DUY NHẤT phạm vi Trưởng/Phó khối (spec-truong-khoi.md §2). Ô trống = không có dòng. Sửa qua fn_qlcl_phan_cong_luu.';

create table if not exists phan_cong_quan_ly_khoi_log (
  id          uuid primary key default gen_random_uuid(),
  mon         text not null,
  khoi        text not null,
  vai         text not null,
  ns_cu       uuid references nhan_su(id),
  ns_moi      uuid references nhan_su(id),
  nguoi_sua   uuid references nhan_su(id),
  sua_at      timestamptz not null default now()
);

create or replace function public._pcqlk_ghi_log()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into phan_cong_quan_ly_khoi_log (mon, khoi, vai, ns_cu, ns_moi, nguoi_sua)
    values (new.mon, new.khoi, new.vai, null, new.nhan_su_id, public.current_nhan_su_id());
    return new;
  elsif tg_op = 'UPDATE' then
    if new.nhan_su_id is distinct from old.nhan_su_id then
      insert into phan_cong_quan_ly_khoi_log (mon, khoi, vai, ns_cu, ns_moi, nguoi_sua)
      values (new.mon, new.khoi, new.vai, old.nhan_su_id, new.nhan_su_id, public.current_nhan_su_id());
    end if;
    return new;
  else
    insert into phan_cong_quan_ly_khoi_log (mon, khoi, vai, ns_cu, ns_moi, nguoi_sua)
    values (old.mon, old.khoi, old.vai, old.nhan_su_id, null, public.current_nhan_su_id());
    return old;
  end if;
end $$;

drop trigger if exists pcqlk_log_trg on phan_cong_quan_ly_khoi;
create trigger pcqlk_log_trg after insert or update or delete on phan_cong_quan_ly_khoi
  for each row execute function public._pcqlk_ghi_log();

alter table phan_cong_quan_ly_khoi enable row level security;
alter table phan_cong_quan_ly_khoi_log enable row level security;
drop policy if exists pcqlk_doc on phan_cong_quan_ly_khoi;
create policy pcqlk_doc on phan_cong_quan_ly_khoi for select to authenticated using (public.la_thanh_vien());
drop policy if exists pcqlk_log_doc on phan_cong_quan_ly_khoi_log;
create policy pcqlk_log_doc on phan_cong_quan_ly_khoi_log for select to authenticated using (public.la_thanh_vien());
-- ghi CHỈ qua fn_qlcl_phan_cong_luu (security definer) — không có policy insert/update/delete.

-- ── 3. Chuyển hiện trạng 1 lần (đọc _khoi_quan_ly BẢN CŨ — team ta) + 8T = Thùy ──
insert into phan_cong_quan_ly_khoi (mon, khoi, vai, nhan_su_id)
select distinct on (q.mon, q.khoi, q.cap) q.mon, q.khoi, q.cap, q.nhan_su_id
from public._khoi_quan_ly() q
order by q.mon, q.khoi, q.cap
on conflict do nothing;

insert into phan_cong_quan_ly_khoi (mon, khoi, vai, nhan_su_id)
values ('Toán', '8T', 'truong', '626427c3-d82d-468d-9f47-eb29d1981ee5')  -- Đào Xuân Thùy (Thùy 29/10: "8T do t quản lý")
on conflict (mon, khoi, vai) do update set nhan_su_id = excluded.nhan_su_id;

do $$
declare n int;
begin
  select count(*) into n from phan_cong_quan_ly_khoi where vai = 'truong';
  if n <> 13 then raise exception 'Chuyển hiện trạng lệch: % ô có Trưởng (đợi 13 = 12 khối Toán cũ + 8T)', n; end if;
end $$;

-- ── 4. Ghế: team qlcl ────────────────────────────────────────────────────────
do $$
declare
  v_team uuid := (select id from team where ma = 'qlcl');
  v_vt   uuid := (select id from vai_tro where ten = 'Quản lý chất lượng');
  v_vt_ta uuid := (select id from vai_tro where ten = 'Trợ giảng');
  v_team_ta uuid := (select id from team where ma = 'ta');
  v_thuy uuid := '626427c3-d82d-468d-9f47-eb29d1981ee5';
  v_trang uuid := 'e8573f34-65cf-4069-808c-44f10ee39c2e';
  v_lead uuid; v_ql uuid; n int;
begin
  if exists (select 1 from vi_tri where team_id = v_team) then
    raise notice 'team qlcl đã có ghế — bỏ qua bước dựng ghế'; return;
  end if;
  insert into vi_tri (team_id, ten, cap, nhan_su_id, vai_tro_id, mon)
    values (v_team, 'Lead QLCL', 'truong', v_thuy, v_vt, 'Toán') returning id into v_lead;
  insert into vi_tri (team_id, ten, cap, cha_id, nhan_su_id, vai_tro_id, mon)
    values (v_team, 'Quản lý chất lượng', 'pho', v_lead, v_trang, v_vt, 'Toán') returning id into v_ql;

  -- 6 ghế trưởng khối: đổi team, tên chung (khối nằm ở bảng phân công, không nằm trong tên), cha = ghế Trang
  update vi_tri set team_id = v_team, ten = 'Trưởng khối', cap = 'thanh_vien', vai_tro_id = v_vt, cha_id = v_ql
   where id in ('a1d580d9-4bbb-4f45-a487-c09b947fb6d1', '7fdbd64d-c533-44ff-ac38-7098e48cf188',
                'f7e81500-a57b-4450-b3a8-425219868571', '1a4b167d-ddeb-4360-8243-1e3f032d2c97',
                '0989bb7e-ffe1-449f-8403-987617264730', '4efe13d3-001d-4e7c-8a05-dc2b56f01eb7')
     and team_id = v_team_ta;
  get diagnostics n = row_count;
  if n <> 6 then raise exception 'Chuyển ghế trưởng khối lệch: % ghế (đợi 6)', n; end if;

  -- Dương (Trưởng khối 3 4 5), Đạt (10 11 12): thêm ghế Trợ giảng thường dưới chính ghế trưởng khối của họ
  insert into vi_tri (team_id, ten, cap, cha_id, nhan_su_id, vai_tro_id, mon) values
    (v_team_ta, 'Trợ giảng', 'thanh_vien', '7fdbd64d-c533-44ff-ac38-7098e48cf188', '993ca32c-fea3-41f4-a849-6f8ef922773e', v_vt_ta, 'Toán'),
    (v_team_ta, 'Trợ giảng', 'thanh_vien', 'a1d580d9-4bbb-4f45-a487-c09b947fb6d1', '980f2aca-69dc-4764-9902-60bce642edad', v_vt_ta, 'Toán');

  insert into nhan_su_team (nhan_su_id, team_id)
  select x, v_team from unnest(array[v_thuy, v_trang,
    '980f2aca-69dc-4764-9902-60bce642edad', '993ca32c-fea3-41f4-a849-6f8ef922773e', 'eb539741-92b3-4ecf-bc75-55ba9d62a6ed',
    '1fbe3d7f-986c-4cac-8e5f-cd5af9ff823b', '240555bd-35fb-4aaa-8a3a-084bf7088f52', 'e2253835-ec57-46e0-b351-a26065501547']::uuid[]) x
  where not exists (select 1 from nhan_su_team t where t.nhan_su_id = x and t.team_id = v_team);
end $$;

-- ── 5. Hàm phạm vi ───────────────────────────────────────────────────────────
-- Toàn hệ = admin hoặc ghế cap truong/pho của team qlcl (Thùy, Trang). Theo GHẾ, không uuid.
create or replace function public._qlcl_toan_he()
returns boolean language sql stable security definer set search_path = public as $$
  select public._task_la_admin()
      or exists (select 1 from vi_tri v join team t on t.id = v.team_id and t.ma = 'qlcl'
                  where v.nhan_su_id = public.current_nhan_su_id() and v.cap in ('truong', 'pho'))
$$;

-- Nguồn chung cũ — giữ chữ ký (vi_tri_id giờ luôn null), đổi ruột sang bảng phân công.
create or replace function public._khoi_quan_ly()
returns table (mon text, khoi text, nhan_su_id uuid, cap text, vi_tri_id uuid)
language sql stable security definer set search_path = public as $$
  select p.mon, p.khoi, p.nhan_su_id, p.vai, null::uuid
    from phan_cong_quan_ly_khoi p
    join nhan_su n on n.id = p.nhan_su_id and n.trang_thai = 'dang_lam'
$$;

-- Phạm vi của tôi: toàn hệ ⇒ mọi ô (môn × khối) của lớp đang học, vai 'toan_he'; còn lại ⇒ ô được phân công.
create or replace function public.fn_pham_vi_cua_toi()
returns table (mon text, khoi text, vai text)
language sql stable security definer set search_path = public as $$
  select distinct l.mon, l.khoi, 'toan_he'::text
    from lop l where public._qlcl_toan_he() and l.trang_thai = 'dang_hoc' and l.khoi is not null
  union
  select q.mon, q.khoi, q.cap from public._khoi_quan_ly() q
   where q.nhan_su_id = public.current_nhan_su_id() and not public._qlcl_toan_he()
$$;

create or replace function public._trong_pham_vi(p_mon text, p_khoi text)
returns boolean language sql stable security definer set search_path = public as $$
  select public._qlcl_toan_he()
      or exists (select 1 from public._khoi_quan_ly() q
                  where q.nhan_su_id = public.current_nhan_su_id() and q.mon = p_mon and q.khoi = p_khoi)
$$;

-- Ghi phân công: chỉ toàn hệ (Thùy, Trang). Trưởng phải là thành viên team qlcl. p_nhan_su_id null = bỏ trống ô.
create or replace function public.fn_qlcl_phan_cong_luu(p_mon text, p_khoi text, p_vai text, p_nhan_su_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public._qlcl_toan_he() then raise exception 'Chỉ Lead / Quản lý chất lượng được phân công trưởng khối.'; end if;
  if p_vai not in ('truong', 'pho') then raise exception 'Vai không hợp lệ: %', p_vai; end if;
  if nullif(trim(coalesce(p_mon, '')), '') is null or nullif(trim(coalesce(p_khoi, '')), '') is null then raise exception 'Thiếu môn/khối.'; end if;
  if p_nhan_su_id is null then
    delete from phan_cong_quan_ly_khoi where mon = p_mon and khoi = p_khoi and vai = p_vai;
    return;
  end if;
  if p_vai = 'truong' and not exists (
       select 1 from nhan_su_team nt join team t on t.id = nt.team_id and t.ma = 'qlcl' where nt.nhan_su_id = p_nhan_su_id) then
    raise exception 'Trưởng khối phải là thành viên team Quản lý chất lượng.';
  end if;
  insert into phan_cong_quan_ly_khoi (mon, khoi, vai, nhan_su_id, phan_cong_boi, phan_cong_at)
  values (p_mon, p_khoi, p_vai, p_nhan_su_id, public.current_nhan_su_id(), now())
  on conflict (mon, khoi, vai) do update
    set nhan_su_id = excluded.nhan_su_id, phan_cong_boi = excluded.phan_cong_boi, phan_cong_at = excluded.phan_cong_at;
end $$;

create or replace function public.fn_qlcl_duoc_phan_cong()
returns boolean language sql stable security definer set search_path = public as $$
  select public._qlcl_toan_he()
$$;

-- ── 6. Gậy: đọc bảng phân công (chỉ Trưởng duyệt gậy; Phó không), toàn quyền = toàn hệ QLCL ──
create or replace function public.fn_gay_pham_vi_khoi()
returns jsonb language sql stable security definer set search_path = public as $$
  with me as (select public.current_nhan_su_id() as id, public._qlcl_toan_he() as toan),
  o as (
    select q.mon, q.khoi from public._khoi_quan_ly() q, me
     where q.nhan_su_id = me.id and q.cap = 'truong'
  ),
  lop_toi as (select l.id from lop l join o on o.mon = l.mon and o.khoi = l.khoi)
  select jsonb_build_object(
    'toan_quyen', me.toan,
    'khoi', coalesce((select jsonb_agg(distinct o.khoi) from o), '[]'::jsonb),
    'mon',  coalesce((select jsonb_agg(distinct o.mon) from o), '[]'::jsonb),
    'ns_ids', coalesce((
      select jsonb_agg(distinct pc.nhan_su_id) from phan_cong_lop pc join lop_toi l on l.id = pc.lop_id
       where pc.nhan_su_id <> me.id), '[]'::jsonb),
    'de_xuat_ids', coalesce((
      select jsonb_agg(d.id) from gay_de_xuat d
        join buoi_hoc b on b.id::text = substring(d.ref_key from '^vh:([0-9a-f-]{36})[|]')
        join lop_toi l on l.id = b.lop_id
       where d.trang_thai = 'cho' and d.nhan_su_id <> me.id), '[]'::jsonb))
  from me
$$;

-- ── 7. Trợ lý cá nhân: khối từ bảng phân công (Trưởng hoặc Phó) ──
create or replace function public.troly_ca_nhan_khoi()
returns text[] language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(distinct q.khoi order by q.khoi), '{}')
    from public._khoi_quan_ly() q where q.nhan_su_id = public.current_nhan_su_id()
$$;

-- ── 8. Hỏi đáp / Trợ lý trung tâm: theo ghế team core, bỏ 3 uuid gõ cứng (hiện = đúng 3 người cũ) ──
create or replace function public.hoi_dap_ds_tai_khoan()
returns uuid[] language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(distinct tk.id), '{}')
    from vi_tri v join team t on t.id = v.team_id and t.ma = 'core'
    join nhan_su n on n.id = v.nhan_su_id and n.trang_thai = 'dang_lam'
    join tai_khoan tk on tk.nhan_su_id = n.id
$$;

-- ── Quyền gọi ──
do $$
declare f text;
begin
  foreach f in array array[
    'public._qlcl_toan_he()', 'public._khoi_quan_ly()', 'public.fn_pham_vi_cua_toi()', 'public._trong_pham_vi(text, text)',
    'public.fn_qlcl_phan_cong_luu(text, text, text, uuid)', 'public.fn_qlcl_duoc_phan_cong()', 'public.fn_gay_pham_vi_khoi()',
    'public.troly_ca_nhan_khoi()', 'public.hoi_dap_ds_tai_khoan()', 'public._pcqlk_ghi_log()']
  loop
    execute format('revoke execute on function %s from public', f);
    execute format('revoke execute on function %s from anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
