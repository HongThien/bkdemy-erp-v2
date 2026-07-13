-- 0097 — Bổ trợ đuổi: KẾ HOẠCH ĐỢT (Thùy chốt 07-13, redesign luồng đuổi).
-- Đợt (case bo_tro_duoi) giờ mang kế hoạch: GV chốt SCOPE DẠNG cần dạy đuổi + SỐ BUỔI dự kiến
-- (logic gốc: số buổi phải cover hết dạng — không khớp thì sửa số buổi). Học đủ N buổi CÓ MẶT
-- → hệ ĐỀ XUẤT đóng đợt (không đóng câm). Vắng = huỷ suất, không đếm, phải xếp lại.
-- so_buoi_du_kien NULL = đợt CŨ (trước tính năng này) hoặc đợt mới chưa được GV chốt kế hoạch
-- — UI hiện trạng thái "Chưa chốt kế hoạch" bắt chốt trước khi xếp lịch (NULL = chưa chốt,
-- không phải "không áp dụng" — chấp nhận lệch luật 1.5 vì đây là cột kế hoạch trên case có
-- vòng đời 2 bước thật: case sinh ra từ vắng/tuyển sinh TRƯỚC, GV chốt kế hoạch SAU).
alter table bo_tro_duoi add column if not exists so_buoi_du_kien int;

-- Scope dạng của đợt — KHÔNG đo mastery đợt này (Thùy chốt: mục tiêu đuổi là kịp kiến thức để
-- nghe hiểu buổi chính, đánh giá đã có ở buổi chính) — chỉ là danh sách nội dung cần dạy.
-- ma_dang KHÔNG FK (dạng tách bảng theo môn: dai_ban_do/khtn_ban_do… — cùng lý do tai_lieu_cau).
create table if not exists bo_tro_duoi_dang (
  id uuid primary key default gen_random_uuid(),
  bo_tro_duoi_id uuid not null references bo_tro_duoi(id) on delete cascade,
  ma_dang text not null,
  created_at timestamptz not null default now(),
  unique (bo_tro_duoi_id, ma_dang)
);
alter table bo_tro_duoi_dang enable row level security;
drop policy if exists bo_tro_duoi_dang_member_all on bo_tro_duoi_dang;
create policy bo_tro_duoi_dang_member_all on bo_tro_duoi_dang for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());
grant select, insert, update, delete on bo_tro_duoi_dang to authenticated;
