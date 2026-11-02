-- ============================================================================
-- 202611011822 — PHIÊN CLAUDE cho trưởng khối (spec-phong-truong-khoi.md)
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 31/10–01/11):
--   Trước đây trưởng khối thấy bản đồ Claude draft chỗ nào chưa ổn thì phải BÁO THÙY để Thùy
--   ra lệnh cho Claude; trưởng khối tự sửa tay cũng phải báo Thùy để Thùy bảo Claude "làm tiếp".
--   Thùy thành trạm chuyển tin. Đích: trưởng khối CHAT THẲNG với Claude, kiểu Claude Code,
--   mỗi việc một PHIÊN (chọn loại việc → mở → làm → đóng). Claude chạy bằng Claude Code
--   (subscription) trên máy Thùy — bot scripts/phien/bot.mjs, cùng khuôn bot hỏi–đáp.
--
--   Mô hình:
--   · claude_phien       — 1 dòng / phiên. Khoá vào (môn × khối) + loại việc. Mã phiên = session id
--                           của Claude Code (bot chạy `--session-id <id>` lượt đầu, `--resume <id>` sau)
--                           ⇒ không cần cột "session id chờ điền" (§1.5: không insert trước điền sau).
--   · claude_phien_tin   — tin nhắn. Tin của NGƯỜI (và tin hệ thống "đóng phiên") CHÍNH LÀ VIỆC của
--                           bot: trang_thai cho → dang_xu → xong/loi. Tin của CLAUDE sinh ra khi Claude
--                           bắt đầu trả lời, bot cập nhật nội dung dần (chữ chạy) rồi đóng 'xong'.
--   · claude_phien_ghi   — vết MỌI lệnh Claude ghi vào bản đồ (lệnh, tham số, kết quả).
--   · claude_phien_lich_su — trigger tự ghi mỗi lần phiên đổi trạng thái (§4 CLAUDE.md).
--   · claude_phien_bot   — heartbeat 1 dòng: bot chạy / nghỉ hạn mức subscription / dừng.
--
--   ⭐ RÀO CỨNG Ở DB, KHÔNG Ở LỜI DẶN CLAUDE (CLAUDE.md §2.1 bài học "an toàn cứng" chưa ai kiểm):
--   Claude chỉ có 1 tay ghi: `node scripts/phien/ban-do.mjs` → RPC fn_phien_bd_* (chỉ service_role
--   gọi được). Mỗi RPC: (1) phiên phải đang mở + đúng loại việc; (2) ĐÓNG VAI người mở phiên
--   (set request.jwt.claims.sub = tài khoản người mở) rồi kiểm lại "trưởng khối trở lên" của khối
--   ⇒ AI không bao giờ có quyền lớn hơn người nhờ nó, và phân công đổi giữa chừng thì lệnh sau bị
--   chặn; (3) mọi nút bị đụng phải thuộc ĐÚNG khối của phiên; (4) KHÔNG có lệnh xoá — Claude chỉ
--   đề xuất, trưởng khối xoá tay trên màn Bản đồ mới (Luật xoá). Trigger log bản đồ ghi actor =
--   người mở phiên (họ ra lệnh ⇒ họ chịu trách nhiệm); claude_phien_ghi cho biết dòng nào đến từ Claude.
--
--   Môn → bộ bảng bản đồ qua ĐÚNG 1 registry `_phien_bdm_bang` (§1.6, cùng bảng với
--   src/lib/kho/banDoMoi.ts BDM_MON). Môn chưa có bản đồ mới ⇒ báo rõ, không đoán.
--
--   Bản thử: chỉ mở loại việc 'ban_do' (`_phien_loai_dang_mo`). CHECK đã nhận đủ 5 loại đã chốt để
--   bật thêm không phải nới CHECK (bài học prep_phong.luot / viec_van_hanh_duyet.tab).
--
-- ÁP BẰNG `npm run migrate` (owner claude_build). Áp bằng SQL Editor thì `anon` được grant tường minh
-- (CLAUDE.md §2.1, mig 202609182334) — các hàm dưới đã revoke từ anon cho cả hai đường.
--
-- MẤT GÌ (Luật xoá): KHÔNG mất gì. 5 bảng mới + hàm mới, không đụng bảng/hàm đang có
--   (chỉ ĐỌC dai_bdm_* / khtn_bdm_* và ghi vào chúng qua đúng đường INSERT/UPDATE như màn Bản đồ mới).
-- ============================================================================

