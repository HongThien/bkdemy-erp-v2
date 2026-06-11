-- 0022 — ĐẢO MODEL tổ chức: GHẾ (vị trí) là xương sống, người chỉ là kẻ ngồi ghế.
-- Cây = ghế sinh ghế (cha_id giữa các GHẾ, không phải giữa người). Ghế trống (nhan_su_id null) vẫn tồn tại.
-- 1 người ngồi nhiều ghế (kể cả cùng team). Thay thế hẳn thanh_vien_team (migrate data rồi drop).
create table if not exists vi_tri (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references team(id) on delete cascade,
  ten         text,                                -- chức vụ/scope của GHẾ, vd 'Trưởng khối THCS'
  cap         text not null default 'thanh_vien' check (cap in ('truong','pho','thanh_vien')),
  cha_id      uuid references vi_tri(id) on delete set null,   -- ghế cha; null = đỉnh team
  nhan_su_id  uuid references nhan_su(id) on delete set null,  -- người ĐANG ngồi; null = GHẾ TRỐNG
  created_at  timestamptz not null default now()
);

-- Migrate: mỗi membership cũ → 1 ghế (giữ id để map cha); cha ghế = ghế của quan_ly cùng team.
insert into vi_tri (id, team_id, ten, cap, nhan_su_id)
select id, team_id, chuc_vu, vai_tro, nhan_su_id from thanh_vien_team
on conflict (id) do nothing;
update vi_tri v set cha_id = p.id
from thanh_vien_team t
join thanh_vien_team p on p.nhan_su_id = t.quan_ly_id and p.team_id = t.team_id
where v.id = t.id and v.cha_id is null;

drop table thanh_vien_team;

alter table vi_tri enable row level security;
create policy vi_tri_auth_all on vi_tri for all to authenticated using (true) with check (true);
