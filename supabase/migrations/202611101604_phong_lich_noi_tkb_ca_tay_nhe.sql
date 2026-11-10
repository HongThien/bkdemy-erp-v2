-- Nối 3 đường ghi lịch còn lại vào LỊCH PHÒNG MỘT NGUỒN (fn_phong_lich, mig 202611101544) — Thùy 10/11 "nối luôn":
--   (1) TKB (Thời khoá biểu + màn Lớp): trước chỉ so với TKB khác ở CLIENT ⇒ giờ fn_tkb_kiem_trung + fn_tkb_luu (kiểm + ghi 1 transaction)
--   (2) Ca bổ trợ tạo tay (fn_ca_bo_tro_tao): trước chỉ có trigger ≤2 ca_bo_tro/phòng ⇒ giờ chặn cả trùng chính khoá/test/phát sinh,
--       đủ 2 khối bổ trợ (mọi loại) và trùng người trực
--   (3) Bổ trợ Nhẹ (fn_btnhe_tao): spec-bo-tro §8.2 = CẢNH BÁO, không chặn — giữ luật, chỉ đổi nguồn đếm sang lịch phòng chung
--       và trả thêm danh sách khối trùng (trung_ds) để màn hiện rõ trùng với ai.

-- ── (1) TKB ──────────────────────────────────────────────────────────────
-- Kiểm trùng 1 khung TKB (hằng tuần) trên 4 tuần tính từ ngày hiệu lực. Chính khoá là lịch GỐC nên:
--   chan     = trùng chính khoá lớp khác · test · phát sinh
--   canh_bao = trùng bổ trợ (lẻ/khối) — lưu được nếu xác nhận, rồi dời bổ trợ đi
-- Bỏ qua: chính khung đang sửa (p_bo_qua) và buổi thường của CHÍNH lớp đó (buổi = khung này đã mở).
create or replace function public.fn_tkb_kiem_trung(
  p_lop uuid, p_thu int, p_gio_bd time, p_gio_kt time, p_phong text, p_tu date default null, p_bo_qua uuid default null
) returns jsonb
language plpgsql stable
set search_path = public
as $$
declare
  v_tu date := greatest(coalesce(p_tu, (now() at time zone 'Asia/Ho_Chi_Minh')::date), (now() at time zone 'Asia/Ho_Chi_Minh')::date);
  v jsonb;
begin
  if coalesce(trim(p_phong), '') = '' then return '[]'::jsonb; end if;
  with l as (
    select * from public.fn_phong_lich(v_tu, v_tu + 27) x
    where public._thu_cua_ngay(x.ngay) = p_thu and x.phong_ma = trim(p_phong)
      and x.gio_bat_dau < p_gio_kt and x.gio_ket_thuc > p_gio_bd
      and (p_bo_qua is null or x.ref_id not like 'tkb-' || p_bo_qua::text || '-%')
      and x.ref_id not in (select b.id::text from buoi_hoc b where b.lop_id = p_lop and b.loai = 'thuong' and b.ngay between v_tu and v_tu + 27)
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'kieu', 'phong', 'muc', g.muc, 'nguon', g.nguon, 'tieu_de', g.tieu_de, 'phong', g.phong_ma, 'phu_trach', g.phu_trach,
           'gio_bat_dau', to_char(g.gio_bat_dau, 'HH24:MI'), 'gio_ket_thuc', to_char(g.gio_ket_thuc, 'HH24:MI'), 'ngay', g.ngays)
         order by g.muc desc, g.gio_bat_dau), '[]'::jsonb)
  into v
  from (
    select case when x.nguon in ('bo_tro', 'bo_tro_khoi') then 'canh_bao' else 'chan' end as muc, x.nguon,
           regexp_replace(x.tieu_de, ' \(TKB\)$', '') as tieu_de, x.phong_ma, x.phu_trach, x.gio_bat_dau, x.gio_ket_thuc,
           array_agg(distinct x.ngay order by x.ngay) as ngays
    from l x group by 1, 2, 3, 4, 5, 6, 7
  ) g;
  return v;
end
$$;

