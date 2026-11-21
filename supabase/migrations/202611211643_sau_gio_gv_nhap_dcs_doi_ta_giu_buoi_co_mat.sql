-- ============================================================================
-- 202611211643 — sau_gio_gv_nhap_dcs_doi_ta_giu_buoi_co_mat
-- VÌ SAO (Thùy 21/11, lớp 11B1): "bổ trợ sau giờ trợ giảng nghỉ, giáo viên lại không có quyền nhập DCS, xong hệ thống lại tự huỷ. TA nghỉ thì phải chuyển quyền chứ.
--   Và GV mặc định có quyền điền DCS và sửa mà."
--   Ca 11B1 ngày 15/11 (TA Nguyễn Ngọc Duy, trưởng khối mở): 6 em CÓ MẶT, bài test đã in, chưa ai nhập Đ/C/S (TA nghỉ, GV lớp không thấy em trong danh sách vì
--   fn_btnhe_ta_nhap_ds chỉ cho TA của ca / người mở ca / admin) ⇒ reset thứ Hai 16/11 huỷ cả 6 buổi (chỉ kiểm "chưa có bai_lam", không xét em đã có mặt).
--   · _btnhe_duoc_nhap(buổi): ai nhập / xem Đ/C/S ca sau giờ = TA của ca · người mở ca · GV/TA được PHÂN CÔNG LỚP (phan_cong_lop) · trưởng khối (môn × khối) · người có quyền
--     điểm danh sau giờ (Trang) · admin. fn_btnhe_ta_nhap_ds (đọc) và fn_btnhe_nhap_dcs (ghi) dùng hàm này. fn_btnhe_ds: GV/TA phân công lớp thấy ca của lớp.
--   · fn_btnhe_doi_ta(ca, ta): TA nghỉ ⇒ đổi sang người khác (hoặc bỏ TA). Quyền: trưởng khối · người mở ca · GV/TA phân công lớp · Trang · admin.
--   · _btnhe_reset_tuan: KHÔNG huỷ buổi có em đã CÓ MẶT (đã diễn ra, đang chờ nhập kết quả) — buổi đó hiện ở danh sách "chờ nhập" tới khi nhập xong.
-- MẤT GÌ (Luật xoá): không. Thêm 2 hàm, dựng lại 4 hàm từ định nghĩa ĐANG CHẠY chỉ đổi đúng các dòng ghi chú "21/11". KHÔNG đụng dữ liệu 6 buổi đã huỷ ngày 16/11 (xử riêng khi Thùy gật).
-- ============================================================================
create or replace function public._btnhe_duoc_nhap(p_buoi uuid)
returns boolean language sql stable security definer set search_path = public as $f$
  select public.la_thanh_vien() and (
    coalesce((select la_admin from public.my_quyen()), false)
    or public.co_quyen_ghi('diem_danh_sau_gio')
    or exists (select 1 from buoi_hoc b join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
                where b.id = p_buoi and b.loai = 'bo_tro_nhe'
                  and (cn.ta_id = public._btyeu_my_ns() or b.nguoi_day_tg = public._btyeu_my_ns() or cn.truong_khoi_id = public.current_nhan_su_id()
                       or public._btnhe_duoc_tao(cn.mon, cn.khoi)
                       or exists (select 1 from phan_cong_lop pc where pc.lop_id = cn.lop_id and pc.nhan_su_id = public.current_nhan_su_id())))
  )
$f$;
revoke execute on function public._btnhe_duoc_nhap(uuid) from public, anon;
grant execute on function public._btnhe_duoc_nhap(uuid) to authenticated;

