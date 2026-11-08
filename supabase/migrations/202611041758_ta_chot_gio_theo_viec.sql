-- ============================================================================
-- 202611041758 — ta_chot_gio_theo_viec
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 04/11 ("OK" nút "Chốt theo việc"): 6 ca quên checkout bị từ chối nhầm 28/10 vì ca chưa có giờ ra thì
--   không duyệt được, Trang phải tự gõ giờ. Nút mới: 1 bấm ⇒ DB chốt giờ theo việc trong ca:
--   vào = sớm hơn trong (giờ checkin, giờ bắt đầu việc đầu) · ra = giờ kết thúc việc cuối. Giờ gốc giữ nguyên (như fn_ta_chot_gio).
--   Chỉ tính việc chưa bị từ chối, có đủ giờ. Không có việc nào ⇒ báo lỗi, Trang chốt tay.
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 hàm.
-- ============================================================================

create or replace function public.fn_ta_chot_gio_theo_viec(p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare c ta_cham_cong; v_bd time; v_kt time; v_vao timestamptz; v_ra timestamptz;
begin
  if not public.co_quyen_ghi('ta_cong_duyet') then raise exception 'Không có quyền chốt giờ'; end if;
  select * into c from ta_cham_cong where id = p_id for update;
  if c.id is null then raise exception 'Không thấy ca'; end if;
  select min(v.gio_bat_dau), max(v.gio_ket_thuc) into v_bd, v_kt
    from ta_cong_viec v where v.cham_cong_id = p_id and v.trang_thai <> 'tu_choi' and v.gio_bat_dau is not null and v.gio_ket_thuc is not null;
  if v_kt is null then raise exception 'Ca này chưa có việc nào có giờ — chốt giờ tay'; end if;
  v_vao := least(c.vao_at, (c.ngay + v_bd) at time zone 'Asia/Ho_Chi_Minh');
  v_ra  := (c.ngay + v_kt) at time zone 'Asia/Ho_Chi_Minh';
  if v_ra <= v_vao then raise exception 'Việc cuối kết thúc trước giờ vào — chốt giờ tay'; end if;
  update ta_cham_cong set vao_chot = v_vao, ra_chot = v_ra, trang_thai = 'xong' where id = p_id;
  return jsonb_build_object('vao', to_char(v_vao at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'), 'ra', to_char(v_ra at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'));
end $$;
revoke execute on function public.fn_ta_chot_gio_theo_viec(uuid) from public, anon;
grant execute on function public.fn_ta_chot_gio_theo_viec(uuid) to authenticated;
