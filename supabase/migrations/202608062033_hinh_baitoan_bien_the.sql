-- ============================================================================
-- 202608062033 — hinh_baitoan_bien_the
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy): 1 node = 1 bài toán TRỪU TƯỢNG trong chuỗi (ý chuẩn, bộ chữ ABC/H, mượn giả thiết+hình
--   của mô hình). Nhưng thực dạy cần các BIẾN THỂ cùng bài đó: ĐỔI SỐ (thay giá trị) / ĐỔI ĐỈNH (đổi tên
--   điểm ABC→MNP). Cùng KP, cùng logic (tiền đề/cách giải), chỉ khác bề mặt số/nhãn → treo DƯỚI node,
--   KHÔNG đẻ node mới (không loạn lưới, không phân mảnh mastery). Giai đoạn đầu: SOẠN TAY từng biến thể
--   (đề + hình + đáp án riêng). Hình phải tự upload — AI không vẽ lại hình hình học đáng tin.
--
-- MẤT GÌ: không mất gì — chỉ THÊM 1 bảng + RLS.
-- ============================================================================
create table if not exists hinh_baitoan_bien_the (
  id           uuid primary key default gen_random_uuid(),
  baitoan_id   uuid not null references hinh_baitoan(id) on delete cascade,
  mon          text not null default 'Toán',
  kieu         text not null default 'doi_so' check (kieu in ('doi_so', 'doi_dinh', 'ca_hai')),
  de_bai       text not null default '',   -- đề cụ thể (giả thiết + câu hỏi đã đổi số/đỉnh), text + LaTeX
  anh          text,                        -- hình riêng của biến thể (bắt buộc tự vẽ/upload)
  loi_giai     text,
  anh_loi_giai text,
  ghi_chu      text,
  thu_tu       integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists hinh_baitoan_bien_the_bt_idx on hinh_baitoan_bien_the(baitoan_id);
alter table hinh_baitoan_bien_the enable row level security;
drop policy if exists hinh_baitoan_bien_the_member_all on hinh_baitoan_bien_the;
create policy hinh_baitoan_bien_the_member_all on hinh_baitoan_bien_the
  for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
