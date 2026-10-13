-- ============================================================================
-- 202610131824 — nhan_su_erp_giao_dien
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 13/10: vỏ ERP mượn style của app Học sinh, và TỪNG NHÂN SỰ phải tự chọn được giao diện —
--   5 lựa chọn = đúng 5 style của app HS (Anime RPG · Khối vuông · Lo-fi chill · Đáng yêu · Tối giản),
--   kèm hình nền của style đó và chế độ sáng/tối nếu style có cả hai.
--   Lưu ở DB để lựa chọn đi theo TÀI KHOẢN qua mọi máy (cùng khuôn `menu_yeu_thich`, mig 202610131649).
--   Dạng: {"skin":"rpg","nen":"lau_dai","che_do":"toi"} — {} = chưa chọn ⇒ app dùng style mặc định.
--   CỐ Ý không đặt CHECK danh sách style: danh sách sống ở `skin/registry.ts` và còn thêm dần; app đọc
--   giá trị lạ (style đã bỏ, hình nền đã đổi tên) thì tự rơi về mặc định, không có đường nào ghi sai làm hỏng dữ liệu khác.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — chỉ THÊM 1 cột có default.
-- ============================================================================
alter table nhan_su
  add column if not exists erp_giao_dien jsonb not null default '{}'::jsonb;
comment on column nhan_su.erp_giao_dien is
  'Giao diện vỏ ERP người này chọn: {"skin","nen","che_do"} theo style app HS (skin/registry.ts). {} = mặc định.';
