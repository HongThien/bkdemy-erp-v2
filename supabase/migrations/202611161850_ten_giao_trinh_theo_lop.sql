-- ============================================================================
-- 202611161850 — ten_giao_trinh_theo_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/11 (xem màn Giáo trình tuần): "Thống nhất lại tên … Giáo trình + tên lớp + tag đại · hình". Tên giáo trình bản đồ mới đang mỗi người
--   một kiểu ("8S1", "Giáo trình 8A2_Đại số", "Giáo trình hình 11A1", "7K - <chủ đề>"…). Mẫu: "Giáo trình <tên lớp>"; nhánh (Đại · Hình · HGT)
--   KHÔNG nằm trong tên — màn hiện thành thẻ. Phần mô tả riêng (chủ đề KHTN, "test") giữ sau " · " để các giáo trình cùng lớp không trùng.
--   Tên chỉ là nhãn hiển thị, không ai tham chiếu theo tên (mã gốc = id). Bảng dưới giữ TÊN CŨ để tra / đổi ngược.
--   Chặn: chỉ đổi dòng còn đúng tên cũ (ai sửa tên trong lúc này thì giữ). KHÔNG đổi 2 giáo trình của 5A2 ("Giáo trình 5A2", "Giáo trình 5A") —
--   cả hai đang gán lẫn cho 5A1 và 5A2, chờ Thùy chỉ cái nào của lớp nào.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Đổi cột ten của 36 giáo trình (tên cũ ở bảng dưới).
-- ============================================================================

