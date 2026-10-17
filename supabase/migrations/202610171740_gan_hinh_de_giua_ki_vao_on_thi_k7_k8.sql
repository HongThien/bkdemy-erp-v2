-- Gán các câu HÌNH của đề cương + đề thi giữa kì I (Toán 7, 8) vào bài "Ôn thi giữa kì I" (hinh_hoc_bai).
-- Nguồn: câu đã bóc từ Kho đề thi (tai_lieu loai='de_thi', tên có "giữa"), đang nằm ở bài chờ
-- "Chưa phân dạng — Hình học <khối>". Chỉ ĐỔI dạng (dang_chinh) + thu_tu — mã câu (ma_cau) giữ nguyên,
-- tai_lieu_cau vẫn trỏ đúng. Thứ tự: đề cương trước, rồi đề thi; trong mỗi đề theo vị trí câu.
-- Khối 9: câu hình nằm ở hgt_cau_hoi (bảng khác) — KHÔNG đụng ở migration này.

with xep as (
  select distinct on (h.ma_cau)
         h.ma_cau, d.ma_bai as ma_bai_moi,
         t.ten, p.thu_tu as pt, c.thu_tu as ct,
         (t.cau_hinh->'deThi'->>'kieu' is distinct from 'de_cuong') as la_de
  from hinh_hoc_cau_hoi h
  join tai_lieu_cau c on c.ma_cau = h.ma_cau
  join tai_lieu_phan p on p.id = c.phan_id
  join tai_lieu t on t.id = p.tai_lieu_id
  join hinh_hoc_bai d on d.ten_bai = 'Ôn thi giữa kì I' and d.khoi = t.khoi
  where t.loai = 'de_thi' and t.mon = 'Toán' and t.ten ~* 'giữa'
    and t.khoi in ('7', '8')
    and h.dang_chinh in ('HH07000000', 'HH08000000')
    and h.xoa_at is null
  order by h.ma_cau, la_de, t.ten, p.thu_tu, c.thu_tu
), danh_so as (
  select ma_cau, ma_bai_moi,
         row_number() over (partition by ma_bai_moi order by la_de, ten, pt, ct, ma_cau) as stt
  from xep
)
update hinh_hoc_cau_hoi h
   set dang_chinh = s.ma_bai_moi, thu_tu = s.stt
  from danh_so s
 where h.ma_cau = s.ma_cau;