-- ── 1. Bảng ─────────────────────────────────────────────────────────────────
create table if not exists claude_phien (
  id          uuid primary key default gen_random_uuid(),   -- = session id của Claude Code
  loai        text not null,
  mon         text not null,
  khoi        text not null,
  tieu_de     text not null,
  nguoi_mo    uuid not null,                                -- tai_khoan.id (jwt_uid lúc mở)
  nhan_su_id  uuid not null references nhan_su(id),
  trang_thai  text not null default 'mo',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table claude_phien drop constraint if exists claude_phien_loai_ck;
alter table claude_phien add constraint claude_phien_loai_ck
  check (loai = any (array['ban_do', 'ly_thuyet', 'nhap_kho', 'bao_sai', 'giai_bai']));
alter table claude_phien drop constraint if exists claude_phien_tt_ck;
alter table claude_phien add constraint claude_phien_tt_ck
  check (trang_thai = any (array['mo', 'dang_dong', 'dong']));
-- Mỗi bản đồ chỉ MỘT phiên sửa tại một thời điểm (Thùy 01/11) — hai người cùng sửa cấu trúc là ca rối nhất.
create unique index if not exists claude_phien_ban_do_mot_idx on claude_phien (mon, khoi)
  where loai = 'ban_do' and trang_thai <> 'dong';
create index if not exists claude_phien_khoi_idx on claude_phien (mon, khoi, updated_at desc);
comment on table claude_phien is
  'Phiên chat trưởng khối ↔ Claude Code (spec-phong-truong-khoi.md). id = session id Claude Code. Bot scripts/phien/bot.mjs chạy trên máy Thùy.';

create table if not exists claude_phien_tin (
  id           bigint generated always as identity primary key,
  phien_id     uuid not null references claude_phien(id),
  vai          text not null,
  nguoi_gui    uuid,               -- tai_khoan.id — CHỈ tin vai='nguoi' (tin Claude/hệ thống: không áp dụng)
  noi_dung     text not null,
  trang_thai   text not null,
  so_lan       integer not null default 0,   -- số lần bot đã thử việc này — thiếu cột này là việc hỏng quay vòng vô hạn
  loi          text,               -- chỉ khi trang_thai='loi' hoặc lần thử trước hỏng
  tra_loi_cho  bigint references claude_phien_tin(id),  -- tin Claude trả lời cho tin nào (tin người: không áp dụng)
  usage        jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table claude_phien_tin drop constraint if exists claude_phien_tin_vai_ck;
alter table claude_phien_tin add constraint claude_phien_tin_vai_ck
  check (vai = any (array['nguoi', 'claude', 'he_thong']));
-- Tin người / hệ thống = việc của bot (cho → dang_xu → xong | loi). Tin Claude: dang_viet → xong | dung.
alter table claude_phien_tin drop constraint if exists claude_phien_tin_tt_ck;
alter table claude_phien_tin add constraint claude_phien_tin_tt_ck
  check ((vai = 'claude' and trang_thai = any (array['dang_viet', 'xong', 'dung']))
      or (vai <> 'claude' and trang_thai = any (array['cho', 'dang_xu', 'xong', 'loi'])));
alter table claude_phien_tin drop constraint if exists claude_phien_tin_nguoi_ck;
alter table claude_phien_tin add constraint claude_phien_tin_nguoi_ck
  check ((vai = 'nguoi') = (nguoi_gui is not null));
create index if not exists claude_phien_tin_phien_idx on claude_phien_tin (phien_id, id);
create index if not exists claude_phien_tin_cho_idx on claude_phien_tin (created_at) where trang_thai = 'cho';
comment on table claude_phien_tin is
  'Tin nhắn của phiên Claude. Tin người/hệ thống = việc của bot (cho→dang_xu→xong/loi); tin Claude cập nhật dần khi Claude đang viết (dang_viet→xong/dung). Client chỉ thêm tin qua fn_phien_gui.';

create table if not exists claude_phien_ghi (
  id        bigint generated always as identity primary key,
  phien_id  uuid not null references claude_phien(id),
  viec      text not null,
  tham_so   jsonb not null,
  ket_qua   jsonb not null,
  at        timestamptz not null default now()   -- = now() của transaction ghi ⇒ khớp đúng `at` của dòng log bản đồ cùng lệnh
);
create index if not exists claude_phien_ghi_phien_idx on claude_phien_ghi (phien_id, id);
create index if not exists claude_phien_ghi_at_idx on claude_phien_ghi (at);
comment on table claude_phien_ghi is
  'Vết mọi lệnh Claude ghi vào bản đồ qua fn_phien_bd_ghi. `at` = now() của transaction ⇒ trùng `at` của các dòng *_bdm_log do chính lệnh đó sinh ra — dùng để tách "Claude sửa" với "người sửa tay".';

create table if not exists claude_phien_lich_su (
  id        bigint generated always as identity primary key,
  phien_id  uuid not null references claude_phien(id),
  cu        text,                  -- null = dòng mở phiên (không có trạng thái trước)
  moi       text not null,
  actor     uuid default public.jwt_uid(),   -- null = bot/hệ thống (service role)
  at        timestamptz not null default now()
);
create index if not exists claude_phien_lich_su_idx on claude_phien_lich_su (phien_id, id);

create table if not exists claude_phien_bot (
  id        integer primary key default 1 check (id = 1),
  may       text not null,
  alive_at  timestamptz not null default now(),
  trang_thai text not null default 'chay',
  ghi_chu   text not null default '',
  nghi_toi  timestamptz            -- chỉ khi trang_thai='nghi_han_muc' (lúc khác: không áp dụng)
);
alter table claude_phien_bot drop constraint if exists claude_phien_bot_tt_ck;
alter table claude_phien_bot add constraint claude_phien_bot_tt_ck
  check (trang_thai = any (array['chay', 'nghi_han_muc', 'dung']));
comment on table claude_phien_bot is
  'Heartbeat bot phiên Claude (1 dòng). alive_at quá 3 phút = bot chết / máy tắt / login hết hạn. nghi_han_muc = chạm trần subscription, việc chờ tới nghi_toi.';

-- ── 2. Trigger: vết đổi trạng thái phiên + bump updated_at ──────────────────
create or replace function public._phien_ghi_lich_su() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into claude_phien_lich_su (phien_id, cu, moi) values (new.id, null, new.trang_thai);
  elsif new.trang_thai is distinct from old.trang_thai then
    insert into claude_phien_lich_su (phien_id, cu, moi) values (new.id, old.trang_thai, new.trang_thai);
  end if;
  return null;
end $$;
drop trigger if exists trg_claude_phien_lich_su on claude_phien;
create trigger trg_claude_phien_lich_su after insert or update of trang_thai on claude_phien
  for each row execute function public._phien_ghi_lich_su();

create or replace function public._phien_touch() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists trg_claude_phien_touch on claude_phien;
create trigger trg_claude_phien_touch before update on claude_phien for each row execute function public._phien_touch();
drop trigger if exists trg_claude_phien_tin_touch on claude_phien_tin;
create trigger trg_claude_phien_tin_touch before update on claude_phien_tin for each row execute function public._phien_touch();

-- Có tin mới / tin đổi ⇒ cha (phiên) đổi updated_at (CLAUDE.md §2: đổi nội dung con phải bump cha).
create or replace function public._phien_tin_bump() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update claude_phien set updated_at = now() where id = new.phien_id;
  return null;
end $$;
drop trigger if exists trg_claude_phien_tin_bump on claude_phien_tin;
create trigger trg_claude_phien_tin_bump after insert on claude_phien_tin
  for each row execute function public._phien_tin_bump();

-- ── 3. Quyền: "trưởng khối trở lên" + registry môn → bản đồ ─────────────────
-- Một nguồn: đúng luật "được tạo ca bổ trợ nhẹ" (toàn hệ · quản lý môn · Trưởng của ô), Phó không.
create or replace function public._truong_khoi_tro_len(p_mon text, p_khoi text)
returns boolean language sql stable security definer set search_path = public as $$
  select public._btnhe_duoc_tao(p_mon, p_khoi)
$$;

-- Loại việc đang mở cho bản thử. Bật thêm = thêm 1 phần tử ở đây (CHECK đã nhận sẵn).
create or replace function public._phien_loai_dang_mo()
returns text[] language sql immutable as $$ select array['ban_do'] $$;

-- REGISTRY môn → bộ bảng/hàm bản đồ mới (khớp BDM_MON trong src/lib/kho/banDoMoi.ts).
create or replace function public._phien_bdm_bang(p_mon text)
returns table (bang text, ham text, co_vung boolean) language sql immutable as $$
  select r.bang, r.ham, r.co_vung from (values
    ('Toán', 'dai_bdm_',  'fn_bdm_',      true),
    ('KHTN', 'khtn_bdm_', 'fn_khtn_bdm_', false)
  ) r(mon, bang, ham, co_vung) where r.mon = p_mon
$$;

create or replace function public._phien_xem_duoc(p_phien uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from claude_phien p where p.id = p_phien
                  and (p.nguoi_mo = public.jwt_uid() or public._truong_khoi_tro_len(p.mon, p.khoi)))
$$;

-- ── 4. RLS — client chỉ ĐỌC trực tiếp; mọi ghi đi qua RPC ────────────────────
alter table claude_phien enable row level security;
alter table claude_phien_tin enable row level security;
alter table claude_phien_ghi enable row level security;
alter table claude_phien_lich_su enable row level security;
alter table claude_phien_bot enable row level security;

drop policy if exists claude_phien_doc on claude_phien;
create policy claude_phien_doc on claude_phien for select to authenticated
  using (nguoi_mo = public.jwt_uid() or public._truong_khoi_tro_len(mon, khoi));
drop policy if exists claude_phien_tin_doc on claude_phien_tin;
create policy claude_phien_tin_doc on claude_phien_tin for select to authenticated
  using (public._phien_xem_duoc(phien_id));
drop policy if exists claude_phien_ghi_doc on claude_phien_ghi;
create policy claude_phien_ghi_doc on claude_phien_ghi for select to authenticated
  using (public._phien_xem_duoc(phien_id));
drop policy if exists claude_phien_lich_su_doc on claude_phien_lich_su;
create policy claude_phien_lich_su_doc on claude_phien_lich_su for select to authenticated
  using (public._phien_xem_duoc(phien_id));
drop policy if exists claude_phien_bot_doc on claude_phien_bot;
create policy claude_phien_bot_doc on claude_phien_bot for select to authenticated
  using (public.la_thanh_vien());
grant select on claude_phien, claude_phien_tin, claude_phien_ghi, claude_phien_lich_su, claude_phien_bot to authenticated;
-- Bot (service role) nhận việc / ghi tin Claude / heartbeat. Ghi tường minh: bảng do claude_build tạo không
-- ăn default privileges của role postgres.
grant select, insert, update on claude_phien, claude_phien_tin, claude_phien_bot to service_role;
grant select on claude_phien_ghi, claude_phien_lich_su to service_role;

-- ── 5. RPC cho người (authenticated) ────────────────────────────────────────
-- Phạm vi người này mở phiên được: (môn, khối) mà họ là trưởng khối trở lên.
create or replace function public.fn_phien_pham_vi()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('mon', p.mon, 'khoi', p.khoi,
                    'co_ban_do', exists (select 1 from public._phien_bdm_bang(p.mon)))
                  order by p.mon, p.khoi), '[]'::jsonb)
    from public.fn_pham_vi_cua_toi() p
   where p.vai in ('toan_he', 'quan_ly_mon', 'truong')
