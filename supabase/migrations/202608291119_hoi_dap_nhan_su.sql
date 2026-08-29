-- ============================================================================
-- 202608291119 — hoi_dap_nhan_su: hỏi–đáp nội bộ do CLAUDE CODE trả lời
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 29/08: nhân sự cần hỏi về CÁCH HỆ THỐNG VẬN HÀNH ("vì sao Elo tính thế
--   này", "quy trình chấm ET đi đường nào") — loại câu mà `troly_hoi_dap` KHÔNG
--   trả lời được: trợ lý chỉ đọc BẢNG SẠCH số liệu, không biết gì về code/spec.
--   Con trả lời ở đây là Claude Code chạy TRÊN MÁY CÓ REPO — đọc được CLAUDE.md,
--   schema.md, HANDOFF.md, source — nên trả lời được "vì sao", không chỉ "bao nhiêu".
--
--   Khuôn hạ tầng bê nguyên `troly_hoi_dap` (đã chạy thật, cùng vòng đời job):
--   client ghi job 'pending' → bot (scripts/hoidap/bot.mjs, chạy máy local) claim
--   'processing' → gọi `claude -p` → ghi `tra_loi` → 'done'. Hai đường nhận job:
--   Realtime (nhanh, vài giây) + quét định kỳ (lưới vớt khi listener chết) — vì
--   vậy claim phải ATOMIC (update ... where trang_thai='pending' returning) để
--   hai đường không giẫm nhau cùng trả lời một câu.
--
--   KHÁC `troly_hoi_dap` ở 2 chỗ, đều cố ý:
--   · KHÔNG có `boi_canh` — bối cảnh của bot là CHÍNH REPO tại thời điểm trả lời
--     (commit nào cũng truy lại được), không phải bảng sạch client tính.
--   · authenticated KHÔNG có quyền update/delete — câu trả lời CHỈ đến từ bot
--     (service role, bỏ qua RLS). Client sửa được job đang chờ là mở đường giả
--     mạo câu trả lời của hệ thống.
--
--   `hoi_dap_bot` (heartbeat, 1 dòng): bot chết là CHẾT IM LẶNG — câu hỏi nằm
--   'pending' mãi mà không ai biết. Bot ghi `alive_at` mỗi phút; UI so với now()
--   để hiện "bot đang chạy/mất liên lạc" — người hỏi biết ngay đang chờ ai.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Hai bảng mới hoàn toàn, không đụng bảng nào đang có.
-- ============================================================================

create table if not exists hoi_dap_nhan_su (
  id         uuid primary key default gen_random_uuid(),
  nguoi      uuid not null,            -- ai hỏi (auth.uid) — RLS ép insert đúng mình
  cau_hoi    text not null,
  trang_thai text not null default 'pending',
  -- Số lần bot đã thử job này. THIẾU CỘT NÀY = điều kiện bỏ cuộc không bao giờ đúng
  -- ⇒ job hỏng quay vòng VÔ HẠN (bài học ghi ngay trong troly_hoi_dap).
  so_lan     integer not null default 0,
  tra_loi    text,
  error      text,
  model      text,                     -- vd 'claude-code/claude-fable-5' — truy lại "ai nói"
  usage      jsonb,
  created_at timestamptz not null default now(),
  claimed_at timestamptz,              -- lúc bot nhận — job 'processing' quá lâu = mồ côi, bot trả về 'pending'
  done_at    timestamptz
);

alter table hoi_dap_nhan_su drop constraint if exists hoi_dap_nhan_su_tt_ck;
alter table hoi_dap_nhan_su add constraint hoi_dap_nhan_su_tt_ck
  check (trang_thai = any (array['pending', 'processing', 'done', 'failed']));

-- Bot quét job chờ — index hẹp theo trạng thái, khỏi full-scan khi bảng phình.
create index if not exists hoi_dap_nhan_su_cho_idx on hoi_dap_nhan_su (created_at) where trang_thai = 'pending';
create index if not exists hoi_dap_nhan_su_nguoi_idx on hoi_dap_nhan_su (nguoi, created_at desc);

comment on table hoi_dap_nhan_su is
  'Hỏi–đáp nội bộ về hệ thống, do Claude Code (bot local, scripts/hoidap/bot.mjs) trả lời. Client ghi job pending; bot claim atomic rồi ghi tra_loi. Câu trả lời CHỈ đến từ bot — authenticated không update được.';

alter table hoi_dap_nhan_su enable row level security;
-- Đọc: MỌI thành viên đọc MỌI câu — hỏi–đáp về hệ thống là tri thức chung, một người
-- hỏi cả đội đỡ hỏi lại (khác dữ liệu cá nhân). Ghi: chỉ thêm câu hỏi CỦA MÌNH.
drop policy if exists hoi_dap_nhan_su_member_doc on hoi_dap_nhan_su;
create policy hoi_dap_nhan_su_member_doc on hoi_dap_nhan_su for select to authenticated
  using (public.la_thanh_vien());
drop policy if exists hoi_dap_nhan_su_member_hoi on hoi_dap_nhan_su;
create policy hoi_dap_nhan_su_member_hoi on hoi_dap_nhan_su for insert to authenticated
  with check (public.la_thanh_vien() and nguoi = auth.uid());
grant select, insert on hoi_dap_nhan_su to authenticated;

-- ── Heartbeat của bot ───────────────────────────────────────────────────────
create table if not exists hoi_dap_bot (
  id       integer primary key default 1 check (id = 1),  -- đúng 1 dòng
  may      text not null,               -- hostname máy đang chạy bot — biết đi tìm máy nào
  alive_at timestamptz not null default now()
);
comment on table hoi_dap_bot is
  'Heartbeat bot hỏi–đáp (1 dòng). Bot upsert alive_at mỗi phút; UI so với now() — quá 10 phút = bot chết/mất mạng/CLI hết login, hiện cảnh báo thay vì để người hỏi chờ mù.';

alter table hoi_dap_bot enable row level security;
drop policy if exists hoi_dap_bot_member_doc on hoi_dap_bot;
create policy hoi_dap_bot_member_doc on hoi_dap_bot for select to authenticated
  using (public.la_thanh_vien());
grant select on hoi_dap_bot to authenticated;

-- ── Realtime cho bot ────────────────────────────────────────────────────────
-- Bot subscribe postgres_changes INSERT trên bảng này → trả lời trong vài giây thay
-- vì chờ chu kỳ quét. Guard: ALTER PUBLICATION ... ADD nổ lỗi nếu bảng đã là member
-- (chạy lại migration trên DB đã áp tay là dính), nên kiểm tra trước.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'hoi_dap_nhan_su'
  ) then
    alter publication supabase_realtime add table public.hoi_dap_nhan_su;
  end if;
end $$;
