-- ============================================================================
-- 202609022329 — thu_chi_v1
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--
-- Thu Chi BK = app HOÀN ỨNG chi tiêu nhân sự (PLAN-thu-chi.md, Thùy chốt 02/09/2026):
--   nhân sự chi tiền túi → tạo khoản (app BK Chi) → Lộc (kế toán, leaf `thuchi`) chuyển trả
--   theo VietQR → bấm "Đã thanh toán" + popup ghi sổ → khoản thành dòng SỔ CHI chính thức →
--   định kỳ Lộc CHỐT KỲ (tổng theo danh mục) gửi Ngân để Ngân bù tiền cho Lộc.
--
-- ① Tách 2 bảng `chi_khoan` (yêu cầu của nhân sự) và `chi_so` (sổ chính thức Lộc xác nhận):
--    số nhân sự báo và số Lộc duyệt có thể khác (Thùy: được, nhưng phải ghi lưu ý) — giữ cả
--    hai, không đè. Sổ chỉ có dòng khi Lộc XÁC NHẬN (luật §1.5: dòng ra đời là đã có kết quả thật).
-- ② "Đã thanh toán" + "Xác nhận ghi sổ" = MỘT RPC transactional (`fn_chi_thanh_toan_ghi_so`):
--    không có trạng thái lơ lửng "đã trả tiền mà chưa ghi sổ".
-- ③ Kỳ chốt cắt theo `chi_so.ghi_so_at` (thời điểm Lộc xác nhận, Thùy chốt câu 13), KHÔNG theo
--    ngày nhân sự gửi. Chốt "đến bây giờ" ⇒ `den_at = now()`, kỳ sau bắt đầu đúng từ đó ⇒
--    không khoản nào lọt hay bị đếm hai lần, Lộc không phải dò "chốt từ lúc nào".
-- ④ "File chốt" = SNAPSHOT SỐ LIỆU trong DB (`chi_ky` + `chi_ky_danh_muc`, chép cả tên danh mục
--    lúc chốt) — ảnh gửi Ngân sinh lại được bất kỳ lúc nào. Khoản đã chốt KHOÁ (trigger).
-- ⑤ Mọi đổi trạng thái khoản ghi vết bằng trigger (`chi_khoan_log`) — app không tự log (§4).
--    Chuyển trạng thái CHỈ qua RPC: RPC bật `set_config('chi.rpc','on',true)`, trigger chặn
--    update trạng thái trực tiếp qua PostgREST (kể cả chủ khoản tự đổi sang "đã thanh toán").
-- ⑥ Quyền bám GHẾ: leaf mới `thuchi` cấp ở màn Phân quyền (Lộc = ghi). Không hardcode NS003.
--    Tái dùng `co_chuc_nang`/`co_quyen_ghi` (202608151045). Nhân sự thường: chỉ khoản của mình.
-- ⑦ STK nhân sự = 3 cột trên `nhan_su` (nhân sự tự khai trong app, Lộc sửa được). NULL = chưa khai.
-- ⑧ Đề xuất danh mục theo LỊCH SỬ (không AI): danh mục nhân sự gợi ý → danh mục của khoản cũ
--    cùng nhân sự trùng từ khoá mục đích → danh mục hay dùng nhất của nhân sự → NULL.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Chỉ THÊM 3 cột nullable vào nhan_su + 6 bảng mới + hàm/trigger/policy mới.
-- ============================================================================

-- ── ⑦ STK nhân sự ──
alter table public.nhan_su
  add column if not exists bank_bin    text,   -- mã BIN NAPAS (6 số) — KHÁC số TK
  add column if not exists bank_stk    text,
  add column if not exists bank_chu_tk text;

-- ── helper: nhân sự hiện tại (khuôn coalesce của my_quyen/co_chuc_nang — người chưa có
--    dòng tai_khoan vẫn resolve được qua email) ──
create or replace function public.chi_me_id()
returns uuid language sql stable security definer set search_path = public as $$
  select coalesce(
    (select nhan_su_id from tai_khoan where id = public.jwt_uid()),
    (select id from nhan_su where email is not null
       and lower(email) = public.jwt_email() and public.jwt_email() <> '')
  );
$$;

-- ── bảng ──
create sequence if not exists chi_khoan_seq;
create sequence if not exists chi_ky_seq;

