-- Thùy 28/09: (1) "Chỉnh sửa trạng thái bổ trợ — tuần trước kết luận em cần bổ trợ, nhưng em tự luyện hết yếu thì đổi trạng thái để KHÔNG phải xếp nữa."
--             ⇒ fn_btyeu_doi_level(case, level, lý do): đổi mức L0/L1/L2/L3 ngay trên card. Hạ L0 = dừng bổ trợ: đóng case (ket_qua 'bo', ghi chú lý do),
--               huỷ buổi đã xếp CHƯA HỌC, đóng bài retest chưa làm. Ghi hs_level_log như Duyệt (L0 = xoá dòng hs_level — §1.5, giống duyetLevel).
--               Đổi L1↔L2: cập nhật đơn vị của buổi đã xếp chưa học (L1 = 1 · L2 = 4).
--          (2) "Phần xếp bổ trợ luôn hiển thị L1 L2, L0 thì không có." ⇒ fn_btyeu_case_xep_lich + tab Yếu của fn_ca_bo_tro_ung_vien lọc level ∈ {1,2}.
--               (đo 28/09: case mở 125 L1 · 6 L2 · 1 L0 = HS test TEST QLHT 003.) Case đã Hoàn thành vẫn hiện ở tab Hoàn thành.
-- Hai hàm (2) dựng từ bản ĐANG CHẠY trên DB (pg_get_functiondef) — không dựng từ file cũ, tránh đè sửa của phiên khác.

