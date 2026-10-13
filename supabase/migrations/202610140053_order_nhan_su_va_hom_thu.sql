-- ============================================================================
-- 202610140053 — order_nhan_su_va_hom_thu
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 14/10, hai việc:
--   (1) BẢNG ORDER — nhân sự BK "đặt hàng" nhau làm một việc. Nói miệng thì quên; nhiều việc chưa đủ
--       thành task (chưa chốt) nên không có chỗ ghi. Order là lớp NHẸ hơn task: 1 người đặt → 1 người nhận,
--       nhận phản hồi bằng trạng thái (Bận / Đang làm / Xong / Không làm được) + ghi chú, có dòng lịch sử.
--       Nhiều người nhận ⇒ đặt nhiều order. Chỉ 2 bên thấy order của nhau (không công khai toàn team).
--   (2) HÒM THƯ — mọi thứ liên quan TỚI MỘT NGƯỜI hiện ở một chỗ, chuông + số chưa đọc ở thanh trên.
--       Nguồn đợt này: order (đặt / phản hồi, cả 2 phía) · gậy (bị ghi / gỡ / thu hồi) · việc phát triển
--       (được giao / chuyển người / chờ nghiệm thu / đạt / trả lại / có nhận xét nghiệm thu).
--       Mỗi sự kiện = 1 dòng PER NGƯỜI NHẬN, do DB tự đẻ (RPC trong cùng transaction hoặc trigger) —
--       app không được "nhớ ghi" (CLAUDE.md §4). Client chỉ đọc + đánh dấu đã đọc.
--   Quyết định tự chốt (đổi được): order 1-1 · trạng thái moi/ban/dang_lam/xong/tu_choi/huy · người đặt
--   được huỷ / mở lại, người nhận được ban/dang_lam/xong/tu_choi · không tự đặt cho mình · hòm thư KHÔNG
--   cho xoá (chỉ đánh dấu đã đọc).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ THÊM 3 bảng, 3 hàm, 2 trigger (gay_ledger, viec) chỉ GHI vào hom_thu.
--   Trigger bọc exception: lỗi hòm thư KHÔNG BAO GIỜ làm hỏng việc ghi gậy / giao việc.
-- ============================================================================

