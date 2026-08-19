-- ============================================================================
-- 202608181903 — giaoviec_cap_nhat_tien_do
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 08-18: trong lúc LÀM (không phải lúc nghiệm thu), người làm cần chỗ tự
--   ghi tình hình + % tiến độ để leader nắm được mà không phải hỏi. Đây là bản
--   ghi TƯỜNG THUẬT của người làm — KHÁC HẲN `viec.tien_do` (điểm 0-100 MÁY tính
--   từ ngay_nop vs deadline lúc nghiệm thu, dùng trong công thức chấm). Không
--   được đụng/ghi đè cột đó — 2 khái niệm khác nhau dùng trùng chữ "tiến độ" là
--   bẫy, nên tách hẳn tên: cột mới gọi `tien_do_bao_cao` (self-report), sống
--   trong bảng riêng, không phải cột trên `viec`.
--
--   Bảng riêng (không phải 1 cột JSON/text trên viec) vì đây là NHIỀU lần theo
--   thời gian (đúng CLAUDE §4 "immutable append", giống viec_log) — mỗi lần cập
--   nhật là 1 dòng, không ghi đè dòng cũ, nên xem lại được cả quá trình chứ
--   không chỉ bản mới nhất.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Bảng mới hoàn toàn.
-- ============================================================================

create table if not exists viec_cap_nhat (
  id              uuid primary key default gen_random_uuid(),
  viec_id         uuid not null references viec(id) on delete cascade,
  nguoi_id        uuid not null references nhan_su(id),
  noi_dung        text not null,
  tien_do_bao_cao numeric check (tien_do_bao_cao is null or tien_do_bao_cao between 0 and 100),
  created_at      timestamptz not null default now()
);
create index if not exists idx_viec_cap_nhat_viec on viec_cap_nhat(viec_id, created_at);

alter table viec_cap_nhat enable row level security;
drop policy if exists viec_cap_nhat_member_all on viec_cap_nhat;
create policy viec_cap_nhat_member_all on viec_cap_nhat for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());

grant select, insert on viec_cap_nhat to authenticated;
