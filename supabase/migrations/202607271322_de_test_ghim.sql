-- ============================================================================
-- 202607271322 — de_test_ghim
-- ----------------------------------------------------------------------------
-- VÌ SAO:
-- "Quản lý đề test đầu vào" (Thùy chốt 07-27, đảo lại 07-19). Đề test đầu vào KHÔNG soạn riêng
-- (không tái dựng de_test CRUD đã bỏ mig 0105) — mà là tài liệu CÓ SẴN trong Kho được GHIM (tag)
-- làm "đề test đầu vào". Nguồn = MT + Đề thi (mọi loại master TRỪ ET/GT/BTVN — Thùy chốt 07-27).
--
-- Ghim = 1 DÒNG (anti-NULL §1.5: có dòng = đang ghim; bỏ ghim = xoá dòng). Phạm vi khối×môn tự suy từ
-- chính tai_lieu.khoi/mon (đề gắn khối+môn, spec §C) → bảng chỉ cần trỏ tai_lieu, KHÔNG lặp khoi/mon.
-- Ở Điểm danh test: dropdown chỉ hiện đề ĐÃ GHIM khớp khối×môn ứng viên; chưa ghim đề nào cho
-- khối×môn đó thì fallback về toàn bộ MT+Đề thi khớp (không chặn Ops). ca_test.tai_lieu_id + snapshot
-- câu vào ca_test_cau GIỮ NGUYÊN (detest.ts) — ghim chỉ lọc DANH SÁCH chọn, không đụng luồng chấm.
--
-- MẤT GÌ: không có (thuần thêm mới — create table + policy + grant, không delete/drop/alter thu hẹp).
-- on delete cascade: xoá tài liệu khỏi Kho thì ghim tự rụng theo (không để lại dòng trỏ tài liệu chết).
-- ============================================================================

create table if not exists de_test_ghim (
  tai_lieu_id uuid primary key references tai_lieu(id) on delete cascade,
  ghim_boi    uuid,
  ghim_at     timestamptz not null default now()
);

alter table de_test_ghim enable row level security;
create policy de_test_ghim_member_all on de_test_ghim
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on de_test_ghim to authenticated;
