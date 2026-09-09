-- ============================================================================
-- ĐÓNG KHÂU "ĐÁNH GIÁ SAU BUỔI" cho TOÀN BỘ buổi TRƯỚC 23/08/2026 — mọi lớp (CEO 31/08,
-- ngay sau khi app GV lên web: không bắt GV gánh nợ đánh giá tồn từ trước khi app chạy).
-- Dán 1 lần vào Supabase SQL Editor. KHÔNG phải migration (thao tác dữ liệu 1 lần).
-- ----------------------------------------------------------------------------
-- Cùng khuôn backfill với sql_dong_task_8s0_12a1.sql: CHỈ điền mốc danh_gia_xong_at
-- đang NULL (task pure-derive tự biến mất); mốc = 23:00 VN NGÀY BUỔI để fn_gv/ta_dashboard
-- không tính "đóng muộn" — mốc HÀNH CHÍNH, không phải dữ liệu đánh giá thật.
-- CHỈ đóng khâu ĐÁNH GIÁ — ingame/ET/BTVN trước 23/08 còn mở là nợ thật của TA, không đụng.
-- MẤT GÌ (Luật xoá): không xoá gì — chỉ điền mốc đang NULL.
-- ============================================================================

update buoi_hoc b
set danh_gia_xong_at = ((b.ngay)::text || ' 23:00')::timestamp at time zone 'Asia/Ho_Chi_Minh',
    updated_at = now()
where b.danh_gia_xong_at is null
  and b.trang_thai <> 'huy'
  and b.ngay < '2026-08-23';

-- Nhãn "Hoàn tất" cho buổi nào giờ đã đủ cả 4 mốc (+MT nếu có gán) — cùng luật recomputeHoanTat.
update buoi_hoc b
set trang_thai = 'hoan_tat', updated_at = now()
where b.trang_thai = 'mo'
  and b.ngay < '2026-08-23'
  and b.ingame_dong_at is not null and b.et_dong_at is not null
  and b.btvn_dong_at is not null and b.danh_gia_xong_at is not null
  and (b.mt_dong_at is not null or not exists (
        select 1 from gami_session_problems sp where sp.buoi_hoc_id = b.id and sp.phase = 'mt'));
