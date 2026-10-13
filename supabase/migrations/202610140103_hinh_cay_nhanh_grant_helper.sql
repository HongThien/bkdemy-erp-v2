-- ============================================================================
-- 202610140103 — hinh_cay_nhanh_grant_helper
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   Mig 202610140048 / 202610140054 thu hồi EXECUTE của các hàm phụ `_hl_*` khỏi public/anon nhưng
--   KHÔNG cấp cho `authenticated`. Các hàm `fn_hl_*` chạy SECURITY INVOKER ⇒ gọi hàm phụ bằng quyền
--   NGƯỜI ĐĂNG NHẬP ⇒ "permission denied for function _hl_duong_mo_hinh" ngay khi mở màn Cây nhánh.
--   Test bằng script (role sở hữu) KHÔNG thấy lỗi này — chỉ lộ khi mở app bằng phiên đăng nhập thật.
--   Trigger `hinh_baitoan_gen_ma` / `hinh_mo_hinh_neo_chk` cũng chạy quyền người gọi và gọi các hàm này.
--
-- MẤT GÌ: không. Chỉ cấp EXECUTE cho authenticated (anon vẫn không có).
-- ============================================================================
grant execute on function _hl_cha_mo_hinh(uuid), _hl_duong_mo_hinh(uuid),
  _hl_dong_thu_tu(uuid), _hl_ket_qua(uuid, uuid) to authenticated;
