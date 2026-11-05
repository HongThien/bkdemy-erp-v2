-- ============================================================================
-- 202611051707 — doi_ung_dang_cu_tieu_hoc_con_thieu
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 hỏi "sao bản đồ mới lại thiếu mấy dạng này so với bản đồ cũ". Đo: khối 3 đủ; khối 4 · 5 còn 6 dạng cũ KHÔNG có
--   dòng dai_bdm_doi_ung ⇒ câu của chúng không hiện ở bản đồ mới (view bdm_cau_dang đi qua đối ứng). Thùy duyệt đề xuất ("Ghi theo đề xuất").
-- LÀM (5/6 dạng; dạng thứ 6 giữ lại hỏi — xem cuối):
--   · T104010107 "Tính giá trị biểu thức trong phạm vi 100 000" (55 câu) → NDB01766 "Tính giá trị biểu thức chứa phép cộng trừ" (K4).
--   · T104040204 "Bài toán với đơn vị đo đại lượng" (22 câu, lát nền bằng tấm gỗ/gạch) → dạng MỚI trong nhóm K4 "Đơn vị đo diện tích" (NNB01787).
--   · T105110101 "Bài toán trung bình cộng" (22 câu) → dạng MỚI trong nhóm K5 "Bài toán lời văn" (NNB01883) — K5 chưa có dạng TBC.
--   · T105110102 "Ôn tập số thập phân" (8 câu, hoàn thành bảng) → NDB02100 "Đọc, viết số thập phân".
--   · T105110104 "Ôn tập hình học và đo lường" (1 câu "Hình vẽ bên có…") → NDB02140 "Góc, đường thẳng, hình thoi, hình bình hành".
--   CHƯA ghi: T105110103 "Ôn tập một số đơn vị đo diện tích" (46 câu thửa ruộng HCN + thu hoạch) — đề xuất cũ trỏ NDB02152 nhưng tên đầy
--   đủ của dạng đó là "Tính diện tích các hình kì dị bằng phương pháp chia hình", không hợp ⇒ hỏi lại Thùy.
-- MẤT GÌ (Luật xoá): Không xoá gì. Chỉ thêm 2 dòng dai_bdm_dang_bai + 5 dòng dai_bdm_doi_ung (trigger log tự ghi vết).
-- ============================================================================
do $$
declare d_k4 text; d_k5 text; n int;
begin
  insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, thu_tu, muc_do, bac_toi_thieu)
  values ('NNB01787', 'Bài toán thực tế với đơn vị đo diện tích',
          'Bài toán lời văn cần tính diện tích (thường là hình vuông, hình chữ nhật) rồi đổi đơn vị đo diện tích để trả lời câu hỏi thực tế, ví dụ cần bao nhiêu viên gạch / tấm gỗ để lát kín nền. Khác các dạng đổi đơn vị ở chỗ phải tính diện tích và chia diện tích trước.',
          (select coalesce(max(thu_tu), 0) + 1 from dai_bdm_dang_bai where nhom_id = 'NNB01787'), 3, 'B')
  returning id into d_k4;

  insert into dai_bdm_dang_bai (nhom_id, ten, mo_ta, thu_tu, muc_do, bac_toi_thieu)
  values ('NNB01883', 'Bài toán trung bình cộng',
          'Bài toán lời văn cho trung bình cộng của các số (hoặc các đại lượng) và yêu cầu tìm tổng, tìm một số chưa biết, hoặc kết hợp với tổng – hiệu; công cụ: tổng = trung bình cộng × số các số hạng.',
          (select coalesce(max(thu_tu), 0) + 1 from dai_bdm_dang_bai where nhom_id = 'NNB01883'), 3, 'B')
  returning id into d_k5;

  insert into dai_bdm_doi_ung (ma_dang_cu, dich_dang_bai)
  select v.cu, v.dich from (values ('T104010107', 'NDB01766'), ('T104040204', d_k4), ('T105110101', d_k5),
                                   ('T105110102', 'NDB02100'), ('T105110104', 'NDB02140')) v(cu, dich)
   where not exists (select 1 from dai_bdm_doi_ung u where u.ma_dang_cu = v.cu);
  get diagnostics n = row_count;
  if n <> 5 then raise exception 'Đối ứng thêm % dòng (cần 5)', n; end if;
  raise notice 'Dạng mới: % (K4) · % (K5); thêm 5 đối ứng', d_k4, d_k5;
end $$;
