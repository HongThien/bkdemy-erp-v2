-- Sổ đối soát thu hồi phân bón (lỗi game: mua 3 ĐHT, bán 5 EXP). Mỗi em ĐÚNG 1 dòng → chạy lại không áp 2 lần, hoàn tác được nhờ state_truoc.
create table if not exists nt_thu_hoi_phan (
  hoc_sinh_id uuid primary key references hoc_sinh(id),
  so_bao integer not null check (so_bao > 0),
  dht_hoan integer not null,          -- = 3 × so_bao, đã ghi dht_hoan
  exp_phai_rut integer not null,      -- = 5 × so_bao
  exp_rut_vi integer not null,        -- phần trừ thẳng vi.exp
  xu_game_rut integer not null,       -- xu trong game bị rút để bù phần EXP thiếu
  exp_tra_lai integer not null,       -- phần lẻ trả về vi.exp (xu rút là số nguyên)
  exp_con_thieu integer not null,     -- không đủ EXP lẫn xu game để rút (không đụng ví xu thật)
  state_truoc jsonb not null,
  tao_at timestamptz not null default now()
);
alter table nt_thu_hoi_phan enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'nt_thu_hoi_phan' and policyname = 'nt_thu_hoi_phan_member_select') then
    create policy nt_thu_hoi_phan_member_select on nt_thu_hoi_phan for select to authenticated using (la_thanh_vien());
  end if;
  if exists (select 1 from pg_roles where rolname = 'claude_ro')
     and not exists (select 1 from pg_policies where tablename = 'nt_thu_hoi_phan' and policyname = 'claude_ro_select') then
    create policy claude_ro_select on nt_thu_hoi_phan for select to claude_ro using (true);
  end if;
end $$;
