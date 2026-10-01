-- BỔ TRỢ YẾU KẾT THÚC khi em HẾT dạng yếu + TA ĐÓNG CA (Thùy 29/09, sửa lại mig 202609291037):
-- "Chờ đánh giá là việc của học thuật — là luồng khác. Luồng bổ trợ yếu sẽ end khi học sinh hết dạng yếu và TA bấm đóng ca."
-- ⇒ Khi hold retest (public._btyeu_retest_bat() = false):
--   • fn_btyeu_hoan_tat: sau khi chốt dạng đã dạy, case KHÔNG còn dạng cần dạy (chưa dạy / retest trượt) ⇒ đóng case ngay:
--     trang_thai 'hoan_thanh', ket_qua MỚI 'day_xong' (= hết dạng yếu, dạy xong — KHÔNG phải "đạt": chưa đo gì thêm, §1.5),
--     dong_boi = người hoàn tất, dạng còn mở ⇒ dong_at (đóng vận hành, dat giữ NULL = chưa đo), huỷ buổi đã xếp chưa học.
--     Level KHÔNG đổi (người/học thuật quyết level, như cũ).
--   • Màn Xếp / Trạng thái ca: case còn mở = đang bổ trợ (Cần xếp / Đã xếp) — bỏ hẳn mức Chờ retest / Chờ đánh giá.
--   • fn_btyeu_ca_ta trả case_trang_thai · case_ket_qua · so_dang_con_day cho app TA.
--   • ĐÓNG HỒI TỐ các case đã đủ điều kiện TRƯỚC luật này: đã dạy hết dạng + TA đã đóng buổi cuối + không còn buổi dở
--     (đo 29/09: 17 case; 6 case còn 1 buổi TA chưa hoàn tất ⇒ tự kết thúc khi TA bấm). Mốc đóng = lúc TA đóng buổi cuối.

alter table public.bo_tro_yeu drop constraint bo_tro_yeu_ket_qua_ck;
alter table public.bo_tro_yeu add constraint bo_tro_yeu_ket_qua_ck
  check (ket_qua is null or ket_qua = any (array['dat', 'mot_phan', 'chua_dat', 'bo', 'day_xong']));

-- Đóng 1 case bổ trợ yếu vì em hết dạng yếu (dùng chung: hoàn tất ca + đóng hồi tố). Nội bộ — chỉ hàm definer gọi.
create or replace function public._btyeu_ket_thuc_case(p_case uuid, p_ns uuid, p_ghi_chu text, p_at timestamptz)
 returns void
 language plpgsql
 set search_path to 'public'
as $$
begin
  update bo_tro_yeu_dang set dong_at = p_at where bo_tro_yeu_id = p_case and dong_at is null;
  update buoi_hoc b set trang_thai = 'huy', ly_do_huy = 'Hết dạng yếu — kết thúc bổ trợ', updated_at = now()
    from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id = p_case and b.loai = 'bo_tro_yeu'
      and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.diem_danh is null;
  update bo_tro_yeu set trang_thai = 'hoan_thanh', hoan_thanh_at = p_at, ket_qua = 'day_xong', dong_boi = p_ns, ghi_chu_dong = p_ghi_chu
    where id = p_case and trang_thai = 'dang_xu';
end $$;
revoke execute on function public._btyeu_ket_thuc_case(uuid, uuid, text, timestamptz) from public;
revoke execute on function public._btyeu_ket_thuc_case(uuid, uuid, text, timestamptz) from anon, authenticated;

