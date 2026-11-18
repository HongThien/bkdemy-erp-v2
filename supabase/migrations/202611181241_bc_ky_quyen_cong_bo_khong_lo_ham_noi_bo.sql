-- K1 (spec-kien-truc): hàm nội bộ (_…) không cấp cho client. Mig 202611181239 cấp _bc_ky_duoc_cong_bo cho authenticated vì trigger chạy quyền người gọi.
-- Sửa: trigger chạy quyền chủ (danh tính vẫn đọc từ jwt), thu quyền gọi hàm nội bộ. Hành vi không đổi.
alter function public._bao_cao_ph_ky_quyen_cong_bo() security definer;
revoke all on function public._bc_ky_duoc_cong_bo(uuid, text) from public, anon, authenticated;
