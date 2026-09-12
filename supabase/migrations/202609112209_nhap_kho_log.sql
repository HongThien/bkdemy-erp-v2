-- Bảng log việc Claude nhập kho câu từ 2 folder Drive-sync:
--   Luồng A: "Tài liệu Claude nhập kho" (có sẵn lời giải, Claude trích)
--   Luồng B: "Tài liệu Claude giải bài" (chỉ đề, Claude tự giải + verify)
-- Mục đích: audit ngược "câu này đến từ file nào, xử lý khi nào, ai upload".

create table if not exists nhap_kho_log (
  id          uuid primary key default gen_random_uuid(),
  file_name   text not null,                   -- vd: NBV_L12_Ch5_F.pdf
  folder      text not null,                   -- 'co_giai' | 'khong_giai'
  sha256      text not null,                   -- vân tay nội dung file (chống dup)
  xu_ly_at    timestamptz not null default now(),
  so_cau_moi  int not null default 0,          -- số câu mới INSERT vào kho
  ma_cau_list jsonb not null default '[]'::jsonb, -- ["T312010107054", ...]
  loi         text,                            -- null nếu OK; nếu fail thì log lỗi
  nguoi_upload text,                            -- Google Drive metadata (nếu có)
  ghi_chu     text,
  constraint nhap_kho_log_folder_check check (folder in ('co_giai','khong_giai'))
);

comment on table nhap_kho_log is
  'Log Claude nhập kho câu từ 2 folder Drive: co_giai (luồng A) và khong_giai (luồng B). Audit ngược câu ↔ file.';

create index if not exists idx_nhap_kho_log_file on nhap_kho_log(file_name);
create index if not exists idx_nhap_kho_log_sha  on nhap_kho_log(sha256);
create index if not exists idx_nhap_kho_log_time on nhap_kho_log(xu_ly_at desc);

-- Enable RLS + policy chỉ cho staff nội bộ đọc/ghi (mặc định deny)
alter table nhap_kho_log enable row level security;

drop policy if exists "nhap_kho_log_authenticated_all" on nhap_kho_log;
create policy "nhap_kho_log_authenticated_all"
  on nhap_kho_log for all
  to authenticated
  using (true) with check (true);
