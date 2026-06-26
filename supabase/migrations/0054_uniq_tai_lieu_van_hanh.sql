-- 0054 — Chống TRÙNG doc vận-hành. Re-trích (trichXuatBuoi) insert mù → mỗi lần đẻ doc mới
-- → 1 buổi có 2 BTVN/GT → getBTVNByBuoi .maybeSingle() THROW → màn không load BTVN (bug 9A2 25/06).
-- 1 buổi (lớp+ngày) chỉ 1 GT + 1 BTVN. Unique TỪNG PHẦN (chỉ doc vận-hành có lop_id+ngay; master GT để yên).
create unique index if not exists uq_tai_lieu_van_hanh
  on tai_lieu (lop_id, ngay, loai)
  where loai in ('btvn','giao_trinh_buoi') and lop_id is not null and ngay is not null;
