-- ============================================================================
-- bo_mac_dinh_toan_tai_lieu_bai_test
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 16/11 gật "Bỏ mặc định". tai_lieu và bai_test chứa dữ liệu học tập của MỌI môn; `mon default 'Toán'` nghĩa là chỗ chèn nào
--   quên môn thì tài liệu / bài test tự thành Toán, im lặng (§1.6). Dò 16/11 mọi đường chèn: 9 chỗ app (tailieu · tailieuBdm · mt ×2 · bt ·
--   detest · dethi · testonline) + 5 script ghi kho + mọi hàm DB chèn vào 2 bảng đều đã truyền môn ⇒ bỏ mặc định không làm hỏng đường nào;
--   từ nay chèn thiếu môn ⇒ Postgres báo lỗi NOT NULL ngay.
--   KHÔNG bỏ ở 13 bảng còn lại (để Thùy biết, ghi ở DEVLOG):
--     • 12 bảng kho chỉ của Toán (hinh_* ×9, kho_hinh_*, dai_cau_lop, bo_tro_hinh): cột mon là hằng số của kho (Hình học / Đại số thuộc Toán),
--       không thể gắn nhầm môn; 8 hàm DB + 6 chỗ app + script nhập kho đang chạy (kể cả worker ở worktree -auto) chèn dựa vào mặc định ⇒ bỏ là gãy
--       dây chuyền nhập kho mà không thêm an toàn nào.
--     • ung_vien: dữ liệu tuyển sinh (không phải học tập); web marketing ghi lead qua role web_lead_writer — bỏ mặc định có thể làm rơi lead.
--
-- MẤT GÌ (Luật xoá — Thùy đã gật): bỏ giá trị MẶC ĐỊNH 'Toán' của 2 cột tai_lieu.mon · bai_test.mon. Không mất dòng nào, không đổi dữ liệu nào.
-- ============================================================================
set local lock_timeout = '3s';   -- bảng app đang đọc: không xếp hàng chờ khoá lâu (lỗi thì chạy lại)
alter table public.tai_lieu alter column mon drop default;
alter table public.bai_test alter column mon drop default;
