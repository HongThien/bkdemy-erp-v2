-- ============================================================================
-- 202611231443 — btyeu_huy_buoi_dong_case_khong_quay_lai
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 23/11): mỗi em chỉ được xếp bổ trợ khối 1 LẦN / TUẦN, ở lượt chốt đầu tuần.
-- Em không đến, PH từ chối, hay trung tâm huỷ ca (TA nghỉ…) — MỌI huỷ đều mất lượt của tuần:
-- buổi huỷ, case ĐÓNG, KHÔNG quay lại "Cần xếp". Tuần sau trưởng khối chốt lại nếu em còn yếu.
-- Trước đây buổi huỷ chỉ làm case về "Cần xếp" (case vẫn dang_xu) ⇒ em bị xếp lại trong cùng tuần.
--
-- Mọi đường huỷ buổi bổ trợ yếu (TA đánh vắng · tự huỷ qua ngày không điểm danh · Lộc gỡ em ·
-- huỷ ca · xoá lịch khối · OPS huỷ tay · hạ L0) đều là UPDATE buoi_hoc.trang_thai='huy' ⇒ MỘT trigger ở đây,
-- không sửa từng hàm. Đóng bằng ket_qua='bo' (đã có trong CHECK; cùng khuôn _trg_btnhe_dong_case của Sau giờ)
-- + ghi_chu_dong bắt đầu bằng 'Ca huỷ —' làm dấu.
-- Mở lại buổi (TA bỏ điểm danh vắng nhầm: fn_btyeu_bo_diem_danh) ⇒ mở lại đúng case bị trigger này đóng.
-- Ngoại lệ: _btyeu_ket_thuc_case huỷ buổi chưa học rồi mới ghi day_xong ⇒ bỏ qua lý do 'Hết dạng yếu — …'.
--
-- MẤT GÌ: không xoá / thu hẹp gì. Chỉ thêm 1 hàm trigger + 1 trigger. KHÔNG sửa dòng cũ:
-- 14 case dang_xu đang có buổi huỷ mà không còn buổi sống (tới 23/11) giữ nguyên — đóng chúng là việc riêng, chờ Thùy.
-- ============================================================================

create or replace function public._trg_btyeu_huy_buoi_dong_case()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare v_ly text;
begin
  if new.loai is distinct from 'bo_tro_yeu' then return new; end if;

  if new.trang_thai = 'huy' and old.trang_thai is distinct from 'huy' then
    -- kết thúc case có chủ ý (đã tự ghi day_xong sau khi huỷ buổi chưa học)
    if new.ly_do_huy like 'Hết dạng yếu%' then return new; end if;
    v_ly := coalesce(nullif(new.ly_do_huy, ''), 'không rõ lý do');

    update bo_tro_yeu_dang d set dong_at = now()
      from buoi_hoc_hs hh
      where hh.buoi_hoc_id = new.id and d.bo_tro_yeu_id = hh.bo_tro_yeu_id and d.dong_at is null
        and exists (select 1 from bo_tro_yeu y where y.id = hh.bo_tro_yeu_id and y.trang_thai = 'dang_xu');

    update bo_tro_yeu y set trang_thai = 'hoan_thanh', hoan_thanh_at = now(), ket_qua = 'bo',
           dong_boi = public._btyeu_my_ns(),
           ghi_chu_dong = 'Ca huỷ — không quay lại Cần xếp trong tuần (1 lần / em / tuần): ' || v_ly
      from buoi_hoc_hs hh
      where hh.buoi_hoc_id = new.id and y.id = hh.bo_tro_yeu_id and y.trang_thai = 'dang_xu';

  elsif new.trang_thai = 'mo' and old.trang_thai = 'huy' then
    -- buổi mở lại (TA bỏ điểm danh vắng nhầm) ⇒ mở lại đúng case do huỷ này đóng (dạng đóng cùng một lúc)
    update bo_tro_yeu_dang d set dong_at = null
      from buoi_hoc_hs hh, bo_tro_yeu y
      where hh.buoi_hoc_id = new.id and y.id = hh.bo_tro_yeu_id and d.bo_tro_yeu_id = y.id
        and y.trang_thai = 'hoan_thanh' and y.ket_qua = 'bo' and y.ghi_chu_dong like 'Ca huỷ —%'
        and d.dong_at = y.hoan_thanh_at;

    update bo_tro_yeu y set trang_thai = 'dang_xu', hoan_thanh_at = null, ket_qua = null, dong_boi = null, ghi_chu_dong = null
      from buoi_hoc_hs hh
      where hh.buoi_hoc_id = new.id and y.id = hh.bo_tro_yeu_id
        and y.trang_thai = 'hoan_thanh' and y.ket_qua = 'bo' and y.ghi_chu_dong like 'Ca huỷ —%';
  end if;
  return new;
end $function$;

revoke all on function public._trg_btyeu_huy_buoi_dong_case() from public, anon, authenticated;

drop trigger if exists trg_btyeu_huy_buoi_dong_case on public.buoi_hoc;
create trigger trg_btyeu_huy_buoi_dong_case
  after update of trang_thai on public.buoi_hoc
  for each row
  when (new.loai = 'bo_tro_yeu' and new.trang_thai is distinct from old.trang_thai)
  execute function public._trg_btyeu_huy_buoi_dong_case();
