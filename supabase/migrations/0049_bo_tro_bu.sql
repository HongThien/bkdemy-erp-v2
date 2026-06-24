-- 0049 — Bổ trợ BÙ (bù buổi nghỉ) L1→L3. ADR: app.notion.com/p/389d4530bcdb81de9549fdb99ce1083e
-- TÁI DÙNG buoi_hoc loai='bu' + buoi_hoc_hs.bu_cho_buoi_id (đã có). Funnel pure-derive; chỉ thêm:
--  (1) bang_khong_bu = quyết-định-người (không-derive-được); (2) gami_session_problems.hoc_sinh_id = ET per-HS.

create table if not exists bang_khong_bu (
  id             uuid primary key default gen_random_uuid(),
  buoi_hoc_hs_id uuid not null references buoi_hoc_hs(id) on delete cascade, -- lần-nghỉ (dòng ở buổi MẸ)
  loai           text not null check (loai in ('khong_can_bu','khong_xep_duoc')),
  ly_do          text,                 -- bắt buộc cho khong_can_bu (app gác)
  actor          uuid,
  created_at     timestamptz not null default now(),
  unique (buoi_hoc_hs_id)              -- 1 lần-nghỉ ↔ 1 quyết-định
);
alter table bang_khong_bu enable row level security;
create policy bang_khong_bu_member_all on bang_khong_bu for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on bang_khong_bu to authenticated;

-- ET buổi bù = ET buổi MẸ, PER-HS: problem gắn HS (null = problem chung của buổi thường).
alter table gami_session_problems add column if not exists hoc_sinh_id uuid references hoc_sinh(id) on delete cascade;