CREATE OR REPLACE FUNCTION public.fn_ca_bo_tro_ung_vien(p_ca uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare c record; t record; v_con int; v_cho_hs int; v_phut int; v_out jsonb;
begin
  if not public.la_thanh_vien() then return '{}'::jsonb; end if;
  select * into c from ca_bo_tro where id = p_ca;
  if c.id is null then raise exception 'Không thấy ca.'; end if;
  select * into t from public._ca_bo_tro_tinh(p_ca);
  v_con := c.don_vi - t.don_vi_dung;
  v_cho_hs := 3 * c.so_ta - t.so_hs_xn;
  v_phut := (extract(epoch from (c.gio_ket_thuc - c.gio_bat_dau)) / 60)::int;

  with
  duoi as (
    select d.id as ref_id, d.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, d.created_at,
           (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai <> 'huy' and bb.danh_gia_xong_at is not null and x.diem_danh = 'co_mat') as da_hoc,
           (select count(*) from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null) as dang_cho,
           d.so_buoi_du_kien
    from bo_tro_duoi d join hoc_sinh hs on hs.id = d.hoc_sinh_id left join lop l on l.id = d.lop_id
    where d.trang_thai = 'can_duoi' and d.dang_duyet_at is not null and l.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_duoi_id = d.id and bb.trang_thai = 'mo' and bb.ngay = c.ngay)
  ),
  bu as (
    select hh.id as ref_id, hh.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, l.ten_lop as lop, l.id as lop_id, b.ngay as ngay_nghi
    from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id join lop l on l.id = b.lop_id join hoc_sinh hs on hs.id = hh.hoc_sinh_id
    where hh.diem_danh in ('vang', 'vang_phep') and b.loai = 'thuong' and b.trang_thai <> 'huy' and l.mon = c.mon and (c.khoi is null or l.khoi = c.khoi)
      and not exists (select 1 from bang_khong_bu k where k.buoi_hoc_hs_id = hh.id)
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                      where x.hoc_sinh_id = hh.hoc_sinh_id and x.bu_cho_buoi_id = hh.buoi_hoc_id and bb.trang_thai <> 'huy' and coalesce(x.diem_danh, '') not in ('vang', 'vang_phep'))
  ),
  yeu as (
    select y.id as ref_id, y.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi, y.uu_tien, y.created_at,
           (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop,
           (select l.id from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon limit 1) as lop_id,
           coalesce((select l.level from hs_level l where l.hoc_sinh_id = y.hoc_sinh_id and l.mon = y.mon and l.loai = 'kien_thuc'), 1) as level,
           (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false)) as so_dang
    from bo_tro_yeu y join hoc_sinh hs on hs.id = y.hoc_sinh_id
    where y.trang_thai = 'dang_xu' and y.mon = c.mon and (c.khoi is null or hs.khoi = c.khoi)
      and exists (select 1 from hs_level lv where lv.hoc_sinh_id = y.hoc_sinh_id and lv.mon = y.mon and lv.loai = 'kien_thuc' and lv.level in (1, 2)) -- Thùy 28/09: chỉ L1/L2 mới xếp; L0 = không bổ trợ, L3 = xếp riêng
      and exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null and (d.day_at is null or d.dat = false))
      and not exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id where x.bo_tro_yeu_id = y.id and bb.loai = 'bo_tro_yeu' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null)
  )
  select jsonb_build_object(
    'ca', jsonb_build_object('id', c.id, 'don_vi', c.don_vi, 'don_vi_dung', t.don_vi_dung, 'don_vi_cho', t.don_vi_cho, 'con', v_con, 'so_hs_xn', t.so_hs_xn, 'cho_hs', v_cho_hs, 'phut', v_phut),
    'duoi', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'duoi', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', case when da_hoc = 0 then 'CHƯA đuổi buổi nào' else 'đã đuổi ' || da_hoc || coalesce('/' || so_buoi_du_kien, '') end || ' · vào ' || to_char(created_at, 'DD/MM') || ' (' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - created_at::date) || ' ngày)',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'da_xep_ngay_khac', dang_cho > 0,
        'vua', v_con >= 4 and v_cho_hs > 0 and v_phut >= 60, 'ly_do_khong_vua', case when v_phut < 60 then 'Đuổi cần ca ≥60''' when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs <= 0 then 'đủ ' || 3 * c.so_ta || ' em' end
      ) order by (da_hoc = 0) desc, created_at), '[]'::jsonb) from duoi where so_buoi_du_kien is null or da_hoc + dang_cho < so_buoi_du_kien),
    'bu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'bu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', 4,
        'chi_tiet', 'nghỉ ' || to_char(ngay_nghi, 'DD/MM') || ' · ' || ((now() at time zone 'Asia/Ho_Chi_Minh')::date - ngay_nghi) || ' ngày chưa bù',
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'vua', v_con >= 4 and v_cho_hs > 0, 'ly_do_khong_vua', case when v_con < 4 then 'cần 4 · còn ' || v_con when v_cho_hs <= 0 then 'đủ ' || 3 * c.so_ta || ' em' end
      ) order by ngay_nghi, ho_ten), '[]'::jsonb) from bu),
    'yeu', (select coalesce(jsonb_agg(jsonb_build_object(
        'loai', 'yeu', 'ref_id', ref_id, 'hoc_sinh_id', hoc_sinh_id, 'ho_ten', ho_ten, 'ma_hs', ma_hs, 'khoi', khoi, 'lop', lop, 'don_vi', case when level <= 1 then 1 else 4 end,
        'chi_tiet', 'L' || level || ' · ưu tiên ' || case uu_tien when 3 then 'Cao' when 1 then 'Thấp' else 'Thường' end || ' · ' || so_dang || ' dạng cần dạy · mở ' || to_char(created_at, 'DD/MM'),
        'uu_tien', uu_tien, 'level', level,
        'ta_lop_id', public._ta_cua_lop(lop_id), 'ta_lop_ten', (select ho_ten from nhan_su where id = public._ta_cua_lop(lop_id)),
        'ta_dang_truc', public._ta_cua_lop(lop_id) in (c.nhan_su_id, c.nhan_su_2_id),
        'da_tung_bo_tro', public._ca_bo_tro_da_tung(hoc_sinh_id, c.lich_truc_id, c.ngay),
        'vua', v_con >= (case when level <= 1 then 1 else 4 end) and v_cho_hs > 0,
        'ly_do_khong_vua', case when v_cho_hs <= 0 then 'đủ ' || 3 * c.so_ta || ' em' when v_con < (case when level <= 1 then 1 else 4 end) then 'cần ' || (case when level <= 1 then 1 else 4 end) || ' · còn ' || v_con end
      ) order by uu_tien desc, created_at), '[]'::jsonb) from yeu)
  ) into v_out;
  return v_out;
end $function$;

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
      'giai_doan', case when y.trang_thai = 'hoan_thanh' then 'hoan_thanh' when dc.can_day > 0 then 'dang_bo_tro' when dc.cho_retest > 0 then 'cho_retest' else 'hoan_thanh' end,
      'so_buoi_da_hoc', bh.da_hoc, 'so_buoi_khong_dien_ra', bh.khong_dien_ra, 'khong_dien_ra_gan_nhat', bh.khong_dien_ra_gan_nhat,
      'buoi_cho_hoc', ch.j,
      'so_dang_moi_sau_xep', case when ch.xep_at is null then 0 else (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.created_at > ch.xep_at) end,
      'retest_ngay', (select min(t.ngay) from bai_test t where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and t.mon = y.mon and t.trang_thai = 'mo'
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
    where (p_mon is null or y.mon = p_mon) and (y.trang_thai = 'hoan_thanh' or (dc.tong > 0 and exists (select 1 from hs_level lv where lv.hoc_sinh_id = y.hoc_sinh_id and lv.mon = y.mon and lv.loai = 'kien_thuc' and lv.level in (1, 2)))) -- Thùy 28/09: màn Xếp chỉ L1/L2
  ) s
