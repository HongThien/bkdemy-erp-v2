-- 0107 — Vá ca lệch DUY NHẤT còn lại sau khi quét toàn hệ: ET 5A2 · 20/07/2026.
--
-- Hiện trạng: đề còn 5 câu (GV sửa lúc 21:39 VN, bỏ 1 câu dạng 05010201), nhưng lưới chấm vẫn 6 ô
-- (seed 19:43 VN lúc đề còn 6 câu). Ô thứ 6 KHÔNG CÓ ĐIỂM NÀO — nó chính là cột trống thừa trên
-- "ảnh gửi PH" mà Thùy thấy trong nhóm lớp.
--
-- Ô 1..5 GIỮ NGUYÊN: điểm chấm lúc 19:43–19:47 VN, tức TRƯỚC khi đề bị sửa (21:39) — nhãn dạng của
-- chúng khớp với đề TẠI THỜI ĐIỂM CHẤM. Không có điểm nào cần dời. Không đụng Elo.
--
-- CÁI BỊ MẤT: đúng 1 dòng gami_session_problems, 0 dòng gami_grades. Ô rỗng = cấu trúc, không phải
-- phép đo (§1.5) → xoá không mất dữ liệu đo nào.
--
-- Guard: chỉ xoá khi ô THẬT SỰ không có điểm và lưới THẬT SỰ đang dư so với đề. Chạy lại = no-op.

delete from gami_session_problems p
where  p.phase = 'et'
  and  p.buoi_hoc_id = (
         select b.id from buoi_hoc b join lop l on l.id = b.lop_id
         where l.ten_lop = '5A2' and b.ngay = date '2026-07-20'
           and b.loai = 'thuong' and b.trang_thai <> 'huy')
  -- ô không còn tương ứng câu nào trong đề hiện tại
  and  p.ma_cau is null
  and  p.problem_no > (
         select count(*)
         from   tai_lieu tl
         join   lop l  on l.id = tl.lop_id
         join   tai_lieu_phan tp on tp.tai_lieu_id = tl.id and tp.loai_phan = 'custom'
         join   tai_lieu_cau  tc on tc.phan_id     = tp.id
         where  tl.loai = 'et' and l.ten_lop = '5A2' and tl.ngay = date '2026-07-20')
  -- và tuyệt đối chưa ai chấm ô này
  and  not exists (select 1 from gami_grades g where g.problem_id = p.id);

-- ⚠ ĐỜI ĐẦU của file này CÒN gắn nhãn ma_cau cho lưới 5A2 theo VỊ TRÍ (lý lẽ: xoá xong 5 ô == 5 câu
-- nên map theo thứ tự là đúng). ĐÓ LÀ SAI, và verify ngay sau khi chạy đã bắt được: câu bị bỏ nằm ở
-- GIỮA nên ô 3,4,5 vẫn giữ câu CŨ — số khớp nhau chỉ là trùng hợp. Nhãn sai đã gỡ ở 0109, và luật
-- gắn nhãn giờ bắt buộc KIỂM TRA CHÉO DẠNG (xem 0106).
-- Lưới 5A2 vì thế CỐ Ý để ma_cau = NULL: hệ không biết ô nào ứng câu nào, và không được phép đoán.
-- UI sẽ hiện cảnh báo "không xác định được câu" để người đối chiếu đề giấy rồi quyết.
