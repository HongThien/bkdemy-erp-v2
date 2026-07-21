-- 0110 — ET 5A2 · 20/07/2026: gắn ô chấm về ĐÚNG CÂU, theo xác nhận của Thùy (07-21).
--
-- 0107/0109 cố ý để `ma_cau` NULL vì hệ KHÔNG suy được HS hôm đó làm bản 6 câu hay bản 5 câu — hai
-- khả năng dẫn tới hai cách gắn khác nhau, và đoán sai thì hỏng mastery. Đây là loại câu hỏi chỉ
-- người biết. **Thùy xác nhận: HS làm 5 CÂU** = đúng đề hiện tại.
--
-- ⇒ Ô 3,4,5 đang mang `ma_dang` của đề 6-câu (bản GV bỏ đi), tức LỆCH 1 BẬC so với câu HS thật sự làm.
--   24 ô điểm (8 HS × 3 câu) vì thế đang cộng vào SAI DẠNG trong mastery. File này sửa cả hai:
--     ô 3: dạng 05010201 → 05010202  (câu 05010202012)
--     ô 4: dạng 05010202 → 05010203  (câu 05010203012)
--     ô 5: dạng 05010203 → 05010204  (câu 05010204043)
--   ô 1,2 đã đúng sẵn — không đổi.
--
-- KHÔNG xoá/thêm dòng nào. `gami_grades` không đụng tới (40 ô điểm giữ nguyên kết quả Đ/C/S + mã lỗi).
-- Elo KHÔNG đổi: Elo tính từ `points` của grade, không phụ thuộc `ma_dang`. Chỉ MASTERY đổi — và đổi
-- theo hướng ĐÚNG LẠI.
--
-- Guard: chỉ chạy khi lưới đúng 5 ô và đề đúng 5 câu (nếu ai đó đã sửa tay thì file này đứng yên).

update gami_session_problems g
set    ma_cau  = c.ma_cau,
       ma_dang = c.dang_chinh
from  (select tc.ma_cau, q.dang_chinh,
              row_number() over (order by tp.thu_tu, tc.thu_tu, tc.id) as rn
       from   tai_lieu tl
       join   lop l on l.id = tl.lop_id
       join   tai_lieu_phan tp on tp.tai_lieu_id = tl.id and tp.loai_phan = 'custom'
       join   tai_lieu_cau  tc on tc.phan_id = tp.id
       join   dai_cau_hoi   q  on q.ma_cau = tc.ma_cau
       where  tl.loai = 'et' and l.ten_lop = '5A2' and tl.ngay = date '2026-07-20') c
where  g.phase = 'et'
  and  g.problem_no = c.rn
  and  g.buoi_hoc_id = (
         select b.id from buoi_hoc b join lop l on l.id = b.lop_id
         where l.ten_lop = '5A2' and b.ngay = date '2026-07-20'
           and b.loai = 'thuong' and b.trang_thai <> 'huy')
  and (select count(*) from gami_session_problems x
       where x.buoi_hoc_id = g.buoi_hoc_id and x.phase = 'et') = 5
  and (select count(*) from tai_lieu tl2
       join lop l2 on l2.id = tl2.lop_id
       join tai_lieu_phan tp2 on tp2.tai_lieu_id = tl2.id and tp2.loai_phan = 'custom'
       join tai_lieu_cau tc2 on tc2.phan_id = tp2.id
       where tl2.loai = 'et' and l2.ten_lop = '5A2' and tl2.ngay = date '2026-07-20') = 5;
