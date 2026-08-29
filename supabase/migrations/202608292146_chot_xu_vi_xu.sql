-- VÍ XU HỌC SINH (Thùy chốt 08-29) — sổ APPEND-ONLY, ví = Σ xu (suy động, không cột balance đè).
-- Chốt tháng: EXP tháng (per HS×MÔN, từ gami_exp_ledger) → xu theo bảng mốc luong_bac (CEO chỉnh trên
-- ERP, giữa 2 mốc lấy MỐC DƯỚI) → dòng 'chot_thang'. Đóng băng; có vấn đề (data trễ/sửa điểm) thì
-- CHỐT LẠI = dòng 'chot_lai' mang CHÊNH LỆCH ± (không xoá/sửa dòng cũ — audit kiểu học phí).
-- Ví là dữ liệu KHÔNG-học-tập (CLAUDE.md §1.6: ví tổng CHUNG) nhưng dòng CHỐT giữ nhãn `mon` để truy
-- ngược xu đến từ môn nào; dòng tiêu xu (doi_qua...) mon=null.
create table if not exists xu_ledger (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  loai text not null check (loai in ('chot_thang','chot_lai','doi_qua','dieu_chinh')),
  xu int not null,                 -- + phát / − trừ (chot_lai và doi_qua có thể âm)
  mon text,                        -- chot_thang/chot_lai: môn nguồn EXP; loại khác: null
  thang text,                      -- 'YYYY-MM' tháng EXP được chốt; loại khác: null
  exp_snapshot int,                -- EXP tại thời điểm chốt (chot_lai = EXP MỚI sau đổi) — để soát chênh
  note text,
  created_by uuid,
  created_at timestamptz not null default now()
);
-- 1 dòng chốt GỐC / (HS×môn×tháng) — chặn double-click/2 tab chốt trùng; chot_lai không giới hạn.
create unique index if not exists xu_ledger_chot_1 on xu_ledger (hoc_sinh_id, mon, thang) where loai = 'chot_thang';
create index if not exists xu_ledger_hs on xu_ledger (hoc_sinh_id);

alter table xu_ledger enable row level security;
create policy xu_ledger_member_all on xu_ledger for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on xu_ledger to authenticated;