-- fn_btyeu_hoan_tat(uuid,text,text,text,text[]) — TA hoàn tất ca mà em HẾT dạng cần dạy ⇒ KẾT THÚC case (không qua Chờ retest / Chờ đánh giá).
CREATE OR REPLACE FUNCTION public.fn_btyeu_hoan_tat(p_buoi uuid, p_nhan_xet text, p_muc_ma text DEFAULT NULL::text, p_khong_test_ly_do text DEFAULT NULL::text, p_dang_day text[] DEFAULT NULL::text[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_test_da_nop boolean; v_co_test boolean; v_nx text; v_day text[]; v_muc smallint;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if b.danh_gia_xong_at is not null then return; end if; -- idempotent
  select exists (select 1 from bai_test bt where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test'),
         exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop')
    into v_co_test, v_test_da_nop;
  if v_co_test and not v_test_da_nop and nullif(trim(coalesce(p_khong_test_ly_do, '')), '') is null then
    raise exception 'Em chưa làm bài kiểm tra cuối buổi — nhập lý do "không test" nếu em không làm.';
  end if;
  v_nx := nullif(trim(coalesce(p_nhan_xet, '')), '');
  if v_co_test and not v_test_da_nop then v_nx := concat_ws(E'\n', '[Không test: ' || trim(p_khong_test_ly_do) || ']', v_nx); end if;
  if v_nx is null and p_muc_ma is null then raise exception 'Nhập nhận xét hoặc chọn mức.'; end if;
  -- muc PHẢI khớp chữ số đầu của muc_ma (buoi_danh_gia_muc_ma_khop_muc_chk) — cùng công thức MUC_CATALOG bên client.
  v_muc := case when p_muc_ma is null then null else left(p_muc_ma, 1)::smallint end;

  -- Thùy 24/09: buổi xong ⇒ case phải tiến. p_dang_day = dạng TA xác nhận ĐÃ DẠY buổi này (null = client cũ ⇒ giữ hành vi cũ).
  if p_dang_day is not null then
    update bo_tro_yeu_dang set day_at = null, day_buoi_id = null -- TA bỏ tick dạng máy tự đánh dấu ở buổi này
      where bo_tro_yeu_id = b.bo_tro_yeu_id and day_buoi_id = p_buoi and dong_at is null and dat is null and not (ma_dang = any(p_dang_day));
    update bo_tro_yeu_dang set day_at = now(), day_buoi_id = p_buoi
      where bo_tro_yeu_id = b.bo_tro_yeu_id and day_at is null and dong_at is null and ma_dang = any(p_dang_day);
    update bo_tro_yeu_dang set dat = null -- retest trượt, dạy lại xong ⇒ chờ retest mới
      where bo_tro_yeu_id = b.bo_tro_yeu_id and dat = false and dong_at is null and ma_dang = any(p_dang_day);
    v_day := p_dang_day;
  else
    select coalesce(array_agg(ma_dang), '{}') into v_day from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and day_buoi_id = p_buoi;
  end if;

  insert into buoi_danh_gia (buoi_hoc_id, hoc_sinh_id, nhan_xet, muc, muc_ma, graded_by, updated_at)
    values (p_buoi, b.hoc_sinh_id, v_nx, v_muc, p_muc_ma, public.jwt_uid(), now())
    on conflict (buoi_hoc_id, hoc_sinh_id) do update set nhan_xet = excluded.nhan_xet, muc = excluded.muc, muc_ma = excluded.muc_ma, graded_by = excluded.graded_by, updated_at = now();
  update buoi_hoc set danh_gia_xong_at = now(), updated_at = now() where id = p_buoi;
  perform public._btyeu_bu_retest(p_buoi, v_day); -- mọi dạng vừa dạy đều có câu retest ⇒ không kẹt "Chờ retest"
  -- Thùy 29/09: bổ trợ yếu KẾT THÚC khi em hết dạng yếu + TA đóng ca. "Chờ đánh giá" là việc học thuật, luồng khác.
  if not public._btyeu_retest_bat() and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id)
     and not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)) then
    perform public._btyeu_ket_thuc_case(b.bo_tro_yeu_id, v_ns, 'Hết dạng yếu — TA đóng ca ' || to_char(b.ngay, 'DD/MM'), now());
  end if;
end $function$;