-- Lưu khung TKB: p_id NULL = thêm (lop, thứ, giờ, phòng, hiệu lực từ); có = sửa phòng + hiệu lực từ (đổi giờ = ngừng khung rồi xếp khung mới — giữ vết).
create or replace function public.fn_tkb_luu(
  p_id uuid, p_lop uuid, p_thu int, p_gio_bd time, p_gio_kt time, p_phong text, p_hieu_luc_tu date, p_chap_nhan boolean default false
) returns jsonb
language plpgsql volatile
set search_path = public
as $$
declare v_cu thoi_khoa_bieu%rowtype; v_trung jsonb; v_id uuid;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_id is not null then
    select * into v_cu from thoi_khoa_bieu where id = p_id;
    if not found then raise exception 'Không thấy khung TKB này.'; end if;
    p_lop := v_cu.lop_id; p_thu := v_cu.thu; p_gio_bd := v_cu.gio_bat_dau; p_gio_kt := v_cu.gio_ket_thuc;
  else
    if p_lop is null then raise exception 'Chọn lớp.'; end if;
    if p_thu not between 2 and 8 then raise exception 'Thứ không hợp lệ.'; end if;
    if p_gio_bd is null or p_gio_kt is null or p_gio_kt <= p_gio_bd then raise exception 'Giờ kết thúc phải sau giờ bắt đầu.'; end if;
  end if;
  if nullif(trim(p_phong), '') is not null and not exists (select 1 from phong where ma_phong = trim(p_phong)) then
    raise exception 'Phòng % không có trong danh mục phòng.', p_phong;
  end if;

  v_trung := public.fn_tkb_kiem_trung(p_lop, p_thu, p_gio_bd, p_gio_kt, p_phong, p_hieu_luc_tu, p_id);
  if exists (select 1 from jsonb_array_elements(v_trung) e where e->>'muc' = 'chan')
     or (jsonb_array_length(v_trung) > 0 and not coalesce(p_chap_nhan, false)) then
    return jsonb_build_object('ok', false, 'id', p_id, 'trung', v_trung);
  end if;

  if p_id is null then
    insert into thoi_khoa_bieu (lop_id, thu, gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu, hieu_luc_den)
    values (p_lop, p_thu, p_gio_bd, p_gio_kt, nullif(trim(p_phong), ''), coalesce(p_hieu_luc_tu, (now() at time zone 'Asia/Ho_Chi_Minh')::date), null)
    returning id into v_id;
  else
    update thoi_khoa_bieu set phong = nullif(trim(p_phong), ''), hieu_luc_tu = coalesce(p_hieu_luc_tu, hieu_luc_tu) where id = p_id;
    v_id := p_id;
  end if;
  return jsonb_build_object('ok', true, 'id', v_id, 'trung', v_trung);
end
$$;

