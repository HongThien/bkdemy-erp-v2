-- ============================================================================
-- 202610140118 — task_phat_trien_he_moi   (PHẦN 1/2: DỰNG MỚI — chỉ THÊM + viết lại chỗ đọc)
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 14/10: hệ việc phát triển cũ (Idea → Backlog → Weekly Planning mẹ/con → Fibonacci → hiệu suất
--   chất lượng/tiến độ…) quá phức tạp với người lowtech ⇒ XOÁ HẲN, làm lại từ đầu. Chu kỳ mới:
--     họp tuần → CẤP TRÊN giao task cho CẤP DƯỚI (theo sơ đồ tổ chức vi_tri.cha_id; KHÔNG giao ngang/lên —
--     ngang hay lên chỉ có ORDER, mig 202610140053) → người làm cập nhật + báo xong → ĐẾN HẠN cấp trên đánh giá:
--         • xong  ⇒ DUYỆT + ghi kết quả task là bao nhiêu %
--         • chưa  ⇒ GIA HẠN hoặc HUỶ; cấp trên QUYẾT có đánh "cờ trễ deadline" (= 1 gậy) hay không, tuỳ lý do.
--   Idea / backlog ⇒ là ORDER, không còn bảng riêng.
--   Gậy: mọi gậy task phát triển chỉ do CẤP TRÊN đánh tay lúc gia hạn / huỷ (loại lỗi `cham_deadline`),
--   thay luật tự quét "trễ deadline" cũ. Ghi vào gay_ledger như mọi gậy khác (ref_id = 'task:<id>').
--   Phần xoá hệ cũ nằm ở file kế (…0119_go_he_task_viec_cu.sql) — áp SAU file này.
--
--   Bảng: task_phat_trien (trạng thái hiện tại) + task_phat_trien_log (append-only: ai làm gì lúc nào).
--   Ghi CHỈ qua fn_task_*: quyền + tính toán + log + thư hòm thư cùng 1 transaction (CLAUDE.md §2.0, §4).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   File này KHÔNG xoá gì. Viết lại (create or replace) 4 hàm ĐỌC để trỏ sang bảng mới:
--   fn_pt_push_dem · fn_pt_push_dem_1 · _troly_cc_viec_phat_trien · fn_gay_lich_su (nhánh 'task:').
--   Nhánh 'viec:' của fn_gay_lich_su bị thay bằng 'task:' (khoá gậy cũ 'viec:<id>' không còn nguồn).
-- ============================================================================

create table if not exists task_phat_trien (
  id             uuid primary key default gen_random_uuid(),
  tieu_de        text not null check (length(btrim(tieu_de)) between 1 and 200),
  mo_ta          text,                                  -- NULL = không có mô tả (không áp dụng)
  nguoi_giao_id  uuid not null references nhan_su(id),
  nguoi_lam_id   uuid not null references nhan_su(id),
  han            date not null,                         -- luôn có hạn: "đến hạn thì cấp trên đánh giá"
  han_goc        date not null,
  so_lan_gia_han integer not null default 0,
  trang_thai     text not null default 'dang_lam'
                 check (trang_thai in ('dang_lam','cho_duyet','da_duyet','huy')),
  ket_qua_pct    numeric(5,2) check (ket_qua_pct between 0 and 100),   -- chỉ có khi da_duyet
  nhan_xet       text,                                  -- nhận xét lúc duyệt / lý do huỷ
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  dong_at        timestamptz,                           -- lúc duyệt / huỷ (NULL = còn mở)
  check (nguoi_giao_id <> nguoi_lam_id),
  check ((trang_thai = 'da_duyet') = (ket_qua_pct is not null)),
  check ((trang_thai in ('da_duyet','huy')) = (dong_at is not null))
);
create index if not exists task_pt_lam_idx on task_phat_trien (nguoi_lam_id, trang_thai, han);
create index if not exists task_pt_giao_idx on task_phat_trien (nguoi_giao_id, trang_thai, han);

create table if not exists task_phat_trien_log (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references task_phat_trien(id) on delete cascade,
  nguoi_id   uuid not null references nhan_su(id),
  hanh_dong  text not null check (hanh_dong in ('giao','cap_nhat','bao_xong','duyet','gia_han','huy')),
  ghi_chu    text,                    -- NULL = không kèm lời
  pct        numeric(5,2),            -- cap_nhat: % tự báo · duyet: kết quả (NULL = không áp dụng)
  han_cu     date, han_moi date,      -- chỉ gia_han
  co_tre     boolean,                 -- chỉ gia_han / huy: cấp trên có đánh cờ trễ deadline không
  created_at timestamptz not null default now()
);
create index if not exists task_pt_log_task_idx on task_phat_trien_log (task_id, created_at);

