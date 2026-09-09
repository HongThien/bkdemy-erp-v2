-- ============================================================================
-- 202608301848 — Trạng thái thông báo tự nhảy "Đã hoàn thành" khi thu đủ tiền.
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 30/08): PH nộp đủ tiền mà app vẫn không báo "Đã hoàn thành".
--   Cột `hoa_don.trang_thai_tb` (3 bước thông báo, mig 0079) thành code chết từ
--   khi tab Học phí tổng đổi sang card: toggle bar 3 bước bị bỏ, không code nào
--   set nữa — mọi hoá đơn kẹt ở 'thong_bao_1' vĩnh viễn. CEO chốt: KHÔNG cần
--   luồng gửi tin xác nhận cho PH, chỉ cần trạng thái tự đổi trên app.
-- CÁCH: theo §2.0 — suy ở DB, không suy ở client. Mở rộng chính trigger
--   fn_hoa_don_cap_nhat_trang_thai (mig 202608300221, chạy trên mỗi dòng
--   thanh_toan): thu đủ → trang_thai_tb = 'hoan_thanh' trong CÙNG transaction.
--   Chiều ngược (xoá/sửa dòng thu làm tụt khỏi da_thu): đang 'hoan_thanh' thì
--   quay về 'cho_xu_ly' nếu đã báo lần 1, chưa báo thì về 'thong_bao_1' —
--   không để hoá đơn chưa thu đủ mà vẫn treo "Đã hoàn thành".
--
-- MẤT GÌ (Luật xoá): KHÔNG mất dữ liệu. Replace function + 1 UPDATE backfill
--   trang_thai_tb cho hoá đơn ĐÃ thu đủ / miễn từ trước (giá trị cũ đều là
--   default 'thong_bao_1' chết — không ai set tay từ khi bỏ toggle bar).
-- ============================================================================

create or replace function public.fn_hoa_don_cap_nhat_trang_thai() returns trigger
language plpgsql as $$
declare
  v_hoa_don uuid := coalesce(new.hoa_don_id, old.hoa_don_id);
  v_da_thu numeric;
  v_tong numeric;
  v_du boolean;
begin
  select coalesce(sum(so_tien), 0) into v_da_thu from thanh_toan where hoa_don_id = v_hoa_don;
  select tong_tien into v_tong from hoa_don where id = v_hoa_don;
  v_du := v_da_thu >= v_tong;
  update hoa_don set
    trang_thai = case
      when v_du then 'da_thu'
      when v_da_thu > 0 then 'thu_mot_phan'
      else 'chua_thu' end,
    trang_thai_tb = case
      when v_du then 'hoan_thanh'
      when trang_thai_tb = 'hoan_thanh' then
        case when bao_lan1_at is not null then 'cho_xu_ly' else 'thong_bao_1' end
      else trang_thai_tb end
  where id = v_hoa_don and trang_thai <> 'mien'; -- miễn thì đứng yên (như cũ — hoá đơn miễn không ai ghi thanh toán)
  return coalesce(new, old);
end $$;
-- Trigger tg_thanh_toan_trang_thai (mig 202608300221) đã trỏ sẵn vào function này — không cần tạo lại.

-- Backfill 1 lần: hoá đơn đã thu đủ (hoặc miễn — không còn gì phải thu/báo)
-- từ trước migration này cũng phải hiện "Đã hoàn thành".
update hoa_don set trang_thai_tb = 'hoan_thanh'
where trang_thai in ('da_thu', 'mien') and trang_thai_tb <> 'hoan_thanh';
