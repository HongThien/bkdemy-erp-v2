-- ============================================================================
-- 202610071540 — dtv_khoa_kho_bo_cau   (áp: `node scripts/migrate.mjs --only 202610071540_dtv_khoa_kho_bo_cau.sql` — CHỈ SAU KHI game bản mới (đề chấm ở máy chủ cho trận) đã DEPLOY)
-- ----------------------------------------------------------------------------
-- VÌ SAO: fn_dtv_kho_bo_cau trả kèm ĐÁP ÁN + lời giải cho bất kỳ ai gọi (anon) ⇒ lộ đáp án mọi câu kho (kể cả câu của đề Leo tháp/trận đã chấm ở máy chủ). Từ phase 2.1/2.2 mọi đường chơi
--   môn có kho đã đi qua đề máy chủ (fn_dtv_de_moi · fn_dtv_de_tran_moi — owner claude_build gọi nội bộ nên vẫn chạy được).
-- HỆ QUẢ: trận ONLINE 2 người / giải của môn có kho (Toán · KHTN) và khách chưa đăng nhập không còn lấy được câu ⇒ tạm không chơi được (Phase 2.4 — trọng tài ở máy chủ). Tiếng Anh không ảnh hưởng.
-- MẤT GÌ: không xoá dữ liệu — chỉ THU quyền execute của public/anon/authenticated trên 1 hàm (hoàn lại: grant execute ... to anon, authenticated).
-- ============================================================================
revoke execute on function public.fn_dtv_kho_bo_cau(text, text, text, integer, text, boolean) from public, anon, authenticated;