alter table task_phat_trien     enable row level security;
alter table task_phat_trien_log enable row level security;
drop policy if exists task_pt_sel on task_phat_trien;
create policy task_pt_sel on task_phat_trien for select to authenticated using (public.la_thanh_vien());
drop policy if exists task_pt_log_sel on task_phat_trien_log;
create policy task_pt_log_sel on task_phat_trien_log for select to authenticated using (public.la_thanh_vien());
revoke all on task_phat_trien, task_phat_trien_log from anon, authenticated;
grant select on task_phat_trien, task_phat_trien_log to authenticated;   -- ghi: chỉ qua fn_task_*

-- ── CÂY TỔ CHỨC: ai là cấp dưới của tôi ────────────────────────────────────
create or replace function public._task_la_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select n.la_admin_he_thong from nhan_su n where n.id = public.current_nhan_su_id()), false)
$$;

create or replace function public.fn_task_cap_duoi()
returns table(nhan_su_id uuid, ho_ten text)
language sql stable security definer set search_path = public as $$
  with recursive
  cay as (
    select v.id, v.nhan_su_id from vi_tri v
     where v.cha_id in (select s.id from vi_tri s where s.nhan_su_id = public.current_nhan_su_id())
    union
    select v.id, v.nhan_su_id from vi_tri v join cay c on v.cha_id = c.id
  )
  select n.id, n.ho_ten
    from nhan_su n
   where n.trang_thai = 'dang_lam'
     and n.id <> public.current_nhan_su_id()
     and ( public._task_la_admin() or n.id in (select c.nhan_su_id from cay c where c.nhan_su_id is not null) )
   order by n.ho_ten
$$;

-- ── GIAO ────────────────────────────────────────────────────────────────────
create or replace function public.fn_task_giao(p_nguoi_lam uuid, p_tieu_de text, p_mo_ta text, p_han date)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); v_id uuid; v_ten text;
begin
  if v_me is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if p_tieu_de is null or length(btrim(p_tieu_de)) = 0 then raise exception 'Task cần có tên'; end if;
  if p_han is null then raise exception 'Task cần có hạn (để đến hạn cấp trên đánh giá)'; end if;
  if not exists (select 1 from public.fn_task_cap_duoi() c where c.nhan_su_id = p_nguoi_lam) then
    raise exception 'Chỉ giao task được cho cấp dưới trong sơ đồ tổ chức. Với đồng cấp hoặc cấp trên, hãy đặt Order.';
  end if;
  insert into task_phat_trien (tieu_de, mo_ta, nguoi_giao_id, nguoi_lam_id, han, han_goc)
  values (btrim(p_tieu_de), nullif(btrim(coalesce(p_mo_ta, '')), ''), v_me, p_nguoi_lam, p_han, p_han)
  returning id into v_id;
  insert into task_phat_trien_log (task_id, nguoi_id, hanh_dong, han_moi) values (v_id, v_me, 'giao', p_han);
  select ho_ten into v_ten from nhan_su where id = v_me;
  perform public._hom_thu_gui(p_nguoi_lam, 'viec', v_ten || ' giao task cho bạn',
    btrim(p_tieu_de) || E'\nHạn: ' || to_char(p_han, 'DD/MM'), 'giaoviec', v_me);
  return v_id;
end $$;

-- ── NGƯỜI LÀM: cập nhật tiến độ / báo xong ─────────────────────────────────
create or replace function public.fn_task_cap_nhat(p_task uuid, p_ghi_chu text, p_pct numeric default null)
returns void
language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); t task_phat_trien%rowtype;
begin
  select * into t from task_phat_trien where id = p_task for update;
  if not found or t.nguoi_lam_id is distinct from v_me then raise exception 'Chỉ người đang làm task này mới cập nhật được'; end if;
  if t.trang_thai not in ('dang_lam','cho_duyet') then raise exception 'Task đã đóng'; end if;
  if p_pct is not null and (p_pct < 0 or p_pct > 100) then raise exception 'Tiến độ phải từ 0 đến 100'; end if;
  if nullif(btrim(coalesce(p_ghi_chu, '')), '') is null and p_pct is null then raise exception 'Ghi nội dung hoặc phần trăm tiến độ'; end if;
  insert into task_phat_trien_log (task_id, nguoi_id, hanh_dong, ghi_chu, pct)
  values (t.id, v_me, 'cap_nhat', nullif(btrim(coalesce(p_ghi_chu, '')), ''), p_pct);
  update task_phat_trien set updated_at = now() where id = t.id;
end $$;

create or replace function public.fn_task_bao_xong(p_task uuid, p_ghi_chu text default null)
returns void
language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); t task_phat_trien%rowtype; v_ten text;
begin
  select * into t from task_phat_trien where id = p_task for update;
  if not found or t.nguoi_lam_id is distinct from v_me then raise exception 'Chỉ người đang làm task này mới báo xong được'; end if;
  if t.trang_thai <> 'dang_lam' then raise exception 'Task không ở trạng thái đang làm'; end if;
  update task_phat_trien set trang_thai = 'cho_duyet', updated_at = now() where id = t.id;
  insert into task_phat_trien_log (task_id, nguoi_id, hanh_dong, ghi_chu)
  values (t.id, v_me, 'bao_xong', nullif(btrim(coalesce(p_ghi_chu, '')), ''));
  select ho_ten into v_ten from nhan_su where id = v_me;
  perform public._hom_thu_gui(t.nguoi_giao_id, 'viec', v_ten || ' báo xong task',
    t.tieu_de || coalesce(E'\n💬 ' || nullif(btrim(coalesce(p_ghi_chu, '')), ''), ''), 'giaoviec', v_me);
