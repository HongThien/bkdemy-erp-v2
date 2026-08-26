-- ============================================================================
-- 202608252045 — cau_hoi_duyet_noi_dung
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 20/08): "trong bản đồ kiến thức có rất rất nhiều câu hỏi. Có
--   những câu xịn có những câu thì không. Sau này còn liên tục đưa câu mới vào
--   kho nữa. Nên t muốn có thêm 1 nhãn riêng để xác định chất lượng: Đã kiểm
--   duyệt - Chưa kiểm duyệt. Clone xong phải có người check."
--
-- Mở rộng đúng khuôn ĐÃ CÓ trong hệ (không phát minh pattern mới):
--   · `hinh_y.da_duyet` — boolean tương tự đã tồn tại bên nhánh Hình (ý thật).
--   · `duyet_boi` + `duyet_at` — cặp cột dùng ở nhiều bảng khác (bai_test_report,
--     hoc_phi_xet_duyet, viec_van_hanh_duyet…) để GHI VẾT ai duyệt + lúc nào,
--     không chỉ 1 cờ boolean trơ (CLAUDE.md §4 "mọi đổi state phải ghi vết").
--
-- Phạm vi: 3 bảng câu hỏi CÓ AI clone/nhập hàng loạt — dai_cau_hoi, khtn_cau_hoi,
-- hgt_cau_hoi. KHÔNG đụng nhánh Hình (hinh_baitoan/hinh_cach_giai) đợt này —
-- workflow soạn tay khác hẳn (không clone AI hàng loạt), để riêng khi cần.
--
-- "Coi như tất cả các câu đều là chưa duyệt để duyệt lại" (Thùy) — DEFAULT false
-- tự áp cho MỌI dòng đang có (Postgres điền default cho cột NOT NULL mới thêm),
-- không cần UPDATE riêng.
--
-- MẤT GÌ: không. Thêm 3 cột mới cho mỗi bảng — không đổi/xoá gì đang có.
-- ============================================================================

alter table dai_cau_hoi add column if not exists da_duyet boolean not null default false;
alter table dai_cau_hoi add column if not exists duyet_boi uuid references nhan_su(id);
alter table dai_cau_hoi add column if not exists duyet_at timestamp with time zone;

alter table khtn_cau_hoi add column if not exists da_duyet boolean not null default false;
alter table khtn_cau_hoi add column if not exists duyet_boi uuid references nhan_su(id);
alter table khtn_cau_hoi add column if not exists duyet_at timestamp with time zone;

alter table hgt_cau_hoi add column if not exists da_duyet boolean not null default false;
alter table hgt_cau_hoi add column if not exists duyet_boi uuid references nhan_su(id);
alter table hgt_cau_hoi add column if not exists duyet_at timestamp with time zone;
