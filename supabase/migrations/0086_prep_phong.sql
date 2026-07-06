-- ============================================================================
-- 0086 — CHUẨN BỊ PHÒNG / PREP (BKDEMY_OPS_SPEC_DETAIL.md Story 3).
-- ----------------------------------------------------------------------------
-- Đơn vị = "lượt" (phòng × cửa sổ giờ), KHÔNG 1-1 với buổi/lớp — 1 lượt phục vụ
-- NHIỀU ca liên tiếp cùng phòng → không gắn vào buoi_hoc được, bảng riêng.
-- Thùy chốt 07-06 (đơn giản hoá, KHÔNG thuật toán gộp-theo-khoảng-cách-phút):
-- T2-T6 = 1 lượt/ngày ('ngay', dù tối có mấy ca) · T7/CN = 2 lượt ('sang'/
-- 'chieu', ranh giới = mốc 12:00 của TKB).
-- Tự chứa cả GV chấm + leader chốt (không cascade sang bảng duyệt khác).
-- Anti-NULL: 1 dòng ra đời khi Ops BẮT ĐẦU thao tác (tick checklist) — dong_at
-- chỉ set khi thật sự đóng (qua cửa thời gian).
-- ============================================================================

create table if not exists prep_phong (
  id             uuid primary key default gen_random_uuid(),
  phong          text not null,
  ngay           date not null,
  luot           text not null check (luot in ('ngay', 'sang', 'chieu')),
  nhan_su_id     uuid references nhan_su(id),      -- ai trực dọn (từ phan_cong_ops, slot đầu lượt)
  don_phong      boolean not null default false,
  chuan_bi_kit   boolean not null default false,
  anh_url        text,
  dong_at        timestamptz,
  gv_diem_nen    numeric not null default 100,
  gv_ghi_chu     text,
  gv_cham_at     timestamptz,
  leader_chot_at timestamptz,
  created_at     timestamptz not null default now(),
  unique (phong, ngay, luot)
);

create index if not exists idx_prep_phong_ngay on prep_phong(ngay);

alter table prep_phong enable row level security;
create policy prep_phong_member_all on prep_phong for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on prep_phong to authenticated;
