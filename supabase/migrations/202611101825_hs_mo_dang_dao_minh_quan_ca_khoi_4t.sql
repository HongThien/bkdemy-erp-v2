-- ============================================================================
-- hs_mo_dang_dao_minh_quan_ca_khoi_4t — MỞ TOÀN BỘ PHẠM VI KHỐI 4T cho Đào Minh Quân (Thùy 10/11)
-- ----------------------------------------------------------------------------
-- Thùy: "Mở phạm vi kiến thức của tài khoản Đào Minh Quân giống 4T. Minh Quân đang tạm nghỉ ở nhà mà hệ thống
--   chưa support việc đấy." — em báo không làm được bài trung bình cộng trên app.
-- Đo trước khi viết: em (HS0440) vẫn ở 4T1 'dang_hoc'; _hs_dang_da_hoc mở 77 mã (dạng lớp đã học + 4 dạng tổng hiệu mở riêng 23/10).
--   Bản đồ cũ: T14T130101/02 (TBC cơ bản) KHOÁ. Bản đồ mới: nhóm "Quan hệ của một số với TBC cả nhóm" (NDB01592–94) KHOÁ.
-- NAY: cộng vào hs_mo_dang MỌI dạng khối 4T còn sống — 83 dạng bản đồ cũ (dai_ban_do) + 104 dạng bài bản đồ mới (dai_bdm_*),
--   để dù màn nào dùng mã nào cũng mở. Dùng đúng đường mở riêng sẵn có (mig 202610231852), không đổi hàm nào.
-- Giới hạn: dạng thêm vào bản đồ 4T SAU lần này không tự mở cho em — chạy lại câu insert dưới (on conflict do nothing).
-- MẤT GÌ: không xoá gì. Chỉ thêm dòng hs_mo_dang của 1 em.
-- ============================================================================
insert into public.hs_mo_dang (hoc_sinh_id, mon, ma_dang, ly_do)
select '93b7bd66-afbc-4080-9bac-59cfac7d3587'::uuid, 'Toán', x.ma, 'Thùy 10/11: Đào Minh Quân tạm nghỉ học ở nhà — mở toàn bộ phạm vi khối 4T'
  from (
    select bd.ma_dang as ma from public.dai_ban_do bd
     where bd.khoi = '4T' and bd.xoa_at is null and bd.gop_vao is null
    union
    select db.id from public.dai_bdm_dang_bai db
      join public.dai_bdm_nhom n on n.id = db.nhom_id
      join public.dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where cd.khoi = '4T'
  ) x
on conflict do nothing;
