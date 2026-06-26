-- 0055 — BỔ TRỢ ĐUỔI: HS mới chậm hơn chương trình lớp → học đuổi cho bắt kịp.
-- Khác bù (sự kiện vắng → pure-derive): đuổi = PHÁN ĐOÁN nên cần BẢNG CỜ (case).
-- 1 case = (HS × lớp). Kéo dài nhiều buổi tới khi "hoàn thành khóa".
create table if not exists bo_tro_duoi (
  id            uuid primary key default gen_random_uuid(),
  hoc_sinh_id   uuid not null references hoc_sinh(id) on delete cascade,
  lop_id        uuid references lop(id) on delete set null, -- lớp đang chậm so với nó
  nguon         text not null default 'thu_cong',           -- tuyen_sinh | thu_cong
  ly_do         text,
  trang_thai    text not null default 'can_duoi',           -- can_duoi | hoan_thanh (xong khóa → rời luồng)
  actor         uuid,
  created_at    timestamptz not null default now(),
  hoan_thanh_at timestamptz
);
-- 1 HS chỉ 1 case ĐANG-ĐUỔI / lớp (tránh gắn cờ trùng). Case hoàn thành thì không tính.
create unique index if not exists uq_bo_tro_duoi_active
  on bo_tro_duoi (hoc_sinh_id, lop_id) where trang_thai = 'can_duoi';

-- Buổi đuổi tái dùng buoi_hoc loai='bo_tro_duoi' (constraint ĐÃ cho phép). Link HS↔case qua cột này.
alter table buoi_hoc_hs add column if not exists bo_tro_duoi_id uuid references bo_tro_duoi(id) on delete set null;

-- Cờ ở tuyển sinh: tích "Cần bổ trợ đuổi" → khi convert L7→L8 tạo case (nguon='tuyen_sinh').
alter table ung_vien add column if not exists can_bo_tro_duoi boolean not null default false;
