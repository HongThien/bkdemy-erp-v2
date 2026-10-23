-- ============================================================================
-- nt_xu_nhip_theo_ngay_choi — NHỊP XU NÔNG TRẠI ĐO Ở SERVER + TẠM BỎ BONUS MÙA ĐẦU (Thùy 23/10)
-- ----------------------------------------------------------------------------
-- (1) "Chốt ở SV" + "Áp trần 1 ngày 4 xu tránh rủi ro lỗi game":
--   xu "ra" (s.thang.ra) do game báo lên ⇒ trần ngày = 0 (không giới hạn) nghĩa là cả 20 xu của tháng có thể nhận trong NGÀY ĐẦU (client tự khai số).
--   fn_nt_xu_dong_bo đã có nhánh trần ngày: trần luỹ kế = least(xu_toi_da_thang, SỐ NGÀY CHƠI × xu_toi_da_ngay); SỐ NGÀY CHƠI đếm từ nt_gio_choi
--   (giây chơi do fn_nt_nhip ghi — server đo), ngày hợp lệ = ≥ xu_phut_toi_thieu phút. Đặt xu_toi_da_ngay = 4 ⇒ đủ 20 xu sau 5 ngày chơi; 1 ngày tối đa 4 xu.
--   Giới hạn giờ chơi 30 phút/ngày (gio_toi_da_phut) Thùy xác nhận 23/10 — giữ nguyên.
-- (2) "Tạm thời bỏ bonus 60%": bonus sản lượng MÙA ĐẦU (tháng 1 +60%, tháng 2 +30%) về 0. Game (js/data.js MUA[0].bonus) và SERVER phải KHỚP —
--   _nt_luat() giữ bản sao luật để fn_nt_ban_ds/giup/trom tính vườn bạn; sửa mua0Bonus [0.6,0.3] → [0,0]. KHÔI PHỤC: đặt lại '[0.6,0.3]' ở cả 2 nơi.
--   Áp migration NÀY TRƯỚC khi deploy bản game mới, nếu không vườn bạn tính còn bonus còn vườn mình thì không.
-- MẤT GÌ: không xoá gì. Xu đã nhận (nt_xu.da_nhan) giữ nguyên — hàm chỉ cộng phần chênh dương, không thu hồi. Hoàn tác (1): xu_toi_da_ngay = 0.
-- ============================================================================
update public.nt_cau_hinh set xu_toi_da_ngay = 4, updated_at = now() where id = 1;

create or replace function public._nt_luat() returns jsonb language sql immutable as $$
  select '{"tuoiThem":0.8,"bonThem":0.25,"sauTiLe":0.25,"sauTru":0.2,"tromToiDa":0.2,"tromMoiLan":1,"trom":3,"giup":5,"choDuoi":[0,0.2,0.4,0.6],"tcMoc":[20,50,100],"mua0Ngay":60,"mua0Bonus":[0,0]}'::jsonb
$$;