-- fn_btyeu_case_xep_lich(text) — Màn Xếp: hold ⇒ case còn mở luôn là "Đang bổ trợ" (kết thúc = đóng case lúc TA hoàn tất ca).
CREATE OR REPLACE FUNCTION public.fn_btyeu_case_xep_lich(p_mon text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(x order by x_ht desc nulls first, x_uu desc, x_tao), '[]'::jsonb) end
  from (
    select y.uu_tien as x_uu, y.created_at as x_tao, y.hoan_thanh_at as x_ht, jsonb_build_object(
      'id', y.id, 'hoc_sinh_id', y.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon,
      'nguon', y.nguon, 'ly_do', y.ly_do, 'created_at', y.created_at, 'uu_tien', y.uu_tien, 'trang_thai', y.trang_thai,
      'hoan_thanh_at', y.hoan_thanh_at, 'ket_qua', y.ket_qua,
      'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
      'vong', 1 + (with recursive ch as (select y.case_truoc_id as id union all select p.case_truoc_id from bo_tro_yeu p join ch on p.id = ch.id where p.case_truoc_id is not null)
                   select count(*) from ch where id is not null),
      'so_dang', dc.tong, 'so_dang_can_day', dc.can_day, 'so_dang_cho_retest', dc.cho_retest, 'so_dang_xong', dc.xong, 'so_dang_may', dc.may, 'so_dang_bao_dong', dc.bao_dong,
      'so_dang_chua_day', dc.can_day,
      'giai_doan', case when y.trang_thai = 'hoan_thanh' then 'hoan_thanh' when dc.can_day > 0 or not public._btyeu_retest_bat() then 'dang_bo_tro' when dc.cho_retest > 0 and public._btyeu_retest_bat() then 'cho_retest' else 'hoan_thanh' end,
      'so_buoi_da_hoc', bh.da_hoc, 'so_buoi_khong_dien_ra', bh.khong_dien_ra, 'khong_dien_ra_gan_nhat', bh.khong_dien_ra_gan_nhat,
      'buoi_cho_hoc', ch.j,
      'so_dang_moi_sau_xep', case when ch.xep_at is null then 0 else (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.created_at > ch.xep_at) end,
      'retest_ngay', (select min(t.ngay) filter (where public._btyeu_retest_bat()) from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon and t.trang_thai = 'mo'
                        and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop')
                        and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id))
    ) as x
    from bo_tro_yeu y
    join hoc_sinh hs on hs.id = y.hoc_sinh_id
    join lateral (
      select count(*) as tong,
             count(*) filter (where d.dong_at is null and (d.day_at is null or d.dat = false)) as can_day,
             count(*) filter (where d.dong_at is null and d.day_at is not null and d.dat is distinct from false) as cho_retest,
             count(*) filter (where d.dong_at is not null) as xong,
             count(*) filter (where d.nguon = 'may' and d.day_at is null) as may,
             count(*) filter (where d.nguon = 'bao_dong' and d.day_at is null) as bao_dong
      from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id
    ) dc on true
    join lateral (
      select count(*) filter (where b.trang_thai = 'hoan_tat' or b.danh_gia_xong_at is not null) as da_hoc,
             count(*) filter (where b.trang_thai = 'huy') as khong_dien_ra,
             max(b.ngay) filter (where b.trang_thai = 'huy') as khong_dien_ra_gan_nhat
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu'
    ) bh on true
    left join lateral (
      select b.created_at as xep_at, jsonb_build_object('buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc,
               'phong', b.phong, 'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'diem_danh', hh.diem_danh,
               'qua_ngay', b.ngay < (now() at time zone 'Asia/Ho_Chi_Minh')::date) as j
      from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      order by b.ngay limit 1
    ) ch on true
    where (p_mon is null or y.mon = p_mon) and (y.trang_thai = 'hoan_thanh' or (dc.tong > 0 and exists (select 1 from hs_level lv where lv.hoc_sinh_id = y.hoc_sinh_id and lv.mon = y.mon and lv.loai = 'kien_thuc' and lv.level >= 1))) -- Thùy 28/09: màn Xếp hiện L1/L2/L3, ẩn L0
  ) s
$function$;

