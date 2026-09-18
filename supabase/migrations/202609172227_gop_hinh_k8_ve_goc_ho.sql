-- ============================================================================
-- 202609172227 — GỘP Bài học HÌNH khối 8 về MÔ HÌNH GỐC HỌ (CEO 17/09)
-- ----------------------------------------------------------------------------
-- VÌ SAO: CEO chốt K8 chỉ giữ 9 Bài GỐC HỌ (Tứ giác, Hình thang, Hình thang cân,
-- Hình bình hành, Hình chữ nhật, Hình thoi, Hình vuông, Tam giác vuông - trung điểm,
-- Hình học Test). Mô hình CON của K8 (17 cái) → bỏ khỏi cây "Bài học", gom câu về Bài GỐC.
--
-- QUY TRÌNH:
--   1. UPDATE hinh_hoc_cau_hoi.dang_chinh (43 câu) từ Bài con → Bài gốc tương ứng.
--      `mo_hinh_id` GIỮ NGUYÊN (mô hình con vẫn tồn tại ở hinh_mo_hinh — mastery signal không mất).
--   2. DELETE hinh_hoc_bai_ly_thuyet của 17 Bài con (cascade khi xóa Bài).
--   3. DELETE 17 Bài con khỏi hinh_hoc_bai.
--
-- MẤT GÌ: 17 Bài con trong `hinh_hoc_bai` (và lý thuyết) — nội dung câu KHÔNG mất (chỉ đổi dang_chinh).
-- KHÔNG đụng `hinh_mo_hinh`/`hinh_baitoan`/… (phía Luyện nguyên vẹn).
--
-- Bảng mapping Bài con → Bài gốc (đã kiểm hierarchy qua hinh_mo_hinh_cha):
--   HH00067 "Tứ giác có 2 cạnh bên cắt nhau"  (MH.027)  →  HH00058 "Tứ giác "  · 3 câu
--   HH00068 "Tứ giác có tổng hai góc đối bằng 180"  (MH.028)  →  HH00058 "Tứ giác "  · 5 câu
--   HH00069 "Tứ giác có hai tia phân giác cắt nhau"  (MH.029)  →  HH00058 "Tứ giác "  · 4 câu
--   HH00070 "Tứ giác có tính chất của hình thang"  (MH.030)  →  HH00058 "Tứ giác "  · 4 câu
--   HH00071 "Phân giác góc đáy hình thang"  (MH.041)  →  HH00059 "Hình thang"  · 3 câu
--   HH00072 "Hình thang cân trong tam giác cân"  (MH.042)  →  HH00060 "Hình thang cân"  · 2 câu
--   HH00073 "Tam giác cân tạo ra hình thang cân"  (MH.043)  →  HH00060 "Hình thang cân"  · 4 câu
--   HH00074 "Trung điểm cạnh đấy của hình thang cân"  (MH.044)  →  HH00060 "Hình thang cân"  · 1 câu
--   HH00075 "Trung điểm cạnh của hình bình hành"  (MH.047)  →  HH00061 "Hình bình hành"  · 4 câu
--   HH00076 "Phân giác của hình bình hành"  (MH.048)  →  HH00061 "Hình bình hành"  · 3 câu
--   HH00077 "Đường thẳng qua tâm"  (MH.049)  →  HH00061 "Hình bình hành"  · 2 câu
--   HH00078 "Vuông góc với đường chéo"  (MH.050)  →  HH00061 "Hình bình hành"  · 1 câu
--   HH00079 "Mô hình trực tâm"  (MH.051)  →  HH00061 "Hình bình hành"  · 1 câu
--   HH00080 "Mô hình Đường trung bình của tam giác"  (MH.053)  →  HH00061 "Hình bình hành"  · 1 câu
--   HH00081 "Tam giác vuông - Trung điểm cạnh huyền"  (MH.057)  →  HH00062 "Hình chữ nhật"  · 1 câu
--   HH00082 "Tam giác vuông - Chân đường cao"  (MH.058)  →  HH00062 "Hình chữ nhật"  · 3 câu
--   HH00083 "Tam giác vuông - Điểm bất kì thuộc cạnh huyền"  (MH.059)  →  HH00062 "Hình chữ nhật"  · 1 câu
-- ============================================================================

