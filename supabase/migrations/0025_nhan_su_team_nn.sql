-- ============================================================================
-- Migration 0025 — nhan_su ↔ team n-n (Thùy chốt 06-11: 1 NS thuộc NHIỀU team)
-- ----------------------------------------------------------------------------
-- 0024 vừa thêm nhan_su.team_id (1 team) → sai model. Thay bằng bảng nối
-- nhan_su_team; chuyển data team_id cũ sang rồi DROP cột.
-- ============================================================================

create table if not exists nhan_su_team (
  nhan_su_id uuid not null references nhan_su(id) on delete cascade,
  team_id    uuid not null references team(id)    on delete cascade,
  primary key (nhan_su_id, team_id)
);

alter table nhan_su_team enable row level security;
create policy nhan_su_team_auth_all on nhan_su_team for all to authenticated using (true) with check (true);
grant select, insert, update, delete on nhan_su_team to authenticated;

-- chuyển biên chế 1-team (0024) sang n-n rồi bỏ cột cũ
insert into nhan_su_team (nhan_su_id, team_id)
  select id, team_id from nhan_su where team_id is not null
  on conflict do nothing;
alter table nhan_su drop column if exists team_id;