-- fn_btyeu_trang_thai_ca(integer) — Trạng thái ca: hold ⇒ Chờ chọn dạng → Cần xếp → Đã xếp → Hoàn thành (không còn Chờ retest / Chờ đánh giá).
CREATE OR REPLACE FUNCTION public.fn_btyeu_trang_thai_ca(p_so_ngay_ht integer DEFAULT 60)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(s.x order by s.thu, s.uu desc, s.tao), '[]'::jsonb) end
  from (
    select array_position(array['cho_noi_dung','can_xep','da_xep','cho_retest','cho_danh_gia','hoan_thanh'], m.buoc) as thu, y.uu_tien as uu, y.created_at as tao,
      jsonb_build_object(
        'id', y.id, 'hoc_sinh_id', y.hoc_sinh_id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'mon', y.mon,
        'lop', (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1),
        'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
        'uu_tien', y.uu_tien, 'created_at', y.created_at, 'case_truoc_id', y.case_truoc_id, 'hoan_thanh_at', y.hoan_thanh_at, 'ket_qua', y.ket_qua,
        'so_dang', dc.tong, 'so_dang_can_day', dc.can_day, 'so_dang_cho_retest', dc.cho_retest, 'so_dang_xong', dc.xong,
        'buoi_cho_ngay', ch.ngay, 'buoi_cho_gio', ch.gio_bat_dau, 'buoi_cho_nguoi', ch.nguoi,
        'retest_ngay', (select min(t.ngay) filter (where public._btyeu_retest_bat()) from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon and t.trang_thai = 'mo'
                          and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop')
                          and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = y.id)),
        'buoc', m.buoc) as x
    from bo_tro_yeu y
    join hoc_sinh hs on hs.id = y.hoc_sinh_id
    cross join lateral (
      select count(*) as tong,
             count(*) filter (where d.dong_at is null and (d.day_at is null or d.dat = false)) as can_day,
             count(*) filter (where d.dong_at is null and d.day_at is not null and d.dat is distinct from false) as cho_retest,
             count(*) filter (where d.dong_at is not null) as xong
      from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id
    ) dc
    left join lateral (
      select b.ngay, b.gio_bat_dau, ns.ho_ten as nguoi from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
      order by b.ngay limit 1
    ) ch on true
    cross join lateral (select case
        when y.trang_thai = 'hoan_thanh' then 'hoan_thanh'
        when dc.tong = 0 then 'cho_noi_dung'
        when (dc.can_day > 0 or not public._btyeu_retest_bat()) and ch.ngay is null then 'can_xep'
        when dc.can_day > 0 or not public._btyeu_retest_bat() then 'da_xep'
        when dc.cho_retest > 0 and public._btyeu_retest_bat() then 'cho_retest'
        else 'cho_danh_gia' end as buoc) m
    where y.trang_thai = 'dang_xu' or y.hoan_thanh_at >= now() - make_interval(days => greatest(1, coalesce(p_so_ngay_ht, 60)))
  ) s
$function$;

-- fn_btyeu_ca_ta(uuid) — App TA: trả trạng thái case + số dạng còn phải dạy ⇒ hoàn tất xong báo "kết thúc bổ trợ" hay "còn N dạng".
CREATE OR REPLACE FUNCTION public.fn_btyeu_ca_ta(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare b record; v_bd text; v_cautbl text; v_cumtbl text; v_dangs jsonb; v_test jsonb; v_retest jsonb; v_dg jsonb; v_hs jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then return null; end if;
  v_bd := public._kho_ban_do_tbl(b.mon); v_cautbl := public._kho_cau_tbl(b.mon); v_cumtbl := public._kho_cum_tbl(v_cautbl);

  select jsonb_build_object('id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'khoi', h.khoi,
           'level', (select level from hs_level where hoc_sinh_id = h.id and mon = b.mon and loai = 'kien_thuc'))
    into v_hs from hoc_sinh h where h.id = b.hoc_sinh_id;

  execute format($q$
    with td as (select * from public._btyeu_tien_do($1))
    select coalesce(jsonb_agg(jsonb_build_object(
      'ma_dang', d.ma_dang, 'ten_dang', coalesce(bd.ten_dang, d.ma_dang), 'ten_chuyen_de', coalesce(bd.ten_chuyen_de, ''),
      'day_at', d.day_at, 'day_buoi_id', d.day_buoi_id, 'dong_at', d.dong_at, 'diem_luc_mo', d.diem_luc_mo,
      'retest_diem', d.retest_diem, 'retest_at', d.retest_at, 'dat', d.dat,
      'so_cau', coalesce((select sum(so_cau) from td where td.ma_dang = d.ma_dang), 0),
      'so_dung', coalesce((select sum(so_dung) from td where td.ma_dang = d.ma_dang), 0),
      'so_goi_y', coalesce((select sum(so_goi_y) from td where td.ma_dang = d.ma_dang), 0),
      'cau_cuoi_at', (select max(cau_cuoi_at) from td where td.ma_dang = d.ma_dang),
      'cums', coalesce((select jsonb_agg(jsonb_build_object(
          'ma_cum', td.ma_cum, 'ten', coalesce(c.ten, case when td.ma_cum is null then 'Cả dạng' else td.ma_cum end),
          'so_cau', td.so_cau, 'so_dung', td.so_dung, 'so_goi_y', td.so_goi_y, 'cau_cuoi_at', td.cau_cuoi_at) order by c.thu_tu nulls last)
        from td left join %2$I c on c.ma_cum = td.ma_cum where td.ma_dang = d.ma_dang), '[]'::jsonb)
    ) order by d.diem_luc_mo nulls last, d.created_at), '[]'::jsonb)
    from bo_tro_yeu_dang d left join %1$I bd on bd.ma_dang = d.ma_dang
    where d.bo_tro_yeu_id = $2
  $q$, v_bd, v_cumtbl) into v_dangs using p_buoi, b.bo_tro_yeu_id;

  -- Test cuối ca: điểm theo dạng (đã nộp) — chấm ở DB, app chỉ hiện.
  select jsonb_build_object('bai_test_id', bt.id, 'so_cau', bt.so_cau,
           'da_nop', bl.trang_thai = 'da_nop', 'nop_at', bl.nop_at,
           'theo_dang', coalesce((
             select jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'so_cau', x.n, 'so_dung', x.d))
             from (select btc.ma_dang, count(*) n, count(*) filter (where blc.verdict = 'correct') d
                   from bai_test_cau btc left join bai_lam_cau blc on blc.bai_test_cau_id = btc.id and blc.bai_lam_id = bl.id
                   where btc.bai_test_id = bt.id group by btc.ma_dang) x), '[]'::jsonb))
    into v_test
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' limit 1;

  select jsonb_build_object('bai_test_id', bt.id, 'ngay', bt.ngay, 'so_cau', bt.so_cau,
           'da_nop', coalesce(bl.trang_thai = 'da_nop', false), 'nop_at', bl.nop_at)
    into v_retest
  from bai_test bt left join bai_lam bl on bl.bai_test_id = bt.id
  where bt.buoi_hoc_id = p_buoi and bt.loai = 'retest' limit 1;

  select jsonb_build_object('nhan_xet', g.nhan_xet, 'muc_ma', g.muc_ma) into v_dg
    from buoi_danh_gia g where g.buoi_hoc_id = p_buoi and g.hoc_sinh_id = b.hoc_sinh_id;

  return jsonb_build_object(
    'buoi_id', b.buoi_id, 'mon', b.mon, 'ngay', b.ngay, 'trang_thai', b.trang_thai, 'diem_danh', b.diem_danh,
    'buoi_hoc_hs_id', b.buoi_hoc_hs_id, 'nguoi_day_tg', b.nguoi_day_tg, 'danh_gia_xong_at', b.danh_gia_xong_at,
    'bo_tro_yeu_id', b.bo_tro_yeu_id, 'hs', v_hs, 'dangs', v_dangs, 'test', v_test, 'retest', v_retest, 'danh_gia', v_dg,
    'case_trang_thai', (select y.trang_thai from bo_tro_yeu y where y.id = b.bo_tro_yeu_id),
    'case_ket_qua', (select y.ket_qua from bo_tro_yeu y where y.id = b.bo_tro_yeu_id),
    'so_dang_con_day', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = b.bo_tro_yeu_id and d.dong_at is null and (d.day_at is null or d.dat = false)),
    'so_lan_huy', (select count(*) from buoi_hoc_hs hh2 join buoi_hoc b2 on b2.id = hh2.buoi_hoc_id
                   where hh2.bo_tro_yeu_id = b.bo_tro_yeu_id and b2.trang_thai = 'huy'));