create table if not exists public.chi_danh_muc (
  id         uuid primary key default gen_random_uuid(),
  ten        text not null,
  thu_tu     int  not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.chi_khoan (
  id                  uuid primary key default gen_random_uuid(),
  ma                  text not null unique default ('CHI' || lpad(nextval('chi_khoan_seq')::text, 4, '0')),
  nhan_su_id          uuid not null references public.nhan_su(id),
  so_tien_bao         numeric not null check (so_tien_bao > 0),
  muc_dich            text not null check (length(trim(muc_dich)) > 0),
  ngay_chi            date not null,
  danh_muc_de_xuat_id uuid references public.chi_danh_muc(id),
  anh_paths           text[] not null default '{}',
  trang_thai          text not null default 'cho_duyet'
                      check (trang_thai in ('cho_duyet','da_thanh_toan','tu_choi','huy')),
  tu_choi_ly_do       text,
  xu_ly_boi           uuid references public.nhan_su(id),
  xu_ly_at            timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists chi_khoan_ns_idx on public.chi_khoan(nhan_su_id, created_at desc);
create index if not exists chi_khoan_tt_idx on public.chi_khoan(trang_thai, created_at desc);

create table if not exists public.chi_khoan_log (
  id           bigserial primary key,
  chi_khoan_id uuid not null references public.chi_khoan(id),
  actor        uuid references public.nhan_su(id),
  at           timestamptz not null default now(),
  tu           text,
  den          text not null,
  ghi_chu      text
);
create index if not exists chi_khoan_log_idx on public.chi_khoan_log(chi_khoan_id, at);

create table if not exists public.chi_ky (
  id        uuid primary key default gen_random_uuid(),
  ma        text not null unique default ('KY' || lpad(nextval('chi_ky_seq')::text, 3, '0')),
  tu_at     timestamptz not null,
  den_at    timestamptz not null,
  so_khoan  int not null,
  tong_tien numeric not null,
  ghi_chu   text,
  chot_boi  uuid references public.nhan_su(id),
  chot_at   timestamptz not null default now(),
  check (den_at >= tu_at)
);

create table if not exists public.chi_so (
  id           uuid primary key default gen_random_uuid(),
  chi_khoan_id uuid not null unique references public.chi_khoan(id),
  ngay         date not null,
  so_tien      numeric not null check (so_tien > 0),
  muc_dich     text not null check (length(trim(muc_dich)) > 0),
  danh_muc_id  uuid not null references public.chi_danh_muc(id),
  luu_y        text,
  ghi_so_boi   uuid references public.nhan_su(id),
  ghi_so_at    timestamptz not null default now(),
  ky_id        uuid references public.chi_ky(id)
);
create index if not exists chi_so_ky_idx on public.chi_so(ky_id, ghi_so_at);
create index if not exists chi_so_ghi_so_at_idx on public.chi_so(ghi_so_at);

create table if not exists public.chi_ky_danh_muc (
  ky_id        uuid not null references public.chi_ky(id),
  danh_muc_id  uuid not null references public.chi_danh_muc(id),
  ten_danh_muc text not null,   -- chép lúc chốt: đổi tên danh mục sau này không đổi file đã gửi Ngân
  so_khoan     int not null,
  so_tien      numeric not null,
  primary key (ky_id, danh_muc_id)
);

-- Seed vài danh mục mẫu — Lộc tự sửa/ẩn/thêm trên ERP (Thùy câu 9).
insert into public.chi_danh_muc (ten, thu_tu)
select v.ten, v.thu_tu from (values
  ('Văn phòng phẩm', 1), ('Cơ sở vật chất - sửa chữa', 2), ('Điện nước - internet', 3),
  ('In ấn - học liệu', 4), ('Marketing', 5), ('Tiếp khách - ăn uống', 6), ('Khác', 99)
) as v(ten, thu_tu)
where not exists (select 1 from public.chi_danh_muc);

-- ── trigger: ghi vết + khoá ──
create or replace function public.trg_chi_khoan_bf()
returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' then
    new.updated_at := now();
    -- Trạng thái cuối: bất biến (muốn sửa → tạo khoản mới).
    if old.trang_thai <> 'cho_duyet' then
      raise exception 'Khoản % đã ở trạng thái "%", không sửa được', old.ma, old.trang_thai;
    end if;
    -- Đổi trạng thái chỉ qua RPC (fn_chi_*): chặn chủ khoản tự đổi sang "đã thanh toán" qua PostgREST.
    if new.trang_thai <> old.trang_thai and coalesce(current_setting('chi.rpc', true), '') <> 'on' then
      raise exception 'Đổi trạng thái khoản chi phải qua RPC';
    end if;
    new.ma := old.ma; new.nhan_su_id := old.nhan_su_id; new.created_at := old.created_at;
  end if;
  return new;
end $$;
drop trigger if exists tg_chi_khoan_bf on public.chi_khoan;
create trigger tg_chi_khoan_bf before insert or update on public.chi_khoan
  for each row execute function public.trg_chi_khoan_bf();

create or replace function public.trg_chi_khoan_log()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into chi_khoan_log (chi_khoan_id, actor, tu, den) values (new.id, public.chi_me_id(), null, new.trang_thai);
  elsif new.trang_thai <> old.trang_thai then
    insert into chi_khoan_log (chi_khoan_id, actor, tu, den, ghi_chu)
    values (new.id, public.chi_me_id(), old.trang_thai, new.trang_thai, new.tu_choi_ly_do);
  end if;
  return new;
end $$;
drop trigger if exists tg_chi_khoan_log on public.chi_khoan;
create trigger tg_chi_khoan_log after insert or update on public.chi_khoan
  for each row execute function public.trg_chi_khoan_log();

create or replace function public.trg_chi_so_bf()
returns trigger language plpgsql as $$
declare v_bao numeric;
begin
  if tg_op = 'DELETE' then
    if old.ky_id is not null then raise exception 'Khoản đã chốt kỳ, không xoá được'; end if;
    return old;
  end if;
  if tg_op = 'UPDATE' then
    if old.ky_id is not null then raise exception 'Khoản đã chốt kỳ (%), không sửa được', old.ky_id; end if;
    if new.ky_id is not null and coalesce(current_setting('chi.rpc', true), '') <> 'on' then
      raise exception 'Gán kỳ chỉ qua fn_chi_ky_chot';
    end if;
    new.chi_khoan_id := old.chi_khoan_id; new.ghi_so_at := old.ghi_so_at; new.ghi_so_boi := old.ghi_so_boi;
  end if;
  -- Số duyệt ≠ số báo ⇒ PHẢI có lưu ý (Thùy câu 11).
  select so_tien_bao into v_bao from chi_khoan where id = new.chi_khoan_id;
  if new.so_tien <> v_bao and length(trim(coalesce(new.luu_y, ''))) = 0 then
    raise exception 'Số tiền duyệt (%) khác số nhân sự báo (%) — phải ghi lưu ý', new.so_tien, v_bao;
  end if;
  return new;
end $$;
drop trigger if exists tg_chi_so_bf on public.chi_so;
create trigger tg_chi_so_bf before insert or update or delete on public.chi_so
  for each row execute function public.trg_chi_so_bf();

-- ── RLS ──
alter table public.chi_danh_muc    enable row level security;
alter table public.chi_khoan       enable row level security;
alter table public.chi_khoan_log   enable row level security;
alter table public.chi_so          enable row level security;
alter table public.chi_ky          enable row level security;
alter table public.chi_ky_danh_muc enable row level security;

drop policy if exists chi_danh_muc_sel on public.chi_danh_muc;
drop policy if exists chi_danh_muc_all on public.chi_danh_muc;
create policy chi_danh_muc_sel on public.chi_danh_muc for select to authenticated using (public.la_thanh_vien());
create policy chi_danh_muc_all on public.chi_danh_muc for all to authenticated
  using (public.co_quyen_ghi('thuchi')) with check (public.co_quyen_ghi('thuchi'));

drop policy if exists chi_khoan_sel on public.chi_khoan;
drop policy if exists chi_khoan_ins on public.chi_khoan;
drop policy if exists chi_khoan_upd on public.chi_khoan;
create policy chi_khoan_sel on public.chi_khoan for select to authenticated
  using (nhan_su_id = public.chi_me_id() or public.co_chuc_nang('thuchi'));
create policy chi_khoan_ins on public.chi_khoan for insert to authenticated
  with check (nhan_su_id = public.chi_me_id());
create policy chi_khoan_upd on public.chi_khoan for update to authenticated
  using ((nhan_su_id = public.chi_me_id() and trang_thai = 'cho_duyet') or public.co_quyen_ghi('thuchi'))
  with check (nhan_su_id = public.chi_me_id() or public.co_quyen_ghi('thuchi'));
-- không có policy delete: huỷ = trạng thái `huy` (giữ vết)

drop policy if exists chi_khoan_log_sel on public.chi_khoan_log;
create policy chi_khoan_log_sel on public.chi_khoan_log for select to authenticated
  using (public.co_chuc_nang('thuchi')
     or exists (select 1 from public.chi_khoan k where k.id = chi_khoan_id and k.nhan_su_id = public.chi_me_id()));

drop policy if exists chi_so_sel on public.chi_so;
drop policy if exists chi_so_all on public.chi_so;
create policy chi_so_sel on public.chi_so for select to authenticated
  using (public.co_chuc_nang('thuchi')
     or exists (select 1 from public.chi_khoan k where k.id = chi_khoan_id and k.nhan_su_id = public.chi_me_id()));
create policy chi_so_all on public.chi_so for all to authenticated
  using (public.co_quyen_ghi('thuchi')) with check (public.co_quyen_ghi('thuchi'));

drop policy if exists chi_ky_sel on public.chi_ky;
drop policy if exists chi_ky_all on public.chi_ky;
create policy chi_ky_sel on public.chi_ky for select to authenticated using (public.co_chuc_nang('thuchi'));
create policy chi_ky_all on public.chi_ky for all to authenticated
  using (public.co_quyen_ghi('thuchi')) with check (public.co_quyen_ghi('thuchi'));

drop policy if exists chi_ky_danh_muc_sel on public.chi_ky_danh_muc;
drop policy if exists chi_ky_danh_muc_all on public.chi_ky_danh_muc;
create policy chi_ky_danh_muc_sel on public.chi_ky_danh_muc for select to authenticated using (public.co_chuc_nang('thuchi'));
create policy chi_ky_danh_muc_all on public.chi_ky_danh_muc for all to authenticated
  using (public.co_quyen_ghi('thuchi')) with check (public.co_quyen_ghi('thuchi'));

grant select, insert, update, delete on public.chi_danh_muc, public.chi_so, public.chi_ky, public.chi_ky_danh_muc to authenticated;
grant select, insert, update on public.chi_khoan to authenticated;
grant select, insert on public.chi_khoan_log to authenticated;
grant usage, select on sequence public.chi_khoan_seq, public.chi_ky_seq, public.chi_khoan_log_id_seq to authenticated;

-- ── RPC phía NHÂN SỰ (app BK Chi) — invoker + RLS ──
create or replace function public.fn_chi_tao(
  p_so_tien numeric, p_muc_dich text, p_ngay_chi date,
  p_danh_muc_id uuid default null, p_anh_paths text[] default '{}'
) returns uuid language plpgsql as $$
declare v_me uuid; v_id uuid;
begin
  v_me := public.chi_me_id();
  if v_me is null then raise exception 'Tài khoản chưa gắn hồ sơ nhân sự'; end if;
  insert into chi_khoan (nhan_su_id, so_tien_bao, muc_dich, ngay_chi, danh_muc_de_xuat_id, anh_paths)
  values (v_me, p_so_tien, trim(p_muc_dich), coalesce(p_ngay_chi, (now() at time zone 'Asia/Ho_Chi_Minh')::date),
          p_danh_muc_id, coalesce(p_anh_paths, '{}'))
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.fn_chi_sua(
  p_id uuid, p_so_tien numeric, p_muc_dich text, p_ngay_chi date,
  p_danh_muc_id uuid default null, p_anh_paths text[] default '{}'
) returns void language plpgsql as $$
declare v_n int;
begin
  update chi_khoan set so_tien_bao = p_so_tien, muc_dich = trim(p_muc_dich), ngay_chi = p_ngay_chi,
    danh_muc_de_xuat_id = p_danh_muc_id, anh_paths = coalesce(p_anh_paths, '{}')
  where id = p_id and nhan_su_id = public.chi_me_id() and trang_thai = 'cho_duyet';
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'Không sửa được: khoản không phải của bạn hoặc đã được xử lý'; end if;
end $$;

create or replace function public.fn_chi_huy(p_id uuid)
returns void language plpgsql as $$
declare v_n int;
begin
  perform set_config('chi.rpc', 'on', true);
  update chi_khoan set trang_thai = 'huy', xu_ly_boi = public.chi_me_id(), xu_ly_at = now()
  where id = p_id and nhan_su_id = public.chi_me_id() and trang_thai = 'cho_duyet';
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'Không huỷ được: khoản không phải của bạn hoặc đã được xử lý'; end if;
end $$;

-- Danh sách khoản của tôi (app): khoản + danh mục gợi ý + kết quả ghi sổ (nếu đã thanh toán).
create or replace function public.fn_chi_cua_toi()
returns table (
  id uuid, ma text, so_tien_bao numeric, muc_dich text, ngay_chi date, danh_muc_de_xuat_id uuid,
  danh_muc_de_xuat_ten text, anh_paths text[], trang_thai text, tu_choi_ly_do text, xu_ly_at timestamptz,
  created_at timestamptz, so_tien_duyet numeric, luu_y_duyet text, ghi_so_at timestamptz, danh_muc_duyet_ten text
) language sql stable as $$
  select k.id, k.ma, k.so_tien_bao, k.muc_dich, k.ngay_chi, k.danh_muc_de_xuat_id, d.ten,
         k.anh_paths, k.trang_thai, k.tu_choi_ly_do, k.xu_ly_at, k.created_at,
         s.so_tien, s.luu_y, s.ghi_so_at, d2.ten
  from chi_khoan k
  left join chi_danh_muc d  on d.id = k.danh_muc_de_xuat_id
  left join chi_so s        on s.chi_khoan_id = k.id
  left join chi_danh_muc d2 on d2.id = s.danh_muc_id
  where k.nhan_su_id = public.chi_me_id()
  order by (k.trang_thai = 'cho_duyet') desc, k.created_at desc
  limit 500;
$$;

-- ── RPC phía KẾ TOÁN (ERP, leaf thuchi) ──
create or replace function public.fn_chi_khoan_duyet(p_trang_thai text default 'cho_duyet')
returns table (
  id uuid, ma text, nhan_su_id uuid, ma_ns text, ho_ten text, bank_bin text, bank_stk text, bank_chu_tk text,
  so_tien_bao numeric, muc_dich text, ngay_chi date, danh_muc_de_xuat_id uuid, danh_muc_de_xuat_ten text,
  anh_paths text[], trang_thai text, tu_choi_ly_do text, xu_ly_boi_ten text, xu_ly_at timestamptz, created_at timestamptz
) language sql stable as $$
  select k.id, k.ma, k.nhan_su_id, n.ma_ns, n.ho_ten, n.bank_bin, n.bank_stk, n.bank_chu_tk,
         k.so_tien_bao, k.muc_dich, k.ngay_chi, k.danh_muc_de_xuat_id, d.ten,
         k.anh_paths, k.trang_thai, k.tu_choi_ly_do, x.ho_ten, k.xu_ly_at, k.created_at
  from chi_khoan k
  join nhan_su n on n.id = k.nhan_su_id
  left join chi_danh_muc d on d.id = k.danh_muc_de_xuat_id
  left join nhan_su x on x.id = k.xu_ly_boi
  where public.co_chuc_nang('thuchi') and (p_trang_thai is null or k.trang_thai = p_trang_thai)
  order by k.created_at desc
  limit 500;
$$;

-- Đề xuất danh mục theo lịch sử (⑧).
create or replace function public.fn_chi_de_xuat_danh_muc(p_chi_khoan_id uuid)
returns uuid language sql stable as $$
  with k as (
    select nhan_su_id, muc_dich, danh_muc_de_xuat_id from chi_khoan where id = p_chi_khoan_id
  ),
  tu as (
    select distinct w from k, regexp_split_to_table(lower(k.muc_dich), '[^[:alnum:]]+') as w
    where length(w) >= 3
  ),
  ls as (
    select s.danh_muc_id, lower(s.muc_dich) as md
    from chi_so s join chi_khoan c on c.id = s.chi_khoan_id join chi_danh_muc d on d.id = s.danh_muc_id, k
    where c.nhan_su_id = k.nhan_su_id and d.active
  ),
  diem as (
    select ls.danh_muc_id, count(*) as diem from ls join tu on ls.md like '%' || tu.w || '%' group by 1
  )
  select coalesce(
    (select k.danh_muc_de_xuat_id from k join chi_danh_muc d on d.id = k.danh_muc_de_xuat_id where d.active),
    (select danh_muc_id from diem order by diem desc limit 1),
    (select danh_muc_id from ls group by 1 order by count(*) desc limit 1)
  );
$$;

create or replace function public.fn_chi_tu_choi(p_id uuid, p_ly_do text)
returns void language plpgsql as $$
declare v_n int;
begin
  if not public.co_quyen_ghi('thuchi') then raise exception 'Không có quyền ghi Thu chi'; end if;
  if length(trim(coalesce(p_ly_do, ''))) = 0 then raise exception 'Từ chối phải có lý do'; end if;
  perform set_config('chi.rpc', 'on', true);
  update chi_khoan set trang_thai = 'tu_choi', tu_choi_ly_do = trim(p_ly_do),
    xu_ly_boi = public.chi_me_id(), xu_ly_at = now()
  where id = p_id and trang_thai = 'cho_duyet';
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'Khoản không còn ở trạng thái chờ duyệt'; end if;
end $$;

-- ② "Đã thanh toán" + popup ghi sổ = MỘT transaction. Trả về id dòng sổ.
create or replace function public.fn_chi_thanh_toan_ghi_so(
  p_id uuid, p_so_tien numeric, p_muc_dich text, p_danh_muc_id uuid, p_ngay date, p_luu_y text default null
) returns uuid language plpgsql as $$
declare v_k chi_khoan%rowtype; v_so uuid;
begin
  if not public.co_quyen_ghi('thuchi') then raise exception 'Không có quyền ghi Thu chi'; end if;
  select * into v_k from chi_khoan where id = p_id for update;
  if not found then raise exception 'Không thấy khoản chi'; end if;
  if v_k.trang_thai <> 'cho_duyet' then raise exception 'Khoản % đã ở trạng thái "%"', v_k.ma, v_k.trang_thai; end if;
  if not exists (select 1 from chi_danh_muc where id = p_danh_muc_id and active) then raise exception 'Danh mục không hợp lệ'; end if;
  perform set_config('chi.rpc', 'on', true);
  insert into chi_so (chi_khoan_id, ngay, so_tien, muc_dich, danh_muc_id, luu_y, ghi_so_boi)
  values (p_id, coalesce(p_ngay, v_k.ngay_chi), p_so_tien, trim(p_muc_dich), p_danh_muc_id,
          nullif(trim(coalesce(p_luu_y, '')), ''), public.chi_me_id())
  returning id into v_so;
  update chi_khoan set trang_thai = 'da_thanh_toan', xu_ly_boi = public.chi_me_id(), xu_ly_at = now() where id = p_id;
  return v_so;
end $$;

-- Sổ chi (ERP): lọc theo khoảng NGÀY GHI SỔ (giờ VN) / danh mục / nhân sự / kỳ.
create or replace function public.fn_chi_so_list(
  p_tu date default null, p_den date default null, p_danh_muc_id uuid default null,
  p_nhan_su_id uuid default null, p_ky_id uuid default null, p_chua_chot boolean default false
) returns table (
  id uuid, chi_khoan_id uuid, ma text, ma_ns text, ho_ten text, ngay date, so_tien numeric, so_tien_bao numeric,
  muc_dich text, danh_muc_id uuid, danh_muc_ten text, luu_y text, ghi_so_at timestamptz, ghi_so_boi_ten text,
  ky_id uuid, ky_ma text, anh_paths text[]
) language sql stable as $$
  select s.id, k.id, k.ma, n.ma_ns, n.ho_ten, s.ngay, s.so_tien, k.so_tien_bao, s.muc_dich,
         s.danh_muc_id, d.ten, s.luu_y, s.ghi_so_at, g.ho_ten, s.ky_id, y.ma, k.anh_paths
  from chi_so s
  join chi_khoan k on k.id = s.chi_khoan_id
  join nhan_su n on n.id = k.nhan_su_id
  join chi_danh_muc d on d.id = s.danh_muc_id
  left join nhan_su g on g.id = s.ghi_so_boi
  left join chi_ky y on y.id = s.ky_id
  where public.co_chuc_nang('thuchi')
    and (p_tu is null or (s.ghi_so_at at time zone 'Asia/Ho_Chi_Minh')::date >= p_tu)
    and (p_den is null or (s.ghi_so_at at time zone 'Asia/Ho_Chi_Minh')::date <= p_den)
    and (p_danh_muc_id is null or s.danh_muc_id = p_danh_muc_id)
    and (p_nhan_su_id is null or k.nhan_su_id = p_nhan_su_id)
    and (p_ky_id is null or s.ky_id = p_ky_id)
    and (not p_chua_chot or s.ky_id is null)
  order by s.ghi_so_at desc
  limit 1000;
$$;

-- Nội dung một kỳ (p_ky null = phần CHƯA CHỐT tính đến bây giờ) — dùng chung cho xem trước và xem lại.
create or replace function public._chi_ky_json(p_ky uuid)
returns jsonb language sql stable as $$
  with ky as (
    select id, ma, tu_at, den_at, ghi_chu, chot_at, (select ho_ten from nhan_su where id = chot_boi) as chot_boi_ten
    from chi_ky where id = p_ky
    union all
    select null::uuid, null::text,
           coalesce((select max(den_at) from chi_ky), (select min(ghi_so_at) from chi_so where ky_id is null), now()),
           now(), null::text, null::timestamptz, null::text
    where p_ky is null
  ),
  dong as (
    select s.id, k.ma, n.ma_ns, n.ho_ten, s.ngay, s.so_tien, s.muc_dich, s.luu_y, s.ghi_so_at,
           s.danh_muc_id, d.ten as danh_muc_ten
    from chi_so s join chi_khoan k on k.id = s.chi_khoan_id join nhan_su n on n.id = k.nhan_su_id
    join chi_danh_muc d on d.id = s.danh_muc_id
    where (p_ky is not null and s.ky_id = p_ky) or (p_ky is null and s.ky_id is null)
  ),
  dm as (
    select danh_muc_id, ten_danh_muc, so_khoan, so_tien from chi_ky_danh_muc where ky_id = p_ky
    union all
    select danh_muc_id, danh_muc_ten, count(*)::int, sum(so_tien) from dong where p_ky is null group by 1, 2
  )
  select jsonb_build_object(
    'id', ky.id, 'ma', ky.ma, 'tu_at', ky.tu_at, 'den_at', ky.den_at, 'ghi_chu', ky.ghi_chu,
    'chot_at', ky.chot_at, 'chot_boi_ten', ky.chot_boi_ten,
    'so_khoan', (select count(*) from dong), 'tong_tien', coalesce((select sum(so_tien) from dong), 0),
    'danh_muc', coalesce((select jsonb_agg(jsonb_build_object('danh_muc_id', danh_muc_id, 'ten', ten_danh_muc,
                    'so_khoan', so_khoan, 'so_tien', so_tien) order by so_tien desc) from dm), '[]'::jsonb),
    'khoan', coalesce((select jsonb_agg(to_jsonb(dong) order by dong.ghi_so_at) from dong), '[]'::jsonb)
  )
  from ky
  where public.co_chuc_nang('thuchi');
$$;

create or replace function public.fn_chi_ky_xem_truoc() returns jsonb language sql stable as $$
  select public._chi_ky_json(null);
$$;
create or replace function public.fn_chi_ky_chi_tiet(p_ky_id uuid) returns jsonb language sql stable as $$
  select public._chi_ky_json(p_ky_id);
$$;

-- ③ Chốt kỳ: den_at = now(); gom mọi dòng sổ chưa chốt; snapshot theo danh mục (④).
create or replace function public.fn_chi_ky_chot(p_ghi_chu text default null)
returns uuid language plpgsql as $$
declare v_ky uuid; v_tu timestamptz; v_den timestamptz := now(); v_n int; v_tong numeric;
begin
  if not public.co_quyen_ghi('thuchi') then raise exception 'Không có quyền ghi Thu chi'; end if;
  perform pg_advisory_xact_lock(hashtext('chi_ky_chot'));
  select count(*), coalesce(sum(so_tien), 0) into v_n, v_tong from chi_so where ky_id is null and ghi_so_at <= v_den;
  if v_n = 0 then raise exception 'Không có khoản nào chưa chốt'; end if;
  v_tu := coalesce((select max(den_at) from chi_ky), (select min(ghi_so_at) from chi_so where ky_id is null));
  insert into chi_ky (tu_at, den_at, so_khoan, tong_tien, ghi_chu, chot_boi)
  values (v_tu, v_den, v_n, v_tong, nullif(trim(coalesce(p_ghi_chu, '')), ''), public.chi_me_id())
  returning id into v_ky;
  perform set_config('chi.rpc', 'on', true);
  update chi_so set ky_id = v_ky where ky_id is null and ghi_so_at <= v_den;
  insert into chi_ky_danh_muc (ky_id, danh_muc_id, ten_danh_muc, so_khoan, so_tien)
  select v_ky, s.danh_muc_id, d.ten, count(*), sum(s.so_tien)
  from chi_so s join chi_danh_muc d on d.id = s.danh_muc_id
  where s.ky_id = v_ky group by s.danh_muc_id, d.ten;
  return v_ky;
end $$;

create or replace function public.fn_chi_ky_list()
returns table (id uuid, ma text, tu_at timestamptz, den_at timestamptz, so_khoan int, tong_tien numeric,
               ghi_chu text, chot_at timestamptz, chot_boi_ten text)
language sql stable as $$
  select y.id, y.ma, y.tu_at, y.den_at, y.so_khoan, y.tong_tien, y.ghi_chu, y.chot_at, n.ho_ten
  from chi_ky y left join nhan_su n on n.id = y.chot_boi
  where public.co_chuc_nang('thuchi')
  order by y.den_at desc limit 200;
$$;

-- Badge/tổng quan (ERP header + app): số chờ duyệt, phần chưa chốt, kỳ gần nhất.
create or replace function public.fn_chi_tong_quan() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'cho_duyet',       (select count(*) from chi_khoan where trang_thai = 'cho_duyet'),
    'cho_duyet_tien',  (select coalesce(sum(so_tien_bao), 0) from chi_khoan where trang_thai = 'cho_duyet'),
    'chua_chot',       (select count(*) from chi_so where ky_id is null),
    'chua_chot_tien',  (select coalesce(sum(so_tien), 0) from chi_so where ky_id is null),
    'ky_gan_nhat',     (select jsonb_build_object('ma', ma, 'den_at', den_at, 'tong_tien', tong_tien)
                        from chi_ky order by den_at desc limit 1)
  );
$$;

-- Danh sách nhân sự + STK (tab "Tài khoản NS" trên ERP).
create or replace function public.fn_chi_nhan_su_bank()
returns table (id uuid, ma_ns text, ho_ten text, bank_bin text, bank_stk text, bank_chu_tk text,
               so_khoan_cho int, so_khoan_tong int)
language sql stable as $$
  select n.id, n.ma_ns, n.ho_ten, n.bank_bin, n.bank_stk, n.bank_chu_tk,
         (select count(*)::int from chi_khoan k where k.nhan_su_id = n.id and k.trang_thai = 'cho_duyet'),
         (select count(*)::int from chi_khoan k where k.nhan_su_id = n.id)
  from nhan_su n
  where public.co_chuc_nang('thuchi') and n.trang_thai = 'dang_lam'
  order by n.ma_ns limit 500;
$$;

grant execute on function
  public.chi_me_id(), public.fn_chi_tao(numeric, text, date, uuid, text[]),
  public.fn_chi_sua(uuid, numeric, text, date, uuid, text[]), public.fn_chi_huy(uuid), public.fn_chi_cua_toi(),
  public.fn_chi_khoan_duyet(text), public.fn_chi_de_xuat_danh_muc(uuid), public.fn_chi_tu_choi(uuid, text),
  public.fn_chi_thanh_toan_ghi_so(uuid, numeric, text, uuid, date, text),
  public.fn_chi_so_list(date, date, uuid, uuid, uuid, boolean), public._chi_ky_json(uuid),
  public.fn_chi_ky_xem_truoc(), public.fn_chi_ky_chi_tiet(uuid), public.fn_chi_ky_chot(text), public.fn_chi_ky_list(),
  public.fn_chi_tong_quan(), public.fn_chi_nhan_su_bank()
to authenticated;
