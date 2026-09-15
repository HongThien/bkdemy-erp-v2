-- ============================================================================
-- ĐÓNG TOÀN BỘ CỜ "QUÁ HẠN" trên buoi_hoc — MỌI LỚP, MỌI loai — cho buổi ≤ 31/08/2026
-- (CEO 06/09: dọn nợ cũ, RESET quá trình làm việc sạch từ 01/09 trở đi).
-- Dán 1 lần vào Supabase SQL Editor. KHÔNG phải migration (thao tác DỮ LIỆU 1 lần).
-- ----------------------------------------------------------------------------
-- CÙNG KHUÔN với 2 script tiền lệ (sql_dong_danhgia_truoc_2308.sql,
-- sql_dong_task_8s0_12a1.sql) — mở rộng ra TOÀN BỘ lớp thay vì 2 lớp riêng lẻ.
-- CÁCH LÀM: chỉ SET các mốc *_dong_at đang NULL (task pure-derive → task tự biến
-- mất ở ERP + app TA + app GV, KHÔNG cần dọn gì thêm). KHÔNG gọi fn_dong_phase/
-- fn_dong_btvn → KHÔNG tính lại Elo/EXP cho các buổi này (đây là đóng HÀNH CHÍNH
-- cho gọn task list, không phải chấm lại điểm thật).
-- MỐC GHI = 23:00 giờ VN của NGÀY BUỔI (không phải now()) để fn_ta_dashboard /
-- fn_gv_dashboard không tính các buổi này là "đóng muộn" — không trừ oan hiệu
-- suất GV/TA vì dọn nợ cũ, không phải vì họ làm chậm.
-- PHẠM VI: mọi buổi (mọi loai: thuong/bu/bo_tro_yeu/bo_tro_duoi/mt), trạng thái
-- ≠ huỷ, ngày ≤ 31/08/2026. Buổi TỪ 01/09 trở đi KHÔNG đụng — đó là phần "reset,
-- theo dõi lại từ đầu" mà CEO muốn giữ nguyên áp lực hạn bình thường.
-- MẤT GÌ (Luật xoá): KHÔNG xoá gì — chỉ điền mốc đang NULL (coalesce giữ mốc thật
-- đã có, không ghi đè dữ liệu chấm/đánh giá có sẵn).
-- ⚠ CHẠY SAU migration 202609061907_mt_mien_et_danhgia_btvn.sql (buổi có gán MT nay
-- chỉ cần mt_dong_at để "hoàn tất" — script này gọi thẳng fn_buoi_recompute_hoan_tat
-- ở bước cuối thay vì lặp lại điều kiện tay, để LUÔN khớp đúng 1 nguồn chân lý §2.0).
-- ============================================================================

-- (Xem trước quy mô — chạy riêng nếu muốn kiểm tra trước khi đóng:)
-- select count(*) from buoi_hoc b
-- where b.trang_thai <> 'huy' and b.ngay <= '2026-08-31'
--   and (b.ingame_dong_at is null or b.et_dong_at is null or b.btvn_dong_at is null
--        or b.danh_gia_xong_at is null);

update buoi_hoc b
set ingame_dong_at   = coalesce(b.ingame_dong_at, ((b.ngay)::text || ' 23:00')::timestamp at time zone 'Asia/Ho_Chi_Minh'),
    et_dong_at       = coalesce(b.et_dong_at, ((b.ngay)::text || ' 23:00')::timestamp at time zone 'Asia/Ho_Chi_Minh'),
    btvn_dong_at     = coalesce(b.btvn_dong_at, ((b.ngay)::text || ' 23:00')::timestamp at time zone 'Asia/Ho_Chi_Minh'),
    danh_gia_xong_at = coalesce(b.danh_gia_xong_at, ((b.ngay)::text || ' 23:00')::timestamp at time zone 'Asia/Ho_Chi_Minh'),
    -- MT chỉ đóng khi buổi THẬT SỰ có gán MT (tai_lieu loai='mt_buoi' khớp lớp+ngày —
    -- ĐÚNG nguồn "có gán MT" dùng trong fn_buoi_recompute_hoan_tat sau migration trên).
    mt_dong_at = case when exists (select 1 from tai_lieu tl
                                   where tl.loai = 'mt_buoi' and tl.lop_id = b.lop_id and tl.ngay = b.ngay)
                      then coalesce(b.mt_dong_at, ((b.ngay)::text || ' 23:00')::timestamp at time zone 'Asia/Ho_Chi_Minh')
                      else b.mt_dong_at end,
    updated_at = now()
where b.trang_thai <> 'huy'
  and b.ngay <= '2026-08-31';

-- Nhãn "Hoàn tất": gọi thẳng hàm chính thức (buổi có MT → chỉ cần mt_dong_at; buổi
-- thường → cần đủ 4 mốc kia — logic sống Ở HÀM, script không lặp lại để khỏi lệch).
select public.fn_buoi_recompute_hoan_tat(b.id)
from buoi_hoc b
where b.trang_thai = 'mo' and b.ngay <= '2026-08-31';
