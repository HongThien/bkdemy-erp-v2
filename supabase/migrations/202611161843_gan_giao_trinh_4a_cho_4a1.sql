-- ============================================================================
-- 202611161843 — gan_giao_trinh_4a_cho_4a1
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/11 (xem màn Giáo trình tuần): "giáo trình 4A đang có là giáo trình của 4A1". Giáo trình bản đồ mới "Giáo trình 4A"
--   (b68cd3e8…) có lop_id rỗng ⇒ màn tuần báo 4A1 "chưa có giáo trình" (luật 1 giáo trình = 1 lớp, spec-giao-trinh-tuan §2).
--   Nhân chứng thứ hai (CLAUDE §2 "map lại quan hệ"): cả 5 lượt gán ngày dạy của giáo trình này đều cho 4A1 (đo 16/11 18:43).
--   Đo 16/11: đây là giáo trình bản đồ mới còn hiệu lực DUY NHẤT chưa gắn lớp.
--   Chặn: chỉ ghi khi vẫn chưa gắn lớp VÀ mọi lượt gán vẫn chỉ là 4A1 — lệch ⇒ không ghi gì. Không đổi tên.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Ghi 1 ô lop_id (đang rỗng) của 1 dòng tai_lieu.
-- ============================================================================

update tai_lieu t
   set lop_id = l.id
  from lop l
 where t.id = 'b68cd3e8-df42-46e3-abb1-7759f28ced88'
   and t.loai = 'giao_trinh' and t.lop_id is null
   and l.ten_lop = '4A1' and l.mon = t.mon and l.trang_thai = 'dang_hoc'
   and not exists (select 1 from tai_lieu b where b.nguon_id = t.id and b.loai = 'giao_trinh_buoi' and b.lop_id is distinct from l.id);