end $$;

-- ── CẤP TRÊN: đánh giá ──────────────────────────────────────────────────────
-- Cờ trễ deadline = 1 gậy loại `cham_deadline` (cấp trên quyết, kèm lý do). Người miễn gậy ⇒ không đánh.
create or replace function public._task_danh_co_tre(p_task uuid, p_nguoi_lam uuid, p_ly_do text, p_tieu_de text, p_me uuid)
returns boolean
language plpgsql security definer set search_path = public as $$
declare v_loi uuid;
begin
  if coalesce((select mien_gay from nhan_su where id = p_nguoi_lam), false) then return false; end if;
  select id into v_loi from gay_loi where ma = 'cham_deadline' and active limit 1;
  if v_loi is null then return false; end if;
  insert into gay_ledger (nhan_su_id, so_gay, loai, loi_id, ly_do, ref_loai, ref_id, ref_mo_ta, nguoi_tao)
  values (p_nguoi_lam, 1, 'thu_cong', v_loi, nullif(btrim(coalesce(p_ly_do, '')), ''), 'giaoviec', 'task:' || p_task::text, p_tieu_de, p_me);
  return true;
end $$;

create or replace function public.fn_task_duyet(p_task uuid, p_pct numeric, p_nhan_xet text default null)
returns void
language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); t task_phat_trien%rowtype; v_ten text;
begin
  select * into t from task_phat_trien where id = p_task for update;
  if not found or not (t.nguoi_giao_id = v_me or public._task_la_admin()) then raise exception 'Chỉ người giao task mới duyệt được'; end if;
  if t.trang_thai not in ('dang_lam','cho_duyet') then raise exception 'Task đã đóng'; end if;
  if p_pct is null or p_pct < 0 or p_pct > 100 then raise exception 'Kết quả phải từ 0 đến 100 (phần trăm)'; end if;
  update task_phat_trien set trang_thai = 'da_duyet', ket_qua_pct = p_pct, nhan_xet = nullif(btrim(coalesce(p_nhan_xet, '')), ''),
         dong_at = now(), updated_at = now() where id = t.id;
  insert into task_phat_trien_log (task_id, nguoi_id, hanh_dong, ghi_chu, pct)
  values (t.id, v_me, 'duyet', nullif(btrim(coalesce(p_nhan_xet, '')), ''), p_pct);
  select ho_ten into v_ten from nhan_su where id = v_me;
  perform public._hom_thu_gui(t.nguoi_lam_id, 'nhan_xet', 'Task của bạn đã được duyệt: ' || regexp_replace(p_pct::numeric(5,2)::text, '.?0+$', '') || '%',
    t.tieu_de || coalesce(E'\n💬 ' || nullif(btrim(coalesce(p_nhan_xet, '')), ''), ''), 'giaoviec', v_me);
end $$;

create or replace function public.fn_task_gia_han(p_task uuid, p_han_moi date, p_ly_do text, p_co_tre boolean default false)
returns void
language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); t task_phat_trien%rowtype; v_co boolean := false;
begin
  select * into t from task_phat_trien where id = p_task for update;
  if not found or not (t.nguoi_giao_id = v_me or public._task_la_admin()) then raise exception 'Chỉ người giao task mới gia hạn được'; end if;
  if t.trang_thai not in ('dang_lam','cho_duyet') then raise exception 'Task đã đóng'; end if;
  if p_han_moi is null or p_han_moi <= t.han then raise exception 'Hạn mới phải sau hạn hiện tại'; end if;
  if nullif(btrim(coalesce(p_ly_do, '')), '') is null then raise exception 'Gia hạn phải ghi lý do'; end if;
  if coalesce(p_co_tre, false) then v_co := public._task_danh_co_tre(t.id, t.nguoi_lam_id, 'Trễ deadline task: ' || btrim(p_ly_do), t.tieu_de, v_me); end if;
  update task_phat_trien set han = p_han_moi, so_lan_gia_han = so_lan_gia_han + 1, trang_thai = 'dang_lam', updated_at = now() where id = t.id;
  insert into task_phat_trien_log (task_id, nguoi_id, hanh_dong, ghi_chu, han_cu, han_moi, co_tre)
  values (t.id, v_me, 'gia_han', btrim(p_ly_do), t.han, p_han_moi, v_co);
  perform public._hom_thu_gui(t.nguoi_lam_id, 'viec', 'Task của bạn được gia hạn đến ' || to_char(p_han_moi, 'DD/MM'),
    t.tieu_de || E'\n💬 ' || btrim(p_ly_do) || case when v_co then E'\n🏴 Bị đánh cờ trễ deadline' else '' end, 'giaoviec', v_me);
end $$;