create or replace function public.fn_btnhe_doi_ta(p_ca uuid, p_ta uuid)
returns jsonb language plpgsql security definer set search_path = public as $f$
declare cn record; v_ten text;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into cn from ca_bo_tro_nhe where id = p_ca;
  if cn.id is null then raise exception 'Không thấy ca.'; end if;
  if cn.trang_thai = 'huy' then raise exception 'Ca đã huỷ — không đổi TA.'; end if;
  if not (coalesce((select la_admin from public.my_quyen()), false) or public.co_quyen_ghi('diem_danh_sau_gio')
          or cn.truong_khoi_id = public.current_nhan_su_id() or public._btnhe_duoc_tao(cn.mon, cn.khoi)
          or exists (select 1 from buoi_hoc b where b.ca_bo_tro_nhe_id = cn.id and b.nguoi_day_tg = public._btyeu_my_ns())
          or exists (select 1 from phan_cong_lop pc where pc.lop_id = cn.lop_id and pc.nhan_su_id = public.current_nhan_su_id())) then
    raise exception 'Chỉ trưởng khối, người mở ca, GV/TA của lớp, Trang hoặc admin đổi TA được.'; end if;
  if p_ta is not null then
    select ho_ten into v_ten from nhan_su where id = p_ta;
    if v_ten is null then raise exception 'TA không hợp lệ.'; end if;
  end if;
  update ca_bo_tro_nhe set ta_id = p_ta where id = p_ca;
  return jsonb_build_object('ta_id', p_ta, 'ta_ten', v_ten);
end $f$;
revoke execute on function public.fn_btnhe_doi_ta(uuid, uuid) from public, anon;
grant execute on function public.fn_btnhe_doi_ta(uuid, uuid) to authenticated;

CREATE OR REPLACE FUNCTION public.fn_btnhe_ds(p_tu date, p_den date)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'ca_id', c.id, 'lop_id', c.lop_id, 'ten_lop', l.ten_lop, 'mon', c.mon, 'khoi', c.khoi, 'kieu', c.kieu, 'ngay', c.ngay,
    'gio_bat_dau', c.gio_bat_dau, 'gio_ket_thuc', c.gio_ket_thuc, 'phong', c.phong, 'trang_thai', c.trang_thai,
    'truong_khoi_id', c.truong_khoi_id, 'truong_khoi_ten', tk.ho_ten, 'ta_id', c.ta_id, 'ta_ten', ta.ho_ten,
    'hs', (select coalesce(jsonb_agg(jsonb_build_object(
              'buoi_id', b.id, 'buoi_hoc_hs_id', hh.id, 'hoc_sinh_id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs,
              'buoi_trang_thai', b.trang_thai, 'diem_danh', hh.diem_danh, 'danh_gia_xong_at', b.danh_gia_xong_at,
              'so_dang', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = hh.bo_tro_yeu_id),
              'co_test', exists (select 1 from bai_test bt where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test'),
              'test_da_nop', exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id
                                     where bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop'),
              'ket_qua', y.ket_qua,
              -- Thùy 12/11: em đã được đổi mức (L2/L3/L4) SAU khi ca này tạo ⇒ màn báo "đã chuyển Lx"
              'muc_moi', (select dx.muc from bo_tro_de_xuat dx where dx.hoc_sinh_id = h.id and dx.mon = c.mon and dx.trang_thai = 'da_duyet'
                            and dx.muc <> 1 and dx.duyet_at > c.created_at order by dx.duyet_at desc limit 1)) order by h.ho_ten), '[]'::jsonb)
           from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id join hoc_sinh h on h.id = hh.hoc_sinh_id
           left join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
          where b.ca_bo_tro_nhe_id = c.id)
  ) order by c.ngay desc, c.gio_bat_dau desc), '[]'::jsonb)
  from ca_bo_tro_nhe c join lop l on l.id = c.lop_id
  left join nhan_su tk on tk.id = c.truong_khoi_id left join nhan_su ta on ta.id = c.ta_id
  where c.ngay between p_tu and p_den and public.la_thanh_vien()
    and (public._btnhe_duoc_tao(c.mon, c.khoi) or c.truong_khoi_id = public.current_nhan_su_id() or c.ta_id = public.current_nhan_su_id()
         or exists (select 1 from phan_cong_lop pc where pc.lop_id = c.lop_id and pc.nhan_su_id = public.current_nhan_su_id()))   -- 21/11: GV / TA được phân công lớp thấy ca của lớp
$function$
;

