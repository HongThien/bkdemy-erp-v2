-- ============================================================================
-- 202608300311 — Phase 2c §2.0: PHIẾU ẢO + CHỐT KỲ → function DB (tiền hết chạy ở browser)
-- ----------------------------------------------------------------------------
-- VÌ SAO: audit 30/08 — getPhieuAo là bảng tính tiền của trung tâm chạy trong browser
--   (N+1 query per con/lớp), và chotKy lấy NGUYÊN kết quả JS đó đông cứng vào hoa_don.
--   Giờ: fn_hocphi_phieu_ao đứng TRÊN VAI hoc_phi_theo_mon_ky (RPC đã port + đối chiếu
--   27/08) — phiếu PH và bảng "HS theo môn" từ nay CÙNG MỘT NGUỒN SỐ, hết cảnh 2 bản
--   công thức lệch nhau; cộng thêm 4 lớp riêng của phiếu: học liệu tách dòng · phát sinh
--   (cá nhân + theo lớp) · giảm giới thiệu (fn 2b) · nợ kỳ trước (fn 2b).
--   fn_hocphi_chot_ky = phiếu + phát sinh tay → hoa_don + hoa_don_dong trong MỘT
--   transaction (unique phu_huynh_id+ky vẫn chống chốt trùng như cũ).
--
-- Khác biệt HIỂN THỊ đã cân nhắc (số tiền KHÔNG đổi):
--   · dòng học đuổi gộp "Học đuổi N buổi" (RPC group theo lớp-case; giá mức là bội 1000
--     nên Σ không lệch làm tròn so với group-theo-mức của JS cũ).
-- MẤT GÌ (Luật xoá): không — thêm 2 function.
-- ============================================================================

create or replace function public.fn_hocphi_phieu_ao(p_ph uuid, p_ky date)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_dong jsonb := '[]'::jsonb;
  v_subtotal numeric := 0;
  v_giam numeric := 0;
  v_no numeric := 0;
  r record;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('dong', '[]'::jsonb, 'tongTien', 0, 'soDuNoTruoc', 0); end if;

  -- dòng học phí / học liệu / đuổi: từ CÙNG nguồn với bảng "HS theo môn"
  for r in
    select x.*
    from jsonb_to_recordset(public.hoc_phi_theo_mon_ky(p_ky)) as x(
      hoc_sinh_id uuid, hoc_sinh_ten text, lop_id uuid, ten_lop text, mon text,
      so_buoi_lop int, so_buoi_nghi int, so_buoi_di_hoc int, so_buoi_bu int,
      so_buoi_bu_da_hoc int, so_buoi_bu_da_xep int, so_buoi_duoi int,
      don_gia numeric, he_so numeric, cong_thuc_de_xuat text, cong_thuc_chon text,
      tien_hoc_chinh numeric, tien_duoi numeric, tien_hoc_lieu numeric, hoc_lieu_ten text)
    where x.hoc_sinh_id in (select id from hoc_sinh where phu_huynh_id = p_ph)
    order by x.hoc_sinh_ten, x.mon
  loop
    if r.tien_hoc_chinh > 0 then
      v_dong := v_dong || jsonb_build_object(
        'loai', 'hoc_phi', 'hoc_sinh_id', r.hoc_sinh_id, 'hoc_sinh_ten', r.hoc_sinh_ten,
        'lop_id', r.lop_id, 'lop_ten', r.ten_lop,
        'mo_ta', case when r.so_buoi_bu > 0
          then 'gồm ' || r.so_buoi_bu || ' buổi bù (' || r.so_buoi_bu_da_hoc || ' đã bù'
               || case when r.so_buoi_bu_da_xep > 0 then ', ' || r.so_buoi_bu_da_xep || ' đã xếp lịch' else '' end || ')'
          else null end,
        'so_luong', case when coalesce(r.cong_thuc_chon, r.cong_thuc_de_xuat) = 'ct2'
                         then r.so_buoi_di_hoc + r.so_buoi_bu else r.so_buoi_lop end,
        'don_gia', r.don_gia, 'he_so', r.he_so, 'thanh_tien', r.tien_hoc_chinh);
      v_subtotal := v_subtotal + r.tien_hoc_chinh;
    end if;
    if r.tien_hoc_lieu > 0 then
      v_dong := v_dong || jsonb_build_object(
        'loai', 'hoc_lieu', 'hoc_sinh_id', r.hoc_sinh_id, 'hoc_sinh_ten', r.hoc_sinh_ten,
        'lop_id', r.lop_id, 'lop_ten', r.ten_lop, 'mo_ta', r.hoc_lieu_ten,
        'so_luong', 1, 'don_gia', r.tien_hoc_lieu, 'he_so', null, 'thanh_tien', r.tien_hoc_lieu);
      v_subtotal := v_subtotal + r.tien_hoc_lieu;
    end if;
    if r.tien_duoi > 0 then
      v_dong := v_dong || jsonb_build_object(
        'loai', 'hoc_duoi', 'hoc_sinh_id', r.hoc_sinh_id, 'hoc_sinh_ten', r.hoc_sinh_ten,
        'lop_id', null, 'lop_ten', nullif(r.ten_lop, '—'),
        'mo_ta', 'Học đuổi ' || r.so_buoi_duoi || ' buổi',
        'so_luong', r.so_buoi_duoi, 'don_gia', null, 'he_so', null, 'thanh_tien', r.tien_duoi);
      v_subtotal := v_subtotal + r.tien_duoi;
    end if;
  end loop;

  -- phát sinh: cá nhân đúng con + theo lớp con đang ghi danh hiệu lực trong kỳ
  for r in
    select ps.mo_ta, ps.so_tien, hs.id as hs_id, hs.ho_ten
    from hoc_sinh hs
    join hoc_phi_phat_sinh ps on ps.ky = p_ky and (
      (ps.loai = 'ca_nhan' and ps.hoc_sinh_id = hs.id)
      or (ps.loai = 'lop' and ps.lop_id in (
        select hsl.lop_id from hoc_sinh_lop hsl
        where hsl.hoc_sinh_id = hs.id and hsl.ngay_vao < (p_ky + interval '1 month')::date
          and (hsl.ngay_roi is null or hsl.ngay_roi >= p_ky))))
    where hs.phu_huynh_id = p_ph
  loop
    v_dong := v_dong || jsonb_build_object(
      'loai', 'phat_sinh', 'hoc_sinh_id', r.hs_id, 'hoc_sinh_ten', r.ho_ten, 'lop_id', null,
      'mo_ta', r.mo_ta, 'so_luong', null, 'don_gia', null, 'he_so', null, 'thanh_tien', r.so_tien);
    v_subtotal := v_subtotal + r.so_tien;
  end loop;

  -- giảm giới thiệu (trần = subtotal) + nợ kỳ trước — cùng fn 2b
  select coalesce((select con_lai from public.fn_hocphi_tin_dung_con_lai(array[p_ph], p_ky)), 0) into v_giam;
  v_giam := least(v_giam, greatest(0, v_subtotal));
  if v_giam > 0 then
    v_dong := v_dong || jsonb_build_object('loai', 'giam_gioi_thieu', 'hoc_sinh_id', null, 'lop_id', null,
      'mo_ta', 'Giảm giới thiệu', 'so_luong', null, 'don_gia', null, 'he_so', null, 'thanh_tien', -round(v_giam));
  end if;
  v_no := public.fn_hocphi_so_du_no(p_ph);
  if v_no > 0 then
    v_dong := v_dong || jsonb_build_object('loai', 'no_ky_truoc', 'hoc_sinh_id', null, 'lop_id', null,
      'mo_ta', 'Nợ kỳ trước', 'so_luong', null, 'don_gia', null, 'he_so', null, 'thanh_tien', v_no);
  end if;

  return jsonb_build_object(
    'phu_huynh_id', p_ph, 'ky', to_char(p_ky, 'YYYY-MM-DD'), 'dong', v_dong,
    'tongTien', (select coalesce(sum((d ->> 'thanh_tien')::numeric), 0) from jsonb_array_elements(v_dong) d),
    'soDuNoTruoc', v_no);