create or replace function public.fn_task_huy(p_task uuid, p_ly_do text, p_co_tre boolean default false)
returns void
language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); t task_phat_trien%rowtype; v_co boolean := false;
begin
  select * into t from task_phat_trien where id = p_task for update;
  if not found or not (t.nguoi_giao_id = v_me or public._task_la_admin()) then raise exception 'Chỉ người giao task mới huỷ được'; end if;
  if t.trang_thai not in ('dang_lam','cho_duyet') then raise exception 'Task đã đóng'; end if;
  if nullif(btrim(coalesce(p_ly_do, '')), '') is null then raise exception 'Huỷ phải ghi lý do'; end if;
  if coalesce(p_co_tre, false) then v_co := public._task_danh_co_tre(t.id, t.nguoi_lam_id, 'Trễ deadline task: ' || btrim(p_ly_do), t.tieu_de, v_me); end if;
  update task_phat_trien set trang_thai = 'huy', nhan_xet = btrim(p_ly_do), dong_at = now(), updated_at = now() where id = t.id;
  insert into task_phat_trien_log (task_id, nguoi_id, hanh_dong, ghi_chu, co_tre) values (t.id, v_me, 'huy', btrim(p_ly_do), v_co);
  perform public._hom_thu_gui(t.nguoi_lam_id, 'viec', 'Task của bạn bị huỷ',
    t.tieu_de || E'\n💬 ' || btrim(p_ly_do) || case when v_co then E'\n🏴 Bị đánh cờ trễ deadline' else '' end, 'giaoviec', v_me);
end $$;

-- ── BẢNG TASK CẢ TEAM (đọc) ────────────────────────────────────────────────
create or replace function public.fn_task_bang()
returns table(
  id uuid, tieu_de text, mo_ta text, trang_thai text, han date, han_goc date, so_lan_gia_han integer,
  den_han boolean, qua_han boolean,
  nguoi_lam_id uuid, nguoi_lam_ten text, nguoi_giao_id uuid, nguoi_giao_ten text,
  tien_do_bao_cao numeric, ket_qua_pct numeric, nhan_xet text, cap_nhat_cuoi_at timestamptz, created_at timestamptz, dong_at timestamptz
)
language sql stable security definer set search_path = public as $$
  with h as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d)
  select t.id, t.tieu_de, t.mo_ta, t.trang_thai, t.han, t.han_goc, t.so_lan_gia_han,
         (t.trang_thai in ('dang_lam','cho_duyet') and t.han <= h.d)  as den_han,   -- đến hạn ⇒ cấp trên cần đánh giá
         (t.trang_thai in ('dang_lam','cho_duyet') and t.han <  h.d)  as qua_han,
         t.nguoi_lam_id, l.ho_ten, t.nguoi_giao_id, g.ho_ten,
         cn.pct, t.ket_qua_pct, t.nhan_xet, cn.at, t.created_at, t.dong_at
    from task_phat_trien t
    cross join h
    join nhan_su l on l.id = t.nguoi_lam_id
    join nhan_su g on g.id = t.nguoi_giao_id
    left join lateral (select c.pct, c.created_at as at from task_phat_trien_log c
                        where c.task_id = t.id and c.hanh_dong = 'cap_nhat' and c.pct is not null
                        order by c.created_at desc limit 1) cn on true
   where public.la_thanh_vien()
     and ( t.trang_thai in ('dang_lam','cho_duyet') or t.dong_at > now() - interval '14 days' )
   order by (t.trang_thai in ('dang_lam','cho_duyet')) desc, t.han, t.created_at desc
   limit 500
$$;

-- ── QUYỀN GỌI ──────────────────────────────────────────────────────────────
revoke all on function public._task_la_admin() from public, anon, authenticated;
revoke all on function public._task_danh_co_tre(uuid, uuid, text, text, uuid) from public, anon, authenticated;
do $$
declare f text;
begin
  foreach f in array array[
    'fn_task_cap_duoi()', 'fn_task_giao(uuid, text, text, date)', 'fn_task_cap_nhat(uuid, text, numeric)',
    'fn_task_bao_xong(uuid, text)', 'fn_task_duyet(uuid, numeric, text)', 'fn_task_gia_han(uuid, date, text, boolean)',
    'fn_task_huy(uuid, text, boolean)', 'fn_task_bang()'
  ] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;

-- ── KẾT QUẢ THÁNG của 1 người (trợ lý tra cứu): task có HẠN trong tháng ──
create or replace function public.fn_task_ket_qua_thang(p_ns uuid, p_thang date)
returns table(so_task integer, so_duyet integer, ket_qua_tb numeric, so_gia_han integer, so_co_tre integer)
language sql stable security definer set search_path = public as $$
  select count(*)::int,
         count(*) filter (where t.trang_thai = 'da_duyet')::int,
         round(avg(t.ket_qua_pct) filter (where t.trang_thai = 'da_duyet'), 1),
         coalesce(sum(t.so_lan_gia_han), 0)::int,
         (select count(*) from task_phat_trien_log l join task_phat_trien x on x.id = l.task_id
           where x.nguoi_lam_id = p_ns and l.co_tre and l.created_at >= p_thang and l.created_at < (p_thang + interval '1 month'))::int
    from task_phat_trien t
   where public.la_thanh_vien() and t.nguoi_lam_id = p_ns
     and t.han >= p_thang and t.han < (p_thang + interval '1 month')::date
