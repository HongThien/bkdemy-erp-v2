-- ============================================================================
-- 202610081433 — gay_de_xuat_bo_chu_chua_xong
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Máy quét ghi " (chưa xong)" vào mo_ta lúc task còn mở rồi đông cứng — task đóng sau đó vẫn hiện "(chưa xong)"
--   cạnh ghi chú "đóng lần đầu …" (thấy trên màn Gậy 08/10, vd Chấm BTVN 9B2 03/10). fn_gay_de_xuat_tinh_lai
--   (mig 202610081427) nay cập nhật cả mo_ta khi task đã có lần đóng đầu. Chỉ đụng đề xuất đang chờ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá): không có.
-- ============================================================================

create or replace function fn_gay_de_xuat_tinh_lai() returns jsonb
language plpgsql as $$
declare v_rut int; v_sua int;
begin
  update gay_de_xuat d set trang_thai = 'bo_qua', quyet_at = now(), nguoi_quyet = null,
         ly_do_bo_qua = 'Máy tự rút (CEO 08/10): lần đóng đầu ĐÚNG HẠN — trễ chỉ do mở lại rồi đóng lại (đã mở lại '
                        || x.so_mo_lai || ' lần)'
  from public.fn_viec_tien_do(array(
         select c.ref_key from gay_de_xuat c
         where c.trang_thai = 'cho' and c.nguon = 'vanhanh' and c.ref_key ~ '^vh:[0-9a-f-]{36}[|]')) x
  where x.ref_key = d.ref_key and d.trang_thai = 'cho' and x.han is not null and x.dong_dau is not null and x.tre_phut = 0;
  get diagnostics v_rut = row_count;

  update gay_de_xuat d set tre_phut = x.tre_phut, deadline_at = x.han,
         mo_ta = case when x.dong_dau is not null then replace(d.mo_ta, ' (chưa xong)', '') else d.mo_ta end
  from public.fn_viec_tien_do(array(
         select c.ref_key from gay_de_xuat c
         where c.trang_thai = 'cho' and c.nguon = 'vanhanh' and c.ref_key ~ '^vh:[0-9a-f-]{36}[|]')) x
  where x.ref_key = d.ref_key and d.trang_thai = 'cho' and x.han is not null and x.tre_phut > 0
    and (d.tre_phut is distinct from x.tre_phut or d.deadline_at is distinct from x.han
         or (x.dong_dau is not null and d.mo_ta like '% (chưa xong)'));
  get diagnostics v_sua = row_count;

  return jsonb_build_object('rut', v_rut, 'sua', v_sua);
end $$;

revoke execute on function fn_gay_de_xuat_tinh_lai() from public, anon;
grant execute on function fn_gay_de_xuat_tinh_lai() to authenticated;