CREATE OR REPLACE FUNCTION public.fn_btnhe_ta_nhap_ds()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_hom date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select coalesce(la_admin, false) into v_admin from public.my_quyen();
  return coalesce((
    select jsonb_agg(x order by x.ngay, x.ten_lop, x.ho_ten) from (
      select b.id as buoi_id, b.ngay, b.gio_bat_dau, l.ten_lop, h.id as hoc_sinh_id, h.ho_ten, h.ma_hs, cn.mon,
             bt.id as bai_test_id, b.danh_gia_xong_at is not null as xong,
             exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop') as da_nop,
             (select jsonb_agg(jsonb_build_object('id', k.id, 'thu_tu', k.thu_tu, 'loai_cau', k.loai_cau,
                       'kq', (select case blc.verdict when 'correct' then 'D' when 'partial' then 'C' when 'wrong' then 'S' end
                                from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id
                               where bl.bai_test_id = bt.id and blc.bai_test_cau_id = k.id limit 1))
                     order by k.thu_tu)
                from bai_test_cau k where k.bai_test_id = bt.id) as caus
        from buoi_hoc b
        join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id and cn.trang_thai <> 'huy'
        join lop l on l.id = cn.lop_id
        join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id
        join hoc_sinh h on h.id = hh.hoc_sinh_id
        join bai_test bt on bt.buoi_hoc_id = b.id and bt.loai = 'bo_tro_test'
       where b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay <= v_hom
         and public._btnhe_duoc_nhap(b.id)   -- 21/11: + GV/TA phân công lớp, trưởng khối, Trang (TA nghỉ ⇒ người khác nhập được)
         and (b.danh_gia_xong_at is null or b.ngay = v_hom)
    ) x), '[]'::jsonb);
end $function$
;

CREATE OR REPLACE FUNCTION public.fn_btnhe_nhap_dcs(p_bai_test_cau uuid, p_kq text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare k record; v_bl uuid; v_tt text; v_verdict text; v_diem numeric;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự nhập được kết quả.'; end if;
  if p_kq is not null and p_kq not in ('D', 'C', 'S') then raise exception 'Kết quả phải là D / C / S.'; end if;
  select btc.id, btc.diem, bt.id as bt_id, bt.hoc_sinh_id, bt.loai, b.loai as buoi_loai, bt.buoi_hoc_id as buoi_id
    into k from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id left join buoi_hoc b on b.id = bt.buoi_hoc_id
   where btc.id = p_bai_test_cau;
  if k.id is null then raise exception 'Không thấy câu.'; end if;
  if k.buoi_loai = 'bo_tro_nhe' and not public._btnhe_duoc_nhap(k.buoi_id) then raise exception 'Chỉ TA / giáo viên phân công lớp, trưởng khối hoặc Trang nhập được kết quả ca này.'; end if;   -- 21/11
  if k.loai <> 'bo_tro_test' or k.buoi_loai is distinct from 'bo_tro_nhe' then raise exception 'Chỉ nhập Đ/C/S cho bài test bổ trợ sau giờ.'; end if;
  insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at) values (k.bt_id, k.hoc_sinh_id, 'dang_lam', now())
    on conflict (bai_test_id, hoc_sinh_id) do update set bai_test_id = excluded.bai_test_id returning id, trang_thai into v_bl, v_tt;
  if v_tt = 'da_nop' then raise exception 'Bài đã nộp — không sửa kết quả được nữa.'; end if;
  if p_kq is null then
    delete from bai_lam_cau where bai_lam_id = v_bl and bai_test_cau_id = k.id;
    return jsonb_build_object('kq', null);
  end if;
  v_verdict := case p_kq when 'D' then 'correct' when 'C' then 'partial' else 'wrong' end;
  v_diem := case p_kq when 'D' then coalesce(k.diem, 1) when 'C' then coalesce(k.diem, 1) * 0.5 else 0 end;
  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
    values (v_bl, k.id, to_jsonb(p_kq || ' (TA nhập)'), v_verdict, v_diem, 'manual', now())
    on conflict (bai_lam_id, bai_test_cau_id) do update set dap_an_hs = excluded.dap_an_hs, verdict = excluded.verdict, diem = excluded.diem, cham_boi = 'manual', cham_at = now();
  return jsonb_build_object('kq', p_kq);
end $function$
;

CREATE OR REPLACE FUNCTION public._btnhe_reset_tuan(p_ngan_giay integer DEFAULT 20)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
       and not exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id and hh.diem_danh = 'co_mat')   -- 21/11: em ĐÃ CÓ MẶT ⇒ buổi đã diễn ra, chờ nhập kết quả — KHÔNG huỷ
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
end $function$
;
