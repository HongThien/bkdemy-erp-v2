-- ============================================================================
-- phien_bo_chi_muc_mot_phien_ban_do
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 "trưởng khối phải có đủ mọi quyền… sao m cứ chặn này chặn kia". Mig 202611051726 đã bỏ chốt
--   "mỗi bản đồ một phiên" ở hàm; còn 2 chỉ mục duy nhất giữ đúng chốt đó ở bảng claude_phien ⇒ trưởng khối đang mở
--   một phiên Bản đồ / Lý thuyết thì không mở thêm được (đo 05/11: anh Hải khối 9 bị chặn chính phiên của mình).
-- MẤT GÌ (Luật xoá — Thùy gật trước khi áp): đúng 2 CHỈ MỤC, không mất dòng dữ liệu nào:
--   · claude_phien_ban_do_mot_idx      UNIQUE (mon, khoi) WHERE loai = 'ban_do' AND trang_thai <> 'dong'
--   · claude_phien_sua_ban_do_mot_idx  UNIQUE (mon, khoi) WHERE loai IN ('ban_do','ly_thuyet') AND trang_thai <> 'dong'
--   Chỉ mục thường claude_phien_khoi_idx (mon, khoi, updated_at) GIỮ — đủ cho tra cứu.
-- ============================================================================
drop index if exists public.claude_phien_ban_do_mot_idx;
drop index if exists public.claude_phien_sua_ban_do_mot_idx;
