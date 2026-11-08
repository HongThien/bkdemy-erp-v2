-- ============================================================================
-- 202611081338 — hl_chuyen_bai_kho_mo_hinh
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 08/11 "Kho câu hình luyện cần có chức năng chuyển mô hình của các bài toán". Màn ③ Kho của mô hình (CayNhanh › TabKho)
--   thêm nút "↪ Chuyển mô hình" gọi lại hàm gán có sẵn fn_hl_gan_bai_mo_hinh (đổi hinh_bai.mo_hinh_id).
--   Lỗ hổng phải chặn trước: ý của bài (hinh_y.baitoan_id) có thể đã GÁN vào một bài của cây mô hình cũ. Đổi mô hình mà giữ liên kết
--   đó ⇒ bài nằm ở mô hình mới nhưng ý vẫn trỏ bài mô hình cũ (fn_hl_kho_cua_mo_hinh còn hiện chuỗi ở CẢ hai kho) — lệch âm thầm.
--   Không tự gỡ liên kết (gỡ gán = mất dữ liệu người đã gán, Luật xoá) ⇒ DB TỪ CHỐI, báo rõ người dùng gỡ gán các ý trước.
--   Gỡ khỏi mô hình (p_mo_hinh null) và gán vào ĐÚNG cây đang chứa các ý: giữ nguyên hành vi cũ.
--
-- MẤT GÌ (Luật xoá): Không mất gì — thêm 1 điều kiện chặn vào hàm gán.
-- ============================================================================

create or replace function public.fn_hl_gan_bai_mo_hinh(p_bai uuid, p_mo_hinh uuid)
 returns void
 language plpgsql
 set search_path to 'public'
as $function$
declare v_y text;
begin
  if not exists (select 1 from hinh_bai where id = p_bai) then raise exception 'Bài kho không tồn tại'; end if;
  if p_mo_hinh is not null and not exists (
       select 1 from hinh_mo_hinh where id = p_mo_hinh and phan = 'luyen' and neo_baitoan_id is null and la_mo_hinh) then
    raise exception 'Chỉ gán được vào mô hình LUYỆN (mô hình gốc, không phải nhánh)';
  end if;
  -- Ý đã gán vào bài của một cây KHÁC cây đích ⇒ chặn (xem VÌ SAO)
  if p_mo_hinh is not null then
    select string_agg(coalesce(y.nhan_hien_thi, y.ma_y), ', ' order by y.thu_tu) into v_y
      from hinh_y y join hinh_baitoan bt on bt.id = y.baitoan_id
     where y.bai_id = p_bai and fn_hl_goc_mo_hinh(bt.mo_hinh_id) is distinct from p_mo_hinh;
    if v_y is not null then
      raise exception 'Bài có ý (%) đã gán vào bài của mô hình khác — gỡ gán các ý đó trước rồi mới chuyển mô hình', v_y
        using errcode = 'P0001';
    end if;
  end if;
  update hinh_bai set mo_hinh_id = p_mo_hinh, updated_at = now() where id = p_bai;
end $function$;

revoke execute on function public.fn_hl_gan_bai_mo_hinh(uuid, uuid) from public, anon;
grant execute on function public.fn_hl_gan_bai_mo_hinh(uuid, uuid) to authenticated;
