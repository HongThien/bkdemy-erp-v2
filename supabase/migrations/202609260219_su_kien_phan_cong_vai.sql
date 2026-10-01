-- ============================================================================
-- 202609260219 — SỰ KIỆN: GIAO VIỆC THEO VAI (Thùy 26/09: "giao task check-in, quản trò cho nhân sự,
--                đứa nào không giao thì không thấy gì")
-- ----------------------------------------------------------------------------
-- VÌ SAO (đọc SQL là biết làm gì):
--   · Trước: mọi fn_sk_* chỉ kiểm la_thanh_vien() ⇒ nhân sự nào cũng thấy/làm mọi việc ⇒ lẫn.
--   · Nay: mỗi sự kiện có `sk_phan_cong` (nhân sự × vai). 4 vai = 4 việc:
--       checkin (laptop cửa) · quantro (điện thoại phòng iPad) · quaqua (quầy quà) · quanly (mọi màn + cài đặt + giao việc).
--     Admin hệ thống (`nhan_su.la_admin_he_thong`) = quanly của MỌI sự kiện, không cần giao.
--   · Kiểm Ở DB (mỗi RPC gọi `_sk_can(su_kien, vai[])`); UI chỉ hiện màn theo `fn_sk_cua_toi()`.
--   · Giao theo TỪNG sự kiện: lần sau người trực khác thì giao lại, không dính lần trước.
--   · Đổi giao việc ⇒ TRIGGER ghi `sk_phan_cong_log` (ai giao/gỡ vai gì, lúc nào) — §4.
--   · Các fn_sk_* bên dưới là bản của mig 202609260129, CHỈ thay dòng cổng quyền.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất dữ liệu. 2 bảng mới; hàm create or replace cùng chữ ký.
--   Hành vi đổi (cố ý): nhân sự CHƯA được giao việc sẽ bị chặn, trừ admin hệ thống.
-- ============================================================================

create table if not exists sk_phan_cong (
  su_kien_id uuid not null references sk_su_kien(id),
  nhan_su_id uuid not null references nhan_su(id),
  vai        text not null check (vai in ('checkin', 'quantro', 'quaqua', 'quanly')),
  created_at timestamptz not null default now(),
  nguoi_ghi  uuid default public.jwt_uid(),
  primary key (su_kien_id, nhan_su_id, vai)
);
comment on table sk_phan_cong is 'Giao việc nhân sự × vai cho TỪNG sự kiện. quanly = mọi màn + cài đặt + giao việc. Admin hệ thống ngầm là quanly mọi sự kiện.';

create table if not exists sk_phan_cong_log (
  id         uuid primary key default gen_random_uuid(),
  su_kien_id uuid not null,
  nhan_su_id uuid not null,
  vai        text not null,
  hanh_dong  text not null check (hanh_dong in ('giao', 'go')),
  actor      uuid,
  ts         timestamptz not null default now()
);

create or replace function public._sk_phan_cong_log() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into sk_phan_cong_log (su_kien_id, nhan_su_id, vai, hanh_dong, actor) values (new.su_kien_id, new.nhan_su_id, new.vai, 'giao', public.jwt_uid());
    return new;
  end if;
  insert into sk_phan_cong_log (su_kien_id, nhan_su_id, vai, hanh_dong, actor) values (old.su_kien_id, old.nhan_su_id, old.vai, 'go', public.jwt_uid());
  return old;
end $$;
drop trigger if exists sk_phan_cong_log_trg on sk_phan_cong;
create trigger sk_phan_cong_log_trg after insert or delete on sk_phan_cong
  for each row execute function public._sk_phan_cong_log();

do $$
declare t text;
begin
  foreach t in array array['sk_phan_cong', 'sk_phan_cong_log'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_member_doc', t);
    execute format('create policy %I on %I for select to authenticated using (public.la_thanh_vien())', t || '_member_doc', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('revoke insert, update, delete, truncate, references, trigger on public.%I from authenticated', t);
    execute format('grant select on public.%I to authenticated', t);
    if exists (select 1 from pg_roles where rolname = 'claude_ro') then
      execute format('drop policy if exists claude_ro_select on %I', t);
      execute format('create policy claude_ro_select on %I for select to claude_ro using (true)', t);
    end if;
  end loop;
end $$;

-- ── Hàm kiểm vai ─────────────────────────────────────────────────────────────
-- Nhân sự đang đăng nhập (cùng cách my_quyen: tài khoản gắn nhân sự, hoặc khớp email).
create or replace function public._sk_ns_id() returns uuid language sql stable security definer set search_path = public as $$
  select coalesce(
    (select nhan_su_id from tai_khoan where id = public.jwt_uid()),
    (select id from nhan_su where email is not null and lower(email) = public.jwt_email() and public.jwt_email() <> '' limit 1))
$$;

create or replace function public._sk_la_admin() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select la_admin_he_thong from nhan_su where id = public._sk_ns_id()), false)
$$;

-- Vai của tôi ở 1 sự kiện. Admin hoặc quanly ⇒ đủ 4 vai.
create or replace function public._sk_vai(p_su_kien uuid) returns text[] language plpgsql stable security definer set search_path = public as $$
declare v text[];
begin
  if public._sk_la_admin() then return array['checkin','quantro','quaqua','quanly']; end if;
  select coalesce(array_agg(vai), '{}') into v from sk_phan_cong where su_kien_id = p_su_kien and nhan_su_id = public._sk_ns_id();
  if 'quanly' = any(v) then return array['checkin','quantro','quaqua','quanly']; end if;
  return v;
end $$;

create or replace function public._sk_co_vai(p_su_kien uuid, p_vai text[]) returns boolean language sql stable security definer set search_path = public as $$
  select public.la_thanh_vien() and public._sk_vai(p_su_kien) && p_vai
$$;

create or replace function public._sk_can(p_su_kien uuid, p_vai text[]) returns void language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sk_chan();
  if not public._sk_co_vai(p_su_kien, p_vai) then
    raise exception 'Bạn chưa được giao việc này ở sự kiện — nhờ quản lý sự kiện giao việc.';
  end if;
end $$;

create or replace function public._sk_can_admin() returns void language plpgsql stable security definer set search_path = public as $$
begin
  if not public._sk_la_admin() then raise exception 'Chỉ admin hệ thống mới tạo được sự kiện mới.'; end if;
end $$;

-- ── Các fn_sk_* cũ: thay cổng la_thanh_vien() bằng cổng theo vai ────────────

-- Người chơi (dòng sk_nguoi_choi) cho 1 HS BK — tạo nếu chưa có. Idempotent.
create or replace function public.fn_sk_nguoi_choi_bk(p_su_kien uuid, p_hoc_sinh uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid; v_ten text;
begin
  perform public._sk_can(p_su_kien, array['checkin']);
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
  perform public._sk_can(p_su_kien, array['checkin']);
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
  perform public._sk_can(p_su_kien, array['checkin','quaqua']);
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
  perform public._sk_can((select su_kien_id from sk_nguoi_choi where id = p_nguoi), array['checkin']);
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
  where nc.su_kien_id = p_su_kien and x.nguon = 'vong_quay' and public._sk_co_vai(p_su_kien, array['checkin','quantro','quaqua','quanly'])
  order by x.at desc
  limit least(greatest(p_limit, 1), 50)
$$;

create or replace function public.fn_sk_dang_ky(p_phong uuid, p_nguoi uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid; v_ph record; v_cu text;
begin
  perform public._sk_can((select su_kien_id from sk_phong where id = p_phong), array['checkin']);
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
  perform public._sk_can((select p.su_kien_id from sk_dang_ky d join sk_phong p on p.id = d.phong_id where d.id = p_dang_ky), array['quantro']);
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
  perform public._sk_can((select su_kien_id from sk_phong where id = p_phong), array['quantro']);
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
  perform public._sk_can((select p.su_kien_id from sk_luot l join sk_phong p on p.id = l.phong_id where l.id = p_luot), array['quantro']);
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
  perform public._sk_can((select p.su_kien_id from sk_luot l join sk_phong p on p.id = l.phong_id where l.id = p_luot), array['quantro']);
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
  perform public._sk_can((select su_kien_id from sk_nguoi_choi where id = p_nguoi), array['quaqua']);
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
  perform public._sk_can((select su_kien_id from sk_nguoi_choi where id = p_nguoi), array['quanly']);
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
  where x.nguoi_choi_id = p_nguoi and public._sk_co_vai((select su_kien_id from sk_nguoi_choi where id = p_nguoi), array['checkin','quaqua'])
  order by x.at desc limit 100
$$;

-- Tổng quan: số liệu sự kiện + theo phòng (lượt đang chơi · lượt kế · hàng chờ theo thứ tự).
create or replace function public.fn_sk_tong_quan(p_su_kien uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sk_can(p_su_kien, array['checkin','quantro','quaqua','quanly']);
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
  perform public._sk_can(p_su_kien, array['quanly']);
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
  if p_id is null then perform public._sk_can_admin(); else perform public._sk_can(p_id, array['quanly']); end if;
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

-- ── Giao việc ────────────────────────────────────────────────────────────────
-- Sự kiện tôi được giao (admin thấy tất cả) + vai của tôi ở từng sự kiện.
create or replace function public.fn_sk_cua_toi()
returns table (id uuid, ten text, ngay date, trang_thai text, cau_hinh jsonb, vai text[], la_admin boolean)
language sql stable security definer set search_path = public as $$
  select s.id, s.ten, s.ngay, s.trang_thai, s.cau_hinh, public._sk_vai(s.id), public._sk_la_admin()
  from sk_su_kien s
  where public.la_thanh_vien() and cardinality(public._sk_vai(s.id)) > 0
  order by s.ngay desc, s.created_at desc
  limit 50
$$;

create or replace function public.fn_sk_phan_cong_ds(p_su_kien uuid)
returns table (nhan_su_id uuid, ho_ten text, email text, vai text[])
language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sk_can(p_su_kien, array['quanly']);
  return query
    select n.id, n.ho_ten, n.email, array_agg(pc.vai order by pc.vai)
    from sk_phan_cong pc join nhan_su n on n.id = pc.nhan_su_id
    where pc.su_kien_id = p_su_kien
    group by n.id, n.ho_ten, n.email
    order by n.ho_ten
    limit 200;
end $$;

-- Đặt TOÀN BỘ vai của 1 người ở 1 sự kiện (thêm cái thiếu, gỡ cái thừa). Trả về vai sau khi lưu.
create or replace function public.fn_sk_phan_cong_luu(p_su_kien uuid, p_nhan_su uuid, p_vai text[]) returns text[]
language plpgsql security definer set search_path = public as $$
declare v text[] := coalesce(p_vai, '{}');
begin
  perform public._sk_can(p_su_kien, array['quanly']);
  if exists (select 1 from unnest(v) x where x not in ('checkin', 'quantro', 'quaqua', 'quanly')) then
    raise exception 'Vai không hợp lệ.';
  end if;
  if not exists (select 1 from nhan_su where id = p_nhan_su) then raise exception 'Không tìm thấy nhân sự.'; end if;
  delete from sk_phan_cong where su_kien_id = p_su_kien and nhan_su_id = p_nhan_su and not (vai = any(v));
  insert into sk_phan_cong (su_kien_id, nhan_su_id, vai)
    select p_su_kien, p_nhan_su, x from unnest(v) x
  on conflict do nothing;
  return (select coalesce(array_agg(vai order by vai), '{}') from sk_phan_cong where su_kien_id = p_su_kien and nhan_su_id = p_nhan_su);
end $$;

-- Tìm nhân sự đang làm theo tên/email (ô gợi ý khi giao việc).
create or replace function public.fn_sk_tim_nhan_su(p_q text)
returns table (id uuid, ho_ten text, email text)
language plpgsql stable security definer set search_path = public as $$
declare q text := public.fn_bo_dau(btrim(coalesce(p_q, '')));
begin
  perform public._sk_chan();
  if q = '' then return; end if;
  return query
    select n.id, n.ho_ten, n.email from nhan_su n
    where n.trang_thai = 'dang_lam'
      and (public.fn_bo_dau(n.ho_ten) like '%' || q || '%' or lower(coalesce(n.email, '')) like '%' || q || '%')
    order by n.ho_ten
    limit 20;
end $$;

-- ── Quyền hàm (áp bằng SQL Editor ⇒ phải revoke anon TƯỜNG MINH — CLAUDE.md §2.1) ──
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

-- Kiểm tra ngay (SQL Editor hiện 1 dòng kết quả): ham_anon_goi_duoc phải = 0, co_bang_phan_cong = true,
-- nhansu_ghi_thang = false.
select
  (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname like 'fn\_sk\_%' and has_function_privilege('anon', p.oid, 'execute')) as ham_anon_goi_duoc,
  (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname like 'fn\_sk\_%') as tong_ham_fn_sk,
  to_regclass('public.sk_phan_cong') is not null as co_bang_phan_cong,
  has_table_privilege('authenticated', 'public.sk_phan_cong', 'INSERT') as nhansu_ghi_thang;
