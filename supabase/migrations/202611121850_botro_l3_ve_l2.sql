-- ============================================================================
-- 202611121850 — botro_l3_ve_l2 — chuyển mọi em L3 về L2 (dữ liệu thật)
-- VÌ SAO (Thùy 12/11, nguyên văn): "L3 mới là 4 đơn vị. Hiện tại tất cả các ca bổ trợ đều tính là L2 nhé".
--   Thang giữ nguyên (L2 = 2 đơn vị · L3 = 4). Hiện tại mọi em bổ trợ KHỐI đang L3 (gồm em bị dời 2→3 lúc đổi thang L1–L4, mig 202611111553)
--   chuyển về L2. L1 (sau giờ) · L4 (riêng GV) KHÔNG đổi.
--   · hs_level kien_thuc 3 → 2, mỗi em 1 dòng hs_level_log (cũ 3 → mới 2, lý do + nguồn; actor trống vì chạy migration — người quyết ghi trong lý do).
--   · bo_tro_de_xuat L3 đã duyệt (đề xuất MỚI NHẤT của em) muc 3 → 2, nối ghi chú; trigger trg_bo_tro_de_xuat_log tự ghi vết.
--   · buổi ca khối CHƯA học (mở, chưa đánh giá xong) của các em đó đang tính 4 đơn vị → 2. Buổi đã học giữ số cũ (lịch sử).
--   Đo lúc viết: 14 em (K4 2 · K4T 1 · K5 3 · K7 5 · K8 2 · K9 1; 11 em có case mở) · 11 đề xuất · 1 buổi (Phương Chi 18/11).
-- MẤT GÌ (Luật xoá): không xoá dòng nào. Ghi đè: hs_level.level (vết ở hs_level_log), bo_tro_de_xuat.muc (vết ở log trigger),
--   buoi_hoc_hs.don_vi của buổi chưa học (4 → 2).
-- ============================================================================
create temp table _l3 on commit drop as
  select hoc_sinh_id, mon from hs_level where loai = 'kien_thuc' and level = 3;

insert into hs_level_log (hoc_sinh_id, mon, loai, level_cu, level_may_de_xuat, ly_do_may, level_chot, ly_do_nguoi, actor)
select hoc_sinh_id, mon, 'kien_thuc', 3, null, jsonb_build_object('nguon', 'thang_l2_hien_tai_12_11'), 2,
       'Thùy 12/11: hiện tại mọi ca bổ trợ khối tính L2 (2 đơn vị) — chuyển L3 → L2', null
  from _l3;

update hs_level l set level = 2, updated_at = now()
  from _l3 x where l.hoc_sinh_id = x.hoc_sinh_id and l.mon = x.mon and l.loai = 'kien_thuc' and l.level = 3;

update bo_tro_de_xuat d set muc = 2, updated_at = now(),
       ghi_chu = d.ghi_chu || case when d.ghi_chu <> '' then ' · ' else '' end || '12/11: L3 → L2 (Thùy: hiện tại mọi ca khối tính L2)'
  from _l3 x
 where d.hoc_sinh_id = x.hoc_sinh_id and d.mon = x.mon and d.muc = 3 and d.trang_thai = 'da_duyet'
   and d.tao_at = (select max(d2.tao_at) from bo_tro_de_xuat d2 where d2.hoc_sinh_id = d.hoc_sinh_id and d2.mon = d.mon);

update buoi_hoc_hs hh set don_vi = 2
  from buoi_hoc b, ca_bo_tro c, _l3 x
 where b.id = hh.buoi_hoc_id and c.id = b.ca_bo_tro_id and hh.hoc_sinh_id = x.hoc_sinh_id and c.mon = x.mon
   and b.loai in ('bo_tro_yeu', 'bo_tro_hinh') and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.don_vi = 4;
