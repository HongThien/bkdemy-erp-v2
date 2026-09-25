-- ============================================================================
-- 202609260243 — SỰ KIỆN: vá cổng quyền 3 hàm quản trò (lỗi 'record "d" is not assigned yet')
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202609260219 đặt cổng _sk_can((select ... from sk_dang_ky d ... where d.id = ...)) trong hàm
--   có biến plpgsql cùng tên (d record, l record) ⇒ plpgsql hiểu d.id / l.id là BIẾN chưa gán ⇒
--   fn_sk_danh_dau / fn_sk_ket_thuc / fn_sk_huy_luot nổ ngay dòng đầu (Thùy bấm Bỏ qua trên app thật 26/09).
--   Sửa: tra su_kien qua 2 hàm phụ (không alias nào trong thân hàm gọi) — hết đường va tên.
-- MẤT GÌ: KHÔNG. create or replace cùng chữ ký, thân giữ nguyên trừ dòng cổng.
-- ============================================================================

create or replace function public._sk_sk_cua_dang_ky(p uuid) returns uuid language sql stable security definer set search_path = public as $$
  select ph.su_kien_id from sk_dang_ky dk join sk_phong ph on ph.id = dk.phong_id where dk.id = p
$$;
create or replace function public._sk_sk_cua_luot(p uuid) returns uuid language sql stable security definer set search_path = public as $$
  select ph.su_kien_id from sk_luot lu join sk_phong ph on ph.id = lu.phong_id where lu.id = p
$$;

create or replace function public.fn_sk_danh_dau(p_dang_ky uuid, p_hanh_dong text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare d record; v_max int; v_n int;
begin
  perform public._sk_can(public._sk_sk_cua_dang_ky(p_dang_ky), array['quantro']);
  select * into d from sk_dang_ky where id = p_dang_ky;
  if not found then raise exception 'Không tìm thấy lượt đăng ký.'; end if;
  -- khoá PHÒNG trước: 2 điện thoại cùng bấm "có mặt" không vượt quá số người/lượt
  perform 1 from sk_phong where id = d.phong_id for update;
  select * into d from sk_dang_ky where id = p_dang_ky for update;

  if p_hanh_dong = 'co_mat' then
    if d.trang_thai <> 'cho' then raise exception 'Bạn này không còn ở hàng chờ.'; end if;
    select coalesce((s.cau_hinh->>'toi_da_luot')::int, 6) into v_max
      from sk_phong p join sk_su_kien s on s.id = p.su_kien_id where p.id = d.phong_id;
    select count(*) into v_n from sk_dang_ky where phong_id = d.phong_id and trang_thai = 'co_mat';
    if v_n >= v_max then raise exception 'Lượt kế đã đủ % bạn.', v_max; end if;
    update sk_dang_ky set trang_thai = 'co_mat', updated_at = now() where id = p_dang_ky;
  elsif p_hanh_dong = 'bo_qua' then
    if d.trang_thai not in ('cho', 'co_mat') then raise exception 'Bạn này không còn ở hàng chờ.'; end if;
    update sk_dang_ky
       set so_lan_bo_qua = so_lan_bo_qua + 1,
           trang_thai = case when so_lan_bo_qua + 1 >= 2 then 'bo' else 'cho' end,
           updated_at = now()
     where id = p_dang_ky;
  elsif p_hanh_dong = 'tra_ve' then
    if d.trang_thai <> 'co_mat' then raise exception 'Chỉ đưa lại hàng chờ được bạn đang ở lượt kế.'; end if;
    update sk_dang_ky set trang_thai = 'cho', updated_at = now() where id = p_dang_ky;
  elsif p_hanh_dong = 'huy' then
    if d.trang_thai not in ('cho', 'co_mat') then raise exception 'Chỉ huỷ được bạn đang chờ.'; end if;
    update sk_dang_ky set trang_thai = 'huy', updated_at = now() where id = p_dang_ky;
  else
    raise exception 'Hành động không hợp lệ: %', p_hanh_dong;
  end if;
  select * into d from sk_dang_ky where id = p_dang_ky;
  return to_jsonb(d);
end $$;


create or replace function public.fn_sk_ket_thuc(p_luot uuid, p_ket_qua jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare l record; d record; v_xu int; v_tong int := 0;
begin
  perform public._sk_can(public._sk_sk_cua_luot(p_luot), array['quantro']);
  select * into l from sk_luot where id = p_luot for update;
  if not found then raise exception 'Không tìm thấy lượt.'; end if;
  if l.trang_thai <> 'dang_choi' then raise exception 'Lượt này đã kết thúc rồi.'; end if;
  for d in select * from sk_dang_ky where luot_id = p_luot and trang_thai = 'dang_choi' loop
    select coalesce(max((e->>'xu')::int), 0) into v_xu
      from jsonb_array_elements(coalesce(p_ket_qua, '[]'::jsonb)) e where (e->>'slot')::int = d.slot;
    if v_xu < 0 or v_xu > 100 then raise exception 'Xu slot % không hợp lệ: %', d.slot, v_xu; end if;
    if v_xu > 0 then
      insert into sk_xu (nguoi_choi_id, so_xu, nguon, luot_id, ghi_chu)
      values (d.nguoi_choi_id, v_xu, 'game', p_luot, l.game || ' · slot ' || d.slot)
      on conflict do nothing;
      v_tong := v_tong + v_xu;
    end if;
    update sk_dang_ky set trang_thai = 'xong', updated_at = now() where id = d.id;
  end loop;
  update sk_luot set trang_thai = 'xong', ket_thuc_at = now() where id = p_luot;
  return jsonb_build_object('tong_xu', v_tong);
end $$;


create or replace function public.fn_sk_huy_luot(p_luot uuid) returns void
language plpgsql security definer set search_path = public as $$
declare l record;
begin
  perform public._sk_can(public._sk_sk_cua_luot(p_luot), array['quantro']);
  select * into l from sk_luot where id = p_luot for update;
  if not found or l.trang_thai <> 'dang_choi' then raise exception 'Lượt không còn đang chơi.'; end if;
  update sk_dang_ky set trang_thai = 'co_mat', luot_id = null, slot = null, updated_at = now()
   where luot_id = p_luot and trang_thai = 'dang_choi';
  update sk_luot set trang_thai = 'huy', ket_thuc_at = now() where id = p_luot;
end $$;


-- Quyền: create or replace GIỮ nguyên quyền của 3 hàm cũ; chỉ 2 hàm phụ mới cần khoá (SQL Editor ⇒ anon được grant sẵn).
revoke all on function public._sk_sk_cua_dang_ky(uuid), public._sk_sk_cua_luot(uuid) from public;
revoke all on function public._sk_sk_cua_dang_ky(uuid), public._sk_sk_cua_luot(uuid) from anon;
grant execute on function public._sk_sk_cua_dang_ky(uuid), public._sk_sk_cua_luot(uuid) to authenticated;

-- Kiểm tra ngay (1 dòng kết quả): cong_con_loi = 0 và anon_goi_duoc = 0.
select
  (select count(*) from pg_proc
    where proname in ('fn_sk_danh_dau', 'fn_sk_ket_thuc', 'fn_sk_huy_luot')
      and (prosrc like '%from sk_dang_ky d join%' or prosrc like '%from sk_luot l join%')) as cong_con_loi,
  (select count(*) from pg_proc
    where proname in ('fn_sk_danh_dau', 'fn_sk_ket_thuc', 'fn_sk_huy_luot', '_sk_sk_cua_dang_ky', '_sk_sk_cua_luot')
      and has_function_privilege('anon', oid, 'execute')) as anon_goi_duoc;