-- ── (2) Ca bổ trợ tạo tay — giữ nguyên thân cũ, thêm kiểm trùng trên lịch phòng chung trước khi ghi ──
create or replace function public.fn_ca_bo_tro_tao(
  p_ngay date, p_gio_bd time, p_gio_kt time, p_mon text, p_khoi text, p_phong text, p_so_ta integer, p_ns uuid, p_ns2 uuid
) returns uuid
language plpgsql security definer
set search_path = public
as $$
declare v uuid; v_phong text := nullif(trim(p_phong), ''); v_ns2 uuid := case when p_so_ta = 2 then p_ns2 end; r record; v_bt int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_ns is null then raise exception 'Ca phải có người trực.'; end if;
  if p_so_ta = 2 and (p_ns2 is null or p_ns2 = p_ns) then raise exception 'Ca 2 TA phải có người trực thứ 2 khác người 1.'; end if;
  if p_gio_kt <= p_gio_bd then raise exception 'Giờ kết thúc phải sau giờ bắt đầu.'; end if;

  -- Lịch phòng chung (Thùy 10/11): chặn trùng chính khoá/test/phát sinh · đủ 2 khối bổ trợ cùng phòng · người trực đang ở chỗ khác
  for r in select * from public.fn_phong_lich(p_ngay, p_ngay) x
           where x.gio_bat_dau < p_gio_kt and x.gio_ket_thuc > p_gio_bd
             and ((v_phong is not null and x.phong_ma = v_phong) or p_ns = any(x.nhan_su_ids) or (v_ns2 is not null and v_ns2 = any(x.nhan_su_ids)))
           order by x.gio_bat_dau
  loop
    -- buổi bổ trợ LẺ của chính người trực (chưa vào ca nào) = thứ ca này sinh ra để chứa ⇒ không tính trùng
    if r.nguon = 'bo_tro' and r.ref_id !~ '^(ca|nhe)-' and (p_ns = any(r.nhan_su_ids) or (v_ns2 is not null and v_ns2 = any(r.nhan_su_ids))) then continue; end if;
    if p_ns = any(r.nhan_su_ids) or (v_ns2 is not null and v_ns2 = any(r.nhan_su_ids)) then
      raise exception 'Trùng người trực: đang có % · % %–% lúc này.', r.tieu_de, coalesce(r.phong_ma, 'chưa phòng'), to_char(r.gio_bat_dau, 'HH24:MI'), to_char(r.gio_ket_thuc, 'HH24:MI');
    end if;
    if r.nguon not in ('bo_tro', 'bo_tro_khoi') then
      raise exception 'Trùng phòng %: % %–% (lịch phòng chung).', v_phong, r.tieu_de, to_char(r.gio_bat_dau, 'HH24:MI'), to_char(r.gio_ket_thuc, 'HH24:MI');
    end if;
    v_bt := v_bt + 1;
  end loop;
  if v_bt >= 2 then raise exception 'Phòng % lúc %–% đã có % khối bổ trợ — tối đa 2/phòng cùng giờ.', v_phong, to_char(p_gio_bd, 'HH24:MI'), to_char(p_gio_kt, 'HH24:MI'), v_bt; end if;

  insert into ca_bo_tro (ngay, gio_bat_dau, gio_ket_thuc, mon, khoi, phong, so_ta, nhan_su_id, nhan_su_2_id, created_by)
  values (p_ngay, p_gio_bd, p_gio_kt, p_mon, nullif(p_khoi, ''), v_phong, coalesce(p_so_ta, 1), p_ns, v_ns2, public.jwt_uid())
  returning id into v;
  return v;
end
$$;

