-- ============================================================================
-- 0071 — Fix bug hệ thống: HS chuyển trang_thai='nghi' KHÔNG tự rời lớp.
-- ----------------------------------------------------------------------------
-- Phát hiện khi provision tài khoản test online: 2 HS trang_thai='nghi' vẫn có
-- hoc_sinh_lop.trang_thai='dang_hoc' (mâu thuẫn — "đã nghỉ hẳn" nhưng vẫn đang học lớp).
-- Đúng CLAUDE.md §4: đổi state phải ghi vết + invariant tự đúng qua TRIGGER DB,
-- KHÔNG dựa app tự nhớ gọi rời-lớp. `roi_lop` (nhansu.ts) đã có sẵn cho luồng
-- người bấm rời lớp thủ công — trigger này chỉ lo NHÁNH "nghỉ hẳn" tự động.
-- CHỈ áp cho 'nghi' (nghỉ hẳn) — KHÔNG áp 'bao_luu' (tạm nghỉ giữ chỗ, giữ ghi danh).
-- ============================================================================
create or replace function public.hs_nghi_tu_roi_lop() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.trang_thai = 'nghi' and old.trang_thai <> 'nghi' then
    update hoc_sinh_lop
       set trang_thai = 'da_roi',
           ngay_roi = (now() at time zone 'Asia/Ho_Chi_Minh')::date
     where hoc_sinh_id = new.id and trang_thai = 'dang_hoc';
    -- UPDATE trên đẻ trigger log_hoc_sinh_lop (0028) tự ghi vết 'roi_lop' — không log lại ở đây.
  end if;
  return new;
end $$;

drop trigger if exists trg_hs_nghi_tu_roi_lop on hoc_sinh;
create trigger trg_hs_nghi_tu_roi_lop after update on hoc_sinh
  for each row execute function public.hs_nghi_tu_roi_lop();

-- ── Backfill data cũ đang mâu thuẫn (HS0505, HS0615 + bất kỳ ai khác cùng lỗi) ──
update hoc_sinh_lop hl
   set trang_thai = 'da_roi',
       ngay_roi = (now() at time zone 'Asia/Ho_Chi_Minh')::date
  from hoc_sinh hs
 where hs.id = hl.hoc_sinh_id and hs.trang_thai = 'nghi' and hl.trang_thai = 'dang_hoc';
