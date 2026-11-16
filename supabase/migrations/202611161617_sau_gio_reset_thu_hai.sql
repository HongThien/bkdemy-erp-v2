-- ============================================================================
-- 202611161617 — sau_gio_reset_thu_hai
-- VÌ SAO (Thùy 16/11, nguyên văn): "Đến thứ 2 là phải reset cái bổ trợ sau giờ ròi. cái nào chưa thực hiện được cũng hủy luôn để xếp lại theo
--   tuần mới · Trưởng khối chốt bổ trợ mới vào ngày thứ 2 thì hệ thống mới cập nhật bổ trợ sau giờ dc".
--   · _btnhe_reset_tuan(ngân sách giây): tác vụ nền, chạy lại được nhiều lần. HUỶ (không xoá) mọi buổi sau giờ CHƯA THỰC HIỆN của tuần cũ:
--     buổi mở, chưa xong (danh_gia_xong_at null), chưa có kết quả nhập (không bai_lam), thuộc ca có NGÀY trước thứ Hai tuần này HOẶC KHỞI TẠO
--     trước thứ Hai tuần này (khởi tạo từ lượt chốt cũ). ly_do_huy "Hết tuần — reset thứ Hai dd/mm". Ca hết buổi sống ⇒ ca huỷ. Trigger cũ
--     _trg_btnhe_dong_case đóng case sau giờ ('bo') + dạng. Ca đã nhập kết quả giữ nguyên. Chấm công: ca/buổi huỷ đã bị loại sẵn (_ta_buoi_thieu_cong).
--   · "Em chờ khởi tạo" là danh sách SUY RA (không có dòng) — đã rỗng từ mig 202611161614 (lượt chốt hiệu lực theo tuần).
--   · Lưới an toàn: fn_btnhe_tao chặn khởi tạo cho em không có lượt chốt L1 duyệt trong đúng tuần của ngày ca.
--   · Lịch: pg_cron 00:05 thứ Hai — file 20261116…_sau_gio_reset_thu_hai_cron_sql_editor.sql (chạy ở SQL Editor).
--   · Chạy NGAY 1 lần cho tuần 09–15/11 (Thùy gật).
-- MẤT GÌ (Luật xoá): không xoá dòng. Đổi trạng thái buoi_hoc / ca_bo_tro_nhe → 'huy' (+ case sau giờ đóng 'bo' qua trigger) cho phần chưa thực hiện.
-- ============================================================================
create or replace function public._btnhe_reset_tuan(p_ngan_giay integer default 20)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare v_bd timestamptz := clock_timestamp(); v_dau date := public._btnhe_dau_tuan();
  v_moc timestamptz := (v_dau::timestamp at time zone 'Asia/Ho_Chi_Minh');
  v_ly text := 'Hết tuần — reset thứ Hai ' || to_char(v_dau, 'DD/MM') || ' (tự động)'; v_buoi int := 0; v_ca int := 0; r record;
begin
  if not public._la_tac_vu_nen() then raise exception 'Chỉ tác vụ nền.'; end if;
  for r in
    select b.id from buoi_hoc b join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
     where b.loai = 'bo_tro_nhe' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and cn.trang_thai <> 'huy'
       and (cn.ngay < v_dau or cn.created_at < v_moc)
       and not exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id where bt.buoi_hoc_id = b.id)
     order by cn.ngay
  loop
    exit when clock_timestamp() - v_bd > make_interval(secs => p_ngan_giay);
    update buoi_hoc set trang_thai = 'huy', ly_do_huy = v_ly, updated_at = now() where id = r.id;
    v_buoi := v_buoi + 1;
  end loop;
  update ca_bo_tro_nhe c set trang_thai = 'huy', ly_do_huy = v_ly
   where c.trang_thai <> 'huy' and (c.ngay < v_dau or c.created_at < v_moc)
     and exists (select 1 from buoi_hoc b where b.ca_bo_tro_nhe_id = c.id)
     and not exists (select 1 from buoi_hoc b where b.ca_bo_tro_nhe_id = c.id and b.trang_thai <> 'huy');
  get diagnostics v_ca = row_count;
  return jsonb_build_object('tuan', v_dau, 'buoi_huy', v_buoi, 'ca_huy', v_ca);
end $$;
revoke execute on function public._btnhe_reset_tuan(integer) from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.fn_btnhe_tao(p_lop uuid, p_kieu text, p_ngay date, p_gio_bat_dau time without time zone, p_phut integer, p_phong text, p_hs uuid[], p_ta uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    if v_n >= 1 then raise exception '% đã có ca sau giờ tuần này — mỗi em 1 lần/tuần.', v_ten; end if;   -- Thùy 12/11 (trước: 2 ca/tuần)
    -- 16/11 Thùy: lượt chốt chỉ có hiệu lực trong TUẦN được duyệt ⇒ ca phải nằm trong tuần của lượt chốt L1 đã duyệt
    if not exists (select 1 from bo_tro_de_xuat d where d.hoc_sinh_id = v_hs and d.mon = l.mon and d.trang_thai = 'da_duyet' and d.muc = 1
                     and (d.duyet_at at time zone 'Asia/Ho_Chi_Minh')::date >= v_tuan and (d.duyet_at at time zone 'Asia/Ho_Chi_Minh')::date < v_tuan + 7) then
      raise exception '% chưa có lượt chốt sau giờ được duyệt trong tuần %–% — trưởng khối chốt lượt mới rồi mới khởi tạo.', v_ten, to_char(v_tuan, 'DD/MM'), to_char(v_tuan + 6, 'DD/MM');
    end if;
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
    if public.fn_btnhe_fill_dang(v_case) = 0 then -- 11/11: dạng sau giờ = nhóm yếu trước (_sau_gio_dang)
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
$function$;

-- chạy ngay cho tuần 09–15/11 (Thùy gật 16/11)
select public._btnhe_reset_tuan(60);