-- ── (3) Bổ trợ Nhẹ — thân cũ nguyên văn, chỉ đổi phần "trùng phòng" sang lịch phòng chung (vẫn CẢNH BÁO, không chặn — spec §8.2) ──
create or replace function public.fn_btnhe_tao(
  p_lop uuid, p_kieu text, p_ngay date, p_gio_bat_dau time, p_phut integer, p_phong text, p_hs uuid[], p_ta uuid
) returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare l record; v_me uuid := public.current_nhan_su_id(); v_ca uuid; v_kt time; v_tuan date := date_trunc('week', p_ngay)::date;
  v_hs uuid; v_case uuid; v_buoi uuid; v_ten text; v_n int; v_khong text[] := '{}'; v_trung int := 0; v_trung_ds jsonb := '[]'::jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into l from lop where id = p_lop and trang_thai = 'dang_hoc';
  if l.id is null then raise exception 'Không thấy lớp đang học.'; end if;
  if not public._btnhe_duoc_tao(l.mon, l.khoi) then raise exception 'Chỉ trưởng khối % · % (hoặc Quản lý chất lượng) tạo được ca Nhẹ cho lớp này.', l.mon, l.khoi; end if;
  if p_kieu not in ('sau_buoi', 'khac') then raise exception 'Loại thời gian phải là sau_buoi | khac.'; end if;
  if p_ngay is null or p_gio_bat_dau is null then raise exception 'Thiếu ngày/giờ.'; end if;
  if coalesce(p_phut, 0) < 10 or p_phut > 90 then raise exception 'Thời lượng 10–90 phút.'; end if;
  if coalesce(cardinality(p_hs), 0) = 0 then raise exception 'Chưa chọn học sinh.'; end if;
  if p_ta is not null and not exists (select 1 from nhan_su where id = p_ta) then raise exception 'TA không hợp lệ.'; end if;
  v_kt := p_gio_bat_dau + make_interval(mins => p_phut);
  if v_kt <= p_gio_bat_dau then raise exception 'Ca vắt qua nửa đêm.'; end if;

  foreach v_hs in array p_hs loop
    select h.ho_ten into v_ten from hoc_sinh_lop hl join hoc_sinh h on h.id = hl.hoc_sinh_id
     where hl.lop_id = p_lop and hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc';
    if v_ten is null then raise exception 'Có học sinh không thuộc lớp %.', l.ten_lop; end if;
    select count(*) into v_n from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
     where x.hoc_sinh_id = v_hs and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7;
    if v_n >= 2 then raise exception '% đã có % ca Nhẹ tuần này (tối đa 2).', v_ten, v_n; end if;
  end loop;

  -- Trùng phòng: CẢNH BÁO, không chặn (spec §8.2) — đếm trên lịch phòng chung, TRƯỚC khi ghi ca này
  if nullif(trim(coalesce(p_phong, '')), '') is not null then
    select count(*), coalesce(jsonb_agg(jsonb_build_object('tieu_de', x.tieu_de, 'gio_bat_dau', to_char(x.gio_bat_dau, 'HH24:MI'), 'gio_ket_thuc', to_char(x.gio_ket_thuc, 'HH24:MI'), 'nguon', x.nguon) order by x.gio_bat_dau), '[]'::jsonb)
      into v_trung, v_trung_ds
      from public.fn_phong_kiem_trung(trim(p_phong), p_ngay, p_gio_bat_dau, v_kt) x;
  end if;

  insert into ca_bo_tro_nhe (lop_id, mon, khoi, kieu, ngay, gio_bat_dau, gio_ket_thuc, phong, truong_khoi_id, ta_id, created_by)
    values (p_lop, l.mon, l.khoi, p_kieu, p_ngay, p_gio_bat_dau, v_kt, nullif(trim(coalesce(p_phong, '')), ''), v_me, p_ta, public.jwt_uid())
    returning id into v_ca;

  foreach v_hs in array p_hs loop
    insert into bo_tro_yeu (hoc_sinh_id, lop_id, mon, nguon, ly_do, trang_thai, muc, uu_tien)
      values (v_hs, p_lop, l.mon, 'nhe', 'Bổ trợ Nhẹ ' || to_char(p_ngay, 'DD/MM'), 'nhe_mo', 1, 2)
      returning id into v_case;
    if public.fn_btyeu_fill_dang_yeu(v_case) = 0 then
      v_khong := v_khong || (select ho_ten from hoc_sinh where id = v_hs);
    end if;
    insert into buoi_hoc (loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, phong, nguoi_day_tg, trang_thai, created_by, ca_bo_tro_nhe_id)
      values ('bo_tro_nhe', null, p_ngay, public._thu_cua_ngay(p_ngay), p_gio_bat_dau, v_kt, nullif(trim(coalesce(p_phong, '')), ''),
              v_me, 'mo', public.jwt_uid(), v_ca)
      returning id into v_buoi;
    insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, bo_tro_yeu_id) values (v_buoi, v_hs, v_case);
  end loop;

  return jsonb_build_object('ca_id', v_ca, 'so_hs', cardinality(p_hs), 'em_khong_dang', to_jsonb(v_khong), 'trung_phong', v_trung, 'trung_ds', v_trung_ds);
end
$$;

revoke all on function public.fn_tkb_kiem_trung(uuid, int, time, time, text, date, uuid) from public, anon;
revoke all on function public.fn_tkb_luu(uuid, uuid, int, time, time, text, date, boolean) from public, anon;
grant execute on function public.fn_tkb_kiem_trung(uuid, int, time, time, text, date, uuid) to authenticated;
grant execute on function public.fn_tkb_luu(uuid, uuid, int, time, time, text, date, boolean) to authenticated;
-- fn_ca_bo_tro_tao trước còn grant cho PUBLIC (=X) — thu lại, chỉ nhân sự đăng nhập
revoke all on function public.fn_ca_bo_tro_tao(date, time, time, text, text, text, integer, uuid, uuid) from public, anon;
grant execute on function public.fn_ca_bo_tro_tao(date, time, time, text, text, text, integer, uuid, uuid) to authenticated;
