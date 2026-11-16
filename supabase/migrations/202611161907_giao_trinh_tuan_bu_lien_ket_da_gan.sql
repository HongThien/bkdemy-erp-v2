-- ============================================================================
-- 202611161907 — giao_trinh_tuan_bu_lien_ket_da_gan
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Trigger trg_gtt_theo_ngay_day (mig 202611161747) đẻ liên kết ca ⇄ buổi cho MỌI lượt gán ngày dạy từ 17:47 16/11 trở đi. Các lượt gán
--   TRƯỚC đó (kể cả gán sớm cho ngày trong tuần 16–22/11) chưa có liên kết ⇒ màn Giáo trình tuần báo nhầm "ngày dạy gán buổi khác" và
--   đề xuất (mig 202611161902) không biết buổi đó đã dùng ở ca nào. Bù đúng việc trigger sẽ làm, cho lượt gán có ngày từ 16/11:
--   buổi của giáo trình CỦA LỚP (cùng luật _gtt_ca_kiem), mỗi buổi lấy lượt gán ngày muộn nhất; ca / buổi đã có liên kết ⇒ bỏ qua.
--   Đo 16/11 19:07: 32 lượt gán hợp lệ, 28 sẽ thêm, 0 xung đột.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Chỉ thêm dòng gtt_ca (có vết ở gtt_ca_log qua trigger).
-- ============================================================================

insert into gtt_ca (lop_id, ngay, buoi_id, mon)
select d.lop_id, d.ngay, d.buoi, d.mon
  from (select distinct on (x.nguon_buoi) x.lop_id, x.ngay, x.nguon_buoi::uuid as buoi, l.mon
          from tai_lieu x
          join tai_lieu_phan p on p.id::text = x.nguon_buoi and p.loai_phan = 'buoi'
          join tai_lieu t on t.id = p.tai_lieu_id and t.loai = 'giao_trinh' and t.lop_id = x.lop_id
          join lop l on l.id = x.lop_id and l.mon = t.mon
         where x.loai = 'giao_trinh_buoi' and x.hoc_sinh_id is null and x.ngay >= date '2026-11-16'
           and x.nguon_buoi ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
         order by x.nguon_buoi, x.ngay desc) d
 where not exists (select 1 from gtt_ca g where g.lop_id = d.lop_id and g.ngay = d.ngay)
   and not exists (select 1 from gtt_ca g where g.buoi_id = d.buoi)
on conflict do nothing;