$$;

create or replace function public.fn_phien_mo(p_loai text, p_mon text, p_khoi text, p_tieu_de text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid; v_ns uuid := public.current_nhan_su_id(); v_ten text;
  v_dang record;
begin
  if v_ns is null or public.jwt_uid() is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự.'; end if;
  if not (p_loai = any (public._phien_loai_dang_mo())) then
    raise exception 'Loại việc "%" chưa mở trong bản thử.', p_loai;
  end if;
  if not public._truong_khoi_tro_len(p_mon, p_khoi) then
    raise exception 'Chỉ trưởng khối trở lên của % khối % mới mở phiên được.', p_mon, p_khoi;
  end if;
  if p_loai = 'ban_do' and not exists (select 1 from public._phien_bdm_bang(p_mon)) then
    raise exception 'Môn % chưa có bản đồ mới trên hệ — chưa mở phiên Bản đồ được.', p_mon;
  end if;
  select p.id, ns.ho_ten into v_dang
    from claude_phien p left join nhan_su ns on ns.id = p.nhan_su_id
   where p.loai = p_loai and p.mon = p_mon and p.khoi = p_khoi and p.trang_thai <> 'dong' and p_loai = 'ban_do'
   limit 1;
  if found then
    raise exception 'Bản đồ % khối % đang có một phiên mở (của %). Vào phiên đó, hoặc đóng nó trước.', p_mon, p_khoi, coalesce(v_dang.ho_ten, '?');
  end if;
  v_ten := coalesce(nullif(trim(p_tieu_de), ''),
    case p_loai when 'ban_do' then 'Bản đồ' when 'ly_thuyet' then 'Lý thuyết dạng' when 'nhap_kho' then 'Nhập kho & phân dạng'
                when 'bao_sai' then 'Câu bị báo sai' else 'Giải bài' end
    || ' · ' || p_mon || ' ' || p_khoi);
  insert into claude_phien (loai, mon, khoi, tieu_de, nguoi_mo, nhan_su_id)
  values (p_loai, p_mon, p_khoi, v_ten, public.jwt_uid(), v_ns)
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.fn_phien_gui(p_phien uuid, p_noi_dung text)
returns bigint language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; v_id bigint;
begin
  select * into v_p from claude_phien where id = p_phien;
  if not found or not public._phien_xem_duoc(p_phien) then raise exception 'Không có phiên này.'; end if;
  if v_p.trang_thai <> 'mo' then raise exception 'Phiên đã đóng — mở lại phiên để nhắn tiếp.'; end if;
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Bạn không còn là trưởng khối trở lên của % khối %.', v_p.mon, v_p.khoi;
  end if;
  if nullif(trim(coalesce(p_noi_dung, '')), '') is null then raise exception 'Tin nhắn trống.'; end if;
  insert into claude_phien_tin (phien_id, vai, nguoi_gui, noi_dung, trang_thai)
  values (p_phien, 'nguoi', public.jwt_uid(), trim(p_noi_dung), 'cho')
  returning id into v_id;
  return v_id;
end $$;

-- Đóng: Claude viết TỔNG KẾT (đã làm gì · đã đổi gì · còn treo gì) rồi bot chuyển 'dong'.
-- Phiên chưa từng có lượt Claude nào thì đóng thẳng, không có gì để tổng kết.
create or replace function public.fn_phien_dong(p_phien uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  select * into v_p from claude_phien where id = p_phien for update;
  if not found or not public._phien_xem_duoc(p_phien) then raise exception 'Không có phiên này.'; end if;
  if v_p.trang_thai <> 'mo' then return v_p.trang_thai; end if;
  if not exists (select 1 from claude_phien_tin where phien_id = p_phien and vai = 'claude') then
    update claude_phien set trang_thai = 'dong' where id = p_phien;
    return 'dong';
  end if;
  update claude_phien set trang_thai = 'dang_dong' where id = p_phien;
  insert into claude_phien_tin (phien_id, vai, noi_dung, trang_thai)
  values (p_phien, 'he_thong', '[ĐÓNG PHIÊN] Người dùng đóng phiên. Viết TỔNG KẾT ngắn: đã làm gì · đã đổi gì trên bản đồ (theo vết lệnh) · còn treo gì / việc nên làm ở phiên sau. Không ghi gì thêm vào bản đồ.', 'cho');
  return 'dang_dong';
end $$;

create or replace function public.fn_phien_mo_lai(p_phien uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  select * into v_p from claude_phien where id = p_phien for update;
  if not found or not public._phien_xem_duoc(p_phien) then raise exception 'Không có phiên này.'; end if;
  if v_p.trang_thai <> 'dong' then return; end if;
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Bạn không còn là trưởng khối trở lên của % khối %.', v_p.mon, v_p.khoi;
  end if;
  if v_p.loai = 'ban_do' and exists (select 1 from claude_phien where loai = 'ban_do' and mon = v_p.mon and khoi = v_p.khoi
                                       and trang_thai <> 'dong' and id <> p_phien) then
    raise exception 'Bản đồ % khối % đang có phiên khác mở — đóng phiên đó trước.', v_p.mon, v_p.khoi;
  end if;
  update claude_phien set trang_thai = 'mo' where id = p_phien;
end $$;

-- Danh sách phiên người này xem được — gộp ở DB (§2.0), client chỉ render.
create or replace function public.fn_phien_ds(p_gioi_han integer default 100)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x.j order by x.updated_at desc), '[]'::jsonb) from (
    select p.updated_at, jsonb_build_object(
      'id', p.id, 'loai', p.loai, 'mon', p.mon, 'khoi', p.khoi, 'tieu_de', p.tieu_de,
      'trang_thai', p.trang_thai, 'created_at', p.created_at, 'updated_at', p.updated_at,
      'nguoi_mo_ten', ns.ho_ten, 'cua_toi', p.nguoi_mo = public.jwt_uid(),
      'so_tin', (select count(*) from claude_phien_tin t where t.phien_id = p.id),
      'dang_chay', exists (select 1 from claude_phien_tin t where t.phien_id = p.id and t.trang_thai in ('cho', 'dang_xu', 'dang_viet')),
      'tin_cuoi', (select jsonb_build_object('vai', t.vai, 'noi_dung', left(t.noi_dung, 160), 'at', t.created_at)
                     from claude_phien_tin t where t.phien_id = p.id order by t.id desc limit 1)
    ) as j
      from claude_phien p left join nhan_su ns on ns.id = p.nhan_su_id
     where p.nguoi_mo = public.jwt_uid() or public._truong_khoi_tro_len(p.mon, p.khoi)
     order by p.updated_at desc
     limit greatest(1, least(coalesce(p_gioi_han, 100), 300))
  ) x
$$;

-- ── 6. RPC cho Claude (CHỈ service_role — gọi qua scripts/phien/ban-do.mjs) ──
-- Mở phiên để ghi: phiên mở + đúng loại + đóng vai người mở + kiểm lại quyền. Trả phiên.
create or replace function public._phien_bd_vao(p_phien uuid)
returns claude_phien language plpgsql security definer set search_path = public as $$
declare v_p claude_phien;
begin
  select * into v_p from claude_phien where id = p_phien;
  if not found then raise exception 'Không có phiên %.', p_phien; end if;
  if v_p.loai <> 'ban_do' then raise exception 'Phiên này là loại "%", không phải Bản đồ — không có lệnh bản đồ.', v_p.loai; end if;
  if v_p.trang_thai <> 'mo' then raise exception 'Phiên đã đóng / đang đóng — không ghi được nữa.'; end if;
  -- ĐÓNG VAI người mở phiên trong transaction này: jwt_uid() / current_nhan_su_id() / trigger log đều thấy họ.
  perform set_config('request.jwt.claims', jsonb_build_object('sub', v_p.nguoi_mo, 'role', 'authenticated')::text, true);
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Người mở phiên không còn là trưởng khối trở lên của % khối % — dừng.', v_p.mon, v_p.khoi;
  end if;
  if not exists (select 1 from public._phien_bdm_bang(v_p.mon)) then
    raise exception 'Môn % chưa có bản đồ mới.', v_p.mon;
  end if;
  return v_p;
end $$;

-- Khối của một nút bản đồ (null nếu không có). Chuyên đề có thể DÙNG CHUNG nhiều chủ đề/khối ⇒
-- trả khối chỉ khi MỌI chủ đề chứa nó cùng một khối; dùng chung khác khối ⇒ '*' (không cho sửa từ một khối).
create or replace function public._phien_bd_khoi(p_bang text, p_loai text, p_id text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v text; v_n integer;
begin
  if p_loai = 'chu_de' then
    execute format('select khoi from %I where id = $1', p_bang || 'chu_de') into v using p_id;
  elsif p_loai = 'nhom' then
    execute format('select c.khoi from %I n join %I c on c.id = n.chu_de_id where n.id = $1',
                   p_bang || 'nhom', p_bang || 'chu_de') into v using p_id;
  elsif p_loai = 'dang_bai' then
    execute format('select c.khoi from %I d join %I n on n.id = d.nhom_id join %I c on c.id = n.chu_de_id where d.id = $1',
                   p_bang || 'dang_bai', p_bang || 'nhom', p_bang || 'chu_de') into v using p_id;
  elsif p_loai = 'chuyen_de' then
    execute format('select min(c.khoi), count(distinct c.khoi) from %I o join %I c on c.id = o.chu_de_id where o.chuyen_de_id = $1',
                   p_bang || 'o', p_bang || 'chu_de') into v, v_n using p_id;
    if v_n > 1 then v := '*'; end if;
  else
    raise exception 'Loại nút không hợp lệ: % (chu_de · chuyen_de · nhom · dang_bai)', p_loai;
  end if;
  return v;
end $$;

create or replace function public._phien_bd_kiem_khoi(p_bang text, p_loai text, p_id text, p_khoi text)
returns void language plpgsql stable security definer set search_path = public as $$
declare v text;
begin
  if nullif(trim(coalesce(p_id, '')), '') is null then raise exception 'Thiếu mã % .', p_loai; end if;
  v := public._phien_bd_khoi(p_bang, p_loai, p_id);
  if v is null then raise exception 'Không có % mã %.', p_loai, p_id; end if;
  if v = '*' then raise exception 'Chuyên đề % dùng chung với khối khác — không sửa từ phiên một khối. Báo trưởng khối/Thùy.', p_id; end if;
  if v <> p_khoi then raise exception '% % thuộc khối %, ngoài phạm vi phiên (khối %).', p_loai, p_id, v, p_khoi; end if;
end $$;

-- Đọc cây bản đồ của khối (đúng hàm màn Bản đồ mới đang dùng).
create or replace function public.fn_phien_bd_xem(p_phien uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; v_ham text; v jsonb;
begin
  v_p := public._phien_bd_vao(p_phien);
  select ham into v_ham from public._phien_bdm_bang(v_p.mon);
  execute format('select %I($1)', v_ham || 'cay') into v using v_p.khoi;
  return jsonb_build_object('mon', v_p.mon, 'khoi', v_p.khoi, 'cay', v);
end $$;

-- Ghi 1 lệnh. KHÔNG có xoá. Mỗi lệnh 1 transaction (RPC), vết ở claude_phien_ghi.
create or replace function public.fn_phien_bd_ghi(p_phien uuid, p_viec text, p_ts jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_p claude_phien; b text; v_vung boolean; v_khoi text;
  v_id text; v_id2 text; v_kq jsonb; v_ten text; v_mo_ta text; v_loai text;
  v_ids text[]; v_i integer; v_cha text; v_n integer; v_set text[] := '{}';
begin
  v_p := public._phien_bd_vao(p_phien);
  v_khoi := v_p.khoi;
  select bang, co_vung into b, v_vung from public._phien_bdm_bang(v_p.mon);
  p_ts := coalesce(p_ts, '{}'::jsonb);
  v_ten := nullif(trim(coalesce(p_ts->>'ten', '')), '');
  v_mo_ta := p_ts->>'mo_ta';

  if p_viec = 'them_chu_de' then
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    if v_vung then
      execute format('insert into %I (khoi, ten, nhanh) values ($1, $2, $3) returning id', b || 'chu_de')
        into v_id using v_khoi, v_ten, coalesce(nullif(p_ts->>'nhanh', ''), 'toan');
    else
      execute format('insert into %I (khoi, ten) values ($1, $2) returning id', b || 'chu_de') into v_id using v_khoi, v_ten;
    end if;
    v_kq := jsonb_build_object('chu_de_id', v_id);

  elsif p_viec = 'them_chuyen_de' then
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (ten, mo_ta) values ($1, $2) returning id', b || 'chuyen_de')
      into v_id using v_ten, coalesce(v_mo_ta, '');
    execute format('insert into %I (chu_de_id, chuyen_de_id) values ($1, $2)', b || 'o') using p_ts->>'chu_de_id', v_id;
    v_kq := jsonb_build_object('chuyen_de_id', v_id, 'chu_de_id', p_ts->>'chu_de_id');

  elsif p_viec = 'them_nhom' then
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    execute format('select count(*) from %I where chu_de_id = $1 and chuyen_de_id = $2', b || 'o')
      into v_n using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', p_ts->>'chuyen_de_id', p_ts->>'chu_de_id'; end if;
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (chu_de_id, chuyen_de_id, ten, mo_ta) values ($1, $2, $3, $4) returning id', b || 'nhom')
      into v_id using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id', v_ten, coalesce(v_mo_ta, '');
    v_kq := jsonb_build_object('nhom_id', v_id);

  elsif p_viec = 'them_dang_bai' then
    perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_khoi);
    if v_ten is null then raise exception 'Thiếu ten.'; end if;
    execute format('insert into %I (nhom_id, ten, mo_ta) values ($1, $2, $3) returning id', b || 'dang_bai')
      into v_id using p_ts->>'nhom_id', v_ten, coalesce(v_mo_ta, '');
    v_kq := jsonb_build_object('dang_bai_id', v_id);

  elsif p_viec = 'sua' then
    -- Chỉ tên + mô tả nhận biết. Lý thuyết / ví dụ thuộc loại việc 'ly_thuyet' (chưa mở). Mã không bao giờ đổi.
    v_loai := p_ts->>'loai';
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, v_loai, v_id, v_khoi);
    if p_ts ? 'ten' then
      if v_ten is null then raise exception 'ten không được trống.'; end if;
      v_set := v_set || format('ten = %L', v_ten);
    end if;
    if p_ts ? 'mo_ta' then
      if v_loai = 'chu_de' then raise exception 'Chủ đề không có mô tả.'; end if;
      v_set := v_set || format('mo_ta = %L', coalesce(v_mo_ta, ''));
    end if;
    if cardinality(v_set) = 0 then raise exception 'Không có gì để sửa (chỉ sửa được ten, mo_ta).'; end if;
    execute format('update %I set %s where id = $1', b || v_loai, array_to_string(v_set, ', ')) using v_id;
    v_kq := jsonb_build_object('loai', v_loai, 'id', v_id);

  elsif p_viec = 'chuyen_nhom' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi);
    perform public._phien_bd_kiem_khoi(b, 'chu_de', p_ts->>'chu_de_id', v_khoi);
    execute format('select count(*) from %I where chu_de_id = $1 and chuyen_de_id = $2', b || 'o')
      into v_n using p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', p_ts->>'chuyen_de_id', p_ts->>'chu_de_id'; end if;
    execute format('update %I set chu_de_id = $2, chuyen_de_id = $3,
                      thu_tu = (select coalesce(max(thu_tu), 0) + 1 from %I where chu_de_id = $2 and chuyen_de_id = $3)
                    where id = $1', b || 'nhom', b || 'nhom')
      using v_id, p_ts->>'chu_de_id', p_ts->>'chuyen_de_id';
    v_kq := jsonb_build_object('nhom_id', v_id, 'chu_de_id', p_ts->>'chu_de_id', 'chuyen_de_id', p_ts->>'chuyen_de_id');

  elsif p_viec = 'chuyen_dang_bai' then
    v_id := p_ts->>'id';
    perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi);
    perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_khoi);
    execute format('update %I set nhom_id = $2,
                      thu_tu = (select coalesce(max(thu_tu), 0) + 1 from %I where nhom_id = $2)
                    where id = $1', b || 'dang_bai', b || 'dang_bai')
      using v_id, p_ts->>'nhom_id';
    v_kq := jsonb_build_object('dang_bai_id', v_id, 'nhom_id', p_ts->>'nhom_id');

  elsif p_viec = 'sap_xep' then
    -- Đặt lại thứ tự theo đúng mảng ids; mọi id phải cùng một cha và thuộc khối của phiên.
    v_loai := p_ts->>'loai';
    select array_agg(x) into v_ids from jsonb_array_elements_text(coalesce(p_ts->'ids', '[]'::jsonb)) x;
    if coalesce(cardinality(v_ids), 0) = 0 then raise exception 'Thiếu ids.'; end if;
    if v_loai = 'chu_de' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'chu_de', v_id, v_khoi); end loop;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'chu_de') using v_ids[v_i], v_i;
      end loop;
    elsif v_loai = 'o' then  -- thứ tự chuyên đề trong 1 chủ đề
      v_cha := p_ts->>'chu_de_id';
      perform public._phien_bd_kiem_khoi(b, 'chu_de', v_cha, v_khoi);
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $3 where chu_de_id = $1 and chuyen_de_id = $2', b || 'o') using v_cha, v_ids[v_i], v_i;
        get diagnostics v_n = row_count;
        if v_n = 0 then raise exception 'Chuyên đề % không nằm trong chủ đề %.', v_ids[v_i], v_cha; end if;
      end loop;
    elsif v_loai = 'nhom' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'nhom', v_id, v_khoi); end loop;
      execute format('select count(distinct (chu_de_id, chuyen_de_id)) from %I where id = any($1)', b || 'nhom') into v_n using v_ids;
      if v_n > 1 then raise exception 'Các nhóm không cùng một chuyên đề — sắp xếp từng chuyên đề một.'; end if;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'nhom') using v_ids[v_i], v_i;
      end loop;
    elsif v_loai = 'dang_bai' then
      foreach v_id in array v_ids loop perform public._phien_bd_kiem_khoi(b, 'dang_bai', v_id, v_khoi); end loop;
      execute format('select count(distinct nhom_id) from %I where id = any($1)', b || 'dang_bai') into v_n using v_ids;
      if v_n > 1 then raise exception 'Các dạng bài không cùng một nhóm — sắp xếp từng nhóm một.'; end if;
      for v_i in 1 .. cardinality(v_ids) loop
        execute format('update %I set thu_tu = $2 where id = $1', b || 'dang_bai') using v_ids[v_i], v_i;
      end loop;
    else
      raise exception 'sap_xep: loai phải là chu_de · o · nhom · dang_bai.';
    end if;
    v_kq := jsonb_build_object('loai', v_loai, 'so', cardinality(v_ids));

  else
    raise exception 'Lệnh không có: % (them_chu_de · them_chuyen_de · them_nhom · them_dang_bai · sua · chuyen_nhom · chuyen_dang_bai · sap_xep). Không có lệnh xoá — đề xuất để trưởng khối xoá tay.', p_viec;
  end if;

  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua) values (p_phien, p_viec, p_ts, v_kq);
  return jsonb_build_object('ok', true) || v_kq;