update tai_lieu t set ten = v.moi
  from (values
  ('087e5218-e511-430e-963c-d149f7a66a89'::uuid, '7K - Sơ lược bảng tuần hoàn & Liên kết Hóa học', 'Giáo trình 7K1 · Sơ lược bảng tuần hoàn & Liên kết Hóa học'),
  ('2cfa684f-d884-4921-8ae4-07f61e846126'::uuid, '7K - Phản xạ âm, chống ô nhiễm tiếng ồn & Vai trò của nước và chất dinh dưỡng với sinh vật', 'Giáo trình 7K1 · Phản xạ âm, chống ô nhiễm tiếng ồn & Vai trò của nước và chất dinh dưỡng với sinh vật'),
  ('6b083192-dabc-4ced-8c5e-5946fad1ff6f'::uuid, '8K - Tốc độ phản ứng và chất xúc tác & Lực đẩy Archimedes', 'Giáo trình 8K1 · Tốc độ phản ứng và chất xúc tác & Lực đẩy Archimedes'),
  ('223c3f3b-9d1a-4a10-9c85-93203d58a45d'::uuid, '8K - Hệ hô hấp ở người & Hiệu suất phản ứng', 'Giáo trình 8K1 · Hệ hô hấp ở người & Hiệu suất phản ứng'),
  ('fba1826d-e07a-434e-82b6-679abf4a5a12'::uuid, '8K - Chất dư & Hiệu suất phản ứng', 'Giáo trình 8K1 · Chất dư & Hiệu suất phản ứng'),
  ('286a8969-f309-4223-9eae-56a4a112ff31'::uuid, '9K - Tái bản - Phiên mã - Dịch mã', 'Giáo trình 9K1 · Tái bản - Phiên mã - Dịch mã'),
  ('e33f3c2a-cc11-4945-b664-e77b1c399c6f'::uuid, '9K - Lăng kính & Alkene', 'Giáo trình 9K1 · Lăng kính & Alkene'),
  ('dc49ef0a-dc70-49bb-a626-dbdf00209e3c'::uuid, '9K - Alkane & Alkene', 'Giáo trình 9K1 · Alkane & Alkene'),
  ('278f6d8b-548d-4b83-8398-e54d04f5d907'::uuid, '9K - Alkane', 'Giáo trình 9K2 · Alkane'),
  ('aea44d0e-9083-4d17-933c-ae7d0419e32d'::uuid, 'Giáo trình Đại - 10B', 'Giáo trình 10B1'),
  ('c2043881-8936-4a7c-96ad-0d521e903b23'::uuid, 'Giáo trình 10Btest', 'Giáo trình 10B1 · test'),
  ('25468e3c-afa4-4854-9870-f4d94e4477e8'::uuid, 'Giáo trình Hình giải tích - 10B', 'Giáo trình 10B1'),
  ('beefd8d8-e366-4ab9-8ba1-d529cec7281f'::uuid, 'Giáo trình 11A', 'Giáo trình 11A1'),
  ('66ac13c1-0619-47a4-9abc-404d6cfb71bb'::uuid, 'Giáo trình hình 11A1', 'Giáo trình 11A1'),
  ('46b4152c-6df1-4c41-ac58-ea3b7bee994e'::uuid, 'Giáo trình 11B1_Hình', 'Giáo trình 11B1'),
  ('b9507d3e-c89c-4a39-9a9c-93de80efa2e1'::uuid, 'Giáo trình 11F', 'Giáo trình 11F1'),
  ('eb9c7ece-cded-477f-8a20-89876b0da711'::uuid, '12A1', 'Giáo trình 12A1'),
  ('b47e2221-e8c4-40d8-90af-28a16742c2a7'::uuid, 'Giáo trình Đại số 12B1', 'Giáo trình 12B1'),
  ('33f1d5f9-10f6-436a-9bd2-a2cf3fbf5402'::uuid, 'Giáo trình hình giải tích 12B1', 'Giáo trình 12B1'),
  ('b68cd3e8-df42-46e3-abb1-7759f28ced88'::uuid, 'Giáo trình 4A', 'Giáo trình 4A1'),
  ('a9a56703-6c3c-4b50-9139-c02fcb248fcc'::uuid, '5T1', 'Giáo trình 5T1'),
  ('5bb5ca3b-f627-469c-93ac-4e61922e4066'::uuid, 'Giáo trình 6A1_Đại số', 'Giáo trình 6A1'),
  ('c76818de-67a0-4f0d-ba4e-901726cb00a8'::uuid, '6S1', 'Giáo trình 6S1'),
  ('d65743c5-ffaf-4ef5-89ce-8c6fa8fcad2d'::uuid, 'Giáo trình 7B1_Hình', 'Giáo trình 7B1'),
  ('fdf743bf-cf5d-4134-acaa-143401df50f6'::uuid, '7S1', 'Giáo trình 7S1'),
  ('33c9997a-b7e4-47d4-b470-63dfd693065e'::uuid, 'Giáo trình 7S3_Đại', 'Giáo trình 7S3'),
  ('fb939275-652d-4b15-af02-a3c8240d8159'::uuid, 'Giáo trình 7S3_Hình', 'Giáo trình 7S3'),
  ('69fda145-7343-4b59-96e7-c6171c5ba487'::uuid, 'Giáo trình 8A2_Đại số', 'Giáo trình 8A2'),
  ('2c83763c-1c53-49cf-95ad-e4d45515717e'::uuid, 'Giáo trình 8A2_Hình', 'Giáo trình 8A2'),
  ('f50f878e-133c-48fd-95af-eeb3e0e773ad'::uuid, 'Giáo trình 8B1_Hình', 'Giáo trình 8B1'),
  ('6141f722-ed07-4b6d-8f72-78c111e04841'::uuid, 'Giáo trình 8B2_Đại số', 'Giáo trình 8B2'),
  ('96942e3c-c613-4b7e-b2c1-830fd3adcf72'::uuid, 'Giáo trình 8B2_Hình', 'Giáo trình 8B2'),
  ('50393981-e9bf-4a37-b0fe-bc92d1545d55'::uuid, '8S1', 'Giáo trình 8S1'),
  ('e3e2f784-86ce-46a8-8ac2-ecbc141dd316'::uuid, 'Giáo trình 9B1 - Đại.', 'Giáo trình 9B1'),
  ('2d62b4d1-ca21-48e7-b928-d85d53b0c0ce'::uuid, 'Giáo trình 9B2_Hình', 'Giáo trình 9B2'),
  ('3ddbd835-4b0c-4389-82a9-9d13ee734583'::uuid, 'Giáo trình 9C1_Hình', 'Giáo trình 9C1')
  ) v(id, cu, moi)
 where t.id = v.id and t.loai = 'giao_trinh' and t.ten = v.cu;
