-- ============================================================================
-- 202608191014 — troly_cong_cu_tra_cuu
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 18/08: trợ lý cần thêm "Phần 1 — Query": thay vì click dashboard, hỏi thẳng AI
--   và nó tự tra DB trả kết quả. Nhưng CODE tính (đã đúc kết đau — RLS/quyền) buộc câu
--   query PHẢI chạy ở CLIENT dưới đúng session người hỏi (bị RLS lọc như mọi màn khác),
--   KHÔNG chạy ở worker (worker dùng SUPABASE_SERVICE_ROLE — bỏ qua RLS hoàn toàn, cho nó
--   tự trả data là tự đục lỗ hổng xuyên qua đúng công siết quyền vừa làm sáng nay).
--
--   ⇒ Model KHÔNG tự query. Model chỉ CHỌN 1 trong bộ "công cụ" định sẵn + điền tham số
--   (an toàn, dễ audit — CEO chốt "phase đầu ít câu hỏi, câu bất kỳ để phase sau"). Worker
--   ghi lại lựa chọn đó vào chính job cũ (`troly_hoi_dap`, KHÔNG bảng mới — vẫn 1 luồng
--   hỏi–đáp), CLIENT đọc job, thấy có `cong_cu` thì tự chạy đúng hàm data-layer sẵn có
--   (qua supabase client bình thường, tự bị RLS lọc) rồi hiển thị — KHÔNG gửi lại cho model
--   (đỡ tốn thêm 1 lượt gọi, và tránh model "diễn giải lại" số liệu đã đúng sẵn).
--
--   Job KHÔNG tool-call (câu hỏi kiểu tư vấn cũ) thì `cong_cu`/`tham_so` = NULL như trước —
--   không đổi hành vi cũ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất gì. Chỉ thêm 2 cột nullable vào bảng đang có, không đụng dữ liệu/cột cũ.
-- ============================================================================

alter table troly_hoi_dap add column if not exists cong_cu text;
alter table troly_hoi_dap add column if not exists tham_so jsonb;

comment on column troly_hoi_dap.cong_cu is
  'Tên công cụ tra cứu model chọn (NULL = câu tư vấn thường, trả lời qua tra_loi như cũ). Client đọc cột này để tự chạy đúng hàm data-layer.';
comment on column troly_hoi_dap.tham_so is
  'Tham số model điền cho công cụ đã chọn (vd {"ten_hoc_sinh":"Nguyễn Văn A","mon":"Toán"}) — CHỈ tên/nhãn thô lấy từ câu hỏi, client tự resolve ra id thật (đúng luật §2 "danh tính bám khoá tự nhiên", model không được tự đoán UUID).';
