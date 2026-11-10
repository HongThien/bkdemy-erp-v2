-- ============================================================================
-- 202611102318 — ta_luong_lop_muc_trang_ap_tu_t10
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 10/11 "lương tháng 10 chưa tính theo đơn giá mới kìa": Trang đặt mức 11 lớp lúc 23:02–23:05 nhưng subtab mở
--   mặc định tháng 11 ⇒ các dòng thành "áp từ 11/2026", T10 vẫn mức khởi tạo. Thùy đã chốt lương T10 tính theo bảng này
--   ⇒ chép mức Trang đặt (dòng 11/2026) sang dòng 10/2026 của đúng lớp đó. Dòng 11/2026 giữ nguyên (cùng giá, vô hại).
-- MẤT GÌ (Luật xoá): không xoá gì. UPDATE muc + ghi_chu của ≤11 dòng ta_luong_lop tháng 10 (ghi vết ta_cong_log).
-- ============================================================================
do $$
declare v_n int;
begin
  update public.ta_luong_lop t10
     set muc = t11.muc,
         ghi_chu = 'Mức Trang đặt 10/11 (lúc đó màn ghi nhầm áp từ 11/2026) — Thùy: áp từ tháng 10'
    from public.ta_luong_lop t11
   where t11.lop_id = t10.lop_id and t11.hieu_luc_tu = date '2026-11-01' and t11.xoa_at is null
     and t10.hieu_luc_tu = date '2026-10-01' and t10.xoa_at is null
     and t11.tao_at::date = date '2026-11-10';
  get diagnostics v_n = row_count;
  if v_n <> 11 then raise exception 'Cập nhật % dòng, kỳ vọng 11 — dừng, kiểm lại', v_n; end if;
end $$;