$$;
revoke all on function public.fn_task_ket_qua_thang(uuid, date) from public, anon;
grant execute on function public.fn_task_ket_qua_thang(uuid, date) to authenticated;

-- ── PUSH BADGE (app PT) ─────────────────────────────────────────────────────
create or replace function public._trg_task_pt_push() returns trigger
language plpgsql set search_path = public as $$
begin
  begin
    perform public._push_bao_cap_nhat(new.nguoi_lam_id, 'pt');
    perform public._push_bao_cap_nhat(new.nguoi_giao_id, 'pt');
  exception when others then null;
  end;
  return new;
end $$;
drop trigger if exists trg_task_pt_push_badge on task_phat_trien;
create trigger trg_task_pt_push_badge after insert or update of trang_thai, han on task_phat_trien
  for each row execute function public._trg_task_pt_push();

-- ── ĐỌC LẠI TỪ BẢNG MỚI: push đếm việc ─────────────────────────────────────
-- Số việc của 1 người = task tôi làm đã ĐẾN HẠN mà chưa đóng + task tôi giao đang CHỜ DUYỆT hoặc đến hạn.
create or replace function public.fn_pt_push_dem(p_secret text)
returns table(nhan_su_id uuid, so_viec integer)
language plpgsql stable security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return query
  select ns.id,
    ( (select count(*) from task_phat_trien t where t.nguoi_lam_id = ns.id and t.trang_thai in ('dang_lam','cho_duyet')
          and t.han <= (now() at time zone 'Asia/Ho_Chi_Minh')::date)
    + (select count(*) from task_phat_trien t where t.nguoi_giao_id = ns.id
          and (t.trang_thai = 'cho_duyet' or (t.trang_thai = 'dang_lam' and t.han <= (now() at time zone 'Asia/Ho_Chi_Minh')::date)))
    )::integer
  from (select distinct d.nhan_su_id as id from push_dang_ky d where d.app = 'pt') ns;
end $$;

create or replace function public.fn_pt_push_dem_1(p_secret text, p_ns uuid)
returns integer
language plpgsql stable security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return
    (select count(*) from task_phat_trien t where t.nguoi_lam_id = p_ns and t.trang_thai in ('dang_lam','cho_duyet')
        and t.han <= (now() at time zone 'Asia/Ho_Chi_Minh')::date)
  + (select count(*) from task_phat_trien t where t.nguoi_giao_id = p_ns
        and (t.trang_thai = 'cho_duyet' or (t.trang_thai = 'dang_lam' and t.han <= (now() at time zone 'Asia/Ho_Chi_Minh')::date)));
end $$;

-- ── ĐỌC LẠI: công cụ trợ lý (hỏi–đáp) ──────────────────────────────────────
create or replace function public._troly_cc_viec_phat_trien(p jsonb)
returns jsonb
language plpgsql stable set search_path = public as $$
declare
  v_lam jsonb; v_lam_id uuid; v_giao jsonb; v_giao_id uuid;
  v_tt text := lower(coalesce(nullif(btrim(p->>'trang_thai'), ''), 'dang_mo'));
  v_tu date; v_den date; v jsonb;
  c_tran constant int := 60;
