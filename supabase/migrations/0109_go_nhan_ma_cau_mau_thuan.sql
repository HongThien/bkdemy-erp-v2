-- 0109 — Gỡ nhãn `ma_cau` MÂU THUẪN, và siết luật gắn nhãn bằng KIỂM TRA CHÉO DẠNG.
--
-- Sai lầm của 0106/0107 (phát hiện ngay khi verify, 07-21): luật "số ô == số câu ⇒ vị trí là danh
-- tính" KHÔNG an toàn. Phản ví dụ thật — ET 5A2 20/07: đề gốc 6 câu, GV bỏ câu ở GIỮA còn 5, rồi
-- 0107 xoá ô rỗng thứ 6 → còn 5 ô / 5 câu, số khớp nhau NHƯNG ô 3,4,5 vẫn đang giữ câu CŨ (lệch 1
-- bậc). Map theo vị trí lúc này gắn ô sang câu SAI.
--
-- Luật đúng: `ma_dang` của ô được seed từ `dang_chinh` của câu LÚC CHẤM → nó là NHÂN CHỨNG độc lập.
-- Chỉ được nhận nhãn khi dang_chinh(ma_cau mới gắn) KHỚP ma_dang đã có. Lệch = biết chắc gắn sai.
--
-- CÁI SẼ MẤT: giá trị cột `ma_cau` của đúng 5 ô (về lại NULL). KHÔNG đụng gami_grades, không đụng
-- ma_dang, không đụng Elo. Các ô này sẽ hiện cảnh báo "không xác định được câu" trên UI để người
-- đối chiếu đề giấy — đúng hơn là để hệ đoán bừa.
--   · et   5A2 20/07 : ô 3,4,5 (24 điểm) — nhãn 05010202/03/04 vs seed 05010201/02/03
--   · btvn 9C1 19/06 : ô 1,2   (10 điểm) — nhãn 09010202     vs seed 09010203

update gami_session_problems g
set    ma_cau = null
where  g.ma_cau is not null
  and  g.ma_dang is not null
  and  exists (
         select 1
         from  (select ma_cau, dang_chinh from dai_cau_hoi
                union all
                select ma_cau, dang_chinh from khtn_cau_hoi) q
         where q.ma_cau = g.ma_cau and q.dang_chinh <> g.ma_dang);
