-- ⭐ 23/08: ET Hình lên Kho tài liệu đầy đủ như Đại (In nhanh/Copy link/↻) — hàng đợi gen-link cần nhận
-- phan='et' (trước chỉ 'lop'/'nha'). Bảng này claude_build SỞ HỮU (tạo qua migrate 22/08, không dính
-- điểm mù quyền DB ở hinh_gt_buoi/hinh_gt_bai) nên ALTER được thẳng, không cần Supabase SQL Editor tay.
alter table hinh_linkgen_jobs drop constraint hinh_linkgen_jobs_phan_check;
alter table hinh_linkgen_jobs add constraint hinh_linkgen_jobs_phan_check check (phan = any (array['lop','nha','et']));