begin
  perform public._troly_gac();
  if v_tt not in ('dang_mo', 'qua_han', 'cho_nghiem_thu', 'da_xong', 'tat_ca') then
    return jsonb_build_object('loi', 'thieu_tham_so', 'thong_diep', 'trang_thai phải là: dang_mo | qua_han | cho_nghiem_thu | da_xong | tat_ca.');
  end if;
  if nullif(btrim(p->>'ten_nguoi_lam'), '') is not null then
    v_lam := public._troly_chon_ns(p->>'ten_nguoi_lam');
    if v_lam ? 'loi' then return v_lam; end if;
    v_lam_id := (v_lam->>'id')::uuid;
  end if;
  if nullif(btrim(p->>'ten_nguoi_giao'), '') is not null then
    v_giao := public._troly_chon_ns(p->>'ten_nguoi_giao');
    if v_giao ? 'loi' then return v_giao; end if;
    v_giao_id := (v_giao->>'id')::uuid;
  end if;
  v_tu := public._troly_ngay(p->>'han_tu_ngay', null);
  v_den := public._troly_ngay(p->>'han_den_ngay', null);

  with t as (
    select vc.tieu_de, vc.trang_thai, vc.han, vc.so_lan_gia_han, vc.ket_qua_pct, vc.created_at,
           nl.ho_ten as nguoi_lam, ng.ho_ten as nguoi_giao,
           (vc.trang_thai in ('dang_lam', 'cho_duyet') and vc.han < public._troly_hom_nay()) as qua_han
    from task_phat_trien vc
    join nhan_su nl on nl.id = vc.nguoi_lam_id
    join nhan_su ng on ng.id = vc.nguoi_giao_id
    where (v_lam_id is null or vc.nguoi_lam_id = v_lam_id)
      and (v_giao_id is null or vc.nguoi_giao_id = v_giao_id)
      and (v_tu is null or vc.han >= v_tu)
      and (v_den is null or vc.han <= v_den)
  ),
  loc as (
    select * from t
    where v_tt = 'tat_ca'
       or (v_tt = 'dang_mo' and trang_thai in ('dang_lam', 'cho_duyet'))
       or (v_tt = 'qua_han' and qua_han)
       or (v_tt = 'cho_nghiem_thu' and trang_thai = 'cho_duyet')
       or (v_tt = 'da_xong' and trang_thai = 'da_duyet')
  )
  select jsonb_build_object(
    'loc', jsonb_build_object('nguoi_lam', v_lam->>'ho_ten', 'nguoi_giao', v_giao->>'ho_ten',
                              'trang_thai', v_tt, 'han_tu_ngay', v_tu, 'han_den_ngay', v_den),
    'tong_theo_trang_thai', (select coalesce(jsonb_object_agg(g.trang_thai, g.n), '{}'::jsonb)
                               from (select trang_thai, count(*)::int as n from t group by trang_thai) g),
    'so_viec_qua_han', (select count(*) from t where qua_han),
    'theo_nguoi_lam', (select coalesce(jsonb_agg(to_jsonb(g) order by g.qua_han desc, g.dang_mo desc), '[]'::jsonb) from (
        select nguoi_lam,
               count(*) filter (where trang_thai in ('dang_lam', 'cho_duyet'))::int as dang_mo,
               count(*) filter (where qua_han)::int as qua_han,
               count(*) filter (where trang_thai = 'cho_duyet')::int as cho_nghiem_thu,
               count(*) filter (where trang_thai = 'da_duyet')::int as da_xong
        from t group by 1) g),
    'viec', (select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from (
        select tieu_de, trang_thai, han, qua_han, nguoi_lam, nguoi_giao, so_lan_gia_han, ket_qua_pct
        from loc order by han, created_at limit c_tran) r),
    'da_cat', (select count(*) > c_tran from loc),
    'ghi_chu', jsonb_build_array(
      'trang_thai của task: dang_lam · cho_duyet (người làm báo xong, chờ cấp trên) · da_duyet (cấp trên duyệt, có ket_qua_pct) · huy.',
      'qua_han = còn mở mà hạn đã qua. Đến hạn thì cấp trên đánh giá: duyệt (ghi % kết quả) hoặc gia hạn / huỷ (có thể đánh cờ trễ deadline).',
      'Các bảng tổng đếm theo bộ lọc NGƯỜI + HẠN, không theo bộ lọc trang_thai, và không bị cắt.',
      format('Danh sách "viec" cắt ở %s dòng.', c_tran))
  ) into v;
  return v;
end $$;