end $$;
revoke all on function public.fn_hocphi_phieu_ao(uuid, date) from public;
grant execute on function public.fn_hocphi_phieu_ao(uuid, date) to authenticated;

-- Chốt kỳ: phiếu ảo + phát sinh TAY → hoa_don + hoa_don_dong, MỘT transaction.
create or replace function public.fn_hocphi_chot_ky(p_ph uuid, p_ky date, p_phat_sinh jsonb default '[]'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_phieu jsonb; v_dong jsonb; v_tong numeric; v_hd uuid;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  v_phieu := public.fn_hocphi_phieu_ao(p_ph, p_ky);
  v_dong := (v_phieu -> 'dong') || coalesce((
    select jsonb_agg(jsonb_build_object('loai', 'phat_sinh', 'hoc_sinh_id', null, 'lop_id', null,
      'mo_ta', x ->> 'mo_ta', 'so_luong', null, 'don_gia', null, 'he_so', null,
      'thanh_tien', (x ->> 'thanh_tien')::numeric))
    from jsonb_array_elements(p_phat_sinh) x), '[]'::jsonb);
  select coalesce(sum((d ->> 'thanh_tien')::numeric), 0) into v_tong from jsonb_array_elements(v_dong) d;

  insert into hoa_don (phu_huynh_id, ky, trang_thai, tong_tien, dong_at, created_by)
  values (p_ph, p_ky, 'chua_thu', v_tong, now(), public.jwt_uid())
  returning id into v_hd; -- unique (phu_huynh_id, ky) tự chặn chốt 2 lần

  insert into hoa_don_dong (hoa_don_id, loai, hoc_sinh_id, lop_id, mo_ta, so_luong, don_gia, he_so, thanh_tien, snapshot)
  select v_hd, d ->> 'loai', nullif(d ->> 'hoc_sinh_id', '')::uuid, nullif(d ->> 'lop_id', '')::uuid,
         d ->> 'mo_ta', (d ->> 'so_luong')::numeric, (d ->> 'don_gia')::numeric, (d ->> 'he_so')::numeric,
         (d ->> 'thanh_tien')::numeric,
         jsonb_build_object('so_buoi', d -> 'so_luong', 'don_gia', d -> 'don_gia', 'he_so', d -> 'he_so')
  from jsonb_array_elements(v_dong) d;

  return jsonb_build_object('hoaDonId', v_hd, 'tongTien', v_tong);
end $$;
revoke all on function public.fn_hocphi_chot_ky(uuid, date, jsonb) from public;
grant execute on function public.fn_hocphi_chot_ky(uuid, date, jsonb) to authenticated;
