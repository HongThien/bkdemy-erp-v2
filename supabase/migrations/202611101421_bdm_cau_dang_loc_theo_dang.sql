-- ============================================================================
-- APP HS — "Chưa mở được lượt luyện: canceling statement due to statement timeout" (Thùy 10/11, mở chặng trên bản đồ).
-- Gốc: view bdm_cau_dang tính dạng = COALESCE(gán câu, gán câu mẹ, đề xuất, đề xuất câu mẹ) ⇒ lọc `dang_bai_id = X` KHÔNG
-- đẩy xuống bảng được ⇒ mỗi lần chọn 1 câu quét cả 70.112 câu Đại (~1 giây). tu_luyen_chu_de_sinh (cả bản p_loai) và
-- tu_luyen_sinh chọn câu trong vòng lặp 10 câu × tối đa 3 tầng ⇒ 1 lượt 4–9,7 giây > trần 8 giây của app.
-- Sửa: viết lại CÙNG NGHĨA thành 4 nhánh theo thứ tự ưu tiên cũ (gán trực tiếp → gán theo câu mẹ → đề xuất trực tiếp →
-- đề xuất theo câu mẹ), mỗi nhánh lọc thẳng trên cột dang_bai_id có chỉ mục. Hợp lệ vì 4 bảng gán đều DUY NHẤT theo ma_cau
-- và dang_bai_id NOT NULL (đã kiểm 10/11) ⇒ mỗi câu đúng 1 dòng như bản COALESCE.
-- Kiểm trước khi áp: bản cũ và bản mới 53.290 dòng, EXCEPT ALL hai chiều = 0 · lượt luyện HS0010 dạng NDB00690 9.736 → 844 ms ·
-- đọc toàn view (không lọc) 468–596 → 152–638 ms. Cột/kiểu/thứ tự giữ nguyên ⇒ 3 view phụ thuộc (bdm_cau_hoi…) không đổi.
-- Đổi luật gán (thêm nguồn thứ 5, bỏ unique ma_cau ở bảng gán) ⇒ phải sửa lại view này cho khớp.
-- ============================================================================

create or replace view public.bdm_cau_dang as
 SELECT q.ma_cau, 'dai'::text AS kho, gc.dang_bai_id, 'gan_cau'::text AS nguon
   FROM dai_bdm_gan_cau gc JOIN dai_cau_hoi q ON q.ma_cau = gc.ma_cau
UNION ALL
 SELECT q.ma_cau, 'dai'::text, gg.dang_bai_id, 'gan_cau'::text
   FROM dai_bdm_gan_cau gg JOIN dai_cau_hoi q ON q.parent_ma_cau = gg.ma_cau
  WHERE NOT EXISTS (SELECT 1 FROM dai_bdm_gan_cau x WHERE x.ma_cau = q.ma_cau)
UNION ALL
 SELECT q.ma_cau, 'dai'::text, dx.dang_bai_id, 'de_xuat'::text
   FROM dai_bdm_de_xuat dx JOIN dai_cau_hoi q ON q.ma_cau = dx.ma_cau
  WHERE NOT EXISTS (SELECT 1 FROM dai_bdm_gan_cau x WHERE x.ma_cau = q.ma_cau)
    AND NOT EXISTS (SELECT 1 FROM dai_bdm_gan_cau x WHERE x.ma_cau = q.parent_ma_cau)
UNION ALL
 SELECT q.ma_cau, 'dai'::text, dxg.dang_bai_id, 'de_xuat'::text
   FROM dai_bdm_de_xuat dxg JOIN dai_cau_hoi q ON q.parent_ma_cau = dxg.ma_cau
  WHERE NOT EXISTS (SELECT 1 FROM dai_bdm_gan_cau x WHERE x.ma_cau = q.ma_cau)
    AND NOT EXISTS (SELECT 1 FROM dai_bdm_gan_cau x WHERE x.ma_cau = q.parent_ma_cau)
    AND NOT EXISTS (SELECT 1 FROM dai_bdm_de_xuat x WHERE x.ma_cau = q.ma_cau)
UNION ALL
 SELECT h.ma_cau, 'hgt'::text, gc.dang_bai_id, 'gan_cau'::text
   FROM hgt_bdm_gan_cau gc JOIN hgt_cau_hoi h ON h.ma_cau = gc.ma_cau
UNION ALL
 SELECT h.ma_cau, 'hgt'::text, gg.dang_bai_id, 'gan_cau'::text
   FROM hgt_bdm_gan_cau gg JOIN hgt_cau_hoi h ON h.parent_ma_cau = gg.ma_cau
  WHERE NOT EXISTS (SELECT 1 FROM hgt_bdm_gan_cau x WHERE x.ma_cau = h.ma_cau)
UNION ALL
 SELECT h.ma_cau, 'hgt'::text, dx.dang_bai_id, 'de_xuat'::text
   FROM hgt_bdm_de_xuat dx JOIN hgt_cau_hoi h ON h.ma_cau = dx.ma_cau
  WHERE NOT EXISTS (SELECT 1 FROM hgt_bdm_gan_cau x WHERE x.ma_cau = h.ma_cau)
    AND NOT EXISTS (SELECT 1 FROM hgt_bdm_gan_cau x WHERE x.ma_cau = h.parent_ma_cau)
UNION ALL
 SELECT h.ma_cau, 'hgt'::text, dxg.dang_bai_id, 'de_xuat'::text
   FROM hgt_bdm_de_xuat dxg JOIN hgt_cau_hoi h ON h.parent_ma_cau = dxg.ma_cau
  WHERE NOT EXISTS (SELECT 1 FROM hgt_bdm_gan_cau x WHERE x.ma_cau = h.ma_cau)
    AND NOT EXISTS (SELECT 1 FROM hgt_bdm_gan_cau x WHERE x.ma_cau = h.parent_ma_cau)
    AND NOT EXISTS (SELECT 1 FROM hgt_bdm_de_xuat x WHERE x.ma_cau = h.ma_cau)
;
