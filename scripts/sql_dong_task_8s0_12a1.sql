-- ============================================================================
-- ĐÓNG TOÀN BỘ TASK của 2 lớp CHƯA VÀO QUY TRÌNH MỚI: 8S0 + 12A1 (CEO 31/08)
-- Dán 1 lần vào Supabase SQL Editor. KHÔNG phải migration (thao tác DỮ LIỆU 1 lần,
-- không đổi schema) — chạy lại được nếu 2 lớp này mở buổi mới mà vẫn chưa vào quy trình.
-- ----------------------------------------------------------------------------
-- CÁCH LÀM: chỉ SET các mốc *_dong_at (task engine pure-derive → task tự biến mất ở
-- ERP + app TA + app GV). KHÔNG gọi fn_dong_phase/fn_dong_btvn → KHÔNG tính Elo/EXP
-- (đúng ý: lớp chưa chạy quy trình, không phát sinh điểm số).
-- MỐC GHI = 23:00 GIỜ VN của NGÀY BUỔI (không phải now()): để fn_ta_dashboard /
-- fn_gv_dashboard KHÔNG tính các buổi này là "đóng muộn" — không trừ oan bar tháng
-- của GV/TA vì lớp chưa vào quy trình. (Đây là mốc HÀNH CHÍNH backfill, không phải
-- dữ liệu chấm thật — ghi rõ ở đây để sau này đọc lại không hiểu nhầm.)
-- PHẠM VI: buổi loai bất kỳ, trạng thái ≠ huỷ, ngày ≤ hôm nay (VN). Buổi TƯƠNG LAI
-- không đụng — mở buổi mới thì task lại sinh, chạy lại file này nếu cần.
-- MẤT GÌ (Luật xoá): không xoá gì — chỉ điền mốc đang NULL (coalesce giữ mốc đã có).
-- ============================================================================

-- (Xem trước số buổi sẽ bị đóng — chạy riêng nếu muốn kiểm tra:)
-- select l.ten_lop, count(*) from buoi_hoc b join lop l on l.id = b.lop_id
-- where l.ten_lop in ('8S0','12A1') and b.trang_thai <> 'huy'
--   and b.ngay <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
--   and (b.ingame_dong_at is null or b.et_dong_at is null or b.btvn_dong_at is null
--        or b.danh_gia_xong_at is null) group by l.ten_lop;

update buoi_hoc b
set ingame_dong_at   = coalesce(b.ingame_dong_at, moc.ts),
    et_dong_at       = coalesce(b.et_dong_at, moc.ts),
    btvn_dong_at     = coalesce(b.btvn_dong_at, moc.ts),
    danh_gia_xong_at = coalesce(b.danh_gia_xong_at, moc.ts),
    -- MT chỉ đóng khi buổi THẬT SỰ có gán MT (không có thì task MT vốn không sinh)
    mt_dong_at = case when exists (select 1 from gami_session_problems sp
                                   where sp.buoi_hoc_id = b.id and sp.phase = 'mt')
                      then coalesce(b.mt_dong_at, moc.ts) else b.mt_dong_at end,
    updated_at = now()
from lop l,
     lateral (select ((b.ngay)::text || ' 23:00')::timestamp at time zone 'Asia/Ho_Chi_Minh' as ts) moc
where l.id = b.lop_id
  and l.ten_lop in ('8S0', '12A1')
  and b.trang_thai <> 'huy'
  and b.ngay <= (now() at time zone 'Asia/Ho_Chi_Minh')::date;

-- Nhãn "Hoàn tất" cho buổi thường đã đủ mốc (cùng luật recomputeHoanTat: 4 mốc + MT-nếu-có).
update buoi_hoc b
set trang_thai = 'hoan_tat', updated_at = now()
from lop l
where l.id = b.lop_id
  and l.ten_lop in ('8S0', '12A1')
  and b.trang_thai = 'mo'
  and b.ngay <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
  and b.ingame_dong_at is not null and b.et_dong_at is not null
  and b.btvn_dong_at is not null and b.danh_gia_xong_at is not null
  and (b.mt_dong_at is not null or not exists (
        select 1 from gami_session_problems sp where sp.buoi_hoc_id = b.id and sp.phase = 'mt'));