-- ── ORDER ───────────────────────────────────────────────────────────────────
create table if not exists nhan_su_order (
  id            uuid primary key default gen_random_uuid(),
  nguoi_dat_id  uuid not null references nhan_su(id),
  nguoi_nhan_id uuid not null references nhan_su(id),
  noi_dung      text not null check (length(btrim(noi_dung)) between 1 and 1000),
  han           date,                       -- NULL = không đặt hạn (không áp dụng)
  trang_thai    text not null default 'moi'
                check (trang_thai in ('moi','ban','dang_lam','xong','tu_choi','huy')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (nguoi_dat_id <> nguoi_nhan_id)
);
create index if not exists nhan_su_order_nhan_idx on nhan_su_order (nguoi_nhan_id, trang_thai, created_at desc);
create index if not exists nhan_su_order_dat_idx  on nhan_su_order (nguoi_dat_id, trang_thai, created_at desc);

create table if not exists nhan_su_order_log (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references nhan_su_order(id) on delete cascade,
  nguoi_id   uuid not null references nhan_su(id),
  trang_thai text not null,
  ghi_chu    text,                          -- NULL = không kèm lời nhắn
  created_at timestamptz not null default now()
);
create index if not exists nhan_su_order_log_order_idx on nhan_su_order_log (order_id, created_at);

-- ── HÒM THƯ ─────────────────────────────────────────────────────────────────
create table if not exists hom_thu (
  id          uuid primary key default gen_random_uuid(),
  nhan_su_id  uuid not null references nhan_su(id) on delete cascade,   -- người NHẬN thư
  loai        text not null check (loai in ('order','gay','viec','nhan_xet','he_thong')),
  tieu_de     text not null,
  noi_dung    text,
  tu_nhan_su  uuid references nhan_su(id),  -- NULL = hệ thống tự sinh (không áp dụng người gửi)
  lien_ket    text,                         -- id leaf menu ERP để nhảy tới (NULL = không có màn đích)
  da_doc      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists hom_thu_nhan_idx on hom_thu (nhan_su_id, da_doc, created_at desc);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table nhan_su_order     enable row level security;
alter table nhan_su_order_log enable row level security;
alter table hom_thu           enable row level security;

drop policy if exists nhan_su_order_sel on nhan_su_order;
create policy nhan_su_order_sel on nhan_su_order for select to authenticated
  using (nguoi_dat_id = public.current_nhan_su_id() or nguoi_nhan_id = public.current_nhan_su_id());
drop policy if exists nhan_su_order_log_sel on nhan_su_order_log;
create policy nhan_su_order_log_sel on nhan_su_order_log for select to authenticated
  using (exists (select 1 from nhan_su_order o where o.id = order_id
                 and (o.nguoi_dat_id = public.current_nhan_su_id() or o.nguoi_nhan_id = public.current_nhan_su_id())));
-- GHI order / log: chỉ qua fn_order_* (security definer) — không mở policy ghi.

drop policy if exists hom_thu_sel on hom_thu;
create policy hom_thu_sel on hom_thu for select to authenticated using (nhan_su_id = public.current_nhan_su_id());
drop policy if exists hom_thu_upd on hom_thu;
create policy hom_thu_upd on hom_thu for update to authenticated
  using (nhan_su_id = public.current_nhan_su_id()) with check (nhan_su_id = public.current_nhan_su_id());

revoke all on nhan_su_order, nhan_su_order_log, hom_thu from anon, authenticated;
grant select on nhan_su_order, nhan_su_order_log, hom_thu to authenticated;
grant update (da_doc) on hom_thu to authenticated;   -- chỉ được đổi cờ đã đọc, không sửa nội dung thư

-- ── HÀM GỬI THƯ (nội bộ) ────────────────────────────────────────────────────
-- Không cho client gọi: người dùng không được tự bơm thư vào hòm thư người khác.
create or replace function public._hom_thu_gui(
  p_nhan uuid, p_loai text, p_tieu_de text, p_noi_dung text, p_lien_ket text, p_tu uuid
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_nhan is null or p_nhan is not distinct from p_tu then return; end if;   -- không tự gửi cho mình
  insert into hom_thu (nhan_su_id, loai, tieu_de, noi_dung, lien_ket, tu_nhan_su)
  values (p_nhan, p_loai, p_tieu_de, nullif(btrim(coalesce(p_noi_dung, '')), ''), p_lien_ket, p_tu);
end $$;
revoke all on function public._hom_thu_gui(uuid, text, text, text, text, uuid) from public, anon, authenticated;

-- ── RPC ORDER ───────────────────────────────────────────────────────────────
create or replace function public.fn_order_tao(p_nguoi_nhan uuid, p_noi_dung text, p_han date default null)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); v_id uuid; v_ten text;
begin
  if v_me is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  if p_nguoi_nhan is null or p_nguoi_nhan = v_me then raise exception 'Chọn người khác để đặt order'; end if;
  if not exists (select 1 from nhan_su where id = p_nguoi_nhan and trang_thai = 'dang_lam') then
    raise exception 'Người nhận không còn làm việc';
  end if;
  insert into nhan_su_order (nguoi_dat_id, nguoi_nhan_id, noi_dung, han)
  values (v_me, p_nguoi_nhan, btrim(p_noi_dung), p_han) returning id into v_id;
  insert into nhan_su_order_log (order_id, nguoi_id, trang_thai) values (v_id, v_me, 'moi');
  select ho_ten into v_ten from nhan_su where id = v_me;
  perform public._hom_thu_gui(p_nguoi_nhan, 'order', v_ten || ' đặt order cho bạn', btrim(p_noi_dung), 'home', v_me);
  return v_id;
end $$;

-- Phản hồi / đổi trạng thái / ghi chú. Cùng trạng thái + có ghi chú = chỉ để lại lời nhắn.
create or replace function public.fn_order_phan_hoi(p_order uuid, p_trang_thai text, p_ghi_chu text default null)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_me uuid := public.current_nhan_su_id(); o nhan_su_order%rowtype;
  v_ten text; v_nhan uuid; v_nhan_ten text;
  v_nhan_xet text := nullif(btrim(coalesce(p_ghi_chu, '')), '');
begin
  if v_me is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  select * into o from nhan_su_order where id = p_order for update;
  if not found or v_me not in (o.nguoi_dat_id, o.nguoi_nhan_id) then raise exception 'Không tìm thấy order'; end if;
  if p_trang_thai not in ('moi','ban','dang_lam','xong','tu_choi','huy') then raise exception 'Trạng thái không hợp lệ'; end if;
  if v_me = o.nguoi_nhan_id and p_trang_thai not in ('ban','dang_lam','xong','tu_choi', o.trang_thai) then
    raise exception 'Người nhận chỉ được chọn: Bận · Đang làm · Xong · Không làm được';
  end if;
  if v_me = o.nguoi_dat_id and v_me <> o.nguoi_nhan_id and p_trang_thai not in ('huy','moi', o.trang_thai) then
    raise exception 'Người đặt chỉ được: Huỷ · Mở lại';
  end if;
  if p_trang_thai = o.trang_thai and v_nhan_xet is null then return; end if;   -- không có gì mới

  update nhan_su_order set trang_thai = p_trang_thai, updated_at = now() where id = o.id;
  insert into nhan_su_order_log (order_id, nguoi_id, trang_thai, ghi_chu) values (o.id, v_me, p_trang_thai, v_nhan_xet);

  select ho_ten into v_ten from nhan_su where id = v_me;
  v_nhan := case when v_me = o.nguoi_nhan_id then o.nguoi_dat_id else o.nguoi_nhan_id end;
  perform public._hom_thu_gui(
    v_nhan, 'order',
    case when p_trang_thai = o.trang_thai then v_ten || ' nhắn về order'
         else v_ten || case p_trang_thai
           when 'ban' then ': Bận, chưa làm được'
           when 'dang_lam' then ': đang làm order'
           when 'xong' then ': đã xong order'
           when 'tu_choi' then ': không làm được order'
           when 'huy' then ': huỷ order'
           else ': mở lại order' end end,
    left(o.noi_dung, 160) || coalesce(E'\n💬 ' || v_nhan_xet, ''),
    'home', v_me);
end $$;

revoke all on function public.fn_order_tao(uuid, text, date) from public, anon;
revoke all on function public.fn_order_phan_hoi(uuid, text, text) from public, anon;
grant execute on function public.fn_order_tao(uuid, text, date) to authenticated;
grant execute on function public.fn_order_phan_hoi(uuid, text, text) to authenticated;

-- ── NGUỒN: GẬY ──────────────────────────────────────────────────────────────
create or replace function public._hom_thu_tg_gay() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  begin
    if tg_op = 'INSERT' then
      if new.loai = 'go' then
        perform public._hom_thu_gui(new.nhan_su_id, 'gay', 'Gậy của bạn được gỡ', new.ly_do, 'gay', new.nguoi_tao);
      elsif new.so_gay > 0 then
        perform public._hom_thu_gui(new.nhan_su_id, 'gay',
          'Bạn bị ghi ' || new.so_gay || ' gậy', coalesce(new.ref_mo_ta, new.ly_do), 'gay', new.nguoi_tao);
      end if;
    elsif old.thu_hoi_at is null and new.thu_hoi_at is not null then
      perform public._hom_thu_gui(new.nhan_su_id, 'gay', 'Một gậy của bạn được thu hồi',
        coalesce(new.thu_hoi_ly_do, new.ly_do), 'gay', new.nguoi_thu_hoi);
    end if;
  exception when others then null;   -- hòm thư lỗi không được làm hỏng sổ gậy
  end;
  return new;
end $$;
revoke all on function public._hom_thu_tg_gay() from public, anon, authenticated;
drop trigger if exists hom_thu_gay_trg on gay_ledger;
create trigger hom_thu_gay_trg after insert or update of thu_hoi_at on gay_ledger
  for each row execute function public._hom_thu_tg_gay();

-- ── NGUỒN: VIỆC PHÁT TRIỂN ─────────────────────────────────────────────────
create or replace function public._hom_thu_tg_viec() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_actor uuid := public.current_nhan_su_id();
begin
  begin
    if tg_op = 'INSERT' then
      perform public._hom_thu_gui(new.nguoi_lam_id, 'viec', 'Bạn được giao việc mới', new.tieu_de, 'giaoviec', coalesce(v_actor, new.nguoi_giao_id));
    else
      if new.nguoi_lam_id is distinct from old.nguoi_lam_id then
        perform public._hom_thu_gui(new.nguoi_lam_id, 'viec', 'Bạn được giao việc', new.tieu_de, 'giaoviec', v_actor);
      end if;
      if new.trang_thai is distinct from old.trang_thai then
        if new.trang_thai = 'cho_nghiem_thu' then
          perform public._hom_thu_gui(new.nguoi_giao_id, 'viec', 'Việc chờ bạn nghiệm thu', new.tieu_de, 'giaoviec', v_actor);
        elsif new.trang_thai = 'dat' then
          perform public._hom_thu_gui(new.nguoi_lam_id, 'nhan_xet', 'Việc của bạn đã được nghiệm thu: ĐẠT',
            new.tieu_de || coalesce(E'\n💬 ' || nullif(btrim(coalesce(new.ghi_chu_nghiem_thu, '')), ''), ''), 'giaoviec', v_actor);
        elsif new.trang_thai = 'tra_lai' then
          perform public._hom_thu_gui(new.nguoi_lam_id, 'nhan_xet', 'Việc của bạn bị trả lại',
            new.tieu_de || coalesce(E'\n💬 ' || nullif(btrim(coalesce(new.ghi_chu_nghiem_thu, '')), ''), ''), 'giaoviec', v_actor);
        end if;
      elsif new.ghi_chu_nghiem_thu is distinct from old.ghi_chu_nghiem_thu
            and nullif(btrim(coalesce(new.ghi_chu_nghiem_thu, '')), '') is not null then
        perform public._hom_thu_gui(new.nguoi_lam_id, 'nhan_xet', 'Việc của bạn có nhận xét mới',
          new.tieu_de || E'\n💬 ' || btrim(new.ghi_chu_nghiem_thu), 'giaoviec', v_actor);
      end if;
    end if;
  exception when others then null;
  end;
  return new;
end $$;
revoke all on function public._hom_thu_tg_viec() from public, anon, authenticated;
drop trigger if exists hom_thu_viec_trg on viec;
create trigger hom_thu_viec_trg after insert or update of nguoi_lam_id, trang_thai, ghi_chu_nghiem_thu on viec
  for each row execute function public._hom_thu_tg_viec();

comment on table nhan_su_order is 'Order giữa nhân sự BK: 1 người đặt → 1 người nhận, phản hồi bằng trạng thái. Ghi qua fn_order_*.';
comment on table nhan_su_order_log is 'Lịch sử trạng thái + lời nhắn của từng order (append-only, do fn_order_* ghi).';
comment on table hom_thu is 'Hòm thư nhân sự: mỗi sự kiện liên quan tới 1 người = 1 dòng. DB tự đẻ (fn_order_*, trigger gay_ledger/viec); client chỉ đọc + đánh dấu đã đọc.';
