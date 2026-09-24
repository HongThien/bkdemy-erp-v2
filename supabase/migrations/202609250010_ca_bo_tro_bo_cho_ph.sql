-- Thùy 24/09 khuya: "Lộc chốt với PH rồi mới điền vào. Đã điền vào đây thì phải là đã chốt rồi — nhãn PH vô nghĩa."
-- Bỏ bước "chờ PH → Xác nhận" (spec-xep-bo-tro-chung §4 cũ, câu 13): xếp vào ca = đã chốt ⇒ trừ đơn vị ngay + chặn đủ đơn vị / đủ 3 em/TA NGAY LÚC XẾP.
-- Cột buoi_hoc_hs.xac_nhan_ph_at giữ (mọi dòng có đơn vị đều có giá trị) — _ca_bo_tro_tinh vẫn đọc nó, không phải sửa hàng loạt hàm.
-- fn_ca_bo_tro_xac_nhan để nguyên (không còn màn nào gọi).

-- Dòng đang "chờ PH" (xếp trước đây, chưa bấm Xác nhận) ⇒ coi là đã chốt từ lúc xếp.
update public.buoi_hoc_hs set xac_nhan_ph_at = created_at where don_vi is not null and xac_nhan_ph_at is null;

create or replace function public.fn_ca_bo_tro_xep(p_ca uuid, p_loai text, p_hoc_sinh uuid, p_ref uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare c record; t record; v_buoi uuid; v_bhh uuid; v_dv smallint; v_nguoi uuid; v_lop uuid; v_ta uuid; v_bu_cho uuid; v_phut int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_loai not in ('duoi', 'bu', 'yeu') then raise exception 'Loại phải là duoi | bu | yeu.'; end if;
  select * into c from ca_bo_tro where id = p_ca for update;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  if c.trang_thai <> 'mo' then raise exception 'Ca đã huỷ.'; end if;
  v_phut := (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int;
  if p_loai = 'duoi' and v_phut < 60 then raise exception 'Bổ trợ đuổi cần đủ 1 tiếng — ca này chỉ % phút.', v_phut; end if;
  v_dv := public._ca_bo_tro_don_vi(p_loai, p_hoc_sinh, c.mon);
  -- Thùy 24/09: Lộc chốt với PH RỒI mới điền ⇒ xếp = đã chốt ⇒ trừ đơn vị NGAY, chặn luôn lúc xếp (không còn bước "chờ PH / Xác nhận").
  select * into t from public._ca_bo_tro_tinh(p_ca);
  if t.don_vi_dung + v_dv > c.don_vi then raise exception 'Ca chỉ còn % đơn vị, em cần % — ca đã đủ đơn vị.', c.don_vi - t.don_vi_dung, v_dv; end if;
  if t.so_hs_xn >= 3 * c.so_ta then raise exception 'Ca đã đủ % em (3 em/TA).', 3 * c.so_ta; end if;

  -- lớp của em (để tìm TA lớp) + kiểm tra ref thuộc đúng em
  if p_loai = 'duoi' then
    select lop_id into v_lop from bo_tro_duoi where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'can_duoi';
    if not found then raise exception 'Đợt đuổi không hợp lệ.'; end if;
  elsif p_loai = 'bu' then
    select b.lop_id, b.id into v_lop, v_bu_cho from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_ref and hh.hoc_sinh_id = p_hoc_sinh;
    if not found then raise exception 'Lần nghỉ không hợp lệ.'; end if;
    if exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.hoc_sinh_id = p_hoc_sinh and x.bu_cho_buoi_id = v_bu_cho and bb.trang_thai <> 'huy' and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
      then raise exception 'Lần nghỉ này đã có buổi bù còn hiệu lực.'; end if;
  else
    if not exists (select 1 from bo_tro_yeu where id = p_ref and hoc_sinh_id = p_hoc_sinh and trang_thai = 'dang_xu') then raise exception 'Case yếu không hợp lệ.'; end if;
    select l.id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = p_hoc_sinh and l.mon = c.mon limit 1;
  end if;
  -- người dạy mặc định (câu 6): yếu = người trực; bù/đuổi = TA lớp em nếu đang trực ca này, không thì người trực
  v_ta := case when v_lop is null then null else public._ta_cua_lop(v_lop) end;
  v_nguoi := case when p_loai <> 'yeu' and v_ta is not null and v_ta in (c.nhan_su_id, c.nhan_su_2_id) then v_ta else c.nhan_su_id end;

  if p_loai = 'bu' then
    select id into v_buoi from buoi_hoc where ca_bo_tro_id = p_ca and loai = 'bu' and trang_thai = 'mo' order by created_at limit 1;
  end if;
  if v_buoi is null then
    insert into buoi_hoc (loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_by, ca_bo_tro_id)
    values (case p_loai when 'duoi' then 'bo_tro_duoi' when 'bu' then 'bu' else 'bo_tro_yeu' end, null, c.ngay, public._thu_cua_ngay(c.ngay),
            c.gio_bat_dau, c.gio_ket_thuc, c.phong, v_nguoi, 'mo', public.jwt_uid(), p_ca)
    returning id into v_buoi;
  end if;
  insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, bo_tro_duoi_id, bu_cho_buoi_id, bo_tro_yeu_id, don_vi, xac_nhan_ph_at, xac_nhan_boi)
  values (v_buoi, p_hoc_sinh, case when p_loai = 'duoi' then p_ref end, v_bu_cho, case when p_loai = 'yeu' then p_ref end, v_dv, now(), public.jwt_uid())
  returning id into v_bhh;
  return jsonb_build_object('buoi_hoc_id', v_buoi, 'bhh_id', v_bhh, 'don_vi', v_dv, 'nguoi_day_tg', v_nguoi);
end $$;
grant execute on function public.fn_ca_bo_tro_xep(uuid, text, uuid, uuid) to authenticated;
