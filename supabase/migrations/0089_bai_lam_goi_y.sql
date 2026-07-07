-- 0089 — Ghi vết HS xem gợi ý lúc làm test online (phục vụ màn "Xem live" của GV, buổi học).
-- KHÔNG gắn cột vào bai_lam_cau: bảng đó là PHÉP ĐO (verdict), còn "xem gợi ý" là 1 SỰ KIỆN riêng,
-- có thể xảy ra TRƯỚC khi HS trả lời (row bai_lam_cau chưa tồn tại) — nếu upsert chung sẽ tạo dòng
-- verdict=null bị LamBai hiểu nhầm là "đã chấm" lúc khôi phục (`r.verdict ?? 'wrong'`). Tách bảng =
-- an toàn tuyệt đối, đúng luật CLAUDE.md §4 (sự kiện append-only có hoc_sinh_id qua bai_lam + thời điểm).
-- Chỉ cần biết ĐÃ xem hay chưa (không đếm số lần) → upsert idempotent theo (bai_lam_id, bai_test_cau_id).
create table if not exists bai_lam_goi_y (
  id              uuid primary key default gen_random_uuid(),
  bai_lam_id      uuid not null references bai_lam(id) on delete cascade,
  bai_test_cau_id uuid not null references bai_test_cau(id) on delete cascade,
  xem_at          timestamptz not null default now(),
  unique (bai_lam_id, bai_test_cau_id)
);
create index if not exists idx_bai_lam_goi_y_lam on bai_lam_goi_y(bai_lam_id);

-- RLS: bảng mới, 0026 blanket KHÔNG phủ (cùng lý do các bảng test-online 0063) — khai TAY.
alter table bai_lam_goi_y enable row level security;

-- STAFF (GV/TA xem live) toàn quyền đọc.
create policy bai_lam_goi_y_staff on bai_lam_goi_y for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());

-- HS: chỉ ghi vết cho ĐÚNG bài làm của mình.
create policy bai_lam_goi_y_hs_insert on bai_lam_goi_y for insert to authenticated
  with check (exists (select 1 from bai_lam bl where bl.id = bai_lam_id and bl.hoc_sinh_id = public.my_hoc_sinh_id()));

grant select, insert on bai_lam_goi_y to authenticated;