-- ── fn_gay_lich_su: nhánh 'viec:<id>' → 'task:<id>' (thân lấy từ bản ĐANG CHẠY 14/10, chỉ thay nhánh việc giao tay) ──
CREATE OR REPLACE FUNCTION public.fn_gay_lich_su(p_ref_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $fn$
declare
  v_buoi uuid; v_tab text; v_viec uuid;
  b record;
  v_han timestamptz; v_dong1 timestamptz; v_dong_hien timestamptz;
  v_first_sk text; v_first_cu timestamptz;
  v_ten text; ev jsonb := '[]'::jsonb; tmp jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự mới xem được lịch sử task.'; end if;

  -- ── task phát triển (giao tay theo cây tổ chức) ──
  if p_ref_key ~ '^task:[0-9a-f-]{36}$' then
    v_viec := substr(p_ref_key, 6)::uuid;
    select coalesce(jsonb_agg(jsonb_build_object(
      'at', (t.han::timestamp + interval '23 hours 59 minutes') at time zone 'Asia/Ho_Chi_Minh',
      'loai', 'han', 'mo_ta', 'Hạn chót: ' || t.tieu_de, 'actor', null)), '[]')
    into tmp from task_phat_trien t where t.id = v_viec;
    ev := ev || tmp;
    select coalesce(jsonb_agg(jsonb_build_object(
      'at', l.created_at, 'loai', 'viec',
      'mo_ta', case l.hanh_dong
                 when 'giao' then 'Giao task' || coalesce(' · hạn ' || to_char(l.han_moi, 'DD/MM'), '')
                 when 'cap_nhat' then 'Cập nhật' || coalesce(' ' || round(l.pct)::text || '%', '') || coalesce(' — ' || l.ghi_chu, '')
                 when 'bao_xong' then 'Báo xong' || coalesce(' — ' || l.ghi_chu, '')
                 when 'duyet' then 'Cấp trên duyệt: ' || round(l.pct)::text || '%' || coalesce(' — ' || l.ghi_chu, '')
                 when 'gia_han' then 'Gia hạn ' || to_char(l.han_cu, 'DD/MM') || ' → ' || to_char(l.han_moi, 'DD/MM')
                                     || case when l.co_tre then ' · đánh cờ trễ deadline' else ' · không đánh cờ' end
                                     || coalesce(' — ' || l.ghi_chu, '')
                 when 'huy' then 'Huỷ task' || case when l.co_tre then ' · đánh cờ trễ deadline' else '' end || coalesce(' — ' || l.ghi_chu, '')
                 else l.hanh_dong end,
      'actor', ns.ho_ten)), '[]')
    into tmp from task_phat_trien_log l left join nhan_su ns on ns.id = l.nguoi_id where l.task_id = v_viec;
    ev := ev || tmp;

  -- ── task vận hành trên buổi ──
  elsif p_ref_key ~ '^vh:[0-9a-f-]{36}\|(ingame|et|danhgia|btvn|mt)\|' then
    v_buoi := split_part(substr(p_ref_key, 4), '|', 1)::uuid;
    v_tab  := split_part(substr(p_ref_key, 4), '|', 2);
    select bh.* into b from buoi_hoc bh where bh.id = v_buoi;
    if not found then return '[]'::jsonb; end if;
    v_ten := case v_tab when 'ingame' then 'Chấm bài trên lớp' when 'et' then 'Chấm ET'
                        when 'danhgia' then 'Đánh giá sau buổi' when 'btvn' then 'Chấm BTVN' else 'Chấm MT' end;
    v_dong_hien := case v_tab when 'ingame' then b.ingame_dong_at when 'et' then b.et_dong_at
                              when 'danhgia' then b.danh_gia_xong_at when 'btvn' then b.btvn_dong_at else b.mt_dong_at end;
    v_han := case
      when b.lop_id is not null then public.fn_han_viec(b.lop_id, b.ngay, b.gio_bat_dau, v_tab)
      when v_tab = 'et' then ((b.ngay + 1)::timestamp + interval '12 hours') at time zone 'Asia/Ho_Chi_Minh'
      else (b.ngay::timestamp + interval '23 hours 59 minutes') at time zone 'Asia/Ho_Chi_Minh' end;
    if v_han is not null then
      ev := ev || jsonb_build_array(jsonb_build_object('at', v_han, 'loai', 'han', 'mo_ta', 'Hạn chót ' || v_ten, 'actor', null));
    end if;

    -- đóng / mở lại (từ log)
    select coalesce(jsonb_agg(jsonb_build_object(
      'at', pl.at, 'loai', pl.su_kien,
      'mo_ta', case pl.su_kien
        when 'dong' then 'Đóng ' || v_ten || case when v_han is null then '' when pl.at <= v_han then ' — trước hạn' else ' — trễ ' || public._gay_nhan_tre(v_han, pl.at) end
        when 'mo_lai' then 'Mở lại ' || v_ten
        else 'Đổi mốc đóng ' || v_ten end,
      'actor', ns.ho_ten)), '[]')
    into tmp from buoi_hoc_phase_log pl left join nhan_su ns on ns.id = pl.actor
    where pl.buoi_hoc_id = v_buoi and pl.phase = v_tab;
    ev := ev || tmp;

    -- lần đóng ĐẦU (mốc để nhận ra "dữ liệu HS nhập sau khi đã đóng")
    select min(pl.at) into v_dong1 from buoi_hoc_phase_log pl where pl.buoi_hoc_id = v_buoi and pl.phase = v_tab and pl.su_kien = 'dong';
    select pl.su_kien, pl.cu into v_first_sk, v_first_cu
      from buoi_hoc_phase_log pl where pl.buoi_hoc_id = v_buoi and pl.phase = v_tab order by pl.at, pl.id limit 1;
    if v_first_sk in ('mo_lai', 'doi_moc') and v_first_cu is not null then
      -- log mở đầu bằng "mở lại" ⇒ lần đóng đầu xảy ra TRƯỚC khi có log; mốc = giá trị cũ của cột
      ev := ev || jsonb_build_array(jsonb_build_object(
        'at', v_first_cu, 'loai', 'dong',
        'mo_ta', 'Đóng ' || v_ten || case when v_han is null then '' when v_first_cu <= v_han then ' — trước hạn' else ' — trễ ' || public._gay_nhan_tre(v_han, v_first_cu) end
                 || ' (suy từ mốc cũ — trước khi có log)',
        'actor', null));
      v_dong1 := least(coalesce(v_dong1, v_first_cu), v_first_cu);
    elsif v_dong1 is null and v_dong_hien is not null then
      -- chưa có log dòng nào mà cột đã có mốc ⇒ đóng trước khi có log, không biết có mở lại hay không
      v_dong1 := v_dong_hien;
      ev := ev || jsonb_build_array(jsonb_build_object(
        'at', v_dong_hien, 'loai', 'dong',
        'mo_ta', 'Đóng ' || v_ten || case when v_han is null then '' when v_dong_hien <= v_han then ' — trước hạn' else ' — trễ ' || public._gay_nhan_tre(v_han, v_dong_hien) end
                 || ' (mốc hiện tại — trước khi có log, không biết có mở lại hay không)',
        'actor', null));
    end if;

    -- dữ liệu HS nhập SAU lần đóng đầu (điểm theo phase · kết quả BTVN · đánh giá)
    if v_dong1 is not null then
      if v_tab in ('ingame', 'et', 'mt', 'btvn') then
        select coalesce(jsonb_agg(jsonb_build_object(
          'at', x.at, 'loai', 'nhap', 'mo_ta', 'Nhập điểm HS ' || x.ho_ten || ' (' || x.n || ' câu)', 'actor', x.actor)), '[]')
        into tmp from (
          select hs.ho_ten, min(g.graded_at) as at, count(*) as n,
                 public._gay_ten_actor((array_agg(g.graded_by order by g.graded_at))[1]) as actor
          from gami_grades g join gami_session_problems p on p.id = g.problem_id join hoc_sinh hs on hs.id = g.hoc_sinh_id
          where p.buoi_hoc_id = v_buoi and p.phase = v_tab and g.graded_at > v_dong1
          group by hs.id, hs.ho_ten) x;
        ev := ev || tmp;
      end if;
      if v_tab = 'btvn' then
        select coalesce(jsonb_agg(jsonb_build_object(
          'at', k.updated_at, 'loai', 'nhap',
          'mo_ta', 'Cập nhật kết quả BTVN HS ' || hs.ho_ten
            || case k.trang_thai_nop when 'nop_muon' then ' — nộp muộn' when 'nop_dung_han' then ' — đúng hạn'
                                     when 'xin_phep' then ' — xin phép' when 'khong_lam' then ' — không làm' else '' end,
          'actor', null)), '[]')
        into tmp from btvn_ket_qua k join hoc_sinh hs on hs.id = k.hoc_sinh_id
        where k.buoi_hoc_id = v_buoi and k.updated_at > v_dong1;
        ev := ev || tmp;
      end if;
      if v_tab = 'danhgia' then
        select coalesce(jsonb_agg(jsonb_build_object(
          'at', d.updated_at, 'loai', 'nhap', 'mo_ta', 'Sửa đánh giá HS ' || hs.ho_ten, 'actor', public._gay_ten_actor(d.graded_by))), '[]')
        into tmp from buoi_danh_gia d join hoc_sinh hs on hs.id = d.hoc_sinh_id
        where d.buoi_hoc_id = v_buoi and d.updated_at > v_dong1;
        ev := ev || tmp;
      end if;
    end if;

    -- bằng chứng HS nộp muộn (độc lập với việc đóng — nhân chứng thứ hai)
    if v_tab = 'btvn' then
      select coalesce(jsonb_agg(jsonb_build_object(
        'at', n.nop_at, 'loai', 'hs_nop',
        'mo_ta', 'HS ' || hs.ho_ten || ' nộp BTVN' || coalesce(' (' || n.nguon || ')', '')
          || case when v_han is not null and n.nop_at > v_han then ' — sau hạn ' || public._gay_nhan_tre(v_han, n.nop_at) else '' end
          || case when v_dong1 is not null and n.nop_at > v_dong1 then ' — sau khi đã đóng' else '' end,
        'actor', null)), '[]')
      into tmp from btvn_nop n join hoc_sinh hs on hs.id = n.hoc_sinh_id
      where n.buoi_hoc_id = v_buoi and n.nop_at is not null
        and ((v_han is not null and n.nop_at > v_han) or (v_dong1 is not null and n.nop_at > v_dong1));
      ev := ev || tmp;
    end if;
    if v_tab in ('et', 'btvn', 'mt') and b.lop_id is not null then
      select coalesce(jsonb_agg(jsonb_build_object(
        'at', bl.nop_at, 'loai', 'hs_nop',
        'mo_ta', 'HS ' || hs.ho_ten || ' nộp online'
          || case when bt.deadline is not null and bl.nop_at > bt.deadline then ' — sau hạn nộp ' || public._gay_nhan_tre(bt.deadline, bl.nop_at)
                  when bt.deadline is null and v_han is not null and bl.nop_at > v_han then ' — sau hạn ' || public._gay_nhan_tre(v_han, bl.nop_at) else '' end
          || case when v_dong1 is not null and bl.nop_at > v_dong1 then ' — sau khi đã đóng' else '' end,
        'actor', null)), '[]')
      into tmp from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id join hoc_sinh hs on hs.id = bl.hoc_sinh_id
      where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = v_tab and bl.nop_at is not null
        and (bl.nop_at > coalesce(bt.deadline, v_han) or (v_dong1 is not null and bl.nop_at > v_dong1));
      ev := ev || tmp;
    end if;
  else
    return '[]'::jsonb;
  end if;

  select coalesce(jsonb_agg(e order by (e->>'at')::timestamptz), '[]'::jsonb) into ev from jsonb_array_elements(ev) e;
  return ev;
end $fn$;
