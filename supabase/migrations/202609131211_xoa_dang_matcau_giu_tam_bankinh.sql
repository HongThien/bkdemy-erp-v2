-- ============================================================================
-- 202609131211 — xoa_dang_matcau_giu_tam_bankinh
-- ----------------------------------------------------------------------------
-- VÌ SAO: CEO (Thùy) chốt 13/09 dọn chuyên đề "Phương trình Mặt cầu" (T3120103,
-- HGT K12) — chỉ giữ dạng cơ bản T312010301 (Xác định tâm - bán kính - nhận
-- biết PTMC, 36 câu); các dạng con còn lại đưa ra khỏi bản đồ. Phần "mô hình
-- thực tế" (T312010309) không thuộc phương trình mặt cầu mà thuộc chuyên đề
-- "Các mô hình toán thực tế" (T3120108, đã có sẵn T312010803 "Mô hình thực
-- tế ứng dụng tính chất mặt cầu") — chuyển 34 câu về đó.
--
-- MẤT GÌ (Luật xoá — CEO gật 13/09 qua chat):
--   - XÓA CỨNG 30 câu hỏi trong hgt_cau_hoi (dang_chinh ∈ 7 dạng bị bỏ):
--       T312010302 (8),  T312010303 (3), T312010304 (1), T312010305 (3),
--       T312010306 (10), T312010307 (2), T312010308 (3).
--     Đã kiểm không có ref nào tới ma_cau của 30 câu này từ mọi bảng có
--     thể ref (hgt_cau_hoi_yeu_cau_giai, gami_session_problems, bai_test_cau,
--     ca_test_cau, hgt_cau_hoi.parent_ma_cau) — an toàn xóa cứng.
--   - XÓA 8 dòng hgt_ban_do: T312010302..309 (T312010309 xóa sau khi câu
--     đã re-point).
--   - Đã kiểm không có cụm bài (hgt_cum_bai), lý thuyết (hgt_dang_ly_thuyet),
--     tiền đề, thuộc tính, đo lường (bt_grades/canh_bao_yeu/bo_tro_*/buoi_*/
--     tu_luyen_*), đề test (bai_test_cau/ca_test_cau) nào tham chiếu bất kỳ
--     dạng nào trong T312010302..309 — sạch.
--   - CHUYỂN 34 câu T312010309 → T312010803 (UPDATE dang_chinh, không xóa).
--     GIỮ T312010301 (36 câu) nguyên — chuyên đề T3120103 vẫn còn 1 dạng con.
--   - 25 mệnh đề trong hgt_cau_menh_de (bảng mới cho câu đúng-sai) tag dạng
--     bị bỏ: 13 mệnh đề tag T312010309 → chuyển sang T312010803 theo tinh
--     thần chuyển; 12 mệnh đề tag T312010302..308 (tất cả thuộc câu cha
--     T312010301) → re-point về T312010301 (mất tag mastery riêng, mastery
--     theo câu cha). FK dang_chinh_fkey là RESTRICT nên phải xử trước xóa.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

-- 1) Chuyển 34 câu T312010309 → T312010803 (dạng "Mô hình thực tế mặt cầu" ở
--    chuyên đề Các mô hình toán thực tế). Chuyển TRƯỚC khi xóa dạng 309.
update hgt_cau_hoi set dang_chinh = 'T312010803' where dang_chinh = 'T312010309';

-- 2) Xử mệnh đề tag các dạng bị bỏ (FK RESTRICT — không re-point là xóa ban_do fail).
--    2a) 13 mệnh đề tag T312010309 → T312010803 (theo tinh thần chuyển).
update hgt_cau_menh_de set dang_chinh = 'T312010803' where dang_chinh = 'T312010309';
--    2b) 12 mệnh đề tag T312010302..308 → dạng của câu cha (mất tag mastery riêng).
--        Tất cả câu cha là T312010301 hoặc T312010101 (đã verify) — dùng UPDATE FROM.
update hgt_cau_menh_de md
   set dang_chinh = ch.dang_chinh
  from hgt_cau_hoi ch
 where md.ma_cau_cha = ch.ma_cau
   and md.dang_chinh in ('T312010302','T312010303','T312010304','T312010305','T312010306','T312010307','T312010308');

-- 3) Xóa cứng 30 câu hỏi thuộc 7 dạng bị bỏ. FK ma_cau_cha_fkey là CASCADE
--    nên mệnh đề nào của các câu này (nếu có) sẽ tự xóa theo — nhưng đã verify
--    30 câu này KHÔNG có mệnh đề nào.
delete from hgt_cau_hoi where dang_chinh in
  ('T312010302','T312010303','T312010304','T312010305','T312010306','T312010307','T312010308');

-- 4) Xóa 8 dòng dạng khỏi hgt_ban_do (302..308 vừa mất câu, 309 vừa re-point sang 803).
delete from hgt_ban_do where ma_dang in
  ('T312010302','T312010303','T312010304','T312010305','T312010306','T312010307','T312010308','T312010309');
