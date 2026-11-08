-- CÔNG TẮC "Chấm BTVN tự động" (CEO 08/11/2026): bật ⇒ app trợ giảng hiện nút 🤖 Chấm tự động; tắt ⇒ ẩn nút
-- ngay, KHÔNG cần deploy lại. Dùng bảng có sẵn he_thong_cong_tac (đọc: thành viên · đổi: admin qua
-- fn_he_thong_cong_tac_dat · mọi lần đổi tự ghi he_thong_cong_tac_log bằng trigger).
-- Tắt/bật: app ERP (admin) hoặc `node scripts/btvn-ai/cong-tac.mjs tat|bat`.
insert into he_thong_cong_tac (ma, bat, mo_ta)
values ('btvn_cham_tu_dong', true,
  'App trợ giảng: nút 🤖 Chấm BTVN tự động (TA đẩy ảnh → máy chấm gợi ý Đ/C/S → TA xác nhận). Tắt = ẩn nút, dữ liệu giữ nguyên.')
on conflict (ma) do nothing;
