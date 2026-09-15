-- ⭐ 22/08: hàng đợi gen-link tĩnh cho Hình — khuôn `linkgen_jobs` của Đại, nhưng KHÔNG tái dùng bảng đó
-- (PK của nó là tai_lieu_id, FK → tai_lieu.id — không có chỗ cho "buổi X + phan nào"; 1 hinh_gt_buoi
-- chiếu ra tới 2 "tài liệu" phan='lop'/'nha', xem listAllBuoiHinh). Bảng riêng, worker (worker/index.mjs)
-- poll CẢ HAI bảng.
-- ⚠ buoi_id KHÔNG có FK → hinh_gt_buoi: bảng đó thuộc sở hữu `postgres` (tạo tay qua SQL Editor, CLAUDE.md
-- §2.1 "điểm mù quyền DB"), role migrate (`claude_build`) không có REFERENCES trên nó — thêm FK sẽ fail
-- ngay "permission denied". Chấp nhận mất ràng buộc toàn vẹn ở DB; app tự đảm bảo chỉ ghi buoi_id có thật
-- (mọi INSERT đều qua enqueueHinhLinkGenJob(), tham số lấy trực tiếp từ hinh_gt_buoi.id vừa query).
create table if not exists hinh_linkgen_jobs (
  buoi_id uuid not null,
  phan text not null check (phan = any (array['lop','nha'])),
  status text not null default 'pending' check (status = any (array['pending','processing','done','failed'])),
  attempt integer not null default 0,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (buoi_id, phan)
);
