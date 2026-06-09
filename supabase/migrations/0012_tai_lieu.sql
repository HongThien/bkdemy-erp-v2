-- 0012 — "Làm tài liệu" (giáo trình…). Tài liệu = THAM CHIẾU vào kho (transclusion), xuất mới snapshot.
-- Engine dùng chung mọi loại (loai): giao_trinh | mt | et | bo_tro | daily. Giáo trình làm trước.
create table if not exists tai_lieu (
  id uuid primary key default gen_random_uuid(),
  loai text not null default 'giao_trinh',
  ten text not null,                       -- tên bài (tự do; thường = chuyên đề nhưng có ngoại lệ)
  khoi text not null,
  ma_chuyen_de text,                       -- link chuyên đề nguồn (tuỳ chọn)
  theme text not null default 'bkdemy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists tai_lieu_phan (
  id uuid primary key default gen_random_uuid(),
  tai_lieu_id uuid not null references tai_lieu(id) on delete cascade,
  thu_tu int not null default 0,
  loai_phan text not null,                 -- lt_chuyen_de | dang | btvn | custom
  ref_ma text,                             -- ma_chuyen_de (lt_chuyen_de) | ma_dang (dang)
  tieu_de text,                            -- override tiêu đề (tuỳ chọn)
  noi_dung text                            -- text LaTeX cho phần custom
);
create index if not exists idx_tlphan_tl on tai_lieu_phan(tai_lieu_id);
create table if not exists tai_lieu_cau (
  id uuid primary key default gen_random_uuid(),
  phan_id uuid not null references tai_lieu_phan(id) on delete cascade,
  ma_cau text not null references dai_cau_hoi(ma_cau) on delete cascade,
  thu_tu int not null default 0            -- vai trò (luyện/btvn) suy từ loai_phan của phần
);
create index if not exists idx_tlcau_phan on tai_lieu_cau(phan_id);

do $$ declare t text; begin
  foreach t in array array['tai_lieu','tai_lieu_phan','tai_lieu_cau'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists auth_all on %I', t);
    execute format('create policy auth_all on %I for all to authenticated using (true) with check (true)', t);
    execute format('grant select, insert, update, delete on %I to anon, authenticated', t);
  end loop;
end $$;
