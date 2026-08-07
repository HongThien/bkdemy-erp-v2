-- ============================================================================
-- 202608071800 — Nghỉ học: lưu NGÀY NGHỈ + LÝ DO NGHỈ ở cấp học sinh.
-- ----------------------------------------------------------------------------
-- Yêu cầu CEO: khi đánh dấu HS "Nghỉ" cần popup nhập ngày nghỉ + lý do. HS học
-- nhiều lớp → "Nghỉ" = nghỉ hẳn = rời HẾT lớp (đã có trigger 0071 tự rời lớp);
-- rời TỪNG lớp (giữ học môn khác) vẫn dùng roi_lop thủ công ở EnrollBox.
-- 2 cột nullable = "KHÔNG áp dụng khi đang học" (đúng CLAUDE.md §1.5, không phải
-- "chưa đo") → hợp lệ để null.
-- ----------------------------------------------------------------------------
alter table hoc_sinh add column if not exists ngay_nghi  date;
alter table hoc_sinh add column if not exists ly_do_nghi text;

-- Trigger auto-rời-lớp (0071) cập nhật: ngày rời lớp = NGÀY NGHỈ chọn tay (nếu
-- có), fallback hôm nay giờ VN — để ngày nghỉ khớp giữa hồ sơ HS và lịch sử lớp.
-- (chỉ create-or-replace HÀM; trigger trg_hs_nghi_tu_roi_lop giữ nguyên attach.)
create or replace function public.hs_nghi_tu_roi_lop() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.trang_thai = 'nghi' and old.trang_thai <> 'nghi' then
    update hoc_sinh_lop
       set trang_thai = 'da_roi',
           ngay_roi = coalesce(new.ngay_nghi, (now() at time zone 'Asia/Ho_Chi_Minh')::date)
     where hoc_sinh_id = new.id and trang_thai = 'dang_hoc';
    -- UPDATE trên đẻ trigger log_hoc_sinh_lop (0028) tự ghi vết 'roi_lop'.
  end if;
  return new;
end $$;
