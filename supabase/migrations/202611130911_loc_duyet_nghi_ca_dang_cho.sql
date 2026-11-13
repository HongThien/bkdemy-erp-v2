-- ============================================================================
-- 202611130911 — loc_duyet_nghi_ca_dang_cho
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   LUẬT DUYỆT 13/11 (Thùy): câu chưa chắc ⇒ vào DANH SÁCH NGƯỜI KIỂM. Từ mig 202611130903 câu chưa chắc mang kiem_may='nghi',
--   nhưng bộ lọc 'nghi' của màn Duyệt loại câu ở DẠNG CHỜ (…000000) chưa gán dạng bài ⇒ câu chưa chắc vừa nhập (luôn ở dạng chờ,
--   bản đồ mới không đổi dang_chinh) KHÔNG hiện ở bộ lọc nghi, chỉ lẫn trong "Chưa phân dạng" (13/11: 3 câu Đại B001).
--   Bỏ điều kiện dạng chờ ở nhánh 'nghi': nghi là cờ NỘI DUNG, không phụ thuộc đã phân dạng chưa. Thẻ duyệt có sẵn chọn/nhận dạng
--   bài; câu chưa chọn dạng thì DB vẫn chặn duyệt (trg_chan_duyet_dang_cho) — không đổi.
--   Thân hàm dựng từ pg_get_functiondef bản đang chạy, chỉ sửa nhánh 'nghi'. Bản 2 tham số (_kho_loc_duyet_sql(text,text)) thay
--   chuỗi dạng chờ bên trong — nhánh nghi không còn chuỗi đó ⇒ không ảnh hưởng.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Mở rộng bộ lọc (thêm câu, không bớt).
-- ============================================================================

create or replace function public._kho_loc_duyet_sql(p_loc text)
 returns text
 language sql
 immutable
as $function$
  select case p_loc
    when 'cau_moi'    then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and not c.da_duyet and c.created_at >= public._kho_ngay_bat()$s$
    when 'moi'        then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and not c.da_duyet and c.nguon_giai = 'ai' and c.giai_method = 'claude_code'$s$
    when 'nghi'       then $s$c.loai_cau <> 'dung_sai' and c.kiem_may = 'nghi'$s$
    when 'khong_kiem' then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and c.kiem_may = 'khong_kiem_duoc'$s$
    when 'ton_dong'   then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and not c.da_duyet and c.nguon_giai = 'ai' and c.giai_method is null$s$
    when 'chua_dang'  then $s$c.loai_cau <> 'dung_sai' and public._kho_la_dang_cho(c.dang_chinh)$s$
    when 'dung_sai'   then $s$c.loai_cau = 'dung_sai' and not c.da_duyet$s$
  end
$function$;
