-- HÌNH: Dạng bài / Bổ đề (nhãn của từng ý, Thùy 19/10) có đủ 3 phần như dạng bài bên Đại:
--   MÔ TẢ nhận biết (cột mo_ta — học thuật đọc + Claude dựa vào để gợi ý nhãn) · LÝ THUYẾT (bảng *_ly_thuyet đã có) ·
--   VÍ DỤ (bảng *_vi_du MỚI, cùng khuôn *_ly_thuyet để dùng chung khung soạn LyThuyetModal).
-- "Thiếu = không có dòng": chưa có ví dụ = không có dòng ở *_vi_du.

alter table hinh_dang  add column if not exists mo_ta text not null default '';
alter table hinh_bo_de add column if not exists mo_ta text not null default '';

create table if not exists hinh_dang_vi_du (
  dang_id     uuid primary key references hinh_dang(id),
  noi_dung    text,
  file_url    text,
  ten_file    text,
  cap_nhat_at timestamptz default now()
);
create table if not exists hinh_bo_de_vi_du (
  bo_de_id    uuid primary key references hinh_bo_de(id),
  noi_dung    text,
  file_url    text,
  ten_file    text,
  cap_nhat_at timestamptz default now()
);

alter table hinh_dang_vi_du  enable row level security;
alter table hinh_bo_de_vi_du enable row level security;
drop policy if exists hinh_dang_vi_du_member_all on hinh_dang_vi_du;
create policy hinh_dang_vi_du_member_all on hinh_dang_vi_du for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
drop policy if exists hinh_bo_de_vi_du_member_all on hinh_bo_de_vi_du;
create policy hinh_bo_de_vi_du_member_all on hinh_bo_de_vi_du for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
grant select, insert, update, delete on hinh_dang_vi_du, hinh_bo_de_vi_du to authenticated;
