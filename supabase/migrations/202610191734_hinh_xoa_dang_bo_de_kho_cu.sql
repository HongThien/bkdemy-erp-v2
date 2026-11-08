-- HÌNH: xoá danh mục Dạng bài / Bổ đề cũ + cắt mọi liên hệ với kho cũ (Thùy 19/10: "hiện tại Dạng bài và bổ đề
-- không có tác dụng gì — xoá liên hệ kho cũ cho đỡ lằng nhằng"). Danh mục sẽ nhập lại từ đầu ở Bản đồ Hình mới
-- (nhãn của từng ý, mig 202610191644 / 202610191656).
-- Đã liệt kê cho Thùy duyệt TRƯỚC khi xoá (19/10): 15 dạng (K7: 1 · K8: 7 · K9: 7) · 5 bổ đề K8 · 7 dòng hinh_cach_bo_de ·
-- 15 cách giải kho cũ bỏ ô dang_id (lời giải giữ nguyên). DH.019 / DH.023 có ở canh_bao_yeu + bo_tro_yeu_dang (lịch sử,
-- tham chiếu chữ) — Thùy đồng ý xoá cứng, lịch sử đó chỉ còn mã. Lý thuyết / ví dụ / nhãn ý / đề xuất: 0 dòng lúc xoá.

-- 1) Kho cũ: cách giải → bổ đề, cách giải → dạng
delete from hinh_cach_bo_de;
update hinh_cach_giai set dang_id = null where dang_id is not null;

-- 2) Phụ thuộc của danh mục (lá → gốc; lúc viết đều 0 dòng, xoá cho chắc để FK không chặn)
delete from hinh_y_nhan_de_xuat;
delete from hinh_y_nhan_tu_choi;
delete from hinh_y_dang;
delete from hinh_y_bo_de;
delete from hinh_dang_ly_thuyet;
delete from hinh_dang_vi_du;
delete from hinh_bo_de_ly_thuyet;
delete from hinh_bo_de_vi_du;

-- 3) Danh mục: con trước cha
update hinh_dang set cha_id = null where cha_id is not null;
delete from hinh_dang;
delete from hinh_bo_de;
