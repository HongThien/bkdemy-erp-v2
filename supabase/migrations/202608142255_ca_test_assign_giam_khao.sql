-- ============================================================================
-- 202608142255 — ca_test_assign_giam_khao
-- ----------------------------------------------------------------------------
-- VÌ SAO: Lập ca test đầu vào cần biết trước AI dự kiến chấm / AI dự kiến trả bài
-- (Thùy 08-14) — báo cáo sau này phải quy về đúng người ĐƯỢC PHÂN CÔNG, không phải
-- người bấm nút thực tế. Hàng đợi Chấm/Trả bài vẫn CHUNG (Thùy chốt 07-19: "ai mở
-- thì làm, KHÔNG owner cứng") — cột assign ở đây chỉ là NHÃN, không khoá hàng đợi.
-- Chỉ 1 nhóm nhỏ nhân sự đủ điều kiện làm việc này, không phải cả team theo môn
-- (chọn từ toàn bộ nhan_su_mon quá nhiều) → roster RIÊNG `test_dau_vao_nhan_su`,
-- tham chiếu nhan_su.id — KHÔNG lưu lại tên/sđt (nhan_su vẫn 1 nguồn duy nhất cho
-- identity, CLAUDE.md §2.1).
--
-- MẤT GÌ: không xoá gì — chỉ thêm cột + thêm bảng.
-- ============================================================================

-- Roster: nhân sự đủ điều kiện chấm/trả bài test đầu vào, theo môn (CLAUDE.md §1.6).
create table if not exists test_dau_vao_nhan_su (
  id          uuid primary key default gen_random_uuid(),
  nhan_su_id  uuid not null references nhan_su(id) on delete cascade,
  mon         text not null,
  created_at  timestamptz not null default now(),
  unique (nhan_su_id, mon)
);
create index if not exists idx_tdv_nhan_su_mon on test_dau_vao_nhan_su(mon);

alter table test_dau_vao_nhan_su enable row level security;
create policy tdv_nhan_su_member_all on test_dau_vao_nhan_su for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on test_dau_vao_nhan_su to authenticated;

-- Assign trên ca_test — điền lúc lập ca, sửa được sau đó (như gán đề/upload bài). Chỉ để BIẾT trước,
-- KHÔNG khoá hàng đợi Chấm/Trả bài.
alter table ca_test add column if not exists nguoi_cham_id uuid references nhan_su(id);
alter table ca_test add column if not exists nguoi_tra_bai_id uuid references nhan_su(id);