end $$;

-- Đường 2 (trưởng khối tự sửa tay rồi bảo "làm tiếp"): các thay đổi bản đồ CỦA KHỐI kể từ mốc,
-- đánh dấu dòng nào do Claude (qua claude_phien_ghi — trùng `at` cùng transaction) hay do người sửa tay.
-- Mốc mặc định = lượt Claude gần nhất của phiên đã xong (chưa có thì lúc mở phiên).
create or replace function public.fn_phien_bd_thay_doi(p_phien uuid, p_tu timestamptz default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; b text; v_tu timestamptz; v jsonb;
begin
  v_p := public._phien_bd_vao(p_phien);
  select bang into b from public._phien_bdm_bang(v_p.mon);
  v_tu := coalesce(p_tu,
    (select max(t.updated_at) from claude_phien_tin t where t.phien_id = p_phien and t.vai = 'claude' and t.trang_thai = 'xong'),
    v_p.created_at);
  execute format($q$
    with l as (
      select g.id, g.bang, g.khoa, g.hanh_dong, g.cu, g.moi, g.actor, g.at,
             coalesce(g.moi, g.cu) as r, replace(g.bang, %L, '') as loai
        from %I g
       where g.at > $1 and g.bang = any($2)
       order by g.id
       limit 2000
    ), k as (
      select l.*,
        case l.loai
          when 'chu_de' then l.r->>'khoi'
          when 'o'      then (select c.khoi from %I c where c.id = l.r->>'chu_de_id')
          when 'nhom'   then (select c.khoi from %I c where c.id = l.r->>'chu_de_id')
          when 'dang_bai' then (select c.khoi from %I n join %I c on c.id = n.chu_de_id where n.id = l.r->>'nhom_id')
          when 'chuyen_de' then (select min(c.khoi) from %I o join %I c on c.id = o.chu_de_id where o.chuyen_de_id = l.r->>'id')
        end as khoi
        from l
    )
    select coalesce(jsonb_agg(jsonb_build_object(
             'at', k.at, 'loai', k.loai, 'hanh_dong', k.hanh_dong, 'cu', k.cu, 'moi', k.moi,
             'ai_sua', coalesce((select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = k.actor), '?'),
             'nguon', case when exists (select 1 from claude_phien_ghi cg where cg.at = k.at) then 'claude' else 'tay' end
           ) order by k.id), '[]'::jsonb)
      from k where k.khoi = $3
  $q$, b, b || 'log', b || 'chu_de', b || 'chu_de', b || 'nhom', b || 'chu_de', b || 'o', b || 'chu_de')
  into v using v_tu, array[b || 'chu_de', b || 'chuyen_de', b || 'o', b || 'nhom', b || 'dang_bai'], v_p.khoi;
  return jsonb_build_object('tu', v_tu, 'khoi', v_p.khoi, 'thay_doi', v);
end $$;

-- ── 6b. RPC cho BOT (service_role) — nhận / trả việc ATOMIC ─────────────────
-- Nhận MỌI tin đang chờ của 1 phiên trong một lượt (người gõ liền 3 tin khi Claude đang bận ⇒ Claude đọc cả 3
-- một lần, như Claude Code xếp hàng tin). Không nhận nếu phiên đang có lượt chạy (dang_xu) — một phiên chỉ
-- một tiến trình Claude, nếu không hai lượt cùng --resume một session sẽ giẫm nhau.
create or replace function public.fn_phien_bot_nhan(p_phien uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v jsonb;
begin
  perform 1 from claude_phien where id = p_phien for update;   -- khoá phiên: 2 tiến trình cùng vồ thì 1 bên chờ rồi thấy dang_xu
  if exists (select 1 from claude_phien_tin where phien_id = p_phien and trang_thai = 'dang_xu') then return '[]'::jsonb; end if;
  with u as (
    update claude_phien_tin t set trang_thai = 'dang_xu', so_lan = t.so_lan + 1
     where t.phien_id = p_phien and t.trang_thai = 'cho'
    returning t.id, t.vai, t.noi_dung, t.nguoi_gui, t.so_lan, t.created_at
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', u.id, 'vai', u.vai, 'noi_dung', u.noi_dung, 'so_lan', u.so_lan, 'at', u.created_at,
           'nguoi_ten', (select ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where tk.id = u.nguoi_gui))
         order by u.id), '[]'::jsonb)
    into v from u;
  return v;