begin;

-- PRE-CHECK: 17 Bài con vẫn còn ─ nếu đã chạy migration này rồi thì không còn.
do $$
declare n int;
begin
  select count(*) into n from hinh_hoc_bai where ma_bai in ('HH00067','HH00068','HH00069','HH00070','HH00071','HH00072','HH00073','HH00074','HH00075','HH00076','HH00077','HH00078','HH00079','HH00080','HH00081','HH00082','HH00083');
  if n = 0 then raise exception 'Không còn Bài con nào của K8 — migration này đã chạy hoặc data khác trạng thái. Bỏ qua.'; end if;
  if n <> 17 then raise notice 'Kỳ vọng 17 Bài con, có %', n; end if;
end $$;

-- STAGE 1: Chuyển câu từng Bài con sang Bài gốc.
-- Điều chỉnh thu_tu để không trùng — cộng offset = max(thu_tu) hiện tại của Bài gốc.
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00058',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00058'), 0)
  where dang_chinh = 'HH00067';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00058',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00058'), 0)
  where dang_chinh = 'HH00068';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00058',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00058'), 0)
  where dang_chinh = 'HH00069';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00058',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00058'), 0)
  where dang_chinh = 'HH00070';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00059',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00059'), 0)
  where dang_chinh = 'HH00071';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00060',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00060'), 0)
  where dang_chinh = 'HH00072';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00060',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00060'), 0)
  where dang_chinh = 'HH00073';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00060',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00060'), 0)
  where dang_chinh = 'HH00074';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00061',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00061'), 0)
  where dang_chinh = 'HH00075';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00061',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00061'), 0)
  where dang_chinh = 'HH00076';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00061',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00061'), 0)
  where dang_chinh = 'HH00077';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00061',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00061'), 0)
  where dang_chinh = 'HH00078';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00061',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00061'), 0)
  where dang_chinh = 'HH00079';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00061',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00061'), 0)
  where dang_chinh = 'HH00080';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00062',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00062'), 0)
  where dang_chinh = 'HH00081';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00062',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00062'), 0)
  where dang_chinh = 'HH00082';
update hinh_hoc_cau_hoi set
  dang_chinh = 'HH00062',
  thu_tu = thu_tu + coalesce((select max(thu_tu) from hinh_hoc_cau_hoi where dang_chinh = 'HH00062'), 0)
  where dang_chinh = 'HH00083';

-- STAGE 2: Xóa lý thuyết Bài con (FK cascade khi xóa Bài, nhưng xóa tường minh để tránh dựa vào cascade).
delete from hinh_hoc_bai_ly_thuyet where ma_bai in ('HH00067','HH00068','HH00069','HH00070','HH00071','HH00072','HH00073','HH00074','HH00075','HH00076','HH00077','HH00078','HH00079','HH00080','HH00081','HH00082','HH00083');

-- STAGE 3: Xóa Bài con — chỉ được nếu KHÔNG còn câu tham chiếu (FK ON DELETE RESTRICT ở hinh_hoc_cau_hoi.dang_chinh).
delete from hinh_hoc_bai where ma_bai in ('HH00067','HH00068','HH00069','HH00070','HH00071','HH00072','HH00073','HH00074','HH00075','HH00076','HH00077','HH00078','HH00079','HH00080','HH00081','HH00082','HH00083');

-- POST-CHECK
do $$
declare n_bai int; n_cau int;
begin
  select count(*) into n_bai from hinh_hoc_bai where khoi='8';
  select count(*) into n_cau from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai=c.dang_chinh where b.khoi='8';
  raise notice 'K8 sau gộp: % Bài học, % câu (kỳ vọng 9 Bài).', n_bai, n_cau;
  if n_bai <> 9 then raise exception 'Số Bài sai: kỳ vọng 9, có %', n_bai; end if;
end $$;

commit;