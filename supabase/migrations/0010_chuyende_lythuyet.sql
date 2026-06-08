-- 0010 — Lý thuyết CHUNG cấp chuyên đề (Tier 2), tuỳ chọn (không phải chuyên đề nào cũng có).
-- Khoá theo ma_chuyen_de (vd 070101 — unique vì gồm cả khối). Cùng cấu trúc lý thuyết dạng.
create table if not exists dai_chuyen_de_ly_thuyet (
  ma_chuyen_de text primary key,
  noi_dung     text not null default '',
  file_url     text,
  ten_file     text,
  cap_nhat_at  timestamptz not null default now()
);
alter table dai_chuyen_de_ly_thuyet enable row level security;
drop policy if exists auth_all on dai_chuyen_de_ly_thuyet;
create policy auth_all on dai_chuyen_de_ly_thuyet for all to authenticated using (true) with check (true);
grant select, insert, update, delete on dai_chuyen_de_ly_thuyet to anon, authenticated;
