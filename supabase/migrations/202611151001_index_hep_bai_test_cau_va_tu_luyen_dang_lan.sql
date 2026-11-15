-- ============================================================================
-- 202611151001 — index_hep_bai_test_cau_va_tu_luyen_dang_lan
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
-- ============================================================================

-- [15/11 · tối ưu] Hai INDEX HẸP (covering) cho hai bảng bị mở dòng rộng chỉ để lấy vài cột nhỏ.
--
-- Đo 15/11 (pg_statio + EXPLAIN BUFFERS, vai HS thật):
--   · bai_test_cau: heap 173 MB / 117 nghìn dòng (~1,5 KB/dòng: nguyên văn đề, lời giải, phương án…). Mọi đường đi từ bài làm của em
--     (bai_lam_cau.bai_test_cau_id → bai_test_cau.id) chỉ cần ma_cau / ma_dang / bai_test_id nhưng phải mở dòng rộng ⇒ mỗi câu em từng làm = 1 trang heap.
--     Một lượt "sinh bài tự luyện": 3.449 trang heap bai_test_cau, 719/934 trang ĐỌC ĐĨA là của bảng này; _hs_cau_lan_gap nguội 1,1 s.
--     fn_tu_luyen_sinh_tu_dong chiếm 32,8 % lượng đọc đĩa cộng dồn của cả DB, tu_luyen_chu_de_sinh 11,7 %.
--   · tu_luyen_dang_lan: _hs_cau_lan_gap đọc (ma_cau, tao_at) của một em ⇒ 140–290 trang heap rải rác theo thời gian.
-- Sau khi có index (cùng em, cùng lượt gọi): bai_test_cau heap 3.488 → 134 trang; tu_luyen_dang_lan chuyển sang Index Only Scan (152 → 44 trang);
--   lượt sinh bài: đọc đĩa 934 → 52–237 trang. Các đường khác tự hưởng (không sửa hàm nào): mastery, xếp hạng tỉ lệ đạt (A3), báo sai chờ duyệt,
--   43 hàm chỉ cần {id, bai_test_id, ma_cau, ma_dang, loai_cau, thu_tu}. Bảng bai_test_cau visibility map 100 % ⇒ Index Only Scan thật.
--
-- ⚠ Trên DB đang sống hai index này ĐÃ được tạo bằng CREATE INDEX CONCURRENTLY (không khoá ghi; 2,6 s + 0,9 s) lúc ~10:00 ngày 15/11, NGOÀI migrate.mjs
--   (CONCURRENTLY không chạy được trong giao dịch). File này để repo dựng lại được DB và để ghi sổ: trên DB sống nó không làm gì (if not exists).
--   Dựng DB mới từ repo thì bảng còn rỗng nên tạo thường là đủ.
-- Luật rút ra (spec-kien-truc §2): bảng có dòng RỘNG mà bị tra theo khoá để lấy vài cột hẹp ⇒ thêm index INCLUDE các cột đó, đừng để mọi lượt tra mở heap.

create index if not exists bai_test_cau_id_hep_idx
  on public.bai_test_cau (id) include (bai_test_id, ma_dang, ma_cau, loai_cau, thu_tu);

create index if not exists tu_luyen_dang_lan_hs_cau_idx
  on public.tu_luyen_dang_lan (hoc_sinh_id, ma_cau) include (tao_at);
