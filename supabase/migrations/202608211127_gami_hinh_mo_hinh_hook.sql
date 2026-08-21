-- ============================================================================
-- 202608211127 — gami_hinh_mo_hinh_hook
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 21/08 — "đánh giá Hình học", chốt: mastery Hình = theo MÔ HÌNH, không phải dạng):
--   Hình (Euclid/mô-hình, builder `SoanTaiLieu.tsx`/`hinh_gt_bai`) hiện KHÔNG có đường chấm điểm nào —
--   builder đó 100% chỉ để in PDF, không đụng `gami_session_problems`. Cột hook cũ (`hinh_y_id` +
--   `ngu_canh_luot`, mig 202607242050) chỉ phủ được 1/3 loại pick ('y') và 0 UI gọi tới — không đủ để
--   nối ET/BTVN/MT vào giáo trình Hình thật (pick 'ghep' là CHUỖI nhiều node, không có 1 id chốt;
--   pick 'bienthe' trỏ `hinh_baitoan_bien_the`, không có cột nào để ghi).
--
--   Đơn vị chân lý mastery Hình = (Student × `hinh_baitoan_id`) — mỗi mô hình đo qua bài toán TRỰC TIẾP
--   gắn nó (`hinh_baitoan.mo_hinh_id`), KHÔNG tính mô hình con (Thùy chốt). `hinh_baitoan_id` là điểm
--   chung của CẢ 3 loại pick (ghep/bienthe/y đều resolve được về đúng 1 node) nên dùng làm khoá tự
--   nhiên để diff (CLAUDE.md §2 "danh tính bám khoá tự nhiên") — thay cho vị trí/problem_no.
--   `hinh_bien_the_id` đi kèm khi ô chấm từ 1 biến thể cụ thể (Thùy chốt: biến thể vẫn tính vào node
--   gốc qua `hinh_baitoan_id`, cột này chỉ để BIẾT chính xác đề nào đã ra, không đổi mastery).
--   `hinh_nhan` = nhãn đối chiếu người chấm nhìn thấy trên phiếu (Thùy: "Bài 5 ý c" → "5C") — SNAPSHOT
--   tại lúc sync (như `ma_dang`/`ma_cau` bên Đại), không tính lại mỗi lần hiển thị — tránh trôi nhãn
--   nếu sau này giáo trình đổi thứ tự pick.
--
-- MẤT GÌ: không mất gì — chỉ THÊM cột nullable + index. NULL = "không áp dụng" (buổi không phải Hình
--   mô-hình), KHÔNG phải "chưa đo" (CLAUDE.md §1.5). Không đụng/xoá `hinh_y_id`/`ngu_canh_luot` cũ.
-- ============================================================================

alter table gami_session_problems add column if not exists hinh_baitoan_id uuid references hinh_baitoan(id);
alter table gami_session_problems add column if not exists hinh_bien_the_id uuid references hinh_baitoan_bien_the(id);
alter table gami_session_problems add column if not exists hinh_nhan text;

create index if not exists gami_session_problems_hinh_baitoan_idx on gami_session_problems(hinh_baitoan_id)
  where hinh_baitoan_id is not null;
