-- ============================================================================
-- 202608201107 — hgt_ban_do_mo_ta_ngan
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 17/08): "Trong chức năng nhập kho từ tài liệu, chưa có gán dạng
--   từ Hình giải tích". Đào ra 2 lỗi độc lập — đây là lỗi #2 (DB):
--   `listDangByChuDe()` (src/lib/kho/api.ts) select cột `mo_ta_ngan` trên bảng
--   bản đồ của MỌI nhánh (dùng chung 1 hàm qua khoTbls(mon)) — dai_ban_do và
--   khtn_ban_do đều có cột này, hgt_ban_do THIẾU. Khi mon='hgt', PostgREST trả
--   lỗi "column hgt_ban_do.mo_ta_ngan does not exist" → danh sách dạng rỗng →
--   AI/người không có gì để gán, chặn cứng "gán dạng" cho nhánh hgt dù code
--   backend (khoTbls/listChuDeOptions/listDangByChuDe/classifyDang) đã tổng
--   quát hoá đúng cho cả 3 nhánh từ trước (không phải thiếu code, chỉ thiếu cột).
--   Lỗi #1 (UI thiếu lựa chọn nhánh hgt trong màn Nhập kho) sửa ở
--   NhapKhoScreen.tsx cùng đợt, không cần migration.
--
-- MẤT GÌ: không. Thêm 1 cột nullable — không đổi/xoá gì đang có, không cần
-- backfill (mô tả ngắn vốn optional, dạng cũ để trống vẫn dùng bình thường).
-- ============================================================================

alter table hgt_ban_do add column if not exists mo_ta_ngan text;
