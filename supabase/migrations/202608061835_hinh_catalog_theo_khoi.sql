-- Tách catalog Hình (dạng + bổ đề) theo KHỐI — đồng bộ với mô hình (vốn đã theo khối).
-- Lý do (Thùy): dạng bài & bổ đề gắn với PHẠM VI KIẾN THỨC của từng khối; một loại câu hỏi / bổ đề
-- của khối 9 không phải chuyện của khối 7. Trước đây catalog dùng CHUNG mọi khối (ngoại lệ) — nay bỏ.
-- Data hiện non (7 dạng, 0 bổ đề, KHÔNG cái nào dùng-xuyên-khối) → tách sớm, không có mastery để phân mảnh.
alter table hinh_dang  add column if not exists khoi text;
alter table hinh_bo_de add column if not exists khoi text;

-- Backfill dạng cũ: Thùy xác nhận TẤT CẢ dạng đang có thuộc KHỐI 9. Khớp với data: 2 dạng có bài toán
-- tham chiếu (DH.018/019) đều suy ra khối 9, 5 dạng còn lại chưa có tham chiếu (default 9). → gán hết '9'.
-- (Vẫn ưu tiên khối suy từ bài toán nếu có, đề phòng dạng lỡ dùng khối khác; hiện không có ca nào.)
update hinh_dang d set khoi = coalesce((
  select mh.khoi
  from hinh_cach_giai cg
  join hinh_baitoan bt on bt.id = cg.baitoan_id
  join hinh_mo_hinh mh on mh.id = bt.mo_hinh_id
  where cg.dang_id = d.id
  limit 1
), '9')
where khoi is null;
-- hinh_bo_de: 0 dòng, không cần backfill (cột vẫn thêm để create sau này gắn khối).
