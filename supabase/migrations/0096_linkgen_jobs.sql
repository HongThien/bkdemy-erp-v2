-- 0096 — linkgen_jobs: hàng đợi gen link PDF chạy Ở SERVER (worker Chrome thật), thay hẳn hàng đợi
-- client-side cũ (Zustand + localStorage + html2canvas trên máy người dùng — máy người dùng bị chiếm
-- để render, hiện overlay chờ 2 phút, mất job khi F5; Thùy 07-12: "t ko muốn phải chờ bất kì chỗ nào").
-- 1 dòng / 1 tài liệu = TRẠNG THÁI HIỆN TẠI của việc gen link (PK = tai_lieu_id, không giữ lịch sử —
-- job cũ xong thì dòng được ghi đè khi enqueue lại; đơn giản, dedupe tự nhiên, đúng đủ nhu cầu).
-- Client CHỈ insert/upsert dòng 'pending' (fire-and-forget, ~0ms) rồi đi tiếp; worker (service role)
-- poll → 'processing' → in PDF chữ thật qua Chrome (printBackground) → upload → ghi tai_lieu.file_url
-- → 'done'. Lỗi: attempt+1, quá 3 lần → 'failed' + error (UI hiện "⚠ lỗi" — không nuốt im lặng).
create table if not exists linkgen_jobs (
  tai_lieu_id uuid primary key references tai_lieu(id) on delete cascade,
  loai text not null,
  status text not null default 'pending' check (status in ('pending','processing','done','failed')),
  attempt int not null default 0,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table linkgen_jobs enable row level security;
drop policy if exists linkgen_jobs_member_all on linkgen_jobs;
create policy linkgen_jobs_member_all on linkgen_jobs for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on linkgen_jobs to authenticated;
