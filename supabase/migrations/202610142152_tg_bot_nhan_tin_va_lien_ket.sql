-- ============================================================================
-- 202610142152 — tg_bot_nhan_tin_va_lien_ket  (spec-bot-telegram-ta.md §3.2 + §4, bước B2)
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Telegram chỉ giữ update cho bot 24 giờ và Bot API không đọc lại được lịch sử nhóm ⇒ mọi tin phải ghi DB
--   NGAY lúc đến (webhook api/tg-webhook.mjs → fn_tg_nhan). Tin thô append-only, bất biến (trigger chặn sửa/xoá):
--   bản sửa của 1 tin = dòng mới (phien_ban = edit_date), không đè bản gốc.
--   Danh tính: tg_user_id ↔ nhan_su nối bằng MÃ DÙNG 1 LẦN (app TA → t.me/<bot>?start=<mã>), không đoán theo
--   tên hiển thị/username (đổi được, trùng được). tg_tin chỉ lưu tg_user_id; nhân sự resolve lúc đọc qua
--   tg_lien_ket ⇒ TA nối tài khoản muộn thì tin cũ của em vẫn gắn đúng người.
--   Secret webhook = he_thong_bi_mat 'tg_webhook' (đặt bằng script scripts/tg/dat-webhook.mjs, KHÔNG nằm trong
--   migration/git). Telegram gửi nó trong header X-Telegram-Bot-Api-Secret-Token; fn_tg_nhan tự so ⇒ Vercel
--   không cần thêm biến bí mật nào ngoài TG_BOT_TOKEN.
--
-- MẤT GÌ (Luật xoá): không xoá gì. Chỉ tạo bảng/hàm mới.
-- ============================================================================