end $$;

-- Trả việc về hàng chờ sau lượt hỏng. p_tinh_lan=false (chạm hạn mức / máy tắt): không tính là một lần hỏng.
-- Hết lượt (so_lan ≥ p_toi_da) ⇒ 'loi'; nếu đó là việc "đóng phiên" thì vẫn đóng phiên — không để phiên kẹt 'dang_dong'.
create or replace function public.fn_phien_bot_tra(p_ids bigint[], p_loi text, p_tinh_lan boolean, p_toi_da integer default 2)
returns void language plpgsql security definer set search_path = public as $$
begin
  update claude_phien_tin t
     set so_lan = case when p_tinh_lan then t.so_lan else greatest(t.so_lan - 1, 0) end,
         trang_thai = case when p_tinh_lan and t.so_lan >= p_toi_da then 'loi' else 'cho' end,
         loi = p_loi
   where t.id = any(p_ids) and t.trang_thai = 'dang_xu';
  update claude_phien p set trang_thai = 'dong'
   where p.trang_thai = 'dang_dong'
     and exists (select 1 from claude_phien_tin t where t.phien_id = p.id and t.id = any(p_ids) and t.vai = 'he_thong' and t.trang_thai = 'loi');
end $$;

-- Nhặt lượt mồ côi (tiến trình chết giữa chừng): việc dang_xu + tin Claude dang_viet không động đậy quá p_phut phút.
create or replace function public.fn_phien_bot_nhat_mo_coi(p_phut integer)
returns integer language plpgsql security definer set search_path = public as $$
declare v_n integer;
begin
  update claude_phien_tin set trang_thai = 'dung', noi_dung = noi_dung || E'\n\n⚠ Bị ngắt giữa chừng (bot dừng / máy tắt).'
   where vai = 'claude' and trang_thai = 'dang_viet' and updated_at < now() - make_interval(mins => p_phut);
  update claude_phien_tin set trang_thai = 'cho', loi = 'Lượt trước bị ngắt giữa chừng'
   where vai <> 'claude' and trang_thai = 'dang_xu' and updated_at < now() - make_interval(mins => p_phut);
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- ── 7. Grants ───────────────────────────────────────────────────────────────
do $$
declare f text;
begin
  -- người dùng
  foreach f in array array[
    'public.fn_phien_pham_vi()', 'public.fn_phien_mo(text, text, text, text)', 'public.fn_phien_gui(uuid, text)',
    'public.fn_phien_dong(uuid)', 'public.fn_phien_mo_lai(uuid)', 'public.fn_phien_ds(integer)',
    'public._truong_khoi_tro_len(text, text)', 'public._phien_xem_duoc(uuid)'] loop
    execute format('revoke all on function %s from public', f);
    execute format('revoke all on function %s from anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
  -- chỉ bot / công cụ của Claude (service_role)
  foreach f in array array[
    'public._phien_bd_vao(uuid)', 'public._phien_bd_khoi(text, text, text)', 'public._phien_bd_kiem_khoi(text, text, text, text)',
    'public.fn_phien_bd_xem(uuid)', 'public.fn_phien_bd_ghi(uuid, text, jsonb)', 'public.fn_phien_bd_thay_doi(uuid, timestamptz)',
    'public.fn_phien_bot_nhan(uuid)', 'public.fn_phien_bot_tra(bigint[], text, boolean, integer)', 'public.fn_phien_bot_nhat_mo_coi(integer)'] loop
    execute format('revoke all on function %s from public', f);
    execute format('revoke all on function %s from anon', f);
    execute format('revoke all on function %s from authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end $$;

-- ── 8. Màn "Phòng làm việc trưởng khối" (lá phong_tk) ───────────────────────
insert into vai_tro_chuc_nang (vai_tro_id, chuc_nang, chi_xem)
select id, 'phong_tk', false from vai_tro where ten in ('Core team', 'Quản lý chất lượng', 'Quản lý môn')
on conflict do nothing;

-- ── 9. Realtime (đường nhanh cho bot + chữ chạy trên màn) ───────────────────
-- Publication thuộc supabase_admin — thiếu quyền thì hạ xuống WARNING: bot vẫn chạy bằng quét định kỳ,
-- màn vẫn tự cập nhật bằng poll. Câu lệnh chạy tay in trong warning.
do $$
declare t text;
begin
  foreach t in array array['claude_phien', 'claude_phien_tin'] loop
    begin
      if not exists (select 1 from pg_publication_tables
                      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
        execute format('alter publication supabase_realtime add table public.%I', t);
      end if;
    exception when insufficient_privilege then
      raise warning 'Không đủ quyền thêm % vào supabase_realtime — chạy tay trong SQL Editor: alter publication supabase_realtime add table public.%;', t, t;
    end;
  end loop;
end $$;