end $function$;

-- ĐÓNG HỒI TỐ: case đang mở, có dạng, hết dạng cần dạy, KHÔNG còn buổi dở, đã có ≥1 buổi TA đóng ca. Người đóng = tài khoản bấm hoàn tất buổi cuối
-- (buoi_danh_gia.graded_by → nhân sự); không lần ra thì để trống (không đoán).
do $$
declare r record; n integer := 0;
begin
  if public._btyeu_retest_bat() then return; end if;
  for r in
    select y.id, lb.buoi_id, lb.ngay, lb.dong_at,
           (select tk.nhan_su_id from buoi_danh_gia g join tai_khoan tk on tk.id = g.graded_by where g.buoi_hoc_id = lb.buoi_id and g.hoc_sinh_id = y.hoc_sinh_id) as ns
    from bo_tro_yeu y
    cross join lateral (select b.id as buoi_id, b.ngay, b.danh_gia_xong_at as dong_at from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                        where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.danh_gia_xong_at is not null
                        order by b.danh_gia_xong_at desc limit 1) lb
    where y.trang_thai = 'dang_xu'
      and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id)
      and not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false))
      and not exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                      where hh.bo_tro_yeu_id = y.id and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null)
  loop
    perform public._btyeu_ket_thuc_case(r.id, r.ns, 'Hết dạng yếu — TA đóng ca ' || to_char(r.ngay, 'DD/MM') || ' (đóng hồi tố 29/09 theo luật mới)', r.dong_at);
    n := n + 1;
  end loop;
  raise notice 'Đóng hồi tố % case bổ trợ yếu (hết dạng yếu + TA đã đóng ca).', n;
end $$;