$function$;

create or replace function public.fn_btyeu_doi_level(p_case uuid, p_level integer, p_ly_do text default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare y record; v_cu integer; v_huy integer := 0; v_rt integer := 0; v_ly text := nullif(trim(coalesce(p_ly_do, '')), '');
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_level not in (0, 1, 2, 3) then raise exception 'Mức phải là 0–3.'; end if;
  select * into y from bo_tro_yeu where id = p_case;
  if y.id is null then raise exception 'Không thấy case.'; end if;
  if y.trang_thai <> 'dang_xu' then raise exception 'Case đã đóng — không đổi mức được.'; end if;
  select coalesce((select level from hs_level where hoc_sinh_id = y.hoc_sinh_id and mon = y.mon and loai = 'kien_thuc'), 0) into v_cu;
  if p_level = v_cu then return jsonb_build_object('level', v_cu, 'khong_doi', true); end if;
  if p_level = 0 and exists (select 1 from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
                             where hh.bo_tro_yeu_id = p_case and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.diem_danh = 'co_mat') then
    raise exception 'Em đang có ca đã điểm danh có mặt mà chưa đóng — TA hoàn tất ca đó trước rồi mới hạ L0.';
  end if;

  -- Log TRƯỚC (bằng chứng) — cùng khuôn duyetLevel (src/lib/danhgia.ts)
  insert into hs_level_log (hoc_sinh_id, mon, loai, level_cu, level_may_de_xuat, ly_do_may, level_chot, ly_do_nguoi, actor)
    values (y.hoc_sinh_id, y.mon, 'kien_thuc', v_cu, null, jsonb_build_object('nguon', 'doi_level_case', 'case_id', p_case), p_level,
            coalesce(v_ly, case when p_level = 0 then 'Hạ L0 — hết yếu, dừng bổ trợ' else 'Đổi mức bổ trợ' end), public.jwt_uid());
  if p_level = 0 then
    delete from hs_level where hoc_sinh_id = y.hoc_sinh_id and mon = y.mon and loai = 'kien_thuc'; -- L0 = không có dòng (§1.5)
    update buoi_hoc b set trang_thai = 'huy', ly_do_huy = 'Hạ L0 — dừng bổ trợ' || coalesce(': ' || v_ly, ''), updated_at = now()
      from buoi_hoc_hs hh where hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id = p_case and b.loai = 'bo_tro_yeu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null
        and hh.diem_danh is null;
    get diagnostics v_huy = row_count;
    update bai_test t set trang_thai = 'dong', dong_at = now()
      where t.loai = 'retest' and t.trang_thai = 'mo' and t.hoc_sinh_id = y.hoc_sinh_id
        and exists (select 1 from buoi_hoc_hs hh where hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = p_case)
        and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop');
    get diagnostics v_rt = row_count;
    update bo_tro_yeu set trang_thai = 'hoan_thanh', hoan_thanh_at = now(), ket_qua = 'bo',
      ghi_chu_dong = concat_ws(' — ', 'Hạ L0 (hết yếu, dừng bổ trợ)', v_ly) where id = p_case;
  else
    insert into hs_level (hoc_sinh_id, mon, loai, level, updated_at) values (y.hoc_sinh_id, y.mon, 'kien_thuc', p_level, now())
      on conflict (hoc_sinh_id, mon, loai) do update set level = excluded.level, updated_at = now();
    -- đơn vị của buổi đã xếp chưa học theo mức mới (L1 = 1 · L2+ = 4)
    update buoi_hoc_hs hh set don_vi = public._ca_bo_tro_don_vi('yeu', y.hoc_sinh_id, y.mon)
      from buoi_hoc b where b.id = hh.buoi_hoc_id and hh.bo_tro_yeu_id = p_case and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and hh.don_vi is not null;
  end if;
  return jsonb_build_object('level_cu', v_cu, 'level', p_level, 'buoi_huy', v_huy, 'retest_dong', v_rt, 'dong_case', p_level = 0);
end $$;
grant execute on function public.fn_btyeu_doi_level(uuid, integer, text) to authenticated;
