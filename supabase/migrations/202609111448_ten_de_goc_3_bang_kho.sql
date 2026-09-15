-- Thêm cột `ten_de_goc` text NULL cho 3 bảng câu — lưu tên đề gốc khi câu đến từ đề thi
-- (vd "THPT Hùng Vương - Bình Thuận 2025", "Đề Tham Khảo Bộ Giáo Dục 2025", "Sở Thừa Thiên Huế 2025").
-- CEO chốt 11/09: đề thi sắp nạp nhiều (NBV, các bộ khác), cần metadata nguồn từng câu — text tự do
-- 1 cột (không tách năm/trường) vì format không chuẩn hoá được; filter theo năm về sau regex extract.
-- Không constraint, không FK, không default — null cho câu tự soạn / clone / le.
-- Không index — chưa có query filter theo cột này; thêm sau nếu cần.

alter table dai_cau_hoi  add column if not exists ten_de_goc text;
alter table hgt_cau_hoi  add column if not exists ten_de_goc text;
alter table khtn_cau_hoi add column if not exists ten_de_goc text;

comment on column dai_cau_hoi.ten_de_goc  is 'Tên đề gốc (nếu có), vd "THPT Hùng Vương - Bình Thuận 2025". Null cho câu tự soạn.';
comment on column hgt_cau_hoi.ten_de_goc  is 'Tên đề gốc (nếu có), vd "Đề Tham Khảo Bộ Giáo Dục 2025". Null cho câu tự soạn.';
comment on column khtn_cau_hoi.ten_de_goc is 'Tên đề gốc (nếu có), vd "Sở Thừa Thiên Huế 2025". Null cho câu tự soạn.';