create table public.tg_nhom (
  chat_id     bigint primary key,
  ten         text not null,
  loai        text not null,                                   -- group · supergroup · channel
  vai         text check (vai in ('ta_chung', 'test')),        -- null = bot có mặt nhưng chưa dùng cho việc gì
  trang_thai_bot text not null default 'member',               -- member · administrator · left · kicked
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.tg_tin (
  chat_id      bigint not null,
  message_id   bigint not null,
  phien_ban    bigint not null default 0,                      -- 0 = bản gốc; bản sửa = edit_date (unix)
  loai_chat    text not null,                                  -- private · group · supergroup
  tg_user_id   bigint,
  ten_hien_thi text,
  reply_to     bigint,                                         -- message_id được trả lời (cùng chat)
  noi_dung     text,                                           -- text hoặc caption
  co_tep       boolean not null default false,                 -- ảnh/file/voice… (chưa tải về)
  gui_at       timestamptz not null,
  ngay         date not null,                                  -- ngày VN của gui_at
  raw          jsonb not null,
  created_at   timestamptz not null default now(),
  primary key (chat_id, message_id, phien_ban)
);
create index tg_tin_ngay_idx on public.tg_tin (chat_id, ngay);
create index tg_tin_reply_idx on public.tg_tin (chat_id, reply_to) where reply_to is not null;
create index tg_tin_user_idx on public.tg_tin (tg_user_id, ngay);

create or replace function public._tg_tin_bat_bien() returns trigger language plpgsql as $$
begin raise exception 'tg_tin là nhật ký bất biến — không sửa/xoá'; end $$;
create trigger tg_tin_bat_bien before update or delete on public.tg_tin
  for each row execute function public._tg_tin_bat_bien();

create table public.tg_lien_ket (
  id          uuid primary key default gen_random_uuid(),
  nhan_su_id  uuid not null references public.nhan_su(id),
  tg_user_id  bigint not null,
  tg_username text,
  ten_tg      text,
  tu_at       timestamptz not null default now(),
  den_at      timestamptz,                                     -- null = đang hiệu lực; nối lại = đóng dòng cũ, mở dòng mới
  check (den_at is null or den_at >= tu_at)
);
create unique index tg_lien_ket_ns_mo on public.tg_lien_ket (nhan_su_id) where den_at is null;
create unique index tg_lien_ket_tg_mo on public.tg_lien_ket (tg_user_id) where den_at is null;

create table public.tg_ma_lien_ket (
  ma          text primary key,
  nhan_su_id  uuid not null references public.nhan_su(id),
  het_han     timestamptz not null,
  dung_at     timestamptz,
  dung_boi_tg bigint,
  created_at  timestamptz not null default now()
);

alter table public.tg_nhom enable row level security;
alter table public.tg_tin enable row level security;
alter table public.tg_lien_ket enable row level security;
alter table public.tg_ma_lien_ket enable row level security;
-- Đọc: Core team (quyền duyệt công TA). Ghi: chỉ qua hàm security definer.
create policy tg_nhom_doc on public.tg_nhom for select to authenticated using (public.co_chuc_nang('ta_cong_duyet'));
create policy tg_tin_doc on public.tg_tin for select to authenticated using (public.co_chuc_nang('ta_cong_duyet'));
create policy tg_lien_ket_doc on public.tg_lien_ket for select to authenticated
  using (public.co_chuc_nang('ta_cong_duyet') or nhan_su_id = public.current_nhan_su_id());

-- ── Webhook: nhận 1 update Telegram. Trả {chat_id, text} nếu bot cần trả lời (chat riêng), không thì null. ──
create or replace function public.fn_tg_nhan(p_secret text, p_update jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_msg jsonb; v_chat jsonb; v_from jsonb; v_text text; v_ma text; v_ma_row tg_ma_lien_ket; v_ten text;
        v_mc jsonb; v_gui timestamptz;
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'tg_webhook') then
    raise exception 'sai secret' using errcode = '28000';
  end if;

  -- Bot được thêm / đổi quyền / bị đá khỏi nhóm
  v_mc := p_update -> 'my_chat_member';
  if v_mc is not null and (v_mc -> 'chat' ->> 'type') <> 'private' then
    insert into tg_nhom (chat_id, ten, loai, trang_thai_bot)
    values ((v_mc -> 'chat' ->> 'id')::bigint, coalesce(v_mc -> 'chat' ->> 'title', '?'), v_mc -> 'chat' ->> 'type',
            coalesce(v_mc -> 'new_chat_member' ->> 'status', 'member'))
    on conflict (chat_id) do update set ten = excluded.ten, loai = excluded.loai,
                                        trang_thai_bot = excluded.trang_thai_bot, updated_at = now();
    return null;
  end if;

  v_msg := coalesce(p_update -> 'message', p_update -> 'edited_message');
  if v_msg is null then return null; end if;
  v_chat := v_msg -> 'chat'; v_from := v_msg -> 'from';
  v_text := coalesce(v_msg ->> 'text', v_msg ->> 'caption');
  v_gui := to_timestamp((v_msg ->> 'date')::bigint);

  if (v_chat ->> 'type') in ('group', 'supergroup') then
    insert into tg_nhom (chat_id, ten, loai) values ((v_chat ->> 'id')::bigint, coalesce(v_chat ->> 'title', '?'), v_chat ->> 'type')
    on conflict (chat_id) do update set ten = excluded.ten, updated_at = now() where tg_nhom.ten is distinct from excluded.ten;
  end if;

  insert into tg_tin (chat_id, message_id, phien_ban, loai_chat, tg_user_id, ten_hien_thi, reply_to, noi_dung, co_tep, gui_at, ngay, raw)
  values ((v_chat ->> 'id')::bigint, (v_msg ->> 'message_id')::bigint, coalesce((v_msg ->> 'edit_date')::bigint, 0),
          v_chat ->> 'type', (v_from ->> 'id')::bigint,
          nullif(concat_ws(' ', v_from ->> 'first_name', v_from ->> 'last_name'), ''),
          (v_msg -> 'reply_to_message' ->> 'message_id')::bigint, v_text,
          v_msg ?| array['photo', 'document', 'voice', 'video', 'audio', 'sticker', 'video_note'],
          v_gui, (v_gui at time zone 'Asia/Ho_Chi_Minh')::date, p_update)
  on conflict do nothing;   -- Telegram gửi lại cùng update khi webhook chậm ⇒ idempotent

  -- Chat riêng với bot: /start <mã> = nối tài khoản
  if (v_chat ->> 'type') = 'private' and p_update ? 'message' then
    v_ma := substring(coalesce(v_text, '') from '^/start\s+([A-Za-z0-9_-]+)');
    if v_ma is null then
      if coalesce(v_text, '') ~ '^/start' then
        return jsonb_build_object('chat_id', v_chat -> 'id', 'text',
          'Chào bạn! Để nhận bản tin việc mỗi sáng, mở app BK Trợ giảng → Chấm công → bấm "Kết nối Telegram".');
      end if;
      return null;
    end if;
    select * into v_ma_row from tg_ma_lien_ket where ma = v_ma for update;
    if v_ma_row.ma is null or v_ma_row.dung_at is not null or v_ma_row.het_han < now() then
      return jsonb_build_object('chat_id', v_chat -> 'id', 'text',
        'Mã kết nối đã hết hạn hoặc đã dùng. Mở lại app BK Trợ giảng → Chấm công → bấm "Kết nối Telegram" để lấy mã mới.');
    end if;
    update tg_lien_ket set den_at = now()
     where den_at is null and (nhan_su_id = v_ma_row.nhan_su_id or tg_user_id = (v_from ->> 'id')::bigint);
    insert into tg_lien_ket (nhan_su_id, tg_user_id, tg_username, ten_tg)
    values (v_ma_row.nhan_su_id, (v_from ->> 'id')::bigint, v_from ->> 'username',
            nullif(concat_ws(' ', v_from ->> 'first_name', v_from ->> 'last_name'), ''));
    update tg_ma_lien_ket set dung_at = now(), dung_boi_tg = (v_from ->> 'id')::bigint where ma = v_ma;
    select ho_ten into v_ten from nhan_su where id = v_ma_row.nhan_su_id;
    return jsonb_build_object('chat_id', v_chat -> 'id', 'text',
      'Đã kết nối Telegram với tài khoản ' || v_ten || ' ✅. Mỗi sáng 8:00 bot sẽ báo việc còn tồn của bạn trong nhóm Trợ giảng.');
  end if;
  return null;
end $$;
revoke all on function public.fn_tg_nhan(text, jsonb) from public;
grant execute on function public.fn_tg_nhan(text, jsonb) to anon, authenticated;   -- secret-gated (như fn_pt_push_danh_sach)

-- ── App TA: lấy mã nối (30 phút, dùng 1 lần) ──
create or replace function public.fn_tg_ma_lien_ket()
returns text
language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); v_ma text;
begin
  if v_ns is null then raise exception 'Chưa đăng nhập'; end if;
  v_ma := replace(gen_random_uuid()::text, '-', '');
  insert into tg_ma_lien_ket (ma, nhan_su_id, het_han) values (v_ma, v_ns, now() + interval '30 minutes');
  return v_ma;
end $$;
revoke all on function public.fn_tg_ma_lien_ket() from public, anon;
grant execute on function public.fn_tg_ma_lien_ket() to authenticated;

-- ── App TA: tôi đã nối chưa ──
create or replace function public.fn_tg_lien_ket_cua_toi()
returns table (tg_username text, ten_tg text, tu_at timestamptz)
language sql stable security definer set search_path = public as $$
  select l.tg_username, l.ten_tg, l.tu_at from tg_lien_ket l
   where l.nhan_su_id = public.current_nhan_su_id() and l.den_at is null
$$;
revoke all on function public.fn_tg_lien_ket_cua_toi() from public, anon;
grant execute on function public.fn_tg_lien_ket_cua_toi() to authenticated;
