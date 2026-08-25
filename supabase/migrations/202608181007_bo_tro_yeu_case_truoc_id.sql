-- ============================================================================
-- 202608181007 — bo_tro_yeu_case_truoc_id
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Nền cho bước "Đánh giá hiệu suất" (`PLAN-botro-yeu.md` §12, Thùy chốt 08-18): sau khi đánh
--   giá 1 đợt bổ trợ, người duyệt chọn 1 trong 5 hành vi tiếp theo — 3/5 (xuống mức thấp hơn /
--   đổi người cùng mức / nâng mức GV cao cấp) đều phải MỞ ĐỢT MỚI, vì `bo_tro_yeu` chỉ cho 1 đợt
--   "dang_xu" mỗi (hoc_sinh_id, mon) — đợt cũ đã `hoan_thanh` mới mở được đợt tiếp theo.
--   Không có cột nối thì màn Đánh giá hiệu suất KHÔNG biết "HS này đã bổ trợ 2 lần rồi mới đổi
--   GV" — mất lịch sử leo thang, mỗi đợt trông như lần đầu tiên.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG MẤT GÌ. Chỉ 1 ADD COLUMN nullable, không đụng dòng dữ liệu nào đang có (bảng đang 0 dòng).
-- ============================================================================

-- NULL = đợt ĐẦU TIÊN của (hoc_sinh_id, mon) — "không áp dụng", đúng vai NULL cho phép (CLAUDE.md
-- §1.5). Tự tham chiếu cùng bảng, cascade RESTRICT ngầm định (không cho xoá đợt trước khi còn đợt
-- sau trỏ tới — muốn xoá đợt cũ phải xử đợt mới trước, đúng tinh thần "xoá lá trước gốc" §2).
alter table bo_tro_yeu add column if not exists case_truoc_id uuid references bo_tro_yeu(id);

-- Tra chuỗi đợt theo 1 HS+môn (đọc "đã bổ trợ mấy lần") — không cần join ngược từ đầu mỗi lần.
create index if not exists bo_tro_yeu_case_truoc_idx on bo_tro_yeu (case_truoc_id) where case_truoc_id is not null;
