-- ============================================================================
-- 0084 — PHÂN CÔNG CA TRỰC OPS (spine, BKDEMY_OPS_SPEC_DETAIL.md §B).
-- ----------------------------------------------------------------------------
-- Thùy chốt 07-06: PURE-DERIVE THUẦN, KHÔNG "chốt tuần"/đóng băng, KHÔNG bảng
-- ngoại lệ riêng. "Ca" = 1 dòng thoi_khoa_bieu (đã là thu×giờ×phòng×lớp lặp
-- tuần) → piggyback thẳng lên TKB thay vì dựng khái niệm ca song song.
-- Effective-dated Y HỆT pattern TKB: sửa vĩnh viễn = đóng dòng cũ (hieu_luc_den)
-- + mở dòng mới; swap 1 lần thì Ops tự đóng/mở lại sau (chấp nhận phải "reset"
-- tay, đổi lấy KHÔNG cần thêm bảng tuần/ngoại lệ).
-- Ca trống = TKB slot không có dòng phan_cong_ops hiệu lực tại ngày đó — DERIVE
-- được ở query, không cần cột cờ (đúng CLAUDE.md §4 "không đẻ row chờ").
-- ============================================================================

create table if not exists phan_cong_ops (
  id           uuid primary key default gen_random_uuid(),
  tkb_id       uuid not null references thoi_khoa_bieu(id) on delete cascade,
  nhan_su_id   uuid not null references nhan_su(id),
  hieu_luc_tu  date not null,
  hieu_luc_den date,
  created_at   timestamptz not null default now()
);

create index if not exists idx_phan_cong_ops_tkb on phan_cong_ops(tkb_id);
create index if not exists idx_phan_cong_ops_ns  on phan_cong_ops(nhan_su_id);

alter table phan_cong_ops enable row level security;
create policy phan_cong_ops_member_all on phan_cong_ops for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on phan_cong_ops to authenticated;
